/**
 * เซียมซีทาโรต์ (SIAMSI TAROT • ORACLE) - Sacred Moving Background Engine
 * สร้างพื้นหลังเคลื่อนไหวทรงพลังเข้ากับธีมโลโก้:
 * 1. วงเวทย์ (Sacred Magic Circles): วงเวทย์เรขาคณิตศักดิ์สิทธิ์ซ้อนหลายชั้นหมุนสวนทางกันอย่างนุ่มนวล
 * 2. ดวงชะตา (Astrological Zodiac & Constellations): วงล้อจักรราศี 12 ราศี และกลุ่มดาวเชื่อมต่อเส้นแสง (Constellation Lines)
 * 3. ดวงดาว (Celestial Stars & Stardust): ดวงดาวทอแสง 4 แฉก และละอองดาราทองคำ-ฟ้าคราม
 * 4. ไพ่ (Mystical Tarot Cards): ไพ่ทาโรต์ลวดลายดาราจักรขอบทองลอยเคลื่อนไหวอย่างมีมนต์ขลัง
 */

class MysticParticles {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");
    this.particles = [];
    this.stars = [];
    this.constellations = [];
    this.tarotCards = [];
    this.shockwaves = [];
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.mouseX = this.width / 2;
    this.mouseY = this.height / 2;
    this.mandalaAngle = 0;
    this.innerRingAngle = 0;

    this.zodiacGlyphs = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener("resize", () => this.resize());
    window.addEventListener("mousemove", (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });

    // 1. ดวงดาวระยิบระยับพร้อมประกายดาว 4 แฉก
    const starCount = Math.floor((this.width * this.height) / 10000);
    this.stars = [];
    for (let i = 0; i < starCount; i++) {
      const isSparkleStar = i % 6 === 0;
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: isSparkleStar ? (Math.random() * 1.9 + 1.1) : (Math.random() * 1.4 + 0.4),
        isSparkle: isSparkleStar,
        color: i % 3 === 0 ? "243, 207, 122" : (i % 3 === 1 ? "186, 230, 253" : "255, 255, 255"),
        alpha: Math.random() * 0.65 + 0.2,
        twinkleSpeed: Math.random() * 0.022 + 0.006,
        twinklePhase: Math.random() * Math.PI * 2
      });
    }

    // 2. กลุ่มดาวดวงชะตา (Constellations) เชื่อมด้วยเส้นแสงดาราจักร
    this.constellations = [
      {
        cx: this.width * 0.14,
        cy: this.height * 0.26,
        vx: 0.04,
        vy: -0.03,
        points: [
          { dx: -45, dy: -30 },
          { dx: -10, dy: -5 },
          { dx: 25, dy: -22 },
          { dx: 55, dy: 15 },
          { dx: 15, dy: 42 }
        ]
      },
      {
        cx: this.width * 0.86,
        cy: this.height * 0.24,
        vx: -0.04,
        vy: 0.03,
        points: [
          { dx: -40, dy: 20 },
          { dx: -5, dy: -18 },
          { dx: 30, dy: -8 },
          { dx: 52, dy: -42 },
          { dx: 20, dy: 35 }
        ]
      },
      {
        cx: this.width * 0.18,
        cy: this.height * 0.76,
        vx: 0.03,
        vy: 0.025,
        points: [
          { dx: -38, dy: -15 },
          { dx: 0, dy: -35 },
          { dx: 35, dy: -10 },
          { dx: 18, dy: 28 }
        ]
      },
      {
        cx: this.width * 0.84,
        cy: this.height * 0.74,
        vx: -0.035,
        vy: -0.025,
        points: [
          { dx: -42, dy: 10 },
          { dx: -8, dy: -24 },
          { dx: 28, dy: 4 },
          { dx: 50, dy: -20 }
        ]
      }
    ];

    // 3. ไพ่ทาโรต์ดาราจักร (Mystical Tarot Cards ล้วน ไม่มีไม้เซียมซีและไม่มีอีโมจิรกตา)
    const cardCount = Math.min(12, Math.max(7, Math.floor(this.width / 150)));
    this.tarotCards = [];
    const cardMotifs = ["✦", "☽", "☼", "✧", "♈", "♌", "♎", "♓"];
    for (let i = 0; i < cardCount; i++) {
      this.tarotCards.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.18,
        vy: -Math.random() * 0.28 - 0.08,
        rot: (Math.random() - 0.5) * 0.65,
        vRot: (Math.random() - 0.5) * 0.002,
        scale: Math.random() * 0.4 + 0.55,
        alpha: Math.random() * 0.11 + 0.05,
        motif: cardMotifs[i % cardMotifs.length]
      });
    }

    // 4. ละอองดาวทองคำและฟ้าดาราจักร
    const particleCount = Math.min(60, Math.floor((this.width * this.height) / 24000));
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
    let color = "243, 207, 122"; // Champagne Gold
    if (rand > 0.6) color = "56, 189, 248"; // Celestial Cyan
    else if (rand > 0.84) color = "168, 85, 247"; // Nebula Violet

    return {
      x: fromMouse ? this.mouseX + (Math.random() * 40 - 20) : Math.random() * this.width,
      y: fromMouse ? this.mouseY + (Math.random() * 40 - 20) : Math.random() * this.height,
      radius: Math.random() * 2.2 + 0.6,
      vx: (Math.random() - 0.5) * 0.45,
      vy: -Math.random() * 0.7 - 0.15,
      color,
      alpha: Math.random() * 0.75 + 0.2,
      maxLife: Math.random() * 320 + 160,
      life: 0
    };
  }

  /**
   * 1. วาดวงเวทย์จักรวาล & วงล้อดวงชะตา 12 ราศี (Sacred Magic Circle & Horoscope Wheel)
   */
  drawSacredMandala() {
    const ctx = this.ctx;
    const cx = this.width / 2;
    const cy = Math.min(this.height * 0.46, 450);
    const baseRadius = Math.min(this.width, this.height) * 0.39;

    this.mandalaAngle += 0.0009;
    this.innerRingAngle -= 0.0006;

    // วงแหวนรอบนอก + จักรราศีดวงชะตา 12 ราศี
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(this.mandalaAngle);

    ctx.strokeStyle = "rgba(243, 207, 122, 0.09)";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(0, 0, baseRadius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = "rgba(56, 189, 248, 0.075)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, 0, baseRadius * 0.86, 0, Math.PI * 2);
    ctx.stroke();

    // เส้นแบ่ง 12 ราศี และสัญลักษณ์ดวงชะตา
    ctx.font = "14px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (let i = 0; i < 12; i++) {
      const a = (i * Math.PI * 2) / 12;
      const nextA = ((i + 0.5) * Math.PI * 2) / 12;

      ctx.strokeStyle = "rgba(243, 207, 122, 0.06)";
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * baseRadius * 0.86, Math.sin(a) * baseRadius * 0.86);
      ctx.lineTo(Math.cos(a) * baseRadius, Math.sin(a) * baseRadius);
      ctx.stroke();

      const gx = Math.cos(nextA) * baseRadius * 0.93;
      const gy = Math.sin(nextA) * baseRadius * 0.93;
      ctx.fillStyle = "rgba(243, 207, 122, 0.13)";
      ctx.fillText(this.zodiacGlyphs[i], gx, gy);
    }

    // ดาวแปดแฉกเรขาคณิตวงเวทย์ (Sacred Octagram)
    const points = 8;
    ctx.strokeStyle = "rgba(243, 207, 122, 0.065)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i < points; i++) {
      const a1 = (i * Math.PI * 2) / points;
      const a2 = ((i + 3) * Math.PI * 2) / points;
      ctx.moveTo(Math.cos(a1) * baseRadius * 0.86, Math.sin(a1) * baseRadius * 0.86);
      ctx.lineTo(Math.cos(a2) * baseRadius * 0.86, Math.sin(a2) * baseRadius * 0.86);
    }
    ctx.stroke();
    ctx.restore();

    // วงเวทย์ชั้นในหมุนสวนทาง
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(this.innerRingAngle);

    ctx.strokeStyle = "rgba(168, 85, 247, 0.075)";
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.arc(0, 0, baseRadius * 0.62, 0, Math.PI * 2);
    ctx.stroke();

    // รูปดาวหกแฉก (Hexagram of Destiny)
    ctx.strokeStyle = "rgba(56, 189, 248, 0.065)";
    ctx.beginPath();
    for (let t = 0; t < 2; t++) {
      for (let i = 0; i < 3; i++) {
        const angle = (i * Math.PI * 2) / 3 + (t * Math.PI) / 3;
        const px = Math.cos(angle) * baseRadius * 0.62;
        const py = Math.sin(angle) * baseRadius * 0.62;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
    }
    ctx.stroke();
    ctx.restore();
  }

  /**
   * 2. วาดกลุ่มดาวดวงชะตา (Constellations)
   */
  drawConstellations() {
    const ctx = this.ctx;
    for (const c of this.constellations) {
      c.cx += c.vx;
      c.cy += c.vy;
      if (c.cx < 60 || c.cx > this.width - 60) c.vx *= -1;
      if (c.cy < 60 || c.cy > this.height - 60) c.vy *= -1;

      ctx.save();
      ctx.strokeStyle = "rgba(56, 189, 248, 0.11)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      c.points.forEach((pt, idx) => {
        const px = c.cx + pt.dx;
        const py = c.cy + pt.dy;
        if (idx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();

      c.points.forEach((pt, idx) => {
        const px = c.cx + pt.dx;
        const py = c.cy + pt.dy;
        ctx.fillStyle = idx % 2 === 0 ? "rgba(243, 207, 122, 0.35)" : "rgba(56, 189, 248, 0.38)";
        ctx.beginPath();
        ctx.arc(px, py, 2.3, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();
    }
  }

  /**
   * 3. วาดไพ่ทาโรต์ลวดลายดาราจักรขอบทอง (Floating Astrological Tarot Cards)
   */
  drawFloatingTarotCards() {
    const ctx = this.ctx;
    for (const c of this.tarotCards) {
      c.x += c.vx;
      c.y += c.vy;
      c.rot += c.vRot;

      if (c.y < -120) {
        c.y = this.height + 100;
        c.x = Math.random() * this.width;
      }
      if (c.x < -100) c.x = this.width + 80;
      if (c.x > this.width + 100) c.x = -80;

      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate(c.rot);
      ctx.scale(c.scale, c.scale);

      const cw = 60;
      const ch = 98;

      // ตัวไพ่สีน้ำเงินเข้มดาราจักรพร้อมขอบทอง
      ctx.fillStyle = `rgba(8, 15, 42, ${c.alpha * 1.9})`;
      ctx.strokeStyle = `rgba(243, 207, 122, ${c.alpha * 2.4})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(-cw / 2, -ch / 2, cw, ch, 7);
      } else {
        ctx.rect(-cw / 2, -ch / 2, cw, ch);
      }
      ctx.fill();
      ctx.stroke();

      // กรอบในและวงเวทย์กลางหลังไพ่
      ctx.strokeStyle = `rgba(56, 189, 248, ${c.alpha * 1.5})`;
      ctx.lineWidth = 0.8;
      ctx.strokeRect(-cw / 2 + 5, -ch / 2 + 5, cw - 10, ch - 10);

      ctx.strokeStyle = `rgba(243, 207, 122, ${c.alpha * 1.8})`;
      ctx.beginPath();
      ctx.arc(0, 0, 15, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = `rgba(243, 207, 122, ${c.alpha * 2.5})`;
      ctx.font = "15px serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(c.motif, 0, 0);

      ctx.restore();
    }
  }

  /**
   * วาดดาว 4 แฉกสำหรับดวงดาวสว่าง
   */
  drawFourPointStar(ctx, x, y, r, color, alpha) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = `rgba(${color}, ${alpha})`;
    ctx.beginPath();
    ctx.moveTo(0, -r * 2.2);
    ctx.quadraticCurveTo(0, 0, r * 2.2, 0);
    ctx.quadraticCurveTo(0, 0, 0, r * 2.2);
    ctx.quadraticCurveTo(0, 0, -r * 2.2, 0);
    ctx.quadraticCurveTo(0, 0, 0, -r * 2.2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // 1. วาดวงเวทย์จักรวาลและวงล้อดวงชะตา 12 ราศี
    this.drawSacredMandala();

    // 2. วาดกลุ่มดาวดวงชะตาเชื่อมต่อเส้นแสง
    this.drawConstellations();

    // 3. วาดไพ่ทาโรต์ดาราจักรลอยในฉากหลัง
    this.drawFloatingTarotCards();

    // 4. วาดดวงดาวระยิบระยับ
    for (const s of this.stars) {
      s.twinklePhase += s.twinkleSpeed;
      const currentAlpha = Math.max(0.08, s.alpha + Math.sin(s.twinklePhase) * 0.28);
      if (s.isSparkle) {
        this.drawFourPointStar(this.ctx, s.x, s.y, s.radius, s.color, currentAlpha);
      } else {
        this.ctx.fillStyle = `rgba(${s.color}, ${currentAlpha})`;
        this.ctx.beginPath();
        this.ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }

    // 5. วาดละอองดาราทองคำ-ฟ้า
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

    // 6. วาดคลื่นวงแหวนมนตรา (Shockwaves ตอนหยิบไพ่/เปิดไพ่)
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
    this.shockwaves.push({
      x,
      y,
      radius: 12,
      speed: 5.5,
      alpha: 0.85,
      lineWidth: 2.5,
      color: "243, 207, 122"
    });
    this.shockwaves.push({
      x,
      y,
      radius: 6,
      speed: 3.2,
      alpha: 0.65,
      lineWidth: 1.5,
      color: "56, 189, 248"
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
