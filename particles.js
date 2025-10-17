/**
 * PARTICLES.JS
 * Cosmic Particle System for Canvas Background
 * Creates animated stars and particles with mouse interaction
 */

class CosmicParticles {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null, radius: 150 };
        this.hue = 0;
        
        this.init();
        this.setupEventListeners();
        this.animate();
    }
    
    init() {
        this.resizeCanvas();
        this.createParticles();
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        const numberOfParticles = Math.floor((this.canvas.width * this.canvas.height) / 12000);
        
        for (let i = 0; i < numberOfParticles; i++) {
            const size = Math.random() * 2 + 0.5;
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const speedX = (Math.random() - 0.5) * 0.3;
            const speedY = (Math.random() - 0.5) * 0.3;
            const opacity = Math.random() * 0.5 + 0.3;
            
            this.particles.push(new Particle(x, y, size, speedX, speedY, opacity, this.ctx));
        }
    }
    
    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.particles = [];
            this.createParticles();
        });
        
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });
        
        window.addEventListener('mouseout', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }
    
    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 120) {
                    const opacity = (1 - distance / 120) * 0.15;
                    this.ctx.strokeStyle = `rgba(110, 193, 228, ${opacity})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }
    
    animate() {
        // Clear canvas with fade effect
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles
        this.particles.forEach(particle => {
            particle.update(this.mouse);
            particle.draw();
        });
        
        // Draw connections between nearby particles
        this.drawConnections();
        
        // Subtle hue rotation
        this.hue += 0.1;
        
        requestAnimationFrame(() => this.animate());
    }
}

class Particle {
    constructor(x, y, size, speedX, speedY, opacity, ctx) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speedX = speedX;
        this.speedY = speedY;
        this.opacity = opacity;
        this.ctx = ctx;
        this.baseX = x;
        this.baseY = y;
        this.density = (Math.random() * 30) + 1;
    }
    
    draw() {
        // Main particle glow
        const gradient = this.ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.size * 3
        );
        
        gradient.addColorStop(0, `rgba(110, 193, 228, ${this.opacity})`);
        gradient.addColorStop(0.5, `rgba(167, 139, 250, ${this.opacity * 0.5})`);
        gradient.addColorStop(1, 'rgba(110, 193, 228, 0)');
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Bright core
        this.ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    update(mouse) {
        // Mouse interaction
        if (mouse.x && mouse.y) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const maxDistance = mouse.radius;
            const force = (maxDistance - distance) / maxDistance;
            const directionX = forceDirectionX * force * this.density;
            const directionY = forceDirectionY * force * this.density;
            
            if (distance < mouse.radius) {
                this.x -= directionX;
                this.y -= directionY;
            } else {
                if (this.x !== this.baseX) {
                    const dx = this.x - this.baseX;
                    this.x -= dx / 10;
                }
                if (this.y !== this.baseY) {
                    const dy = this.y - this.baseY;
                    this.y -= dy / 10;
                }
            }
        } else {
            // Return to base position
            if (this.x !== this.baseX) {
                const dx = this.x - this.baseX;
                this.x -= dx / 10;
            }
            if (this.y !== this.baseY) {
                const dy = this.y - this.baseY;
                this.y -= dy / 10;
            }
        }
        
        // Slow drift movement
        this.baseX += this.speedX;
        this.baseY += this.speedY;
        
        // Wrap around edges
        if (this.baseX < 0) this.baseX = this.ctx.canvas.width;
        if (this.baseX > this.ctx.canvas.width) this.baseX = 0;
        if (this.baseY < 0) this.baseY = this.ctx.canvas.height;
        if (this.baseY > this.ctx.canvas.height) this.baseY = 0;
        
        // Twinkle effect
        this.opacity += (Math.random() - 0.5) * 0.02;
        this.opacity = Math.max(0.2, Math.min(0.8, this.opacity));
    }
}

// Shooting stars effect
class ShootingStar {
    constructor(ctx, width, height) {
        this.ctx = ctx;
        this.reset(width, height);
    }
    
    reset(width, height) {
        this.x = Math.random() * width;
        this.y = Math.random() * height * 0.5;
        this.length = Math.random() * 80 + 40;
        this.speed = Math.random() * 3 + 5;
        this.opacity = 0;
        this.active = true;
    }
    
    update() {
        if (this.opacity < 1 && this.active) {
            this.opacity += 0.01;
        }
        
        this.x += this.speed;
        this.y += this.speed * 0.5;
        
        if (this.opacity >= 1) {
            this.opacity -= 0.015;
            if (this.opacity <= 0) {
                this.active = false;
            }
        }
    }
    
    draw() {
        if (!this.active) return;
        
        const gradient = this.ctx.createLinearGradient(
            this.x, this.y,
            this.x - this.length, this.y - this.length * 0.5
        );
        
        gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`);
        gradient.addColorStop(0.5, `rgba(110, 193, 228, ${this.opacity * 0.6})`);
        gradient.addColorStop(1, 'rgba(110, 193, 228, 0)');
        
        this.ctx.strokeStyle = gradient;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(this.x, this.y);
        this.ctx.lineTo(this.x - this.length, this.y - this.length * 0.5);
        this.ctx.stroke();
    }
}

class ShootingStarManager {
    constructor(ctx, width, height) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.stars = [];
        this.lastSpawn = Date.now();
        this.spawnInterval = 8000; // Every 8 seconds
    }
    
    update() {
        const now = Date.now();
        
        if (now - this.lastSpawn > this.spawnInterval) {
            this.stars.push(new ShootingStar(this.ctx, this.width, this.height));
            this.lastSpawn = now;
            this.spawnInterval = Math.random() * 10000 + 5000; // Random between 5-15 seconds
        }
        
        this.stars = this.stars.filter(star => {
            star.update();
            star.draw();
            return star.active;
        });
    }
    
    resize(width, height) {
        this.width = width;
        this.height = height;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const cosmicParticles = new CosmicParticles('cosmic-canvas');
    
    // Add shooting stars
    const canvas = document.getElementById('cosmic-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        const shootingStars = new ShootingStarManager(ctx, canvas.width, canvas.height);
        
        function animateShootingStars() {
            shootingStars.update();
            requestAnimationFrame(animateShootingStars);
        }
        
        animateShootingStars();
        
        window.addEventListener('resize', () => {
            shootingStars.resize(canvas.width, canvas.height);
        });
    }
});
