class Ring {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.collected = false;
    }

    draw(ctx) {
        if (!this.collected) {
            ctx.beginPath();
            ctx.arc(this.x + this.width/2, this.y + this.height/2, 10, 0, Math.PI * 2);
            ctx.strokeStyle = 'gold';
            ctx.lineWidth = 3;
            ctx.stroke();
            ctx.fillStyle = 'yellow';
            ctx.fill();
        }
    }
}

class Coin {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 25;
        this.height = 25;
        this.collected = false;
        this.rotation = 0;
        this.value = 50;
        this.floatOffset = 0;
    }

    update() {
        this.rotation += 0.1;
        this.floatOffset = Math.sin(Date.now() * 0.003) * 5;
    }

    draw(ctx) {
        if (this.collected) return;
        
        ctx.save();
        ctx.translate(this.x + this.width/2, this.y + this.height/2 + this.floatOffset);
        ctx.rotate(this.rotation);
        
        // Draw star shape
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const angle = (i * 4 * Math.PI) / 5;
            const x = Math.cos(angle) * 12;
            const y = Math.sin(angle) * 12;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fillStyle = '#FFD700';
        ctx.fill();
        ctx.strokeStyle = '#FFA500';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.restore();
    }
}

class Platform {
    constructor(x, y, width = 100) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = 20;
        this.originalY = y;
        this.moveSpeed = 1;
        this.moveRange = 100;
        this.moveDirection = 1;
    }

    update() {
        // Move platform up and down
        this.y += this.moveSpeed * this.moveDirection;
        if (Math.abs(this.y - this.originalY) > this.moveRange) {
            this.moveDirection *= -1;
        }
    }

    draw(ctx) {
        // Platform gradient
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
        gradient.addColorStop(0, '#4CAF50');
        gradient.addColorStop(1, '#388E3C');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Platform shine effect
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.width, this.y);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

class Obstacle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 50;
        this.speed = 2;
    }

    update() {
        this.x -= this.speed;
        if (this.x + this.width < 0) {
            this.x = canvas.width;
        }
    }

    draw(ctx) {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Particle {
    constructor(x, y, color, velocity) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = 3;
        this.velocityX = velocity.x;
        this.velocityY = velocity.y;
        this.alpha = 1;
        this.gravity = 0.2;
    }

    update() {
        this.velocityY += this.gravity;
        this.x += this.velocityX;
        this.y += this.velocityY;
        this.alpha -= 0.02;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
        ctx.restore();
    }
}

class Spring {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 10;
        this.bounceForce = -20;
        this.isCompressed = false;
    }

    draw(ctx) {
        ctx.fillStyle = this.isCompressed ? '#ff0000' : '#ff6666';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class PowerUp {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
        this.type = type;
        this.collected = false;
        this.floatOffset = 0;
        this.rotation = 0;
    }

    update() {
        this.floatOffset = Math.sin(Date.now() * 0.005) * 5;
        this.rotation += 0.05;
    }

    draw(ctx) {
        if (this.collected) return;
        
        ctx.save();
        ctx.translate(this.x + this.width/2, this.y + this.height/2 + this.floatOffset);
        ctx.rotate(this.rotation);
        
        switch(this.type) {
            case 'speed':
                // Draw speed arrow
                ctx.fillStyle = '#ff0000';
                ctx.beginPath();
                ctx.moveTo(-10, -10);
                ctx.lineTo(10, 0);
                ctx.lineTo(-10, 10);
                ctx.closePath();
                ctx.fill();
                break;
            case 'magnet':
                // Draw magnet symbol
                ctx.fillStyle = '#ff00ff';
                ctx.beginPath();
                ctx.arc(0, 0, 15, 0, Math.PI, true);
                ctx.lineWidth = 4;
                ctx.strokeStyle = '#ff00ff';
                ctx.stroke();
                break;
            case 'shield':
                // Draw shield symbol
                ctx.fillStyle = '#00ffff';
                ctx.beginPath();
                ctx.arc(0, 0, 12, 0, Math.PI * 2);
                ctx.lineWidth = 3;
                ctx.strokeStyle = '#00ffff';
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(0, 0, 8, 0, Math.PI * 2);
                ctx.stroke();
                break;
            case 'fireball':
                // Draw fire symbol
                ctx.fillStyle = '#ffa500';
                for (let i = 0; i < 8; i++) {
                    const angle = (i * Math.PI * 2) / 8;
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.lineTo(Math.cos(angle) * 15, Math.sin(angle) * 15);
                    ctx.lineWidth = 3;
                    ctx.strokeStyle = '#ff4500';
                    ctx.stroke();
                }
                ctx.beginPath();
                ctx.arc(0, 0, 8, 0, Math.PI * 2);
                ctx.fill();
                break;
        }
        ctx.restore();
    }
}

class Boost {
    constructor(x, y, angle = -45) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 20;
        this.angle = angle * Math.PI / 180;
        this.power = 25;
        this.cooldown = 0;
        this.particles = [];
    }

    update() {
        if (this.cooldown > 0) this.cooldown--;
        
        // Update particles
        this.particles = this.particles.filter(p => p.alpha > 0);
        this.particles.forEach(p => p.update());
        
        // Add ambient particles
        if (Math.random() < 0.2) {
            this.particles.push(new Particle(
                this.x + this.width/2,
                this.y + this.height/2,
                '#ffff00',
                {
                    x: Math.cos(this.angle) * Math.random() * 2,
                    y: Math.sin(this.angle) * Math.random() * 2
                }
            ));
        }
    }

    draw(ctx) {
        // Draw particles
        this.particles.forEach(p => p.draw(ctx));
        
        // Draw boost pad
        ctx.save();
        ctx.translate(this.x + this.width/2, this.y + this.height/2);
        ctx.rotate(this.angle);
        
        // Base
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);
        
        // Arrow indicators
        ctx.fillStyle = '#ff4500';
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.moveTo(-15 + i * 15, -8);
            ctx.lineTo(-5 + i * 15, 0);
            ctx.lineTo(-15 + i * 15, 8);
            ctx.fill();
        }
        
        ctx.restore();
    }
}

class ChiptuneSynth {
    constructor() {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        this.isPlaying = false;
        this.mainGain = this.audioCtx.createGain();
        this.mainGain.gain.value = 0.2;
        this.mainGain.connect(this.audioCtx.destination);
        
        // Music parameters for Oil Ocean Zone
        this.bpm = 122;  // Original Oil Ocean Zone tempo
        this.noteLength = 60 / this.bpm;
        
        // Oil Ocean Zone melody sequence
        this.melody = [
            261.63, 329.63, 392.00, 493.88, 587.33, 698.46, 783.99, 659.25,
            523.25, 392.00, 329.63, 261.63, 196.00, 246.94, 293.66, 369.99,
            440.00, 523.25, 659.25, 783.99, 880.00, 698.46, 587.33, 493.88
        ];
        
        // Oil Ocean Zone bassline
        this.bassline = [
            130.81, 146.83, 164.81, 174.61, 196.00, 220.00, 246.94, 261.63,
            293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25, 587.33
        ];

        // Industrial rhythm pattern (more complex for Oil Ocean feel)
        this.rhythm = [
            1, 0.5, 0.8, 0, 1, 0.3, 0.6, 0.2,
            1, 0, 0.7, 0.3, 1, 0.4, 0.8, 0
        ];
        
        this.currentNote = 0;
        this.currentBass = 0;
        this.currentRhythm = 0;
        
        // Create effects
        this.reverbNode = this.audioCtx.createConvolver();
        this.createReverb();
        
        // Echo effect
        this.delay = this.audioCtx.createDelay();
        this.delay.delayTime.value = this.noteLength * 2;
        this.delayGain = this.audioCtx.createGain();
        this.delayGain.gain.value = 0.2;
        
        this.delay.connect(this.delayGain);
        this.delayGain.connect(this.delay);
        this.delayGain.connect(this.mainGain);
    }

    async createReverb() {
        const length = 2;
        const decay = 2;
        const rate = this.audioCtx.sampleRate;
        const impulse = this.audioCtx.createBuffer(2, rate * length, rate);
        
        for (let channel = 0; channel < 2; channel++) {
            const data = impulse.getChannelData(channel);
            for (let i = 0; i < data.length; i++) {
                data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / (rate * length), decay);
            }
        }
        
        this.reverbNode.buffer = impulse;
        this.reverbNode.connect(this.mainGain);
    }

    playNote(frequency, duration, type = 'square', volume = 0.5) {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        const filter = this.audioCtx.createBiquadFilter();
        
        // Oil Ocean style filter
        filter.type = 'lowpass';
        filter.frequency.value = 2000;
        filter.Q.value = 5;
        
        osc.type = type;
        osc.frequency.value = frequency;
        
        // Add slight detuning for richer sound
        if (type === 'square') {
            const detune = this.audioCtx.createOscillator();
            detune.type = 'square';
            detune.frequency.value = frequency * 1.01;
            detune.connect(gain);
            detune.start();
            detune.stop(this.audioCtx.currentTime + duration);
        }
        
        gain.gain.setValueAtTime(volume, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + duration * 0.8);
        
        osc.connect(gain);
        gain.connect(filter);
        filter.connect(this.mainGain);
        filter.connect(this.delay);
        filter.connect(this.reverbNode);
        
        osc.start();
        osc.stop(this.audioCtx.currentTime + duration);
    }

    playRhythm() {
        if (this.rhythm[this.currentRhythm]) {
            // Industrial percussion sound
            const noise = this.audioCtx.createOscillator();
            const noiseGain = this.audioCtx.createGain();
            const filter = this.audioCtx.createBiquadFilter();
            
            noise.type = 'square';
            noise.frequency.value = 100;
            filter.type = 'bandpass';
            filter.frequency.value = 2000;
            filter.Q.value = 1;
            
            noiseGain.gain.setValueAtTime(0.3 * this.rhythm[this.currentRhythm], this.audioCtx.currentTime);
            noiseGain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.05);
            
            noise.connect(filter);
            filter.connect(noiseGain);
            noiseGain.connect(this.mainGain);
            
            noise.start();
            noise.stop(this.audioCtx.currentTime + 0.05);
        }
        this.currentRhythm = (this.currentRhythm + 1) % this.rhythm.length;
    }

    playMelody() {
        if (!this.isPlaying) return;

        // Play melody with industrial effects
        const melodyVolume = 0.4 + Math.random() * 0.2;
        this.playNote(this.melody[this.currentNote], this.noteLength * 0.8, 'square', melodyVolume);
        
        // Play bass with more presence
        if (this.currentNote % 2 === 0) {
            this.playNote(this.bassline[this.currentBass], this.noteLength * 1.2, 'triangle', 0.7);
            this.currentBass = (this.currentBass + 1) % this.bassline.length;
        }

        // Industrial rhythm
        this.playRhythm();

        // Add occasional metallic arpeggio
        if (this.currentNote % 8 === 7) {
            const baseFreq = this.melody[this.currentNote];
            [1.5, 2, 2.5, 3].forEach((mult, i) => {
                setTimeout(() => {
                    this.playNote(baseFreq * mult, this.noteLength * 0.2, 'square', 0.2);
                }, i * this.noteLength * 200);
            });
        }

        this.currentNote = (this.currentNote + 1) % this.melody.length;
        
        // Schedule next note
        setTimeout(() => this.playMelody(), this.noteLength * 1000);
    }

    start() {
        if (this.isPlaying) return;
        this.isPlaying = true;
        this.currentNote = 0;
        this.currentBass = 0;
        this.currentRhythm = 0;
        this.playMelody();
    }

    stop() {
        this.isPlaying = false;
    }
}

// Create music instance
const music = new ChiptuneSynth();

// Modify RetroSoundFX to use the same audio context
class RetroSoundFX {
    constructor() {
        this.audioCtx = music.audioCtx; // Share audio context with music
    }

    playJump() {
        this.playTone(400, 0.1, 'square');
    }

    playRing() {
        this.playTone(800, 0.1, 'sine');
    }

    playDeath() {
        this.playTone(200, 0.3, 'sawtooth');
    }

    playSpeedBoost() {
        this.playTone(600, 0.2, 'square');
    }

    playSpring() {
        this.playTone(600, 0.1, 'square', 600, 1200);
    }

    playPowerup() {
        const notes = [440, 554.37, 659.25, 880];
        notes.forEach((freq, i) => {
            setTimeout(() => {
                this.playTone(freq, 0.1, 'square');
            }, i * 100);
        });
    }

    playTone(frequency, duration, type, startFreq = frequency, endFreq = frequency) {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        
        osc.type = type;
        osc.frequency.setValueAtTime(startFreq, this.audioCtx.currentTime);
        osc.frequency.linearRampToValueAtTime(endFreq, this.audioCtx.currentTime + duration);
        
        gain.gain.setValueAtTime(0.2, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + duration);
        
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        
        osc.start();
        osc.stop(this.audioCtx.currentTime + duration);
    }
}

// Replace AudioManager with RetroSoundFX
const sfx = new RetroSoundFX();

class Sonic {
    constructor() {
        this.x = 50;
        this.y = 200;
        this.width = 40;
        this.height = 40;
        this.speed = 5;
        this.maxSpeed = 15;
        this.jumpForce = -12;
        this.gravity = 0.5;
        this.velocityY = 0;
        this.velocityX = 0;
        this.isJumping = false;
        this.score = 0;
        this.frameCount = 0;
        this.spriteFrame = 0;
        this.isDead = false;
        this.direction = 1;
        this.isSpinning = false;
        this.spinCharge = 0;
        this.particles = [];
        this.isInvincible = false;
        this.invincibleTimer = 0;
        this.powerupDuration = 500;
        this.doubleJumpAvailable = true;
        this.hasMagnet = false;
        this.magnetTimer = 0;
        this.magnetDuration = 300;
        this.magnetRange = 100;
        this.hasSpeedBoost = false;
        this.speedBoostTimer = 0;
        this.speedBoostDuration = 300;
        this.normalMaxSpeed = 15;
        this.boostedMaxSpeed = 25;
        this.canDashAttack = true;
        this.isDashing = false;
        this.dashCooldown = 100;
        this.dashTimer = 0;
        this.dashSpeed = 30;
        this.isOnPlatform = false;
        this.hasShield = false;
        this.shieldTimer = 0;
        this.shieldDuration = 300;
        this.hasFireball = false;
        this.fireballTimer = 0;
        this.fireballDuration = 200;
        this.comboMultiplier = 1;
        this.comboTimer = 0;
        this.comboCooldown = 120;
        this.lastBoostTime = 0;
    }

    update() {
        // Apply gravity
        this.velocityY += this.gravity;
        this.y += this.velocityY;

        // Apply horizontal movement with momentum
        this.x += this.velocityX;
        
        // Gradually slow down when not moving
        if (!keys.ArrowRight && !keys.ArrowLeft && !this.isSpinning) {
            this.velocityX *= 0.95;
        }

        // Keep Sonic within canvas bounds
        if (this.x < 0) {
            this.x = 0;
            this.velocityX = 0;
        }
        if (this.x > canvas.width - this.width) {
            this.x = canvas.width - this.width;
            this.velocityX = 0;
        }

        // Ground collision
        if (this.y > 360) {
            this.y = 360;
            this.velocityY = 0;
            this.isJumping = false;
            this.doubleJumpAvailable = true;
        }

        // Spin dash charge
        if (this.isSpinning) {
            this.spinCharge = Math.min(this.spinCharge + 0.5, 20);
        }

        // Animation
        this.frameCount++;
        if (this.frameCount >= 5) {
            this.spriteFrame = (this.spriteFrame + 1) % 4;
            this.frameCount = 0;
        }

        // Update particles
        this.particles = this.particles.filter(particle => particle.alpha > 0);
        this.particles.forEach(particle => particle.update());

        // Update invincibility
        if (this.isInvincible) {
            this.invincibleTimer--;
            if (this.invincibleTimer <= 0) {
                this.isInvincible = false;
            }
        }

        // Create running particles
        if (Math.abs(this.velocityX) > 2 && !this.isJumping && Math.random() < 0.3) {
            this.particles.push(new Particle(
                this.x + this.width/2,
                this.y + this.height,
                '#ffffff',
                { x: -this.velocityX * 0.2, y: -1 }
            ));
        }

        // Update power-ups
        if (this.hasMagnet) {
            this.magnetTimer--;
            if (this.magnetTimer <= 0) {
                this.hasMagnet = false;
            }
            // Ring magnet effect
            rings.forEach(ring => {
                if (!ring.collected) {
                    const dx = this.x + this.width/2 - (ring.x + ring.width/2);
                    const dy = this.y + this.height/2 - (ring.y + ring.height/2);
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < this.magnetRange) {
                        ring.x += dx * 0.1;
                        ring.y += dy * 0.1;
                    }
                }
            });
        }

        if (this.hasSpeedBoost) {
            this.speedBoostTimer--;
            if (this.speedBoostTimer <= 0) {
                this.hasSpeedBoost = false;
                this.maxSpeed = this.normalMaxSpeed;
            }
        }

        // Create trail particles when speed boosting
        if (this.hasSpeedBoost && Math.abs(this.velocityX) > 5) {
            this.particles.push(new Particle(
                this.x + this.width/2,
                this.y + this.height/2,
                this.isInvincible ? '#ffff00' : '#0066ff',
                { x: -this.direction * Math.random() * 3, y: (Math.random() - 0.5) * 2 }
            ));
        }

        // Update dash attack
        if (this.dashTimer > 0) {
            this.dashTimer--;
            if (this.dashTimer === 0) {
                this.canDashAttack = true;
                this.isDashing = false;
            }
        }

        // Platform collision check
        this.isOnPlatform = false;
        platforms.forEach(platform => {
            if (this.velocityY > 0 && // Only when falling
                this.x < platform.x + platform.width &&
                this.x + this.width > platform.x &&
                this.y + this.height > platform.y &&
                this.y < platform.y + platform.height) {
                this.y = platform.y - this.height;
                this.velocityY = 0;
                this.isJumping = false;
                this.isOnPlatform = true;
                this.doubleJumpAvailable = true;
            }
        });

        // Only apply gravity if not on a platform
        if (!this.isOnPlatform && this.y < 360) {
            this.velocityY += this.gravity;
        }

        // Update power-up timers
        if (this.hasShield) {
            this.shieldTimer--;
            if (this.shieldTimer <= 0) this.hasShield = false;
        }
        
        if (this.hasFireball) {
            this.fireballTimer--;
            if (this.fireballTimer <= 0) this.hasFireball = false;
            
            // Create fire particles
            if (Math.random() < 0.3) {
                this.particles.push(new Particle(
                    this.x + this.width/2,
                    this.y + this.height/2,
                    '#ff4500',
                    {
                        x: (Math.random() - 0.5) * 5,
                        y: (Math.random() - 0.5) * 5
                    }
                ));
            }
        }
        
        // Update combo
        if (this.comboTimer > 0) {
            this.comboTimer--;
            if (this.comboTimer <= 0) {
                this.comboMultiplier = 1;
            }
        }
    }

    draw(ctx) {
        // Draw particles first
        this.particles.forEach(particle => particle.draw(ctx));

        ctx.save();
        
        // Invincibility effect
        if (this.isInvincible) {
            ctx.globalAlpha = 0.5 + Math.sin(Date.now() * 0.01) * 0.5;
        }

        // Draw spin effect when charging
        if (this.isSpinning) {
            ctx.beginPath();
            ctx.arc(this.x + this.width/2, this.y + this.height/2, 25, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        // Draw magnet effect
        if (this.hasMagnet) {
            ctx.beginPath();
            ctx.arc(this.x + this.width/2, this.y + this.height/2, this.magnetRange, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(255, 0, 255, 0.2)';
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        // Draw shield effect
        if (this.hasShield) {
            ctx.beginPath();
            ctx.arc(this.x + this.width/2, this.y + this.height/2, 25, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(0, 255, 255, ${0.5 + Math.sin(Date.now() * 0.01) * 0.3})`;
            ctx.lineWidth = 3;
            ctx.stroke();
        }
        
        // Draw fireball effect
        if (this.hasFireball) {
            for (let i = 0; i < 8; i++) {
                const angle = (i * Math.PI * 2) / 8 + Date.now() * 0.005;
                const radius = 30;
                ctx.beginPath();
                ctx.moveTo(this.x + this.width/2, this.y + this.height/2);
                ctx.lineTo(
                    this.x + this.width/2 + Math.cos(angle) * radius,
                    this.y + this.height/2 + Math.sin(angle) * radius
                );
                ctx.strokeStyle = '#ff4500';
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        }

        // Draw Sonic
        ctx.fillStyle = this.isSpinning ? '#0066FF' : '#0000FF';
        ctx.beginPath();
        ctx.arc(this.x + this.width/2, this.y + this.height/2, 20, 0, Math.PI * 2);
        ctx.fill();
        
        // Eyes
        if (!this.isSpinning) {
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(this.x + this.width/2 + (8 * this.direction), this.y + this.height/2 - 5, 8, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(this.x + this.width/2 + (10 * this.direction), this.y + this.height/2 - 5, 4, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Draw combo multiplier
        if (this.comboMultiplier > 1) {
            ctx.fillStyle = '#ffff00';
            ctx.font = '20px Arial';
            ctx.fillText(`x${this.comboMultiplier}`, this.x + this.width/2 - 10, this.y - 20);
        }
        
        ctx.restore();
    }

    jump() {
        if (!this.isJumping) {
            this.velocityY = this.jumpForce;
            this.isJumping = true;
            this.doubleJumpAvailable = true;
            sfx.playJump();
        } else if (this.doubleJumpAvailable) {
            this.velocityY = this.jumpForce * 0.8;
            this.doubleJumpAvailable = false;
            sfx.playJump();
        }
    }

    startSpinDash() {
        if (!this.isJumping) {
            this.isSpinning = true;
            this.spinCharge = 0;
        }
    }

    releaseSpinDash() {
        if (this.isSpinning) {
            this.velocityX = this.direction * (this.speed + this.spinCharge);
            this.isSpinning = false;
            sfx.playSpeedBoost();
        }
    }

    collectRing() {
        this.score += 10;
        sfx.playRing();
    }

    makeInvincible() {
        this.isInvincible = true;
        this.invincibleTimer = this.powerupDuration;
        sfx.playPowerup();

        // Create celebration particles
        for (let i = 0; i < 20; i++) {
            const angle = (Math.PI * 2 * i) / 20;
            this.particles.push(new Particle(
                this.x + this.width/2,
                this.y + this.height/2,
                '#ffff00',
                {
                    x: Math.cos(angle) * 5,
                    y: Math.sin(angle) * 5
                }
            ));
        }
    }

    collectPowerUp(powerUp) {
        switch(powerUp.type) {
            case 'speed':
                this.hasSpeedBoost = true;
                this.speedBoostTimer = this.speedBoostDuration;
                this.maxSpeed = this.boostedMaxSpeed;
                sfx.playPowerup();
                break;
            case 'magnet':
                this.hasMagnet = true;
                this.magnetTimer = this.magnetDuration;
                sfx.playPowerup();
                break;
            case 'shield':
                this.hasShield = true;
                this.shieldTimer = this.shieldDuration;
                sfx.playPowerup();
                break;
            case 'fireball':
                this.hasFireball = true;
                this.fireballTimer = this.fireballDuration;
                sfx.playPowerup();
                break;
        }
        powerUp.collected = true;
        
        // Increment combo
        this.comboMultiplier = Math.min(this.comboMultiplier + 1, 5);
        this.comboTimer = this.comboCooldown;
    }

    dashAttack() {
        if (this.canDashAttack) {
            this.isDashing = true;
            this.canDashAttack = false;
            this.dashTimer = this.dashCooldown;
            this.velocityX = this.direction * this.dashSpeed;
            
            // Create dash effect particles
            for (let i = 0; i < 10; i++) {
                this.particles.push(new Particle(
                    this.x + this.width/2,
                    this.y + this.height/2,
                    '#00ffff',
                    {
                        x: -this.direction * Math.random() * 5,
                        y: (Math.random() - 0.5) * 3
                    }
                ));
            }
            sfx.playSpeedBoost();
        }
    }
}

// Game initialization
const canvas = document.getElementById('gameCanvas');
if (!canvas) {
    console.error('Canvas element not found!');
    throw new Error('Canvas element not found!');
}

const ctx = canvas.getContext('2d');
if (!ctx) {
    console.error('Could not get 2D context!');
    throw new Error('Could not get 2D context!');
}

// Add background color to make sure canvas is visible
ctx.fillStyle = '#87CEEB';  // Sky blue
ctx.fillRect(0, 0, canvas.width, canvas.height);

const sonic = new Sonic();

// Create rings and obstacles
const rings = Array.from({length: 8}, (_, i) => 
    new Ring(200 + (i * 100), 
             200 + Math.sin(i * 0.5) * 100));

const obstacles = [
    new Obstacle(canvas.width, 330),
    new Obstacle(canvas.width + 500, 330)
];

// Add springs and power-ups to game initialization
const springs = [
    new Spring(300, 370),
    new Spring(500, 370),
    new Spring(700, 370)
];

// Add new game elements
const coins = [
    new Coin(350, 150),
    new Coin(550, 100),
    new Coin(750, 200)
];

const platforms = [
    new Platform(200, 250),
    new Platform(400, 200),
    new Platform(600, 300)
];

// Add new game elements
const boosts = [
    new Boost(250, 350, -45),
    new Boost(450, 300, -30),
    new Boost(650, 250, -60)
];

// Add new power-ups
const powerUps = [
    new PowerUp(400, 200, 'speed'),
    new PowerUp(600, 200, 'magnet'),
    new PowerUp(300, 150, 'shield'),
    new PowerUp(500, 150, 'fireball')
];

// Update keyboard controls
const keys = {
    ArrowRight: false,
    ArrowLeft: false,
    ShiftLeft: false,
    ShiftRight: false
};

document.addEventListener('keydown', (event) => {
    if (event.key in keys) {
        keys[event.key] = true;
    }
    if (event.key === ' ' || event.key === 'ArrowUp') {
        sonic.jump();
    }
    if ((event.key === 'ShiftLeft' || event.key === 'ShiftRight') && !sonic.isSpinning) {
        sonic.startSpinDash();
    }
    if (event.key === 'z' || event.key === 'Z') {
        sonic.dashAttack();
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key in keys) {
        keys[event.key] = false;
    }
    if ((event.key === 'ShiftLeft' || event.key === 'ShiftRight') && sonic.isSpinning) {
        sonic.releaseSpinDash();
    }
});

// Add this before game initialization
let gameState = {
    isGameOver: false,
    restartRequested: false,
    isMusicEnabled: true
};

// Add music toggle button
document.body.insertAdjacentHTML('beforeend', `
    <button id="musicButton" style="
        position: fixed;
        top: 10px;
        right: 10px;
        padding: 10px;
        background: #4CAF50;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        z-index: 1000;
    ">🎵 Music On</button>
`);

// Add music button functionality
document.getElementById('musicButton').addEventListener('click', function() {
    gameState.isMusicEnabled = !gameState.isMusicEnabled;
    if (gameState.isMusicEnabled) {
        music.start();
        this.textContent = '🎵 Music On';
        this.style.background = '#4CAF50';
    } else {
        music.stop();
        this.textContent = '🎵 Music Off';
        this.style.background = '#f44336';
    }
});

// Modify checkCollisions function
function checkCollisions() {
    // Ring collisions
    rings.forEach(ring => {
        if (!ring.collected &&
            sonic.x < ring.x + ring.width &&
            sonic.x + sonic.width > ring.x &&
            sonic.y < ring.y + ring.height &&
            sonic.y + sonic.height > ring.y) {
            ring.collected = true;
            sonic.collectRing();
        }
    });

    // Spring collisions
    springs.forEach(spring => {
        if (sonic.velocityY > 0 && // Only when falling
            sonic.x < spring.x + spring.width &&
            sonic.x + sonic.width > spring.x &&
            sonic.y + sonic.height > spring.y &&
            sonic.y < spring.y + spring.height) {
            
            sonic.velocityY = spring.bounceForce;
            spring.isCompressed = true;
            sfx.playSpring();
            
            // Create spring particles
            for (let i = 0; i < 10; i++) {
                sonic.particles.push(new Particle(
                    spring.x + spring.width/2,
                    spring.y,
                    '#ff6666',
                    { x: (Math.random() - 0.5) * 5, y: -Math.random() * 5 }
                ));
            }

            // Reset spring after a short delay
            setTimeout(() => spring.isCompressed = false, 100);
        }
    });

    // Make invincible if score reaches certain thresholds
    if (sonic.score > 0 && sonic.score % 30 === 0 && !sonic.isInvincible) {
        sonic.makeInvincible();
    }

    // Obstacle collisions - modify to account for invincibility
    obstacles.forEach(obstacle => {
        if (!gameState.isGameOver &&
            sonic.x < obstacle.x + obstacle.width &&
            sonic.x + sonic.width > obstacle.x &&
            sonic.y < obstacle.y + obstacle.height &&
            sonic.y + sonic.height > obstacle.y) {
            if (!sonic.isInvincible) {
                handleGameOver();
            } else {
                // Create particles when hitting obstacle while invincible
                for (let i = 0; i < 10; i++) {
                    sonic.particles.push(new Particle(
                        obstacle.x + obstacle.width/2,
                        obstacle.y + obstacle.height/2,
                        '#ff0000',
                        { x: (Math.random() - 0.5) * 8, y: (Math.random() - 0.5) * 8 }
                    ));
                }
            }
        }
    });

    // Power-up collisions
    powerUps.forEach(powerUp => {
        if (!powerUp.collected &&
            sonic.x < powerUp.x + powerUp.width &&
            sonic.x + sonic.width > powerUp.x &&
            sonic.y < powerUp.y + powerUp.height &&
            sonic.y + sonic.height > powerUp.y) {
            sonic.collectPowerUp(powerUp);
            
            // Create celebration particles
            for (let i = 0; i < 15; i++) {
                const angle = (Math.PI * 2 * i) / 15;
                sonic.particles.push(new Particle(
                    powerUp.x + powerUp.width/2,
                    powerUp.y + powerUp.height/2,
                    powerUp.type === 'speed' ? '#ff0000' : powerUp.type === 'magnet' ? '#ff00ff' : powerUp.type === 'shield' ? '#00ffff' : '#ffa500',
                    {
                        x: Math.cos(angle) * 4,
                        y: Math.sin(angle) * 4
                    }
                ));
            }
        }
    });

    // Coin collisions
    coins.forEach(coin => {
        if (!coin.collected &&
            sonic.x < coin.x + coin.width &&
            sonic.x + sonic.width > coin.x &&
            sonic.y < coin.y + coin.height &&
            sonic.y + sonic.height > coin.y) {
            coin.collected = true;
            sonic.score += coin.value;
            sfx.playPowerup();
            
            // Create celebration particles
            for (let i = 0; i < 15; i++) {
                const angle = (Math.PI * 2 * i) / 15;
                sonic.particles.push(new Particle(
                    coin.x + coin.width/2,
                    coin.y + coin.height/2,
                    '#FFD700',
                    {
                        x: Math.cos(angle) * 4,
                        y: Math.sin(angle) * 4
                    }
                ));
            }
        }
    });

    // Dash attack destroying obstacles
    if (sonic.isDashing) {
        obstacles.forEach(obstacle => {
            if (sonic.x < obstacle.x + obstacle.width &&
                sonic.x + sonic.width > obstacle.x &&
                sonic.y < obstacle.y + obstacle.height &&
                sonic.y + sonic.height > obstacle.y) {
                // Remove obstacle
                const index = obstacles.indexOf(obstacle);
                if (index > -1) {
                    obstacles.splice(index, 1);
                    sonic.score += 20;
                    
                    // Create destruction particles
                    for (let i = 0; i < 20; i++) {
                        sonic.particles.push(new Particle(
                            obstacle.x + obstacle.width/2,
                            obstacle.y + obstacle.height/2,
                            '#ff0000',
                            {
                                x: (Math.random() - 0.5) * 8,
                                y: (Math.random() - 0.5) * 8
                            }
                        ));
                    }
                }
            }
        });
    }

    // Boost pad collisions
    boosts.forEach(boost => {
        if (boost.cooldown === 0 &&
            sonic.x < boost.x + boost.width &&
            sonic.x + sonic.width > boost.x &&
            sonic.y < boost.y + boost.height &&
            sonic.y + sonic.height > boost.y) {
            
            // Apply boost force
            sonic.velocityX = Math.cos(boost.angle) * boost.power;
            sonic.velocityY = Math.sin(boost.angle) * boost.power;
            boost.cooldown = 30;
            sfx.playSpring();
            
            // Create boost particles
            for (let i = 0; i < 15; i++) {
                sonic.particles.push(new Particle(
                    boost.x + boost.width/2,
                    boost.y + boost.height/2,
                    '#ffff00',
                    {
                        x: Math.cos(boost.angle) * Math.random() * 8,
                        y: Math.sin(boost.angle) * Math.random() * 8
                    }
                ));
            }
        }
    });
}

// Add new function for game over handling
function handleGameOver() {
    gameState.isGameOver = true;
    sonic.isDead = true;
    
    music.stop();
    sfx.playDeath();
    
    setTimeout(() => {
        alert(`Game Over! Score: ${sonic.score}`);
        if (!gameState.restartRequested) {
            gameState.restartRequested = true;
            window.location.reload();
        }
    }, 50);
}

function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${sonic.score}`, 20, 30);
}

// Modify gameLoop function to include movement update
function gameLoop() {
    if (gameState.isGameOver) {
        return;  // Stop the game loop when game is over
    }

    // Update movement based on held keys
    if (!sonic.isSpinning) {
        if (keys.ArrowRight) {
            sonic.velocityX = Math.min(sonic.velocityX + 0.5, sonic.maxSpeed);
            sonic.direction = 1;
        } else if (keys.ArrowLeft) {
            sonic.velocityX = Math.max(sonic.velocityX - 0.5, -sonic.maxSpeed);
            sonic.direction = -1;
        }
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background
    ctx.fillStyle = '#87CEEB';  // Sky blue
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw ground
    ctx.fillStyle = '#228B22';
    ctx.fillRect(0, 380, canvas.width, 20);

    // Update and draw game elements
    sonic.update();
    obstacles.forEach(obstacle => obstacle.update());
    
    rings.forEach(ring => ring.draw(ctx));
    obstacles.forEach(obstacle => obstacle.draw(ctx));
    springs.forEach(spring => spring.draw(ctx));
    sonic.draw(ctx);
    drawScore();
    
    // Update and draw power-ups
    powerUps.forEach(powerUp => {
        powerUp.update();
        powerUp.draw(ctx);
    });
    
    // Update and draw platforms
    platforms.forEach(platform => {
        platform.update();
        platform.draw(ctx);
    });

    // Update and draw coins
    coins.forEach(coin => {
        coin.update();
        coin.draw(ctx);
    });
    
    // Update and draw boosts
    boosts.forEach(boost => {
        boost.update();
        boost.draw(ctx);
    });
    
    checkCollisions();

    requestAnimationFrame(gameLoop);
}

// Start music with game
try {
    console.log('Starting game loop...');
    music.start();
    gameLoop();
} catch (error) {
    console.error('Error in game loop:', error);
} 