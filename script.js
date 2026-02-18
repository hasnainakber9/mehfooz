// ════════════════════════════════════════════════════════
//  MEHFOOZ — script.js
//  Original logic 100% preserved + Three.js shader bg
//  + real Gemini backend chat
// ════════════════════════════════════════════════════════

// ── THREE.JS GLSL SHADER BACKGROUND ─────────────────────
// Runs immediately (before DOMContentLoaded) so the canvas
// is painted as soon as the preloader lifts.
(function initShader() {
    const canvas = document.getElementById('cosmicBackground');
    if (!canvas || typeof THREE === 'undefined') return;

    const scene    = new THREE.Scene();
    const camera   = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });

    function resize() {
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    }
    window.addEventListener('resize', resize, { passive: true });
    resize();

    const uniforms = {
        u_time:       { value: 0.0 },
        u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
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
            varying vec2  vUv;

            void main() {
                vec2 st = gl_FragCoord.xy / u_resolution.xy;
                st.x *= u_resolution.x / u_resolution.y;

                // Flowing wave distortion
                vec2 dst = st;
                dst.y += sin(st.x * 7.0 + u_time * 0.45) * 0.028;
                dst.x += cos(st.y * 7.0 + u_time * 0.28) * 0.028;

                // Gold star/dot grid
                vec2 g = fract(dst * 20.0) - 0.5;
                float r = 0.09 + sin(u_time * 1.1 + st.x * 5.0 + st.y * 3.5) * 0.04;
                float stars = step(length(g), r);

                // Sparse secondary grid (dim red)
                vec2 g2 = fract((dst + vec2(0.5)) * 10.0) - 0.5;
                float r2 = 0.055 + cos(u_time * 0.7 + st.y * 4.0) * 0.02;
                float stars2 = step(length(g2), r2);

                // Base deep dark
                vec3 col = vec3(0.024, 0.024, 0.04);
                // Gold dots
                col = mix(col, vec3(0.788, 0.596, 0.102), stars  * 0.22);
                // Red accent dots
                col = mix(col, vec3(0.722, 0.188, 0.102), stars2 * 0.14);

                gl_FragColor = vec4(col, 1.0);
            }
        `
    });

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);

    const clock = new THREE.Clock();
    (function tick() {
        uniforms.u_time.value = clock.getElapsedTime();
        uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight);
        renderer.render(scene, camera);
        requestAnimationFrame(tick);
    })();
})();


// ── MAIN LOGIC ───────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

    // ── 1. LENIS SMOOTH SCROLL (original) ────────────────
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true
    });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    gsap.registerPlugin(ScrollTrigger);

    // ── 2. PRELOADER SEQUENCE (original) ─────────────────
    const loader     = document.querySelector('.loader-curtain');
    const loadingBar = document.querySelector('.loading-bar');

    let progress = 0;
    const loadInterval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress > 100) progress = 100;
        loadingBar.style.width = `${progress}%`;
        if (progress === 100) {
            clearInterval(loadInterval);
            revealSite();
        }
    }, 100);

    function revealSite() {
        const tl = gsap.timeline();
        tl.to(loader, { y: '-100%', duration: 1.2, ease: 'power4.inOut' })
          .from('.reveal-text', {
              y: 100,
              opacity: 0,
              duration: 1.5,
              stagger: 0.2,
              ease: 'power4.out'
          }, '-=0.5')
          .from('.hero-stats', { opacity: 0, duration: 1 }, '-=1');

        animateCounters();
        initNavScroll();
        initScrollAnimations();
    }

    // ── 3. NAV SCROLL STATE (design enhancement) ─────────
    function initNavScroll() {
        const nav = document.querySelector('.fixed-nav');
        window.addEventListener('scroll', () => {
            nav.classList.toggle('scrolled', window.scrollY > 60);
        }, { passive: true });
    }

    // ── 4. CUSTOM CURSOR & MAGNETIC (original) ───────────
    const cursor = document.getElementById('cursor-dot');
    const light  = document.getElementById('cursor-light');

    let mx = 0, my = 0, lx = 0, ly = 0;

    window.addEventListener('mousemove', (e) => {
        mx = e.clientX; my = e.clientY;
        gsap.to(cursor, { x: mx, y: my, duration: 0.1 });
    });

    // Smooth light trail
    (function lightLoop() {
        lx += (mx - lx) * 0.07;
        ly += (my - ly) * 0.07;
        gsap.set(light, { x: lx, y: ly });
        requestAnimationFrame(lightLoop);
    })();

    document.querySelectorAll('.magnetic').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect     = btn.getBoundingClientRect();
            const strength = btn.getAttribute('data-strength') || 30;
            gsap.to(btn, {
                x: (e.clientX - rect.left - rect.width  / 2) / strength * 10,
                y: (e.clientY - rect.top  - rect.height / 2) / strength * 10,
                duration: 0.3
            });
        });
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1,0.5)' });
        });
    });

    // ── 5. COUNTERS (original) ───────────────────────────
    function animateCounters() {
        const numbers = document.querySelectorAll('.stat-number');
        numbers.forEach(num => {
            const target = num.id === 'user-counter' ? 15000 : 45;
            gsap.to(num, {
                innerText: target,
                duration: 2.5,
                snap: { innerText: 1 },
                scrollTrigger: { trigger: num, start: 'top 90%' }
            });
        });
    }

    // ── 6. SCROLL ANIMATIONS (design enhancement) ────────
    function initScrollAnimations() {
        gsap.utils.toArray('.section-heading').forEach(el => {
            gsap.from(el, {
                scrollTrigger: { trigger: el, start: 'top 88%' },
                y: 40, opacity: 0, duration: 1, ease: 'power4.out'
            });
        });
        gsap.from('.glass-card', {
            scrollTrigger: { trigger: '.cards-grid', start: 'top 82%' },
            y: 50, opacity: 0, duration: 0.9,
            stagger: 0.14, ease: 'power3.out'
        });
        gsap.from('.col-right', {
            scrollTrigger: { trigger: '.split-section', start: 'top 82%' },
            x: 40, opacity: 0, duration: 1, ease: 'power4.out', delay: 0.1
        });
    }

    // ── 7. CHAT BOT (connected to real backend) ──────────
    const botModal  = document.getElementById('bot-modal');
    const openBtn   = document.getElementById('open-bot-demo-approach');
    const closeBtn  = document.getElementById('close-bot-demo');
    const chatForm  = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatLog   = document.getElementById('modal-chat-log');

    // Unique session ID for conversation memory
    const sessionId = Math.random().toString(36).substring(2, 9);

    if (openBtn) {
        openBtn.addEventListener('click', () => {
            botModal.classList.remove('hidden');
            if (chatLog.children.length === 0) {
                addMessage('bot', 'Hello. I am the Mehfooz Assistant. How can I help you navigate the digital world safely?');
            }
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => botModal.classList.add('hidden'));
    }
    document.getElementById('modal-backdrop')?.addEventListener('click', () => botModal.classList.add('hidden'));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') botModal.classList.add('hidden'); });

    if (chatForm) {
        chatForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const text = chatInput.value.trim();
            if (!text) return;

            addMessage('user', text);
            chatInput.value = '';
            chatInput.disabled = true;

            // Typing indicator — returns the bubble so we can update it
            const typingBubble = addMessageBubble('bot', '● ● ●', true);

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
                typingBubble.textContent  = data.reply;
                typingBubble.style.letterSpacing = 'normal';
                typingBubble.style.color         = '#e0e0e0';

            } catch (err) {
                console.error('Mehfooz AI Gateway:', err);
                typingBubble.textContent  = 'Could not reach AI Gateway. Ensure server is running on port 5000.';
                typingBubble.style.color  = '#b8301a';
                typingBubble.style.letterSpacing = 'normal';
            } finally {
                chatInput.disabled = false;
                chatInput.focus();
                chatLog.scrollTop = chatLog.scrollHeight;
            }
        });
    }

    // Original addMessage kept for bot greeting; returns the container div (original behaviour)
    function addMessage(sender, text) {
        const msgDiv = document.createElement('div');
        msgDiv.style.marginBottom = '10px';
        msgDiv.style.textAlign    = sender === 'user' ? 'right' : 'left';
        msgDiv.style.color        = sender === 'user' ? '#C9981A' : '#e0e0e0';
        msgDiv.style.fontSize     = '0.875rem';
        msgDiv.style.fontFamily   = 'Manrope, sans-serif';
        msgDiv.style.lineHeight   = '1.55';
        msgDiv.textContent        = text;
        chatLog.appendChild(msgDiv);
        chatLog.scrollTop = chatLog.scrollHeight;
        return msgDiv;
    }

    // Extended version used for streaming — returns the inner bubble element
    function addMessageBubble(sender, text, isTyping = false) {
        const wrapper = document.createElement('div');
        wrapper.style.textAlign = sender === 'user' ? 'right' : 'left';
        wrapper.style.marginBottom = '10px';

        const bubble = document.createElement('span');
        bubble.style.display       = 'inline-block';
        bubble.style.fontSize      = '0.875rem';
        bubble.style.fontFamily    = 'Manrope, sans-serif';
        bubble.style.lineHeight    = '1.55';
        bubble.style.color         = sender === 'user' ? '#C9981A' : '#e0e0e0';
        bubble.style.letterSpacing = isTyping ? '0.3em' : 'normal';
        bubble.textContent         = text;

        wrapper.appendChild(bubble);
        chatLog.appendChild(wrapper);
        chatLog.scrollTop = chatLog.scrollHeight;
        return bubble; // caller mutates this directly
    }

});
