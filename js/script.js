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

        // Inicialización
        setTimeout(() => {
            updateCarousel(false);
        }, 100);

        window.addEventListener('resize', () => updateCarousel(false));
    }

    // --- LÓGICA DEL FORMULARIO DE CONTACTO ---
    const form = document.getElementById('contact-form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault(); // Evita que la página se recargue

            const formData = new FormData(form);
            const button = form.querySelector('button[type="submit"]');
            
            // Añade un span para el spinner si no existe
            if (!button.querySelector('.spinner')) {
                const spinner = document.createElement('span');
                spinner.className = 'spinner';
                button.appendChild(spinner);
            }

            // Inicia la animación
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
                    // Si el envío es exitoso, redirige a la página de "gracias"
                    window.location.href = form.querySelector('[name="_next"]').value;
                } else {
                    // Si hay un error, lo muestra y restaura el botón
                    response.json().then(data => {
                        console.error('Error del servidor:', data);
                        alert('Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo.');
                        button.classList.remove('sending');
                        button.disabled = false;
                    });
                }
            })
            .catch(error => {
                // Si hay un error de red, lo muestra y restaura el botón
                console.error('Error de red:', error);
                alert('No se pudo enviar el mensaje. Revisa tu conexión a internet.');
                button.classList.remove('sending');
                button.disabled = false;
            });
        });
    }
});