// ════════════════════════════════════
// GEOMETRIC SHADER BACKGROUND (Three.js)
// ════════════════════════════════════
(function initShader() {
    const canvasElement = document.getElementById('cosmicBackground');
    if (!canvasElement || typeof THREE === 'undefined') return;

    const scene    = new THREE.Scene();
    const camera   = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasElement, alpha: true, antialias: false });

    function resize() {
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    }
    window.addEventListener('resize', resize, { passive: true });
    resize();

    const uniforms = {
        u_time:       { value: 0.0 },
        u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        u_color_bg:   { value: new THREE.Color('#060608') },
        u_color_dot:  { value: new THREE.Color('#D4A017') },
        u_color_dot2: { value: new THREE.Color('#C8341A') }
    };

    const material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float u_time;
            uniform vec2  u_resolution;
            uniform vec3  u_color_bg;
            uniform vec3  u_color_dot;
            uniform vec3  u_color_dot2;
            varying vec2 vUv;

            float star(vec2 uv, float r) {
                float d = length(uv);
                return smoothstep(r, r * 0.5, d);
            }

            void main() {
                vec2 st = gl_FragCoord.xy / u_resolution.xy;
                st.x *= u_resolution.x / u_resolution.y;

                /* Flowing distortion */
                vec2 dst = st;
                dst.y += sin(st.x * 8.0 + u_time * 0.5) * 0.03;
                dst.x += cos(st.y * 8.0 + u_time * 0.3) * 0.03;

                /* Sparse gold dot grid */
                vec2 g = fract(dst * 18.0) - 0.5;
                float r = 0.10 + sin(u_time * 1.2 + st.x * 4.0 + st.y * 3.0) * 0.04;
                float circle = step(length(g), r);

                /* Second sparser red grid, offset */
                vec2 g2 = fract((dst + 0.5) * 9.0) - 0.5;
                float r2 = 0.06 + cos(u_time * 0.8 + st.y * 5.0) * 0.02;
                float circle2 = step(length(g2), r2);

                /* Combine layers */
                vec3 col = u_color_bg;
                col = mix(col, u_color_dot,  circle  * 0.18);
                col = mix(col, u_color_dot2, circle2 * 0.12);

                gl_FragColor = vec4(col, 0.9);
            }
        `,
        transparent: true
    });

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);

    const clock = new THREE.Clock();
    (function animateShader() {
        uniforms.u_time.value = clock.getElapsedTime();
        uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight);
        renderer.render(scene, camera);
        requestAnimationFrame(animateShader);
    })();
})();

// ════════════════════════════════════
// MAIN DOM LOGIC
// ════════════════════════════════════
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
    // 10. CHAT BOT MODAL — Real Backend
    // ════════════════════════════════════
    const botModal  = document.getElementById('bot-modal');
    const chatLog   = document.getElementById('modal-chat-log');
    const chatForm  = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const closeBtn  = document.getElementById('close-bot-demo');
    const backdrop  = document.getElementById('modal-backdrop');

    // Unique session ID for conversation memory
    const sessionId = Math.random().toString(36).substring(2, 9);

    // All open triggers
    ['open-bot-demo-approach', 'open-bot-hero', 'open-bot-cta', 'open-bot-mobile'].forEach(id => {
        const btn = document.getElementById(id);
        if (btn) btn.addEventListener('click', openModal);
    });

    function openModal() {
        botModal.classList.remove('hidden');
        gsap.fromTo('.glass-panel',
            { scale: 0.92, y: 30, opacity: 0 },
            { scale: 1, y: 0, opacity: 1, duration: 0.45, ease: 'back.out(1.2)' }
        );
        if (chatLog.children.length === 0) {
            setTimeout(() => {
                addMessage('bot', 'Hello! I am the Mehfooz Assistant. Ask me anything about digital safety, misinformation, or cybersecurity in Gilgit Baltistan.');
            }, 350);
        }
        chatInput.focus();
    }

    function closeModal() {
        gsap.to('.glass-panel', {
            scale: 0.92, y: 30, opacity: 0, duration: 0.3,
            onComplete: () => botModal.classList.add('hidden')
        });
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

    if (chatForm) {
        chatForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const text = chatInput.value.trim();
            if (!text) return;

            addMessage('user', text);
            chatInput.value = '';
            chatInput.disabled = true;

            // Typing indicator (returns the bubble element directly)
            const typingBubble = addMessage('bot', '● ● ●', false, true);

            try {
                const response = await fetch('http://localhost:5000/api/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-session-id': sessionId
                    },
                    body: JSON.stringify({ message: text })
                });

                if (!response.ok) throw new Error(`Status ${response.status}`);
                const data = await response.json();

                typingBubble.textContent = data.reply;
                typingBubble.style.letterSpacing = 'normal';
                typingBubble.style.color = '#888899';

            } catch (err) {
                console.error('Mehfooz AI Gateway Error:', err);
                typingBubble.textContent = 'Could not reach the Mehfooz AI Gateway. Please ensure the backend server is running on port 5000.';
                typingBubble.style.color  = 'var(--c-red)';
                typingBubble.style.letterSpacing = 'normal';
            } finally {
                chatInput.disabled = false;
                chatInput.focus();
                chatLog.scrollTop = chatLog.scrollHeight;
            }
        });
    }

    /**
     * Adds a message bubble to the chat log.
     * Returns the inner bubble element so callers can update its text.
     */
    function addMessage(sender, text, _unused = false, isTyping = false) {
        const wrapper = document.createElement('div');
        wrapper.style.cssText = `
            display: flex;
            justify-content: ${sender === 'user' ? 'flex-end' : 'flex-start'};
            margin-bottom: 0.1rem;
        `;
        const bubble = document.createElement('div');
        bubble.style.cssText = `
            max-width: 80%;
            padding: 0.65rem 1rem;
            font-family: 'Manrope', sans-serif;
            font-size: 0.875rem;
            line-height: 1.55;
            border-radius: 2px;
            ${sender === 'user'
                ? 'background: rgba(212,160,23,0.12); border: 1px solid rgba(212,160,23,0.25); color: #e8e8f0;'
                : 'background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); color: #888899;'
            }
            ${isTyping ? 'letter-spacing: 0.35em; color: #555566;' : ''}
        `;
        bubble.textContent = text;
        wrapper.appendChild(bubble);
        chatLog.appendChild(wrapper);

        gsap.fromTo(wrapper,
            { x: sender === 'user' ? 10 : -10, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.3, ease: 'power2.out' }
        );

        chatLog.scrollTop = chatLog.scrollHeight;
        return bubble; // return bubble so callers can mutate it
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
