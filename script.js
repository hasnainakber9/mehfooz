document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // --- Selectors ---
    const selectors = {
        loadingScreen: '#loadingScreen',
        loadingParticles: '#loadingParticles',
        introGame: '#introGame',
        sparkContainer: '#sparkContainer',
        gameSkip: '#gameSkip',
        siteWrapper: '#site-wrapper',
        cursorDot: '#cursor-dot',
        cursorLight: '#cursor-light',
        siteHeader: '#site-header',
        navLinksContainer: '#nav-links',
        mobileNavToggle: '#mobile-nav-toggle',
        heroHeadline: '#hero-headline',
        heroSubheadline: '#hero-subheadline',
        cosmicBackground: '#cosmicBackground',
        staticBackground: '#staticBackground',
        networkCanvas: '#network-canvas',
        userCounter: '#user-counter',
        platformCounter: '#platform-counter',
        settingsToggleBtn: '#settings-toggle-btn',
        settingsModal: '#settings-modal',
        settingsCloseBtn: '#settings-close-btn',
        motionToggle: '#motion-toggle',
        helpToggleBtn: '#help-toggle-btn',
        keyboardHelp: '#keyboard-help',
        modalBackdrop: '#modal-backdrop',
        chatLog: '#chat-log',
        chatForm: '#chat-form',
        chatInput: '#chat-input',
        promptButtonsContainer: '#prompt-buttons',
        openBotBtn: '#open-bot-demo-approach',
        botModal: '#bot-modal',
        closeBotBtn: '#close-bot-demo',
        modalChatLog: '#modal-chat-log',
        modalChatForm: '#modal-chat-form',
        modalChatInput: '#modal-chat-input',
        modalPillContainer: '#modal-question-pills',
        contactForm: '#contact-form',
        formSuccess: '#form-success',
        chatBubble: '#chatBubble'
    };

    // --- Element Cache ---
    const els = {};
    let criticalElementMissing = false;
    for (const key in selectors) {
        els[key] = document.querySelector(selectors[key]);
        if (!els[key] && ['loadingScreen', 'introGame', 'siteWrapper', 'siteHeader', 'cosmicBackground', 'staticBackground'].includes(key)) {
            console.error(`Critical element missing: ${key} (${selectors[key]})`);
            criticalElementMissing = true;
        }
    }
    if (criticalElementMissing) {
        console.error("Aborting script initialization due to missing critical elements.");
        // Optionally display a user-facing error message here
        return;
    }

    // --- State ---
    let lenis;
    let isSiteEntered = false;
    let cosmicBgAnimator = null;
    let skipKeyListenerRef = null;

    // --- Initial Setup ---
    registerGsapPlugins();
    initCustomCursor();
    startLoadingSequence();

    // --- GSAP Plugin Registration ---
    function registerGsapPlugins() {
        if (typeof gsap === 'undefined') {
            console.warn("GSAP not loaded. Animations will be disabled.");
            document.body.classList.add('reduced-motion');
            return;
        }
        try {
            gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
            // Register TextPlugin only if counters exist and TextPlugin is loaded
            if ((els.userCounter || els.platformCounter) && typeof TextPlugin !== 'undefined') {
                 gsap.registerPlugin(TextPlugin);
            } else if ((els.userCounter || els.platformCounter) && typeof TextPlugin === 'undefined') {
                console.warn("GSAP TextPlugin not loaded. Counter animations disabled.");
            }
        } catch (e) {
            console.error("Error registering GSAP plugins:", e);
            document.body.classList.add('reduced-motion');
        }
    }

    // --- Custom Cursor ---
    function initCustomCursor() {
        if (window.matchMedia("(hover: none)").matches || document.body.classList.contains('reduced-motion') || !els.cursorDot || !els.cursorLight) {
            document.body.style.cursor = 'auto';
            if(els.cursorDot) els.cursorDot.style.display = 'none';
            if(els.cursorLight) els.cursorLight.style.display = 'none';
            return;
        }

        if (typeof gsap === 'undefined') return; // Don't run if GSAP failed

        gsap.set([els.cursorDot, els.cursorLight], { opacity: 1 });
        let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

        window.addEventListener('mousemove', e => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        }, { passive: true });

        gsap.ticker.add(() => {
            gsap.to(els.cursorDot, { duration: 0.2, x: mouse.x, y: mouse.y });
            gsap.to(els.cursorLight, { duration: 0.5, x: mouse.x, y: mouse.y, ease: 'power2.out' });
        });
    }

    // --- Intro Sequence Functions ---
    function startLoadingSequence() {
        if (!els.loadingScreen) return;
        createLoadingParticles();
        // Slightly longer timeout to ensure content is ready
        setTimeout(hideLoadingScreen, 700);
    }

    function createLoadingParticles() {
        const container = els.loadingParticles;
        if (!container) return;
        container.innerHTML = ''; // Clear existing particles if any
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 200 + 'px';
            particle.style.animationDelay = Math.random() * 3 + 's';
            particle.style.animationDuration = (2 + Math.random() * 2) + 's';
            container.appendChild(particle);
        }
    }

    function hideLoadingScreen() {
        if (!els.loadingScreen || !els.introGame) {
            // If intro game element is missing, skip directly to site content
            console.warn("Intro game element not found, skipping to main site.");
            completeIntroGame(true); // Force completion without intro game
            return;
        }
        if (typeof gsap === 'undefined') {
             els.loadingScreen.classList.add('hidden');
             els.loadingScreen.style.display = 'none';
             els.introGame.classList.add('active');
             initVisualIntro();
             return;
        }
        gsap.to(els.loadingScreen, {
            opacity: 0,
            duration: 0.5,
            ease: 'power2.out',
            onComplete: () => {
                els.loadingScreen.classList.add('hidden');
                els.loadingScreen.style.display = 'none'; // Ensure it's removed from layout
                els.introGame.classList.add('active');
                initVisualIntro();
            }
        });
    }

    function initVisualIntro() {
        const { sparkContainer, gameSkip } = els;
        if (!sparkContainer || !gameSkip) {
            console.error("Spark container or skip button missing. Skipping intro game.");
            completeIntroGame(true); // Skip the game if elements are missing
            return;
        }

        const sparks = sparkContainer.querySelectorAll('.spark');
        const totalSparks = sparks.length;
        let collectedCount = 0;
        let isProcessing = false;

        sparks.forEach(spark => {
            spark.addEventListener('click', () => {
                if (isProcessing || spark.classList.contains('collected')) return;
                spark.classList.add('collected');
                collectedCount++;
                if (collectedCount >= totalSparks) {
                    isProcessing = true;
                    setTimeout(() => completeIntroGame(), 500); // Trigger site entry
                }
            });
        });

        gameSkip.addEventListener('click', () => {
            if (!isProcessing) completeIntroGame();
        });

        // Setup key listener for skipping
        skipKeyListenerRef = (e) => {
            if (!isProcessing && els.introGame?.classList.contains('active')) {
                if (e.key === 'Escape' || e.key.toLowerCase() === 's') {
                    completeIntroGame();
                }
            }
        };
        document.addEventListener('keydown', skipKeyListenerRef);
    }

    function completeIntroGame(forceSkipGame = false) {
        if (isSiteEntered || !els.introGame || !els.siteWrapper) return;
        isSiteEntered = true;

        if (skipKeyListenerRef) {
            document.removeEventListener('keydown', skipKeyListenerRef);
            skipKeyListenerRef = null;
        }

        // Ensure site wrapper is ready to be shown
        els.siteWrapper.style.visibility = 'visible'; // Make visible before animation

        const onCompleteSequence = () => {
             if (!forceSkipGame && els.introGame) {
                 els.introGame.style.display = 'none'; // Hide intro game
             }
             if(els.loadingScreen) {
                els.loadingScreen.style.display = 'none'; // Ensure loading is hidden too
             }
             document.body.classList.add('site-entered');
             initSmoothScroll();
             initNavigation();
             initAccessibility();
             initMotionAndBackground(); // This will init Three.js if needed
             initHeroAnimation();
             initChallengeAnimation();
             initSiteAnimations();
             initChatbot();
             initContactForm();
             initFloatingChatBubble();
        };

        if (typeof gsap === 'undefined' || forceSkipGame) {
             if (!forceSkipGame && els.introGame) els.introGame.style.opacity = '0';
             els.siteWrapper.style.opacity = '1';
             if(els.siteHeader) els.siteHeader.style.transform = 'translateY(0%)';
             if(els.siteHeader) els.siteHeader.style.opacity = '1';
             onCompleteSequence();
             return;
        }

        const tl = gsap.timeline({ onComplete: onCompleteSequence });

        if (!forceSkipGame) {
            tl.to(els.introGame, { opacity: 0, duration: 1.0, ease: 'power2.inOut' });
        } else {
             els.introGame.style.display = 'none'; // Immediately hide if forced
        }

        tl.to(els.siteWrapper, { opacity: 1, duration: 1.0, ease: 'power2.out' }, forceSkipGame ? 0 : "-=0.5")
          .to(els.siteHeader, { y: '0%', opacity: 1, duration: 1.2, ease: 'power3.out' }, forceSkipGame ? 0.2 : "-=0.7");
    }


    // --- Smooth Scroll (Lenis) ---
    function initSmoothScroll() {
        if (typeof Lenis === 'undefined' || document.body.classList.contains('reduced-motion')) return;
        try {
            lenis = new Lenis();
            if (typeof gsap !== 'undefined') {
                gsap.ticker.add((time) => lenis.raf(time * 1000));
            } else {
                // Fallback basic raf loop if gsap isn't available
                 function raf(time) {
                     lenis.raf(time);
                     requestAnimationFrame(raf);
                 }
                 requestAnimationFrame(raf);
            }
        } catch (e) {
            console.error("Error initializing Lenis:", e);
        }
    }

    // --- Navigation ---
    function initNavigation() {
        if (els.siteHeader && typeof ScrollTrigger !== 'undefined' && !document.body.classList.contains('reduced-motion')) {
             ScrollTrigger.create({
                 start: 'top top-=-10px', // Trigger slightly below the top
                 onUpdate: self => {
                     // Add scrolled class when scrolling down past the trigger point
                     // Remove immediately when scrolling up past the trigger point
                     els.siteHeader.classList.toggle('is-scrolled', self.direction === 1 && self.scroll() > 10);
                 }
             });
        }

        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetEl = document.querySelector(targetId);

                if (targetEl) {
                    const offset = - (els.siteHeader?.offsetHeight || 72) - 10; // Header height + small buffer

                    if (lenis && !document.body.classList.contains('reduced-motion')) {
                        lenis.scrollTo(targetEl, { offset: offset });
                    } else if (typeof gsap !== 'undefined' && typeof ScrollToPlugin !== 'undefined' && !document.body.classList.contains('reduced-motion')) {
                        // Use GSAP ScrollToPlugin if Lenis isn't active but GSAP is
                        gsap.to(window, { duration: 1, scrollTo: { y: targetEl, offsetY: offset }, ease: "power2.inOut" });
                    } else {
                        // Fallback to native smooth scroll
                        const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY + offset;
                        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                    }

                    // Close mobile nav if open
                    if (els.navLinksContainer?.classList.contains('is-visible')) {
                        els.mobileNavToggle?.click();
                    }
                } else {
                    console.warn(`Target element not found for link: ${targetId}`);
                }
            });
        });

        // Active link highlighting using ScrollTrigger
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && !document.body.classList.contains('reduced-motion')) {
            gsap.utils.toArray('main section[id]').forEach((section) => {
                ScrollTrigger.create({
                    trigger: section,
                    start: 'top center+=100px', // When section center is slightly below viewport center
                    end: 'bottom center-=100px', // When section center is slightly above viewport center
                    onToggle: self => {
                        const link = document.querySelector(`.nav-link[href="#${section.id}"]`);
                        if (link) {
                            if (self.isActive) {
                                document.querySelectorAll('.nav-link.active').forEach(l => l.classList.remove('active'));
                                link.classList.add('active');
                            } else {
                                link.classList.remove('active');
                            }
                        }
                    }
                });
            });
            // Ensure home is active initially if no other section is
             const homeLink = document.querySelector('.nav-link[href="#home"]');
             if(homeLink && !document.querySelector('.nav-link.active')) {
                 homeLink.classList.add('active');
             }
        }

        // Mobile Nav Toggle
        if (els.mobileNavToggle && els.navLinksContainer) {
            els.mobileNavToggle.addEventListener('click', () => {
                const isExpanded = els.mobileNavToggle.getAttribute('aria-expanded') === 'true';
                els.mobileNavToggle.setAttribute('aria-expanded', !isExpanded);
                els.navLinksContainer.classList.toggle('is-visible');
                document.body.classList.toggle('nav-open'); // Optional: Prevent body scroll when nav is open
            });
        }
    }


    // --- Motion Preferences & Background Control ---
    function initMotionAndBackground() {
        if (!els.motionToggle) return;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let motionEnabled = !prefersReducedMotion;
        els.motionToggle.checked = motionEnabled;

        setMotion(motionEnabled); // Initial setting

        els.motionToggle.addEventListener('change', (e) => setMotion(e.target.checked));

        // Listen for system changes
        window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', e => {
            if (e.matches) {
                setMotion(false); // Force disable if system prefers reduced motion
                els.motionToggle.checked = false;
            }
        });
    }

    function setMotion(enabled) {
        const wasReduced = document.body.classList.contains('reduced-motion');
        const isNowReduced = !enabled;

        document.body.classList.toggle('reduced-motion', isNowReduced);

        // Toggle Lenis smooth scroll
        if (lenis) {
            enabled ? lenis.start() : lenis.stop();
        }

        // Toggle background and animations
        if (els.cosmicBackground && els.staticBackground) {
            const showStatic = !enabled || typeof THREE === 'undefined';
            els.cosmicBackground.style.display = showStatic ? 'none' : 'block';
            els.staticBackground.style.display = showStatic ? 'block' : 'none';

            if (cosmicBgAnimator) {
                 if (showStatic) {
                     cosmicBgAnimator.stop();
                 } else {
                     cosmicBgAnimator.animate();
                 }
            } else if (!showStatic && typeof THREE !== 'undefined') {
                initCosmicBackground(); // Initialize if switching to motion and not already running
            }
        }

        // Refresh ScrollTrigger if motion preference changed, as positions might shift
         if (wasReduced !== isNowReduced && typeof ScrollTrigger !== 'undefined') {
             ScrollTrigger.refresh();
         }
    }


    // --- Cosmic Background Initialization ---
    function initCosmicBackground() {
        if (typeof THREE === 'undefined' || !els.cosmicBackground || cosmicBgAnimator) {
             console.warn("Three.js not loaded, background animation disabled.");
             if(els.cosmicBackground) els.cosmicBackground.style.display = 'none';
             if(els.staticBackground) els.staticBackground.style.display = 'block';
             return; // Don't initialize if already running or Three.js missing
        }
        if (document.body.classList.contains('reduced-motion')) {
             els.cosmicBackground.style.display = 'none';
             els.staticBackground.style.display = 'block';
             return; // Don't initialize if reduced motion is on
        }

        try {
            const container = els.cosmicBackground;
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setClearColor(0x000000, 0); // Transparent background

            container.innerHTML = ''; // Clear previous canvas if any
            container.appendChild(renderer.domElement);

            const particleCount = window.innerWidth > 1024 ? 1500 : 400; // Adjust density based on screen size
            const particles = new THREE.BufferGeometry();
            const positions = new Float32Array(particleCount * 3);
            const colors = new Float32Array(particleCount * 3);

            const colorPalette = [
                new THREE.Color(getComputedStyle(document.documentElement).getPropertyValue('--color-accent-gold').trim()),
                new THREE.Color(getComputedStyle(document.documentElement).getPropertyValue('--color-accent-teal').trim()),
                new THREE.Color(getComputedStyle(document.documentElement).getPropertyValue('--color-text').trim()),
                new THREE.Color(getComputedStyle(document.documentElement).getPropertyValue('--color-medium').trim())
            ];

            for (let i = 0; i < particleCount; i++) {
                // Position particles further away initially
                positions[i * 3] = (Math.random() - 0.5) * 1500;
                positions[i * 3 + 1] = (Math.random() - 0.5) * 1500;
                positions[i * 3 + 2] = (Math.random() - 0.5) * 1500;

                const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
                colors[i * 3] = color.r;
                colors[i * 3 + 1] = color.g;
                colors[i * 3 + 2] = color.b;
            }

            particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));

            const particleMaterial = new THREE.PointsMaterial({
                size: 2,
                vertexColors: true,
                transparent: true,
                opacity: 0.8,
                blending: THREE.AdditiveBlending,
                sizeAttenuation: true // Points smaller further away
            });

            const particleSystem = new THREE.Points(particles, particleMaterial);
            scene.add(particleSystem);

            camera.position.z = 400; // Start camera further back

            let animationId = null;

            const animate = () => {
                 if (document.body.classList.contains('reduced-motion')) {
                     stop(); // Stop if reduced motion is enabled
                     return;
                 }
                 animationId = requestAnimationFrame(animate);

                 particleSystem.rotation.y += 0.0003; // Slow rotation

                 // Subtle movement
                 const time = Date.now() * 0.00005;
                 particleSystem.position.x = Math.sin(time * 0.7) * 5;
                 particleSystem.position.y = Math.cos(time * 0.5) * 5;

                 renderer.render(scene, camera);
            };

            const stop = () => {
                if (animationId) {
                    cancelAnimationFrame(animationId);
                    animationId = null;
                }
            };

            cosmicBgAnimator = { animate, stop };
            if (!document.body.classList.contains('reduced-motion')) {
                 animate(); // Start animation only if motion is enabled
            }


            const handleResize = () => {
                 if (!renderer || !camera) return;
                 camera.aspect = window.innerWidth / window.innerHeight;
                 camera.updateProjectionMatrix();
                 renderer.setSize(window.innerWidth, window.innerHeight);
            };
            window.addEventListener('resize', handleResize);

        } catch (error) {
            console.error('Three.js background initialization failed:', error);
            if(els.cosmicBackground) els.cosmicBackground.style.display = 'none';
            if(els.staticBackground) els.staticBackground.style.display = 'block';
            cosmicBgAnimator = { animate: () => {}, stop: () => {} }; // Provide dummy functions
        }
    }


    // --- Hero Content Animation ---
    function initHeroAnimation() {
         if (document.body.classList.contains('reduced-motion') || !els.heroHeadline || !els.heroSubheadline || typeof gsap === 'undefined') {
              if(els.heroHeadline) els.heroHeadline.style.opacity = '1'; // Ensure visible if no animation
              if(els.heroSubheadline) els.heroSubheadline.style.opacity = '1';
              if(els.heroSubheadline) els.heroSubheadline.style.transform = 'translateY(0)';
              return;
         }

         gsap.set(els.heroHeadline, { opacity: 1 }); // Ensure base opacity is set before animating gradient

         const tl = gsap.timeline({ delay: 0.5 }); // Start slightly after page load transition
         tl.to(els.heroHeadline, {
             backgroundPosition: '0% 0', // Animate gradient fill
             duration: 1.5,
             ease: 'power2.inOut'
         })
         .to(els.heroSubheadline, {
             opacity: 1,
             y: 0,
             duration: 1.2,
             ease: 'power2.out'
         }, "-=1"); // Overlap slightly with headline animation
    }


    // --- Challenge Section Canvas Animation ---
    function initChallengeAnimation() {
        if (!els.networkCanvas || document.body.classList.contains('reduced-motion')) {
             if(els.networkCanvas) els.networkCanvas.style.display = 'none'; // Hide canvas if not animating
             return;
        }

        const canvas = els.networkCanvas;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error("Could not get 2D context for network canvas.");
            return;
        }

        let nodes = [];
        let animationFrameId;

        function resizeCanvas() {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            createNodes(); // Recreate nodes on resize
        }

        class Node {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.radius = Math.random() * 2 + 1;
                this.baseColor = 'rgba(168, 162, 154, 0.5)'; // --color-medium with alpha
                this.color = this.baseColor;
                this.isGlitched = false;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }

        function createNodes() {
            nodes = [];
            const density = window.innerWidth < 768 ? 80 : 60; // Fewer nodes on smaller screens
            const cols = Math.floor(canvas.width / density);
            const rows = Math.floor(canvas.height / density);

            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    const x = i * density + (Math.random()) * density; // Add some randomness
                    const y = j * density + (Math.random()) * density;
                    nodes.push(new Node(x, y));
                }
            }
        }

        function connectNodes() {
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[i].x - nodes[j].x;
                    const dy = nodes[i].y - nodes[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 90) { // Connection distance
                        ctx.beginPath();
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);

                        const opacity = 1 - (dist / 90);
                        const color = (nodes[i].isGlitched && nodes[j].isGlitched)
                            ? `rgba(255, 107, 107, ${opacity * 0.5})` // --color-error-like
                            : `rgba(168, 162, 154, ${opacity * 0.4})`; // --color-medium

                        ctx.strokeStyle = color;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            if (document.body.classList.contains('reduced-motion')) {
                 if (animationFrameId) cancelAnimationFrame(animationFrameId);
                 animationFrameId = null;
                 return;
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            nodes.forEach(node => node.draw());
            connectNodes();
            animationFrameId = requestAnimationFrame(animate);
        }

        // Initialize
        resizeCanvas();
        animate();

        window.addEventListener('resize', resizeCanvas);

        // Glitch effect tied to scroll trigger
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.create({
                trigger: '#challenge',
                start: 'top center',
                end: 'bottom center',
                onUpdate: (self) => {
                    const progress = self.progress; // 0 to 1
                    nodes.forEach(node => {
                        // Increase glitch chance as section scrolls into view
                        if (Math.random() < progress * 0.01) { // Small chance
                            node.isGlitched = true;
                            node.color = `rgba(255, 107, 107, ${Math.random() * 0.5 + 0.5})`; // Error color with random alpha
                        } else if (node.isGlitched && Math.random() > 0.95) { // Chance to revert
                            node.isGlitched = false;
                            node.color = node.baseColor;
                        }
                    });
                },
                onLeaveBack: () => { // Reset when scrolling back up past the start
                    nodes.forEach(node => {
                        node.isGlitched = false;
                        node.color = node.baseColor;
                    });
                }
            });
        }
    }


    // --- General Site Animations (ScrollTrigger Reveals) ---
    function initSiteAnimations() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            console.warn("GSAP or ScrollTrigger not loaded. Site animations disabled.");
            // Make elements visible if no animation
            document.querySelectorAll('.reveal-up, .journal-image-container').forEach(el => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            });
             if(els.userCounter) els.userCounter.textContent = "100,000+";
             if(els.platformCounter) els.platformCounter.textContent = "3+";
            return;
        }

        // Setup matchMedia for reduced motion preference
        const mm = gsap.matchMedia();

        mm.add("(prefers-reduced-motion: no-preference)", () => {
            // Reveal animations for elements with the .reveal-up class
            gsap.utils.toArray('.reveal-up').forEach(elem => {
                gsap.fromTo(elem,
                    { opacity: 0, y: 50 },
                    {
                        opacity: 1, y: 0, duration: 1.2, ease: 'power3.out',
                        scrollTrigger: {
                            trigger: elem,
                            start: 'top 88%', // Start animation when element is 88% from top of viewport
                            once: true // Only animate once
                        }
                    }
                );
            });

             // Specific animation for journal image if it exists and needs different timing
             const journalImageContainer = document.querySelector('.journal-image-container');
             if (journalImageContainer) {
                 gsap.fromTo(journalImageContainer,
                     { opacity: 0, y: 50 },
                     {
                         opacity: 1, y: 0, duration: 1.2, ease: 'power3.out',
                         scrollTrigger: {
                             trigger: journalImageContainer,
                             start: 'top 85%', // Slightly different start point
                             once: true
                         }
                     }
                 );
             }


            // Number counters in Vision section, check if TextPlugin is loaded
            if (els.userCounter && typeof TextPlugin !== 'undefined') {
                 gsap.to(els.userCounter, {
                     textContent: 100000, // Target number
                     duration: 3,
                     ease: "power2.inOut",
                     snap: { textContent: 1 }, // Snap to whole numbers
                     scrollTrigger: { trigger: els.userCounter, start: "top 80%", once: true },
                     onUpdate: function() {
                         // Format number with commas and add "+"
                         this.targets()[0].innerHTML = Math.ceil(parseFloat(this.targets()[0].textContent)).toLocaleString('en-US') + "+";
                     }
                 });
            } else if (els.userCounter) {
                 els.userCounter.textContent = "100,000+"; // Fallback if TextPlugin missing
            }

            if (els.platformCounter && typeof TextPlugin !== 'undefined') {
                 gsap.to(els.platformCounter, {
                     textContent: 3,
                     duration: 2.5,
                     ease: "power2.inOut",
                     snap: { textContent: 1 },
                     scrollTrigger: { trigger: els.platformCounter, start: "top 80%", once: true },
                     onUpdate: function() {
                         this.targets()[0].innerHTML = Math.ceil(parseFloat(this.targets()[0].textContent)) + "+";
                     }
                 });
            } else if (els.platformCounter) {
                 els.platformCounter.textContent = "3+"; // Fallback
            }

            // Cleanup function for when the media query no longer matches
            return () => {
                gsap.utils.toArray('.reveal-up, .journal-image-container').forEach(elem => {
                    const st = ScrollTrigger.getTweensOf(elem);
                    if (st) st.forEach(tween => tween.kill());
                });
                if (els.userCounter) gsap.killTweensOf(els.userCounter);
                if (els.platformCounter) gsap.killTweensOf(els.platformCounter);
            };
        });

        // What happens if reduced motion is preferred
        mm.add("(prefers-reduced-motion: reduce)", () => {
             // Immediately set elements to their final state
             gsap.utils.toArray('.reveal-up, .journal-image-container, #hero-headline, #hero-subheadline').forEach(elem => {
                 gsap.set(elem, { opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)', scale: 1 });
             });
             // Set counters to final text
             if(els.userCounter) els.userCounter.innerHTML = "100,000+";
             if(els.platformCounter) els.platformCounter.innerHTML = "3+";
        });
    }

    // --- Chatbot Logic (Simplified Simulation) ---
    function initChatbot() {
        const botResponses = {
            "greeting": "Hello! How can I assist you today on your journey to digital clarity?",
            "default": "That's an interesting point. While this demo is limited, the full MehfoozBot explores topics like that in detail.",
            "misinformation": "Spotting misinformation involves a few key steps: Check the source's credibility, look for supporting evidence, be wary of emotionally charged language, and check the date.",
            "safety": "Online safety basics include using strong, unique passwords, enabling two-factor authentication (if available), and being cautious about links or attachments, especially from unknown senders.",
            "story": "Mehfooz began from listening to the community in Skardu. We realized the need wasn't just *more* tech, but *understanding* tech. You can read more in the 'Our Story' section.",
            "ulema": "We proudly partner with local Ulema (religious leaders). They serve as trusted community voices, helping bridge traditional wisdom with essential digital literacy skills."
        };

        const promptQuestions = {
            "How do you work?": "ulema",
            "What's your story?": "story",
            "Spotting fake news?": "misinformation",
            "Staying safe online?": "safety"
        };
        const modalQuestions = ["How can I spot fake news?", "Is my WhatsApp safe?", "What is misinformation?"];

        function getBotResponse(userInput) {
            const lowerInput = userInput.toLowerCase().trim();

            // Direct matches from prompt buttons
            if (promptQuestions[userInput]) return botResponses[promptQuestions[userInput]];

            // Direct matches from modal pills
             if (modalQuestions.includes(userInput)) {
                 if (lowerInput.includes('fake news') || lowerInput.includes('misinformation')) return botResponses.misinformation;
                 if (lowerInput.includes('whatsapp') || lowerInput.includes('safe')) return botResponses.safety;
             }

            // Keyword matching for general input
            if (lowerInput.includes('fake') || lowerInput.includes('misinformation') || lowerInput.includes('rumor')) return botResponses.misinformation;
            if (lowerInput.includes('safe') || lowerInput.includes('security') || lowerInput.includes('password') || lowerInput.includes('whatsapp')) return botResponses.safety;
            if (lowerInput.includes('story') || lowerInput.includes('about') || lowerInput.includes('origin')) return botResponses.story;
            if (lowerInput.includes('ulema') || lowerInput.includes('work') || lowerInput.includes('approach') || lowerInput.includes('how')) return botResponses.ulema;
            if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey')) return botResponses.greeting;

            return botResponses.default;
        }

        function addChatMessage(message, sender, targetLog) {
            if (!targetLog) return;
            const bubble = document.createElement('div');
            bubble.className = `message-bubble ${sender}-bubble`;
            bubble.textContent = message;
            targetLog.appendChild(bubble);

            // Scroll to bottom with animation if GSAP available and motion enabled
            if (typeof gsap !== 'undefined' && typeof ScrollToPlugin !== 'undefined' && !document.body.classList.contains('reduced-motion')) {
                gsap.from(bubble, { opacity: 0, y: 20, duration: 0.5 });
                gsap.to(targetLog, { duration: 0.5, scrollTo: { y: "max" }, ease: "power2.out" });
            } else {
                targetLog.scrollTop = targetLog.scrollHeight; // Fallback instant scroll
            }
        }

        function handleBotUserInput(input, targetLog, targetInput, targetPromptsContainer) {
            const trimmedInput = input.trim();
            if (!trimmedInput || !targetLog || !targetInput) return;

            addChatMessage(trimmedInput, 'user', targetLog);
            targetInput.value = ""; // Clear input
            targetInput.disabled = true; // Disable input while bot "thinks"

            // Dim prompt buttons while bot is responding
            if (targetPromptsContainer) {
                 targetPromptsContainer.style.pointerEvents = 'none';
                 if(typeof gsap !== 'undefined' && !document.body.classList.contains('reduced-motion')) {
                     gsap.to(targetPromptsContainer.children, { opacity: 0.5, duration: 0.3 });
                 } else {
                     Array.from(targetPromptsContainer.children).forEach(el => el.style.opacity = '0.5');
                 }
            }


            setTimeout(() => {
                addChatMessage(getBotResponse(trimmedInput), 'bot', targetLog);
                targetInput.disabled = false; // Re-enable input
                try { targetInput.focus(); } catch(e) {/* ignore focus error if element hidden */} // Attempt to refocus

                // Restore prompt buttons
                if (targetPromptsContainer) {
                     targetPromptsContainer.style.pointerEvents = 'auto';
                     if(typeof gsap !== 'undefined' && !document.body.classList.contains('reduced-motion')) {
                        gsap.to(targetPromptsContainer.children, { opacity: 1, duration: 0.3 });
                     } else {
                        Array.from(targetPromptsContainer.children).forEach(el => el.style.opacity = '1');
                     }
                }
            }, 1200); // Simulate bot thinking time
        }

        // --- Initialize Widget Chat ---
        if (els.chatForm && els.chatLog && els.chatInput && els.promptButtonsContainer) {
            els.chatForm.addEventListener('submit', e => {
                e.preventDefault();
                handleBotUserInput(els.chatInput.value, els.chatLog, els.chatInput, els.promptButtonsContainer);
            });

            // Populate prompt buttons for the widget
            els.promptButtonsContainer.innerHTML = ""; // Clear any defaults
            Object.keys(promptQuestions).forEach(q => {
                const btn = document.createElement('button');
                btn.className = "chat-prompt-btn";
                btn.textContent = q;
                btn.onclick = () => handleBotUserInput(q, els.chatLog, els.chatInput, els.promptButtonsContainer);
                els.promptButtonsContainer.appendChild(btn);
            });

            addChatMessage(botResponses.greeting, 'bot', els.chatLog); // Initial greeting
        } else {
            console.warn("Widget chat elements not found.");
        }

        // --- Initialize Modal Chat ---
        if (els.modalChatForm && els.modalChatLog && els.modalChatInput && els.modalPillContainer) {
            els.modalChatForm.addEventListener('submit', e => {
                e.preventDefault();
                handleBotUserInput(els.modalChatInput.value, els.modalChatLog, els.modalChatInput, els.modalPillContainer);
            });

             // Populate prompt buttons (pills) for the modal
            els.modalPillContainer.innerHTML = ""; // Clear any defaults
            modalQuestions.forEach(q => {
                 const pill = document.createElement('button');
                 pill.className = 'chat-prompt-btn';
                 pill.textContent = q;
                 pill.onclick = () => handleBotUserInput(q, els.modalChatLog, els.modalChatInput, els.modalPillContainer);
                 els.modalPillContainer.appendChild(pill);
            });

             // Function to ensure the modal chat starts with a greeting if empty
             window.initModalChat = () => {
                 // Check if the chat log is empty or only contains the initial greeting
                 const isEffectivelyEmpty = els.modalChatLog.children.length === 0 ||
                     (els.modalChatLog.children.length === 1 && els.modalChatLog.children[0].classList.contains('bot-bubble'));

                 if (isEffectivelyEmpty) {
                     els.modalChatLog.innerHTML = ''; // Clear just in case
                     addChatMessage("Hello! Ask a question or click a topic above.", 'bot', els.modalChatLog);
                 }
             };

             // Trigger init when opening via button or keybind
            if (els.openBotBtn) {
                 els.openBotBtn.addEventListener('click', () => {
                     // The toggleModal function should be called elsewhere (in initAccessibility)
                     window.initModalChat();
                     // Delay focus slightly to ensure modal is visible
                     setTimeout(() => els.modalChatInput.focus(), 300);
                 });
             }
             // Keybind 'M' handled in initAccessibility calls toggleModal and focuses input

        } else {
            console.warn("Modal chat elements not found.");
        }
    }


    // --- Contact Form ---
    function initContactForm() {
        if (!els.contactForm || !els.formSuccess) return;

        els.contactForm.addEventListener('submit', e => {
            e.preventDefault();
            const form = e.target;
            const formData = new FormData(form);
            const submitButton = form.querySelector('button[type="submit"]');
            let formIsValid = true;
            let firstErrorField = null;

             // Basic Frontend Validation
             form.querySelectorAll('[required]').forEach(field => {
                 if (!field.value.trim()) {
                     formIsValid = false;
                     field.style.borderColor = 'var(--color-error)'; // Highlight error
                     if (!firstErrorField) firstErrorField = field;
                 } else {
                     field.style.borderColor = ''; // Reset border
                 }
             });
             // Email specific validation (simple)
             const emailField = form.querySelector('input[type="email"]');
             if (emailField && emailField.value.trim() && !/.+@.+\..+/.test(emailField.value)) {
                 formIsValid = false;
                 emailField.style.borderColor = 'var(--color-error)';
                 if (!firstErrorField) firstErrorField = emailField;
             } else if (emailField) {
                 emailField.style.borderColor = '';
             }


            if (!formIsValid) {
                 alert("Please fill in all required fields correctly.");
                 firstErrorField?.focus();
                 return;
            }

            // Disable button and show loading state
            if(submitButton) submitButton.disabled = true;
            if(submitButton) submitButton.textContent = 'Sending...';


            fetch(form.action, {
                method: form.method,
                body: formData,
                headers: { 'Accept': 'application/json' }
            }).then(response => {
                if (response.ok) {
                    // Show success
                     if (document.body.classList.contains('reduced-motion') || typeof gsap === 'undefined') {
                         els.contactForm.style.display = 'none';
                         els.formSuccess.classList.remove('hidden');
                     } else {
                         gsap.to(els.contactForm, {
                             opacity: 0,
                             duration: 0.5,
                             height: 0, // Animate height to collapse
                             ease: 'power2.in',
                             onComplete: () => {
                                 els.contactForm.style.display = 'none'; // Hide after animation
                                 els.formSuccess.classList.remove('hidden');
                                 gsap.from(els.formSuccess, { opacity: 0, y: 20, duration: 0.6, ease: 'power2.out' });
                             }
                         });
                     }
                    // No need to reset button text/state here as form is hidden
                } else {
                    // Handle server-side errors from Formspree
                    response.json().then(data => {
                        const errorMessage = data?.errors?.map(err => err.message).join(', ') || "Submission failed. Please try again.";
                        alert(`Oops! ${errorMessage}`);
                         if(submitButton) submitButton.disabled = false; // Re-enable button
                         if(submitButton) submitButton.textContent = 'Send';
                    }).catch(() => {
                        // Handle cases where response isn't JSON
                        alert("Oops! There was a problem submitting your form. Please try again later.");
                        if(submitButton) submitButton.disabled = false;
                        if(submitButton) submitButton.textContent = 'Send';
                    });
                }
            }).catch(error => {
                // Handle network errors
                console.error('Form submission network error:', error);
                alert("Oops! There was a network error. Please check your connection and try again.");
                if(submitButton) submitButton.disabled = false;
                if(submitButton) submitButton.textContent = 'Send';
            });
        });
    }


    // --- Modals and Accessibility Toggles ---
    function toggleModal(modal, forceOpen) {
        if (!modal || !els.modalBackdrop) return;

        const isVisible = modal.classList.contains('is-visible');
        const show = forceOpen === undefined ? !isVisible : forceOpen;

        if (show === isVisible) return; // Already in desired state

        const relatedButton = document.querySelector(`[aria-controls="${modal.id}"]`);
        if (relatedButton) relatedButton.setAttribute('aria-expanded', show);

        // Define animation/state functions
         const animateIn = () => {
             modal.removeAttribute('hidden');
             els.modalBackdrop.removeAttribute('hidden');
             modal.classList.add('is-visible');
             els.modalBackdrop.classList.add('is-visible');
             if(typeof gsap !== 'undefined' && !document.body.classList.contains('reduced-motion')) {
                 gsap.to([modal, els.modalBackdrop], { opacity: 1, duration: 0.3 });
                 gsap.fromTo(modal, {scale: 0.95}, { scale: 1, duration: 0.3, ease: 'back.out(1.7)' });
             } else {
                 modal.style.opacity = '1';
                 modal.style.transform = 'translate(-50%, -50%) scale(1)';
                 els.modalBackdrop.style.opacity = '1';
             }
             // Focus management - attempt to focus first focusable element or modal itself
             const focusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
             if (focusable) { focusable.focus(); } else { modal.focus(); }
         };

         const animateOut = () => {
             modal.classList.remove('is-visible');
             els.modalBackdrop.classList.remove('is-visible');
              if(typeof gsap !== 'undefined' && !document.body.classList.contains('reduced-motion')) {
                 gsap.to(modal, { scale: 0.95, opacity: 0, duration: 0.3, onComplete: () => modal.setAttribute('hidden', 'true') });
                 gsap.to(els.modalBackdrop, { opacity: 0, duration: 0.3, onComplete: () => els.modalBackdrop.setAttribute('hidden', 'true') });
             } else {
                 modal.style.opacity = '0';
                 modal.style.transform = 'translate(-50%, -50%) scale(0.95)';
                 els.modalBackdrop.style.opacity = '0';
                 modal.setAttribute('hidden', 'true');
                 els.modalBackdrop.setAttribute('hidden', 'true');
             }
             // Return focus to the button that opened the modal, if possible
             relatedButton?.focus();
         };

        show ? animateIn() : animateOut();
    }


    function toggleHelp(forceOpen) {
        if (!els.keyboardHelp || !els.helpToggleBtn) return;

        const isVisible = els.keyboardHelp.classList.contains('is-visible');
        const show = forceOpen === undefined ? !isVisible : forceOpen;

        if (show === isVisible) return;

        els.helpToggleBtn.setAttribute('aria-expanded', show);

        // Define animation/state functions
        const animateIn = () => {
            els.keyboardHelp.removeAttribute('hidden');
            els.keyboardHelp.classList.add('is-visible');
             if(typeof gsap !== 'undefined' && !document.body.classList.contains('reduced-motion')) {
                 gsap.fromTo(els.keyboardHelp, {opacity: 0, scale: 0.95}, { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(1.7)'});
             } else {
                 els.keyboardHelp.style.opacity = '1';
                 els.keyboardHelp.style.transform = 'translateX(-50%) scale(1)';
             }
        };

        const animateOut = () => {
            els.keyboardHelp.classList.remove('is-visible');
            if(typeof gsap !== 'undefined' && !document.body.classList.contains('reduced-motion')) {
                 gsap.to(els.keyboardHelp, { opacity: 0, scale: 0.95, duration: 0.3, onComplete: () => els.keyboardHelp.setAttribute('hidden', 'true') });
            } else {
                 els.keyboardHelp.style.opacity = '0';
                 els.keyboardHelp.style.transform = 'translateX(-50%) scale(0.95)';
                 els.keyboardHelp.setAttribute('hidden', 'true');
            }
        };

        show ? animateIn() : animateOut();
    }


    function initAccessibility() {
        if (els.settingsToggleBtn) {
            els.settingsToggleBtn.addEventListener('click', () => toggleModal(els.settingsModal));
        }
        if (els.settingsCloseBtn) {
            els.settingsCloseBtn.addEventListener('click', () => toggleModal(els.settingsModal, false));
        }
        if (els.helpToggleBtn) {
            els.helpToggleBtn.addEventListener('click', () => toggleHelp());
        }
         // Button within Approach section to open bot modal
        if (els.openBotBtn) {
            els.openBotBtn.addEventListener('click', () => {
                 toggleModal(els.botModal);
                 if (window.initModalChat) window.initModalChat();
                 setTimeout(() => els.modalChatInput?.focus(), 300); // Focus after transition
            });
        }
        if (els.closeBotBtn) {
            els.closeBotBtn.addEventListener('click', () => toggleModal(els.botModal, false));
        }
        if (els.modalBackdrop) {
            els.modalBackdrop.addEventListener('click', () => {
                toggleModal(els.settingsModal, false);
                toggleModal(els.botModal, false);
                toggleHelp(false); // Also close help overlay
            });
        }

        // Keyboard shortcuts
        window.addEventListener('keydown', (e) => {
            // Close modals with Escape
            if (e.key === 'Escape') {
                if (els.settingsModal?.classList.contains('is-visible')) toggleModal(els.settingsModal, false);
                if (els.botModal?.classList.contains('is-visible')) toggleModal(els.botModal, false);
                if (els.keyboardHelp?.classList.contains('is-visible')) toggleHelp(false);
                if (els.navLinksContainer?.classList.contains('is-visible')) els.mobileNavToggle?.click(); // Close mobile nav too
            }

            // Don't trigger shortcuts if focus is in an input/textarea or during intro game
             if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA' || document.activeElement.tagName === 'SELECT') || els.introGame?.classList.contains('active')) {
                return;
            }

            // Specific shortcuts
            if (e.key === '?') {
                e.preventDefault();
                toggleHelp();
            }
            if (e.key.toLowerCase() === 'h') {
                e.preventDefault();
                document.querySelector('a[href="#home"]')?.click();
            }
            if (e.key.toLowerCase() === 'm') {
                e.preventDefault();
                // Only open if not already open
                if (els.botModal && !els.botModal.classList.contains('is-visible')) {
                    toggleModal(els.botModal, true);
                    if (window.initModalChat) window.initModalChat();
                    setTimeout(() => els.modalChatInput?.focus(), 300);
                }
            }
            if (e.key.toLowerCase() === 's') {
                 // Prevent default only if skip link exists
                 const skipLink = document.querySelector('.skip-link');
                 if (skipLink) {
                     e.preventDefault();
                     skipLink.focus();
                 }
            }
        });
    }

    // --- Floating Chat Bubble Interaction ---
    function initFloatingChatBubble() {
        if (els.chatBubble) {
            els.chatBubble.addEventListener('click', () => {
                toggleModal(els.botModal, true);
                if (window.initModalChat) {
                    window.initModalChat(); // Ensure greeting is shown
                }
                // Delay focus slightly for modal transition
                setTimeout(() => els.modalChatInput?.focus(), 300);
            });
        }
    }

    // --- Page Visibility API ---
    document.addEventListener('visibilitychange', () => {
        if (cosmicBgAnimator) {
            if (document.hidden) {
                cosmicBgAnimator.stop();
            } else if (!document.body.classList.contains('reduced-motion')) {
                // Resume animation only if motion is enabled
                cosmicBgAnimator.animate();
            }
        }
    });

}); // End DOMContentLoaded
