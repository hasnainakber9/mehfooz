document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. INITIALIZE LENIS (Smooth Scroll) ---
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        smooth: true
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // --- 2. GSAP SCROLL TRIGGERS ---
    gsap.registerPlugin(ScrollTrigger);

    // Hero Text Reveal
    const revealElements = document.querySelectorAll('.reveal-text');
    revealElements.forEach(el => {
        gsap.fromTo(el, 
            { y: 100, opacity: 0 },
            { 
                y: 0, 
                opacity: 1, 
                duration: 1.5, 
                ease: 'power4.out',
                stagger: 0.1,
                scrollTrigger: { trigger: el, start: 'top 90%' }
            }
        );
    });

    // Number Counter Animation
    const numbers = document.querySelectorAll('.stat-number');
    numbers.forEach(num => {
        const target = +num.getAttribute('data-target');
        gsap.to(num, {
            innerText: target,
            duration: 2,
            snap: { innerText: 1 }, // Integers only
            scrollTrigger: { trigger: num, start: 'top 80%' }
        });
    });

    // --- 3. CUSTOM CURSOR & MAGNETIC BUTTONS ---
    const cursorDot = document.getElementById('cursor-dot');
    const cursorCircle = document.getElementById('cursor-circle');
    const magneticBtns = document.querySelectorAll('.magnetic');

    // Move Cursor
    window.addEventListener('mousemove', (e) => {
        gsap.to(cursorDot, { x: e.clientX, y: e.clientY, duration: 0.1 });
        gsap.to(cursorCircle, { x: e.clientX, y: e.clientY, duration: 0.3 });
    });

    // Magnetic Effect
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            document.body.classList.add('hovering');
            const rect = btn.getBoundingClientRect();
            const strength = btn.getAttribute('data-strength') || 20;
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(btn, { x: x / strength, y: y / strength, duration: 0.3 });
        });

        btn.addEventListener('mouseleave', () => {
            document.body.classList.remove('hovering');
            gsap.to(btn, { x: 0, y: 0, duration: 0.3 });
        });
    });

    // --- 4. CANVAS ANIMATION (The "Net") ---
    const canvas = document.getElementById('hero-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }
        draw() {
            ctx.fillStyle = 'rgba(218, 165, 32, 0.5)'; // Gold
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Init Particles
    for(let i=0; i<60; i++) particles.push(new Particle());

    function animateCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw Particles & Connections
        particles.forEach((p, index) => {
            p.update();
            p.draw();
            
            // Connect nearby particles
            for (let j = index; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                
                if (dist < 150) {
                    ctx.strokeStyle = `rgba(218, 165, 32, ${1 - dist/150})`; // Fading gold lines
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        });
        requestAnimationFrame(animateCanvas);
    }
    animateCanvas();

    // --- 5. LOADER OUT ---
    window.addEventListener('load', () => {
        const tl = gsap.timeline();
        tl.to('.loader-line', { width: '100%', duration: 1 })
          .to('.loader-curtain', { y: '-100%', duration: 1, ease: 'power4.inOut' })
          .set('body', { className: '-=is-loading' });
    });
});
