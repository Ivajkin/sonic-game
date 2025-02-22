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

class ChiptuneSynth {
    constructor() {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        this.isPlaying = false;
        this.mainGain = this.audioCtx.createGain();
        this.mainGain.gain.value = 0.2;
        this.mainGain.connect(this.audioCtx.destination);
        
        // Music parameters
        this.bpm = 150;
        this.noteLength = 60 / this.bpm;
        
        // Melody sequence (using frequencies)
        this.melody = [
            392, 523.25, 392, 659.25,  // G4, C5, G4, E5
            523.25, 392, 329.63, 440,  // C5, G4, E4, A4
            392, 523.25, 392, 659.25,  // Repeat
            523.25, 392, 329.63, 440
        ];
        
        this.bassline = [
            196, 196, 146.83, 196,  // G3, G3, D3, G3
            220, 196, 164.81, 174.61  // A3, G3, E3, F3
        ];
        
        this.currentNote = 0;
        this.currentBass = 0;
    }

    playNote(frequency, duration, type = 'square') {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        
        osc.type = type;
        osc.frequency.value = frequency;
        
        gain.gain.setValueAtTime(0.5, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + duration * 0.8);
        
        osc.connect(gain);
        gain.connect(this.mainGain);
        
        osc.start();
        osc.stop(this.audioCtx.currentTime + duration);
    }

    playMelody() {
        if (!this.isPlaying) return;

        // Play melody note
        this.playNote(this.melody[this.currentNote], this.noteLength * 0.8, 'square');
        
        // Play bass note every other beat
        if (this.currentNote % 2 === 0) {
            this.playNote(this.bassline[this.currentBass], this.noteLength * 1.5, 'triangle');
            this.currentBass = (this.currentBass + 1) % this.bassline.length;
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
        this.playTone(880, 0.1, 'sine', 880, 1760);
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