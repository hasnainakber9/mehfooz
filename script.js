document.addEventListener('DOMContentLoaded', () => {

    // ════════════════════════════════════
    // 1. LENIS SMOOTH SCROLL
    // ════════════════════════════════════
    let lenis;
    try {
        lenis = new Lenis({
            duration: 1.4,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smooth: true
        });
        function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
        requestAnimationFrame(raf);
    } catch(e) {
        console.warn('Lenis not available');
    }

    gsap.registerPlugin(ScrollTrigger);

    // ════════════════════════════════════
    // 2. PRELOADER
    // ════════════════════════════════════
    const loader     = document.getElementById('loadingScreen');
    const loadingBar = document.querySelector('.loading-bar');
    const loaderPct  = document.querySelector('.loader-percent');
    
    let progress = 0;
    const loadInterval = setInterval(() => {
        progress += Math.random() * 12 + 3;
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadInterval);
            setTimeout(revealSite, 300);
        }
        if (loadingBar) loadingBar.style.width = `${progress}%`;
        if (loaderPct)  loaderPct.textContent  = `${Math.floor(progress)}%`;
    }, 120);

    function revealSite() {
        const tl = gsap.timeline();
        tl.to(loader, {
            yPercent: -100,
            duration: 1.4,
            ease: 'power4.inOut'
        })
        .from('.reveal-text', {
            y: 60,
            opacity: 0,
            duration: 1.2,
            stagger: 0.15,
            ease: 'power4.out'
        }, '-=0.6')
        .from('.scroll-indicator', {
            opacity: 0,
            duration: 0.8
        }, '-=0.5');

        animateCounters();
        initScrollAnimations();
    }

    // ════════════════════════════════════
    // 3. CUSTOM CURSOR
    // ════════════════════════════════════
    const cursorDot   = document.getElementById('cursor-dot');
    const cursorLight = document.getElementById('cursor-light');

    let mouseX = 0, mouseY = 0;
    let lightX = 0, lightY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (cursorDot) {
            cursorDot.style.left = mouseX + 'px';
            cursorDot.style.top  = mouseY + 'px';
        }
    });

    function animateCursorLight() {
        lightX += (mouseX - lightX) * 0.06;
        lightY += (mouseY - lightY) * 0.06;
        if (cursorLight) {
            cursorLight.style.left = lightX + 'px';
            cursorLight.style.top  = lightY + 'px';
        }
        requestAnimationFrame(animateCursorLight);
    }
    animateCursorLight();

    // Cursor scale on interactive elements
    document.querySelectorAll('a, button, .glass-card').forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (cursorDot) {
                cursorDot.style.transform = 'translate(-50%, -50%) scale(3)';
                cursorDot.style.opacity = '0.5';
            }
        });
        el.addEventListener('mouseleave', () => {
            if (cursorDot) {
                cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
                cursorDot.style.opacity = '1';
            }
        });
    });

    // ════════════════════════════════════
    // 4. MAGNETIC ELEMENTS
    // ════════════════════════════════════
    document.querySelectorAll('.magnetic').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect     = btn.getBoundingClientRect();
            const strength = parseInt(btn.getAttribute('data-strength') || '30');
            const dx = (e.clientX - rect.left - rect.width  / 2) / rect.width  * strength;
            const dy = (e.clientY - rect.top  - rect.height / 2) / rect.height * strength;
            gsap.to(btn, { x: dx, y: dy, duration: 0.4, ease: 'power2.out' });
        });
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
        });
    });

    // ════════════════════════════════════
    // 5. NAV SCROLL STATE
    // ════════════════════════════════════
    const nav = document.getElementById('main-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }, { passive: true });

    // ════════════════════════════════════
    // 6. HAMBURGER / MOBILE MENU
    // ════════════════════════════════════
    const hamburger  = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('open');
        });

        mobileMenu.querySelectorAll('.mob-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('open');
            });
        });
    }

    // ════════════════════════════════════
    // 7. COSMIC BACKGROUND CANVAS
    // ════════════════════════════════════
    const canvas = document.getElementById('cosmicBackground');
    if (canvas) {
        const ctx = canvas.getContext('2d');

        function resizeCanvas() {
            canvas.width  = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas, { passive: true });

        // Stars with varied sizes and twinkle
        const stars = Array.from({ length: 180 }, () => ({
            x:       Math.random() * canvas.width,
            y:       Math.random() * canvas.height,
            size:    Math.random() * 1.8 + 0.2,
            speed:   Math.random() * 0.3 + 0.05,
            opacity: Math.random(),
            twinkle: Math.random() * 0.02 + 0.005,
            phase:   Math.random() * Math.PI * 2
        }));

        // Occasional gold particles
        const particles = Array.from({ length: 20 }, () => ({
            x:       Math.random() * canvas.width,
            y:       Math.random() * canvas.height,
            size:    Math.random() * 3 + 1,
            speed:   Math.random() * 0.15 + 0.05,
            opacity: Math.random() * 0.4
        }));

        let frame = 0;

        function animateCosmos() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            frame++;

            // Stars
            stars.forEach(star => {
                star.phase   += star.twinkle;
                star.opacity = 0.3 + Math.sin(star.phase) * 0.4;
                star.y      -= star.speed;
                if (star.y < 0) {
                    star.y = canvas.height;
                    star.x = Math.random() * canvas.width;
                }
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(232, 232, 240, ${star.opacity * 0.6})`;
                ctx.fill();
            });

            // Gold particles (rare)
            particles.forEach(p => {
                p.y -= p.speed;
                if (p.y < 0) {
                    p.y = canvas.height;
                    p.x = Math.random() * canvas.width;
                }
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(212, 160, 23, ${p.opacity})`;
                ctx.shadowBlur = 6;
                ctx.shadowColor = 'rgba(212, 160, 23, 0.5)';
                ctx.fill();
                ctx.shadowBlur = 0;
            });

            requestAnimationFrame(animateCosmos);
        }
        animateCosmos();
    }

    // ════════════════════════════════════
    // 8. COUNTERS
    // ════════════════════════════════════
    function animateCounters() {
        const counters = [
            { el: document.getElementById('user-counter'),     target: 15000 },
            { el: document.getElementById('platform-counter'), target: 45    }
        ];

        counters.forEach(({ el, target }) => {
            if (!el) return;
            gsap.fromTo(el,
                { innerText: 0 },
                {
                    innerText: target,
                    duration: 2.5,
                    ease: 'power2.out',
                    snap: { innerText: 1 },
                    onUpdate: function () {
                        const val = Math.round(parseFloat(el.innerText));
                        el.innerText = val >= 1000
                            ? (val / 1000).toFixed(1) + 'K'
                            : val;
                    }
                }
            );
        });
    }

    // ════════════════════════════════════
    // 9. SCROLL ANIMATIONS
    // ════════════════════════════════════
    function initScrollAnimations() {
        // Section headings
        gsap.utils.toArray('.section-heading').forEach(el => {
            gsap.from(el, {
                scrollTrigger: { trigger: el, start: 'top 85%' },
                y: 50,
                opacity: 0,
                duration: 1,
                ease: 'power4.out'
            });
        });

        // Glass cards stagger
        gsap.from('.glass-card', {
            scrollTrigger: { trigger: '.cards-grid', start: 'top 80%' },
            y: 60,
            opacity: 0,
            duration: 0.9,
            stagger: 0.15,
            ease: 'power3.out'
        });

        // Mission section
        gsap.from('.mission-left', {
            scrollTrigger: { trigger: '.mission-section', start: 'top 80%' },
            x: -40,
            opacity: 0,
            duration: 1,
            ease: 'power4.out'
        });
        gsap.from('.mission-right', {
            scrollTrigger: { trigger: '.mission-section', start: 'top 80%' },
            x: 40,
            opacity: 0,
            duration: 1,
            ease: 'power4.out',
            delay: 0.15
        });

        // CTA band
        gsap.from('.cta-content', {
            scrollTrigger: { trigger: '.cta-band', start: 'top 80%' },
            y: 40,
            opacity: 0,
            duration: 1,
            ease: 'power4.out'
        });

        // Pillar items
        gsap.from('.pillar-item', {
            scrollTrigger: { trigger: '.mission-pillars', start: 'top 85%' },
            y: 20,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power3.out'
        });
    }

    // ════════════════════════════════════
    // 10. CHAT BOT MODAL
    // ════════════════════════════════════
    const botModal = document.getElementById('bot-modal');
    const chatLog  = document.getElementById('modal-chat-log');
    const chatForm = document.getElementById('chat-form');
    const chatInput= document.getElementById('chat-input');
    const closeBtn = document.getElementById('close-bot-demo');
    const backdrop = document.getElementById('modal-backdrop');

    // All open triggers
    ['open-bot-demo-approach', 'open-bot-hero', 'open-bot-cta', 'open-bot-mobile'].forEach(id => {
        const btn = document.getElementById(id);
        if (btn) btn.addEventListener('click', openModal);
    });

    function openModal() {
        botModal.classList.remove('hidden');
        if (chatLog.children.length === 0) {
            setTimeout(() => {
                addMessage('bot', "Hello. I am the Mehfooz Assistant. How can I help you navigate the digital world safely?");
            }, 300);
        }
        chatInput.focus();
    }

    function closeModal() {
        botModal.classList.add('hidden');
    }

    if (closeBtn)  closeBtn.addEventListener('click', closeModal);
    if (backdrop)  backdrop.addEventListener('click', closeModal);

    // Escape key close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    if (chatForm) {
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = chatInput.value.trim();
            if (!text) return;

            addMessage('user', text);
            chatInput.value = '';

            // Typing indicator
            const typingEl = addMessage('bot', '...', true);

            setTimeout(() => {
                typingEl.remove();
                const responses = [
                    `Great question about "${text}". Our digital safety resources can help you with this topic.`,
                    `We cover "${text}" in our workshops. Would you like to learn more about our programs?`,
                    `Thank you for asking about "${text}". Awareness is the first step to digital safety.`,
                    `This is an important topic. Our team in Gilgit Baltistan is addressing "${text}" through community programs.`
                ];
                addMessage('bot', responses[Math.floor(Math.random() * responses.length)]);
            }, 1200);
        });
    }

    function addMessage(sender, text, isTyping = false) {
        const div = document.createElement('div');
        div.style.cssText = `
            display: flex;
            justify-content: ${sender === 'user' ? 'flex-end' : 'flex-start'};
        `;

        const bubble = document.createElement('div');
        bubble.style.cssText = `
            max-width: 80%;
            padding: 0.65rem 1rem;
            font-family: 'Manrope', sans-serif;
            font-size: 0.875rem;
            line-height: 1.5;
            ${sender === 'user'
                ? `background: rgba(212,160,23,0.12);
                   border: 1px solid rgba(212,160,23,0.25);
                   color: #e8e8f0;`
                : `background: rgba(255,255,255,0.03);
                   border: 1px solid rgba(255,255,255,0.06);
                   color: #888899;`
            }
            ${isTyping ? 'letter-spacing: 0.3em; color: #888899;' : ''}
        `;
        bubble.textContent = text;
        div.appendChild(bubble);
        chatLog.appendChild(div);
        chatLog.scrollTop = chatLog.scrollHeight;
        return div;
    }

    // ════════════════════════════════════
    // 11. SMOOTH ANCHOR SCROLL
    // ════════════════════════════════════
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            if (lenis) {
                lenis.scrollTo(target, { offset: -80, duration: 1.4 });
            } else {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

});
