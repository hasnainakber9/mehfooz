/* ============================================================
   MEHFOOZ INTERNET — script.js
   Preloader runs FIRST, before any optional dependency.
   All third-party libs (Lenis, GSAP) are guarded with typeof checks.
============================================================ */

// ─── PRELOADER: runs immediately, zero dependencies ──────────────────────────
(function () {
  var loader = document.getElementById('loadingScreen');
  var loadBar = document.querySelector('.loading-bar');
  var loadPct = document.querySelector('.loader-percent');
  if (!loader) return;
  var progress = 0;
  var done = false;
  function setProgress(val) {
    if (loadBar) loadBar.style.width = val + '%';
    if (loadPct) loadPct.textContent = Math.floor(val) + '%';
  }
  function revealLoader() {
    if (done) return;
    done = true;
    setProgress(100);
    setTimeout(function () {
      loader.style.transition = 'transform 1.3s cubic-bezier(0.77,0,0.18,1)';
      loader.style.transform = 'translateY(-100%)';
      setTimeout(function () {
        loader.style.display = 'none';
        document.dispatchEvent(new Event('preloader:done'));
      }, 1400);
    }, 300);
  }
  var interval = setInterval(function () {
    if (done) { clearInterval(interval); return; }
    progress += (Math.random() * 15) + 5;
    if (progress >= 100) {
      clearInterval(interval);
      revealLoader();
    } else {
      setProgress(progress);
    }
  }, 90);
  // Hard fallback: force reveal after 4s no matter what
  setTimeout(revealLoader, 4000);
}());

// ─── MAIN APP ────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
  // 1. LENIS SMOOTH SCROLL — safe init
  var lenis = null;
  if (typeof Lenis !== 'undefined') {
    try {
      lenis = new Lenis({
        duration: 1.4,
        easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
        smooth: true
      });
      (function tick(time) { lenis.raf(time); requestAnimationFrame(tick); }(0));
    } catch (e) {
      console.warn('Lenis init failed:', e);
      lenis = null;
    }
  }

  // 2. GSAP + ScrollTrigger — safe register
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // 3. HERO REVEAL — fires when preloader signals done
  var heroSelectors = [
    '.hero-eyebrow',
    '.hero-line-1',
    '.hero-line-2',
    '.hero-line-3',
    '.hero-subtitle',
    '.hero-actions',
    '.hero-stats'
  ];
  function revealHero() {
    if (typeof gsap !== 'undefined') {
      gsap.to(heroSelectors, {
        opacity: 1,
        y: 0,
        duration: 1.1,
        stagger: 0.13,
        delay: 0.15,
        ease: 'power3.out',
        clearProps: 'transform'
      });
    } else {
      // Pure CSS fallback
      heroSelectors.forEach(function (sel, i) {
        var el = document.querySelector(sel);
        if (!el) return;
        var d = 0.15 + i * 0.13;
        el.style.transition = 'opacity 1s ease ' + d + 's, transform 1s ease ' + d + 's';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    }
    animateCounters();
  }
  document.addEventListener('preloader:done', revealHero);

  // 4. CUSTOM CURSOR
  var cursorDot = document.getElementById('cursor-dot');
  var cursorRing = document.getElementById('cursor-ring');
  var cursorLight = document.getElementById('cursor-light');
  if (cursorDot && typeof gsap !== 'undefined') {
    window.addEventListener('mousemove', function (e) {
      gsap.to(cursorDot, { x: e.clientX, y: e.clientY, duration: 0.08, ease: 'none' });
      gsap.to(cursorRing, { x: e.clientX, y: e.clientY, duration: 0.28, ease: 'power2.out' });
      gsap.to(cursorLight, { x: e.clientX, y: e.clientY, duration: 0.9, ease: 'power3.out' });
    });
    document.querySelectorAll('a, button, .magnetic-card, .program-card, .blog-card').forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        gsap.to(cursorRing, { width: 56, height: 56, borderColor: 'rgba(218,165,32,0.75)', duration: 0.3 });
        gsap.to(cursorDot, { width: 3, height: 3, duration: 0.3 });
      });
      el.addEventListener('mouseleave', function () {
        gsap.to(cursorRing, { width: 36, height: 36, borderColor: 'rgba(218,165,32,0.4)', duration: 0.3 });
        gsap.to(cursorDot, { width: 5, height: 5, duration: 0.3 });
      });
    });
  }

  // 5. MAGNETIC ELEMENTS
  if (typeof gsap !== 'undefined') {
    document.querySelectorAll('.magnetic').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var rect = el.getBoundingClientRect();
        var strength = parseFloat(el.getAttribute('data-strength') || '25');
        var cx = rect.left + rect.width / 2;
        var cy = rect.top + rect.height / 2;
        gsap.to(el, {
          x: (e.clientX - cx) * (strength / 100),
          y: (e.clientY - cy) * (strength / 100),
          duration: 0.4, ease: 'power2.out'
        });
      });
      el.addEventListener('mouseleave', function () {
        gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
      });
    });
  }

  // 6. NAVIGATION SCROLL STATE + MOBILE MENU
  var nav = document.querySelector('.fixed-nav');
  var mobileMenu = document.querySelector('.mobile-menu');
  var menuToggle = document.querySelector('.menu-toggle');
  if (nav) {
    window.addEventListener('scroll', function () {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function () {
      var open = mobileMenu.classList.toggle('open');
      menuToggle.classList.toggle('active', open);
    });
  }
  document.querySelectorAll('.mobile-link, .mobile-cta').forEach(function (link) {
    link.addEventListener('click', function () {
      if (mobileMenu) mobileMenu.classList.remove('open');
      if (menuToggle) menuToggle.classList.remove('active');
    });
  });

  // 7. SMOOTH SCROLL — anchor links
  document.querySelectorAll('a[href^=\"#\"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(target, { offset: -80, duration: 1.6 });
      } else {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // 8. COSMIC CANVAS
  var canvas = document.getElementById('cosmicBackground');
  if (canvas) {
    var ctx = canvas.getContext('2d');
    var W = canvas.width = window.innerWidth;
    var H = canvas.height = window.innerHeight;
    var stars = Array.from({ length: 180 }, function () {
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        size: Math.random() * 1.5 + 0.2,
        speed: Math.random() * 0.3 + 0.05,
        opacity: Math.random() * 0.6 + 0.2,
        twinkle: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.015 + 0.005
      };
    });
    function animateCosmos() {
      ctx.clearRect(0, 0, W, H);
      var grad = ctx.createRadialGradient(W * 0.5, H * 0.45, 0, W * 0.5, H * 0.45, W * 0.42);
      grad.addColorStop(0, 'rgba(218,165,32,0.03)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
      stars.forEach(function (star) {
        star.twinkle += star.twinkleSpeed;
        var alpha = star.opacity * (0.55 + 0.45 * Math.sin(star.twinkle));
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(218,165,32,' + alpha + ')';
        ctx.fill();
        star.y -= star.speed;
        if (star.y < -2) { star.y = H + 2; star.x = Math.random() * W; }
      });
      requestAnimationFrame(animateCosmos);
    }
    animateCosmos();
    window.addEventListener('resize', function () {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    });
  }

  // 9. STAT COUNTERS
  function animateCounters() {
    document.querySelectorAll('.stat-number').forEach(function (el) {
      var target = parseInt(el.getAttribute('data-target') || '0');
      if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.fromTo(el, { innerText: 0 }, {
          innerText: target,
          duration: 2.5,
          ease: 'power2.out',
          snap: { innerText: 1 },
          scrollTrigger: { trigger: el, start: 'top 90%', once: true }
        });
      } else {
        var current = 0;
        var increment = target / 60;
        var t = setInterval(function () {
          current += increment;
          if (current >= target) { current = target; clearInterval(t); }
          el.textContent = Math.floor(current).toLocaleString();
        }, 40);
      }
    });
  }

  // 10. FAQ ACCORDION
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var answer = btn.nextElementSibling;
      var wasOpen = btn.getAttribute('aria-expanded') === 'true';
      document.querySelectorAll('.faq-question').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
      document.querySelectorAll('.faq-answer').forEach(function (a) { a.classList.remove('open'); });
      if (!wasOpen) {
        btn.setAttribute('aria-expanded', 'true');
        answer.classList.add('open');
      }
    });
  });

  // 11. SCROLL FADE-UP
  var fadeTargets = document.querySelectorAll(
    '.pillar-card, .glass-card, .program-card, .testimonial-card, .blog-card, .split-grid, .faq-grid, .contact-inner, .fade-up'
  );
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    fadeTargets.forEach(function (el, i) {
      gsap.fromTo(el,
        { opacity: 0, y: 28 },
        {
          opacity: 1, y: 0,
          duration: 0.85,
          ease: 'power3.out',
          delay: (i % 4) * 0.08,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true }
        }
      );
    });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    fadeTargets.forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(28px)';
      el.style.transition = 'opacity 0.85s ease, transform 0.85s ease';
      io.observe(el);
    });
  }

  // 12. CHAT BOT
  var botModal = document.getElementById('chatModal');
  var openBtn = document.getElementById('openChat');
  var openBtnMob = document.querySelector('.mobile-cta');
  var closeBtn = document.getElementById('closeChatBtn');
  var chatForm = document.querySelector('.chat-input-area');
  var chatInput = document.getElementById('chat-input');
  var chatLog = document.getElementById('chat-log');
  var backdrop = document.getElementById('closeChat');
  var sessionId = Math.random().toString(36).substring(2, 10);

  var SYSTEM_PROMPT = 'You are the Mehfooz Assistant — a helpful, warm digital literacy expert for communities in Gilgit Baltistan, Pakistan. Help users with digital safety, fact-checking, cybersecurity, and misinformation. Be concise (2–3 sentences), friendly, and practical.';

  var conversationHistory = [{ role: 'system', content: SYSTEM_PROMPT }];

  function openModal() {
    if (!botModal) return;
    botModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    var panel = document.querySelector('.chat-panel');
    if (panel && typeof gsap !== 'undefined') {
      gsap.fromTo(panel, { scale: 0.92, y: 24, opacity: 0 }, { scale: 1, y: 0, opacity: 1, duration: 0.45, ease: 'back.out(1.4)' });
    }
    if (chatInput) chatInput.focus();
  }

  function closeModal() {
    if (!botModal) return;
    document.body.style.overflow = '';
    var panel = document.querySelector('.chat-panel');
    if (panel && typeof gsap !== 'undefined') {
      gsap.to(panel, { scale: 0.92, y: 24, opacity: 0, duration: 0.3, ease: 'power2.in', onComplete: function () { botModal.classList.add('hidden'); } });
    } else {
      botModal.classList.add('hidden');
    }
  }

  if (openBtn) openBtn.addEventListener('click', openModal);
  if (openBtnMob) openBtnMob.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  async function callAI(userMessage) {
    conversationHistory.push({ role: 'user', content: userMessage });
    try {
      var r = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-session-id': sessionId },
        body: JSON.stringify({ message: userMessage }),
        signal: AbortSignal.timeout(10000)
      });
      if (r.ok) {
        var d = await r.json();
        conversationHistory.push({ role: 'assistant', content: d.reply });
        return d.reply;
      }
    } catch (_) {}
    return \"I'm having trouble connecting to the AI. Please check your internet or try again later!\";
  }

  if (chatForm) {
    chatForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      var text = chatInput ? chatInput.value.trim() : '';
      if (!text) return;
      addMessage('user', text);
      if (chatInput) { chatInput.value = ''; chatInput.disabled = true; }
      var typingEl = addMessage('bot', '...');
      try {
        var reply = await callAI(text);
        typingEl.textContent = reply;
      } catch (err) {
        typingEl.textContent = 'Could not connect. Please try again.';
      } finally {
        if (chatInput) { chatInput.disabled = false; chatInput.focus(); }
        if (chatLog) chatLog.scrollTop = chatLog.scrollHeight;
      }
    });
  }

  function addMessage(sender, text) {
    var div = document.createElement('div');
    div.className = 'chat-msg msg-' + sender;
    div.textContent = text;
    if (chatLog) { chatLog.appendChild(div); chatLog.scrollTop = chatLog.scrollHeight; }
    return div;
  }

  // 13. CONTACT FORM
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = contactForm.querySelector('.btn-primary');
      if (btn) btn.textContent = 'Message Sent ✓';
      setTimeout(function () {
        if (btn) btn.innerHTML = 'Send Message <span class=\"btn-icon\">→</span>';
        contactForm.reset();
      }, 3000);
    });
  }
});
