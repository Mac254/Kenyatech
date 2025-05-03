document.addEventListener('DOMContentLoaded', () => {
    // Hamburger Menu
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navMenu = document.querySelector('#nav-menu');

    hamburger.addEventListener('click', () => {
        const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.setAttribute('aria-expanded', !isExpanded);
        navLinks.classList.toggle('active');

        // Trap focus within menu when open
        if (!isExpanded) {
            navMenu.focus();
        }
    });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });

    // Keyboard navigation for menu
    navMenu.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            hamburger.focus();
        }
    });

    // Scroll Animations
    const sections = document.querySelectorAll('section');
    const cards = document.querySelectorAll('.service-card, .product-card, .testimonial');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Stagger card animations
                if (entry.target.classList.contains('service-card') || 
                    entry.target.classList.contains('product-card') || 
                    entry.target.classList.contains('testimonial')) {
                    entry.target.style.transitionDelay = `${index * 0.1}s`;
                }
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => {
        section.classList.add('section-hidden');
        observer.observe(section);
    });

    cards.forEach(card => {
        card.classList.add('section-hidden');
        observer.observe(card);
    });

    // Product Slider
    const slider = document.querySelector('.products-slider');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dotsContainer = document.querySelector('#dots-container');
    const productCards = document.querySelectorAll('.product-card');
    let currentIndex = 0;
    let autoSlide;
    let touchStartX = 0;

    // Dynamically create dots based on number of product cards
    productCards.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.className = 'dot';
        dot.setAttribute('aria-label', `Go to product slide ${index + 1}`);
        dot.setAttribute('tabindex', '0');
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');

    function updateSlider() {
        const cardWidth = slider.querySelector('.product-card').offsetWidth + 32; // Include gap
        slider.scrollTo({
            left: currentIndex * cardWidth,
            behavior: 'smooth'
        });
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
        // Add brand color transition effect
        slider.style.transition = 'background 0.3s ease-in-out';
        slider.style.background = `linear-gradient(45deg, #005B8F, #F4A261, transparent)`;
        setTimeout(() => {
            slider.style.background = 'transparent';
        }, 300);
        // Update ARIA live region
        slider.setAttribute('aria-label', `Showing product slide ${currentIndex + 1} of ${productCards.length}`);
    }

    function startAutoSlide() {
        autoSlide = setInterval(() => {
            currentIndex = (currentIndex + 1) % productCards.length;
            updateSlider();
        }, 5000);
    }

    function stopAutoSlide() {
        clearInterval(autoSlide);
    }

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
            stopAutoSlide();
            startAutoSlide();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentIndex < productCards.length - 1) {
            currentIndex++;
            updateSlider();
            stopAutoSlide();
            startAutoSlide();
        }
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateSlider();
            stopAutoSlide();
            startAutoSlide();
        });
        // Keyboard navigation for dots
        dot.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                currentIndex = index;
                updateSlider();
                stopAutoSlide();
                startAutoSlide();
            }
        });
    });

    // Swipe gestures for mobile
    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        stopAutoSlide();
    });

    slider.addEventListener('touchmove', (e) => {
        const touchEndX = e.touches[0].clientX;
        const diff = touchStartX - touchEndX;
        if (diff > 50 && currentIndex < productCards.length - 1) {
            currentIndex++;
            updateSlider();
            startAutoSlide();
        } else if (diff < -50 && currentIndex > 0) {
            currentIndex--;
            updateSlider();
            startAutoSlide();
        }
    });

    // Pause autoplay on hover
    slider.addEventListener('mouseover', stopAutoSlide);
    slider.addEventListener('mouseout', startAutoSlide);

    // Start autoplay
    startAutoSlide();

    // Update slider on window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(updateSlider, 100);
    });

    // Add "View All Products" button
    const viewAllBtn = document.createElement('a');
    viewAllBtn.className = 'cta-button';
    viewAllBtn.href = '/products';
    viewAllBtn.textContent = 'View All Products';
    viewAllBtn.style.cssText = 'margin-top: var(--space-lg); display: block; text-align: center;';
    viewAllBtn.setAttribute('aria-label', 'View all KenyaTech products');
    document.querySelector('.slider-controls').appendChild(viewAllBtn);

    // Contact Form Validation
    const contactForm = document.querySelector('.contact-form');
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.querySelector('#name').value.trim();
        const email = document.querySelector('#email').value.trim();
        const message = document.querySelector('#message').value.trim();

        if (name && email && message) {
            alert('Form submitted successfully!'); // Replace with actual form submission logic
            contactForm.reset();
        } else {
            alert('Please fill in all required fields.');
        }
    });

    // Dark Mode Toggle
    const darkModeToggle = document.createElement('button');
    darkModeToggle.className = 'dark-mode-toggle';
    darkModeToggle.innerHTML = '🌙';
    darkModeToggle.setAttribute('aria-label', 'Toggle dark mode');
    document.querySelector('nav').appendChild(darkModeToggle);

    darkModeToggle.addEventListener('click', () => {
        document.body.dataset.theme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
        darkModeToggle.innerHTML = document.body.dataset.theme === 'dark' ? '☀️' : '🌙';
        localStorage.setItem('theme', document.body.dataset.theme);
    });

    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.dataset.theme = savedTheme;
        darkModeToggle.innerHTML = savedTheme === 'dark' ? '☀️' : '🌙';
    }
});