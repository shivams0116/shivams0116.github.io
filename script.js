// Mobile Menu Toggle (safe guards for multipage)
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Scroll Animation Observer
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Animate skill bars when visible
            if (entry.target.classList.contains('skill-category') || 
                entry.target.querySelector('.skill-progress')) {
                animateSkillBars(entry.target);
            }
            
            // Animate stats counter when visible
            if (entry.target.classList.contains('stat')) {
                animateCounter(entry.target);
            }
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
});

// Animate Skill Bars
function animateSkillBars(container) {
    const skillBars = container.querySelectorAll('.skill-progress');
    skillBars.forEach(bar => {
        const width = bar.getAttribute('data-width');
        setTimeout(() => {
            bar.style.width = width + '%';
        }, 200);
    });
}

// Animate Counter Numbers
function animateCounter(element) {
    const counter = element.querySelector('.stat-number');
    const target = parseInt(counter.getAttribute('data-target'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
        current += step;
        if (current < target) {
            counter.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            counter.textContent = target;
        }
    };

    updateCounter();
}

// Navbar Background on Scroll
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.style.background = 'rgba(26, 26, 46, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'rgba(26, 26, 46, 0.95)';
        navbar.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
});

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Typing Effect for Hero Subtitle (guarded)
const heroSubtitle = document.querySelector('.hero-subtitle');
if (heroSubtitle) {
    const text = heroSubtitle.textContent;
    heroSubtitle.textContent = '';
    heroSubtitle.style.opacity = '1';

    let i = 0;
    function typeWriter() {
        if (i < text.length) {
            heroSubtitle.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        }
    }

    // Start typing effect after a delay
    setTimeout(typeWriter, 1200);
}

// Parallax Effect for Hero (guarded)
const heroAnimation = document.querySelector('.hero-animation');
if (heroAnimation) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        if (scrolled < window.innerHeight) {
            heroAnimation.style.transform = 'translateY(' + (scrolled * 0.3) + 'px)';
            heroAnimation.style.opacity = (1 - scrolled / window.innerHeight).toString();
        }
    });
}

// Add hover effect to project cards
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Form Submission Handler (guarded)
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        
        // Simple validation
        if (name && email && message) {
            // Show success message (in a real app, you'd send this to a server)
            alert('Thank you for your message! I will get back to you soon.');
            contactForm.reset();
        }
    });
}

// Add active state to navigation based on scroll position
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

// Add some floating particles in the background
function createParticle() {
    const particle = document.createElement('div');
    particle.style.cssText = `
        position: fixed;
        width: 4px;
        height: 4px;
        background: #f39c12;
        border-radius: 50%;
        pointer-events: none;
        opacity: 0.3;
        z-index: 0;
    `;
    
    particle.style.left = Math.random() * window.innerWidth + 'px';
    particle.style.top = window.innerHeight + 'px';
    
    document.body.appendChild(particle);
    
    const duration = Math.random() * 3000 + 5000;
    const drift = (Math.random() - 0.5) * 200;
    
    const anim = particle.animate([
        {
            transform: 'translateY(0) translateX(0)',
            opacity: 0.3
        },
        {
            transform: 'translateY(-' + (window.innerHeight + 100) + 'px) translateX(' + drift + 'px)',
            opacity: 0
        }
    ], {
        duration: duration,
        easing: 'linear'
    });
    
    anim.onfinish = () => particle.remove();
}

// Create particles periodically
setInterval(createParticle, 500);

// Console welcome message
console.log('%c Welcome to my Portfolio! ', 'background: #f39c12; color: #1a1a2e; font-size: 20px; font-weight: bold; padding: 10px;');
console.log('%c Built with JavaScript & Love ', 'background: #2c3e50; color: #f39c12; font-size: 14px; padding: 5px;');
