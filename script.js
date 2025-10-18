/* global THREE, gsap */ // Add this line at the top to avoid warnings about THREE and gsap being global variables (if using ESLint/JSHint)

document.addEventListener('DOMContentLoaded', () => {
    // --- Seed Growth Game ---
    const gameScreen = document.getElementById('game-screen');
    const seedContainer = document.getElementById('seed-container');
    const gameFeedbackEl = document.getElementById('game-feedback');
    const enterSiteBtn = document.getElementById('enter-site-btn');
    const plantPaths = document.querySelectorAll('#seed-svg .plant-path');
    let growthAnimation;

    function setupSeedInteraction() {
        plantPaths.forEach(path => {
            const length = path.getTotalLength();
            path.style.strokeDasharray = length;
            path.style.strokeDashoffset = length;
        });

        growthAnimation = gsap.timeline({ paused: true });
        growthAnimation.to(plantPaths, {
            strokeDashoffset: 0,
            duration: 0.6, // Quick growth
            ease: "power1.out",
            stagger: 0.1, // Quick stagger
            onComplete: onSolved
        });
    }

    function onSolved() {
        feedbackEl.textContent = "Clarity found.";
        gsap.to(feedbackEl, { opacity: 1, duration: 0.5 });
        gsap.to(enterBtn, { opacity: 1, scale: 1, pointerEvents: 'auto', duration: 0.5, delay: 0 });
        seedContainer.style.pointerEvents = 'none'; // Prevent re-triggering
    }

    const startGrowth = (e) => {
        e.preventDefault();
        growthAnimation.play();
    };

    seedContainer.addEventListener('mousedown', startGrowth);
    seedContainer.addEventListener('touchstart', startGrowth, { passive: true });

    enterBtn.addEventListener('click', () => {
        gsap.to(gameScreen, {
            opacity: 0,
            duration: 1.0,
            ease: 'power1.inOut',
            onComplete: () => {
                gameScreen.style.display = 'none';
                gsap.to('#main-content', { opacity: 1, duration: 1, ease: 'power1.out' });
                initMainAnimations(); // Call the function to set up animations for the main content
            }
        });
    });

    setupGrowthAnimation(); // Initialize the seed animation

    // --- Smooth Scrolling ---
    const lenis = new Lenis({ lerp: 0.09 }); // Slightly adjusted smoothness
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // --- Custom Cursor ---
    const cursorDot = document.getElementById('cursor-dot');
    const cursorCircle = document.getElementById('cursor-circle');
    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let circlePos = { ...mouse };
    let circleScale = 1;
    let circleOpacity = 1;

    window.addEventListener('mousemove', e => {
        gsap.to(mouse, {
            duration: 0.3,
            x: e.clientX,
            y: e.clientY,
            ease: 'power2.out'
        });
    });

    gsap.ticker.add(() => {
        const dt = 1.0 - Math.pow(1.0 - 0.15, gsap.ticker.deltaRatio()); // Frame rate independent smoothing
        circlePos.x += (mouse.x - circlePos.x) * dt;
        circlePos.y += (mouse.y - circlePos.y) * dt;

        gsap.set(cursorDot, { x: mouse.x - 4, y: mouse.y - 4 }); // Center dot
        gsap.set(cursorCircle, { x: circlePos.x - 20, y: circlePos.y - 20 }); // Center circle
    });

    document.addEventListener('mouseover', (e) => {
        if (e.target.closest('a, button, input, select, textarea, #seed-container, .value-container')) {
             gsap.to(cursorCircle, { duration: 0.3, scale: 1.6, backgroundColor: 'rgba(218, 165, 32, 0.2)', borderColor: 'transparent', ease: 'power2.out' });
             gsap.to(cursorDot, { duration: 0.3, scale: 0.5, backgroundColor: 'var(--teal)', ease: 'power2.out' });
             document.body.classList.add('link-hover');
        }
    });
     document.addEventListener('mouseout', (e) => {
        if (e.target.closest('a, button, input, select, textarea, #seed-container, .value-container')) {
            gsap.to(cursorCircle, { duration: 0.3, scale: 1, backgroundColor: 'transparent', borderColor: 'var(--gold)', ease: 'power2.out' });
            gsap.to(cursorDot, { duration: 0.3, scale: 1, backgroundColor: 'var(--gold)', ease: 'power2.out' });
            document.body.classList.remove('link-hover');
        }
    });


    // --- Menu Toggle ---
    const menuToggle = document.getElementById('menu-toggle');
    const menuOverlay = document.getElementById('menu-overlay');
    const menuLinks = document.querySelectorAll('.menu-link');
    const toggleSpans = menuToggle.querySelectorAll('span');
    let isMenuOpen = false;

    const menuEase = 'expo.inOut';
    const menuDuration = 0.9;

    const menuTimeline = gsap.timeline({ paused: true })
        .to(menuOverlay, { 
            clipPath: 'circle(150% at calc(100% - 48px) 48px)', // Adjusted origin slightly
            duration: menuDuration, 
            ease: menuEase 
        }, 0)
        .to(menuLinks, { 
            y: 0, 
            opacity: 1, 
            duration: 0.8, 
            stagger: 0.06, 
            ease: 'expo.out' 
        }, 0.2);

    menuToggle.addEventListener('click', () => {
        isMenuOpen = !isMenuOpen;
        menuToggle.classList.toggle('open');
        if(isMenuOpen) {
            menuTimeline.timeScale(1).play();
            gsap.to(toggleSpans[0], { y: 3.5, rotate: 45, duration: 0.4, ease: 'expo.out' });
            gsap.to(toggleSpans[1], { y: -3.5, rotate: -45, duration: 0.4, ease: 'expo.out' });
            lenis.stop(); // Stop smooth scroll when menu is open
        } else {
            menuTimeline.timeScale(1.5).reverse();
            gsap.to(toggleSpans[0], { y: 0, rotate: 0, duration: 0.4, ease: 'expo.out' });
            gsap.to(toggleSpans[1], { y: 0, rotate: 0, duration: 0.4, ease: 'expo.out' });
            lenis.start(); // Resume smooth scroll
        }
    });

    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('href');
            isMenuOpen = false;
            menuToggle.classList.remove('open');
            
            // Reverse animation and then scroll
            menuTimeline.timeScale(1.5).reverse().then(() => { 
                lenis.start();
                 if (target && document.querySelector(target)) {
                     lenis.scrollTo(target, { 
                        duration: 1.8, // Smooth scroll duration
                        easing: (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t) // Expo out ease
                    });
                 }
            });
            gsap.to(toggleSpans[0], { y: 0, rotate: 0, duration: 0.4, ease: 'expo.out' });
            gsap.to(toggleSpans[1], { y: 0, rotate: 0, duration: 0.4, ease: 'expo.out' });
        });
    });


    // --- THREE.JS Background ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 2.5; 
    const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg-canvas'), alpha: true, antialias: true }); // Added antialias
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const particleCount = 10000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const colorGoldThree = new THREE.Color(getComputedStyle(document.documentElement).getPropertyValue('--gold').trim());
    const colorTealThree = new THREE.Color(getComputedStyle(document.documentElement).getPropertyValue('--teal').trim());
    const colorWarmTextThree = new THREE.Color(getComputedStyle(document.documentElement).getPropertyValue('--warm-text').trim());

    for(let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const radius = 6 + Math.random() * 8; 
        const phi = Math.acos(-1 + (2 * Math.random()));
        const theta = Math.sqrt(particleCount * Math.PI) * phi * (Math.random() - 0.5) * 2; 
        
        positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = radius * Math.cos(phi) - 5; // Move particles slightly behind camera initially
        
        const randColor = Math.random();
        let mixedColor;
        if (randColor < 0.6) mixedColor = colorWarmText.clone().lerp(colorGoldThree, Math.random() * 0.3); 
        else if (randColor < 0.85) mixedColor = colorGoldThree.clone();
        else mixedColor = colorTealThree.clone().lerp(colorWarmTextThree, 0.5);
        
        colors[i3] = mixedColor.r; colors[i3 + 1] = mixedColor.g; colors[i3 + 2] = mixedColor.b;
    }
    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.018, sizeAttenuation: true, transparent: true, opacity: 0.6, 
        vertexColors: true, blending: THREE.AdditiveBlending, depthWrite: false
    });
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
    const clock = new THREE.Clock();

    function animateBackground() {
        const elapsedTime = clock.getElapsedTime();
        const scrollY = lenis.scroll;
        
        particles.rotation.y = elapsedTime * 0.015 + scrollY * 0.00005; // Slower scroll effect
        particles.rotation.x = elapsedTime * 0.008;

        // More subtle mouse parallax on particles rotation
        particles.rotation.z += ((-mouse.x / window.innerWidth * 0.02 + 0.01) - particles.rotation.z) * 0.05;

        // Camera subtle drift
        camera.position.x += (Math.sin(elapsedTime * 0.1) * 0.05 - camera.position.x) * 0.01;
        camera.position.y += (Math.cos(elapsedTime * 0.08) * 0.05 - camera.position.y) * 0.01;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
        requestAnimationFrame(animateBackground);
    }
    animateBackground();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    // --- MAIN CONTENT ANIMATIONS ---
    function initAnimations() {
        // Line reveal for paragraphs and initial subtitle
        gsap.utils.toArray('.line-parent .line-child').forEach(el => {
            gsap.fromTo(el, { y: '110%' }, { 
                y: '0%', 
                duration: 1.5, 
                ease: 'expo.out', // Smooth, decelerating ease
                scrollTrigger: {
                    trigger: el.closest('.line-parent'), // Trigger based on parent
                    start: 'top 90%' 
                }
            });
        });

        // Simple reveal up for smaller elements/blocks
        gsap.utils.toArray('.reveal-up').forEach(elem => {
            gsap.fromTo(elem, { opacity: 0, y: 70 }, { // Gentle lift
                opacity: 1, y: 0, duration: 1.6, ease: 'expo.out',
                scrollTrigger: { trigger: elem, start: 'top 88%' }
            });
        });

        // Parallax Images
        gsap.utils.toArray('.parallax-image').forEach(img => {
            gsap.to(img, {
                yPercent: -10, // Subtle parallax
                ease: 'none',
                scrollTrigger: {
                    trigger: img.closest('.parallax-container'), 
                    start: 'top bottom', 
                    end: 'bottom top', 
                    scrub: 1.5 // Smooth scrub
                }
            });
        });
        
        // Counter Animation
        const userCounter = document.getElementById('user-counter');
        if (userCounter) { 
            gsap.from(userCounter, {
                textContent: 0, duration: 3, ease: "expo.out", snap: { textContent: 1 },
                scrollTrigger: { trigger: userCounter, start: "top 85%" },
                onUpdate: function() { this.targets()[0].innerHTML = Math.ceil(this.targets()[0].textContent).toLocaleString() + "+"; }
            });
             ScrollTrigger.create({
                trigger: userCounter, start: "top 85%",
                onEnter: () => gsap.to(userCounter, { textContent: "100000", duration: 3, ease: "expo.out", onUpdate: function() { this.targets()[0].innerHTML = Math.ceil(this.targets()[0].textContent).toLocaleString() + "+"; }})
             });
        }

        // Timeline Path Animation
        const timelinePath = document.querySelector('.timeline-path');
        if(timelinePath) {
            const length = timelinePath.getTotalLength();
            gsap.set(timelinePath, { strokeDasharray: length, strokeDashoffset: length });
            gsap.to(timelinePath, {
                strokeDashoffset: 0, duration: 3, ease: 'power1.inOut',
                scrollTrigger: { trigger: timelinePath, start: 'top 85%' }
            });
        }

        // General Smooth Scroll Anchors (excluding menu links handled separately)
        document.querySelectorAll('a[href^="#"]:not(.menu-link)').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    lenis.scrollTo(targetElement, { 
                        duration: 1.8, // Slightly gentler scroll duration
                        easing: (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t) // Expo out ease
                    });
                }
            });
        });
    }
        
    // --- MEHFOOZBOT LOGIC --- (Keep as is, seems fine for the feel)
    const chatLog = document.getElementById('chat-log');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const promptButtonsContainer = document.getElementById('prompt-buttons');

    const botResponses = {
        "greeting": "Salaam! Welcome to Mehfooz. How can I help you find clarity today?", 
        "default": "That's an interesting thought! While I'm still learning, the full Mehfooz platform offers resources on many topics. Maybe ask about our story, safety, or spotting fake news?",
        "misinformation": "Spotting misinformation is key! Look closely at the source - is it trustworthy? Does it use strong, emotional language? Does it offer proof? Real news is often calmer and shows evidence. We have mini-courses on this!",
        "safety": "Staying safe online is like protecting your home. Use strong, different passwords. Be careful what personal details you share, especially in messages or public posts. Think before you click links! Our resources cover this in detail.",
        "story": "Mehfooz began with conversations in Skardu, listening to the community's hopes and worries about the digital world. We aim to build a bridge between traditional wisdom and modern tools. You can feel our story in the 'Our Story' section.",
        "ulema": "We proudly partner with respected local Ulema. They are trusted voices who help us share digital literacy in a way that resonates deeply within the community, blending faith and knowledge."
    };
    const promptQuestions = {
        "What's your story?": "story",
        "How do you work with Ulema?": "ulema",
        "Tips for spotting fake news?": "misinformation",
        "How can I stay safe online?": "safety"
    };
    
    function addMessage(message, sender, isImmediate = false) {
        const bubble = document.createElement('div');
        bubble.className = `chat-bubble ${sender}-bubble font-body`; // Use body font for chat
        bubble.textContent = message;
        chatLog.appendChild(bubble);
        gsap.from(bubble, { opacity: 0, y: 20, duration: 0.6, delay: isImmediate ? 0 : 0.4, ease: 'expo.out' });
        chatLog.scrollTop = chatLog.scrollHeight;
    }

    function handleUserInput(input) {
         if(input.trim()){
            addMessage(input, 'user', true);
            chatInput.value = '';
            chatInput.disabled = true;
            promptButtonsContainer.style.pointerEvents = 'none';
            gsap.to(promptButtonsContainer.querySelectorAll('button'), { opacity: 0.5, duration: 0.3 });
            addMessage("Thinking...", 'bot', true); 
            const thinkingBubble = chatLog.lastChild;

            setTimeout(() => {
                gsap.to(thinkingBubble, {opacity: 0, duration: 0.3, onComplete: () => thinkingBubble.remove()});
                const responseKey = Object.keys(promptQuestions).find(key => input.toLowerCase().includes(key.toLowerCase().split(' ')[2])) || 'default';
                const response = botResponses[promptQuestions[input] || responseKey];
                addMessage(response, 'bot');
                chatInput.disabled = false;
                chatInput.focus();
                promptButtonsContainer.style.pointerEvents = 'auto';
                gsap.to(promptButtonsContainer.querySelectorAll('button'), { opacity: 1, duration: 0.3 });
            }, 900 + Math.random() * 600);
         }
    }

    chatForm.addEventListener('submit', e => {
         e.preventDefault();
         handleUserInput(chatInput.value);
    });
    
    Object.keys(promptQuestions).forEach(question => {
        const button = document.createElement('button');
        button.className = "font-body text-sm bg-warm-dark/50 border border-medium-text/30 rounded-full py-2 px-3 text-medium-text hover:border-gold hover:text-gold transition-colors text-left"; // Gold hover
        button.textContent = question;
        button.onclick = () => { handleUserInput(question); }
        promptButtonsContainer.appendChild(button);
    });

    setTimeout(() => { addMessage(botResponses.greeting, 'bot', true); }, 500);

    // --- CONTACT FORM LOGIC ---
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');
    contactForm.addEventListener('submit', e => {
         e.preventDefault();
         gsap.to(contactForm, { opacity: 0, duration: 0.5, onComplete: () => {
             contactForm.style.display = 'none';
             formSuccess.classList.remove('hidden');
             gsap.from(formSuccess, {opacity: 0, y: 20, duration: 0.5});
         }});
    });

    });
    </script>
</body>
</html>
