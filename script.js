/* ============================================================
   MEHFOOZ INTERNET — script.js
   Bauhaus Design System · All interactions + AI chat integration
   Zero dependencies except GSAP (guarded), works without it.
   ============================================================ */

'use strict';

/* ─── 1. PRELOADER ────────────────────────────────────────────
   Runs immediately on parse, before DOMContentLoaded.         */
(function () {
    var loader  = document.getElementById('loadingScreen');
    var bar     = document.getElementById('loadingBar');
    var pct     = document.getElementById('loaderPercent');
    if (!loader) return;

    var progress = 0;
    var done = false;

    function setProgress(val) {
        val = Math.min(100, Math.round(val));
        if (bar)  bar.style.width  = val + '%';
        if (pct)  pct.textContent  = val + '%';
    }

    function finish() {
        if (done) return;
        done = true;
        setProgress(100);
        setTimeout(function () {
            loader.style.transition  = 'transform 1.25s cubic-bezier(0.77,0,0.18,1)';
            loader.style.transform   = 'translateY(-100%)';
            setTimeout(function () {
                loader.style.display = 'none';
                document.dispatchEvent(new Event('preloader:done'));
            }, 1350);
        }, 280);
    }

    var iv = setInterval(function () {
        if (done) { clearInterval(iv); return; }
        progress += Math.random() * 14 + 4;
        if (progress >= 100) { clearInterval(iv); finish(); }
        else { setProgress(progress); }
    }, 95);

    // Hard timeout fallback
    setTimeout(finish, 4200);
}());

/* ─── 2. MAIN APP ─────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function () {

    /* ── GSAP + ScrollTrigger safe register ── */
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    /* ── Intersection Observer polyfill-safe fade-up ── */
    var ioFade = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                ioFade.unobserve(e.target);
            }
        });
    }, { threshold: 0.12 });
    document.querySelectorAll('.fade-up').forEach(function (el) { ioFade.observe(el); });

    /* ────────────────────────────────────────────────────────
       3. CUSTOM CURSOR
    ─────────────────────────────────────────────────────────── */
    var curDot  = document.getElementById('cursor-dot');
    var curRing = document.getElementById('cursor-ring');
    var mx = 0, my = 0, rx = 0, ry = 0;

    if (curDot && curRing) {
        window.addEventListener('mousemove', function (e) {
            mx = e.clientX; my = e.clientY;
            curDot.style.left = mx + 'px';
            curDot.style.top  = my + 'px';
        });

        // Laggy ring
        (function animRing() {
            rx += (mx - rx) * 0.14;
            ry += (my - ry) * 0.14;
            curRing.style.left = rx + 'px';
            curRing.style.top  = ry + 'px';
            requestAnimationFrame(animRing);
        }());

        // Hover state
        document.querySelectorAll('a, button, .program-card, .testi-card, .tool-card, .blog-card, .pillar-card').forEach(function (el) {
            el.addEventListener('mouseenter', function () { curRing.classList.add('is-hovering'); });
            el.addEventListener('mouseleave', function () { curRing.classList.remove('is-hovering'); });
        });

        // Hide on touch
        window.addEventListener('touchstart', function () {
            if (curDot)  curDot.style.display  = 'none';
            if (curRing) curRing.style.display = 'none';
        }, { once: true });
    }

    /* ────────────────────────────────────────────────────────
       4. HERO REVEAL (fires after preloader)
    ─────────────────────────────────────────────────────────── */
    function revealHero() {
        var items = [
            '.hero-eyebrow', '.hl-1', '.hl-2', '.hl-3', '.hl-4',
            '.hero-subtitle', '.hero-actions', '.hero-stats'
        ];
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(items, { opacity: 0, y: 50 }, {
                opacity: 1, y: 0, duration: 1.1,
                stagger: 0.11, ease: 'power3.out', delay: 0.1,
                clearProps: 'transform'
            });
            gsap.fromTo('.hero-geo-col', { opacity: 0, x: 60 }, {
                opacity: 1, x: 0, duration: 1.2, ease: 'power3.out', delay: .25
            });
        } else {
            items.forEach(function (sel, i) {
                var el = document.querySelector(sel);
                if (!el) return;
                var d = 0.1 + i * 0.11;
                el.style.transition = 'opacity 1s ease ' + d + 's, transform 1s ease ' + d + 's';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            });
        }
        startHeroCounters();
    }
    document.addEventListener('preloader:done', revealHero);

    /* ────────────────────────────────────────────────────────
       5. HERO COUNTERS
    ─────────────────────────────────────────────────────────── */
    function startHeroCounters() {
        [
            { id: 'user-counter',     target: 15000, suffix: '+' },
            { id: 'platform-counter', target: 45,    suffix: '+' }
        ].forEach(function (cfg) {
            var el = document.getElementById(cfg.id);
            if (!el) return;
            var start = 0;
            var step  = cfg.target / 60;
            var iv2 = setInterval(function () {
                start = Math.min(start + step * 1.8, cfg.target);
                el.textContent = Math.ceil(start).toLocaleString();
                if (start >= cfg.target) clearInterval(iv2);
            }, 28);
        });
    }

    /* ────────────────────────────────────────────────────────
       6. STATS BAND COUNTERS (scroll-triggered)
    ─────────────────────────────────────────────────────────── */
    var ioStats = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
            if (!e.isIntersecting) return;
            var el  = e.target;
            var raw = el.getAttribute('data-target');
            if (!raw || raw === '') return;
            var target = parseInt(raw, 10);
            if (isNaN(target)) return;

            var current = 0;
            var increment = target / 70;
            var t = setInterval(function () {
                current = Math.min(current + increment * 1.8, target);
                el.textContent = Math.ceil(current).toLocaleString();
                if (current >= target) clearInterval(t);
            }, 28);
            ioStats.unobserve(el);
        });
    }, { threshold: 0.4 });
    document.querySelectorAll('.stat-band-num').forEach(function (el) { ioStats.observe(el); });

    /* ────────────────────────────────────────────────────────
       7. NAVIGATION — scroll state + mobile
    ─────────────────────────────────────────────────────────── */
    var nav        = document.getElementById('mainNav');
    var toggle     = document.getElementById('mobileToggle');
    var mobileMenu = document.getElementById('mobileMenu');
    var menuOpen   = false;

    if (nav) {
        window.addEventListener('scroll', function () {
            nav.classList.toggle('scrolled', window.scrollY > 40);
        }, { passive: true });
    }

    function closeMobileMenu() {
        if (!menuOpen) return;
        menuOpen = false;
        if (mobileMenu) { mobileMenu.classList.remove('open'); mobileMenu.setAttribute('aria-hidden', 'true'); }
        if (toggle)     { toggle.classList.remove('active'); toggle.setAttribute('aria-expanded', 'false'); }
        document.body.style.overflow = '';
    }

    if (toggle && mobileMenu) {
        toggle.addEventListener('click', function () {
            menuOpen = !menuOpen;
            mobileMenu.classList.toggle('open', menuOpen);
            toggle.classList.toggle('active', menuOpen);
            toggle.setAttribute('aria-expanded', menuOpen ? 'true' : 'false');
            mobileMenu.setAttribute('aria-hidden', menuOpen ? 'false' : 'true');
            document.body.style.overflow = menuOpen ? 'hidden' : '';
        });
    }
    document.querySelectorAll('.mobile-link').forEach(function (l) {
        l.addEventListener('click', closeMobileMenu);
    });

    /* ────────────────────────────────────────────────────────
       8. SMOOTH SCROLL FOR ANCHOR LINKS
    ─────────────────────────────────────────────────────────── */
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            var href = link.getAttribute('href');
            if (!href || href === '#') return;
            var target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            closeMobileMenu();
            var offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 76;
            var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top: top, behavior: 'smooth' });
        });
    });

    /* ────────────────────────────────────────────────────────
       9. COSMIC CANVAS BACKGROUND
    ─────────────────────────────────────────────────────────── */
    var canvas = document.getElementById('cosmicBackground');
    if (canvas) {
        var ctx = canvas.getContext('2d');
        var W = 0, H = 0;
        var stars = [];

        function buildCanvas() {
            W = canvas.width  = window.innerWidth;
            H = canvas.height = window.innerHeight;
            stars = Array.from({ length: 120 }, function () {
                return {
                    x: Math.random() * W,
                    y: Math.random() * H,
                    r: Math.random() * 1.4 + 0.2,
                    speed: Math.random() * 0.25 + 0.05,
                    phase: Math.random() * Math.PI * 2,
                    phaseSpeed: Math.random() * 0.018 + 0.005
                };
            });
        }
        buildCanvas();
        window.addEventListener('resize', buildCanvas, { passive: true });

        function drawCosmos() {
            ctx.clearRect(0, 0, W, H);
            stars.forEach(function (s) {
                s.phase += s.phaseSpeed;
                var alpha = 0.25 + 0.5 * (0.5 + 0.5 * Math.sin(s.phase));
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(18,18,18,' + alpha.toFixed(2) + ')';
                ctx.fill();
                s.y -= s.speed;
                if (s.y < -2) { s.y = H + 2; s.x = Math.random() * W; }
            });
            requestAnimationFrame(drawCosmos);
        }
        drawCosmos();
    }

    /* ────────────────────────────────────────────────────────
       10. FAQ ACCORDION
    ─────────────────────────────────────────────────────────── */
    document.querySelectorAll('.faq-question').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var item   = btn.parentElement;
            var isOpen = item.classList.contains('open');
            // close all
            document.querySelectorAll('.faq-item').forEach(function (it) {
                it.classList.remove('open');
                it.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });
            if (!isOpen) {
                item.classList.add('open');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });

    /* ────────────────────────────────────────────────────────
       11. TESTIMONIALS SLIDER
    ─────────────────────────────────────────────────────────── */
    var track    = document.getElementById('testiTrack');
    var prevBtn  = document.getElementById('testiPrev');
    var nextBtn  = document.getElementById('testiNext');
    var testiIdx = 0;

    function getCardWidth() {
        var card = track ? track.querySelector('.testi-card') : null;
        if (!card) return 400;
        return card.offsetWidth + 24; // gap=1.5rem≈24px
    }

    function maxIdx() {
        if (!track) return 0;
        var cards = track.querySelectorAll('.testi-card').length;
        var visible = Math.floor((window.innerWidth * 0.9) / getCardWidth());
        return Math.max(0, cards - visible);
    }

    function setTrack(idx) {
        if (!track) return;
        testiIdx = Math.max(0, Math.min(idx, maxIdx()));
        track.style.transform = 'translateX(-' + (testiIdx * getCardWidth()) + 'px)';
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { setTrack(testiIdx - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { setTrack(testiIdx + 1); });

    // Auto-advance
    var testiAuto = setInterval(function () {
        var next = testiIdx + 1;
        if (next > maxIdx()) next = 0;
        setTrack(next);
    }, 5000);
    if (track) {
        track.addEventListener('mouseenter', function () { clearInterval(testiAuto); });
    }

    /* ────────────────────────────────────────────────────────
       12. CONTACT FORM
    ─────────────────────────────────────────────────────────── */
    var contactForm  = document.getElementById('contactForm');
    var formSuccess  = document.getElementById('formSuccess');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var btn  = contactForm.querySelector('button[type="submit"]');
            var text = btn ? btn.querySelector('.btn-text') : null;
            if (text) text.textContent = 'Message Sent ✓';
            if (formSuccess) formSuccess.textContent = 'Thank you! We\'ll be in touch soon.';
            setTimeout(function () {
                if (text) text.textContent = 'Send Message';
                if (formSuccess) formSuccess.textContent = '';
                contactForm.reset();
            }, 4000);
        });
    }

    /* ────────────────────────────────────────────────────────
       13. SCROLL FADE-UP via GSAP (enhancement layer)
    ─────────────────────────────────────────────────────────── */
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        var gsapTargets = '.pillar-card, .tool-card, .program-card, .testi-card, .blog-card, .contact-left, .contact-form, .faq-left, .faq-right';
        document.querySelectorAll(gsapTargets).forEach(function (el, i) {
            gsap.fromTo(el,
                { opacity: 0, y: 30 },
                {
                    opacity: 1, y: 0,
                    duration: 0.75, ease: 'power3.out',
                    delay: (i % 4) * 0.08,
                    scrollTrigger: { trigger: el, start: 'top 88%', once: true }
                }
            );
        });
    }

    /* ────────────────────────────────────────────────────────
       14. AI CHAT MODAL
    ─────────────────────────────────────────────────────────── */
    var chatModal   = document.getElementById('chatModal');
    var chatLog     = document.getElementById('chat-log');
    var chatForm2   = document.getElementById('chatForm');
    var chatInput   = document.getElementById('chat-input');
    var chatBackdrop= document.getElementById('chatBackdrop');
    var sessionId   = 'mhfz-' + Math.random().toString(36).substring(2, 10);
    var isWaiting   = false;

    /* Open/Close chat ── */
    function openChat() {
        if (!chatModal) return;
        chatModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        if (chatLog && chatLog.children.length === 0) {
            addMessage('bot', 'Hello! I\'m the Mehfooz Assistant — your AI-powered digital literacy guide for Gilgit Baltistan. How can I help you today? 🌟');
        }
        if (chatInput) setTimeout(function () { chatInput.focus(); }, 300);
    }

    function closeChat() {
        if (!chatModal) return;
        chatModal.classList.add('hidden');
        document.body.style.overflow = '';
    }

    ['openChatBtn', 'openChatMobile', 'openChatHero'].forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.addEventListener('click', function (e) { e.preventDefault(); openChat(); });
    });

    var closeBtn = document.getElementById('closeChatBtn');
    if (closeBtn) closeBtn.addEventListener('click', closeChat);
    if (chatBackdrop) chatBackdrop.addEventListener('click', closeChat);

    // Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && chatModal && !chatModal.classList.contains('hidden')) {
            closeChat();
        }
    });

    /* Add message bubble ── */
    function addMessage(sender, text) {
        if (!chatLog) return null;
        var div = document.createElement('div');
        div.className = 'chat-msg msg-' + sender;
        if (sender === 'bot' && text === '...') div.classList.add('typing');
        div.textContent = text;
        chatLog.appendChild(div);
        chatLog.scrollTop = chatLog.scrollHeight;
        return div;
    }

    /* Call AI backend (server.js) with Pollinations fallback ── */
    async function callAI(userMessage) {
        /* Try your server.js first */
        try {
            var res = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-session-id': sessionId
                },
                body: JSON.stringify({ message: userMessage }),
                signal: AbortSignal.timeout(12000)
            });
            if (res.ok) {
                var data = await res.json();
                if (data && data.reply) return data.reply;
            }
        } catch (e) {
            console.warn('[Mehfooz] Server unavailable, using fallback:', e.message);
        }

        /* Pollinations direct fallback ── */
        try {
            var SYSTEM = 'You are the Mehfooz Assistant — a helpful, warm, and knowledgeable digital literacy expert serving communities in Gilgit Baltistan, Pakistan. Help with digital safety, cybersecurity, misinformation, and Mehfooz programs. Be concise (2-3 sentences), friendly, and practical. Switch to Urdu if the user writes in Urdu.';
            var pollRes = await fetch('https://text.pollinations.ai/openai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'openai',
                    messages: [
                        { role: 'system', content: SYSTEM },
                        { role: 'user', content: userMessage }
                    ],
                    max_tokens: 200,
                    temperature: 0.72,
                    seed: 42
                }),
                signal: AbortSignal.timeout(14000)
            });
            if (pollRes.ok) {
                var pd = await pollRes.json();
                var reply = pd.choices && pd.choices[0] && pd.choices[0].message && pd.choices[0].message.content;
                if (reply) return reply.trim();
            }
        } catch (pe) {
            console.warn('[Mehfooz] Pollinations unavailable:', pe.message);
        }

        /* Offline contextual fallback ── */
        return getOfflineReply(userMessage);
    }

    /* Smart offline replies ── */
    function getOfflineReply(msg) {
        var m = msg.toLowerCase();
        if (/misinfo|fake|hoax|rumor|rumour|verify|fact.?check/.test(m))
            return 'Spotting misinformation: always check the original source, look for corroborating reports from credible outlets, and use our MehfoozBot fact-checking tool. 🔍';
        if (/safe|secur|hack|password|phish|scam|privacy/.test(m))
            return 'For cyber safety: use strong, unique passwords for every account, enable two-factor authentication, and avoid clicking suspicious links. Our Cyber Safety workshops go deeper! 🛡️';
        if (/program|course|learn|train|workshop|join|enroll/.test(m))
            return 'Mehfooz offers: Community Engagement, Campus Programs, DigiSaheli for women, Virtual Events, Mini-Courses, and our Digital Learning Hub. Visit our Programs section to get started! 📚';
        if (/digisaheli|women|woman|female/.test(m))
            return 'DigiSaheli is our flagship program empowering women in Gilgit Baltistan with digital skills, online safety awareness, and tools for safe digital participation. 💜';
        if (/ulema|religious|mosque|imam/.test(m))
            return 'Our Ulema Training program equips religious leaders in GB with digital literacy so they can guide their communities safely through the digital landscape. 🕌';
        if (/gilgit|baltistan|gb|remote|rural|offline/.test(m))
            return 'Mehfooz is built for Gilgit Baltistan — with offline-accessible content and local language support, reaching even the most remote valleys of GB. 🏔️';
        if (/urdu|language|local/.test(m))
            return 'We are actively developing Urdu and local language interfaces so every community member in GB can benefit — MehfoozBot already responds in Urdu! 🌐';
        if (/bot|mehfoozbot|ai|assistant/.test(m))
            return 'MehfoozBot is our AI-powered digital literacy assistant. It answers questions about online safety, fact-checking, and helps navigate government digital services — all in local languages. 🤖';
        if (/contact|email|reach/.test(m))
            return 'You can reach Mehfooz Internet at hello@mehfooz.internet or through our social channels. We\'d love to hear from you! 📧';
        if (/hello|hi|salam|salaam|hey/.test(m))
            return 'Wa alaikum assalam! 👋 I\'m the Mehfooz Assistant. I can help you with digital safety, misinformation, our programs, or anything about Mehfooz Internet. What would you like to know?';
        return 'Mehfooz Internet is here to empower Gilgit Baltistan with digital literacy. Explore our programs, use our MehfoozBot, or contact us at hello@mehfooz.internet for more. 💬';
    }

    /* Chat form submit ── */
    if (chatForm2) {
        chatForm2.addEventListener('submit', async function (e) {
            e.preventDefault();
            if (isWaiting || !chatInput) return;
            var text = chatInput.value.trim();
            if (!text) return;

            addMessage('user', text);
            chatInput.value = '';
            chatInput.disabled = true;
            isWaiting = true;

            var typing = addMessage('bot', '...');

            try {
                var reply = await callAI(text);
                if (typing) typing.textContent = reply;
                if (typing) typing.classList.remove('typing');
            } catch (err) {
                if (typing) typing.textContent = 'Sorry, I couldn\'t connect. Please try again.';
                if (typing) typing.classList.remove('typing');
            } finally {
                isWaiting = false;
                chatInput.disabled = false;
                chatInput.focus();
                if (chatLog) chatLog.scrollTop = chatLog.scrollHeight;
            }
        });
    }

    /* ────────────────────────────────────────────────────────
       15. NAV LINK ACTIVE SECTION TRACKING
    ─────────────────────────────────────────────────────────── */
    var sections = ['home', 'mission', 'programs', 'impact', 'blog', 'contact'];
    var ioSection = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
            if (!e.isIntersecting) return;
            var id = e.target.id;
            document.querySelectorAll('.nav-link').forEach(function (l) {
                l.classList.toggle('active', l.getAttribute('href') === '#' + id);
            });
        });
    }, { threshold: 0.4 });
    sections.forEach(function (id) {
        var sec = document.getElementById(id);
        if (sec) ioSection.observe(sec);
    });

    /* ────────────────────────────────────────────────────────
       16. BACK TO TOP
    ─────────────────────────────────────────────────────────── */
    var backTop = document.querySelector('.back-top');
    if (backTop) {
        backTop.addEventListener('click', function (e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

}); // end DOMContentLoaded
