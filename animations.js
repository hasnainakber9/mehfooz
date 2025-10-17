/**
 * ANIMATIONS.JS
 * Advanced Animation Library with AOS (Animate On Scroll) functionality
 */

// Custom AOS Implementation
class AnimateOnScroll {
    constructor() {
        this.elements = [];
        this.init();
    }
    
    init() {
        // Find all elements with data-aos attribute
        this.elements = Array.from(document.querySelectorAll('[data-aos]'));
        
        // Set initial state
        this.elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = this.getInitialTransform(el.dataset.aos);
        });
        
        // Setup observer
        this.setupObserver();
        
        // Initial check
        this.checkElements();
    }
    
    getInitialTransform(animation) {
        const transforms = {
            'fade-up': 'translateY(50px)',
            'fade-down': 'translateY(-50px)',
            'fade-left': 'translateX(50px)',
            'fade-right': 'translateX(-50px)',
            'fade-in': 'translateY(0)',
            'zoom-in': 'scale(0.9)',
            'zoom-out': 'scale(1.1)'
        };
        return transforms[animation] || 'translateY(30px)';
    }
    
    setupObserver() {
        const options = {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, options);
        
        this.elements.forEach(el => this.observer.observe(el));
    }
    
    animateElement(element) {
        const delay = element.dataset.aosDelay || 0;
        const duration = element.dataset.aosDuration || 1000;
        
        setTimeout(() => {
            element.style.transition = `all ${duration}ms cubic-bezier(0.19, 1, 0.22, 1)`;
            element.style.opacity = '1';
            element.style.transform = 'translateY(0) translateX(0) scale(1)';
        }, delay);
        
        // Unobserve after animation
        this.observer.unobserve(element);
    }
    
    checkElements() {
        // Force check on load
        this.elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.85) {
                this.animateElement(el);
            }
        });
    }
}

// Number Counter Animation
class NumberCounter {
    constructor(element, target, duration = 2000) {
        this.element = element;
        this.target = parseInt(target);
        this.duration = duration;
        this.hasAnimated = false;
    }
    
    animate() {
        if (this.hasAnimated) return;
        this.hasAnimated = true;
        
        const startTime = Date.now();
        const startValue = 0;
        
        const updateCounter = () => {
            const currentTime = Date.now();
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / this.duration, 1);
            
            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.floor(startValue + (this.target - startValue) * easeOutQuart);
            
            this.element.textContent = currentValue.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                this.element.textContent = this.target.toLocaleString() + '+';
            }
        };
        
        updateCounter();
    }
}

// Parallax Scroll Effect
class ParallaxScroll {
    constructor() {
        this.elements = document.querySelectorAll('.hero-orb');
        this.ticking = false;
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', () => {
            if (!this.ticking) {
                requestAnimationFrame(() => {
                    this.update();
                    this.ticking = false;
                });
                this.ticking = true;
            }
        });
    }
    
    update() {
        const scrolled = window.pageYOffset;
        
        this.elements.forEach((el, index) => {
            const speed = (index + 1) * 0.15;
            const yPos = -(scrolled * speed);
            el.style.transform = `translateY(${yPos}px)`;
        });
    }
}

// Magnetic Button Effect
class MagneticButton {
    constructor(element) {
        this.element = element;
        this.strength = 20;
        this.init();
    }
    
    init() {
        this.element.addEventListener('mousemove', (e) => {
            const rect = this.element.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            const moveX = (x / rect.width) * this.strength;
            const moveY = (y / rect.height) * this.strength;
            
            this.element.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
        
        this.element.addEventListener('mouseleave', () => {
            this.element.style.transform = 'translate(0, 0)';
        });
    }
}

// Text Reveal Animation
class TextReveal {
    constructor(element) {
        this.element = element;
        this.text = element.textContent;
        this.init();
    }
    
    init() {
        this.element.innerHTML = '';
        
        const words = this.text.split(' ');
        words.forEach((word, index) => {
            const span = document.createElement('span');
            span.textContent = word + ' ';
            span.style.display = 'inline-block';
            span.style.opacity = '0';
            span.style.transform = 'translateY(20px)';
            span.style.transition = `all 0.6s cubic-bezier(0.19, 1, 0.22, 1) ${index * 0.05}s`;
            this.element.appendChild(span);
        });
        
        // Trigger animation
        setTimeout(() => {
            this.element.querySelectorAll('span').forEach(span => {
                span.style.opacity = '1';
                span.style.transform = 'translateY(0)';
            });
        }, 100);
    }
}

// Smooth Scroll
class SmoothScroll {
    constructor() {
        this.init();
    }
    
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                
                if (target) {
                    const headerOffset = 100;
                    const elementPosition = target.offsetTop;
                    const offsetPosition = elementPosition - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    const mobileMenu = document.getElementById('mobile-menu');
                    if (mobileMenu && mobileMenu.classList.contains('active')) {
                        mobileMenu.classList.remove('active');
                        document.getElementById('mobile-menu-toggle').classList.remove('active');
                    }
                }
            });
        });
    }
}

// Cursor Trail Effect
class CursorTrail {
    constructor() {
        this.cursor = document.getElementById('custom-cursor');
        if (!this.cursor) return;
        
        this.cursorDot = this.cursor.querySelector('.cursor-dot');
        this.cursorGlow = this.cursor.querySelector('.cursor-glow');
        
        this.mouseX = 0;
        this.mouseY = 0;
        this.cursorX = 0;
        this.cursorY = 0;
        this.glowX = 0;
        this.glowY = 0;
        
        this.init();
    }
    
    init() {
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
        
        // Hover effects
        document.querySelectorAll('a, button, .btn, .card').forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.cursor.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                this.cursor.classList.remove('hover');
            });
        });
        
        this.animate();
    }
    
    animate() {
        // Smooth cursor follow with delay
        this.cursorX += (this.mouseX - this.cursorX) * 0.3;
        this.cursorY += (this.mouseY - this.cursorY) * 0.3;
        
        this.glowX += (this.mouseX - this.glowX) * 0.15;
        this.glowY += (this.mouseY - this.glowY) * 0.15;
        
        this.cursorDot.style.transform = `translate(${this.cursorX}px, ${this.cursorY}px)`;
        this.cursorGlow.style.transform = `translate(${this.glowX}px, ${this.glowY}px)`;
        
        requestAnimationFrame(() => this.animate());
    }
}

// Card Tilt Effect
class CardTilt {
    constructor(element) {
        this.element = element;
        this.init();
    }
    
    init() {
        this.element.addEventListener('mousemove', (e) => {
            const rect = this.element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * 5;
            const rotateY = ((x - centerX) / centerX) * -5;
            
            this.element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        this.element.addEventListener('mouseleave', () => {
            this.element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    }
}

// Initialize all animations when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // AOS
    new AnimateOnScroll();
    
    // Parallax
    new ParallaxScroll();
    
    // Smooth Scroll
    new SmoothScroll();
    
    // Custom Cursor
    if (window.matchMedia('(hover: hover)').matches) {
        new CursorTrail();
    }
    
    // Number Counters
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = new NumberCounter(
                    entry.target,
                    entry.target.dataset.count,
                    2500
                );
                counter.animate();
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => counterObserver.observe(stat));
    
    // Magnetic Buttons
    document.querySelectorAll('.btn-primary, .btn-glow').forEach(btn => {
        new MagneticButton(btn);
    });
    
    // Card Tilt Effects
    document.querySelectorAll('.challenge-card, .feature-card, .solution-card').forEach(card => {
        new CardTilt(card);
    });
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AnimateOnScroll,
        NumberCounter,
        ParallaxScroll,
        MagneticButton,
        TextReveal,
        SmoothScroll,
        CursorTrail,
        CardTilt
    };
}
