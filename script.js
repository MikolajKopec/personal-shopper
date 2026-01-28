// ============================================
// SĂN STYLE — Landing Page Scripts
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initSmoothScroll();
    initFormSubmission();
    initScrollAnimations();
    initNavBackground();
    initCounterAnimation();
});

// Smooth scroll for anchor links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = document.querySelector('.nav').offsetHeight;
                const announcementHeight = document.querySelector('.announcement-bar')?.offsetHeight || 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;

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

            // Here you would typically send to your backend
            // For now, we'll simulate success and log data
            console.log('Form submission:', data);

            // Simulate API call delay
            const submitBtn = form.querySelector('.form-submit');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span>Wysyłanie...</span>';
            submitBtn.disabled = true;

            await new Promise(resolve => setTimeout(resolve, 800));

            // Update signup counter
            updateSignupCounter();

            // Show success modal
            showModal();

            // Reset form and button
            form.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
    }
}

// Update signup counter after form submission
function updateSignupCounter() {
    const counter = document.getElementById('signupCount');
    if (counter) {
        const currentCount = parseInt(counter.textContent);
        counter.textContent = currentCount + 1;
    }

    // Update remaining spots
    const spotsElements = document.querySelectorAll('.spots-remaining, .spots-counter');
    spotsElements.forEach(el => {
        const current = parseInt(el.textContent);
        if (current > 0) {
            el.textContent = current - 1;
        }
    });
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

// Make closeModal available globally for onclick handler
window.closeModal = closeModal;

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
    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        // Show all elements immediately
        document.querySelectorAll('.hero-content, .hero-visual, .process-card, .pricing-card, .example-card, .faq-item').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
        return;
    }

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
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
        '.hero-content, .hero-visual, .process-card, .pricing-card, .example-card, .faq-item'
    );

    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// Navigation background on scroll
function initNavBackground() {
    const nav = document.querySelector('.nav');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            nav.style.boxShadow = '0 2px 20px rgba(44, 40, 37, 0.08)';
        } else {
            nav.style.boxShadow = 'none';
        }
    });
}

// Animate counter on scroll into view
function initCounterAnimation() {
    const counter = document.getElementById('signupCount');
    if (!counter) return;

    const targetNumber = parseInt(counter.textContent);
    let hasAnimated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                animateNumber(counter, 0, targetNumber, 1500);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    observer.observe(counter);
}

function animateNumber(element, start, end, duration) {
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (end - start) * easeOut);

        element.textContent = current;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

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

// Validate height input for Vietnamese sizes
document.getElementById('height')?.addEventListener('blur', function() {
    const height = parseInt(this.value);
    const sizeWarning = document.querySelector('.size-warning');

    if (height && (height < 155 || height > 175)) {
        // Could show a subtle warning that Vietnamese sizes might be challenging
        console.log('Height outside optimal range for Vietnamese sizing');
    }
});

// Validate size selection
document.getElementById('size')?.addEventListener('change', function() {
    const size = this.value;
    if (size === 'XL' || size === 'XXL') {
        // Could show a note about limited availability
        console.log('Larger sizes have limited availability');
    }
});
