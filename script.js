const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = 800;
canvas.height = 600;

// Ball class
class Ball {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.dx = (Math.random() - 0.5) * 8; // Random horizontal velocity
        this.dy = (Math.random() - 0.5) * 8; // Random vertical velocity
        this.mass = radius; // Mass proportional to radius
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    update(balls) {
        // Bounce off walls
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.dx = -this.dx;
        }
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            this.dy = -this.dy;
        }

        // Check collision with other balls
        for (let ball of balls) {
            if (ball === this) continue;

            // Calculate distance between balls
            const dx = ball.x - this.x;
            const dy = ball.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Check if balls are colliding
            if (distance < this.radius + ball.radius) {
                // Calculate collision normal
                const nx = dx / distance;
                const ny = dy / distance;

                // Calculate relative velocity
                const relativeVelocityX = this.dx - ball.dx;
                const relativeVelocityY = this.dy - ball.dy;

                // Calculate relative velocity in terms of the normal direction
                const velocityAlongNormal = relativeVelocityX * nx + relativeVelocityY * ny;

                // Do not resolve if velocities are separating
                if (velocityAlongNormal > 0) continue;

                // Calculate restitution (bounciness)
                const restitution = 0.8;

                // Calculate impulse scalar
                const j = -(1 + restitution) * velocityAlongNormal;
                const impulseX = j * nx;
                const impulseY = j * ny;

                // Apply impulse
                const totalMass = this.mass + ball.mass;
                this.dx -= (impulseX * ball.mass) / totalMass;
                this.dy -= (impulseY * ball.mass) / totalMass;
                ball.dx += (impulseX * this.mass) / totalMass;
                ball.dy += (impulseY * this.mass) / totalMass;

                // Move balls apart to prevent sticking
                const overlap = (this.radius + ball.radius - distance) / 2;
                this.x -= overlap * nx;
                this.y -= overlap * ny;
                ball.x += overlap * nx;
                ball.y += overlap * ny;
            }
        }

        // Update position
        this.x += this.dx;
        this.y += this.dy;

        this.draw();
    }
}

// Create balls
const balls = [];

// Create the original 5 colored balls
const colors = ['red', 'blue', 'green', 'orange', 'white'];
for (let i = 0; i < 5; i++) {
    const radius = 20;
    const x = Math.random() * (canvas.width - radius * 2) + radius;
    const y = Math.random() * (canvas.height - radius * 2) + radius;
    balls.push(new Ball(x, y, radius, colors[i]));
}

// Add 4 more green balls with larger radius
for (let i = 0; i < 4; i++) {
    const radius = 25; // Slightly larger radius for green balls
    const x = Math.random() * (canvas.width - radius * 2) + radius;
    const y = Math.random() * (canvas.height - radius * 2) + radius;
    balls.push(new Ball(x, y, radius, '#00FF00')); // Using hex color for brighter green
}

// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    balls.forEach(ball => {
        ball.update(balls);
    });

    requestAnimationFrame(animate);
}

animate(); 