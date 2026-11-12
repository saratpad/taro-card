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
   * ตัดข้อความให้พอดีกับความกว้างใน Canvas
   */
  wrapTextLines(ctx, text, maxWidth) {
    if (!text) return [];
    const clean = String(text).replace(/\s+/g, " ").trim();
    // สำหรับภาษาไทย ใช้ Intl.Segmenter ถ้ามี หรือตัดตามตัวอักษร/คำ
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
      const testLine = currentLine + word;
      if (ctx.measureText(testLine).width > maxWidth && currentLine.length > 0) {
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
    const spreadText = readingData.spreadFormula ? `  |  ตำรา: ${readingData.spreadFormula}` : "";
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
    ctx.fillText(domainLabel, W / 2, 195);

    const dateStr = readingData.dateText || new Date(readingData.timestamp || Date.now()).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
    const codeTag = readingData.code ? `รหัสโค้ด: ${readingData.code}` : "";
    const seekerTag = readingData.customerName ? `เจ้าชะตา: ${readingData.customerName}` : "";
    const metaLine = [seekerTag, codeTag, dateStr].filter(Boolean).join("   •   ");

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
    ctx.fillText(`🔮 บทสรุปฟันธง: ${readingData.verdictBadge || ""}`, 94, verdictY + 42);

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
   * สร้างข้อความคำทำนายฉบับเต็ม สำหรับโพสต์โซเชียล / วางในคอมเมนต์ต่อท้ายรูป Info
   */
  buildFullSocialCaption(readingData) {
    if (!readingData) return "";

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
        `#เซียมซีทาโรต์ #ดูดวง #เสี่ยงเซียมซี`;
    }

    // สำหรับไพ่ทาโรต์ 3 ใบ
    const cardsText = (readingData.cards || []).map((c, idx) => {
      const orient = c.isReversed ? "ไพ่กลับหัว" : "ไพ่ตั้งตรง";
      return `🎴 ใบที่ ${idx + 1}: ${c.positionTitle}\n` +
        `• ได้ไพ่: ${c.name_th} (${c.name_en}) [${orient}]\n` +
        `• คำทำนายด้าน${readingData.categoryName}: ${c.domainMeaning}\n` +
        `• สารเตือนใจ: "${c.advice}"`;
    }).join("\n\n");

    const seekerLine = readingData.customerName ? `👤 ผู้รับคำทำนาย: ${readingData.customerName}\n` : "";

    return `🔮 ผลคำทำนายดวงชะตา "เซียมซีทาโรต์" (ไพ่ทาโรต์ 3 ใบ) 🔮\n` +
      seekerLine +
      `🏷️ หมวดหมู่ที่เลือกดู: ด้าน${readingData.categoryName}\n` +
      `🌟 แนวโน้มดวงชะตา: ${readingData.verdictBadge}\n\n` +
      `━━━━━━━━━━━━━━━\n` +
      `📖 คำทำนายไพ่ทั้ง 3 ใบฉบับเต็ม\n` +
      `━━━━━━━━━━━━━━━\n\n` +
      `${cardsText}\n\n` +
      `━━━━━━━━━━━━━━━\n` +
      `✨ บทสรุปฟันธง & คำแนะนำ\n` +
      `━━━━━━━━━━━━━━━\n` +
      `${readingData.verdictPlain}\n\n` +
      `✅ สิ่งที่ควรทำ: ${readingData.doAction}\n` +
      `⚠️ ข้อควรระวัง: ${readingData.dontAction}\n\n` +
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
   * วาดใบคำทำนายฉบับเต็มลง Canvas ขนาด A4 ความละเอียดสูง เพื่อแปลงเป็นไฟล์ PDF
   */
  async generateReadingPdfBlob(readingData) {
    if (!readingData) return null;

    if (readingData.mode === "siamsi") {
      const { canvas: infoCanvas } = await this.generateSiamsiInfoCard(readingData);
      return this.canvasesToPdfBlob([infoCanvas]);
    }

    // สำหรับไพ่ทาโรต์ 3 ใบ: สร้างเอกสารใบพยากรณ์ A4 ความละเอียดสูง (1240 x 1754 px)
    const canvas = document.createElement("canvas");
    const W = 1240;
    const H = 1754;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");

    // พื้นหลังสีเข้มขลังหรูหราอ่านง่าย
    const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
    bgGrad.addColorStop(0, "#0d051c");
    bgGrad.addColorStop(0.5, "#16092e");
    bgGrad.addColorStop(1, "#0b0416");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // กรอบทองประดับใบรับรองคำทำนาย
    ctx.strokeStyle = "#f5c542";
    ctx.lineWidth = 4;
    this.drawRoundedRect(ctx, 36, 36, W - 72, H - 72, 20);
    ctx.stroke();

    ctx.strokeStyle = "rgba(245, 197, 66, 0.35)";
    ctx.lineWidth = 1.5;
    this.drawRoundedRect(ctx, 48, 48, W - 96, H - 96, 14);
    ctx.stroke();

    // หัวกระดาษ
    ctx.textAlign = "center";
    ctx.fillStyle = "#f5c542";
    ctx.font = "700 42px 'Prompt', sans-serif";
    ctx.fillText("🔮 เซียมซีทาโรต์ (SIAMSI TAROT)", W / 2, 112);

    ctx.fillStyle = "#fde68a";
    ctx.font = "600 26px 'Prompt', sans-serif";
    ctx.fillText(`ใบรับรองคำทำนายดวงชะตาไพ่ทาโรต์ 3 ใบ • หมวด${readingData.categoryName || ""}`, W / 2, 158);

    const dateStr = readingData.dateText || new Date(readingData.timestamp || Date.now()).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
    const metaText = [
      readingData.customerName ? `ผู้รับคำทำนาย: ${readingData.customerName}` : null,
      readingData.code ? `รหัสโค้ด: ${readingData.code}` : null,
      `วันที่พยากรณ์: ${dateStr}`
    ].filter(Boolean).join("   |   ");

    ctx.fillStyle = "#c4b5fd";
    ctx.font = "400 20px 'Prompt', sans-serif";
    ctx.fillText(metaText, W / 2, 196);

    // แถบรูปไพ่ทั้ง 3 ใบ
    const cards = readingData.cards || [];
    const loadedImages = await Promise.all(cards.map(c => this.loadImage(c.image)));
    const cardW = 210;
    const cardH = 350;
    const gap = 70;
    const totalW = cards.length * cardW + (cards.length - 1) * gap;
    const startX = (W - totalW) / 2;
    const cardTopY = 230;

    for (let i = 0; i < cards.length; i++) {
      const c = cards[i];
      const x = startX + i * (cardW + gap);
      const img = loadedImages[i];

      ctx.fillStyle = "#f5c542";
      ctx.font = "600 18px 'Prompt', sans-serif";
      const shortPos = (c.positionTitle || `ตำแหน่งที่ ${i + 1}`).split("—")[0].trim();
      ctx.fillText(shortPos, x + cardW / 2, cardTopY);

      const boxY = cardTopY + 14;
      ctx.fillStyle = "#120726";
      this.drawRoundedRect(ctx, x, boxY, cardW, cardH, 12);
      ctx.fill();

      if (img) {
        ctx.save();
        this.drawRoundedRect(ctx, x + 5, boxY + 5, cardW - 10, cardH - 10, 9);
        ctx.clip();
        if (c.isReversed) {
          ctx.translate(x + cardW / 2, boxY + cardH / 2);
          ctx.rotate(Math.PI);
          ctx.drawImage(img, -(cardW - 10) / 2, -(cardH - 10) / 2, cardW - 10, cardH - 10);
        } else {
          ctx.drawImage(img, x + 5, boxY + 5, cardW - 10, cardH - 10);
        }
        ctx.restore();
      }

      ctx.strokeStyle = "#f5c542";
      ctx.lineWidth = 2.5;
      this.drawRoundedRect(ctx, x, boxY, cardW, cardH, 12);
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.font = "700 20px 'Prompt', sans-serif";
      ctx.fillText(c.name_th || c.name_en, x + cardW / 2, boxY + cardH + 28);

      ctx.fillStyle = c.isReversed ? "#fca5a5" : "#86efac";
      ctx.font = "500 16px 'Prompt', sans-serif";
      ctx.fillText(c.isReversed ? "[ ไพ่กลับหัว ]" : "[ ไพ่ตั้งตรง ]", x + cardW / 2, boxY + cardH + 52);
    }

    // รายละเอียดคำทำนายของไพ่แต่ละใบ (ฉบับเต็ม)
    let yCursor = 665;
    ctx.textAlign = "left";

    for (let i = 0; i < cards.length; i++) {
      const c = cards[i];
      const boxH = 240;

      ctx.fillStyle = "rgba(28, 14, 56, 0.9)";
      this.drawRoundedRect(ctx, 72, yCursor, W - 144, boxH, 16);
      ctx.fill();
      ctx.strokeStyle = "rgba(245, 197, 66, 0.4)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      const orient = c.isReversed ? "ไพ่กลับหัว (Reversed)" : "ไพ่ตั้งตรง (Upright)";
      ctx.fillStyle = "#f5c542";
      ctx.font = "700 22px 'Prompt', sans-serif";
      ctx.fillText(`${c.positionTitle}  •  ไพ่ ${c.name_th} [${orient}]`, 100, yCursor + 40);

      ctx.fillStyle = "#f3e8ff";
      ctx.font = "400 19px 'Prompt', sans-serif";
      const meaningLines = this.wrapTextLines(ctx, c.domainMeaning || "", W - 200).slice(0, 4);
      meaningLines.forEach((line, lIdx) => {
        ctx.fillText(line, 100, yCursor + 78 + lIdx * 28);
      });

      ctx.fillStyle = "#fde68a";
      ctx.font = "500 18px 'Prompt', sans-serif";
      const adviceLines = this.wrapTextLines(ctx, `✦ สารเตือนใจ: "${c.advice || ""}"`, W - 200).slice(0, 1);
      if (adviceLines[0]) {
        ctx.fillText(adviceLines[0], 100, yCursor + boxH - 22);
      }

      yCursor += boxH + 22;
    }

    // กล่องบทสรุปฟันธง & คำแนะนำปฏิบัติ
    const sumY = yCursor + 6;
    const sumH = H - sumY - 82;
    ctx.fillStyle = "rgba(245, 197, 66, 0.12)";
    this.drawRoundedRect(ctx, 72, sumY, W - 144, sumH, 16);
    ctx.fill();
    ctx.strokeStyle = "#f5c542";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "#f5c542";
    ctx.font = "700 23px 'Prompt', sans-serif";
    ctx.fillText(`🌟 บทสรุปฟันธง (${readingData.verdictBadge || ""})`, 100, sumY + 40);

    ctx.fillStyle = "#ffffff";
    ctx.font = "400 19px 'Prompt', sans-serif";
    const vLines = this.wrapTextLines(ctx, readingData.verdictPlain || "", W - 200).slice(0, 3);
    vLines.forEach((line, idx) => {
      ctx.fillText(line, 100, sumY + 74 + idx * 27);
    });

    const doY = sumY + 166;
    ctx.fillStyle = "#86efac";
    ctx.font = "600 18px 'Prompt', sans-serif";
    const doLines = this.wrapTextLines(ctx, `✅ สิ่งที่ควรทำ: ${readingData.doAction || ""}`, W - 200).slice(0, 2);
    doLines.forEach((l, idx) => ctx.fillText(l, 100, doY + idx * 25));

    const dontY = doY + doLines.length * 25 + 10;
    ctx.fillStyle = "#fca5a5";
    ctx.font = "600 18px 'Prompt', sans-serif";
    const dontLines = this.wrapTextLines(ctx, `⚠️ ข้อควรระวัง: ${readingData.dontAction || ""}`, W - 200).slice(0, 2);
    dontLines.forEach((l, idx) => ctx.fillText(l, 100, dontY + idx * 25));

    ctx.textAlign = "center";
    ctx.fillStyle = "#a78bfa";
    ctx.font = "400 17px 'Prompt', sans-serif";
    ctx.fillText("เซียมซีทาโรต์ (SiamSi Tarot) • เอกสารคำทำนายดวงชะตาเฉพาะบุคคล", W / 2, H - 50);

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
      const res = readingData.mode === "siamsi"
        ? await this.generateSiamsiInfoCard(readingData)
        : await this.generateTarotInfoCard(readingData);
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
