// Mehfooz Internet - Advanced Interactive JavaScript
// Enhanced with extensive animations, interactions, and functionality

class MehfoozApp {
  constructor() {
    this.observers = new Map();
    this.animations = new Map();
    this.timers = new Map();
    this.counters = new Map();
    this.currentTestimonial = 0;
    this.testimonialInterval = null;
    this.currentFormStep = 1;
    this.formData = {};
    this.isLoading = true;
    
    this.init();
  }

  init() {
    // Initialize when DOM is loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    this.showLoadingScreen();
    this.setupNavigation();
    this.setupScrollAnimations();
    this.setupHeroAnimations();
    this.setupFeatureAnimations();
    this.setupTimelineAnimations();
    this.setupTeamAnimations();
    this.setupTestimonialCarousel();
    this.setupContactForm();
    this.setupModalSystem();
    this.setupBackToTop();
    this.setupCounterAnimations();
    this.setupParticleAnimations();
    this.setupSmoothScrolling();
    this.setupResponsiveHandlers();
    
    // Hide loading screen after setup
    setTimeout(() => this.hideLoadingScreen(), 2000);
  }

  // ===== LOADING SCREEN =====
  showLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const progressBar = loadingScreen?.querySelector('.loading-progress');
    const loadingMessage = loadingScreen?.querySelector('.loading-message');
    
    if (!loadingScreen) return;

    const messages = [
      'Initializing Digital Fortress...',
      'Loading MehfoozBot...',
      'Preparing Educational Content...',
      'Establishing Secure Connection...',
      'Ready for Digital Literacy!'
    ];

    let messageIndex = 0;
    let progress = 0;

    const updateProgress = () => {
      progress += Math.random() * 15 + 5;
      if (progress > 100) progress = 100;
      
      if (progressBar) {
        progressBar.style.width = progress + '%';
      }
      
      if (progress >= 100) {
        if (loadingMessage) {
          loadingMessage.textContent = messages[messages.length - 1];
        }
        return;
      }
      
      if (messageIndex < messages.length - 1 && progress > (messageIndex + 1) * 20) {
        messageIndex++;
        if (loadingMessage) {
          loadingMessage.textContent = messages[messageIndex];
        }
      }
      
      setTimeout(updateProgress, 200 + Math.random() * 300);
    };

    updateProgress();
    this.createLoadingParticles();
  }

  createLoadingParticles() {
    const particlesContainer = document.querySelector('.loading-particles');
    if (!particlesContainer) return;

    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: absolute;
        width: 2px;
        height: 2px;
        background: var(--color-primary);
        border-radius: 50%;
        pointer-events: none;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: loading-float ${4 + Math.random() * 4}s ease-in-out infinite;
        animation-delay: ${Math.random() * 2}s;
        opacity: ${0.3 + Math.random() * 0.7};
      `;
      particlesContainer.appendChild(particle);
    }
  }

  hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.classList.add('hidden');
      setTimeout(() => {
        loadingScreen.style.display = 'none';
        this.isLoading = false;
        this.triggerInitialAnimations();
      }, 500);
    }
  }

  // ===== NAVIGATION =====
  setupNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (navToggle && navMenu) {
      navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
      });
    }

    // Smooth scroll to sections
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
          this.scrollToSection(targetSection);
          this.setActiveNavLink(link);
          
          // Close mobile menu
          if (navMenu && navMenu.classList.contains('active')) {
            navToggle?.classList.remove('active');
            navMenu.classList.remove('active');
          }
        }
      });
    });

    // Navbar scroll effect
    let lastScrollY = 0;
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      
      if (navbar) {
        if (currentScrollY > 50) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      }

      // Update active nav link based on scroll position
      this.updateActiveNavOnScroll();
      lastScrollY = currentScrollY;
    });
  }

  setActiveNavLink(activeLink) {
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
    });
    activeLink.classList.add('active');
  }

  updateActiveNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.clientHeight;
      
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  scrollToSection(element) {
    const navbarHeight = document.getElementById('navbar')?.offsetHeight || 70;
    const targetPosition = element.offsetTop - navbarHeight;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }

  // ===== SCROLL ANIMATIONS =====
  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const animateOnScroll = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          
          // Trigger specific animations based on element class
          if (entry.target.classList.contains('animate-count-up')) {
            this.startCountAnimation(entry.target);
          }
          
          if (entry.target.classList.contains('timeline-item')) {
            this.animateTimelineItem(entry.target);
          }
          
          if (entry.target.classList.contains('team-member')) {
            this.animateTeamMember(entry.target);
          }
        }
      });
    }, observerOptions);

    // Observe all animated elements
    const animatedElements = document.querySelectorAll('.animate-fade-up, .animate-slide-in, .animate-count-up');
    animatedElements.forEach(el => {
      animateOnScroll.observe(el);
    });

    this.observers.set('scroll', animateOnScroll);
  }

  triggerInitialAnimations() {
    // Trigger hero animations immediately
    const heroElements = document.querySelectorAll('.hero .animate-fade-up');
    heroElements.forEach((el, index) => {
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, index * 200);
    });
  }

  // ===== HERO ANIMATIONS =====
  setupHeroAnimations() {
    this.setupTypewriterEffect();
    this.setupMorphingText();
    this.setupHeroButtons();
    this.setupDeviceAnimation();
  }

  setupTypewriterEffect() {
    const typewriterElement = document.querySelector('.typewriter');
    if (!typewriterElement) return;

    const text = typewriterElement.getAttribute('data-text') || 'MEHFOOZ INTERNET';
    let index = 0;
    
    typewriterElement.textContent = '';
    
    const typeWriter = () => {
      if (index < text.length) {
        typewriterElement.textContent += text.charAt(index);
        index++;
        setTimeout(typeWriter, 100 + Math.random() * 100);
      }
    };

    setTimeout(typeWriter, 1000);
  }

  setupMorphingText() {
    const morphingElement = document.querySelector('.morphing-text');
    if (!morphingElement) return;

    try {
      const texts = JSON.parse(morphingElement.getAttribute('data-texts') || '["The Signal in the Noise"]');
      let currentIndex = 0;
      
      const morphText = () => {
        morphingElement.style.opacity = '0';
        
        setTimeout(() => {
          morphingElement.textContent = texts[currentIndex];
          morphingElement.style.opacity = '1';
          currentIndex = (currentIndex + 1) % texts.length;
        }, 300);
      };
      
      // Initial text
      morphingElement.textContent = texts[0];
      
      // Start morphing after delay
      setTimeout(() => {
        setInterval(morphText, 3000);
      }, 2000);
    } catch (e) {
      console.error('Error parsing morphing text data:', e);
    }
  }

  setupHeroButtons() {
    const ctaButton = document.getElementById('hero-cta');
    const learnButton = document.getElementById('hero-learn');

    if (ctaButton) {
      ctaButton.addEventListener('click', () => {
        this.animateButtonClick(ctaButton);
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          setTimeout(() => this.scrollToSection(contactSection), 300);
        }
      });
    }

    if (learnButton) {
      learnButton.addEventListener('click', () => {
        this.animateButtonClick(learnButton);
        this.showDemoModal();
      });
    }
  }

  animateButtonClick(button) {
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
      button.style.transform = 'scale(1)';
    }, 150);

    // Create ripple effect
    const ripple = document.createElement('div');
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      transform: scale(0);
      animation: ripple 0.6s linear;
      pointer-events: none;
    `;
    
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = '50%';
    ripple.style.top = '50%';
    ripple.style.marginLeft = -size / 2 + 'px';
    ripple.style.marginTop = -size / 2 + 'px';
    
    button.style.position = 'relative';
    button.appendChild(ripple);
    
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 600);
  }

  setupDeviceAnimation() {
    const chatMessages = document.querySelectorAll('.chat-message');
    
    chatMessages.forEach((message, index) => {
      setTimeout(() => {
        message.style.opacity = '1';
        message.style.transform = 'translateX(0)';
      }, 2000 + (index * 1000));
    });
  }

  // ===== COUNTER ANIMATIONS =====
  setupCounterAnimations() {
    // Counter animation will be triggered by scroll observer
  }

  startCountAnimation(element) {
    if (this.counters.has(element)) return;
    
    const target = parseInt(element.getAttribute('data-target')) || 0;
    let current = 0;
    const increment = target / 50;
    const duration = 2000;
    const stepTime = duration / 50;
    
    this.counters.set(element, true);
    
    const updateCounter = () => {
      if (current < target) {
        current += increment;
        if (current > target) current = target;
        
        // Format number based on size
        let displayValue;
        if (target >= 100000) {
          displayValue = (current / 1000).toFixed(0) + 'K+';
        } else if (target >= 1000) {
          displayValue = (current / 1000).toFixed(1) + 'K';
        } else if (target < 10) {
          displayValue = current.toFixed(1);
        } else {
          displayValue = Math.floor(current).toLocaleString();
        }
        
        element.textContent = displayValue;
        
        if (current < target) {
          setTimeout(updateCounter, stepTime);
        }
      }
    };
    
    updateCounter();
  }

  // ===== FEATURE ANIMATIONS =====
  setupFeatureAnimations() {
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
      // Add hover animations
      card.addEventListener('mouseenter', () => {
        this.animateFeatureCard(card, true);
      });
      
      card.addEventListener('mouseleave', () => {
        this.animateFeatureCard(card, false);
      });
      
      // Demo button functionality
      const demoButton = card.querySelector('.feature-demo-btn');
      if (demoButton) {
        demoButton.addEventListener('click', (e) => {
          e.stopPropagation();
          const featureType = card.getAttribute('data-feature');
          this.showFeatureDemo(featureType);
        });
      }
    });
    
    this.setupFeatureShowcase();
  }

  animateFeatureCard(card, isHover) {
    const icon = card.querySelector('.feature-icon');
    const benefits = card.querySelectorAll('.benefit-item');
    
    if (isHover) {
      if (icon) {
        icon.style.transform = 'scale(1.1) rotateY(10deg)';
      }
      
      benefits.forEach((benefit, index) => {
        setTimeout(() => {
          benefit.style.transform = 'translateX(10px)';
          benefit.style.color = 'var(--color-primary)';
        }, index * 100);
      });
    } else {
      if (icon) {
        icon.style.transform = 'scale(1) rotateY(0deg)';
      }
      
      benefits.forEach(benefit => {
        benefit.style.transform = 'translateX(0)';
        benefit.style.color = '';
      });
    }
  }

  setupFeatureShowcase() {
    const showcase = document.getElementById('feature-showcase');
    if (!showcase) return;
    
    // Default content
    showcase.innerHTML = `
      <div style="text-align: center; padding: 40px;">
        <i class="fas fa-mouse-pointer" style="font-size: 2rem; color: var(--color-primary); margin-bottom: 16px;"></i>
        <p style="color: var(--color-text-secondary); margin: 0;">Click on a feature card above to see an interactive demonstration</p>
      </div>
    `;
  }

  showFeatureDemo(featureType) {
    const showcase = document.getElementById('feature-showcase');
    if (!showcase) return;
    
    const demos = {
      mehfoozbot: this.createMehfoozBotDemo(),
      courses: this.createCoursesDemo(),
      community: this.createCommunityDemo(),
      verification: this.createVerificationDemo()
    };
    
    const demo = demos[featureType];
    if (demo) {
      showcase.innerHTML = '';
      showcase.appendChild(demo);
      
      // Animate in
      demo.style.opacity = '0';
      demo.style.transform = 'translateY(20px)';
      setTimeout(() => {
        demo.style.opacity = '1';
        demo.style.transform = 'translateY(0)';
      }, 100);
    }
  }

  createMehfoozBotDemo() {
    const container = document.createElement('div');
    container.className = 'demo-container';
    container.style.cssText = `
      background: var(--color-surface);
      border: 1px solid var(--color-card-border);
      border-radius: var(--radius-lg);
      padding: 24px;
      transition: all 0.3s ease;
    `;
    
    container.innerHTML = `
      <div style="text-align: center; margin-bottom: 20px;">
        <h4 style="color: var(--color-primary); margin-bottom: 8px;">MehfoozBot Interactive Demo</h4>
        <p style="color: var(--color-text-secondary); font-size: 14px;">Try asking MehfoozBot a question!</p>
      </div>
      <div class="demo-chat" style="background: var(--color-background); border-radius: 8px; padding: 16px; margin-bottom: 16px; height: 200px; overflow-y: auto;">
        <div class="demo-message bot" style="margin-bottom: 12px;">👤 <strong>MehfoozBot:</strong> Hello! I'm here to help you with digital literacy. What would you like to learn about?</div>
      </div>
      <div style="display: flex; gap: 8px;">
        <input type="text" class="demo-input" placeholder="Ask me about fake news, online safety, etc..." style="flex: 1; padding: 8px 12px; border: 1px solid var(--color-border); border-radius: 4px; background: var(--color-background); color: var(--color-text);">
        <button class="demo-send" style="padding: 8px 16px; background: var(--color-primary); color: var(--color-btn-primary-text); border: none; border-radius: 4px; cursor: pointer;">Send</button>
      </div>
    `;
    
    const input = container.querySelector('.demo-input');
    const sendBtn = container.querySelector('.demo-send');
    const chat = container.querySelector('.demo-chat');
    
    const handleSend = () => {
      const message = input.value.trim();
      if (!message) return;
      
      // Add user message
      const userMsg = document.createElement('div');
      userMsg.className = 'demo-message user';
      userMsg.style.cssText = 'margin-bottom: 12px; text-align: right;';
      userMsg.innerHTML = `<strong>You:</strong> ${message}`;
      chat.appendChild(userMsg);
      
      input.value = '';
      
      // Simulate bot response
      setTimeout(() => {
        const botMsg = document.createElement('div');
        botMsg.className = 'demo-message bot';
        botMsg.style.cssText = 'margin-bottom: 12px;';
        botMsg.innerHTML = `🤖 <strong>MehfoozBot:</strong> ${this.getBotResponse(message)}`;
        chat.appendChild(botMsg);
        chat.scrollTop = chat.scrollHeight;
      }, 1000);
      
      chat.scrollTop = chat.scrollHeight;
    };
    
    sendBtn.addEventListener('click', handleSend);
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleSend();
    });
    
    return container;
  }

  getBotResponse(message) {
    const responses = {
      'fake news': 'Great question! Here are 3 key ways to identify fake news: 1) Check the source credibility, 2) Look for multiple confirmations, 3) Verify with fact-checking websites.',
      'online safety': 'Online safety is crucial! Remember to: Use strong passwords, enable two-factor authentication, be cautious with personal information, and verify links before clicking.',
      'social media': 'Social media literacy involves: Critical evaluation of posts, understanding privacy settings, recognizing manipulation tactics, and promoting positive digital citizenship.',
      'default': 'That\'s an interesting topic! Our platform offers comprehensive courses on digital literacy, information verification, and online safety. Would you like to explore our mini-courses?'
    };
    
    const lowerMessage = message.toLowerCase();
    for (const [key, response] of Object.entries(responses)) {
      if (lowerMessage.includes(key)) {
        return response;
      }
    }
    return responses.default;
  }

  createCoursesDemo() {
    const container = document.createElement('div');
    container.className = 'demo-container';
    container.innerHTML = `
      <h4 style="color: var(--color-primary); text-align: center; margin-bottom: 20px;">Available Mini-Courses</h4>
      <div class="courses-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
        <div class="course-item" style="background: var(--color-background); border: 1px solid var(--color-border); border-radius: 8px; padding: 16px; cursor: pointer; transition: transform 0.2s;">
          <div style="font-size: 24px; margin-bottom: 8px;">🔍</div>
          <h5 style="margin-bottom: 8px;">Fact Checking</h5>
          <p style="font-size: 12px; color: var(--color-text-secondary);">Learn to verify information online</p>
          <div style="font-size: 10px; color: var(--color-primary);">Available in Urdu, Balti</div>
        </div>
        <div class="course-item" style="background: var(--color-background); border: 1px solid var(--color-border); border-radius: 8px; padding: 16px; cursor: pointer; transition: transform 0.2s;">
          <div style="font-size: 24px; margin-bottom: 8px;">🔒</div>
          <h5 style="margin-bottom: 8px;">Online Privacy</h5>
          <p style="font-size: 12px; color: var(--color-text-secondary);">Protect your digital identity</p>
          <div style="font-size: 10px; color: var(--color-primary);">Available in Shina, Burushaski</div>
        </div>
        <div class="course-item" style="background: var(--color-background); border: 1px solid var(--color-border); border-radius: 8px; padding: 16px; cursor: pointer; transition: transform 0.2s;">
          <div style="font-size: 24px; margin-bottom: 8px;">📱</div>
          <h5 style="margin-bottom: 8px;">Social Media Safety</h5>
          <p style="font-size: 12px; color: var(--color-text-secondary);">Navigate social platforms safely</p>
          <div style="font-size: 10px; color: var(--color-primary);">Available in Wakhi, Khowar</div>
        </div>
      </div>
    `;
    
    // Add hover effects
    container.querySelectorAll('.course-item').forEach(item => {
      item.addEventListener('mouseenter', () => {
        item.style.transform = 'translateY(-4px)';
        item.style.boxShadow = 'var(--shadow-md)';
      });
      item.addEventListener('mouseleave', () => {
        item.style.transform = 'translateY(0)';
        item.style.boxShadow = 'none';
      });
    });
    
    return container;
  }

  createCommunityDemo() {
    const container = document.createElement('div');
    container.className = 'demo-container';
    container.innerHTML = `
      <h4 style="color: var(--color-primary); text-align: center; margin-bottom: 20px;">Community Network</h4>
      <div class="network-visualization" style="position: relative; height: 300px; background: var(--color-background); border-radius: 8px; padding: 20px;">
        <div class="network-hub" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 60px; height: 60px; background: var(--color-primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px;">🏫</div>
        <div class="network-node" style="position: absolute; top: 20%; left: 20%; width: 40px; height: 40px; background: var(--color-success); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white;">🕌</div>
        <div class="network-node" style="position: absolute; top: 20%; right: 20%; width: 40px; height: 40px; background: var(--color-success); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white;">👨‍🏫</div>
        <div class="network-node" style="position: absolute; bottom: 20%; left: 25%; width: 40px; height: 40px; background: var(--color-success); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white;">👥</div>
        <div class="network-node" style="position: absolute; bottom: 20%; right: 25%; width: 40px; height: 40px; background: var(--color-success); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white;">🏠</div>
      </div>
      <div style="text-align: center; margin-top: 16px;">
        <p style="color: var(--color-text-secondary); font-size: 14px;">Our network includes mosques, schools, community centers, and homes - creating a comprehensive digital literacy ecosystem.</p>
      </div>
    `;
    
    return container;
  }

  createVerificationDemo() {
    const container = document.createElement('div');
    container.className = 'demo-container';
    container.innerHTML = `
      <h4 style="color: var(--color-primary); text-align: center; margin-bottom: 20px;">Information Verification Tool</h4>
      <div class="verification-tool" style="background: var(--color-background); border-radius: 8px; padding: 20px;">
        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 500;">Enter a claim or news headline:</label>
          <input type="text" class="verify-input" placeholder="e.g., Breaking: New development in Gilgit..." style="width: 100%; padding: 8px 12px; border: 1px solid var(--color-border); border-radius: 4px; background: var(--color-surface); color: var(--color-text);">
        </div>
        <button class="verify-btn" style="background: var(--color-primary); color: var(--color-btn-primary-text); border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; width: 100%;">🔍 Verify Information</button>
        <div class="verification-result" style="margin-top: 16px; padding: 16px; border-radius: 4px; display: none;"></div>
      </div>
    `;
    
    const input = container.querySelector('.verify-input');
    const button = container.querySelector('.verify-btn');
    const result = container.querySelector('.verification-result');
    
    button.addEventListener('click', () => {
      const claim = input.value.trim();
      if (!claim) return;
      
      // Simulate verification process
      button.textContent = '🔄 Verifying...';
      button.disabled = true;
      
      setTimeout(() => {
        const verification = this.simulateVerification(claim);
        result.innerHTML = verification.html;
        result.style.display = 'block';
        result.style.background = verification.color;
        result.style.border = `1px solid ${verification.borderColor}`;
        
        button.textContent = '🔍 Verify Information';
        button.disabled = false;
      }, 2000);
    });
    
    return container;
  }

  simulateVerification(claim) {
    const lowerClaim = claim.toLowerCase();
    
    if (lowerClaim.includes('breaking') || lowerClaim.includes('urgent')) {
      return {
        html: `
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <i class="fas fa-exclamation-triangle" style="color: var(--color-warning);"></i>
            <strong>Requires Verification</strong>
          </div>
          <p style="margin: 0; font-size: 14px;">Claims with urgent language should be verified through multiple sources before sharing.</p>
        `,
        color: 'rgba(var(--color-warning-rgb), 0.1)',
        borderColor: 'var(--color-warning)'
      };
    }
    
    return {
      html: `
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
          <i class="fas fa-check-circle" style="color: var(--color-success);"></i>
          <strong>Verification Tips</strong>
        </div>
        <ul style="margin: 0; font-size: 14px; padding-left: 20px;">
          <li>Check the original source</li>
          <li>Look for corroboration from trusted news outlets</li>
          <li>Verify through fact-checking websites</li>
          <li>Consider the date and context</li>
        </ul>
      `,
      color: 'rgba(var(--color-success-rgb), 0.1)',
      borderColor: 'var(--color-success)'
    };
  }

  // ===== TIMELINE ANIMATIONS =====
  setupTimelineAnimations() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach((item, index) => {
      item.addEventListener('click', () => {
        this.setActiveTimelineItem(item);
      });
    });
  }

  setActiveTimelineItem(activeItem) {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach(item => {
      item.classList.remove('active');
    });
    
    activeItem.classList.add('active');
    
    // Animate the marker
    const marker = activeItem.querySelector('.marker-dot');
    if (marker) {
      marker.style.animation = 'none';
      setTimeout(() => {
        marker.style.animation = 'success-bounce 0.6s ease';
      }, 10);
    }
  }

  animateTimelineItem(item) {
    const marker = item.querySelector('.marker-dot');
    const content = item.querySelector('.timeline-content');
    
    if (marker) {
      marker.style.animation = 'avatar-pulse 2s ease-in-out infinite';
    }
    
    if (content) {
      content.style.transform = 'translateX(20px)';
      setTimeout(() => {
        content.style.transform = 'translateX(0)';
      }, 200);
    }
  }

  // ===== TEAM ANIMATIONS =====
  setupTeamAnimations() {
    const teamMembers = document.querySelectorAll('.team-member');
    
    teamMembers.forEach(member => {
      const card = member.querySelector('.member-card');
      
      if (card) {
        member.addEventListener('mouseenter', () => {
          this.animateTeamMemberHover(member, true);
        });
        
        member.addEventListener('mouseleave', () => {
          this.animateTeamMemberHover(member, false);
        });
      }
    });
  }

  animateTeamMember(member) {
    const avatar = member.querySelector('.member-avatar');
    const expertise = member.querySelectorAll('.expertise-tag');
    
    if (avatar) {
      avatar.style.animation = 'bot-float 3s ease-in-out infinite';
    }
    
    expertise.forEach((tag, index) => {
      setTimeout(() => {
        tag.style.transform = 'scale(1.05)';
        setTimeout(() => {
          tag.style.transform = 'scale(1)';
        }, 200);
      }, index * 100);
    });
  }

  animateTeamMemberHover(member, isHover) {
    const socialLinks = member.querySelectorAll('.social-link');
    const expertiseTags = member.querySelectorAll('.expertise-tag');
    
    if (isHover) {
      socialLinks.forEach((link, index) => {
        setTimeout(() => {
          link.style.transform = 'translateY(-4px) rotate(5deg)';
        }, index * 50);
      });
      
      expertiseTags.forEach((tag, index) => {
        setTimeout(() => {
          tag.style.background = 'rgba(var(--color-primary-rgb), 0.2)';
          tag.style.transform = 'scale(1.05)';
        }, index * 30);
      });
    } else {
      socialLinks.forEach(link => {
        link.style.transform = 'translateY(0) rotate(0deg)';
      });
      
      expertiseTags.forEach(tag => {
        tag.style.background = '';
        tag.style.transform = 'scale(1)';
      });
    }
  }

  // ===== TESTIMONIAL CAROUSEL =====
  setupTestimonialCarousel() {
    const carousel = document.getElementById('testimonials-carousel');
    const slides = carousel?.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('testimonials-prev');
    const nextBtn = document.getElementById('testimonials-next');
    
    if (!slides || slides.length === 0) return;
    
    // Initialize
    this.currentTestimonial = 0;
    this.updateTestimonialSlide();
    
    // Auto-play
    this.startTestimonialAutoplay();
    
    // Navigation
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        this.previousTestimonial();
      });
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.nextTestimonial();
      });
    }
    
    // Dots navigation
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        this.goToTestimonial(index);
      });
    });
    
    // Pause on hover
    if (carousel) {
      carousel.addEventListener('mouseenter', () => {
        this.stopTestimonialAutoplay();
      });
      
      carousel.addEventListener('mouseleave', () => {
        this.startTestimonialAutoplay();
      });
    }
  }

  nextTestimonial() {
    const slides = document.querySelectorAll('.testimonial-slide');
    this.currentTestimonial = (this.currentTestimonial + 1) % slides.length;
    this.updateTestimonialSlide();
  }

  previousTestimonial() {
    const slides = document.querySelectorAll('.testimonial-slide');
    this.currentTestimonial = (this.currentTestimonial - 1 + slides.length) % slides.length;
    this.updateTestimonialSlide();
  }

  goToTestimonial(index) {
    this.currentTestimonial = index;
    this.updateTestimonialSlide();
  }

  updateTestimonialSlide() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');
    
    slides.forEach((slide, index) => {
      slide.classList.toggle('active', index === this.currentTestimonial);
    });
    
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === this.currentTestimonial);
    });
  }

  startTestimonialAutoplay() {
    this.stopTestimonialAutoplay();
    this.testimonialInterval = setInterval(() => {
      this.nextTestimonial();
    }, 6000);
  }

  stopTestimonialAutoplay() {
    if (this.testimonialInterval) {
      clearInterval(this.testimonialInterval);
      this.testimonialInterval = null;
    }
  }

  // ===== CONTACT FORM =====
  setupContactForm() {
    const form = document.getElementById('contact-form');
    const nextBtn = document.getElementById('form-next');
    const prevBtn = document.getElementById('form-prev');
    const submitBtn = document.getElementById('form-submit');
    
    if (!form) return;
    
    // Initialize form
    this.currentFormStep = 1;
    this.updateFormStep();
    
    // Navigation buttons
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (this.validateFormStep(this.currentFormStep)) {
          this.nextFormStep();
        }
      });
    }
    
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        this.previousFormStep();
      });
    }
    
    // Form submission
    if (submitBtn) {
      submitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.submitContactForm();
      });
    }
    
    // Step 1: Inquiry type selection
    this.setupInquiryTypeSelection();
    
    // Form field validation
    this.setupFormValidation();
    
    // Character counter for message field
    this.setupCharacterCounter();
  }

  setupInquiryTypeSelection() {
    const inquiryTypes = document.querySelectorAll('.inquiry-type');
    
    inquiryTypes.forEach(type => {
      type.addEventListener('click', () => {
        // Remove selection from others
        inquiryTypes.forEach(t => t.classList.remove('selected'));
        
        // Select current
        type.classList.add('selected');
        
        // Store selection
        this.formData.inquiryType = type.getAttribute('data-type');
        
        // Animate selection
        type.style.animation = 'success-bounce 0.6s ease';
        setTimeout(() => {
          type.style.animation = '';
        }, 600);
      });
    });
  }

  setupFormValidation() {
    const inputs = document.querySelectorAll('.form-control');
    
    inputs.forEach(input => {
      input.addEventListener('blur', () => {
        this.validateField(input);
      });
      
      input.addEventListener('input', () => {
        // Clear error state on input
        input.classList.remove('error');
        const validation = input.parentElement.querySelector('.field-validation');
        if (validation) {
          validation.textContent = '';
          validation.className = 'field-validation';
        }
      });
    });
  }

  setupCharacterCounter() {
    const messageField = document.getElementById('message');
    const counter = document.getElementById('message-count');
    
    if (messageField && counter) {
      messageField.addEventListener('input', () => {
        const count = messageField.value.length;
        counter.textContent = count;
        
        if (count > 800) {
          counter.style.color = 'var(--color-warning)';
        } else if (count > 950) {
          counter.style.color = 'var(--color-error)';
        } else {
          counter.style.color = 'var(--color-text-secondary)';
        }
      });
    }
  }

  validateField(field) {
    const value = field.value.trim();
    const validation = field.parentElement.querySelector('.field-validation');
    let isValid = true;
    let message = '';
    
    // Required field check
    if (field.hasAttribute('required') && !value) {
      isValid = false;
      message = 'This field is required';
    }
    
    // Email validation
    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        message = 'Please enter a valid email address';
      }
    }
    
    // Phone validation (optional)
    if (field.type === 'tel' && value) {
      const phoneRegex = /^[+]?[\d\s\-\(\)]+$/;
      if (!phoneRegex.test(value)) {
        isValid = false;
        message = 'Please enter a valid phone number';
      }
    }
    
    // Update field state
    field.classList.toggle('error', !isValid);
    field.classList.toggle('success', isValid && value);
    
    if (validation) {
      validation.textContent = message;
      validation.className = `field-validation ${isValid ? 'success' : 'error'}`;
    }
    
    return isValid;
  }

  validateFormStep(step) {
    const stepElement = document.querySelector(`.form-step[data-step="${step}"]`);
    if (!stepElement) return false;
    
    let isValid = true;
    
    if (step === 1) {
      // Check if inquiry type is selected
      if (!this.formData.inquiryType) {
        this.showFormError('Please select an inquiry type');
        return false;
      }
    }
    
    if (step === 2) {
      // Validate step 2 fields
      const requiredFields = stepElement.querySelectorAll('.form-control[required]');
      requiredFields.forEach(field => {
        if (!this.validateField(field)) {
          isValid = false;
        }
      });
    }
    
    if (step === 3) {
      // Validate step 3 fields
      const requiredFields = stepElement.querySelectorAll('.form-control[required], .checkbox[required]');
      requiredFields.forEach(field => {
        if (field.type === 'checkbox') {
          if (!field.checked) {
            isValid = false;
            const validation = field.closest('.form-group').querySelector('.field-validation');
            if (validation) {
              validation.textContent = 'This field is required';
              validation.className = 'field-validation error';
            }
          }
        } else {
          if (!this.validateField(field)) {
            isValid = false;
          }
        }
      });
    }
    
    if (!isValid) {
      this.showFormError('Please fix the errors above before continuing');
    }
    
    return isValid;
  }

  showFormError(message) {
    // Create or update error message
    let errorDiv = document.querySelector('.form-error-message');
    if (!errorDiv) {
      errorDiv = document.createElement('div');
      errorDiv.className = 'form-error-message';
      errorDiv.style.cssText = `
        background: rgba(var(--color-error-rgb), 0.1);
        border: 1px solid var(--color-error);
        color: var(--color-error);
        padding: 12px 16px;
        border-radius: 4px;
        margin-bottom: 16px;
        font-size: 14px;
        text-align: center;
      `;
      
      const currentStep = document.querySelector('.form-step.active');
      if (currentStep) {
        currentStep.insertBefore(errorDiv, currentStep.firstChild);
      }
    }
    
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      if (errorDiv.parentNode) {
        errorDiv.style.display = 'none';
      }
    }, 5000);
  }

  nextFormStep() {
    if (this.currentFormStep < 4) {
      this.currentFormStep++;
      this.updateFormStep();
      this.updateFormReview();
    }
  }

  previousFormStep() {
    if (this.currentFormStep > 1) {
      this.currentFormStep--;
      this.updateFormStep();
    }
  }

  updateFormStep() {
    // Update progress bar
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) {
      progressFill.style.width = `${(this.currentFormStep / 4) * 100}%`;
    }
    
    // Update step indicators
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
      step.classList.toggle('active', index + 1 <= this.currentFormStep);
    });
    
    // Update form steps visibility
    const formSteps = document.querySelectorAll('.form-step');
    formSteps.forEach((step, index) => {
      step.classList.toggle('active', index + 1 === this.currentFormStep);
    });
    
    // Update navigation buttons
    const prevBtn = document.getElementById('form-prev');
    const nextBtn = document.getElementById('form-next');
    const submitBtn = document.getElementById('form-submit');
    
    if (prevBtn) {
      prevBtn.style.display = this.currentFormStep > 1 ? 'flex' : 'none';
    }
    
    if (nextBtn) {
      nextBtn.style.display = this.currentFormStep < 4 ? 'flex' : 'none';
    }
    
    if (submitBtn) {
      submitBtn.style.display = this.currentFormStep === 4 ? 'flex' : 'none';
    }
    
    // Hide any error messages
    const errorDiv = document.querySelector('.form-error-message');
    if (errorDiv) {
      errorDiv.style.display = 'none';
    }
  }

  updateFormReview() {
    if (this.currentFormStep !== 4) return;
    
    // Collect form data
    const formData = new FormData(document.getElementById('contact-form'));
    
    // Update review sections
    const reviewType = document.getElementById('review-type');
    const reviewSubject = document.getElementById('review-subject');
    const reviewContact = document.getElementById('review-contact');
    const reviewMessage = document.getElementById('review-message');
    
    const inquiryTypeElement = document.querySelector('.inquiry-type.selected');
    const inquiryTypeName = inquiryTypeElement ? 
      inquiryTypeElement.querySelector('.type-content h5').textContent : 'Not selected';
    
    if (reviewType) {
      reviewType.textContent = inquiryTypeName;
    }
    
    if (reviewSubject) {
      reviewSubject.textContent = formData.get('subject') || 'Not provided';
    }
    
    if (reviewContact) {
      const firstName = formData.get('firstName') || '';
      const lastName = formData.get('lastName') || '';
      const email = formData.get('email') || '';
      const location = formData.get('location') || '';
      
      reviewContact.innerHTML = `
        <strong>${firstName} ${lastName}</strong><br>
        ${email}<br>
        ${location ? `Location: ${location}` : ''}
      `;
    }
    
    if (reviewMessage) {
      const message = formData.get('message') || '';
      reviewMessage.textContent = message.length > 100 ? 
        message.substring(0, 100) + '...' : message || 'No message provided';
    }
  }

  submitContactForm() {
    if (!this.validateFormStep(4)) return;
    
    const submitBtn = document.getElementById('form-submit');
    const loader = submitBtn?.querySelector('.btn-loader');
    
    // Show loading state
    if (submitBtn) {
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;
    }
    
    // Simulate form submission
    setTimeout(() => {
      // Hide loading state
      if (submitBtn) {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
      }
      
      // Show success modal
      this.showSuccessModal();
      
      // Reset form
      this.resetContactForm();
    }, 2000);
  }

  resetContactForm() {
    const form = document.getElementById('contact-form');
    if (form) {
      form.reset();
    }
    
    // Clear selections
    document.querySelectorAll('.inquiry-type').forEach(type => {
      type.classList.remove('selected');
    });
    
    // Reset to step 1
    this.currentFormStep = 1;
    this.formData = {};
    this.updateFormStep();
    
    // Clear validation states
    document.querySelectorAll('.form-control').forEach(field => {
      field.classList.remove('error', 'success');
    });
    
    document.querySelectorAll('.field-validation').forEach(validation => {
      validation.textContent = '';
      validation.className = 'field-validation';
    });
  }

  // ===== MODAL SYSTEM =====
  setupModalSystem() {
    // Close modal when clicking outside
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal')) {
        this.hideModal(e.target);
      }
    });
    
    // Close modal with escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const openModal = document.querySelector('.modal.show');
        if (openModal) {
          this.hideModal(openModal);
        }
      }
    });
    
    // Setup close buttons
    const modalCloseBtn = document.getElementById('modal-close');
    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', () => {
        const modal = modalCloseBtn.closest('.modal');
        if (modal) {
          this.hideModal(modal);
        }
      });
    }
  }

  showSuccessModal() {
    const modal = document.getElementById('success-modal');
    if (modal) {
      modal.classList.add('show');
      
      // Animate success icon
      const icon = modal.querySelector('.success-icon i');
      if (icon) {
        icon.style.animation = 'success-bounce 0.8s ease';
      }
    }
  }

  showDemoModal() {
    // Create and show demo modal (simplified for this example)
    alert('Demo modal would show here with platform walkthrough!');
  }

  hideModal(modal) {
    modal.classList.remove('show');
  }

  // ===== BACK TO TOP =====
  setupBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    
    if (backToTopBtn) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
          backToTopBtn.classList.add('show');
        } else {
          backToTopBtn.classList.remove('show');
        }
      });
      
      backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  }

  // ===== PARTICLE ANIMATIONS =====
  setupParticleAnimations() {
    this.createHeroParticles();
    this.createSectionDividers();
  }

  createHeroParticles() {
    const heroParticles = document.querySelector('.hero-particles');
    if (!heroParticles) return;
    
    // Additional dynamic particles
    setInterval(() => {
      this.createFloatingParticle(heroParticles);
    }, 2000);
  }

  createFloatingParticle(container) {
    const particle = document.createElement('div');
    particle.style.cssText = `
      position: absolute;
      width: ${2 + Math.random() * 4}px;
      height: ${2 + Math.random() * 4}px;
      background: var(--color-primary);
      border-radius: 50%;
      pointer-events: none;
      left: ${Math.random() * 100}%;
      top: 100%;
      opacity: ${0.3 + Math.random() * 0.7};
      animation: particle-float ${8 + Math.random() * 4}s linear forwards;
    `;
    
    container.appendChild(particle);
    
    // Remove particle after animation
    setTimeout(() => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    }, 12000);
  }

  createSectionDividers() {
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
      if (index === 0) return; // Skip first section
      
      const divider = document.createElement('div');
      divider.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 1px;
        background: linear-gradient(90deg, transparent, var(--color-border), transparent);
        opacity: 0.5;
      `;
      
      section.style.position = 'relative';
      section.appendChild(divider);
    });
  }

  // ===== SMOOTH SCROLLING =====
  setupSmoothScrolling() {
    // Enhanced smooth scrolling for all internal links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href !== '#' && !link.closest('.nav-link')) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            this.scrollToSection(target);
          }
        }
      });
    });
  }

  // ===== RESPONSIVE HANDLERS =====
  setupResponsiveHandlers() {
    let resizeTimeout;
    
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.handleResize();
      }, 250);
    });
    
    // Initial call
    this.handleResize();
  }

  handleResize() {
    const isMobile = window.innerWidth <= 768;
    
    // Adjust animations for mobile
    if (isMobile) {
      // Reduce particle count on mobile
      const particles = document.querySelectorAll('.hero-particles > div');
      particles.forEach((particle, index) => {
        if (index % 2 === 0) {
          particle.style.display = 'none';
        }
      });
      
      // Stop testimonial autoplay on mobile
      this.stopTestimonialAutoplay();
    } else {
      // Restore particles on desktop
      const particles = document.querySelectorAll('.hero-particles > div');
      particles.forEach(particle => {
        particle.style.display = 'block';
      });
      
      // Start testimonial autoplay on desktop
      this.startTestimonialAutoplay();
    }
  }

  // ===== UTILITY METHODS =====
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // ===== CLEANUP =====
  destroy() {
    // Clean up observers
    this.observers.forEach(observer => {
      observer.disconnect();
    });
    
    // Clear intervals
    this.timers.forEach(timer => {
      clearInterval(timer);
    });
    
    // Stop testimonial autoplay
    this.stopTestimonialAutoplay();
    
    // Clear maps
    this.observers.clear();
    this.animations.clear();
    this.timers.clear();
    this.counters.clear();
  }
}

// Additional CSS animations via JavaScript
const additionalStyles = `
@keyframes ripple {
  to {
    transform: scale(4);
    opacity: 0;
  }
}

@keyframes particle-float {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
  50% {
    transform: translateY(-50vh) rotate(180deg);
    opacity: 0.5;
  }
  100% {
    transform: translateY(-100vh) rotate(360deg);
    opacity: 0;
  }
}

.demo-container {
  transition: all 0.3s ease;
}

.course-item:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialize the application
const mehfoozApp = new MehfoozApp();

// Make app globally available for debugging
window.mehfoozApp = mehfoozApp;

// Handle page unload
window.addEventListener('beforeunload', () => {
  mehfoozApp.destroy();
});