/*
  script.js (Refactor v2)
  Summary: Manages all site interactivity, animations, and accessibility features.
  Changes: Implemented new intro animation, robust hero fallback logic, accessibility
  toggles, keyboard shortcuts, and re-integrated bot/form logic.
*/

document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  // --- 1. CACHE DOM SELECTORS ---
  const selectors = {
    // Intro
    introOverlay: '#intro-overlay',
    introLine1: '#intro-line-1',
    introLine2: '#intro-line-2',
    introBeginBtn: '#intro-begin-btn',
    siteWrapper: '#site-wrapper',
    // Cursors
    cursorDot: '#cursor-dot',
    cursorLight: '#cursor-light',
    // Header & Nav
    siteHeader: '#site-header',
    navLinksContainer: '#nav-links',
    mobileNavToggle: '#mobile-nav-toggle',
    // Hero & Media
    heroHeadline: '#hero-headline',
    heroSubheadline: '#hero-subheadline',
    scrollPrompt: '#scroll-prompt',
    heroVideo: '#hero-video',
    heroStatic: '#hero-static-fallback',
    // Accessibility & Settings
    settingsToggleBtn: '#settings-toggle-btn',
    settingsModal: '#settings-modal',
    settingsCloseBtn: '#settings-close-btn',
    motionToggle: '#motion-toggle',
    soundToggle: '#sound-toggle',
    helpToggleBtn: '#help-toggle-btn',
    keyboardHelp: '#keyboard-help',
    modalBackdrop: '#modal-backdrop',
    // Bot (Inline)
    chatLog: '#chat-log',
    chatForm: '#chat-form',
    chatInput: '#chat-input',
    promptButtonsContainer: '#prompt-buttons',
    // Bot (Modal)
    openBotBtn: '#open-bot-demo-approach',
    botModal: '#bot-modal',
    closeBotBtn: '#close-bot-demo',
    modalChatLog: '#modal-chat-log',
    modalChatForm: '#modal-chat-form',
    modalChatInput: '#modal-chat-input',
    modalPillContainer: '#modal-question-pills',
    // Forms
    contactForm: '#contact-form',
    formSuccess: '#form-success',
  };

  const els = {};
  for (const key in selectors) {
    els[key] = document.querySelector(selectors[key]);
  }

  // Check for essential elements
  if (!els.introOverlay || !els.siteWrapper || !els.siteHeader) {
    console.error("Essential layout elements missing. Script will not run.");
    return;
  }

  // --- 2. GLOBAL STATE ---
  let lenis;
  let splitHeroHeadline;
  let isSiteEntered = false;

  // --- 3. CORE INITIALIZATION ---
  registerGsapPlugins();
  initCustomCursor();
  initIntroAnimation();


  // --- 4. FUNCTION DEFINITIONS ---

  /**
   * Registers GSAP plugins if they are available.
   */
  function registerGsapPlugins() {
    if (typeof gsap === 'undefined') {
      console.error("GSAP is not loaded. All animations will be disabled.");
      document.body.classList.add('reduced-motion'); // Force fallback
      return;
    }
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
  }

  /**
   * Initializes the cinematic intro animation.
   */
  function initIntroAnimation() {
    if (!els.introBeginBtn) return;

    // Set initial states
    gsap.set(els.introOverlay, { opacity: 1 });
    gsap.set(els.siteWrapper, { opacity: 0, visibility: 'hidden' });
    gsap.set(els.siteHeader, { y: '-100%', opacity: 0 });

    const tl = gsap.timeline();
    tl
      .to(els.introLine1, { opacity: 1, duration: 1.5, ease: 'power2.out' })
      .to(els.introLine1, { opacity: 0, duration: 1, ease: 'power2.in' }, '+=1')
      .to(els.introLine2, { opacity: 1, duration: 1.5, ease: 'power2.out' }, '-=0.5')
      .to(els.introBeginBtn, { opacity: 1, duration: 1.5, ease: 'power2.out' }, '-=1');

    els.introBeginBtn.addEventListener('click', enterSite);
  }

  /**
   * Handles the transition from the intro to the main site.
   */
  function enterSite() {
    if (isSiteEntered) return;
    isSiteEntered = true;

    console.log("Site entering...");

    const tl = gsap.timeline({
      onComplete: () => {
        els.introOverlay.style.display = 'none';
        els.siteWrapper.style.visibility = 'visible';
        document.body.classList.add('site-entered');
        
        // Initialize all main site JS *after* the intro
        initSmoothScroll();
        initNavigation();
        initAccessibility();
        initHeroFallback();
        initHeroAnimation();
        initSiteAnimations();
        initChatbot();
        initContactForm();
      }
    });

    tl
      .to([els.introLine2, els.introBeginBtn], { opacity: 0, duration: 0.5, ease: 'power2.in' })
      .to(els.introOverlay, { opacity: 0, duration: 1.5, ease: 'power2.inOut' })
      .to(els.siteWrapper, { opacity: 1, duration: 1.5, ease: 'power2.out' }, '-=1')
      .to(els.siteHeader, {
        y: '0%',
        opacity: 1,
        duration: 1.2,
        ease: 'power3.out'
      }, '-=1');
  }

  /**
   * Initializes Lenis smooth scrolling.
   */
  function initSmoothScroll() {
    if (typeof Lenis === 'undefined') {
      console.warn("Lenis not loaded. Using native scroll.");
      return;
    }
    
    // Check for reduced motion *before* initializing
    if (document.body.classList.contains('reduced-motion')) {
      console.log("Reduced motion: Lenis disabled.");
      return;
    }

    lenis = new Lenis();

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }
  
  /**
   * Initializes all navigation listeners (smooth scroll, mobile, sticky header).
   */
  function initNavigation() {
    // 1. Sticky Header
    if (els.siteHeader) {
      ScrollTrigger.create({
        start: 'top top-=-10px',
        onUpdate: self => {
          els.siteHeader.classList.toggle('is-scrolled', self.direction === 1 && self.scroll() > 10);
        }
      });
    }

    // 2. Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId.length > 1) {
          if (lenis) {
            lenis.scrollTo(targetId, { offset: -80, duration: 1.2, ease: 'power2.inOut' });
          } else {
            // Native fallback
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
              const top = targetEl.getBoundingClientRect().top + window.scrollY - 80;
              window.scrollTo({ top: top, behavior: 'smooth' });
            }
          }
        }
      });
    });

    // 3. Active nav link highlighting
    if (typeof gsap !== 'undefined') {
      gsap.utils.toArray('main section[id]').forEach((section) => {
        ScrollTrigger.create({
          trigger: section,
          start: 'top center+=100px',
          end: 'bottom center-=100px',
          onToggle: self => {
            const sectionId = section.getAttribute('id');
            const correspondingLinks = document.querySelectorAll(`.nav-link[href="#${sectionId}"]`);
            if (self.isActive) {
              document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
              correspondingLinks.forEach(link => link.classList.add('active'));
            }
          }
        });
      });
      // Ensure home is active initially
      document.querySelectorAll('.nav-link[href="#home"]').forEach(link => link.classList.add('active'));
    }

    // 4. Mobile Nav Toggle
    if (els.mobileNavToggle && els.navLinksContainer) {
      els.mobileNavToggle.addEventListener('click', () => {
        const isExpanded = els.mobileNavToggle.getAttribute('aria-expanded') === 'true';
        els.mobileNavToggle.setAttribute('aria-expanded', !isExpanded);
        els.navLinksContainer.classList.toggle('is-visible');
        document.body.classList.toggle('nav-open'); // To prevent scrolling
      });
      
      // Close nav when a link is clicked
      els.navLinksContainer.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
          els.mobileNavToggle.setAttribute('aria-expanded', 'false');
          els.navLinksContainer.classList.remove('is-visible');
          document.body.classList.remove('nav-open');
        });
      });
    }
  }

  /**
   * Initializes hero animation (SplitType)
   */
  function initHeroAnimation() {
    if (document.body.classList.contains('reduced-motion') || typeof SplitType === 'undefined' || !els.heroHeadline) return;

    splitHeroHeadline = new SplitType(els.heroHeadline, { types: 'lines, words, chars' });
    
    gsap.set(els.heroHeadline, { opacity: 1 }); // Make parent visible
    
    gsap.from(splitHeroHeadline.chars, {
      y: '100%',
      opacity: 0,
      stagger: 0.02,
      duration: 1,
      ease: 'power3.out',
      delay: 0.5, // Delay after header animates in
    });

    gsap.to([els.heroSubheadline, els.scrollPrompt], {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: 'power2.out',
      delay: 1, // After chars start
      stagger: 0.2
    });
  }

  /**
   * Initializes all accessibility features (toggles, shortcuts).
   */
  function initAccessibility() {
    // 1. Settings Modal
    if (els.settingsToggleBtn && els.settingsModal && els.settingsCloseBtn && els.modalBackdrop) {
      els.settingsToggleBtn.addEventListener('click', () => toggleModal(els.settingsModal, true));
      els.settingsCloseBtn.addEventListener('click', () => toggleModal(els.settingsModal, false));
      
      // Toggle logic is handled in initHeroFallback()
    }
    
    // 2. Help Overlay
    if(els.helpToggleBtn && els.keyboardHelp) {
      els.helpToggleBtn.addEventListener('click', () => toggleHelp(true));
    }

    // 3. Bot Modal (re-wired for accessibility)
    if(els.openBotBtn && els.botModal && els.closeBotBtn) {
      els.openBotBtn.addEventListener('click', () => toggleModal(els.botModal, true));
      els.closeBotBtn.addEventListener('click', () => toggleModal(els.botModal, false));
    }
    
    // 4. Modal Backdrop universal close
    els.modalBackdrop.addEventListener('click', () => {
      toggleModal(els.settingsModal, false);
      toggleModal(els.botModal, false);
    });

    // 5. Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      // Don't run shortcuts if user is typing in a form
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      const key = e.key.toLowerCase();
      
      if (e.key === 'Escape') {
        toggleModal(els.settingsModal, false);
        toggleModal(els.botModal, false);
        toggleHelp(false);
      }
      
      if (key === '?') {
        e.preventDefault();
        toggleHelp(); // Toggle
      }

      if (key === 'h') {
        e.preventDefault();
        els.siteHeader.querySelector('a[href="#home"]').click();
      }
      
      if (key === 's') {
        e.preventDefault();
        document.getElementById('main-content')?.focus({ preventScroll: true });
        // Manually scroll
        if(lenis) lenis.scrollTo('#main-content', { offset: -80 });
        else window.scrollTo(0, document.getElementById('main-content').offsetTop - 80);
      }
      
      if (key === 'm') {
        e.preventDefault();
        toggleModal(els.botModal, true);
        els.modalChatInput?.focus();
      }
    });
  }

  /**
   * Manages hero video/image fallback based on user settings and device.
   */
  function initHeroFallback() {
    if (!els.heroVideo || !els.heroStatic || !els.motionToggle) return;
    
    // Check initial state
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const prefersReducedData = navigator.connection?.saveData === true;
    const isMobile = window.innerWidth < 768;

    let motionEnabled = !prefersReducedMotion && !prefersReducedData && !isMobile;
    
    // Set initial state of the toggle and body
    els.motionToggle.checked = motionEnabled;
    setMotion(motionEnabled);

    // Listen for toggle changes
    els.motionToggle.addEventListener('change', (e) => {
      setMotion(e.target.checked);
    });
    
    // Listen for OS-level changes
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
      if (e.matches) {
        setMotion(false);
        els.motionToggle.checked = false;
      }
    });
  }
  
  /**
   * Helper: Toggles motion on/off
   * @param {boolean} enabled - True to enable motion, false to disable.
   */
  function setMotion(enabled) {
    if (!els.heroVideo || !els.heroStatic) return;

    if (enabled) {
      document.body.classList.remove('reduced-motion');
      els.heroStatic.style.display = 'none';
      els.heroVideo.style.display = 'block';
      els.heroVideo.play().catch(e => console.warn("Video play was interrupted."));
      if(lenis) lenis.start();
      console.log("Motion ENABLED");
    } else {
      document.body.classList.add('reduced-motion');
      els.heroVideo.style.display = 'none';
      els.heroVideo.pause();
      els.heroStatic.style.display = 'block';
      if(lenis) lenis.stop();
      console.log("Motion DISABLED");
    }
  }
  
  /**
   * Helper: Toggles a modal open or closed.
   * @param {HTMLElement} modal - The modal element to toggle.
   * @param {boolean} forceOpen - True to force open, false to force close.
   */
  function toggleModal(modal, forceOpen) {
    if (!modal || !els.modalBackdrop) return;
    
    const isVisible = modal.classList.contains('is-visible');
    const show = forceOpen === undefined ? !isVisible : forceOpen;

    if (show) {
      modal.removeAttribute('hidden');
      els.modalBackdrop.removeAttribute('hidden');
      // Force reflow
      void modal.offsetWidth;
      void els.modalBackdrop.offsetWidth;
      
      modal.classList.add('is-visible');
      els.modalBackdrop.classList.add('is-visible');
      modal.setAttribute('aria-hidden', 'false');
    } else {
      modal.classList.remove('is-visible');
      els.modalBackdrop.classList.remove('is-visible');
      modal.setAttribute('aria-hidden', 'true');
      
      // Hide after animation
      modal.addEventListener('transitionend', () => {
        if (!modal.classList.contains('is-visible')) {
          modal.setAttribute('hidden', 'true');
        }
      }, { once: true });
      els.modalBackdrop.addEventListener('transitionend', () => {
        if (!els.modalBackdrop.classList.contains('is-visible')) {
          els.modalBackdrop.setAttribute('hidden', 'true');
        }
      }, { once: true });
    }
  }

  /**
   * Helper: Toggles the keyboard help overlay.
   * @param {boolean} forceOpen - True to force open, false to force close.
   */
  function toggleHelp(forceOpen) {
    if (!els.keyboardHelp) return;
    const isVisible = els.keyboardHelp.classList.contains('is-visible');
    const show = forceOpen === undefined ? !isVisible : forceOpen;

    if (show) {
      els.keyboardHelp.removeAttribute('hidden');
      void els.keyboardHelp.offsetWidth; // reflow
      els.keyboardHelp.classList.add('is-visible');
      els.helpToggleBtn?.setAttribute('aria-expanded', 'true');
    } else {
      els.keyboardHelp.classList.remove('is-visible');
      els.helpToggleBtn?.setAttribute('aria-expanded', 'false');
      els.keyboardHelp.addEventListener('transitionend', () => {
        if (!els.keyboardHelp.classList.contains('is-visible')) {
          els.keyboardHelp.setAttribute('hidden', 'true');
        }
      }, { once: true });
    }
  }

  /**
   * Initializes all scroll-triggered animations for site content.
   */
  function initSiteAnimations() {
    if (document.body.classList.contains('reduced-motion') || typeof gsap === 'undefined') {
      return;
    }

    console.log("Initializing main site animations...");

    // Generic "reveal-up" class
    gsap.utils.toArray('.reveal-up').forEach(elem => {
      elem.classList.add('gsap-reveal-active'); // Add class for CSS targeting if needed
      gsap.fromTo(elem, 
        { opacity: 0, y: 50 }, 
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: elem,
            start: 'top 88%',
            once: true
          }
        }
      );
    });
    
    // Journal Image Reveal (from original)
    if(document.querySelector('.journal-image-container')) {
      gsap.fromTo('.journal-image-container',
        { clipPath: 'inset(10% 20% 10% 20%)', opacity: 0, scale: 1.1 },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          opacity: 1,
          scale: 1,
          duration: 1.5,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: '.journal-image-container',
            start: 'top 85%',
            once: true
          }
        }
      );
    }

    // Vision Counter Animation (from original)
    if (els.userCounter) {
      gsap.to(els.userCounter, {
        textContent: 100000,
        duration: 3,
        ease: "power2.inOut",
        snap: { textContent: 1 },
        scrollTrigger: {
          trigger: els.userCounter,
          start: "top 80%",
          once: true
        },
        onUpdate: function() {
          this.targets()[0].innerHTML =
            Math.ceil(this.targets()[0].textContent).toLocaleString('en-US') + "+";
        }
      });
    }
  }

  /**
   * Initializes both inline and modal chatbot logic.
   */
  function initChatbot() {
    const botResponses = {
      "greeting": "Hello! How can I assist you today on your journey to digital clarity?",
      "default": "That's an interesting point. While this demo is limited, the full MehfoozBot explores topics like that in detail.",
      "misinformation": "Spotting misinformation involves a few key steps: Check the source's credibility, look for supporting evidence, be wary of emotionally charged language, and check the date.",
      "safety": "Online safety basics include using strong, unique passwords, enabling two-factor authentication, and being cautious about links or attachments.",
      "story": "Mehfooz began from listening to the community in Skardu. We realized the need wasn't just *more* tech, but *understanding* tech. You can read more in the 'Journal' section.",
      "ulema": "We proudly partner with local Ulema (religious leaders). They serve as trusted community voices, helping bridge traditional wisdom with essential digital literacy skills."
    };

    const promptQuestions = {
      "How do you work?": "ulema",
      "What's your story?": "story",
      "Spotting fake news?": "misinformation",
      "Staying safe online?": "safety"
    };
    
    const modalQuestions = [
      "How can I spot fake news?",
      "Is my WhatsApp safe?",
      "What is misinformation?"
    ];
    
    function getBotResponse(userInput) {
      const lowerInput = userInput.toLowerCase();
      for (const [prompt, key] of Object.entries(promptQuestions)) {
        if (userInput.toLowerCase() === prompt.toLowerCase()) return botResponses[key];
      }
      if (modalQuestions.includes(userInput)) {
        if (lowerInput.includes('fake news') || lowerInput.includes('misinformation')) return botResponses.misinformation;
        if (lowerInput.includes('whatsapp') || lowerInput.includes('safe')) return botResponses.safety;
      }
      if (lowerInput.includes('fake news') || lowerInput.includes('misinformation')) return botResponses.misinformation;
      if (lowerInput.includes('safe') || lowerInput.includes('security') || lowerInput.includes('password')) return botResponses.safety;
      if (lowerInput.includes('story') || lowerInput.includes('who are you') || lowerInput.includes('about')) return botResponses.story;
      if (lowerInput.includes('ulema') || lowerInput.includes('leaders') || lowerInput.includes('work')) return botResponses.ulema;
      if (lowerInput.includes('hello') || lowerInput.includes('hi')) return botResponses.greeting;
      return botResponses.default;
    }

    function addChatMessage(message, sender, targetLog, isImmediate = false) {
      if (!targetLog) return;
      const bubble = document.createElement('div');
      bubble.className = `chat-bubble ${sender}-bubble`;
      bubble.textContent = message;
      targetLog.appendChild(bubble);

      if (typeof gsap !== 'undefined' && !document.body.classList.contains('reduced-motion')) {
        gsap.from(bubble, { opacity: 0, y: 20, duration: 0.5, delay: isImmediate ? 0 : 0.2 });
        gsap.to(targetLog, { duration: 0.5, scrollTo: { y: "max", autoKill: false }, ease: "power2.out" });
      } else {
        targetLog.scrollTop = targetLog.scrollHeight;
      }
    }
    
    function handleBotUserInput(input, targetLog, targetInput, targetPromptsContainer) {
      if (!targetLog || !targetInput) return;
      const trimmedInput = input.trim();
      if (trimmedInput) {
        addChatMessage(trimmedInput, 'user', targetLog, true);
        targetInput.value = "";
        targetInput.disabled = true;
        if (targetPromptsContainer) {
          targetPromptsContainer.style.pointerEvents = 'none';
          if(gsap) gsap.to(targetPromptsContainer.children, { opacity: 0.5, duration: 0.3 });
        }
        
        setTimeout(() => {
          const response = getBotResponse(trimmedInput);
          addChatMessage(response, 'bot', targetLog);
          targetInput.disabled = false;
          targetInput.focus();
          if (targetPromptsContainer) {
            targetPromptsContainer.style.pointerEvents = 'auto';
            if(gsap) gsap.to(targetPromptsContainer.children, { opacity: 1, duration: 0.3 });
          }
        }, 1000 + Math.random() * 400);
      }
    }
    
    // Setup for Inline Bot
    if (els.chatLog && els.chatForm && els.chatInput && els.promptButtonsContainer) {
      els.chatForm.addEventListener('submit', e => {
        e.preventDefault();
        handleBotUserInput(els.chatInput.value, els.chatLog, els.chatInput, els.promptButtonsContainer);
      });
      
      Object.keys(promptQuestions).forEach(question => {
        const button = document.createElement('button');
        button.type = "button";
        button.className = "chat-prompt-btn";
        button.textContent = question;
        button.onclick = () => { handleBotUserInput(question, els.chatLog, els.chatInput, els.promptButtonsContainer); };
        els.promptButtonsContainer.appendChild(button);
      });
      addChatMessage(botResponses.greeting, 'bot', els.chatLog, true);
    }
    
    // Setup for Modal Bot
    if (els.botModal && els.modalChatLog && els.modalChatForm && els.modalChatInput && els.modalPillContainer) {
      els.modalChatForm.addEventListener('submit', e => {
        e.preventDefault();
        handleBotUserInput(els.modalChatInput.value, els.modalChatLog, els.modalChatInput, els.modalPillContainer);
      });
      
      els.modalPillContainer.innerHTML = ""; // Clear existing
      modalQuestions.forEach(q => {
        const pill = document.createElement('button');
        pill.type = 'button';
        pill.className = 'chat-prompt-btn';
        pill.textContent = q;
        pill.onclick = () => { handleBotUserInput(q, els.modalChatLog, els.modalChatInput, els.modalPillContainer); };
        els.modalPillContainer.appendChild(pill);
      });
      
      // Add greeting when modal is opened for the first time
      els.openBotBtn?.addEventListener('click', () => {
        if (els.modalChatLog.children.length === 0) {
          addChatMessage("Hello! Ask a question or click a topic.", 'bot', els.modalChatLog, true);
        }
        els.modalChatInput.focus();
      });
    }
  }

  /**
   * Initializes the contact form submission logic.
   */
  function initContactForm() {
    if (!els.contactForm || !els.formSuccess) return;

    els.contactForm.addEventListener('submit', e => {
      e.preventDefault();
      
      // No real submission, just show success
      if (typeof gsap !== 'undefined' && !document.body.classList.contains('reduced-motion')) {
        gsap.to(els.contactForm, {
          opacity: 0, 
          duration: 0.5, 
          height: 0, 
          ease: 'power2.in',
          onComplete: () => {
            els.contactForm.style.display = 'none';
            els.formSuccess.classList.remove('hidden');
            gsap.from(els.formSuccess, { opacity: 0, y: 20, duration: 0.6, ease: 'power2.out' });
          }
        });
      } else {
        // Fallback for reduced motion
        els.contactForm.style.display = 'none';
        els.formSuccess.classList.remove('hidden');
      }
    });
  }

  /**
   * Initializes the custom cursor movement.
   */
  function initCustomCursor() {
    if (!els.cursorDot || !els.cursorLight || document.body.classList.contains('reduced-motion')) return;

    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    window.addEventListener('mousemove', e => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    if (typeof gsap !== 'undefined') {
      gsap.ticker.add(() => {
        gsap.to(els.cursorDot, { duration: 0.2, x: mouse.x, y: mouse.y });
        gsap.to(els.cursorLight, { duration: 0.5, x: mouse.x, y: mouse.y, ease: 'power2.out' });
      });
    }
  }

}); // End DOMContentLoaded
