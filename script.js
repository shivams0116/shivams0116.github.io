// ============================================================
// SHIVAM SHRIVASTAVA PORTFOLIO — JAVASCRIPT
// Interactive Effects, Scroll Spy, Modal & Animations
// Inspired by Reference Portfolio Architecture
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

    /* -------------------------------------------------------
       1. MOBILE MENU TOGGLE
    ------------------------------------------------------- */
    const hamburger = document.querySelector('.hamburger');
    const navMenu   = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    /* -------------------------------------------------------
       2. NAVBAR SCROLLED STATE
    ------------------------------------------------------- */
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 30) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });

    /* -------------------------------------------------------
       3. ACTIVE NAV LINK ON SCROLL
    ------------------------------------------------------- */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const updateActiveNav = () => {
        let current = '';
        const scrollPosition = window.scrollY + 140;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === '#' + current || href === current) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', updateActiveNav, { passive: true });

    /* -------------------------------------------------------
       4. ANIMATED NUMBER COUNTERS (Hero Stats)
    ------------------------------------------------------- */
    const statNumbers = document.querySelectorAll('.stat-number');
    let hasAnimatedStats = false;

    const animateNumber = (element) => {
        const text = element.textContent.trim();
        const target = parseInt(text.replace(/\D/g, ''), 10);
        if (isNaN(target)) return;

        const hasPlus = text.includes('+');
        const duration = 1600;
        const startTime = performance.now();

        const updateCount = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
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

    /* -------------------------------------------------------
       5. SELECTED PROJECTS MODAL POPUP
    ------------------------------------------------------- */
    const openModalBtn  = document.getElementById('btn-open-projects-modal');
    const closeModalBtn = document.getElementById('btn-close-projects-modal');
    const projectsModal = document.getElementById('projects-modal');

    const openModal = () => {
        if (projectsModal) {
            projectsModal.classList.add('active');
            projectsModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }
    };

    const closeModal = () => {
        if (projectsModal) {
            projectsModal.classList.remove('active');
            projectsModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    };

    if (openModalBtn) {
        openModalBtn.addEventListener('click', openModal);
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    if (projectsModal) {
        projectsModal.addEventListener('click', (e) => {
            if (e.target === projectsModal) {
                closeModal();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && projectsModal && projectsModal.classList.contains('active')) {
            closeModal();
        }
    });

    /* -------------------------------------------------------
       6. SMOOTH SCROLL FOR ANCHOR LINKS
    ------------------------------------------------------- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const navHeight = navbar ? navbar.offsetHeight : 70;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* -------------------------------------------------------
       7. SUBTLE CARD 3D TILT EFFECT
    ------------------------------------------------------- */
    const tiltCards = document.querySelectorAll('.skill-card, .about-edu-card, .project-card, .modal-project-card');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width  - 0.5;
            const y = (e.clientY - rect.top)  / rect.height - 0.5;
            card.style.transform = `translateY(-6px) perspective(700px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

});
