/**
 * SCRIPT.JS
 * Main JavaScript file for Mehfooz Internet
 * Handles all interactive elements and user interactions
 */

// ================================================================
// LOADING SCREEN
// ================================================================
class LoadingScreen {
    constructor() {
        this.loadingScreen = document.getElementById('loading-screen');
        this.loadingBar = document.getElementById('loading-bar');
        this.progress = 0;
        
        this.init();
    }
    
    init() {
        this.simulateLoading();
    }
    
    simulateLoading() {
        const interval = setInterval(() => {
            this.progress += Math.random() * 30;
            
            if (this.progress >= 100) {
                this.progress = 100;
                clearInterval(interval);
                
                setTimeout(() => {
                    this.hide();
                }, 500);
            }
            
            this.loadingBar.style.width = `${this.progress}%`;
        }, 200);
    }
    
    hide() {
        this.loadingScreen.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}

// ================================================================
// HEADER SCROLL EFFECTS
// ================================================================
class HeaderController {
    constructor() {
        this.header = document.getElementById('main-header');
        this.readingProgress = document.getElementById('reading-progress');
        this.lastScroll = 0;
        
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', () => {
            this.handleScroll();
            this.updateReadingProgress();
        });
    }
    
    handleScroll() {
        const currentScroll = window.pageYOffset;
        
        // Add scrolled class
        if (currentScroll > 50) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }
        
        this.lastScroll = currentScroll;
    }
    
    updateReadingProgress() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.pageYOffset;
        const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
        
        this.readingProgress.style.width = `${Math.min(scrollPercent, 100)}%`;
    }
}

// ================================================================
// MOBILE MENU
// ================================================================
class MobileMenu {
    constructor() {
        this.menuToggle = document.getElementById('mobile-menu-toggle');
        this.menu = document.getElementById('mobile-menu');
        this.menuLinks = document.querySelectorAll('.mobile-nav-link');
        
        if (!this.menuToggle || !this.menu) return;
        
        this.init();
    }
    
    init() {
        this.menuToggle.addEventListener('click', () => {
            this.toggle();
        });
        
        this.menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.close();
            });
        });
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.menu.classList.contains('active')) {
                this.close();
            }
        });
    }
    
    toggle() {
        this.menuToggle.classList.toggle('active');
        this.menu.classList.toggle('active');
        document.body.style.overflow = this.menu.classList.contains('active') ? 'hidden' : '';
    }
    
    close() {
        this.menuToggle.classList.remove('active');
        this.menu.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ================================================================
// THEME TOGGLE
// ================================================================
class ThemeToggle {
    constructor() {
        this.toggle = document.getElementById('theme-toggle');
        this.currentTheme = 'dark';
        
        if (!this.toggle) return;
        
        this.init();
    }
    
    init() {
        this.toggle.addEventListener('click', () => {
            this.switchTheme();
        });
    }
    
    switchTheme() {
        // Currently only dark theme, but ready for light theme
        const icon = this.toggle.querySelector('i');
        
        if (this.currentTheme === 'dark') {
            this.currentTheme = 'light';
            icon.className = 'fas fa-sun';
            // Add light theme classes here if needed
        } else {
            this.currentTheme = 'dark';
            icon.className = 'fas fa-moon';
            // Remove light theme classes here
        }
    }
}

// ================================================================
// BACK TO TOP BUTTON
// ================================================================
class BackToTop {
    constructor() {
        this.button = document.getElementById('back-to-top');
        
        if (!this.button) return;
        
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 500) {
                this.button.classList.add('visible');
            } else {
                this.button.classList.remove('visible');
            }
        });
        
        this.button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ================================================================
// MODAL SYSTEM
// ================================================================
class Modal {
    constructor(modalId) {
        this.modal = document.getElementById(modalId);
        if (!this.modal) return;
        
        this.backdrop = this.modal.querySelector('.modal-backdrop');
        this.closeBtn = this.modal.querySelector('.modal-close');
        
        this.init();
    }
    
    init() {
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.close());
        }
        
        if (this.backdrop) {
            this.backdrop.addEventListener('click', () => this.close());
        }
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.close();
            }
        });
    }
    
    open() {
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    close() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ================================================================
// BOT CHAT DEMO
// ================================================================
class BotChatDemo {
    constructor() {
        this.modal = new Modal('bot-modal');
        this.openBtn = document.getElementById('open-bot-modal');
        this.chatMessages = document.getElementById('chat-messages');
        this.quickQuestions = document.querySelectorAll('.quick-question');
        
        if (!this.chatMessages) return;
        
        this.responses = {
            "How can I spot fake news?": "Great question! Here are key signs to watch for:\n\n1. Check the source - Is it a reputable news organization?\n2. Look for emotional language designed to provoke\n3. Verify with multiple sources\n4. Check the date - old news is often recycled\n5. Examine the URL carefully\n\nRemember: If it seems too shocking to be true, verify before sharing!",
            
            "Is my WhatsApp safe?": "WhatsApp uses end-to-end encryption, which is very secure. However:\n\n✓ Enable two-step verification in settings\n✓ Be cautious of unknown numbers\n✓ Don't click suspicious links\n✓ Verify forwarded messages before believing them\n✓ Use privacy settings to control who sees your info\n\nYour messages are encrypted, but your sharing habits matter!",
            
            "How do I create a strong password?": "A strong password should:\n\n1. Be at least 12 characters long\n2. Include uppercase and lowercase letters\n3. Contain numbers and symbols\n4. Avoid personal information (birthdays, names)\n5. Be unique for each account\n\nTip: Use a passphrase like 'BlueSky@Mountain42!' - easy to remember, hard to crack!"
        };
        
        this.init();
    }
    
    init() {
        if (this.openBtn) {
            this.openBtn.addEventListener('click', () => {
                this.modal.open();
            });
        }
        
        this.quickQuestions.forEach(btn => {
            btn.addEventListener('click', () => {
                const question = btn.dataset.question;
                this.handleQuestion(question);
            });
        });
    }
    
    handleQuestion(question) {
        // Add user message
        this.addMessage(question, 'user');
        
        // Simulate typing delay
        setTimeout(() => {
            const response = this.responses[question] || "I'm here to help! Please ask me about digital safety, fake news, or online security.";
            this.addMessage(response, 'bot');
        }, 800);
    }
    
    addMessage(text, type) {
        const messageEl = document.createElement('div');
        messageEl.className = `chat-message ${type}`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = type === 'bot' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
        
        const content = document.createElement('div');
        content.className = 'message-content';
        
        const p = document.createElement('p');
        p.textContent = text;
        content.appendChild(p);
        
        messageEl.appendChild(avatar);
        messageEl.appendChild(content);
        
        this.chatMessages.appendChild(messageEl);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
}

// ================================================================
// CONTACT FORM
// ================================================================
class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.pathwayCards = document.querySelectorAll('.pathway-card');
        this.selectField = document.getElementById('interest');
        
        if (!this.form) return;
        
        this.init();
    }
    
    init() {
        // Pathway card click to select interest
        this.pathwayCards.forEach(card => {
            card.addEventListener('click', () => {
                const pathway = card.dataset.pathway;
                if (this.selectField) {
                    this.selectField.value = pathway;
                    
                    // Scroll to form
                    this.form.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                    
                    // Add highlight animation
                    this.selectField.parentElement.style.animation = 'highlight 0.6s ease';
                    setTimeout(() => {
                        this.selectField.parentElement.style.animation = '';
                    }, 600);
                }
            });
        });
        
        // Form submission
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
    }
    
    async handleSubmit() {
        const submitBtn = this.form.querySelector('.btn-submit');
        const formData = new FormData(this.form);
        
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Show success state
        submitBtn.classList.remove('loading');
        submitBtn.classList.add('success');
        
        // Reset form
        setTimeout(() => {
            this.form.reset();
            submitBtn.classList.remove('success');
            submitBtn.disabled = false;
        }, 3000);
        
        // Here you would typically send data to your backend
        console.log('Form submitted:', Object.fromEntries(formData));
    }
}

// ================================================================
// PAGE TRANSITIONS
// ================================================================
class PageTransitions {
    constructor() {
        this.overlay = document.getElementById('page-transition');
        
        if (!this.overlay) return;
        
        this.init();
    }
    
    init() {
        // Smooth page transitions for internal links
        document.querySelectorAll('a[href^="/"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');
                
                this.overlay.classList.add('active');
                
                setTimeout(() => {
                    window.location.href = href;
                }, 800);
            });
        });
    }
}

// ================================================================
// KEYBOARD SHORTCUTS
// ================================================================
class KeyboardShortcuts {
    constructor() {
        this.init();
    }
    
    init() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K for search (if implemented)
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                console.log('Search shortcut triggered');
            }
            
            // Arrow up to scroll to top
            if (e.key === 'Home') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            
            // Arrow down to scroll to bottom
            if (e.key === 'End') {
                e.preventDefault();
                window.scrollTo({ 
                    top: document.documentElement.scrollHeight, 
                    behavior: 'smooth' 
                });
            }
        });
    }
}

// ================================================================
// LAZY LOAD IMAGES (if images are added)
// ================================================================
class LazyLoad {
    constructor() {
        this.images = document.querySelectorAll('img[data-src]');
        this.init();
    }
    
    init() {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                }
            });
        });
        
        this.images.forEach(img => imageObserver.observe(img));
    }
    
    loadImage(img) {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
    }
}

// ================================================================
// PERFORMANCE MONITOR (Development only)
// ================================================================
class PerformanceMonitor {
    constructor() {
        if (window.location.hostname !== 'localhost') return;
        this.init();
    }
    
    init() {
        window.addEventListener('load', () => {
            const perfData = performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            
            console.log('%c⚡ Performance Metrics', 'color: #6EC1E4; font-size: 14px; font-weight: bold');
            console.log(`Page Load Time: ${pageLoadTime}ms`);
            console.log(`DOM Ready: ${perfData.domContentLoadedEventEnd - perfData.navigationStart}ms`);
        });
    }
}

// ================================================================
// INITIALIZE ALL SYSTEMS
// ================================================================
document.addEventListener('DOMContentLoaded', () => {
    // Core systems
    new LoadingScreen();
    new HeaderController();
    new MobileMenu();
    new ThemeToggle();
    new BackToTop();
    
    // Interactive features
    new BotChatDemo();
    new ContactForm();
    new PageTransitions();
    
    // Utilities
    new KeyboardShortcuts();
    new LazyLoad();
    new PerformanceMonitor();
    
    // Console greeting
    console.log('%c✨ Mehfooz Internet', 'color: #6EC1E4; font-size: 24px; font-weight: bold');
    console.log('%cEmpowering communities through digital literacy', 'color: #A78BFA; font-size: 12px');
});

// ================================================================
// EXPORT FOR TESTING
// ================================================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        LoadingScreen,
        HeaderController,
        MobileMenu,
        Modal,
        BotChatDemo,
        ContactForm
    };
}
