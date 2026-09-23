/**
 * Mystic Stardust & Constellation Canvas Engine
 * Generates twinkling stars, floating magic particles, and ethereal aura.
 */

class MysticParticles {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");
    this.particles = [];
    this.stars = [];
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.mouseX = this.width / 2;
    this.mouseY = this.height / 2;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener("resize", () => this.resize());
    window.addEventListener("mousemove", (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });

    // Create fixed background stars
    const starCount = Math.floor((this.width * this.height) / 12000);
    this.stars = [];
    for (let i = 0; i < starCount; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.7 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2
      });
    }

    // Create floating magic stardust particles
    const particleCount = Math.min(60, Math.floor((this.width * this.height) / 25000));
    this.particles = [];
    for (let i = 0; i < particleCount; i++) {
      this.particles.push(this.createParticle());
    }

    this.animate();
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  createParticle(fromMouse = false) {
    return {
      x: fromMouse ? this.mouseX + (Math.random() * 40 - 20) : Math.random() * this.width,
      y: fromMouse ? this.mouseY + (Math.random() * 40 - 20) : Math.random() * this.height,
      radius: Math.random() * 2.2 + 0.8,
      vx: (Math.random() - 0.5) * 0.6,
      vy: -Math.random() * 0.8 - 0.2, // Drifting upwards like incense smoke
      color: Math.random() > 0.4 ? "245, 197, 66" : "192, 132, 252", // Gold or Amethyst
      alpha: Math.random() * 0.8 + 0.2,
      maxLife: Math.random() * 300 + 150,
      life: 0
    };
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Draw twinkling stars
    for (let s of this.stars) {
      s.twinklePhase += s.twinkleSpeed;
      const currentAlpha = s.alpha + Math.sin(s.twinklePhase) * 0.3;
      this.ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, currentAlpha)})`;
      this.ctx.beginPath();
      this.ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // Draw and update floating stardust
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      p.life++;
      p.x += p.vx;
      p.y += p.vy;

      // Fade in and out
      const progress = p.life / p.maxLife;
      const opacity = Math.sin(progress * Math.PI) * p.alpha;

      // Particle glow
      this.ctx.save();
      this.ctx.shadowBlur = 8;
      this.ctx.shadowColor = `rgba(${p.color}, ${opacity})`;
      this.ctx.fillStyle = `rgba(${p.color}, ${opacity})`;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();

      if (p.life >= p.maxLife || p.y < -10 || p.x < -10 || p.x > this.width + 10) {
        this.particles[i] = this.createParticle();
        this.particles[i].y = this.height + 10;
      }
    }

    requestAnimationFrame(() => this.animate());
  }

  burst(x, y, count = 25) {
    for (let i = 0; i < count; i++) {
      const p = this.createParticle(false);
      p.x = x;
      p.y = y;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3 + 1;
      p.vx = Math.cos(angle) * speed;
      p.vy = Math.sin(angle) * speed;
      p.maxLife = Math.random() * 80 + 40;
      this.particles.push(p);
    }
  }
}

window.addEventListener("DOMContentLoaded", () => {
  window.mysticParticles = new MysticParticles("stardust-canvas");
});
