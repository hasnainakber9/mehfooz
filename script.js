document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. LUXURY INITIALIZATION (Lenis & GSAP) ---
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true
    });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    gsap.registerPlugin(ScrollTrigger);

    // --- 2. PRELOADER SEQUENCE ---
    const loader = document.querySelector('.loader-curtain');
    const loadingBar = document.querySelector('.loading-bar');
    
    // Simulate loading (since we removed the game)
    let progress = 0;
    const loadInterval = setInterval(() => {
        progress += Math.random() * 10;
        if(progress > 100) progress = 100;
        loadingBar.style.width = `${progress}%`;
        
        if(progress === 100) {
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
          }, "-=0.5")
          .from('.hero-stats', { opacity: 0, duration: 1 }, "-=1");
        
        // Start counters
        animateCounters();
    }

    // --- 3. CUSTOM CURSOR & MAGNETIC ---
    const cursor = document.getElementById('cursor-dot');
    const light = document.getElementById('cursor-light');
    
    window.addEventListener('mousemove', (e) => {
        gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1 });
        gsap.to(light, { x: e.clientX, y: e.clientY, duration: 0.5 });
    });

    document.querySelectorAll('.magnetic').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const strength = btn.getAttribute('data-strength') || 30;
            gsap.to(btn, {
                x: (e.clientX - rect.left - rect.width / 2) / strength * 10,
                y: (e.clientY - rect.top - rect.height / 2) / strength * 10,
                duration: 0.3
            });
        });
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, { x: 0, y: 0, duration: 0.3 });
        });
    });

    // --- 4. COSMIC BACKGROUND (Preserved) ---
    const canvas = document.getElementById('cosmicBackground');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const stars = Array(150).fill().map(() => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2,
            speed: Math.random() * 0.5
        }));

        function animateCosmos() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#DAA520'; // Gold
            stars.forEach(star => {
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI*2);
                ctx.fill();
                star.y -= star.speed;
                if(star.y < 0) star.y = canvas.height;
            });
            requestAnimationFrame(animateCosmos);
        }
        animateCosmos();
        
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    // --- 5. COUNTERS (Preserved) ---
    function animateCounters() {
        const numbers = document.querySelectorAll('.stat-number');
        numbers.forEach(num => {
            // Hardcoded targets from your brief
            const target = num.id === 'user-counter' ? 15000 : 45; 
            gsap.to(num, {
                innerText: target,
                duration: 2.5,
                snap: { innerText: 1 },
                scrollTrigger: { trigger: num, start: "top 90%" }
            });
        });
    }

    // --- 6. CHAT BOT LOGIC (Preserved) ---
    const botModal = document.getElementById('bot-modal');
    const openBtn = document.getElementById('open-bot-demo-approach');
    const closeBtn = document.getElementById('close-bot-demo');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatLog = document.getElementById('modal-chat-log');

    if(openBtn) {
        openBtn.addEventListener('click', () => {
            botModal.classList.remove('hidden');
            // Add greeting if empty
            if(chatLog.children.length === 0) {
                addMessage("bot", "Hello. I am the Mehfooz Assistant. How can I help you navigate the digital world safely?");
            }
        });
    }
    
    if(closeBtn) {
        closeBtn.addEventListener('click', () => botModal.classList.add('hidden'));
    }

    if(chatForm) {
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = chatInput.value.trim();
            if(!text) return;
            
            addMessage("user", text);
            chatInput.value = '';
            
            // Simulating response
            setTimeout(() => {
                addMessage("bot", "Thank you for that query. Our team is working on specific modules for " + text + ".");
            }, 1000);
        });
    }

    function addMessage(sender, text) {
        const msgDiv = document.createElement('div');
        msgDiv.style.marginBottom = '10px';
        msgDiv.style.textAlign = sender === 'user' ? 'right' : 'left';
        msgDiv.style.color = sender === 'user' ? '#DAA520' : '#e0e0e0';
        msgDiv.textContent = text;
        chatLog.appendChild(msgDiv);
        chatLog.scrollTop = chatLog.scrollHeight;
    }
});
