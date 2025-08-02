document.addEventListener('DOMContentLoaded', function() {
    // ======================
    // Mobile Menu Functionality
    // ======================
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navList = document.querySelector('.nav-list');
    const menuIcons = {
        menu: document.querySelector('.menu-icon'),
        close: document.querySelector('.close-icon')
    };
    const navItems = document.querySelectorAll('.nav-list li');
    const navLinks = document.querySelectorAll('.nav-list a');

    const toggleMenu = (isOpen) => {
        // Only apply mobile menu styles if in mobile view (screen width <= 768px)
        if (window.innerWidth <= 768) {
            navList.classList.toggle('active', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : ''; // Control body overflow only when the menu is open

            navItems.forEach((item, index) => {
                item.style.transitionDelay = isOpen ? `${index * 0.1}s` : '0s';
                item.style.opacity = isOpen ? '1' : '0';
                item.style.transform = isOpen ? 'translateX(0)' : 'translateX(-20px)';
            });

            menuIcons.menu.style.opacity = isOpen ? '0' : '1';
            menuIcons.close.style.opacity = isOpen ? '1' : '0';
        } else {
            // If it's desktop view, ensure mobile menu styles are reset
            navList.classList.remove('active');
            document.body.style.overflow = '';
            navItems.forEach(item => {
                item.style.opacity = ''; // Reset opacity
                item.style.transform = ''; // Reset transform
                item.style.transitionDelay = ''; // Reset transition delay
            });
        }
    };

    menuToggle.addEventListener('click', () => {
        // Only toggle if in mobile view
        if (window.innerWidth <= 768) {
            toggleMenu(!navList.classList.contains('active'));
        }
    });

    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Only close the menu on click if it's a mobile menu (screen width <= 768px)
            if (window.innerWidth <= 768) {
                toggleMenu(false);
            }
        });
    });

    // Handle screen resize to reset menu state if it crosses the breakpoint
    let isMobileView = window.innerWidth <= 768;
    window.addEventListener('resize', () => {
        const newIsMobileView = window.innerWidth <= 768;
        if (isMobileView !== newIsMobileView) {
            // If we cross the breakpoint, ensure menu is closed and body overflow is reset
            if (!newIsMobileView) { // If resized to desktop view
                toggleMenu(false); // Ensure mobile menu is closed and styles reset
            } else { // If resized to mobile view
                // No action needed here usually, as desktop menu elements would naturally hide
                // and mobile menu remains hidden until activated by user
            }
            isMobileView = newIsMobileView;
        }
        // Also call toggleMenu to ensure correct state if just resizing within mobile or desktop
        // but without actually changing the 'active' class based on menu toggle.
        // This makes sure desktop styles are always active when above 768px.
        toggleMenu(navList.classList.contains('active')); 
    });

    // Run toggleMenu once on load to ensure initial state is correct for current screen size
    toggleMenu(navList.classList.contains('active')); // Pass current state or false for initial clean

    // ======================
    // Carousel Functionality
    // ======================
    const initCarousel = () => {
        const carousel = document.querySelector('.carousel-container');
        const slides = document.querySelectorAll('.carousel-slide');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;
        let intervalId;
        let isAutoPlaying = true;

        if (!carousel || !slides.length) return; // Add a check to ensure elements exist

        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('carousel-dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll('.carousel-dot');

        const updateCarousel = () => {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;

            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        };

        const goToSlide = (index) => {
            currentIndex = index;
            updateCarousel();
            resetInterval();
        };

        const nextSlide = () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        };

        const prevSlide = () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
        };

        const startInterval = () => {
            if (isAutoPlaying) {
                intervalId = setInterval(nextSlide, 5000);
            }
        };

        const resetInterval = () => {
            clearInterval(intervalId);
            startInterval();
        };

        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetInterval();
        });

        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetInterval();
        });

        const carouselWrapper = document.querySelector('.mockup-carousel');
        if (carouselWrapper) { // Check if wrapper exists
            carouselWrapper.addEventListener('mouseenter', () => {
                clearInterval(intervalId);
                isAutoPlaying = false;
            });

            carouselWrapper.addEventListener('mouseleave', () => {
                isAutoPlaying = true;
                startInterval();
            });
        }
        
        startInterval();
    };

    initCarousel();

    // ======================
    // Team Photo Hover Effects
    // ======================
    const teamPhotos = document.querySelectorAll('.team-photo');
    teamPhotos.forEach(photo => {
        photo.addEventListener('mouseenter', () => {
            photo.style.transform = 'scale(1.05)';
            photo.style.transition = 'transform 0.3s ease';
        });

        photo.addEventListener('mouseleave', () => {
            photo.style.transform = 'scale(1)';
        });
    });

    // ======================
    // Smooth Scrolling
    // ======================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();

                // Only close menu if it's the mobile menu and open
                if (window.innerWidth <= 768 && navList.classList.contains('active')) {
                    toggleMenu(false);
                }

                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Adjust for fixed header height
                    behavior: 'smooth'
                });
            }
        });
    });

    // ======================
    // Scroll Animations
    // ======================
    const initScrollAnimations = () => {
        const animateElements = document.querySelectorAll('[data-animate]');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animateElements.forEach(el => observer.observe(el));
    };

    initScrollAnimations();

    // ======================
    // Additional Interactive Elements
    // ======================
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '';
        });
    });

    // ======================
    // DYNAMIC LIGHT RAY AND SPARKLE GENERATION (Positioning fixed, intensity further reduced)
    // ======================

    const body = document.body;

    function createLightEffect(type) {
        const effect = document.createElement('div');
        effect.classList.add(type === 'ray' ? 'light-ray' : 'sparkle');

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Generate random positions within the viewport
        const randomX = Math.random() * viewportWidth;
        const randomY = Math.random() * viewportHeight;

        effect.style.left = `${randomX}px`;
        effect.style.top = `${randomY}px`;

        const animationDelay = Math.random() * 12; // Increased delay range (0-12s)
        let animationDuration;
        if (type === 'ray') {
            animationDuration = 20 + Math.random() * 10; // 20-30s (increased)
        } else {
            animationDuration = 4 + Math.random() * 4; // 4-8s (increased)
        }

        effect.style.animationDelay = `${animationDelay}s`;
        effect.style.animationDuration = `${animationDuration}s`;

        body.appendChild(effect);

        effect.addEventListener('animationend', () => {
            effect.remove();
        });
    }

    function generateLightEffects() {
        // Reduced max rays and sparkles for less visual clutter and performance
        setInterval(() => {
            if (document.querySelectorAll('.light-ray').length < 3) { // Even fewer max rays
                createLightEffect('ray');
            }
        }, 4000); // Increased interval for rays

        setInterval(() => {
            if (document.querySelectorAll('.sparkle').length < 8) { // Even fewer max sparkles
                createLightEffect('sparkle');
            }
        }, 800); // Increased interval for sparkles
    }

    generateLightEffects();
});