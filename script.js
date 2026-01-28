// ============================================
// SĂN STYLE — Landing Page Scripts
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initSmoothScroll();
    initFormSubmission();
    initScrollAnimations();
    initNavBackground();
});

// Smooth scroll for anchor links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = document.querySelector('.nav').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Form submission handling
function initFormSubmission() {
    const form = document.getElementById('signupForm');
    const modal = document.getElementById('successModal');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            // Collect checkbox values
            const interests = formData.getAll('interest');
            data.interests = interests;

            // Here you would typically send to your backend
            // For now, we'll simulate success and log data
            console.log('Form submission:', data);

            // Show success modal
            showModal();

            // Reset form
            form.reset();
        });
    }
}

// Modal functions
function showModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Close modal on backdrop click
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-backdrop')) {
        closeModal();
    }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Scroll-triggered animations using Intersection Observer
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements that should animate on scroll
    const animatedElements = document.querySelectorAll(
        '.why-card, .process-step, .pricing-card, .about-content > *, .form-container'
    );

    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// Navigation background on scroll
function initNavBackground() {
    const nav = document.querySelector('.nav');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            nav.style.background = 'rgba(250, 248, 245, 0.95)';
            nav.style.boxShadow = '0 2px 20px rgba(44, 40, 37, 0.05)';
        } else {
            nav.style.background = 'linear-gradient(to bottom, var(--color-cream), transparent)';
            nav.style.boxShadow = 'none';
        }

        lastScroll = currentScroll;
    });
}

// Parallax effect for hero (subtle)
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroVisual = document.querySelector('.hero-visual');

    if (heroVisual && scrolled < window.innerHeight) {
        heroVisual.style.transform = `translateY(${scrolled * 0.1}px)`;
    }
});

// Form field focus effects
document.querySelectorAll('.form-field input, .form-field select').forEach(field => {
    field.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
    });

    field.addEventListener('blur', function() {
        this.parentElement.classList.remove('focused');
        if (this.value) {
            this.parentElement.classList.add('filled');
        } else {
            this.parentElement.classList.remove('filled');
        }
    });
});
