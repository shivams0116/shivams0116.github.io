// ============================================================
// SHIVAM SHRIVASTAVA PORTFOLIO — JAVASCRIPT
// Apple Light Interactive Controller
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking a nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Navbar Scroll Shadow / Blur enhancement
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });

    // Active Section Tracking on Scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const updateActiveNav = () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 120;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === '#' + currentSectionId || href === currentSectionId) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', updateActiveNav, { passive: true });

    // Number Counter Animation for Stats
    const statNumbers = document.querySelectorAll('.stat-number');
    let hasAnimatedStats = false;

    const animateNumber = (element) => {
        const text = element.textContent.trim();
        const target = parseInt(text.replace(/\D/g, ''), 10);
        if (isNaN(target)) return;

        const hasPlus = text.includes('+');
        const duration = 1400;
        const startTime = performance.now();

        const updateCount = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(target * easeOut);

            element.textContent = current + (hasPlus ? '+' : '');

            if (progress < 1) {
                requestAnimationFrame(updateCount);
            } else {
                element.textContent = target + (hasPlus ? '+' : '');
            }
        };

        requestAnimationFrame(updateCount);
    };

    // Intersection Observer for Stats
    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimatedStats) {
                hasAnimatedStats = true;
                statNumbers.forEach(stat => animateNumber(stat));
                observer.disconnect();
            }
        });
    }, { threshold: 0.3 });

    const statsContainer = document.querySelector('.hero-stats');
    if (statsContainer) {
        statsObserver.observe(statsContainer);
    }

    // Smooth Scroll for Internal Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const navHeight = navbar ? navbar.offsetHeight : 52;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});
