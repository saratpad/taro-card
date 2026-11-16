/**
 * เซียมซีทาโรต์ (SiamSi Tarot) - Social Info Card & Direct PDF File Generator
 * 1. วาดภาพ Info Card สำหรับแชร์โซเชียล (มีรูปไพ่ 3 ใบที่จับได้จริง + คำทำนายด้านที่เลือกอย่างย่อ)
 * 2. สร้างข้อความคำทำนายฉบับเต็ม สำหรับวางต่อท้ายเป็นโพสต์หรือคอมเมนต์
 * 3. สร้างและดาวน์โหลดไฟล์ .PDF แท้ลงเครื่องโดยตรง (ทั้งสำหรับลูกค้า และสำหรับแอดมินส่งงานใน Fastwork)
 */

class ShareAndPdfEngine {
  constructor() {
    this.currentReadingData = null;
    this.currentInfoDataUrl = null;
    this.currentInfoBlob = null;
  }

  /**
   * โหลดรูปภาพและคืนค่าเป็น HTMLImageElement (ป้องกัน tainted canvas บน file:// และ CORS mismatch ของ Safari)
   */
  loadImage(src, opts = {}) {
    return new Promise((resolve) => {
      if (!src) return resolve(null);
      const rawStr = String(src);
      const isInline = /^(?:data:|blob:)/i.test(rawStr);
      const isFileProto = typeof window !== "undefined" && window.location && window.location.protocol === "file:";
      if (!isInline && (opts.skipExternalFiles || isFileProto)) {
        return resolve(null);
      }

      let encoded = rawStr;
      if (!isInline) {
        try {
          encoded = encodeURI(decodeURI(encoded));
        } catch (_) {
          encoded = encodeURI(encoded);
        }
      }

      let isSameOrigin = true;
      try {
        const resolved = new URL(encoded, window.location.href);
        isSameOrigin = (
          resolved.origin === window.location.origin ||
          resolved.protocol === "data:" ||
          resolved.protocol === "blob:"
        );
      } catch (_) {}

      const img = new Image();
      if (!isSameOrigin) {
        img.crossOrigin = "anonymous";
      }
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = encoded;
    });
  }

  /**
   * ตัดข้อความให้พอดีกับความกว้างใน Canvas (ป้องกันข้อความล้นขอบ 100%)
   */
  wrapTextLines(ctx, text, maxWidth) {
    if (!text) return [];
    const safeMax = Math.max(120, maxWidth - 16);
    const clean = String(text).replace(/\s+/g, " ").trim();
    let segments = [];
    if (typeof Intl !== "undefined" && Intl.Segmenter) {
      const segmenter = new Intl.Segmenter("th", { granularity: "word" });
      for (const seg of segmenter.segment(clean)) {
        segments.push(seg.segment);
      }
    } else {
      segments = clean.split("");
    }

    const lines = [];
    let currentLine = "";
    for (const word of segments) {
      // หากคำเดี่ยวยาวเกินบรรทัด ให้ตัดแบ่งระดับตัวอักษร
      if (ctx.measureText(word).width > safeMax) {
        for (const ch of word.split("")) {
          const testCharLine = currentLine + ch;
          if (ctx.measureText(testCharLine).width > safeMax && currentLine.length > 0) {
            lines.push(currentLine.trim());
            currentLine = ch.trimStart();
          } else {
            currentLine = testCharLine;
          }
        }
        continue;
      }

      const testLine = currentLine + word;
      if (ctx.measureText(testLine).width > safeMax && currentLine.length > 0) {
        lines.push(currentLine.trim());
        currentLine = word.trimStart();
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine.trim()) {
      lines.push(currentLine.trim());
    }
    return lines;
  }

  /**
   * วาดกรอบสี่เหลี่ยมมุมมน
   */
  drawRoundedRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  /**
   * ชุดวาดพื้นหลังธีมโหราศาสตร์จักรวาลสุดอลังการและขลัง (1240 x 1754)
   * ใช้ร่วมกันทั้ง Info Card (.png) และ PDF หน้าเดียว ทุกศาสตร์
   */
  _createGoldGradient(ctx, x1, y1, x2, y2) {
    const grad = ctx.createLinearGradient(x1, y1, x2, y2);
    grad.addColorStop(0, "#b7791f");
    grad.addColorStop(0.25, "#f3cf7a");
    grad.addColorStop(0.5, "#fff7d6");
    grad.addColorStop(0.75, "#eab308");
    grad.addColorStop(1, "#a16207");
    return grad;
  }

  _drawFourPointStar(ctx, cx, cy, r, fill = "#fff1be", alpha = 0.8) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.moveTo(0, -r);
    ctx.quadraticCurveTo(r * 0.16, -r * 0.16, r, 0);
    ctx.quadraticCurveTo(r * 0.16, r * 0.16, 0, r);
    ctx.quadraticCurveTo(-r * 0.16, r * 0.16, -r, 0);
    ctx.quadraticCurveTo(-r * 0.16, -r * 0.16, 0, -r);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  _drawCornerOrnament(ctx, cx, cy, sx, sy) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(sx, sy);
    ctx.strokeStyle = "rgba(243, 207, 122, 0.88)";
    ctx.lineWidth = 2.6;

    // กรอบมุมโค้งลายกนกเรขาคณิต 2 ชั้น
    ctx.beginPath();
    ctx.moveTo(0, 72);
    ctx.bezierCurveTo(0, 26, 26, 0, 72, 0);
    ctx.stroke();

    ctx.lineWidth = 1.6;
    ctx.strokeStyle = "rgba(254, 243, 199, 0.55)";
    ctx.beginPath();
    ctx.moveTo(12, 54);
    ctx.bezierCurveTo(12, 24, 24, 12, 54, 12);
    ctx.stroke();

    // ยอดพุ่มเพชรประจำมุม
    ctx.fillStyle = "#fff1be";
    ctx.beginPath();
    ctx.moveTo(18, 18);
    ctx.lineTo(30, 8);
    ctx.lineTo(24, 24);
    ctx.lineTo(8, 30);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.arc(8, 8, 4.5, 0, Math.PI * 2);
    ctx.fillStyle = "#f3cf7a";
    ctx.fill();
    ctx.restore();
  }

  _drawSacredMysticalBackdrop(ctx, W, H, theme = {}) {
    const primary = theme.primary || "#f3cf7a";
    const secondary = theme.secondary || "#38bdf8";
    const nebula = theme.nebula || "rgba(168, 85, 247, 0.20)";

    // 1. พื้นหลังราตรีจักรวาลลึกหลายชั้น
    const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
    bgGrad.addColorStop(0, "#02040f");
    bgGrad.addColorStop(0.28, "#081236");
    bgGrad.addColorStop(0.55, "#130b33");
    bgGrad.addColorStop(0.82, "#07102f");
    bgGrad.addColorStop(1, "#020512");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // 2. แสงออร่าและม่านเนบิวลาศักดิ์สิทธิ์
    const drawGlow = (gx, gy, r0, r1, stops) => {
      const g = ctx.createRadialGradient(gx, gy, r0, gx, gy, r1);
      stops.forEach(([pos, col]) => g.addColorStop(pos, col));
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    };

    drawGlow(W / 2, 160, 20, 620, [
      [0, "rgba(243, 207, 122, 0.24)"],
      [0.45, "rgba(56, 189, 248, 0.13)"],
      [1, "rgba(0, 0, 0, 0)"]
    ]);
    drawGlow(W / 2, H * 0.46, 30, 740, [
      [0, nebula],
      [0.5, "rgba(56, 189, 248, 0.10)"],
      [1, "rgba(0, 0, 0, 0)"]
    ]);
    drawGlow(W * 0.18, H * 0.84, 10, 500, [
      [0, "rgba(243, 207, 122, 0.12)"],
      [1, "rgba(0, 0, 0, 0)"]
    ]);
    drawGlow(W * 0.84, H * 0.22, 10, 480, [
      [0, "rgba(168, 85, 247, 0.14)"],
      [1, "rgba(0, 0, 0, 0)"]
    ]);

    // 3. วงล้อจักรราศีและยันต์ดาราศาสตร์กลางภาพ (Zodiac Mandala & Octagram Seal)
    ctx.save();
    const mCx = W / 2;
    const mCy = Math.round(H * 0.48);
    ctx.translate(mCx, mCy);

    // วงแหวนซ้อน 5 ชั้น
    const ringSpecs = [
      { r: 535, lw: 2.0, col: "rgba(243, 207, 122, 0.18)" },
      { r: 486, lw: 1.5, col: "rgba(243, 207, 122, 0.22)" },
      { r: 404, lw: 1.3, col: "rgba(125, 211, 252, 0.16)" },
      { r: 308, lw: 1.4, col: "rgba(243, 207, 122, 0.15)" },
      { r: 196, lw: 1.2, col: "rgba(168, 85, 247, 0.20)" }
    ];
    ringSpecs.forEach(({ r, lw, col }) => {
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.strokeStyle = col;
      ctx.lineWidth = lw;
      ctx.stroke();
    });

    // ขีดสเกล 72 องศา + เส้นรัศมี 12 ช่องราศี + เม็ดดาว 12 ทิศ
    for (let i = 0; i < 72; i++) {
      const ang = (i * Math.PI * 2) / 72;
      const isMajor = i % 6 === 0;
      const rIn = isMajor ? 404 : 472;
      const rOut = 535;
      ctx.beginPath();
      ctx.moveTo(Math.cos(ang) * rIn, Math.sin(ang) * rIn);
      ctx.lineTo(Math.cos(ang) * rOut, Math.sin(ang) * rOut);
      ctx.strokeStyle = isMajor ? "rgba(243, 207, 122, 0.20)" : "rgba(243, 207, 122, 0.10)";
      ctx.lineWidth = isMajor ? 1.5 : 0.9;
      ctx.stroke();

      if (isMajor) {
        const dotR = 511;
        const dx = Math.cos(ang + Math.PI / 12) * dotR;
        const dy = Math.sin(ang + Math.PI / 12) * dotR;
        this._drawFourPointStar(ctx, dx, dy, 10, primary, 0.28);
      }
    }

    // ยันต์แปดทิศศักดิ์สิทธิ์ (Octagram) + หกแฉกด้านใน
    const drawPoly = (sides, radius, rot, strokeCol) => {
      ctx.beginPath();
      for (let i = 0; i <= sides; i++) {
        const a = rot + (i * Math.PI * 2) / sides;
        const px = Math.cos(a) * radius;
        const py = Math.sin(a) * radius;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.strokeStyle = strokeCol;
      ctx.lineWidth = 1.4;
      ctx.stroke();
    };
    drawPoly(4, 398, 0, "rgba(243, 207, 122, 0.15)");
    drawPoly(4, 398, Math.PI / 4, "rgba(243, 207, 122, 0.15)");
    drawPoly(3, 296, -Math.PI / 2, "rgba(125, 211, 252, 0.14)");
    drawPoly(3, 296, Math.PI / 2, "rgba(125, 211, 252, 0.14)");

    // กลีบบัวจักรราศี 12 กลีบรอบศูนย์กลาง
    ctx.strokeStyle = "rgba(243, 207, 122, 0.14)";
    ctx.lineWidth = 1.2;
    for (let i = 0; i < 12; i++) {
      const a = (i * Math.PI * 2) / 12;
      ctx.save();
      ctx.rotate(a);
      ctx.beginPath();
      ctx.moveTo(0, -196);
      ctx.quadraticCurveTo(38, -252, 0, -304);
      ctx.quadraticCurveTo(-38, -252, 0, -196);
      ctx.stroke();
      ctx.restore();
    }
    ctx.restore();

    // 4. ดาวประดับท้องฟ้าและกลุ่มดาวทอง (Deterministic Starfield)
    let seed = 256911;
    const nextRand = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    };
    for (let i = 0; i < 140; i++) {
      const sx = 52 + nextRand() * (W - 104);
      const sy = 52 + nextRand() * (H - 104);
      const sr = 0.9 + nextRand() * 1.9;
      const alpha = 0.16 + nextRand() * 0.45;
      ctx.beginPath();
      ctx.arc(sx, sy, sr, 0, Math.PI * 2);
      ctx.fillStyle = i % 3 === 0 ? "#fff1be" : (i % 3 === 1 ? "#bae6fd" : "#e9d5ff");
      ctx.globalAlpha = alpha;
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // ดาว 4 แฉกทองตามขอบศักดิ์สิทธิ์
    const starCoords = [
      [96, 130, 14], [W - 96, 130, 14], [128, 250, 10], [W - 128, 250, 10],
      [88, H * 0.48, 12], [W - 88, H * 0.48, 12], [94, H - 150, 13], [W - 94, H - 150, 13],
      [210, 96, 9], [W - 210, 96, 9]
    ];
    starCoords.forEach(([x, y, r]) => this._drawFourPointStar(ctx, x, y, r, "#fef3c7", 0.72));

    // 5. กรอบทองคำ 3 ชั้น & ลวดลายประดับมุม 4 ด้าน (Sacred Temple Frame)
    const goldFrameGrad = this._createGoldGradient(ctx, 20, 20, W - 20, H - 20);
    ctx.strokeStyle = goldFrameGrad;
    ctx.lineWidth = 4.5;
    this.drawRoundedRect(ctx, 24, 24, W - 48, H - 48, 28);
    ctx.stroke();

    ctx.strokeStyle = "rgba(243, 207, 122, 0.48)";
    ctx.lineWidth = 1.6;
    this.drawRoundedRect(ctx, 36, 36, W - 72, H - 72, 22);
    ctx.stroke();

    ctx.strokeStyle = secondary === "#22c55e" ? "rgba(52, 211, 153, 0.25)" : "rgba(56, 189, 248, 0.26)";
    ctx.lineWidth = 1.1;
    this.drawRoundedRect(ctx, 45, 45, W - 90, H - 90, 18);
    ctx.stroke();

    // มุมประดับทั้ง 4 มุม
    this._drawCornerOrnament(ctx, 42, 42, 1, 1);
    this._drawCornerOrnament(ctx, W - 42, 42, -1, 1);
    this._drawCornerOrnament(ctx, 42, H - 42, 1, -1);
    this._drawCornerOrnament(ctx, W - 42, H - 42, -1, -1);

    // ดวงจันทร์เสี้ยวทองบนยอดกรอบบน
    ctx.save();
    ctx.translate(W / 2, 48);
    ctx.fillStyle = "#f3cf7a";
    ctx.beginPath();
    ctx.arc(0, 0, 12, 0.25 * Math.PI, 0.75 * Math.PI, true);
    ctx.arc(0, -4, 9.5, 0.78 * Math.PI, 0.22 * Math.PI, false);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  async _drawSacredHeader(ctx, W, opts = {}) {
    const logoUrl = (window.brandThemeEngine && typeof window.brandThemeEngine.getLogoUrl === "function")
      ? window.brandThemeEngine.getLogoUrl()
      : "assets/logo.jpg";
    const logoImg = await this.loadImage(logoUrl, opts);

    // โลโก้ล้อมรัศมีวงแหวนเวทย์กลางบน
    const logoCx = W / 2;
    const logoCy = 112;
    const logoR = 46;

    ctx.save();
    const halo = ctx.createRadialGradient(logoCx, logoCy, 20, logoCx, logoCy, 92);
    halo.addColorStop(0, "rgba(243, 207, 122, 0.45)");
    halo.addColorStop(0.55, "rgba(56, 189, 248, 0.18)");
    halo.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(logoCx, logoCy, 92, 0, Math.PI * 2);
    ctx.fill();

    // วงแหวนประดับ 8 แฉกรอบโลโก้
    ctx.strokeStyle = "rgba(243, 207, 122, 0.78)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(logoCx, logoCy, logoR + 9, 0, Math.PI * 2);
    ctx.stroke();

    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI * 2) / 8;
      this._drawFourPointStar(
        ctx,
        logoCx + Math.cos(a) * (logoR + 14),
        logoCy + Math.sin(a) * (logoR + 14),
        6,
        "#fff1be",
        0.9
      );
    }

    if (logoImg) {
      ctx.beginPath();
      ctx.arc(logoCx, logoCy, logoR, 0, Math.PI * 2);
      ctx.fillStyle = "#f3cf7a";
      ctx.fill();
      ctx.clip();
      ctx.drawImage(logoImg, logoCx - logoR, logoCy - logoR, logoR * 2, logoR * 2);
    } else {
      // Crisp vector celestial crest fallback (never taints Canvas on file://)
      ctx.beginPath();
      ctx.arc(logoCx, logoCy, logoR, 0, Math.PI * 2);
      const crestGrad = ctx.createRadialGradient(logoCx, logoCy - 8, 6, logoCx, logoCy, logoR);
      crestGrad.addColorStop(0, "#2b1b54");
      crestGrad.addColorStop(1, "#0b1230");
      ctx.fillStyle = crestGrad;
      ctx.fill();
      ctx.strokeStyle = "#f3cf7a";
      ctx.lineWidth = 2.4;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(logoCx, logoCy, logoR - 9, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(125, 211, 252, 0.55)";
      ctx.lineWidth = 1.2;
      ctx.stroke();

      this._drawFourPointStar(ctx, logoCx, logoCy - 2, 18, "#f3cf7a", 0.95);
      ctx.fillStyle = "#fff1be";
      ctx.font = "700 11px 'Cinzel', 'Prompt', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("ORACLE", logoCx, logoCy + 28);
    }
    ctx.restore();

    ctx.textAlign = "center";
    ctx.fillStyle = "#f3cf7a";
    ctx.font = "700 22px 'Cinzel', 'Prompt', sans-serif";
    ctx.fillText(opts.eyebrow || "✦ SIAMSI TAROT • SACRED ORACLE ✦", W / 2, 194);

    ctx.fillStyle = "#fff8dc";
    ctx.font = "700 40px 'Prompt', sans-serif";
    ctx.fillText(opts.mainTitle || "คำพยากรณ์ดวงชะตา", W / 2, 242, W - 160);

    // ป้ายหมวดหมู่ / ความแม่นยำ ขอบทองวิจิตร
    if (opts.pillText) {
      const pillW = Math.min(W - 140, 880);
      const pillX = (W - pillW) / 2;
      const pillY = 260;
      const pillH = 46;
      const pillGrad = ctx.createLinearGradient(pillX, pillY, pillX + pillW, pillY);
      pillGrad.addColorStop(0, "rgba(15, 23, 58, 0.92)");
      pillGrad.addColorStop(0.5, "rgba(35, 22, 74, 0.92)");
      pillGrad.addColorStop(1, "rgba(15, 23, 58, 0.92)");
      ctx.fillStyle = pillGrad;
      this.drawRoundedRect(ctx, pillX, pillY, pillW, pillH, 23);
      ctx.fill();
      ctx.strokeStyle = opts.pillBorder || "rgba(243, 207, 122, 0.72)";
      ctx.lineWidth = 1.8;
      ctx.stroke();

      ctx.fillStyle = opts.pillColor || "#fde68a";
      ctx.font = "600 21px 'Prompt', sans-serif";
      ctx.fillText(opts.pillText, W / 2, pillY + 31, pillW - 36);
    }

    if (opts.metaLine) {
      ctx.fillStyle = "#bae6fd";
      ctx.font = "500 18.5px 'Prompt', sans-serif";
      ctx.fillText(opts.metaLine, W / 2, 334, W - 160);
    }
  }

  _drawSacredFooter(ctx, W, H, readingData, tailNote = "SIAMSI TAROT • SACRED ORACLE READING") {
    const yDiv = H - 88;
    ctx.save();
    ctx.strokeStyle = "rgba(243, 207, 122, 0.38)";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(96, yDiv);
    ctx.lineTo(W / 2 - 26, yDiv);
    ctx.moveTo(W / 2 + 26, yDiv);
    ctx.lineTo(W - 96, yDiv);
    ctx.stroke();
    this._drawFourPointStar(ctx, W / 2, yDiv, 9, "#f3cf7a", 0.9);
    ctx.restore();

    const dateStr = (readingData && readingData.dateText) || new Date((readingData && readingData.timestamp) || Date.now()).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
    const codeTag = readingData && readingData.code ? ` • รหัสสิทธิ์ ${readingData.code}` : "";
    ctx.textAlign = "center";
    ctx.fillStyle = "#cbd5e1";
    ctx.font = "500 18px 'Prompt', sans-serif";
    ctx.fillText(`✦ ${tailNote} • วันที่ ${dateStr}${codeTag} ✦`, W / 2, H - 52, W - 140);
  }

  _drawGlassCard(ctx, x, y, w, h, radius = 18, borderCol = "rgba(243, 207, 122, 0.45)", fillCol = "rgba(8, 14, 38, 0.86)") {
    ctx.save();
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 18;
    ctx.fillStyle = fillCol;
    this.drawRoundedRect(ctx, x, y, w, h, radius);
    ctx.fill();
    ctx.restore();

    ctx.strokeStyle = borderCol;
    ctx.lineWidth = 1.8;
    this.drawRoundedRect(ctx, x, y, w, h, radius);
    ctx.stroke();
  }

  /**
   * สร้างรูป Info Card / ใบพยากรณ์หน้าเดียวสำหรับไพ่ทาโรต์ 3 ใบ (1240 x 1754 • Single Page A4 Proportions)
   */
  async generateTarotInfoCard(readingData, options = {}) {
    if (document.fonts && document.fonts.ready) {
      try { await document.fonts.ready; } catch (_) {}
    }

    const canvas = document.createElement("canvas");
    const W = 1240;
    const H = 1754;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");

    this._drawSacredMysticalBackdrop(ctx, W, H, {
      primary: "#f3cf7a",
      secondary: "#38bdf8",
      nebula: "rgba(168, 85, 247, 0.22)"
    });

    const catIcons = { love: "💖", career: "💼", finance: "💰", health: "🌿" };
    const rawCatName = String(readingData.categoryName || "พยากรณ์");
    const hasLoveTag = rawCatName.includes("(");
    const loveSuffix = (readingData.category === "love" && !hasLoveTag)
      ? (readingData.loveStatus === "couple" ? " (คนมีคู่/คนคุย)" : " (คนโสด)")
      : "";
    const spreadText = readingData.spreadFormula ? `  |  ${readingData.spreadFormula}` : "";
    const domainLabel = `${catIcons[readingData.category] || "🔮"} หมวด${rawCatName}${loveSuffix}${spreadText}`;

    const dateStr = readingData.dateText || new Date(readingData.timestamp || Date.now()).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
    const metaLine = [readingData.code ? `รหัสโค้ด: ${readingData.code}` : "", `วันที่พยากรณ์: ${dateStr}`].filter(Boolean).join("   •   ");

    await this._drawSacredHeader(ctx, W, {
      eyebrow: "✦ SIAMSI TAROT • SACRED 3-CARD ORACLE ✦",
      mainTitle: "ใบคำพยากรณ์ไพ่ทาโรต์ 3 ใบ",
      pillText: domainLabel,
      pillBorder: "rgba(243, 207, 122, 0.75)",
      pillColor: "#fff1be",
      metaLine,
      skipExternalFiles: Boolean(options.skipExternalFiles)
    });

    // วาดรูปไพ่ทั้ง 3 ใบ พร้อมรัศมีและลูกศรทอง
    const cards = readingData.cards || [];
    const cardW = 242;
    const cardH = 382;
    const gap = 74;
    const totalCardsW = cards.length * cardW + Math.max(0, cards.length - 1) * gap;
    const startX = (W - totalCardsW) / 2;
    const cardY = 348;

    const loadedImages = await Promise.all(cards.map(c => this.loadImage(c.image, options)));

    for (let i = 0; i < cards.length; i++) {
      const c = cards[i];
      const x = startX + i * (cardW + gap);
      const img = loadedImages[i];

      // ป้ายตำแหน่งเหนือไพ่
      ctx.fillStyle = "rgba(18, 36, 86, 0.92)";
      this.drawRoundedRect(ctx, x + 8, cardY, cardW - 16, 36, 18);
      ctx.fill();
      ctx.strokeStyle = "rgba(243, 207, 122, 0.72)";
      ctx.lineWidth = 1.4;
      ctx.stroke();

      ctx.textAlign = "center";
      ctx.fillStyle = "#fff1be";
      ctx.font = "700 18px 'Prompt', sans-serif";
      const shortPos = (c.positionTitle || `ใบที่ ${i + 1}`).split("—")[0].trim();
      ctx.fillText(`${i + 1}. ${shortPos}`, x + cardW / 2, cardY + 24, cardW - 28);

      const imgBoxY = cardY + 44;

      if (i < cards.length - 1) {
        ctx.fillStyle = "#f3cf7a";
        ctx.font = "700 32px 'Prompt', sans-serif";
        ctx.fillText("➔", x + cardW + gap / 2, imgBoxY + cardH / 2 + 10);
      }

      ctx.save();
      ctx.shadowColor = "rgba(243, 207, 122, 0.35)";
      ctx.shadowBlur = 24;
      ctx.fillStyle = "#08102b";
      this.drawRoundedRect(ctx, x, imgBoxY, cardW, cardH, 16);
      ctx.fill();
      ctx.restore();

      if (img) {
        ctx.save();
        this.drawRoundedRect(ctx, x + 6, imgBoxY + 6, cardW - 12, cardH - 12, 12);
        ctx.clip();
        if (c.isReversed) {
          ctx.translate(x + cardW / 2, imgBoxY + cardH / 2);
          ctx.rotate(Math.PI);
          ctx.drawImage(img, -(cardW - 12) / 2, -(cardH - 12) / 2, cardW - 12, cardH - 12);
        } else {
          ctx.drawImage(img, x + 6, imgBoxY + 6, cardW - 12, cardH - 12);
        }
        ctx.restore();
      } else {
        // Vector sacred tarot card artwork (works offline/file:// without tainting Canvas)
        ctx.save();
        const cardGrad = ctx.createLinearGradient(x, imgBoxY, x + cardW, imgBoxY + cardH);
        cardGrad.addColorStop(0, "#171c47");
        cardGrad.addColorStop(0.5, "#0d1233");
        cardGrad.addColorStop(1, "#1e1342");
        ctx.fillStyle = cardGrad;
        this.drawRoundedRect(ctx, x + 6, imgBoxY + 6, cardW - 12, cardH - 12, 12);
        ctx.fill();

        ctx.strokeStyle = "rgba(243, 207, 122, 0.48)";
        ctx.lineWidth = 1.4;
        this.drawRoundedRect(ctx, x + 16, imgBoxY + 16, cardW - 32, cardH - 32, 8);
        ctx.stroke();

        const cx = x + cardW / 2;
        const cy = imgBoxY + cardH / 2 - 14;
        if (c.isReversed) {
          ctx.translate(cx, cy);
          ctx.rotate(Math.PI);
          ctx.translate(-cx, -cy);
        }

        ctx.beginPath();
        ctx.arc(cx, cy, 62, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(243, 207, 122, 0.55)";
        ctx.lineWidth = 1.8;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(cx, cy, 46, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(125, 211, 252, 0.45)";
        ctx.lineWidth = 1.2;
        ctx.stroke();

        const cid = String(c.id || "");
        const suitSymbol = cid.startsWith("wands") ? "🪄"
          : (cid.startsWith("cups") ? "🏆"
            : (cid.startsWith("swords") ? "⚔️"
              : (cid.startsWith("pentacles") ? "🪙" : "✦")));
        this._drawFourPointStar(ctx, cx, cy - 2, 24, "#f3cf7a", 0.32);
        ctx.font = "700 38px 'Prompt', sans-serif";
        ctx.textAlign = "center";
        ctx.fillStyle = "#fde68a";
        ctx.fillText(suitSymbol, cx, cy + 12);
        ctx.restore();

        ctx.save();
        ctx.textAlign = "center";
        ctx.fillStyle = "#fff1be";
        ctx.font = "700 18px 'Cinzel', 'Prompt', sans-serif";
        const enTitle = String(c.name_en || c.name_th || "TAROT").replace(/\([^)]*\)/g, "").trim().toUpperCase();
        ctx.fillText(enTitle, x + cardW / 2, imgBoxY + cardH - 46, cardW - 42);
        ctx.fillStyle = "#93c5fd";
        ctx.font = "500 13px 'Prompt', sans-serif";
        ctx.fillText("SIAMSI TAROT", x + cardW / 2, imgBoxY + cardH - 25, cardW - 42);
        ctx.restore();
      }

      ctx.strokeStyle = this._createGoldGradient(ctx, x, imgBoxY, x + cardW, imgBoxY + cardH);
      ctx.lineWidth = 3.2;
      this.drawRoundedRect(ctx, x, imgBoxY, cardW, cardH, 16);
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.font = "700 21.5px 'Prompt', sans-serif";
      ctx.fillText(c.name_th || c.name_en, x + cardW / 2, imgBoxY + cardH + 28, cardW + 30);

      ctx.fillStyle = c.isReversed ? "#fca5a5" : "#7dd3fc";
      ctx.font = "600 16.5px 'Prompt', sans-serif";
      ctx.fillText(c.isReversed ? "[ ไพ่กลับหัว ]" : "[ ไพ่ตั้งตรง ]", x + cardW / 2, imgBoxY + cardH + 51);
    }

    // การ์ดคำทำนายอย่างย่อไพ่ทั้ง 3 ใบ (แสดงข้อความคำทำนายครบถ้วน ไม่มีตัดย่อ ...)
    let itemY = 842;
    const stepColors = ["#38bdf8", "#c084fc", "#f3cf7a"];
    const cardBoxH = 136;

    const cleanTarotBriefText = (rawText) => {
      const s = String(rawText || "").replace(/\s+/g, " ").trim();
      if (!s) return "";
      return s
        .replace(/ในตำแหน่ง\s*"[^"]*"\s*ไพ่[\s\S]*$/u, "")
        .replace(/\s*โดยแนวทางสำคัญ[\s\S]*$/u, "")
        .trim() || s;
    };

    for (let i = 0; i < cards.length; i++) {
      const c = cards[i];
      const shortPos = (c.positionTitle || `ตำแหน่งที่ ${i + 1}`).split("—")[0].trim();
      const rawCardName = String(c.name_th || c.name_en || "").trim();
      const displayCardName = rawCardName.startsWith("ไพ่")
        ? rawCardName
        : (/^[A-Za-z]/.test(rawCardName) ? `ไพ่ ${rawCardName}` : `ไพ่${rawCardName}`);

      this._drawGlassCard(ctx, 70, itemY, W - 140, cardBoxH, 16, "rgba(243, 207, 122, 0.42)", "rgba(8, 15, 42, 0.88)");

      ctx.fillStyle = stepColors[i % stepColors.length];
      this.drawRoundedRect(ctx, 70, itemY, 10, cardBoxH, 5);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(114, itemY + 34, 19, 0, Math.PI * 2);
      ctx.fillStyle = stepColors[i % stepColors.length];
      ctx.fill();
      ctx.textAlign = "center";
      ctx.fillStyle = "#040717";
      ctx.font = "700 19px 'Prompt', sans-serif";
      ctx.fillText(String(i + 1), 114, itemY + 41);

      ctx.textAlign = "left";
      ctx.fillStyle = "#fff1be";
      ctx.font = "700 21px 'Prompt', sans-serif";
      ctx.fillText(`${shortPos}  •  ${displayCardName} ${c.isReversed ? "(กลับหัว)" : "(ตั้งตรง)"}`, 148, itemY + 40, W - 240);

      const meanSrc = cleanTarotBriefText(c.shortMeaning || c.domainMeaning || c.advice || "");
      let fontSize = 18.5;
      ctx.font = `400 ${fontSize}px 'Prompt', sans-serif`;
      let lines = this.wrapTextLines(ctx, meanSrc, W - 230);
      if (lines.length > 3) {
        fontSize = 16.5;
        ctx.font = `400 ${fontSize}px 'Prompt', sans-serif`;
        lines = this.wrapTextLines(ctx, meanSrc, W - 230);
      }
      ctx.fillStyle = "#f1f5f9";
      const lineStep = lines.length >= 3 ? 23.5 : 27;
      lines.slice(0, 3).forEach((line, lIdx) => {
        ctx.fillText(line, 148, itemY + 71 + lIdx * lineStep);
      });

      itemY += cardBoxH + 10;
    }

    // กล่องบทสรุป & คำแนะนำสำคัญ + QR Code สแกนดูคำทำนายฉบับเต็ม
    const verdictY = 1284;
    const verdictH = 368;
    const vGrad = ctx.createLinearGradient(70, verdictY, W - 70, verdictY + verdictH);
    vGrad.addColorStop(0, "rgba(18, 28, 72, 0.94)");
    vGrad.addColorStop(1, "rgba(38, 18, 76, 0.94)");
    this._drawGlassCard(ctx, 70, verdictY, W - 140, verdictH, 20, "#f3cf7a", vGrad);

    const leftX = 96;
    const leftW = 810;

    // กรอบ QR Code ทางขวาสำหรับสแกนอ่านคำทำนายเต็มบนเว็บ
    const shareUrl = this.buildShareableReadingUrl(readingData);
    const qrPanelX = W - 70 - 224;
    const qrPanelW = 200;
    const qrBoxSize = 180;
    const qrBoxX = qrPanelX + Math.floor((qrPanelW - qrBoxSize) / 2);
    const qrBoxY = verdictY + 34;

    this._drawGlassCard(ctx, qrPanelX - 4, verdictY + 20, qrPanelW + 8, verdictH - 40, 16, "rgba(243, 207, 122, 0.52)", "rgba(8, 12, 34, 0.72)");
    if (typeof window !== "undefined" && window.MiniQR && typeof window.MiniQR.drawToCanvas === "function") {
      window.MiniQR.drawToCanvas(ctx, shareUrl, qrBoxX, qrBoxY, qrBoxSize, {
        quiet: 3,
        background: "#ffffff",
        foreground: "#091028",
        radius: 12
      });
    }
    ctx.textAlign = "center";
    ctx.fillStyle = "#fde68a";
    ctx.font = "700 17px 'Prompt', sans-serif";
    ctx.fillText("📱 สแกนดูคำทำนายเต็ม", qrBoxX + qrBoxSize / 2, qrBoxY + qrBoxSize + 30, qrPanelW - 10);
    ctx.fillStyle = "#bae6fd";
    ctx.font = "400 14px 'Prompt', sans-serif";
    ctx.fillText("อ่านเจาะลึกครบ 3 ใบ & ถาม Gemini", qrBoxX + qrBoxSize / 2, qrBoxY + qrBoxSize + 54, qrPanelW - 10);
    ctx.fillText("สแกนเปิดได้ตลอด 24 ชม.", qrBoxX + qrBoxSize / 2, qrBoxY + qrBoxSize + 75, qrPanelW - 10);

    // เนื้อหาด้านซ้าย: สรุปใจความ + คำแนะนำ + ข้อควรระวัง (จัดระยะให้อ่านครบทุกคำ ไม่มี ...)
    ctx.textAlign = "left";
    ctx.fillStyle = "#fff1be";
    ctx.font = "700 24px 'Prompt', sans-serif";
    ctx.fillText(`👑 สรุปดวงชะตา: ${readingData.verdictBadge || ""}`, leftX, verdictY + 42, leftW);

    const rawVerdictStr = String(readingData.verdictBrief || readingData.verdictPlain || "").replace(/\s+/g, " ").trim();
    const rawBriefVerdict = rawVerdictStr
      .replace(/^จากหน้าไพ่[\s\S]*?\)\)\s*/u, "")
      .replace(/^จากหน้าไพ่[^()]*\([^)]*\)\s*/u, "")
      .trim();
    const coreSummarySrc = rawBriefVerdict || rawVerdictStr;

    let curVerdictY = verdictY + 75;
    ctx.fillStyle = "#f8fafc";
    ctx.font = "400 18.5px 'Prompt', sans-serif";
    let sumLines = this.wrapTextLines(ctx, coreSummarySrc, leftW);
    if (sumLines.length > 3) {
      ctx.font = "400 17px 'Prompt', sans-serif";
      sumLines = this.wrapTextLines(ctx, coreSummarySrc, leftW);
    }
    const maxSumLines = Math.min(4, sumLines.length);
    for (let li = 0; li < maxSumLines; li++) {
      ctx.fillText(sumLines[li], leftX, curVerdictY);
      curVerdictY += 24;
    }

    curVerdictY += 10;
    const rawDoSrc = String(readingData.doBrief || readingData.doAction || "")
      .replace(/\s*โดยแนวทางสำคัญในการก้าวต่อไปคือ[\s\S]*$/u, "")
      .replace(/\s+/g, " ")
      .trim();
    ctx.fillStyle = "#86efac";
    ctx.font = "600 18px 'Prompt', sans-serif";
    let doLines = this.wrapTextLines(ctx, `✅ คำแนะนำ: ${rawDoSrc}`, leftW);
    if (doLines.length > 3) {
      ctx.font = "600 16.5px 'Prompt', sans-serif";
      doLines = this.wrapTextLines(ctx, `✅ คำแนะนำ: ${rawDoSrc}`, leftW);
    }
    const maxDoLines = Math.min(3, doLines.length);
    for (let li = 0; li < maxDoLines; li++) {
      ctx.fillText(doLines[li], li === 0 ? leftX : leftX + 26, curVerdictY);
      curVerdictY += 23.5;
    }

    curVerdictY += 8;
    const rawDontSrc = String(readingData.dontAction || "").replace(/\s+/g, " ").trim();
    if (rawDontSrc) {
      ctx.fillStyle = "#fca5a5";
      ctx.font = "600 18px 'Prompt', sans-serif";
      let dontLines = this.wrapTextLines(ctx, `⚠️ ควรระวัง: ${rawDontSrc}`, leftW);
      if (dontLines.length > 2) {
        ctx.font = "600 16.5px 'Prompt', sans-serif";
        dontLines = this.wrapTextLines(ctx, `⚠️ ควรระวัง: ${rawDontSrc}`, leftW);
      }
      const maxDontLines = Math.min(3, dontLines.length);
      for (let li = 0; li < maxDontLines; li++) {
        if (curVerdictY <= verdictY + verdictH - 18) {
          ctx.fillText(dontLines[li], li === 0 ? leftX : leftX + 26, curVerdictY);
          curVerdictY += 23.5;
        }
      }
    }

    this._drawSacredFooter(ctx, W, H, readingData, "SIAMSI TAROT • ใบพยากรณ์ไพ่ทาโรต์ฉบับสมบูรณ์");

    return this._finalizeCanvasAsset(canvas, readingData, options.skipExternalFiles
      ? null
      : () => this.generateTarotInfoCard(readingData, { skipExternalFiles: true }));
  }

  _getCleanSiamsiAspectText(item, readingData = null) {
    if (!item) return "";
    let raw = item.richText ? String(item.richText) : "";
    const stripPoemEcho = (text) => {
      let clean = String(text || "")
        .replace(/^(?:การงานตามใบเซียมซี|โชคลาภตามบทเซียมซี|เรื่องความรักตามบทเซียมซี|เรื่องสุขภาพตามบทเซียมซี|เรื่องการศึกษาตามบทเซียมซี|เรื่องครอบครัวและเคหสถาน|ภาพรวม[^:]*|คำทำนายภาพรวม)\s*:\s*"[^"]*"\s*/u, "")
        .replace(/\n{2,}/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      if (readingData && Array.isArray(readingData.poemLines) && readingData.poemLines.length > 0) {
        const fullPoem = readingData.poemLines.join(" ").replace(/\s+/g, " ").trim();
        const titlePrefix = readingData.signTitle ? `${String(readingData.signTitle).trim()} ` : "";
        if (fullPoem) {
          clean = clean.replace(titlePrefix + fullPoem, "").replace(fullPoem, "").replace(/\s+—\s+คำแนะนำ/g, " — คำแนะนำ").trim();
        }
      }
      return clean.replace(/^—\s*/, "").trim();
    };

    if (raw) {
      return stripPoemEcho(raw);
    }
    const sum = String(item.text || "").trim();
    const det = stripPoemEcho(item.detail || "");
    if (det && det !== sum) {
      return sum && !det.includes(sum.slice(0, Math.min(28, sum.length)))
        ? `${sum} — ${det}`
        : det;
    }
    return det || sum;
  }

  /**
   * สร้างรูป Info Card หน้าเดียวสำหรับเซียมซี (1240 x 1754 • ธีมโหราศาสตร์ขลังอลังการ)
   */
  async generateSiamsiInfoCard(readingData, options = {}) {
    if (document.fonts && document.fonts.ready) {
      try { await document.fonts.ready; } catch (_) {}
    }

    const canvas = document.createElement("canvas");
    const W = 1240;
    const H = 1754;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");

    this._drawSacredMysticalBackdrop(ctx, W, H, {
      primary: "#f3cf7a",
      secondary: "#fb7185",
      nebula: "rgba(190, 24, 93, 0.18)"
    });

    const dateStr = readingData.dateText || new Date(readingData.timestamp || Date.now()).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
    const metaLine = [readingData.code ? `รหัสโค้ด: ${readingData.code}` : "", `วันที่เสี่ยงเซียมซี: ${dateStr}`].filter(Boolean).join("   •   ");

    await this._drawSacredHeader(ctx, W, {
      eyebrow: "✦ SIAMSI TAROT • SACRED SIAMSI ORACLE ✦",
      mainTitle: "ใบคำพยากรณ์เซียมซีศักดิ์สิทธิ์",
      pillText: `🎋 ${readingData.deckName || "ตำราเซียมซีศักดิ์สิทธิ์"}`,
      pillBorder: "rgba(243, 207, 122, 0.78)",
      pillColor: "#fff1be",
      metaLine,
      skipExternalFiles: Boolean(options.skipExternalFiles)
    });

    // ป้ายเหรียญตราเลขเซียมซี & ระดับดวง
    const numCardY = 342;
    const numCardH = 118;
    const plaqueGrad = ctx.createLinearGradient(70, numCardY, W - 70, numCardY + numCardH);
    plaqueGrad.addColorStop(0, "rgba(69, 10, 26, 0.88)");
    plaqueGrad.addColorStop(0.5, "rgba(28, 16, 68, 0.92)");
    plaqueGrad.addColorStop(1, "rgba(69, 10, 26, 0.88)");
    this._drawGlassCard(ctx, 180, numCardY, W - 360, numCardH, 24, this._createGoldGradient(ctx, 180, numCardY, W - 180, numCardY + numCardH), plaqueGrad);

    ctx.textAlign = "center";
    ctx.fillStyle = "#fff1be";
    ctx.font = "700 48px 'Prompt', sans-serif";
    ctx.fillText(`เซียมซีเบอร์ ${readingData.signNumber}`, W / 2, numCardY + 62);

    ctx.fillStyle = "#fde68a";
    ctx.font = "600 24px 'Prompt', sans-serif";
    ctx.fillText(`${readingData.signTitle || ""} ${readingData.fortuneLevel ? `(${readingData.fortuneLevel})` : ""}`, W / 2, numCardY + 101, W - 400);

    // แผ่นจารึกบทกลอนพยากรณ์ + หัวใจคำทำนาย
    const poemY = 472;
    const poemH = 216;
    this._drawGlassCard(ctx, 70, poemY, W - 140, poemH, 20, "rgba(243, 207, 122, 0.52)", "rgba(8, 15, 42, 0.88)");

    ctx.fillStyle = "#f3cf7a";
    ctx.font = "700 19px 'Prompt', sans-serif";
    ctx.fillText("✦ จารึกคำกลอนพยากรณ์ ✦", W / 2, poemY + 32);

    ctx.fillStyle = "#fff8dc";
    ctx.font = "500 22px 'Prompt', sans-serif";
    const poemLines = readingData.poemLines || [];
    poemLines.slice(0, 4).forEach((line, idx) => {
      ctx.fillText(line, W / 2, poemY + 66 + idx * 31, W - 190);
    });

    if (readingData.oneLine) {
      ctx.fillStyle = "rgba(243, 207, 122, 0.2)";
      ctx.fillRect(110, poemY + 174, W - 220, 1);
      ctx.fillStyle = "#7dd3fc";
      ctx.font = "600 18.5px 'Prompt', sans-serif";
      const essence = this.wrapTextLines(ctx, `💡 แก่นคำทำนาย: "${readingData.oneLine}"`, W - 200)[0] || "";
      ctx.fillText(essence, W / 2, poemY + 202, W - 200);
    }

    // คำพยากรณ์รายด้าน (ครบ 6 ด้านในตาราง 2 คอลัมน์ + ภาพรวมและแนวทางปฏิบัติเต็มกว้างด้านล่าง)
    ctx.textAlign = "left";
    ctx.fillStyle = "#f3cf7a";
    ctx.font = "700 23px 'Prompt', sans-serif";
    ctx.fillText("✦ คำพยากรณ์เจาะลึกรายด้าน & แนวทางปฏิบัติ (ฉบับสมบูรณ์ใน 1 หน้า)", 74, 720);

    const allAspects = Array.isArray(readingData.aspectsSummary) ? readingData.aspectsSummary : [];
    const generalItem = allAspects.find(a => a.key === "general" || /ภาพรวม/.test(String(a.label || "")));
    const gridAspects = allAspects.filter(a => a !== generalItem).slice(0, 6);

    const gridStartY = 738;
    const gapX = 20;
    const gapY = 12;
    const colW = Math.floor((W - 140 - gapX) / 2);
    const boxH = 208;
    const accentColors = ["#38bdf8", "#f3cf7a", "#fb7185", "#34d399", "#c084fc", "#fbbf24"];

    gridAspects.forEach((item, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const ax = 70 + col * (colW + gapX);
      const ay = gridStartY + row * (boxH + gapY);
      const accent = accentColors[idx % accentColors.length];

      this._drawGlassCard(ctx, ax, ay, colW, boxH, 16, "rgba(243, 207, 122, 0.36)", "rgba(10, 18, 48, 0.89)");

      ctx.fillStyle = accent;
      this.drawRoundedRect(ctx, ax, ay, 8, boxH, 4);
      ctx.fill();

      ctx.textAlign = "left";
      ctx.fillStyle = idx % 2 === 0 ? "#7dd3fc" : "#fde68a";
      ctx.font = "700 21.5px 'Prompt', sans-serif";
      ctx.fillText(String(item.label || item.title || "คำพยากรณ์รายด้าน"), ax + 24, ay + 34, colW - 44);

      const richBody = this._getCleanSiamsiAspectText(item, readingData);
      const isConcise = richBody.length <= 210;
      const bodyFontSize = isConcise ? 19 : 17.5;
      const lineStep = isConcise ? 26.5 : 23;
      const maxLines = isConcise ? 5 : 6;

      ctx.fillStyle = "#f1f5f9";
      ctx.font = `400 ${bodyFontSize}px 'Prompt', sans-serif`;
      const allLines = this.wrapTextLines(ctx, richBody, colW - 46);
      const lines = allLines.slice(0, maxLines);
      if (allLines.length > maxLines && lines[maxLines - 1]) {
        lines[maxLines - 1] = lines[maxLines - 1].slice(0, Math.max(8, lines[maxLines - 1].length - 1)) + "…";
      }
      lines.forEach((l, li) => ctx.fillText(l, ax + 24, ay + 66 + li * lineStep));
    });

    // กล่องภาพรวมคำทำนาย & คำแนะนำประจำใบเต็มความกว้างด้านล่าง
    const ovY = gridStartY + 3 * (boxH + gapY);
    const ovH = 250;
    const ovGrad = ctx.createLinearGradient(70, ovY, W - 70, ovY + ovH);
    ovGrad.addColorStop(0, "rgba(18, 28, 72, 0.92)");
    ovGrad.addColorStop(1, "rgba(38, 18, 66, 0.92)");
    this._drawGlassCard(ctx, 70, ovY, W - 140, ovH, 18, "#f3cf7a", ovGrad);

    ctx.fillStyle = "#f3cf7a";
    this.drawRoundedRect(ctx, 70, ovY, 9, ovH, 4.5);
    ctx.fill();

    ctx.textAlign = "left";
    ctx.fillStyle = "#fff1be";
    ctx.font = "700 22px 'Prompt', sans-serif";
    ctx.fillText("🔮 ภาพรวมและสรุปคำทำนาย พร้อมแนวทางปฏิบัติ", 96, ovY + 36, W - 200);

    const overviewParts = [];
    if (generalItem) {
      const genText = this._getCleanSiamsiAspectText(generalItem, readingData);
      if (genText) overviewParts.push(genText);
    }
    if (readingData.supplementText) {
      overviewParts.push(`ตำราเสริม (${readingData.supplementTitle || "เพิ่มเติม"}): ${readingData.supplementText}`);
    }
    const finalOverviewText = overviewParts.join(" • ") || `เกณฑ์ดวงชะตา "${readingData.fortuneLevel || "ปานกลาง"}" — ${readingData.oneLine || ""}`;

    const isOverviewConcise = finalOverviewText.length <= 360;
    ctx.fillStyle = "#f8fafc";
    ctx.font = `400 ${isOverviewConcise ? 20 : 18}px 'Prompt', sans-serif`;
    const ovWrapped = this.wrapTextLines(ctx, finalOverviewText, W - 200);
    const ovMax = isOverviewConcise ? 6 : 8;
    const ovStep = isOverviewConcise ? 28 : 22.5;
    const ovLines = ovWrapped.slice(0, ovMax);
    if (ovWrapped.length > ovMax && ovLines[ovMax - 1]) {
      ovLines[ovMax - 1] = ovLines[ovMax - 1].slice(0, Math.max(10, ovLines[ovMax - 1].length - 1)) + "…";
    }
    ovLines.forEach((l, i) => ctx.fillText(l, 96, ovY + 70 + i * ovStep));

    this._drawSacredFooter(ctx, W, H, readingData, "SIAMSI TAROT • ใบพยากรณ์เซียมซีศักดิ์สิทธิ์");

    return this._finalizeCanvasAsset(canvas, readingData, options.skipExternalFiles
      ? null
      : () => this.generateSiamsiInfoCard(readingData, { skipExternalFiles: true }));
  }

  /**
   * โหลดภาพแบบ Optional สำหรับ HUD ลายมือ
   */
  _loadOptionalImage(src, opts = {}) {
    if (!src) return Promise.resolve(null);
    return this.loadImage(src, opts).catch(() => null);
  }

  _drawContainImage(ctx, img, x, y, w, h) {
    if (!img || !img.width || !img.height) return;
    const scale = Math.min(w / img.width, h / img.height);
    const dw = img.width * scale;
    const dh = img.height * scale;
    const dx = x + (w - dw) / 2;
    const dy = y + (h - dh) / 2;
    ctx.drawImage(img, dx, dy, dw, dh);
  }

  /**
   * สร้างรูป Info Card / คัมภีร์หน้าเดียวสำหรับสแกนลายมือ 2 มือ (1240 x 1754 • ธีมหัตถศาสตร์ขลังอลังการ)
   */
  async generatePalmInfoCard(readingData, options = {}) {
    if (document.fonts && document.fonts.ready) {
      try { await document.fonts.ready; } catch (_) {}
    }

    const W = 1240;
    const H = 1754;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");

    this._drawSacredMysticalBackdrop(ctx, W, H, {
      primary: "#f3cf7a",
      secondary: "#22c55e",
      nebula: "rgba(56, 189, 248, 0.18)"
    });

    const confVal = Number(readingData.confidence || 92).toFixed(1);
    const dateStr = readingData.dateText || new Date(readingData.timestamp || Date.now()).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
    const metaLine = [readingData.code ? `รหัสโค้ด: ${readingData.code}` : "", `วันที่วิเคราะห์ลายมือ: ${dateStr}`].filter(Boolean).join("   •   ");

    await this._drawSacredHeader(ctx, W, {
      eyebrow: "✦ SIAMSI TAROT • SACRED PALMISTRY ORACLE ✦",
      mainTitle: "ใบคำพยากรณ์หัตถศาสตร์ 2 มือ (ซ้าย + ขวา)",
      pillText: `🎯 ความแม่นยำการตรวจจับเส้นลายมือและเนินทั้ง 7 : ${confVal}%`,
      pillBorder: "rgba(52, 211, 153, 0.72)",
      pillColor: "#86efac",
      metaLine,
      skipExternalFiles: Boolean(options.skipExternalFiles)
    });

    // กรอบภาพสแกนฝ่ามือซ้าย + ขวาคู่กันอย่างสง่างาม
    const leftImg = await this._loadOptionalImage(readingData.leftHudDataUrl, options);
    const rightImg = await this._loadOptionalImage(readingData.rightHudDataUrl, options);
    const cardY = 346;
    const cardW = 532;
    const cardH = 338;

    const drawHandBox = (x, label, subTag, img, accentCol) => {
      this._drawGlassCard(ctx, x, cardY, cardW, cardH, 20, "rgba(243, 207, 122, 0.56)", "rgba(6, 11, 28, 0.90)");

      // กรอบด้านในสำหรับรูปฝ่ามือ
      ctx.fillStyle = "#020617";
      this.drawRoundedRect(ctx, x + 16, cardY + 12, cardW - 32, cardH - 64, 14);
      ctx.fill();
      ctx.strokeStyle = "rgba(125, 211, 252, 0.25)";
      ctx.lineWidth = 1.2;
      ctx.stroke();

      if (img) {
        this._drawContainImage(ctx, img, x + 18, cardY + 14, cardW - 36, cardH - 68);
      } else {
        ctx.fillStyle = "#94a3b8";
        ctx.font = "500 20px 'Prompt', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("บันทึกผลสแกนหัตถศาสตร์แล้ว", x + cardW / 2, cardY + cardH / 2 - 10);
      }

      ctx.textAlign = "center";
      ctx.fillStyle = accentCol;
      ctx.font = "700 21px 'Prompt', sans-serif";
      ctx.fillText(`${label} • ${subTag}`, x + cardW / 2, cardY + cardH - 18);
    };

    drawHandBox(70, "✋ มือซ้าย", "พื้นดวงเดิม", leftImg, "#7dd3fc");
    drawHandBox(W - 70 - cardW, "🤚 มือขวา", "ปัจจุบันและอนาคต", rightImg, "#fde68a");

    // กล่องบทสรุปภาพรวมทั้ง 2 มือ
    const vY = cardY + cardH + 14;
    const vH = 96;
    const vGrad = ctx.createLinearGradient(70, vY, W - 70, vY + vH);
    vGrad.addColorStop(0, "rgba(24, 34, 78, 0.90)");
    vGrad.addColorStop(0.5, "rgba(42, 22, 74, 0.90)");
    vGrad.addColorStop(1, "rgba(24, 34, 78, 0.90)");
    this._drawGlassCard(ctx, 70, vY, W - 140, vH, 18, "#f3cf7a", vGrad);

    ctx.textAlign = "center";
    ctx.fillStyle = "#fff1be";
    ctx.font = "600 21px 'Prompt', sans-serif";
    const vAll = this.wrapTextLines(ctx, readingData.summaryVerdict || "วิเคราะห์ครบ 2 ฝ่ามือสำเร็จ", W - 196);
    const vLines = vAll.slice(0, 2);
    if (vAll.length > 2 && vLines[1]) {
      vLines[1] = vLines[1].slice(0, Math.max(10, vLines[1].length - 1)) + "…";
    }
    const vStartY = vLines.length === 1 ? vY + 56 : vY + 38;
    vLines.forEach((line, idx) => {
      ctx.fillText(line, W / 2, vStartY + idx * 30);
    });

    // คำพยากรณ์ 5 ด้านสำคัญ (จัดสรรลงตัวใน 1 หน้าเดียว: 4 ด้านแรกเทียบซ้าย-ขวา ส่วนคำแนะนำดวงชะตาขยายเต็มกล่องโดยไม่แบ่งมือ)
    if (typeof window !== "undefined" && window.PalmReadingUtils && typeof window.PalmReadingUtils.normalizePalmReading === "function") {
      window.PalmReadingUtils.normalizePalmReading(readingData);
    } else if (typeof window !== "undefined" && window.PalmScannerEngine && typeof window.PalmScannerEngine.normalizePalmReading === "function") {
      window.PalmScannerEngine.normalizePalmReading(readingData);
    }
    const aspects = readingData.aspects || {};
    const orderedKeys = ["life", "intellect", "love", "wealth", "guidance"];
    let curY = vY + vH + 14;
    const gap = 8;

    orderedKeys.forEach((key, idx) => {
      const asp = aspects[key];
      if (!asp) return;

      const isGuidance = key === "guidance" || String(asp.title || "").trim() === "คำแนะนำดวงชะตา";
      const curBoxH = isGuidance ? 248 : 140;

      this._drawGlassCard(
        ctx,
        70,
        curY,
        W - 140,
        curBoxH,
        16,
        isGuidance ? "rgba(110, 231, 183, 0.45)" : "rgba(243, 207, 122, 0.38)",
        "rgba(8, 15, 42, 0.88)"
      );

      ctx.fillStyle = isGuidance ? "#34d399" : (idx % 2 === 0 ? "#f3cf7a" : "#38bdf8");
      this.drawRoundedRect(ctx, 70, curY, 9, curBoxH, 4.5);
      ctx.fill();

      ctx.textAlign = "left";
      ctx.fillStyle = "#fde68a";
      ctx.font = "700 22px 'Prompt', sans-serif";
      ctx.fillText(`${asp.icon || "✦"} ${asp.title || ""}`, 96, curY + 29, W - 460);

      if (asp.grade) {
        ctx.textAlign = "right";
        ctx.fillStyle = "#86efac";
        ctx.font = "600 18px 'Prompt', sans-serif";
        ctx.fillText(asp.grade, W - 94, curY + 29, 340);
      }

      ctx.textAlign = "left";
      ctx.fillStyle = "#f1f5f9";
      ctx.font = isGuidance ? "400 16.5px 'Prompt', sans-serif" : "400 17.5px 'Prompt', sans-serif";
      const cleanBody = String(asp.text || "").replace(/\s*\(\s*\)/g, "").trim();
      const allWrapped = this.wrapTextLines(ctx, cleanBody, W - 196);
      const hasNote = !isGuidance && Boolean(asp.leftNote || asp.rightNote);
      const maxBody = isGuidance ? 9 : (hasNote ? 2 : 3);
      const lineStep = isGuidance ? 21.5 : 22;
      const bodyLines = allWrapped.slice(0, maxBody);
      if (allWrapped.length > maxBody && bodyLines[maxBody - 1]) {
        bodyLines[maxBody - 1] = bodyLines[maxBody - 1].slice(0, Math.max(10, bodyLines[maxBody - 1].length - 1)) + "…";
      }
      bodyLines.forEach((ln, li) => {
        ctx.fillText(ln, 96, curY + 56 + li * lineStep);
      });

      if (hasNote) {
        const lShort = String(asp.leftNote || "").replace(/^(?:(?:✋|🤚)\s*)?มือซ้าย\s*(?:\([^)]*\))?\s*:\s*/i, "").trim();
        const rShort = String(asp.rightNote || "").replace(/^(?:(?:✋|🤚)\s*)?มือขวา\s*(?:\([^)]*\))?\s*:\s*/i, "").trim();
        if (lShort) {
          ctx.fillStyle = "#7dd3fc";
          ctx.font = "500 15.5px 'Prompt', sans-serif";
          const lTxt = `✋ มือซ้าย: ${lShort}`;
          const lLine = this.wrapTextLines(ctx, lTxt, W - 200)[0] || lTxt;
          ctx.fillText(lLine, 96, curY + 107, W - 200);
        }
        if (rShort) {
          ctx.fillStyle = "#fde68a";
          ctx.font = "500 15.5px 'Prompt', sans-serif";
          const rTxt = `🤚 มือขวา: ${rShort}`;
          const rLine = this.wrapTextLines(ctx, rTxt, W - 200)[0] || rTxt;
          ctx.fillText(rLine, 96, curY + 129, W - 200);
        }
      }

      curY += curBoxH + gap;
    });

    this._drawSacredFooter(ctx, W, H, readingData, "SIAMSI TAROT • คัมภีร์วิเคราะห์หัตถศาสตร์เฉพาะบุคคล");

    return this._finalizeCanvasAsset(canvas, readingData, options.skipExternalFiles
      ? null
      : () => this.generatePalmInfoCard(readingData, { skipExternalFiles: true }));
  }

  buildShareableReadingUrl(readingData) {
    const isFileOrNull = typeof window === "undefined" || !window.location || window.location.protocol === "file:" || window.location.origin === "null" || !window.location.origin;
    const baseUrl = isFileOrNull
      ? "https://taro-card-smoky.vercel.app/"
      : (window.location.origin + window.location.pathname);
    if (!readingData) return baseUrl;

    const params = new URLSearchParams();
    params.set("share", "1");

    if (readingData.mode === "palm") {
      params.set("palm", "1");
      params.set("hand", String(readingData.hand || "both"));
      params.set("conf", String(readingData.confidence || "92"));
      if (readingData.code) params.set("code", readingData.code);
      const shortSum = String(readingData.summaryVerdict || "").slice(0, 180);
      if (shortSum) params.set("sum", shortSum);
      return `${baseUrl}?${params.toString()}`;
    }

    if (readingData.mode === "siamsi") {
      params.set("siamsi", String(readingData.signNumber || readingData.stickNum || "1"));
      if (readingData.deck) params.set("deck", readingData.deck);
      return `${baseUrl}?${params.toString()}`;
    }

    const cardsStr = (readingData.cards || [])
      .map(c => `${c.id}:${c.isReversed ? 1 : 0}`)
      .filter(Boolean)
      .join(",");
    if (cardsStr) params.set("cards", cardsStr);
    if (readingData.category) params.set("cat", readingData.category);
    if (readingData.loveStatus) params.set("loveStatus", readingData.loveStatus);
    return `${baseUrl}?${params.toString()}`;
  }

  /**
   * สร้างข้อความคำทำนายฉบับเต็ม สำหรับโพสต์โซเชียลพร้อมรูป Info Card (ไม่แชร์เป็นแค่ลิงก์เว็บแอป)
   */
  buildFullSocialCaption(readingData) {
    if (!readingData) return "";

    if (readingData.mode === "palm") {
      if (typeof window !== "undefined" && window.PalmReadingUtils && typeof window.PalmReadingUtils.normalizePalmReading === "function") {
        window.PalmReadingUtils.normalizePalmReading(readingData);
      } else if (typeof window !== "undefined" && window.PalmScannerEngine && typeof window.PalmScannerEngine.normalizePalmReading === "function") {
        window.PalmScannerEngine.normalizePalmReading(readingData);
      }
      const aspects = readingData.aspects || {};
      const order = ["life", "intellect", "love", "wealth", "guidance"];
      const aspectText = order
        .map(k => ({ k, a: aspects[k] }))
        .filter(item => Boolean(item.a))
        .map(({ k, a }) => {
          const isGuidance = k === "guidance" || String(a.title || "").trim() === "คำแนะนำดวงชะตา";
          const lines = [`${a.icon || "✦"} ${a.title} (${a.grade || ""})`, `${a.text || ""}`];
          if (!isGuidance && a.leftNote) lines.push(`  • ${a.leftNote}`);
          if (!isGuidance && a.rightNote) lines.push(`  • ${a.rightNote}`);
          return lines.join("\n");
        })
        .join("\n\n");
      const confVal = Number(readingData.confidence || 92).toFixed(1);
      return `✋ ผลวิเคราะห์ลายมือครบ 2 มือ (${confVal}%)\n` +
        `✨ ${readingData.summaryVerdict || ""}\n\n` +
        `━━━━━━━━━━━━━━━\n` +
        `📜 คำทำนายลายมือ 5 ด้านสำคัญ\n` +
        `━━━━━━━━━━━━━━━\n\n` +
        `${aspectText}\n\n` +
        `#ดูดวงลายมือ #สแกนลายมือ2มือ #เซียมซีทาโรต์`;
    }

    if (readingData.mode === "siamsi") {
      const poem = (readingData.poemLines || []).join("\n");
      const aspectsText = (readingData.aspectsSummary || [])
        .map(a => `${a.label}: ${this._getCleanSiamsiAspectText(a)}`)
        .join("\n\n");
      const supplementPart = readingData.supplementText
        ? `\n📖 ${readingData.supplementTitle || "ตำราเสริม"}: ${readingData.supplementText}\n`
        : "";
      return `🎋 ผลคำทำนายเซียมซีทาโรต์ (${readingData.deckName || "เซียมซีศักดิ์สิทธิ์"})\n` +
        `✨ ได้เซียมซี เบอร์ ${readingData.signNumber} — ${readingData.signTitle || ""} (ระดับ: ${readingData.fortuneLevel || ""})\n` +
        `💡 หัวใจสำคัญ: "${readingData.oneLine || ""}"\n\n` +
        `📜 บทกลอนประจำใบเซียมซี:\n${poem}\n\n` +
        `🔮 คำทำนายฉบับเต็ม:\n${aspectsText}\n` +
        supplementPart + `\n` +
        `#เซียมซีทาโรต์ #ดูดวง #เสี่ยงเซียมซี`;
    }

    // สำหรับไพ่ทาโรต์ 3 ใบ (ไม่แสดงสารเตือนใจแยกตามใบ แต่รวบไว้ในบทสรุปและคำแนะนำท้ายสุด)
    const cardsText = (readingData.cards || []).map((c, idx) => {
      const orient = c.isReversed ? "ไพ่กลับหัว" : "ไพ่ตั้งตรง";
      const headerLabel = c.domainHeaderLabel || `คำทำนายด้าน${readingData.categoryName}`;
      return `🎴 ใบที่ ${idx + 1}: ${c.positionTitle}\n` +
        `• ได้ไพ่: ${c.name_th} (${c.name_en}) [${orient}]\n` +
        `• ${headerLabel}: ${c.domainMeaning}`;
    }).join("\n\n");

    const guidanceBullets = (readingData.cards || [])
      .map(c => c.advice ? `• จากไพ่ ${c.name_th}: ${c.advice}` : null)
      .filter(Boolean)
      .join("\n");

    const loveStatusLine = readingData.category === "love"
      ? `💞 สถานะหัวใจ: ${readingData.loveStatus === "couple" ? "คนมีคนในใจ / มีคนคุย / มีคู่" : "คนโสด"}\n`
      : "";
    const luckyLine = readingData.luckyBoost ? `• การเสริมดวงมงคล: ${readingData.luckyBoost}\n` : "";

    return `✨ ผลคำทำนายดวงชะตา "เซียมซีทาโรต์" ✨\n` +
      `🏷️ หมวดหมู่ที่เลือกดู: ด้าน${readingData.categoryName}\n` +
      loveStatusLine +
      `🌟 แนวโน้มดวงชะตา: ${readingData.verdictBadge}\n\n` +
      `━━━━━━━━━━━━━━━\n` +
      `📖 คำพยากรณ์ไพ่ทาโรต์ทั้ง 3 ใบ\n` +
      `━━━━━━━━━━━━━━━\n\n` +
      `${cardsText}\n\n` +
      `━━━━━━━━━━━━━━━\n` +
      `🔮 สรุปและวิเคราะห์ดวงชะตา\n` +
      `━━━━━━━━━━━━━━━\n` +
      `${readingData.verdictPlain}\n\n` +
      `✅ คำแนะนำและแนวทางที่ควรทำ:\n` +
      `• ${readingData.doAction}\n` +
      (guidanceBullets ? `${guidanceBullets}\n` : "") +
      luckyLine + `\n` +
      `⚠️ ข้อควรระวัง:\n` +
      `• ${readingData.dontAction}\n\n` +
      `#เซียมซีทาโรต์ #ดูดวงไพ่ทาโรต์ #ไพ่ยิปซี #ดูดวง${readingData.categoryName}`;
  }

  /**
   * แปลงชุด Canvas เป็นไฟล์ไบนารี .PDF แท้ (PDF 1.3 มาตรฐาน)
   * เพื่อให้ลูกค้าและแอดมินกดดาวน์โหลดเป็นไฟล์ .pdf ลงเครื่องได้ทันทีใน 1 คลิก!
   */
  canvasesToPdfBlob(canvases) {
    const pageData = canvases.map(canvas => {
      const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
      const base64 = dataUrl.split(",")[1];
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      return {
        bytes,
        width: canvas.width,
        height: canvas.height
      };
    });

    // A4 points: 595.28 x 841.89
    const pdfW = 595.28;
    const chunks = [];
    const offsets = [];
    let byteLength = 0;

    const writeStr = (str) => {
      const arr = new Uint8Array(str.length);
      for (let i = 0; i < str.length; i++) {
        arr[i] = str.charCodeAt(i) & 0xff;
      }
      chunks.push(arr);
      byteLength += arr.length;
    };

    const writeBytes = (uint8) => {
      chunks.push(uint8);
      byteLength += uint8.length;
    };

    const startObj = (id) => {
      offsets[id] = byteLength;
      writeStr(`${id} 0 obj\n`);
    };

    const endObj = () => {
      writeStr(`\nendobj\n`);
    };

    writeStr("%PDF-1.3\n%\xFF\xFF\xFF\xFF\n");

    // Object 1: Catalog
    startObj(1);
    writeStr(`<< /Type /Catalog /Pages 2 0 R >>`);
    endObj();

    // Each page uses 3 objects: PageObj, ContentObj, ImageObj
    const pageObjIds = [];
    let nextObjId = 3;

    pageData.forEach((page) => {
      const pageObjId = nextObjId++;
      const contentObjId = nextObjId++;
      const imgObjId = nextObjId++;
      pageObjIds.push(pageObjId);

      const pdfH = (page.height / page.width) * pdfW;
      const imgName = `/Im${imgObjId}`;
      const contentStream = `q\n${pdfW.toFixed(2)} 0 0 ${pdfH.toFixed(2)} 0 0 cm\n${imgName} Do\nQ`;

      // Page Object
      startObj(pageObjId);
      writeStr(
        `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pdfW.toFixed(2)} ${pdfH.toFixed(2)}] ` +
        `/Resources << /XObject << ${imgName} ${imgObjId} 0 R >> >> /Contents ${contentObjId} 0 R >>`
      );
      endObj();

      // Content Object
      startObj(contentObjId);
      writeStr(`<< /Length ${contentStream.length} >>\nstream\n${contentStream}\nendstream`);
      endObj();

      // Image XObject
      startObj(imgObjId);
      writeStr(
        `<< /Type /XObject /Subtype /Image /Width ${page.width} /Height ${page.height} ` +
        `/ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${page.bytes.length} >>\nstream\n`
      );
      writeBytes(page.bytes);
      writeStr(`\nendstream`);
      endObj();
    });

    // Object 2: Pages
    startObj(2);
    const kidsRef = pageObjIds.map(id => `${id} 0 R`).join(" ");
    writeStr(`<< /Type /Pages /Kids [ ${kidsRef} ] /Count ${pageObjIds.length} >>`);
    endObj();

    const totalObjs = nextObjId;
    const xrefOffset = byteLength;
    writeStr(`xref\n0 ${totalObjs}\n0000000000 65535 f \n`);
    for (let i = 1; i < totalObjs; i++) {
      const off = String(offsets[i] || 0).padStart(10, "0");
      writeStr(`${off} 00000 n \n`);
    }
    writeStr(`trailer\n<< /Size ${totalObjs} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`);

    return new Blob(chunks, { type: "application/pdf" });
  }

  /**
   * สร้างไฟล์ PDF หน้าเดียว (Single Page A4 Portrait) จากภาพ Info ธีมโหราศาสตร์ขลังอลังการ (ครบทุกศาสตร์: ไพ่ทาโรต์, เซียมซี, ลายมือ 2 มือ)
   */
  async generateReadingPdfBlob(readingData) {
    if (!readingData) return null;

    if (document.fonts && document.fonts.ready) {
      try {
        await document.fonts.ready;
      } catch (_) {}
    }

    if (readingData.mode === "palm") {
      const { canvas: infoCanvas } = await this.generatePalmInfoCard(readingData);
      return this.canvasesToPdfBlob([infoCanvas]);
    }

    if (readingData.mode === "siamsi") {
      const { canvas: infoCanvas } = await this.generateSiamsiInfoCard(readingData);
      return this.canvasesToPdfBlob([infoCanvas]);
    }

    const { canvas: tarotCanvas } = await this.generateTarotInfoCard(readingData);
    return this.canvasesToPdfBlob([tarotCanvas]);
  }

  /**
   * ดาวน์โหลดไฟล์ PDF ลงเครื่องทันที
   */
  async downloadReadingPdfFile(readingData, customFilename = "") {
    const pdfBlob = await this.generateReadingPdfBlob(readingData);
    if (!pdfBlob) return false;

    const codePart = readingData.code ? `_${readingData.code}` : "";
    const fileName = customFilename || `SiamSiTarot_${readingData.mode || "Reading"}${codePart}.pdf`;
    return this._triggerDownload(pdfBlob, "", fileName);
  }

  getInfoCardFilename(readingData) {
    const codePart = readingData && readingData.code ? `_${readingData.code}` : "";
    const modePart = readingData && readingData.mode ? `_${readingData.mode}` : "";
    return `SiamSiTarot_InfoCard${modePart}${codePart}.png`;
  }

  _getReadingCacheKey(readingData) {
    if (!readingData) return "";
    if (readingData.mode === "siamsi") {
      return `siamsi|${readingData.code || ""}|${readingData.deck || ""}|${readingData.signNumber || readingData.stickNum || ""}|${readingData.supplementTitle || ""}`;
    }
    if (readingData.mode === "palm") {
      return `palm|${readingData.code || ""}|${readingData.hand || "both"}|${readingData.confidence || ""}|${Object.keys(readingData.aspects || {}).length}`;
    }
    const cardIds = (readingData.cards || []).map(c => `${c.id}:${c.isReversed ? 1 : 0}`).join(",");
    return `tarot|${readingData.code || ""}|${readingData.category || ""}|${readingData.loveStatus || ""}|${cardIds}|${readingData.textbookId || ""}`;
  }

  _hasMatchingCachedInfo(readingData) {
    if (!readingData || !this.currentInfoBlob) return false;
    if (this.currentReadingData === readingData) return true;
    return Boolean(this._currentCacheKey && this._currentCacheKey === this._getReadingCacheKey(readingData));
  }

  async _finalizeCanvasAsset(canvas, readingData, retryNoExternalFn = null) {
    let dataUrl = "";
    try {
      dataUrl = canvas.toDataURL("image/png");
    } catch (_) {
      dataUrl = "";
    }
    if (!dataUrl && typeof retryNoExternalFn === "function") {
      return retryNoExternalFn();
    }
    const blob = await new Promise((res) => {
      try {
        canvas.toBlob((b) => res(b), "image/png");
      } catch (_) {
        res(null);
      }
    });
    let finalBlob = blob;
    if (!finalBlob && dataUrl) {
      try {
        const res = await fetch(dataUrl);
        finalBlob = await res.blob();
      } catch (_) {}
    }
    this.currentInfoDataUrl = dataUrl;
    this.currentInfoBlob = finalBlob;
    this.currentReadingData = readingData;
    this._currentCacheKey = this._getReadingCacheKey(readingData);
    return { dataUrl, blob: finalBlob, canvas };
  }

  _triggerDownload(blob, fallbackDataUrl, fileName) {
    let objectUrl = "";
    try {
      if (blob instanceof Blob) {
        objectUrl = URL.createObjectURL(blob);
      }
    } catch (_) {
      objectUrl = "";
    }
    const href = objectUrl || fallbackDataUrl;
    if (!href) return false;

    const a = document.createElement("a");
    a.href = href;
    a.download = fileName;
    a.rel = "noopener";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      if (a.parentNode) a.parentNode.removeChild(a);
      if (objectUrl) {
        setTimeout(() => URL.revokeObjectURL(objectUrl), 25000);
      }
    }, 100);
    return true;
  }

  async ensureInfoAsset(readingData) {
    if (!readingData) return null;
    if (!this._hasMatchingCachedInfo(readingData)) {
      if (readingData.mode === "palm") {
        await this.generatePalmInfoCard(readingData);
      } else if (readingData.mode === "siamsi") {
        await this.generateSiamsiInfoCard(readingData);
      } else {
        await this.generateTarotInfoCard(readingData);
      }
    }
    return {
      blob: this.currentInfoBlob,
      dataUrl: this.currentInfoDataUrl,
      fileName: this.getInfoCardFilename(readingData)
    };
  }

  async createInfoCardFile(readingData) {
    const asset = await this.ensureInfoAsset(readingData);
    if (!asset || !asset.blob) return null;
    return new File([asset.blob], asset.fileName, { type: "image/png" });
  }

  async copyInfoImageToClipboard(readingData) {
    const asset = await this.ensureInfoAsset(readingData);
    if (!asset || !asset.blob || !navigator.clipboard || typeof navigator.clipboard.write !== "function" || typeof ClipboardItem === "undefined") {
      return false;
    }
    try {
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": asset.blob })
      ]);
      return true;
    } catch (_) {
      return false;
    }
  }

  /**
   * Builds a clean structured Thai prompt with full reading context for asking Gemini follow-up questions.
   */
  buildGeminiPromptText(readingData) {
    if (!readingData) return "";
    const coreText = this.buildFullSocialCaption(readingData)
      .replace(/\n?#[^\n]+$/u, "")
      .trim();

    const extraParts = [];
    if (readingData.mode === "tarot" && readingData.ragSynthesis && readingData.textbookId && readingData.textbookId !== "tarot_classic_rw") {
      extraParts.push(`📖 มุมมองเพิ่มเติม (${readingData.textbookTitle || "ตำราที่เลือก"}):\n${readingData.ragSynthesis}`);
    }
    if (readingData.mode === "siamsi" && readingData.storyExcerpt) {
      extraParts.push(`📜 ตำนาน/คติประจำใบ:\n${readingData.storyExcerpt}`);
    }

    const combinedBody = extraParts.length > 0
      ? `${coreText}\n\n${extraParts.join("\n\n")}`
      : coreText;

    return `นี่คือข้อมูลผลการดูดวงของฉัน ช่วยอ่านทำความเข้าใจผลคำทำนายนี้ให้ครบถ้วน แล้วช่วยวิเคราะห์ขยายความให้เห็นภาพชัดเจนขึ้น พร้อมรอรับคำถามเพิ่มเติมจากฉันได้เลยครับ/ค่ะ:\n\n${combinedBody}\n\n━━━━━━━━━━━━━━━\n💬 คำถามที่ฉันอยากถามต่อจากผลนี้คือ: `;
  }

  /**
   * ดาวน์โหลดไฟล์ข้อความคำทำนาย (.TXT) ลงเครื่องทันที
   */
  downloadReadingTextFile(readingData) {
    if (!readingData) return false;
    const content = this.buildFullSocialCaption(readingData);
    const codePart = readingData.code ? `_${readingData.code}` : "";
    const fileName = `SiamSiTarot_${readingData.mode || "Reading"}${codePart}.txt`;
    const blob = new Blob(["\uFEFF" + content], { type: "text/plain;charset=utf-8" });
    return this._triggerDownload(blob, "", fileName);
  }

  /**
   * ดาวน์โหลดไฟล์รูป Info Card (.png) ลงเครื่อง (ใช้ Blob URL + fast-path เพื่อรองรับ Safari / iOS 100%)
   */
  async downloadInfoImageFile(readingData) {
    if (!readingData) return false;
    if (this._hasMatchingCachedInfo(readingData)) {
      return this._triggerDownload(this.currentInfoBlob, this.currentInfoDataUrl, this.getInfoCardFilename(readingData));
    }
    const asset = await this.ensureInfoAsset(readingData);
    if (!asset || (!asset.blob && !asset.dataUrl)) return false;
    return this._triggerDownload(asset.blob, asset.dataUrl, asset.fileName);
  }
}

window.shareAndPdfEngine = new ShareAndPdfEngine();
