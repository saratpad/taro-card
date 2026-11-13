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
   * โหลดรูปภาพและคืนค่าเป็น HTMLImageElement
   */
  loadImage(src) {
    return new Promise((resolve) => {
      if (!src) return resolve(null);
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = () => {
        // Retry with encodeURI if needed
        const fallbackImg = new Image();
        fallbackImg.onload = () => resolve(fallbackImg);
        fallbackImg.onerror = () => resolve(null);
        fallbackImg.src = encodeURI(src);
      };
      img.src = src;
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
   * สร้างรูป Info Card (1080 x 1560) กราฟิกสวยงาม เข้าใจง่าย เข้าธีมโลโก้ SIAMSI TAROT • ORACLE
   * มีโลโก้แบรนด์ + รูปไพ่ 3 ใบพร้อมลูกศรเชื่อมโยง + อินโฟกราฟิกคำทำนาย 3 ตำแหน่ง + ฟันธง Do/Don't
   */
  async generateTarotInfoCard(readingData) {
    const canvas = document.createElement("canvas");
    const W = 1080;
    const H = 1560;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");

    // 1. พื้นหลัง Astral Midnight Navy & Cosmic Cyan/Gold เข้าธีมโลโก้ SIAMSI TAROT • ORACLE
    const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
    bgGrad.addColorStop(0, "#040717");
    bgGrad.addColorStop(0.45, "#091336");
    bgGrad.addColorStop(0.8, "#0c1130");
    bgGrad.addColorStop(1, "#040613");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // แสงออร่า Cyan & Gold ด้านหลัง
    const radGlowTop = ctx.createRadialGradient(W / 2, 180, 20, W / 2, 180, 480);
    radGlowTop.addColorStop(0, "rgba(56, 189, 248, 0.24)");
    radGlowTop.addColorStop(0.5, "rgba(168, 85, 247, 0.14)");
    radGlowTop.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = radGlowTop;
    ctx.fillRect(0, 0, W, H);

    const radGlowCards = ctx.createRadialGradient(W / 2, 540, 40, W / 2, 540, 520);
    radGlowCards.addColorStop(0, "rgba(243, 207, 122, 0.2)");
    radGlowCards.addColorStop(0.6, "rgba(56, 189, 248, 0.1)");
    radGlowCards.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = radGlowCards;
    ctx.fillRect(0, 0, W, H);

    // วงแหวนกลุ่มดาวจักรวาล (Astral Geometry)
    ctx.save();
    ctx.translate(W / 2, 520);
    ctx.strokeStyle = "rgba(243, 207, 122, 0.15)";
    ctx.lineWidth = 1.8;
    for (const r of [240, 320, 400]) {
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();

    // 2. กรอบทองคำสองชั้นประดับมุม
    ctx.strokeStyle = "#f3cf7a";
    ctx.lineWidth = 3.5;
    this.drawRoundedRect(ctx, 26, 26, W - 52, H - 52, 26);
    ctx.stroke();

    ctx.strokeStyle = "rgba(56, 189, 248, 0.38)";
    ctx.lineWidth = 1.5;
    this.drawRoundedRect(ctx, 38, 38, W - 76, H - 76, 20);
    ctx.stroke();

    // 3. วาดโลโก้ SIAMSI TAROT • ORACLE ด้านบนสุด + ชื่อแบรนด์
    const logoUrl = (window.brandThemeEngine && typeof window.brandThemeEngine.getLogoUrl === "function")
      ? window.brandThemeEngine.getLogoUrl()
      : "assets/logo.jpg";
    const logoImg = await this.loadImage(logoUrl);

    if (logoImg) {
      const logoSize = 96;
      const lx = W / 2 - 320;
      const ly = 56;
      ctx.save();
      ctx.beginPath();
      ctx.arc(lx + logoSize / 2, ly + logoSize / 2, logoSize / 2 + 3, 0, Math.PI * 2);
      ctx.fillStyle = "#f3cf7a";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(lx + logoSize / 2, ly + logoSize / 2, logoSize / 2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(logoImg, lx, ly, logoSize, logoSize);
      ctx.restore();
    }

    ctx.textAlign = "center";
    ctx.fillStyle = "#fff1be";
    ctx.font = "700 40px 'Prompt', sans-serif";
    ctx.fillText("SIAMSI TAROT • เซียมซีทาโรต์", W / 2 + 35, 102);

    ctx.fillStyle = "#38bdf8";
    ctx.font = "500 20px 'Prompt', sans-serif";
    ctx.fillText("✦ SACRED 3-CARD TAROT & ORACLE INFOGRAPHIC ✦", W / 2 + 35, 136);

    const catIcons = { love: "💖", career: "💼", finance: "💰", health: "🌿" };
    const spreadText = readingData.spreadFormula ? `  |  ${readingData.spreadFormula}` : "";
    const domainLabel = `${catIcons[readingData.category] || "🔮"} หมวด${readingData.categoryName || "พยากรณ์"}${spreadText}`;

    // ป้ายหมวดหมู่และสูตรเรียงไพ่ 3 ใบ
    ctx.fillStyle = "rgba(14, 32, 78, 0.9)";
    this.drawRoundedRect(ctx, 70, 162, W - 140, 50, 25);
    ctx.fill();
    ctx.strokeStyle = "rgba(243, 207, 122, 0.65)";
    ctx.lineWidth = 1.8;
    ctx.stroke();

    ctx.fillStyle = "#fff1be";
    ctx.font = "600 22px 'Prompt', sans-serif";
    ctx.fillText(domainLabel, W / 2, 195, W - 180);

    const dateStr = readingData.dateText || new Date(readingData.timestamp || Date.now()).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
    const codeTag = readingData.code ? `รหัสโค้ด: ${readingData.code}` : "";
    const metaLine = [codeTag, dateStr].filter(Boolean).join("   •   ");

    ctx.fillStyle = "#bae6fd";
    ctx.font = "400 19px 'Prompt', sans-serif";
    ctx.fillText(metaLine, W / 2, 238);

    // 4. วาดรูปไพ่ทั้ง 3 ใบที่จับได้ พร้อมหมายเลข 1 ➔ 2 ➔ 3
    const cards = readingData.cards || [];
    const cardW = 248;
    const cardH = 405;
    const gap = 58;
    const totalCardsW = cards.length * cardW + (cards.length - 1) * gap;
    const startX = (W - totalCardsW) / 2;
    const cardY = 262;

    const loadedImages = await Promise.all(cards.map(c => this.loadImage(c.image)));

    for (let i = 0; i < cards.length; i++) {
      const c = cards[i];
      const x = startX + i * (cardW + gap);
      const img = loadedImages[i];

      // ป้ายตำแหน่งเหนือไพ่
      ctx.fillStyle = "rgba(56, 189, 248, 0.18)";
      this.drawRoundedRect(ctx, x + 6, cardY, cardW - 12, 36, 18);
      ctx.fill();
      ctx.strokeStyle = "rgba(243, 207, 122, 0.55)";
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.fillStyle = "#fff1be";
      ctx.font = "700 18px 'Prompt', sans-serif";
      const shortPos = (c.positionTitle || `ใบที่ ${i + 1}`).split("—")[0].trim();
      ctx.fillText(`${i + 1}. ${shortPos}`, x + cardW / 2, cardY + 24);

      const imgBoxY = cardY + 46;

      // ลูกศรเชื่อมระหว่างไพ่
      if (i < cards.length - 1) {
        ctx.fillStyle = "#f3cf7a";
        ctx.font = "700 30px 'Prompt', sans-serif";
        ctx.fillText("➔", x + cardW + gap / 2, imgBoxY + cardH / 2);
      }

      // เงาและกรอบไพ่
      ctx.save();
      ctx.shadowColor = "rgba(56, 189, 248, 0.35)";
      ctx.shadowBlur = 22;
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
      }

      ctx.strokeStyle = "#f3cf7a";
      ctx.lineWidth = 3;
      this.drawRoundedRect(ctx, x, imgBoxY, cardW, cardH, 16);
      ctx.stroke();

      // ชื่อไพ่ใต้ภาพ
      ctx.fillStyle = "#ffffff";
      ctx.font = "700 21px 'Prompt', sans-serif";
      ctx.fillText(c.name_th || c.name_en, x + cardW / 2, imgBoxY + cardH + 30);

      ctx.fillStyle = c.isReversed ? "#fca5a5" : "#7dd3fc";
      ctx.font = "600 17px 'Prompt', sans-serif";
      ctx.fillText(c.isReversed ? "[ ไพ่กลับหัว ]" : "[ ไพ่ตั้งตรง ]", x + cardW / 2, imgBoxY + cardH + 54);
    }

    // 5. อินโฟกราฟิกสรุปคำทำนายทั้ง 3 ตำแหน่ง (แยกเป็น 3 การ์ดอ่านง่าย สวยงาม)
    let itemY = 788;
    const stepColors = ["#38bdf8", "#a855f7", "#f3cf7a"];

    for (let i = 0; i < cards.length; i++) {
      const c = cards[i];
      const shortPos = (c.positionTitle || `ตำแหน่งที่ ${i + 1}`).split("—")[0].trim();

      ctx.fillStyle = "rgba(11, 22, 58, 0.92)";
      this.drawRoundedRect(ctx, 64, itemY, W - 128, 132, 16);
      ctx.fill();
      ctx.strokeStyle = "rgba(243, 207, 122, 0.42)";
      ctx.lineWidth = 1.6;
      ctx.stroke();

      // แถบสีด้านซ้ายของการ์ดอินโฟกราฟิก
      ctx.fillStyle = stepColors[i % stepColors.length];
      this.drawRoundedRect(ctx, 64, itemY, 10, 132, 5);
      ctx.fill();

      // วงกลมเลขลำดับ 1, 2, 3
      ctx.beginPath();
      ctx.arc(108, itemY + 38, 20, 0, Math.PI * 2);
      ctx.fillStyle = stepColors[i % stepColors.length];
      ctx.fill();
      ctx.textAlign = "center";
      ctx.fillStyle = "#040717";
      ctx.font = "700 20px 'Prompt', sans-serif";
      ctx.fillText(String(i + 1), 108, itemY + 45);

      ctx.textAlign = "left";
      ctx.fillStyle = "#fff1be";
      ctx.font = "700 22px 'Prompt', sans-serif";
      ctx.fillText(`${shortPos}  •  ไพ่${c.name_th} ${c.isReversed ? "(กลับหัว)" : "(ตั้งตรง)"}`, 142, itemY + 44);

      ctx.fillStyle = "#f1f5f9";
      ctx.font = "400 19.5px 'Prompt', sans-serif";
      const lines = this.wrapTextLines(ctx, c.shortMeaning || c.domainMeaning || "", W - 230).slice(0, 2);
      lines.forEach((line, lIdx) => {
        ctx.fillText(line, 142, itemY + 78 + lIdx * 27);
      });

      itemY += 146;
    }

    // 6. กล่องฟันธงภาพรวม & แนวทางปฏิบัติ (Info Summary Box)
    const verdictY = 1236;
    const vGrad = ctx.createLinearGradient(64, verdictY, W - 64, verdictY + 230);
    vGrad.addColorStop(0, "rgba(20, 36, 88, 0.95)");
    vGrad.addColorStop(1, "rgba(38, 20, 78, 0.95)");
    ctx.fillStyle = vGrad;
    this.drawRoundedRect(ctx, 64, verdictY, W - 128, 232, 20);
    ctx.fill();
    ctx.strokeStyle = "#f3cf7a";
    ctx.lineWidth = 2.2;
    ctx.stroke();

    ctx.textAlign = "left";
    ctx.fillStyle = "#fff1be";
    ctx.font = "700 24px 'Prompt', sans-serif";
    ctx.fillText(`👑 บทสรุปฟันธง: ${readingData.verdictBadge || ""}`, 94, verdictY + 42);

    ctx.fillStyle = "#ffffff";
    ctx.font = "400 19.5px 'Prompt', sans-serif";
    const vLines = this.wrapTextLines(ctx, readingData.verdictPlain || "", W - 188).slice(0, 2);
    vLines.forEach((line, idx) => {
      ctx.fillText(line, 94, verdictY + 76 + idx * 27);
    });

    // แถบ Do & Don't สั้นกระชับเข้าใจง่าย
    ctx.fillStyle = "#86efac";
    ctx.font = "600 18.5px 'Prompt', sans-serif";
    const doLine = this.wrapTextLines(ctx, `✅ ควรทำ: ${readingData.doAction || ""}`, W - 188)[0] || "";
    ctx.fillText(doLine, 94, verdictY + 158);

    ctx.fillStyle = "#fca5a5";
    ctx.font = "600 18.5px 'Prompt', sans-serif";
    const dontLine = this.wrapTextLines(ctx, `⚠️ ควรระวัง: ${readingData.dontAction || ""}`, W - 188)[0] || "";
    ctx.fillText(dontLine, 94, verdictY + 196);

    // Footer
    ctx.textAlign = "center";
    ctx.fillStyle = "#7dd3fc";
    ctx.font = "500 19px 'Prompt', sans-serif";
    ctx.fillText("✨ อ่านคำทำนายฉบับเต็มต่อในโพสต์ / คอมเมนต์ • SIAMSI TAROT ORACLE ✨", W / 2, H - 46);

    const dataUrl = canvas.toDataURL("image/png");
    const blob = await new Promise(res => canvas.toBlob(res, "image/png"));
    this.currentInfoDataUrl = dataUrl;
    this.currentInfoBlob = blob;
    return { dataUrl, blob, canvas };
  }

  /**
   * สร้างรูป Info Card สำหรับเซียมซี (เข้าธีมโลโก้ SIAMSI TAROT • ORACLE)
   */
  async generateSiamsiInfoCard(readingData) {
    const canvas = document.createElement("canvas");
    const W = 1080;
    const H = 1420;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");

    const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
    bgGrad.addColorStop(0, "#040717");
    bgGrad.addColorStop(0.5, "#0b1538");
    bgGrad.addColorStop(1, "#050819");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    const radGlow = ctx.createRadialGradient(W / 2, 260, 30, W / 2, 260, 500);
    radGlow.addColorStop(0, "rgba(243, 207, 122, 0.22)");
    radGlow.addColorStop(0.5, "rgba(56, 189, 248, 0.14)");
    radGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = radGlow;
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = "#f3cf7a";
    ctx.lineWidth = 4;
    this.drawRoundedRect(ctx, 30, 30, W - 60, H - 60, 24);
    ctx.stroke();

    const logoUrl = (window.brandThemeEngine && typeof window.brandThemeEngine.getLogoUrl === "function")
      ? window.brandThemeEngine.getLogoUrl()
      : "assets/logo.jpg";
    const logoImg = await this.loadImage(logoUrl);
    if (logoImg) {
      const logoSize = 92;
      const lx = W / 2 - 330;
      const ly = 58;
      ctx.save();
      ctx.beginPath();
      ctx.arc(lx + logoSize / 2, ly + logoSize / 2, logoSize / 2 + 3, 0, Math.PI * 2);
      ctx.fillStyle = "#f3cf7a";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(lx + logoSize / 2, ly + logoSize / 2, logoSize / 2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(logoImg, lx, ly, logoSize, logoSize);
      ctx.restore();
    }

    ctx.textAlign = "center";
    ctx.fillStyle = "#fff1be";
    ctx.font = "700 40px 'Prompt', sans-serif";
    ctx.fillText("SIAMSI TAROT • ใบคำทำนายเซียมซี", W / 2 + 35, 106);

    ctx.fillStyle = "#38bdf8";
    ctx.font = "600 25px 'Prompt', sans-serif";
    ctx.fillText(readingData.deckName || "ตำราเซียมซีศักดิ์สิทธิ์", W / 2 + 35, 148);

    // ป้ายเลขเซียมซีขนาดใหญ่
    ctx.fillStyle = "rgba(14, 30, 74, 0.92)";
    this.drawRoundedRect(ctx, W / 2 - 240, 185, 480, 130, 24);
    ctx.fill();
    ctx.strokeStyle = "#f3cf7a";
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.fillStyle = "#fff1be";
    ctx.font = "700 62px 'Prompt', sans-serif";
    ctx.fillText(`เซียมซีเบอร์ ${readingData.signNumber}`, W / 2, 268);

    ctx.fillStyle = "#ffffff";
    ctx.font = "600 30px 'Prompt', sans-serif";
    ctx.fillText(`${readingData.signTitle || ""} (${readingData.fortuneLevel || ""})`, W / 2, 366);

    // บทกลอน
    ctx.fillStyle = "rgba(8, 16, 44, 0.85)";
    this.drawRoundedRect(ctx, 76, 405, W - 152, 245, 18);
    ctx.fill();
    ctx.strokeStyle = "rgba(56, 189, 248, 0.35)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = "#fff1be";
    ctx.font = "500 23px 'Prompt', sans-serif";
    const poemLines = readingData.poemLines || [];
    poemLines.slice(0, 4).forEach((line, idx) => {
      ctx.fillText(line, W / 2, 468 + idx * 45);
    });

    // สรุปคำทำนายเด่นแบบการ์ดอินโฟกราฟิก
    ctx.textAlign = "left";
    ctx.fillStyle = "#f3cf7a";
    ctx.font = "700 26px 'Prompt', sans-serif";
    ctx.fillText("✦ สรุปคำพยากรณ์สำคัญรายด้าน:", 80, 704);

    const aspects = readingData.aspectsSummary || [];
    let ay = 730;
    aspects.slice(0, 4).forEach((item, idx) => {
      ctx.fillStyle = "rgba(12, 24, 62, 0.9)";
      this.drawRoundedRect(ctx, 76, ay, W - 152, 126, 14);
      ctx.fill();
      ctx.strokeStyle = "rgba(243, 207, 122, 0.35)";
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.fillStyle = idx % 2 === 0 ? "#38bdf8" : "#f3cf7a";
      ctx.font = "700 22px 'Prompt', sans-serif";
      ctx.fillText(`${item.label}`, 104, ay + 38);

      ctx.fillStyle = "#f8fafc";
      ctx.font = "400 20px 'Prompt', sans-serif";
      const lines = this.wrapTextLines(ctx, item.text, W - 210).slice(0, 2);
      lines.forEach((l, i) => ctx.fillText(l, 104, ay + 72 + i * 28));
      ay += 140;
    });

    ctx.textAlign = "center";
    ctx.fillStyle = "#7dd3fc";
    ctx.font = "500 20px 'Prompt', sans-serif";
    ctx.fillText("✨ อ่านคำทำนายฉบับเต็มครบทุกด้านในโพสต์ / คอมเมนต์ • SIAMSI TAROT ORACLE ✨", W / 2, H - 48);

    const dataUrl = canvas.toDataURL("image/png");
    const blob = await new Promise(res => canvas.toBlob(res, "image/png"));
    this.currentInfoDataUrl = dataUrl;
    this.currentInfoBlob = blob;
    return { dataUrl, blob, canvas };
  }

  /**
   * สร้างลิงก์สำหรับแชร์ผลคำทำนายโดยตรง เพื่อให้เพื่อนในโซเชียลคลิกเข้ามาดูหน้าคำทำนายชุดเดียวกันได้ทันที
   */
  _loadOptionalImage(src) {
    if (!src) return Promise.resolve(null);
    return this.loadImage(src).catch(() => null);
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

  async generatePalmInfoCard(readingData) {
    const W = 1080;
    const H = 1620;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");

    // 1. Dark Mystic Celestial Background
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, "#050918");
    bg.addColorStop(0.5, "#101836");
    bg.addColorStop(1, "#070b1d");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Soft Aura Glow
    const glow = ctx.createRadialGradient(W / 2, 260, 40, W / 2, 260, 560);
    glow.addColorStop(0, "rgba(243, 207, 122, 0.16)");
    glow.addColorStop(1, "rgba(243, 207, 122, 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, 820);

    // Outer Gold Frame
    ctx.strokeStyle = "rgba(243, 207, 122, 0.55)";
    ctx.lineWidth = 3;
    this.drawRoundedRect(ctx, 26, 26, W - 52, H - 52, 28);
    ctx.stroke();

    // Header + Brand Logo
    const logoUrl = (window.brandThemeEngine && typeof window.brandThemeEngine.getLogoUrl === "function")
      ? window.brandThemeEngine.getLogoUrl()
      : "assets/logo.jpg";
    const logoImg = await this._loadOptionalImage(logoUrl);
    if (logoImg) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(110, 102, 42, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(logoImg, 68, 60, 84, 84);
      ctx.restore();
    }

    ctx.textAlign = "center";
    ctx.fillStyle = "#f3cf7a";
    ctx.font = "bold 28px 'Cinzel', 'Prompt', sans-serif";
    ctx.fillText("SIAMSI TAROT ORACLE • PALMISTRY", W / 2, 88);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 36px 'Prompt', sans-serif";
    ctx.fillText("ผลวิเคราะห์ลายมือครบ 2 มือ (ซ้าย + ขวา)", W / 2, 134);

    const confVal = Number(readingData.confidence || 92).toFixed(1);
    ctx.fillStyle = "rgba(16, 185, 129, 0.18)";
    ctx.strokeStyle = "rgba(52, 211, 153, 0.65)";
    ctx.lineWidth = 1.6;
    this.drawRoundedRect(ctx, W / 2 - 190, 154, 380, 40, 20);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#86efac";
    ctx.font = "600 20px 'Prompt', sans-serif";
    ctx.fillText(`🎯 ความแม่นยำการตรวจจับ ${confVal}%`, W / 2, 181);

    // 2. Dual-Hand HUD Visual Frames
    const leftImg = await this._loadOptionalImage(readingData.leftHudDataUrl);
    const rightImg = await this._loadOptionalImage(readingData.rightHudDataUrl);
    const cardY = 216;
    const cardW = 472;
    const cardH = 370;

    const drawHandBox = (x, label, img) => {
      ctx.fillStyle = "rgba(9, 14, 32, 0.9)";
      ctx.strokeStyle = "rgba(243, 207, 122, 0.42)";
      ctx.lineWidth = 2;
      this.drawRoundedRect(ctx, x, cardY, cardW, cardH, 20);
      ctx.fill();
      ctx.stroke();

      if (img) {
        this._drawContainImage(ctx, img, x + 16, cardY + 14, cardW - 32, cardH - 64);
      } else {
        ctx.fillStyle = "#94a3b8";
        ctx.font = "500 20px 'Prompt', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("บันทึกผลสแกนหัตถศาสตร์แล้ว", x + cardW / 2, cardY + cardH / 2);
      }

      ctx.fillStyle = "#fde68a";
      ctx.font = "bold 20px 'Prompt', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(label, x + cardW / 2, cardY + cardH - 18);
    };

    drawHandBox(56, "✋ มือซ้าย • พื้นดวงเดิม", leftImg);
    drawHandBox(W - 56 - cardW, "🤚 มือขวา • ปัจจุบัน-อนาคต", rightImg);

    // 3. Verdict Box
    const vY = cardY + cardH + 20;
    ctx.fillStyle = "rgba(243, 207, 122, 0.1)";
    ctx.strokeStyle = "rgba(243, 207, 122, 0.35)";
    ctx.lineWidth = 1.5;
    this.drawRoundedRect(ctx, 56, vY, W - 112, 92, 16);
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.fillStyle = "#fff1be";
    ctx.font = "600 21px 'Prompt', sans-serif";
    const vLines = this.wrapTextLines(ctx, readingData.summaryVerdict || "วิเคราะห์ครบ 2 ฝ่ามือสำเร็จ", W - 156).slice(0, 2);
    vLines.forEach((line, idx) => {
      ctx.fillText(line, W / 2, vY + 38 + idx * 30);
    });

    // 4. Stacked 5-Aspect Highlights
    const aspects = readingData.aspects || {};
    const orderedKeys = ["life", "intellect", "love", "wealth", "guidance"];
    let curY = vY + 114;
    const boxH = 154;
    const gap = 16;

    orderedKeys.forEach((key) => {
      const asp = aspects[key];
      if (!asp) return;
      ctx.fillStyle = "rgba(15, 23, 42, 0.88)";
      ctx.strokeStyle = "rgba(243, 207, 122, 0.28)";
      ctx.lineWidth = 1.5;
      this.drawRoundedRect(ctx, 56, curY, W - 112, boxH, 16);
      ctx.fill();
      ctx.stroke();

      ctx.textAlign = "left";
      ctx.fillStyle = "#f3cf7a";
      ctx.font = "bold 22px 'Prompt', sans-serif";
      ctx.fillText(`${asp.icon || "✦"} ${asp.title || ""}`, 80, curY + 36);

      ctx.textAlign = "right";
      ctx.fillStyle = "#86efac";
      ctx.font = "600 18px 'Prompt', sans-serif";
      ctx.fillText(asp.grade || "", W - 80, curY + 36);

      ctx.textAlign = "left";
      ctx.fillStyle = "#e2e8f0";
      ctx.font = "400 19px 'Prompt', sans-serif";
      const cleanBody = String(asp.text || "").replace(/\s*\(\s*\)/g, "");
      const bodyLines = this.wrapTextLines(ctx, cleanBody, W - 168).slice(0, 3);
      bodyLines.forEach((ln, li) => {
        ctx.fillText(ln, 80, curY + 68 + li * 26);
      });

      curY += boxH + gap;
    });

    // Footer
    ctx.textAlign = "center";
    ctx.fillStyle = "#cbd5e1";
    ctx.font = "500 18px 'Prompt', sans-serif";
    const dateStr = new Date(readingData.timestamp || Date.now()).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
    ctx.fillText(`✦ เซียมซีทาโรต์ (Siamsi Tarot Oracle) • บันทึกผลวิเคราะห์วันที่ ${dateStr} ✦`, W / 2, H - 38);

    const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/png", 0.95));
    const dataUrl = canvas.toDataURL("image/png", 0.95);
    this.currentInfoDataUrl = dataUrl;
    this.currentInfoBlob = blob;
    this.currentReadingData = readingData;
    return { dataUrl, blob, canvas };
  }

  async generatePalmPdfDetailPages(readingData) {
    const pages = [];
    const W = 1240;
    const H = 1754;
    const padX = 76;
    const contentW = W - padX * 2;
    const maxBottomY = H - 96;

    const createPage = (pageNum) => {
      const c = document.createElement("canvas");
      c.width = W;
      c.height = H;
      const ctx = c.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, W, 94);
      ctx.fillStyle = "#f3cf7a";
      ctx.font = "bold 26px 'Prompt', sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("คัมภีร์หัตถศาสตร์ฉบับสมบูรณ์ (วิเคราะห์ครบ 2 มือ)", padX, 58);
      ctx.textAlign = "right";
      ctx.fillStyle = "#cbd5e1";
      ctx.font = "500 18px 'Prompt', sans-serif";
      ctx.fillText(`หน้า ${pageNum + 1}`, W - padX, 58);
      pages.push(c);
      return { c, ctx, y: 136 };
    };

    let pageState = createPage(1);
    const ensureSpace = (neededH) => {
      if (pageState.y + neededH > maxBottomY) {
        pageState = createPage(pages.length + 1);
      }
    };

    const { ctx } = pageState;
    ctx.textAlign = "left";
    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 24px 'Prompt', sans-serif";
    ctx.fillText(`สรุปภาพรวมการวิเคราะห์ (ความแม่นยำ ${Number(readingData.confidence || 92).toFixed(1)}%)`, padX, pageState.y);
    pageState.y += 38;

    pageState.ctx.font = "400 20px 'Prompt', sans-serif";
    pageState.ctx.fillStyle = "#334155";
    const sumLines = this.wrapTextLines(pageState.ctx, readingData.summaryVerdict || "", contentW);
    sumLines.forEach(ln => {
      ensureSpace(32);
      pageState.ctx.fillText(ln, padX, pageState.y);
      pageState.y += 30;
    });
    pageState.y += 22;

    const aspects = readingData.aspects || {};
    for (const key of ["life", "intellect", "love", "wealth", "guidance"]) {
      const asp = aspects[key];
      if (!asp) continue;

      pageState.ctx.font = "400 20px 'Prompt', sans-serif";
      const mainLines = this.wrapTextLines(pageState.ctx, asp.text || "", contentW - 36);
      const leftLines = asp.leftNote ? this.wrapTextLines(pageState.ctx, asp.leftNote, contentW - 52) : [];
      const rightLines = asp.rightNote ? this.wrapTextLines(pageState.ctx, asp.rightNote, contentW - 52) : [];

      const estHeight = 86 + mainLines.length * 30 + (leftLines.length ? leftLines.length * 26 + 24 : 0) + (rightLines.length ? rightLines.length * 26 + 24 : 0) + 28;
      ensureSpace(Math.min(estHeight, 520));

      const cardTop = pageState.y;
      const boxFillH = estHeight - 16;
      pageState.ctx.fillStyle = "#f8fafc";
      pageState.ctx.strokeStyle = "#cbd5e1";
      pageState.ctx.lineWidth = 1.6;
      this.drawRoundedRect(pageState.ctx, padX, cardTop, contentW, boxFillH, 14);
      pageState.ctx.fill();
      pageState.ctx.stroke();

      let innerY = cardTop + 40;
      pageState.ctx.textAlign = "left";
      pageState.ctx.fillStyle = "#0f172a";
      pageState.ctx.font = "bold 24px 'Prompt', sans-serif";
      pageState.ctx.fillText(`${asp.icon || "✦"} ${asp.title || ""}`, padX + 20, innerY);

      pageState.ctx.textAlign = "right";
      pageState.ctx.fillStyle = "#047857";
      pageState.ctx.font = "600 18px 'Prompt', sans-serif";
      pageState.ctx.fillText(asp.grade || "", W - padX - 20, innerY);
      innerY += 38;

      pageState.ctx.textAlign = "left";
      pageState.ctx.fillStyle = "#1e293b";
      pageState.ctx.font = "400 20px 'Prompt', sans-serif";
      mainLines.forEach(ln => {
        pageState.ctx.fillText(ln, padX + 20, innerY);
        innerY += 30;
      });

      if (leftLines.length) {
        innerY += 10;
        pageState.ctx.fillStyle = "#0369a1";
        pageState.ctx.font = "600 18px 'Prompt', sans-serif";
        leftLines.forEach(ln => {
          pageState.ctx.fillText(ln, padX + 28, innerY);
          innerY += 26;
        });
      }
      if (rightLines.length) {
        innerY += 8;
        pageState.ctx.fillStyle = "#92400e";
        pageState.ctx.font = "600 18px 'Prompt', sans-serif";
        rightLines.forEach(ln => {
          pageState.ctx.fillText(ln, padX + 28, innerY);
          innerY += 26;
        });
      }

      pageState.y = cardTop + estHeight;
    }

    return pages;
  }

  buildShareableReadingUrl(readingData) {
    const baseUrl = window.location.origin + window.location.pathname;
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
   * สร้างข้อความคำทำนายฉบับเต็ม สำหรับโพสต์โซเชียล / วางในคอมเมนต์ต่อท้ายรูป Info
   */
  buildFullSocialCaption(readingData) {
    if (!readingData) return "";
    const shareUrl = this.buildShareableReadingUrl(readingData);

    if (readingData.mode === "palm") {
      const aspects = readingData.aspects || {};
      const order = ["life", "intellect", "love", "wealth", "guidance"];
      const aspectText = order
        .map(k => aspects[k])
        .filter(Boolean)
        .map(a => `${a.icon || "✦"} ${a.title} (${a.grade || ""})\n${a.text || ""}`)
        .join("\n\n");
      const confVal = Number(readingData.confidence || 92).toFixed(1);
      return `✋ ผลวิเคราะห์ลายมือครบ 2 มือ (SIAMSI TAROT • PALMISTRY)\n` +
        `🎯 ความแม่นยำการตรวจจับ: ${confVal}%\n` +
        `✨ บทสรุป: ${readingData.summaryVerdict || ""}\n\n` +
        `━━━━━━━━━━━━━━━\n` +
        `📜 คำพยากรณ์หัตถศาสตร์ 5 ด้าน\n` +
        `━━━━━━━━━━━━━━━\n\n` +
        `${aspectText}\n\n` +
        `🔗 ดูผลคำทำนายนี้: ${shareUrl}\n` +
        `#ดูดวงลายมือ #สแกนลายมือ2มือ #เซียมซีทาโรต์`;
    }

    if (readingData.mode === "siamsi") {
      const poem = (readingData.poemLines || []).join("\n");
      const aspectsText = (readingData.aspectsSummary || [])
        .map(a => `${a.label}: ${a.detail || a.text}`)
        .join("\n\n");
      return `🎋 ผลคำทำนายเซียมซีทาโรต์ (${readingData.deckName || "เซียมซีศักดิ์สิทธิ์"})\n` +
        `✨ ได้เซียมซี เบอร์ ${readingData.signNumber} — ${readingData.signTitle || ""} (ระดับ: ${readingData.fortuneLevel || ""})\n` +
        `💡 หัวใจสำคัญ: "${readingData.oneLine || ""}"\n\n` +
        `📜 บทกลอนประจำใบเซียมซี:\n${poem}\n\n` +
        `🔮 คำทำนายฉบับเต็ม:\n${aspectsText}\n\n` +
        `🔗 ดูผลคำทำนายนี้: ${shareUrl}\n` +
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

    return `✨ ผลคำทำนายดวงชะตา "เซียมซีทาโรต์" (SIAMSI TAROT • ORACLE) ✨\n` +
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
      `🔗 ดูผลคำทำนายนี้: ${shareUrl}\n` +
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
   * วาดใบคำทำนายฉบับเต็มลง Canvas ความละเอียดสูง (ดีไซน์โปร่งโล่ง หรูหรา ไม่มีกรอบตารางอึดอัด และข้อความไม่ล้นหน้ากระดาษ 100%)
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
      const detailPages = await this.generatePalmPdfDetailPages(readingData);
      return this.canvasesToPdfBlob([infoCanvas, ...detailPages]);
    }

    if (readingData.mode === "siamsi") {
      const { canvas: infoCanvas } = await this.generateSiamsiInfoCard(readingData);
      return this.canvasesToPdfBlob([infoCanvas]);
    }

    const W = 1240;
    const textX = 146;
    const contentW = W - 260; // 980px — มีระยะขอบซ้าย-ขวากว้างขวาง ไม่ล้นกระดาษแน่นอน

    // สร้าง Canvas ชั่วคราวสำหรับคำนวณการตัดบรรทัดและความสูงทั้งหมดล่วงหน้า
    const measureCanvas = document.createElement("canvas");
    const mCtx = measureCanvas.getContext("2d");

    const cards = readingData.cards || [];
    const preparedCards = cards.map((c, idx) => {
      const orient = c.isReversed ? "ไพ่กลับหัว" : "ไพ่ตั้งตรง";
      mCtx.font = "700 22px 'Prompt', sans-serif";
      const titleLines = this.wrapTextLines(
        mCtx,
        `${c.positionTitle || `ใบที่ ${idx + 1}`}  •  ไพ่ ${c.name_th} (${orient})`,
        contentW
      );

      mCtx.font = "400 20px 'Prompt', sans-serif";
      const meaningLines = this.wrapTextLines(mCtx, c.domainMeaning || "", contentW);

      const blockHeight = titleLines.length * 32 + 12 + meaningLines.length * 33 + 38;
      return { card: c, titleLines, meaningLines, blockHeight };
    });

    // เตรียมข้อความส่วนสรุปและวิเคราะห์ดวงชะตา + คำแนะนำและข้อควรระวัง (ไม่แบ่งเป็นบทวิเคราะห์กับเข็มทิศ และไม่อ้างตำรา)
    mCtx.font = "700 25px 'Prompt', sans-serif";
    const summaryHeadingLines = this.wrapTextLines(
      mCtx,
      `🔮 สรุปและวิเคราะห์ดวงชะตา (${readingData.verdictBadge || ""})`,
      contentW
    );

    mCtx.font = "400 20px 'Prompt', sans-serif";
    const analysisLines = this.wrapTextLines(mCtx, readingData.verdictPlain || "", contentW);

    const recRawItems = [
      readingData.doAction ? `• ${readingData.doAction}` : null,
      ...cards.map(c => (c.advice ? `• จากไพ่ ${c.name_th}: ${c.advice}` : null)),
      readingData.luckyBoost ? `• เสริมดวงมงคล: ${readingData.luckyBoost}` : null
    ].filter(Boolean);

    mCtx.font = "400 19.5px 'Prompt', sans-serif";
    const recWrappedGroups = recRawItems.map(item => this.wrapTextLines(mCtx, item, contentW));
    const totalRecLines = recWrappedGroups.reduce((acc, g) => acc + g.length, 0);

    const cautionLines = this.wrapTextLines(
      mCtx,
      readingData.dontAction ? `• ${readingData.dontAction}` : "",
      contentW
    );

    const cardsSectionH = preparedCards.reduce((sum, item) => sum + item.blockHeight, 0);
    const summarySectionH =
      summaryHeadingLines.length * 34 +
      16 +
      analysisLines.length * 33 +
      36 +
      38 + // หัวข้อ คำแนะนำและแนวทางที่ควรทำ
      totalRecLines * 32 +
      recWrappedGroups.length * 6 +
      32 +
      38 + // หัวข้อ ข้อควรระวัง
      cautionLines.length * 32;

    // คำนวณความสูงหน้ากระดาษแบบยืดหยุ่นตามเนื้อหาจริง เพื่อให้โปร่งสบายตาและไม่มีวันล้นขอบล่าง
    const headerAndCardsTopH = 740;
    const H = Math.max(1754, headerAndCardsTopH + cardsSectionH + summarySectionH + 170);

    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");

    // 1. พื้นหลัง Astral Midnight & Celestial Gold โปร่งหรูหรา
    const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
    bgGrad.addColorStop(0, "#05091d");
    bgGrad.addColorStop(0.45, "#091332");
    bgGrad.addColorStop(1, "#040716");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    const topGlow = ctx.createRadialGradient(W / 2, 220, 20, W / 2, 220, 620);
    topGlow.addColorStop(0, "rgba(243, 207, 122, 0.16)");
    topGlow.addColorStop(0.55, "rgba(56, 189, 248, 0.08)");
    topGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = topGlow;
    ctx.fillRect(0, 0, W, H);

    // เส้นขอบหน้ากระดาษบางเฉียบสไตล์ Editorial Luxury (ไม่มีกรอบตารางย่อยด้านใน)
    ctx.strokeStyle = "rgba(243, 207, 122, 0.55)";
    ctx.lineWidth = 2;
    this.drawRoundedRect(ctx, 48, 48, W - 96, H - 96, 20);
    ctx.stroke();

    // 2. โลโก้ทรงกลมตรงกลางด้านบน + หัวกระดาษจัดกึ่งกลางอย่างสมดุล
    const logoUrl = (window.brandThemeEngine && typeof window.brandThemeEngine.getLogoUrl === "function")
      ? window.brandThemeEngine.getLogoUrl()
      : "assets/logo.jpg";
    const logoImg = await this.loadImage(logoUrl);
    if (logoImg) {
      const logoSize = 96;
      const lx = W / 2 - logoSize / 2;
      const ly = 76;
      ctx.save();
      ctx.beginPath();
      ctx.arc(W / 2, ly + logoSize / 2, logoSize / 2 + 3, 0, Math.PI * 2);
      ctx.strokeStyle = "#f3cf7a";
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(W / 2, ly + logoSize / 2, logoSize / 2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(logoImg, lx, ly, logoSize, logoSize);
      ctx.restore();
    }

    ctx.textAlign = "center";
    ctx.fillStyle = "#fff1be";
    ctx.font = "700 36px 'Prompt', sans-serif";
    ctx.fillText("เซียมซีทาโรต์ • SIAMSI TAROT ORACLE", W / 2, 214, W - 180);

    // ป้องกันการซ้ำซ้อนของคำว่า (สำหรับคนโสด) เพราะ readingData.categoryName มีระบุไว้แล้ว
    const rawCatName = String(readingData.categoryName || "ดวงชะตา");
    const hasLoveTag = rawCatName.includes("(");
    const loveSuffix = (readingData.category === "love" && !hasLoveTag)
      ? (readingData.loveStatus === "couple" ? " (สำหรับคนมีคนในใจ / มีคู่)" : " (สำหรับคนโสด)")
      : "";

    ctx.fillStyle = "#7dd3fc";
    ctx.font = "600 22px 'Prompt', sans-serif";
    ctx.fillText(`คำพยากรณ์ไพ่ทาโรต์ 3 ใบ • ด้าน${rawCatName}${loveSuffix}`, W / 2, 252, W - 180);

    const dateStr = readingData.dateText || new Date(readingData.timestamp || Date.now()).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
    const metaText = [
      readingData.code ? `รหัสโค้ด: ${readingData.code}` : null,
      `วันที่พยากรณ์: ${dateStr}`
    ].filter(Boolean).join("   •   ");

    ctx.fillStyle = "#cbd5e1";
    ctx.font = "400 18px 'Prompt', sans-serif";
    ctx.fillText(metaText, W / 2, 286, W - 180);

    // เส้นคั่นประดับดาว
    const drawOrnamentalDivider = (yPos) => {
      ctx.save();
      ctx.strokeStyle = "rgba(243, 207, 122, 0.28)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(120, yPos);
      ctx.lineTo(W / 2 - 28, yPos);
      ctx.moveTo(W / 2 + 28, yPos);
      ctx.lineTo(W - 120, yPos);
      ctx.stroke();
      ctx.fillStyle = "#f3cf7a";
      ctx.font = "600 18px 'Prompt', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("✦", W / 2, yPos + 6);
      ctx.restore();
    };

    drawOrnamentalDivider(312);

    // 3. แสดงหน้าไพ่ทั้ง 3 ใบแบบไร้กรอบตารางทึบ
    const loadedImages = await Promise.all(cards.map(c => this.loadImage(c.image)));
    const cardW = 186;
    const cardH = 308;
    const gap = 82;
    const totalW = cards.length * cardW + (cards.length - 1) * gap;
    const startX = (W - totalW) / 2;
    const cardTopY = 348;

    for (let i = 0; i < cards.length; i++) {
      const c = cards[i];
      const x = startX + i * (cardW + gap);
      const img = loadedImages[i];

      ctx.textAlign = "center";
      ctx.fillStyle = "#f3cf7a";
      ctx.font = "600 17.5px 'Prompt', sans-serif";
      const shortPos = (c.positionTitle || `ใบที่ ${i + 1}`).split("—")[0].trim();
      ctx.fillText(shortPos, x + cardW / 2, cardTopY, cardW + 50);

      const boxY = cardTopY + 14;
      ctx.save();
      ctx.shadowColor = "rgba(0, 0, 0, 0.55)";
      ctx.shadowBlur = 18;
      ctx.fillStyle = "#08102b";
      this.drawRoundedRect(ctx, x, boxY, cardW, cardH, 12);
      ctx.fill();
      ctx.restore();

      if (img) {
        ctx.save();
        this.drawRoundedRect(ctx, x + 4, boxY + 4, cardW - 8, cardH - 8, 9);
        ctx.clip();
        if (c.isReversed) {
          ctx.translate(x + cardW / 2, boxY + cardH / 2);
          ctx.rotate(Math.PI);
          ctx.drawImage(img, -(cardW - 8) / 2, -(cardH - 8) / 2, cardW - 8, cardH - 8);
        } else {
          ctx.drawImage(img, x + 4, boxY + 4, cardW - 8, cardH - 8);
        }
        ctx.restore();
      }

      ctx.strokeStyle = "rgba(243, 207, 122, 0.85)";
      ctx.lineWidth = 2;
      this.drawRoundedRect(ctx, x, boxY, cardW, cardH, 12);
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.font = "700 18.5px 'Prompt', sans-serif";
      ctx.fillText(c.name_th || c.name_en, x + cardW / 2, boxY + cardH + 26, cardW + 60);

      ctx.fillStyle = c.isReversed ? "#fca5a5" : "#86efac";
      ctx.font = "500 15px 'Prompt', sans-serif";
      ctx.fillText(c.isReversed ? "ไพ่กลับหัว" : "ไพ่ตั้งตรง", x + cardW / 2, boxY + cardH + 48, cardW + 40);
    }

    drawOrnamentalDivider(736);

    // 4. คำพยากรณ์ไพ่แต่ละใบแบบ Editorial Flow (ไม่มีกรอบกล่องสี่เหลี่ยมล้อมรอบ ใช้เส้น Accent ด้านซ้ายและช่องไฟโปร่งสบายตา)
    let yCursor = 776;
    ctx.textAlign = "left";

    for (let i = 0; i < preparedCards.length; i++) {
      const item = preparedCards[i];

      // วงกลมเลขลำดับ 1, 2, 3
      ctx.save();
      ctx.beginPath();
      ctx.arc(112, yCursor - 7, 16, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(243, 207, 122, 0.18)";
      ctx.fill();
      ctx.strokeStyle = "#f3cf7a";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.textAlign = "center";
      ctx.fillStyle = "#fff1be";
      ctx.font = "700 17px 'Prompt', sans-serif";
      ctx.fillText(String(i + 1), 112, yCursor - 1);
      ctx.restore();

      // หัวข้อตำแหน่งไพ่ (ตัดบรรทัดอัตโนมัติ ไม่ล้นขอบขวา)
      ctx.textAlign = "left";
      ctx.fillStyle = "#f3cf7a";
      ctx.font = "700 22px 'Prompt', sans-serif";
      item.titleLines.forEach((tLine) => {
        ctx.fillText(tLine, textX, yCursor, contentW);
        yCursor += 32;
      });

      yCursor += 6;
      const bodyStartY = yCursor - 18;

      // เนื้อหาคำทำนายฉบับเต็ม
      ctx.fillStyle = "#f1f5f9";
      ctx.font = "400 20px 'Prompt', sans-serif";
      item.meaningLines.forEach((mLine) => {
        ctx.fillText(mLine, textX, yCursor, contentW);
        yCursor += 33;
      });

      // เส้น Accent สีทองแนวตั้งด้านซ้ายของย่อหน้า
      const bodyEndY = yCursor - 14;
      ctx.save();
      ctx.strokeStyle = "rgba(243, 207, 122, 0.45)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(112, bodyStartY);
      ctx.lineTo(112, Math.max(bodyStartY + 20, bodyEndY));
      ctx.stroke();
      ctx.restore();

      // เส้นคั่นบางๆ ระหว่างไพ่แต่ละใบ
      if (i < preparedCards.length - 1) {
        yCursor += 10;
        ctx.save();
        ctx.strokeStyle = "rgba(148, 163, 184, 0.16)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(textX, yCursor);
        ctx.lineTo(W - 114, yCursor);
        ctx.stroke();
        ctx.restore();
        yCursor += 28;
      } else {
        yCursor += 22;
      }
    }

    drawOrnamentalDivider(yCursor);
    yCursor += 44;

    // 5. ส่วนสรุปและวิเคราะห์ดวงชะตา + คำแนะนำและข้อควรระวัง (โปร่งโล่ง ไร้กรอบตารางอึดอัด)
    ctx.textAlign = "left";
    ctx.fillStyle = "#fff1be";
    ctx.font = "700 25px 'Prompt', sans-serif";
    summaryHeadingLines.forEach((hLine) => {
      ctx.fillText(hLine, textX, yCursor, contentW);
      yCursor += 34;
    });

    yCursor += 8;
    const analysisStartY = yCursor - 18;
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "400 20px 'Prompt', sans-serif";
    analysisLines.forEach((aLine) => {
      ctx.fillText(aLine, textX, yCursor, contentW);
      yCursor += 33;
    });

    ctx.save();
    ctx.strokeStyle = "rgba(56, 189, 248, 0.55)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(112, analysisStartY);
    ctx.lineTo(112, Math.max(analysisStartY + 20, yCursor - 14));
    ctx.stroke();
    ctx.restore();

    yCursor += 24;

    // คำแนะนำและแนวทางที่ควรทำ
    ctx.fillStyle = "#86efac";
    ctx.font = "700 22px 'Prompt', sans-serif";
    ctx.fillText("✅ คำแนะนำและแนวทางที่ควรทำ", textX, yCursor, contentW);
    yCursor += 34;

    const recStartY = yCursor - 18;
    ctx.fillStyle = "#f1f5f9";
    ctx.font = "400 19.5px 'Prompt', sans-serif";
    recWrappedGroups.forEach((group) => {
      group.forEach((rLine) => {
        ctx.fillText(rLine, textX, yCursor, contentW);
        yCursor += 32;
      });
      yCursor += 6;
    });

    ctx.save();
    ctx.strokeStyle = "rgba(134, 239, 172, 0.55)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(112, recStartY);
    ctx.lineTo(112, Math.max(recStartY + 20, yCursor - 18));
    ctx.stroke();
    ctx.restore();

    yCursor += 22;

    // ข้อควรระวัง
    ctx.fillStyle = "#fca5a5";
    ctx.font = "700 22px 'Prompt', sans-serif";
    ctx.fillText("⚠️ ข้อควรระวัง", textX, yCursor, contentW);
    yCursor += 34;

    const cautionStartY = yCursor - 18;
    ctx.fillStyle = "#ffe4e6";
    ctx.font = "400 19.5px 'Prompt', sans-serif";
    cautionLines.forEach((cLine) => {
      ctx.fillText(cLine, textX, yCursor, contentW);
      yCursor += 32;
    });

    ctx.save();
    ctx.strokeStyle = "rgba(252, 165, 165, 0.55)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(112, cautionStartY);
    ctx.lineTo(112, Math.max(cautionStartY + 20, yCursor - 14));
    ctx.stroke();
    ctx.restore();

    // Footer
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(186, 230, 253, 0.78)";
    ctx.font = "400 17px 'Prompt', sans-serif";
    ctx.fillText("เซียมซีทาโรต์ (SIAMSI TAROT • ORACLE)  •  เอกสารคำพยากรณ์ดวงชะตาเฉพาะบุคคล", W / 2, H - 72, W - 180);

    return this.canvasesToPdfBlob([canvas]);
  }

  /**
   * ดาวน์โหลดไฟล์ PDF ลงเครื่องทันที
   */
  async downloadReadingPdfFile(readingData, customFilename = "") {
    const pdfBlob = await this.generateReadingPdfBlob(readingData);
    if (!pdfBlob) return false;

    const codePart = readingData.code ? `_${readingData.code}` : "";
    const fileName = customFilename || `SiamSiTarot_${readingData.mode || "Reading"}${codePart}.pdf`;

    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 5000);
    return true;
  }

  /**
   * ดาวน์โหลดไฟล์รูป Info Card (.png) ลงเครื่อง
   */
  async downloadInfoImageFile(readingData) {
    let dataUrl = this.currentInfoDataUrl;
    if (!dataUrl || this.currentReadingData !== readingData) {
      const res = readingData.mode === "palm"
        ? await this.generatePalmInfoCard(readingData)
        : (readingData.mode === "siamsi"
          ? await this.generateSiamsiInfoCard(readingData)
          : await this.generateTarotInfoCard(readingData));
      dataUrl = res.dataUrl;
    }
    const codePart = readingData.code ? `_${readingData.code}` : "";
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `SiamSiTarot_InfoCard${codePart}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}

window.shareAndPdfEngine = new ShareAndPdfEngine();
