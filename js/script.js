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
    const dots = document.querySelectorAll('.dot');
    let currentIndex = 0;

    function updateSlider() {
        const cardWidth = slider.querySelector('.product-card').offsetWidth + 32; // Include gap
        slider.scrollTo({
            left: currentIndex * cardWidth,
            behavior: 'smooth'
        });
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentIndex < dots.length - 1) {
            currentIndex++;
            updateSlider();
        }
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateSlider();
        });
    });

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