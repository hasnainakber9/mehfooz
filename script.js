document.addEventListener('DOMContentLoaded', () => {

    // =============================================================
    //  1. LENIS SMOOTH SCROLL
    // =============================================================
    const lenis = new Lenis({
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true
    });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    gsap.registerPlugin(ScrollTrigger);

    // =============================================================
    //  2. PRELOADER
    // =============================================================
    const loader  = document.getElementById('loadingScreen');
    const loadBar = document.querySelector('.loading-bar');
    const loadPct = document.querySelector('.loader-percent');

    // Safety: if loader element missing, skip straight to reveal
    if (!loader) { revealSite(); }

    let progress  = 0;
    let done      = false;

    const loadInterval = setInterval(() => {
        if (done) return;
        progress += Math.random() * 14 + 4;   // faster increments
        if (progress >= 100) {
            progress = 100;
            done = true;
            clearInterval(loadInterval);
            // Update UI to 100% then reveal after brief pause
            if (loadBar) loadBar.style.width = '100%';
            if (loadPct) loadPct.textContent = '100%';
            setTimeout(revealSite, 400);
            return;
        }
        if (loadBar) loadBar.style.width = `${progress}%`;
        if (loadPct) loadPct.textContent  = `${Math.floor(progress)}%`;
    }, 100);

    function revealSite() {
        // Ensure loader hides even if GSAP fails
        if (loader) {
            loader.style.transition = 'transform 1.2s cubic-bezier(0.19,1,0.22,1)';
            loader.style.transform  = 'translateY(-100%)';
            setTimeout(() => { loader.style.display = 'none'; }, 1300);
        }

        // Animate hero elements in — use class selector with fallback
        const heroTargets = [
            '.hero-eyebrow',
            '.hero-line-1',
            '.hero-line-2',
            '.hero-line-3',
            '.hero-subtitle',
            '.hero-actions',
            '.hero-stats'
        ];

        heroTargets.forEach((sel, i) => {
            const el = document.querySelector(sel);
            if (!el) return;
            // CSS fallback: reset opacity/transform via style directly
            el.style.transition = `opacity 0.9s ease ${0.3 + i * 0.12}s, transform 0.9s ease ${0.3 + i * 0.12}s`;
            el.style.opacity    = '1';
            el.style.transform  = 'translateY(0)';
        });

        // GSAP enhancement if available
        if (typeof gsap !== 'undefined') {
            gsap.to(heroTargets, {
                opacity: 1,
                y: 0,
                duration: 1,
                stagger: 0.12,
                ease: 'power3.out',
                delay: 0.4,
                clearProps: 'transform'
            });
        }

        animateCounters();
    }

    // =============================================================
    //  3. CUSTOM CURSOR
    // =============================================================
    const cursorDot  = document.getElementById('cursor-dot');
    const cursorRing = document.getElementById('cursor-ring');
    const cursorLight = document.getElementById('cursor-light');

    let mouseX = 0, mouseY = 0;
    let ringX  = 0, ringY  = 0;
    let lightX = 0, lightY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX; mouseY = e.clientY;
        gsap.to(cursorDot,   { x: mouseX, y: mouseY, duration: 0.08, ease: 'none' });
        gsap.to(cursorRing,  { x: mouseX, y: mouseY, duration: 0.25, ease: 'power2.out' });
        gsap.to(cursorLight, { x: mouseX, y: mouseY, duration: 0.8, ease: 'power3.out' });
    });

    // Hover states for interactive elements
    const interactiveEls = document.querySelectorAll('a, button, .magnetic-card, .faq-question, .program-card, .blog-card');
    interactiveEls.forEach(el => {
        el.addEventListener('mouseenter', () => {
            gsap.to(cursorRing, { width: 56, height: 56, borderColor: 'rgba(218,165,32,0.7)', duration: 0.3 });
            gsap.to(cursorDot,  { width: 3, height: 3, duration: 0.3 });
        });
        el.addEventListener('mouseleave', () => {
            gsap.to(cursorRing, { width: 36, height: 36, borderColor: 'rgba(218,165,32,0.4)', duration: 0.3 });
            gsap.to(cursorDot,  { width: 5, height: 5, duration: 0.3 });
        });
    });

    // =============================================================
    //  4. MAGNETIC ELEMENTS
    // =============================================================
    document.querySelectorAll('.magnetic').forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const strength = parseFloat(el.getAttribute('data-strength') || 25);
            const cx = rect.left + rect.width  / 2;
            const cy = rect.top  + rect.height / 2;
            gsap.to(el, {
                x: (e.clientX - cx) * (strength / 100),
                y: (e.clientY - cy) * (strength / 100),
                duration: 0.4, ease: 'power2.out'
            });
        });
        el.addEventListener('mouseleave', () => {
            gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
        });
    });

    // =============================================================
    //  5. NAVIGATION: SCROLL STATE + MOBILE MENU
    // =============================================================
    const nav        = document.getElementById('mainNav');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuToggle = document.getElementById('mobile-nav-toggle');

    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });

    menuToggle && menuToggle.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.toggle('open');
        menuToggle.classList.toggle('active', isOpen);
    });

    // Close mobile menu on link click
    document.querySelectorAll('.mobile-link, .mobile-cta').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            menuToggle && menuToggle.classList.remove('active');
        });
    });

    // =============================================================
    //  6. COSMIC BACKGROUND CANVAS
    // =============================================================
    const canvas = document.getElementById('cosmicBackground');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let W = canvas.width  = window.innerWidth;
        let H = canvas.height = window.innerHeight;

        const stars = Array.from({ length: 180 }, () => ({
            x:     Math.random() * W,
            y:     Math.random() * H,
            size:  Math.random() * 1.6 + 0.2,
            speed: Math.random() * 0.35 + 0.05,
            opacity: Math.random() * 0.6 + 0.2,
            twinkle: Math.random() * Math.PI * 2,
            twinkleSpeed: Math.random() * 0.015 + 0.005
        }));

        function animateCosmos() {
            ctx.clearRect(0, 0, W, H);
            stars.forEach(s => {
                s.twinkle += s.twinkleSpeed;
                const alpha = s.opacity * (0.6 + 0.4 * Math.sin(s.twinkle));
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(218, 165, 32, ${alpha})`;
                ctx.fill();
                s.y -= s.speed;
                if (s.y < -2) { s.y = H + 2; s.x = Math.random() * W; }
            });

            // Ambient orb
            const gradient = ctx.createRadialGradient(W * 0.5, H * 0.5, 0, W * 0.5, H * 0.5, W * 0.4);
            gradient.addColorStop(0, 'rgba(218, 165, 32, 0.025)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, W, H);

            requestAnimationFrame(animateCosmos);
        }
        animateCosmos();

        window.addEventListener('resize', () => {
            W = canvas.width  = window.innerWidth;
            H = canvas.height = window.innerHeight;
        });
    }

    // =============================================================
    //  7. STAT COUNTERS
    // =============================================================
    function animateCounters() {
        const counters = [
            { id: 'user-counter',     target: 15000 },
            { id: 'platform-counter', target: 45    }
        ];
        counters.forEach(({ id, target }) => {
            const el = document.getElementById(id);
            if (!el) return;
            gsap.fromTo(el, { innerText: 0 }, {
                innerText: target,
                duration: 2.5,
                ease: 'power2.out',
                snap: { innerText: 1 },
                scrollTrigger: { trigger: el, start: 'top 90%', once: true }
            });
        });
    }

    // =============================================================
    //  8. FAQ ACCORDION
    // =============================================================
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const answer   = btn.nextElementSibling;
            const isOpen   = btn.getAttribute('aria-expanded') === 'true';
            const allBtns  = document.querySelectorAll('.faq-question');
            const allAns   = document.querySelectorAll('.faq-answer');

            // Close all others
            allBtns.forEach(b => b.setAttribute('aria-expanded', 'false'));
            allAns.forEach(a => a.classList.remove('open'));

            // Toggle this one
            if (!isOpen) {
                btn.setAttribute('aria-expanded', 'true');
                answer.classList.add('open');
            }
        });
    });

    // =============================================================
    //  9. SCROLL-TRIGGERED FADE-UPS
    // =============================================================
    const fadeEls = document.querySelectorAll('.pillar-card, .glass-card, .program-card, .testimonial-card, .blog-card, .split-grid, .faq-grid, .contact-inner');
    fadeEls.forEach((el, i) => {
        el.classList.add('fade-up');
        ScrollTrigger.create({
            trigger: el,
            start: 'top 88%',
            onEnter: () => {
                setTimeout(() => el.classList.add('visible'), i % 4 * 80);
            },
            once: true
        });
    });

    // =============================================================
    //  10. CHAT BOT — Connected to Backend (with open-source fallback)
    // =============================================================
    const botModal   = document.getElementById('bot-modal');
    const openBtn    = document.getElementById('open-bot-demo-approach');
    const openBtnMob = document.getElementById('open-bot-mobile');
    const closeBtn   = document.getElementById('close-bot-demo');
    const chatForm   = document.getElementById('chat-form');
    const chatInput  = document.getElementById('chat-input');
    const chatLog    = document.getElementById('modal-chat-log');

    // Unique session ID for conversation memory
    const sessionId = Math.random().toString(36).substring(2, 10);

    function openModal() {
        botModal.classList.remove('hidden');
        const panel = document.querySelector('.chat-panel');
        gsap.fromTo(panel,
            { scale: 0.92, y: 24, opacity: 0 },
            { scale: 1, y: 0, opacity: 1, duration: 0.45, ease: 'back.out(1.4)' }
        );
        if (chatLog.children.length === 0) {
            addMessage('bot', 'Hello! I\'m the Mehfooz Assistant. Ask me anything about digital safety, misinformation, or our programs in Gilgit Baltistan. 🌐');
        }
        chatInput.focus();
    }

    function closeModal() {
        const panel = document.querySelector('.chat-panel');
        gsap.to(panel, {
            scale: 0.92, y: 24, opacity: 0, duration: 0.3, ease: 'power2.in',
            onComplete: () => botModal.classList.add('hidden')
        });
    }

    openBtn    && openBtn.addEventListener('click', openModal);
    openBtnMob && openBtnMob.addEventListener('click', () => { closeModal(); setTimeout(openModal, 50); });
    closeBtn   && closeBtn.addEventListener('click', closeModal);

    // Close on backdrop click
    document.getElementById('modal-backdrop') && document.getElementById('modal-backdrop').addEventListener('click', closeModal);

    // ---- AI via open-source fallback (Pollinations) ----
    // Pollinations.ai provides a free, open-source AI completions endpoint.
    // No API key required. Great for demos and open-source projects.
    const SYSTEM_PROMPT = `You are the Mehfooz Assistant — a helpful, warm, and knowledgeable digital literacy expert for communities in Gilgit Baltistan, Pakistan. Your role is to educate people about digital safety, fact-checking, cybersecurity, online privacy, and combating misinformation. Keep responses concise (2-3 sentences), friendly, and practical. If asked about Mehfooz Internet's programs, mention: Community Engagement, Digital Learning Hub, DigiSaheli, MehfoozBot, Campus Programs, and Ulema Training.`;

    // Conversation history for context continuity
    const conversationHistory = [
        { role: 'system', content: SYSTEM_PROMPT }
    ];

    async function callAI(userMessage) {
        conversationHistory.push({ role: 'user', content: userMessage });

        // --- PRIMARY: Try the local backend (server.js) ---
        try {
            const res = await fetch('http://localhost:5000/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-session-id': sessionId
                },
                body: JSON.stringify({ message: userMessage }),
                signal: AbortSignal.timeout(8000)
            });

            if (res.ok) {
                const data = await res.json();
                conversationHistory.push({ role: 'assistant', content: data.reply });
                return data.reply;
            }
        } catch (_) {
            // Backend unavailable — fall through to open-source fallback
        }

        // --- FALLBACK: Pollinations.ai (free, no key needed) ---
        try {
            const messages = conversationHistory.slice(-8); // Last 8 turns for context
            const res = await fetch('https://text.pollinations.ai/openai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'openai',
                    messages: messages,
                    max_tokens: 200,
                    temperature: 0.7,
                    seed: 42
                }),
                signal: AbortSignal.timeout(15000)
            });

            if (!res.ok) throw new Error('Pollinations API error');
            const data = await res.json();
            const reply = data.choices?.[0]?.message?.content?.trim() || 'I\'m here to help with digital literacy questions!';
            conversationHistory.push({ role: 'assistant', content: reply });
            return reply;

        } catch (err) {
            console.warn('AI Fallback Error:', err);
            // Return context-aware offline response
            return getOfflineResponse(userMessage);
        }
    }

    function getOfflineResponse(msg) {
        const m = msg.toLowerCase();
        if (m.includes('misinfo') || m.includes('fake') || m.includes('news')) {
            return 'To spot misinformation: check the source, look for other credible reports, and use fact-checking tools. MehfoozBot can help you verify claims in real-time. 🔍';
        }
        if (m.includes('safe') || m.includes('security') || m.includes('password')) {
            return 'For cyber safety: use strong unique passwords, enable two-factor authentication, and never share personal info with unknown contacts. Our Cyber Safety workshops cover all of this! 🛡️';
        }
        if (m.includes('program') || m.includes('course') || m.includes('learn')) {
            return 'Mehfooz offers: Community Engagement, Campus Programs, DigiSaheli for women, Virtual Events, Mini-Courses, and our Digital Learning Hub. Type "Join a Program" on our homepage to start! 📚';
        }
        if (m.includes('gilgit') || m.includes('baltistan') || m.includes('gb')) {
            return 'Mehfooz Internet is built specifically for Gilgit Baltistan — with offline access, Urdu/local language support, and community-led sessions in even the most remote areas. 🏔️';
        }
        return 'Thank you for reaching out! Mehfooz Internet is dedicated to digital literacy in Gilgit Baltistan. For specific queries, please contact us at hello@mehfooz.internet or explore our programs above. 💬';
    }

    if (chatForm) {
        chatForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const text = chatInput.value.trim();
            if (!text) return;

            addMessage('user', text);
            chatInput.value = '';
            chatInput.disabled = true;

            const typingEl = addMessage('bot', '...');
            typingEl.classList.add('typing');

            try {
                const reply = await callAI(text);
                typingEl.classList.remove('typing');
                typingEl.textContent = reply;
                gsap.fromTo(typingEl, { opacity: 0 }, { opacity: 1, duration: 0.3 });
            } catch (err) {
                typingEl.textContent = 'Could not reach the AI. Please try again or contact us directly.';
                typingEl.style.color = 'var(--c-red)';
            } finally {
                chatInput.disabled = false;
                chatInput.focus();
                chatLog.scrollTop = chatLog.scrollHeight;
            }
        });
    }

    function addMessage(sender, text) {
        const div = document.createElement('div');
        div.className = `chat-msg msg-${sender}`;
        div.textContent = text;
        gsap.fromTo(div,
            { scale: 0.85, opacity: 0, y: 10 },
            { scale: 1, opacity: 1, y: 0, duration: 0.35, ease: 'back.out(1.5)' }
        );
        chatLog.appendChild(div);
        chatLog.scrollTop = chatLog.scrollHeight;
        return div;
    }

    // =============================================================
    //  11. CONTACT FORM (client-side — wire up to backend as needed)
    // =============================================================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('.btn-primary');
            const originalText = btn.querySelector('.btn-text').textContent;
            btn.querySelector('.btn-text').textContent = 'Message Sent ✓';
            btn.style.background = 'var(--c-gold)';
            btn.style.color = '#000';
            setTimeout(() => {
                btn.querySelector('.btn-text').textContent = originalText;
                btn.style.background = '';
                btn.style.color = '';
                contactForm.reset();
            }, 3000);
        });
    }

    // =============================================================
    //  12. NAV LINK SMOOTH SCROLL
    // =============================================================
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                e.preventDefault();
                lenis.scrollTo(target, { offset: -80, duration: 1.6 });
            }
        });
    });

});
