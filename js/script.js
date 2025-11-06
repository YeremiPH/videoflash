document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.testimonials-carousel');
    const container = document.getElementById('testimonials-container');
    const prevBtn = document.getElementById('prev-testimonial');
    const nextBtn = document.getElementById('next-testimonial');

    if (container && prevBtn && nextBtn) {
        const originalCards = Array.from(container.children);
        const cardCount = originalCards.length;
        
        // --- Lógica de clonación para el bucle infinito ---
        // Clonamos las últimas 2 tarjetas al principio y las primeras 2 al final
        const clonesForStart = originalCards.slice(-2).map(card => card.cloneNode(true));
        const clonesForEnd = originalCards.slice(0, 2).map(card => card.cloneNode(true));
        
        clonesForStart.reverse().forEach(clone => container.insertBefore(clone, container.firstChild));
        clonesForEnd.forEach(clone => container.appendChild(clone));

        const allCards = Array.from(container.children);
        let currentIndex = 2; // Empezamos en la primera tarjeta "real"

        function updateCarousel(animate = true) {
            if (animate) {
                container.classList.add('transition-on');
            } else {
                container.classList.remove('transition-on');
            }

            const cardWidth = originalCards[0].offsetWidth;
            const margin = 15;
            const totalCardWidth = cardWidth + (margin * 2);
            const carouselWidth = carousel.offsetWidth;
            
            const offset = (carouselWidth / 2) - (totalCardWidth / 2) - (currentIndex * totalCardWidth);
            container.style.transform = `translateX(${offset}px)`;

            allCards.forEach((card, index) => {
                // La clase 'active' se basa en el índice real, no en el de los clones
                const realIndex = (index - 2 + cardCount) % cardCount;
                const activeRealIndex = (currentIndex - 2 + cardCount) % cardCount;
                card.classList.toggle('active', realIndex === activeRealIndex);
            });
        }

        function shiftSlide(direction) {
            currentIndex += direction;
            updateCarousel();

            // --- Lógica de salto para el bucle ---
            if (currentIndex === 0) { // Si llegamos al primer clon (desde la izquierda)
                setTimeout(() => {
                    currentIndex = cardCount; // Saltamos a la última tarjeta real
                    updateCarousel(false);
                }, 500); // Debe coincidir con la duración de la transición
            } else if (currentIndex === cardCount + 2) { // Si llegamos al último clon (desde la derecha)
                setTimeout(() => {
                    currentIndex = 2; // Saltamos a la primera tarjeta real
                    updateCarousel(false);
                }, 500);
            }
        }

        nextBtn.addEventListener('click', () => shiftSlide(1));
        prevBtn.addEventListener('click', () => shiftSlide(-1));

        /* --- INICIO DEL CÓDIGO PARA AUTO-SCROLL --- */

        const AUTO_SCROLL_INTERVAL = 5000; // 5 segundos, puedes cambiarlo
        let autoScrollTimer;

        const startAutoScroll = () => {
            // Limpiamos cualquier temporizador anterior para evitar que se acelere
            clearInterval(autoScrollTimer);
            autoScrollTimer = setInterval(() => {
                shiftSlide(1); // Usamos la función existente para mover al siguiente
            }, AUTO_SCROLL_INTERVAL);
        };

        const stopAutoScroll = () => {
            clearInterval(autoScrollTimer);
        };

        // Reiniciamos el temporizador si el usuario navega manualmente
        nextBtn.addEventListener('click', () => {
            stopAutoScroll();
            startAutoScroll();
        });
        prevBtn.addEventListener('click', () => {
            stopAutoScroll();
            startAutoScroll();
        });

        // Pausamos el carrusel cuando el ratón está encima
        carousel.addEventListener('mouseenter', stopAutoScroll);
        // Reanudamos el carrusel cuando el ratón se va
        carousel.addEventListener('mouseleave', startAutoScroll);

        // Iniciar el carrusel automático al cargar la página
        startAutoScroll();

        /* --- FIN DEL CÓDIGO PARA AUTO-SCROLL --- */

        // Inicialización
        setTimeout(() => {
            updateCarousel(false);
        }, 100);

        window.addEventListener('resize', () => updateCarousel(false));
    }

    // --- LÓGICA DEL FORMULARIO DE CONTACTO (ACTUALIZADA) ---
    const form = document.getElementById('contact-form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(form);
            const button = form.querySelector('button[type="submit"]');
            const originalButtonText = button.innerHTML;
            
            if (!button.querySelector('.spinner')) {
                const spinner = document.createElement('span');
                spinner.className = 'spinner';
                button.appendChild(spinner);
            }

            button.classList.add('sending');
            button.disabled = true;

            const endpoint = 'https://formsubmit.co/videoflashcusco@gmail.com';

            fetch(endpoint, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    // Éxito: Transforma el botón en un check
                    form.reset();
                    button.classList.remove('sending');
                    button.classList.add('success');
                    button.innerHTML = '✓'; // Muestra el check

                    // Restaura el botón después de 3 segundos
                    setTimeout(() => {
                        button.classList.remove('success');
                        button.innerHTML = originalButtonText;
                        button.disabled = false;
                    }, 3000);

                } else {
                    throw new Error('Hubo un problema con la respuesta del servidor.');
                }
            })
            .catch(error => {
                console.error('Error al enviar el formulario:', error);
                alert('No se pudo enviar el mensaje. Por favor, inténtalo de nuevo.');
                // Restaura el botón en caso de error
                button.classList.remove('sending');
                button.innerHTML = originalButtonText;
                button.disabled = false;
            });
        });
    }

    // --- LÓGICA PARA EL MENÚ MÓVIL ---
    const navToggle = document.querySelector('.nav-toggle');
    const body = document.body;
    const navLinks = document.querySelectorAll('.main-nav a');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            body.classList.toggle('nav-open');
        });
    }

    // Cierra el menú al hacer clic en un enlace
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            body.classList.remove('nav-open');
        });
    });
});