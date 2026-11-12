/**
 * เซียมซีทาโรต์ (SiamSi Tarot) - Sacred Moving Background Engine
 * สร้างพื้นหลังเคลื่อนไหวทรงพลังและมีมนต์ขลัง:
 * - วงเวทย์จักรวาลทองคำหมุนช้าๆ (Rotating Sacred Astrological Mandala)
 * - เงาไพ่ทาโรต์และไม้ติ้วเซียมซีโบราณลอยเคลื่อนไหวในมิติมนตรา (Floating Tarot Cards & Siamsi Bamboo Sticks)
 * - ละอองทองคำเปลวและควันกำยานศักดิ์สิทธิ์ลอยขึ้น (Golden Incense Stardust)
 * - เอฟเฟกต์ระเบิดแสงออร่าและวงแหวนมนตราตอนจับไพ่และเปิดไพ่ (Rune Shockwave & Burst)
 */

class MysticParticles {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");
    this.particles = [];
    this.stars = [];
    this.relics = [];
    this.shockwaves = [];
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.mouseX = this.width / 2;
    this.mouseY = this.height / 2;
    this.mandalaAngle = 0;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener("resize", () => this.resize());
    window.addEventListener("mousemove", (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });

    // 1. ดวงดาวระยิบระยับในจักรวาล
    const starCount = Math.floor((this.width * this.height) / 11000);
    this.stars = [];
    for (let i = 0; i < starCount; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * 1.6 + 0.4,
        alpha: Math.random() * 0.65 + 0.2,
        twinkleSpeed: Math.random() * 0.025 + 0.006,
        twinklePhase: Math.random() * Math.PI * 2
      });
    }

    // 2. ไพ่ทาโรต์และไม้เซียมซีโบราณลอยเคลื่อนไหวในฉากหลัง
    const relicCount = Math.min(14, Math.max(8, Math.floor(this.width / 130)));
    this.relics = [];
    const symbols = ["✦", "☽", "☀", "籤", "🔮", "🎋", "★", "吉"];
    for (let i = 0; i < relicCount; i++) {
      const isTarot = i % 2 === 0;
      this.relics.push({
        type: isTarot ? "tarot" : "siamsi",
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: -Math.random() * 0.35 - 0.12,
        rot: (Math.random() - 0.5) * 0.8,
        vRot: (Math.random() - 0.5) * 0.003,
        scale: Math.random() * 0.45 + 0.55,
        alpha: Math.random() * 0.12 + 0.05,
        symbol: symbols[i % symbols.length]
      });
    }

    // 3. ละอองทองคำและมนตราลอยขึ้น
    const particleCount = Math.min(70, Math.floor((this.width * this.height) / 22000));
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
    const rand = Math.random();
    let color = "243, 207, 122"; // Champagne Gold (Logo Gold)
    if (rand > 0.62) color = "56, 189, 248"; // Celestial Cyan (Logo Starlight)
    else if (rand > 0.84) color = "168, 85, 247"; // Nebula Violet (Logo Cosmic Glow)

    return {
      x: fromMouse ? this.mouseX + (Math.random() * 40 - 20) : Math.random() * this.width,
      y: fromMouse ? this.mouseY + (Math.random() * 40 - 20) : Math.random() * this.height,
      radius: Math.random() * 2.4 + 0.7,
      vx: (Math.random() - 0.5) * 0.55,
      vy: -Math.random() * 0.85 - 0.2,
      color,
      alpha: Math.random() * 0.8 + 0.2,
      maxLife: Math.random() * 320 + 160,
      life: 0
    };
  }

  drawSacredMandala() {
    const ctx = this.ctx;
    const cx = this.width / 2;
    const cy = Math.min(this.height * 0.42, 420);
    const baseRadius = Math.min(this.width, this.height) * 0.36;

    this.mandalaAngle += 0.0012;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(this.mandalaAngle);

    // วงแหวนมนตรานอกและใน
    ctx.strokeStyle = "rgba(245, 197, 66, 0.075)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(0, 0, baseRadius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = "rgba(192, 132, 252, 0.065)";
    ctx.beginPath();
    ctx.arc(0, 0, baseRadius * 0.78, 0, Math.PI * 2);
    ctx.stroke();

    // ดาวแปดแฉกจักรวาล
    const points = 8;
    ctx.strokeStyle = "rgba(245, 197, 66, 0.055)";
    ctx.beginPath();
    for (let i = 0; i < points; i++) {
      const a1 = (i * Math.PI * 2) / points;
      const a2 = ((i + 3) * Math.PI * 2) / points;
      ctx.moveTo(Math.cos(a1) * baseRadius * 0.78, Math.sin(a1) * baseRadius * 0.78);
      ctx.lineTo(Math.cos(a2) * baseRadius * 0.78, Math.sin(a2) * baseRadius * 0.78);
    }
    ctx.stroke();

    ctx.restore();
  }

  drawFloatingRelics() {
    const ctx = this.ctx;
    for (const r of this.relics) {
      r.x += r.vx;
      r.y += r.vy;
      r.rot += r.vRot;

      if (r.y < -120) {
        r.y = this.height + 100;
        r.x = Math.random() * this.width;
      }
      if (r.x < -100) r.x = this.width + 80;
      if (r.x > this.width + 100) r.x = -80;

      ctx.save();
      ctx.translate(r.x, r.y);
      ctx.rotate(r.rot);
      ctx.scale(r.scale, r.scale);

      if (r.type === "tarot") {
        // วาดเงาไพ่ทาโรต์ทองคำลอยเคลื่อนไหว
        const cw = 56;
        const ch = 92;
        ctx.fillStyle = `rgba(22, 10, 44, ${r.alpha * 1.4})`;
        ctx.strokeStyle = `rgba(245, 197, 66, ${r.alpha * 2.2})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(-cw / 2, -ch / 2, cw, ch, 6) : ctx.rect(-cw / 2, -ch / 2, cw, ch);
        ctx.fill();
        ctx.stroke();

        // กรอบในของไพ่
        ctx.strokeStyle = `rgba(245, 197, 66, ${r.alpha * 1.2})`;
        ctx.lineWidth = 0.8;
        ctx.strokeRect(-cw / 2 + 5, -ch / 2 + 5, cw - 10, ch - 10);

        ctx.fillStyle = `rgba(245, 197, 66, ${r.alpha * 2.3})`;
        ctx.font = "16px serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(r.symbol, 0, 0);
      } else {
        // วาดเงาไม้ติ้วเซียมซีโบราณปลายแดงทองลอยเคลื่อนไหว
        const sw = 14;
        const sh = 110;
        ctx.fillStyle = `rgba(180, 120, 60, ${r.alpha * 1.5})`;
        ctx.strokeStyle = `rgba(245, 197, 66, ${r.alpha * 2.0})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(-sw / 2, -sh / 2, sw, sh, 4) : ctx.rect(-sw / 2, -sh / 2, sw, sh);
        ctx.fill();
        ctx.stroke();

        // ปลายไม้สีแดงชาด
        ctx.fillStyle = `rgba(220, 38, 38, ${r.alpha * 2.4})`;
        ctx.fillRect(-sw / 2, -sh / 2, sw, 22);
      }

      ctx.restore();
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // 1. วาดวงเวทย์จักรวาลหมุนช้าๆ
    this.drawSacredMandala();

    // 2. วาดไพ่ทาโรต์และไม้เซียมซีลอยในฉากหลัง
    this.drawFloatingRelics();

    // 3. วาดดวงดาวระยิบระยับ
    for (const s of this.stars) {
      s.twinklePhase += s.twinkleSpeed;
      const currentAlpha = s.alpha + Math.sin(s.twinklePhase) * 0.3;
      this.ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.08, currentAlpha)})`;
      this.ctx.beginPath();
      this.ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // 4. วาดละอองมนตราทองคำ
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      p.life++;
      p.x += p.vx;
      p.y += p.vy;

      const progress = p.life / p.maxLife;
      const opacity = Math.sin(progress * Math.PI) * p.alpha;

      this.ctx.save();
      this.ctx.shadowBlur = 10;
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

    // 5. วาดคลื่นวงแหวนมนตรา (Shockwaves ตอนหยิบไพ่/เปิดไพ่)
    for (let i = this.shockwaves.length - 1; i >= 0; i--) {
      const sw = this.shockwaves[i];
      sw.radius += sw.speed;
      sw.alpha *= 0.94;

      this.ctx.save();
      this.ctx.strokeStyle = `rgba(${sw.color}, ${sw.alpha})`;
      this.ctx.lineWidth = sw.lineWidth;
      this.ctx.shadowBlur = 18;
      this.ctx.shadowColor = `rgba(${sw.color}, ${sw.alpha})`;
      this.ctx.beginPath();
      this.ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
      this.ctx.stroke();
      this.ctx.restore();

      if (sw.alpha < 0.02) {
        this.shockwaves.splice(i, 1);
      }
    }

    requestAnimationFrame(() => this.animate());
  }

  burst(x, y, count = 32) {
    // เพิ่มวงแหวนแสงศักดิ์สิทธิ์กระจายออก
    this.shockwaves.push({
      x,
      y,
      radius: 12,
      speed: 5.5,
      alpha: 0.85,
      lineWidth: 2.5,
      color: "245, 197, 66"
    });
    this.shockwaves.push({
      x,
      y,
      radius: 6,
      speed: 3.2,
      alpha: 0.65,
      lineWidth: 1.5,
      color: "192, 132, 252"
    });

    for (let i = 0; i < count; i++) {
      const p = this.createParticle(false);
      p.x = x;
      p.y = y;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4.2 + 1.2;
      p.vx = Math.cos(angle) * speed;
      p.vy = Math.sin(angle) * speed;
      p.radius = Math.random() * 2.8 + 1.1;
      p.maxLife = Math.random() * 75 + 40;
      this.particles.push(p);
    }
  }
}

window.addEventListener("DOMContentLoaded", () => {
  window.mysticParticles = new MysticParticles("stardust-canvas");
});
