/* ---
SCRIPT.JS
---
*/

document.addEventListener('DOMContentLoaded', function() {
    gsap.registerPlugin(ScrollTrigger);

    // --- 1. LENIS SMOOTH SCROLL ---
    const lenis = new Lenis();
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // --- 2. CUSTOM CURSOR ---
    const cursorDot = document.getElementById('cursor-dot');
    const cursorLight = document.getElementById('cursor-light');
    window.addEventListener('mousemove', e => {
        gsap.to(cursorDot, { duration: 0.2, x: e.clientX, y: e.clientY });
        gsap.to(cursorLight, { duration: 0.5, x: e.clientX, y: e.clientY, ease: 'power2.out' });
    });

    // --- 3. PRELOADER & INTRO ANIMATION ---
    const loaderTL = gsap.timeline();
    loaderTL
        .to('.loader-logo', {
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: 'power2.out'
        })
        .to('.loader-logo path', {
            opacity: 0,
            stagger: 0.1,
            delay: 0.5
        })
        .to('#loader', {
            opacity: 0,
            duration: 1,
            ease: 'expo.out',
            onComplete: () => document.getElementById('loader').classList.add('hidden')
        }, '-=0.5')
        .to('#site-header', {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power2.out'
        }, '-=0.5')
        .to('.hero-content', {
            opacity: 1,
            duration: 1,
            ease: 'power2.out'
        }, '-=0.8')
        .to('#scroll-prompt', {
            opacity: 1,
            duration: 1,
            delay: 0.5
        }, '-=0.8');

    // --- 4. NAVIGATION SCROLL-TO ---
    document.querySelectorAll('.nav-link, .nav-logo').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            lenis.scrollTo(targetId);
        });
    });

    // --- 5. SCROLLYTELLING: THE CHALLENGE ---
    // This section is based on the blueprint: "a scroll-triggered animation of a digital network" [cite: 177]
    // that "flicker and turn red" [cite: 178] and then "resolve into a stable... grid" [cite: 181]
    
    const challengeTL = gsap.timeline({
        scrollTrigger: {
            trigger: '.challenge-sticky-container',
            scrub: 1,
            pin: '.challenge-content',
            start: 'top top',
            end: 'bottom bottom'
        }
    });

    // Animate network background
    challengeTL
        .to('.network-background', { opacity: 0.1, duration: 0.5 }) // Fade in network
        
        // Step 1: "Peril"
        .to('#step-1', { opacity: 1, duration: 1 })
        .to('.network-background', { 
            '--network-color': 'var(--danger)', // Glitch to red [cite: 178]
            opacity: 0.2,
            duration: 1 
        }, '-=0.5')
        .to('#step-1', { opacity: 0, duration: 1, delay: 1 })
        
        // Step 2: "Mission"
        .to('#step-2', { opacity: 1, duration: 1 })
        .to('#step-2', { opacity: 0, duration: 1, delay: 1 })
        
        // Step 3: "Vision"
        .to('#step-3', { opacity: 1, duration: 1 })
        .to('.network-background', {
            '--network-color': 'var(--gold)', // Resolve to healthy gold/teal [cite: 182]
            opacity: 0.15,
            duration: 1
        }, '-=0.5')
        
        // Fade out
        .to('#step-3', { opacity: 0, duration: 1, delay: 1 })
        .to('.network-background', { opacity: 0, duration: 0.5 }, '-=0.5');

    // --- 6. GENERAL SECTION REVEALS ---
    gsap.utils.toArray('.reveal-up').forEach(elem => {
        gsap.fromTo(elem, 
            { opacity: 0, y: 50 },
            { 
                opacity: 1, 
                y: 0, 
                duration: 1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: elem,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });

    // --- 7. MEHFOOZBOT MODAL LOGIC ---
    // Based on blueprint 
    const openBotBtn = document.getElementById('open-bot-demo');
    const closeBotBtn = document.getElementById('close-bot-demo');
    const botModal = document.getElementById('bot-modal');
    const chatLog = document.getElementById('chat-log');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const pillContainer = document.getElementById('question-pills-container');

    const botResponses = {
        "default": "That's a great question. While I'm just a demo, in the full version of MehfoozBot, I can provide detailed, personalized guidance on digital safety and literacy. [cite: 199, 363]",
        "How can I spot fake news?": "To spot fake news, check the source, look for evidence, and watch for unusual formatting. Real news sites usually have high standards. Also, consider if the story is designed to make you feel strong emotions. [cite: 366]",
        "Is my WhatsApp safe?": "WhatsApp has end-to-end encryption, which is very secure. To make it even safer, enable two-step verification in your settings and be cautious about sharing personal information with unknown contacts. [cite: 367]",
        "What is misinformation?": "Misinformation is false or inaccurate information that is spread, regardless of intent to deceive. It's different from disinformation, which is deliberately misleading."
    };

    const questions = [
        "How can I spot fake news?",
        "Is my WhatsApp safe?",
        "What is misinformation?"
    ];

    // Populate question pills [cite: 198, 366]
    questions.forEach(q => {
        const pill = document.createElement('div');
        pill.className = 'question-pill';
        pill.textContent = q;
        pill.dataset.question = q;
        pillContainer.appendChild(pill);
    });

    function addMessage(message, sender) {
        const bubble = document.createElement('div');
        bubble.className = `chat-bubble ${sender}-bubble`;
        bubble.textContent = message;
        chatLog.appendChild(bubble);
        chatLog.scrollTop = chatLog.scrollHeight;
    }

    function addTypingIndicator() {
        const typingBubble = document.createElement('div');
        typingBubble.className = 'chat-bubble bot-bubble typing-indicator';
        typingBubble.innerHTML = '<span></span><span></span><span></span>';
        chatLog.appendChild(typingBubble);
        chatLog.scrollTop = chatLog.scrollHeight;
        return typingBubble;
    }

    function handleUserMessage(message) {
        if (!message.trim()) return;
        
        addMessage(message, 'user');
        chatInput.value = '';
        chatInput.disabled = true;
        
        const typing = addTypingIndicator(); // Simulate bot "thinking" [cite: 128]
        
        setTimeout(() => {
            chatLog.removeChild(typing);
            const response = botResponses[message] || botResponses['default'];
            addMessage(response, 'bot');
            chatInput.disabled = false;
            chatInput.focus();
        }, 1200 + Math.random() * 500);
    }

    chatForm.addEventListener('submit', e => {
        e.preventDefault();
        handleUserMessage(chatInput.value);
    });

    pillContainer.addEventListener('click', e => {
        if (e.target.classList.contains('question-pill')) {
            const question = e.target.dataset.question;
            handleUserMessage(question);
        }
    });

    // Open/Close Modal
    openBotBtn.addEventListener('click', () => {
        botModal.classList.remove('hidden');
        if (chatLog.children.length === 0) {
            // Add initial welcome message
            const typing = addTypingIndicator();
            setTimeout(() => {
                chatLog.removeChild(typing);
                addMessage("Hello! I'm a demo of MehfoozBot. Click a question below or type your own. [cite: 197]", 'bot');
            }, 1000);
        }
    });

    closeBotBtn.addEventListener('click', () => {
        botModal.classList.add('hidden');
    });

    // --- 8. CONTACT FORM LOGIC ---
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');
    contactForm.addEventListener('submit', e => {
        e.preventDefault();
        // In a real app, this would send data. Here, we just show success.
        gsap.to(contactForm, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                contactForm.style.display = 'none';
                formSuccess.classList.remove('hidden');
                gsap.from(formSuccess, { opacity: 0, y: 20, duration: 0.5 });
            }
        });
    });

});
