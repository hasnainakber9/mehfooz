/* ============================================================
   MEHFOOZ — script.js  (Ultimate Edition)
   Neo-Brutalism × Playful Geometric craft
   Features: scroll progress, magnetic buttons, parallax shapes,
   fixed starfield, staggered GSAP reveals, enhanced cursor,
   stats counters, testimonial slider, FAQ, contact form, AI chat
   ============================================================ */

'use strict';

/* ─── 1. PRELOADER ─────────────────────────────────────────── */
(function () {
    var loader   = document.getElementById('loadingScreen');
    var bar      = document.getElementById('loadingBar');
    var pct      = document.getElementById('loaderPercent');
    if (!loader) return;

    var progress = 0, done = false;

    function setProgress(val) {
        val = Math.min(100, Math.round(val));
        if (bar) bar.style.width  = val + '%';
        if (pct) pct.textContent  = val + '%';
    }
    function finish() {
        if (done) return;
        done = true;
        setProgress(100);
        setTimeout(function () {
            loader.style.transition = 'transform 1.2s cubic-bezier(0.77,0,0.18,1)';
            loader.style.transform  = 'translateY(-100%)';
            setTimeout(function () {
                loader.style.display = 'none';
                document.dispatchEvent(new Event('preloader:done'));
            }, 1300);
        }, 280);
    }

    var iv = setInterval(function () {
        if (done) { clearInterval(iv); return; }
        progress += Math.random() * 14 + 4;
        if (progress >= 100) { clearInterval(iv); finish(); }
        else { setProgress(progress); }
    }, 95);

    setTimeout(finish, 4200);
}());

/* ─── 2. MAIN APP ──────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function () {

    /* ── GSAP + ScrollTrigger safe register ── */
    var hasGSAP = typeof gsap !== 'undefined';
    var hasScrollTrigger = typeof ScrollTrigger !== 'undefined';
    if (hasGSAP && hasScrollTrigger) gsap.registerPlugin(ScrollTrigger);

    /* ─────────────────────────────────────────────────────────
       3. SCROLL PROGRESS BAR
    ──────────────────────────────────────────────────────────── */
    var progressBar = document.getElementById('scrollProgress');
    if (progressBar) {
        window.addEventListener('scroll', function () {
            var total  = document.documentElement.scrollHeight - window.innerHeight;
            var current = window.scrollY;
            progressBar.style.width = (current / total * 100).toFixed(1) + '%';
        }, { passive: true });
    }

    /* ─────────────────────────────────────────────────────────
       4. CUSTOM CURSOR
    ──────────────────────────────────────────────────────────── */
    var curDot  = document.getElementById('cursor-dot');
    var curRing = document.getElementById('cursor-ring');
    var mx = 0, my = 0, rx = 0, ry = 0;

    if (curDot && curRing) {
        window.addEventListener('mousemove', function (e) {
            mx = e.clientX; my = e.clientY;
            curDot.style.left = mx + 'px';
            curDot.style.top  = my + 'px';
        });

        // Laggy ring follows with lerp
        (function animRing() {
            rx += (mx - rx) * 0.13;
            ry += (my - ry) * 0.13;
            curRing.style.left = rx + 'px';
            curRing.style.top  = ry + 'px';
            requestAnimationFrame(animRing);
        }());

        var hoverTargets = 'a, button, .program-card, .testi-card, .tool-card, .blog-card, .pillar-card, .faq-question, .featured-logo-link';
        document.querySelectorAll(hoverTargets).forEach(function (el) {
            el.addEventListener('mouseenter', function () {
                curRing.classList.add('is-hovering');
                curDot.classList.add('is-hovering');
            });
            el.addEventListener('mouseleave', function () {
                curRing.classList.remove('is-hovering');
                curDot.classList.remove('is-hovering');
            });
        });

        // Hide on touch
        window.addEventListener('touchstart', function () {
            if (curDot)  curDot.style.display  = 'none';
            if (curRing) curRing.style.display = 'none';
        }, { once: true });
    }

    /* ─────────────────────────────────────────────────────────
       5. COSMIC STARFIELD CANVAS — white stars on dark dot-grid
    ──────────────────────────────────────────────────────────── */
    var canvas = document.getElementById('cosmicBackground');
    if (canvas) {
        var ctx = canvas.getContext('2d');
        var W = 0, H = 0, stars = [];

        function buildCanvas() {
            W = canvas.width  = window.innerWidth;
            H = canvas.height = window.innerHeight;
            stars = Array.from({ length: 80 }, function () {
                return {
                    x:          Math.random() * W,
                    y:          Math.random() * H,
                    r:          Math.random() * 1.5 + 0.3,
                    speed:      Math.random() * 0.18 + 0.04,
                    phase:      Math.random() * Math.PI * 2,
                    phaseSpeed: Math.random() * 0.015 + 0.005
                };
            });
        }
        buildCanvas();
        window.addEventListener('resize', buildCanvas, { passive: true });

        function drawCosmos() {
            ctx.clearRect(0, 0, W, H);
            // Subtle dot-grid pattern
            ctx.fillStyle = 'rgba(18,18,18,0.04)';
            for (var gx = 0; gx < W; gx += 60) {
                for (var gy = 0; gy < H; gy += 60) {
                    ctx.beginPath();
                    ctx.arc(gx, gy, 1.5, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            // Twinkling stars (subtle dark dots — gives depth without distraction)
            stars.forEach(function (s) {
                s.phase += s.phaseSpeed;
                var alpha = 0.04 + 0.1 * (0.5 + 0.5 * Math.sin(s.phase));
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(18,18,18,' + alpha.toFixed(3) + ')';
                ctx.fill();
                s.y -= s.speed;
                if (s.y < -2) { s.y = H + 2; s.x = Math.random() * W; }
            });
            requestAnimationFrame(drawCosmos);
        }
        drawCosmos();
    }

    /* ─────────────────────────────────────────────────────────
       6. MAGNETIC BUTTONS
    ──────────────────────────────────────────────────────────── */
    document.querySelectorAll('.magnetic').forEach(function (btn) {
        btn.addEventListener('mousemove', function (e) {
            var rect   = btn.getBoundingClientRect();
            var cx     = rect.left + rect.width  / 2;
            var cy     = rect.top  + rect.height / 2;
            var dx     = (e.clientX - cx) * 0.28;
            var dy     = (e.clientY - cy) * 0.28;
            btn.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
        });
        btn.addEventListener('mouseleave', function () {
            btn.style.transform = '';
        });
    });

    /* ─────────────────────────────────────────────────────────
       7. PARALLAX HERO SHAPES on mousemove
    ──────────────────────────────────────────────────────────── */
    var heroSection = document.querySelector('.hero-section');
    var shapes = Array.from(document.querySelectorAll('.playful-shape'));
    var confettiPieces = Array.from(document.querySelectorAll('.conf'));

    if (heroSection && shapes.length) {
        heroSection.addEventListener('mousemove', function (e) {
            var rect = heroSection.getBoundingClientRect();
            var rx2 = (e.clientX - rect.left) / rect.width  - 0.5; // -0.5 to 0.5
            var ry2 = (e.clientY - rect.top)  / rect.height - 0.5;

            shapes.forEach(function (s, i) {
                var depth = 0.015 * ((i % 3) + 1);
                var tx = rx2 * rect.width  * depth;
                var ty = ry2 * rect.height * depth;
                s.style.transform = 'translate(' + tx + 'px,' + ty + 'px)';
            });
            confettiPieces.forEach(function (c, i) {
                var depth = 0.008 * ((i % 4) + 1);
                var tx = rx2 * rect.width  * depth;
                var ty = ry2 * rect.height * depth;
                c.style.transform = 'translate(' + tx + 'px,' + ty + 'px)';
            });
        });
        heroSection.addEventListener('mouseleave', function () {
            shapes.forEach(function (s) { s.style.transform = ''; });
            confettiPieces.forEach(function (c) { c.style.transform = ''; });
        });
    }

    /* ─────────────────────────────────────────────────────────
       8. HERO REVEAL after preloader
    ──────────────────────────────────────────────────────────── */
    function revealHero() {
        startStatsBand(); // fire counters right on load too
        if (!hasGSAP) return;

        // GSAP hero card children stagger
        gsap.fromTo('.hero-eyebrow', { opacity: 0, y: 20 }, {
            opacity: 1, y: 0, duration: .8, ease: 'power3.out', delay: .2
        });
        gsap.fromTo('.hero-line', { opacity: 0, y: 40 }, {
            opacity: 1, y: 0, duration: .9, ease: 'power3.out',
            stagger: .1, delay: .35
        });
        gsap.fromTo('.hero-subtitle', { opacity: 0, y: 20 }, {
            opacity: 1, y: 0, duration: .8, ease: 'power3.out', delay: .7
        });
        gsap.fromTo('.hero-actions', { opacity: 0, y: 20 }, {
            opacity: 1, y: 0, duration: .7, ease: 'back.out(1.7)', delay: .85
        });
        gsap.fromTo('.hero-trust', { opacity: 0, scale: .95 }, {
            opacity: 1, scale: 1, duration: .7, ease: 'back.out(1.5)', delay: 1.05
        });
    }
    document.addEventListener('preloader:done', revealHero);

    /* ─────────────────────────────────────────────────────────
       9. FADE-UP VIA INTERSECTION OBSERVER (CSS fallback)
    ──────────────────────────────────────────────────────────── */
    var ioFade = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                ioFade.unobserve(e.target);
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-up').forEach(function (el) { ioFade.observe(el); });

    /* ─────────────────────────────────────────────────────────
       10. GSAP SCROLL REVEALS (enhancement layer)
    ──────────────────────────────────────────────────────────── */
    if (hasGSAP && hasScrollTrigger) {
        var staggerTargets = '.pillar-card, .tool-card, .program-card, .blog-card, .testi-card';
        document.querySelectorAll(staggerTargets).forEach(function (el, i) {
            gsap.fromTo(el,
                { opacity: 0, y: 32, scale: .97 },
                {
                    opacity: 1, y: 0, scale: 1,
                    duration: .7, ease: 'power3.out',
                    delay: (i % 4) * 0.08,
                    scrollTrigger: { trigger: el, start: 'top 88%', once: true }
                }
            );
        });

        // Section headings pop
        document.querySelectorAll('.section-heading').forEach(function (el) {
            gsap.fromTo(el,
                { opacity: 0, y: 28 },
                {
                    opacity: 1, y: 0, duration: .9, ease: 'power3.out',
                    scrollTrigger: { trigger: el, start: 'top 85%', once: true }
                }
            );
        });

        // Stats band numbers parallel
        gsap.fromTo('.stat-band-item', { opacity: 0, scale: .85 }, {
            opacity: 1, scale: 1, duration: .6, ease: 'back.out(1.7)',
            stagger: .1,
            scrollTrigger: { trigger: '.stats-band', start: 'top 82%', once: true }
        });
    }

    /* ─────────────────────────────────────────────────────────
       11. STATS BAND COUNTERS (scroll-triggered)
    ──────────────────────────────────────────────────────────── */
    function startStatsBand() {
        var ioStats = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (!e.isIntersecting) return;
                var el      = e.target;
                var raw     = el.getAttribute('data-target');
                if (!raw)   return;
                var target  = parseInt(raw, 10);
                if (isNaN(target)) return;
                var current = 0, inc = target / 70;
                var t = setInterval(function () {
                    current = Math.min(current + inc * 1.8, target);
                    el.textContent = Math.ceil(current).toLocaleString();
                    if (current >= target) clearInterval(t);
                }, 24);
                ioStats.unobserve(el);
            });
        }, { threshold: 0.4 });
        document.querySelectorAll('.stat-band-num').forEach(function (el) {
            ioStats.observe(el);
        });
    }
    startStatsBand();

    /* ─────────────────────────────────────────────────────────
       12. NAVIGATION — scroll state + mobile menu
    ──────────────────────────────────────────────────────────── */
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

    /* ─────────────────────────────────────────────────────────
       13. SMOOTH SCROLL FOR ANCHOR LINKS
    ──────────────────────────────────────────────────────────── */
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            var href   = link.getAttribute('href');
            if (!href || href === '#') return;
            var target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            closeMobileMenu();
            var navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 76;
            var top  = target.getBoundingClientRect().top + window.pageYOffset - navH;
            window.scrollTo({ top: top, behavior: 'smooth' });
        });
    });

    /* ─────────────────────────────────────────────────────────
       14. NAV ACTIVE SECTION TRACKING
    ──────────────────────────────────────────────────────────── */
    var sections = ['home', 'mission', 'programs', 'impact', 'blog', 'contact'];
    var ioSection = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
            if (!e.isIntersecting) return;
            var id = e.target.id;
            document.querySelectorAll('.nav-link').forEach(function (l) {
                l.classList.toggle('active', l.getAttribute('href') === '#' + id);
            });
        });
    }, { threshold: 0.35 });
    sections.forEach(function (id) {
        var sec = document.getElementById(id);
        if (sec) ioSection.observe(sec);
    });

    /* ─────────────────────────────────────────────────────────
       15. FAQ ACCORDION
    ──────────────────────────────────────────────────────────── */
    document.querySelectorAll('.faq-question').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var item   = btn.parentElement;
            var isOpen = item.classList.contains('open');
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

    /* ─────────────────────────────────────────────────────────
       16. TESTIMONIALS SLIDER
    ──────────────────────────────────────────────────────────── */
    var track    = document.getElementById('testiTrack');
    var prevBtn  = document.getElementById('testiPrev');
    var nextBtn  = document.getElementById('testiNext');
    var testiIdx = 0;
    var testiAutoTimer;

    function getCardWidth() {
        var card = track ? track.querySelector('.testi-card') : null;
        if (!card) return 400;
        return card.offsetWidth + 24; // gap ~1.5rem
    }
    function maxIdx() {
        if (!track) return 0;
        var total   = track.querySelectorAll('.testi-card').length;
        var visible = Math.max(1, Math.floor((window.innerWidth * 0.94) / getCardWidth()));
        return Math.max(0, total - visible);
    }
    function setTrack(idx) {
        if (!track) return;
        testiIdx = Math.max(0, Math.min(idx, maxIdx()));
        track.style.transform = 'translateX(-' + (testiIdx * getCardWidth()) + 'px)';
    }
    function startTestiAuto() {
        testiAutoTimer = setInterval(function () {
            var next = testiIdx + 1;
            if (next > maxIdx()) next = 0;
            setTrack(next);
        }, 5500);
    }
    function stopTestiAuto() { clearInterval(testiAutoTimer); }

    if (prevBtn) prevBtn.addEventListener('click', function () { stopTestiAuto(); setTrack(testiIdx - 1); startTestiAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { stopTestiAuto(); setTrack(testiIdx + 1); startTestiAuto(); });
    if (track) {
        track.addEventListener('mouseenter', stopTestiAuto);
        track.addEventListener('mouseleave', startTestiAuto);
    }
    startTestiAuto();

    // Touch/swipe support for testimonials
    if (track) {
        var touchStartX = 0;
        track.addEventListener('touchstart', function (e) { touchStartX = e.touches[0].clientX; }, { passive: true });
        track.addEventListener('touchend', function (e) {
            var diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 40) setTrack(diff > 0 ? testiIdx + 1 : testiIdx - 1);
        });
    }

    /* ─────────────────────────────────────────────────────────
       17. CONTACT FORM
    ──────────────────────────────────────────────────────────── */
    var contactForm  = document.getElementById('contactForm');
    var formSuccess  = document.getElementById('formSuccess');

    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            var btn     = contactForm.querySelector('button[type="submit"]');
            var btnText = btn ? btn.querySelector('.btn-text') : null;
            var btnIcon = btn ? btn.querySelector('.btn-icon') : null;
            if (btn) btn.disabled = true;
            if (btnText) btnText.textContent = 'Sending…';
            if (btnIcon) btnIcon.textContent = '↻';
            if (formSuccess) { formSuccess.textContent = ''; formSuccess.style.color = ''; }

            try {
                var res = await fetch('https://formspree.io/f/xnngrpzb', {
                    method: 'POST',
                    body: new FormData(contactForm),
                    headers: { 'Accept': 'application/json' }
                });
                if (res.ok) {
                    if (btnText) btnText.textContent = 'Sent ✓';
                    if (btnIcon) btnIcon.textContent = '✓';
                    if (formSuccess) formSuccess.textContent = 'Thank you! We\'ll be in touch soon.';
                    contactForm.reset();
                    setTimeout(function () {
                        if (btnText) btnText.textContent = 'Send Message';
                        if (btnIcon) btnIcon.textContent = '→';
                        if (formSuccess) formSuccess.textContent = '';
                        if (btn) btn.disabled = false;
                    }, 4500);
                } else throw new Error('non-ok');
            } catch (_) {
                if (btnText) btnText.textContent = 'Try Again';
                if (btnIcon) btnIcon.textContent = '!';
                if (formSuccess) {
                    formSuccess.textContent = 'Something went wrong — email hello@mehfooz.internet directly.';
                    formSuccess.style.color = 'var(--red)';
                }
                if (btn) btn.disabled = false;
            }
        });
    }

    /* ─────────────────────────────────────────────────────────
       18. BACK TO TOP
    ──────────────────────────────────────────────────────────── */
    var backTop = document.querySelector('.back-top');
    if (backTop) {
        backTop.addEventListener('click', function (e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ─────────────────────────────────────────────────────────
       19. AI CHAT MODAL
    ──────────────────────────────────────────────────────────── */
    var chatModal    = document.getElementById('chatModal');
    var chatLog      = document.getElementById('chat-log');
    var chatForm2    = document.getElementById('chatForm');
    var chatInput    = document.getElementById('chat-input');
    var chatBackdrop = document.getElementById('chatBackdrop');
    var sessionId    = 'mhfz-' + Math.random().toString(36).substring(2, 10);
    var isWaiting    = false;

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
    if (closeBtn)     closeBtn.addEventListener('click', closeChat);
    if (chatBackdrop) chatBackdrop.addEventListener('click', closeChat);
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && chatModal && !chatModal.classList.contains('hidden')) closeChat();
    });

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

    async function callAI(userMessage) {
        try {
            var res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-session-id': sessionId },
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
                    max_tokens: 200, temperature: 0.72, seed: 42
                }),
                signal: AbortSignal.timeout(14000)
            });
            if (pollRes.ok) {
                var pd    = await pollRes.json();
                var reply = pd.choices && pd.choices[0] && pd.choices[0].message && pd.choices[0].message.content;
                if (reply) return reply.trim();
            }
        } catch (pe) {
            console.warn('[Mehfooz] Pollinations unavailable:', pe.message);
        }

        return getOfflineReply(userMessage);
    }

    function getOfflineReply(msg) {
        var m = msg.toLowerCase();
        if (/misinfo|fake|hoax|rumor|rumour|verify|fact.?check/.test(m))
            return 'Spotting misinformation: always check the original source, look for corroborating reports from credible outlets, and use our MehfoozBot fact-checking tool. 🔍';
        if (/safe|secur|hack|password|phish|scam|privacy/.test(m))
            return 'For cyber safety: use strong, unique passwords, enable two-factor authentication, and avoid clicking suspicious links. Our Cyber Safety workshops go deeper! 🛡️';
        if (/program|course|learn|train|workshop|join|enroll/.test(m))
            return 'Mehfooz offers: Community Engagement, Campus Programs, DigiSaheli for women, Virtual Events, Mini-Courses, and our Digital Learning Hub. Visit our Programs section! 📚';
        if (/digisaheli|women|woman|female/.test(m))
            return 'DigiSaheli is our flagship program empowering women in Gilgit Baltistan with digital skills, online safety, and tools for safe digital participation. 💜';
        if (/ulema|religious|mosque|imam/.test(m))
            return 'Our Ulema Training program equips religious leaders in GB with digital literacy so they can guide their communities safely online. 🕌';
        if (/gilgit|baltistan|gb|remote|rural|offline/.test(m))
            return 'Mehfooz is built for Gilgit Baltistan — with offline-accessible content and local language support, reaching even the most remote valleys. 🏔️';
        if (/urdu|language|local/.test(m))
            return 'We are actively developing Urdu and local language interfaces. MehfoozBot already responds in Urdu! 🌐';
        if (/bot|mehfoozbot|ai|assistant/.test(m))
            return 'MehfoozBot is our AI-powered digital literacy assistant. It answers questions about online safety, fact-checking, and helps navigate government services in local languages. 🤖';
        if (/contact|email|reach/.test(m))
            return 'Reach Mehfooz at hello@mehfooz.internet or through our social channels. We\'d love to hear from you! 📧';
        if (/hello|hi|salam|salaam|hey|assalam/.test(m))
            return 'Wa alaikum assalam! 👋 I\'m the Mehfooz Assistant. I can help with digital safety, misinformation, or anything about our programs. What can I help you with?';
        return 'Mehfooz Internet empowers Gilgit Baltistan with digital literacy. Explore our programs, use MehfoozBot, or contact us at hello@mehfooz.internet for more! 💬';
    }

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
                if (typing) { typing.textContent = reply; typing.classList.remove('typing'); }
            } catch (_) {
                if (typing) { typing.textContent = 'Sorry, I couldn\'t connect. Please try again.'; typing.classList.remove('typing'); }
            } finally {
                isWaiting = false;
                chatInput.disabled = false;
                chatInput.focus();
                if (chatLog) chatLog.scrollTop = chatLog.scrollHeight;
            }
        });
    }

    /* ─────────────────────────────────────────────────────────
       20. PILLAR CARD — subtle sticker wiggle on hover
    ──────────────────────────────────────────────────────────── */
    document.querySelectorAll('.pillar-card, .testi-card').forEach(function (card) {
        card.addEventListener('mouseenter', function () {
            if (hasGSAP) {
                gsap.to(card, { rotation: -0.8, duration: .15, ease: 'power1.out' });
            }
        });
        card.addEventListener('mouseleave', function () {
            if (hasGSAP) {
                gsap.to(card, { rotation: 0, duration: .3, ease: 'elastic.out(1, 0.5)' });
            }
        });
    });

    /* ─────────────────────────────────────────────────────────
       21. TICKER — pause on hover (already via CSS, but also
       add keyboard ticker control for accessibility)
    ──────────────────────────────────────────────────────────── */
    var tickerWrap = document.querySelector('.ticker-wrap');
    if (tickerWrap) {
        tickerWrap.setAttribute('tabindex', '0');
        tickerWrap.addEventListener('focus', function () {
            var track = tickerWrap.querySelector('.ticker-track');
            if (track) track.style.animationPlayState = 'paused';
        });
        tickerWrap.addEventListener('blur', function () {
            var track = tickerWrap.querySelector('.ticker-track');
            if (track) track.style.animationPlayState = '';
        });
    }

}); // end DOMContentLoaded
