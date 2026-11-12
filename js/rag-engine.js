/**
 * เซียมซีทาโรต์ (SiamSi Tarot) - Brand Logo Theme Engine, NotebookLM RAG Engine & Dynamic Discipline Manager
 * 1. BrandThemeEngine : จัดการโลโก้แบรนด์ (assets/logo.svg หรือไฟล์ที่อัปโหลดใหม่) และดูดสีปรับธีมอัตโนมัติให้เข้ากับโลโก้
 * 2. RAGKnowledgeEngine : ระบบอัปโหลดตำราที่สรุปจาก Google NotebookLM (.md, .txt, .json) เพื่อดึงความรู้ (RAG) มาเสริมคำทำนายให้แม่นยำขึ้น
 * 3. DisciplineManager : ระบบเพิ่มศาสตร์พยากรณ์ใหม่ๆ จากหลังบ้าน (เช่น ไพ่พรหมญาณ, ออราเคิล, รูนส์, เลขมงคล)
 */

const STORAGE_KEY_BRAND = "siamsi_tarot_brand_theme_v2";
const STORAGE_KEY_RAG = "siamsi_tarot_rag_knowledge_v1";
const STORAGE_KEY_DISCIPLINES = "siamsi_tarot_custom_disciplines_v1";
const STORAGE_KEY_ADMIN_PIN = "siamsi_tarot_admin_passcode_v1";

const THEME_PRESETS = {
  "siamsi-astral-navy": {
    name: "SiamSi Tarot Astral Navy & Gold (ธีมต้นฉบับตามโลโก้ SIAMSI TAROT ORACLE)",
    goldPrimary: "#f3cf7a",
    goldBright: "#fff1be",
    goldDark: "#c7953d",
    accentPrimary: "#38bdf8",
    accentSecondary: "#a855f7",
    accentGlow: "rgba(56, 189, 248, 0.42)",
    bgDeep: "#040717",
    bgDark: "#080e29",
    bgCard: "rgba(11, 18, 48, 0.86)",
    infoBgTop: "#040717",
    infoBgMid: "#0a1336",
    infoBgBot: "#050819"
  },
  "royal-amethyst": {
    name: "Royal Amethyst & Gold (ม่วงเนบิวลา-ทองคำ)",
    goldPrimary: "#f5c542",
    goldBright: "#fef08a",
    goldDark: "#ca8a04",
    accentPrimary: "#9333ea",
    accentSecondary: "#22d3ee",
    accentGlow: "rgba(168, 85, 247, 0.42)",
    bgDeep: "#06020e",
    bgDark: "#0f0622",
    bgCard: "rgba(20, 9, 43, 0.84)",
    infoBgTop: "#0b0418",
    infoBgMid: "#190933",
    infoBgBot: "#090312"
  },
  "crimson-gold": {
    name: "Imperial Crimson & Gold (แดงจักรพรรดิ-ทองคำ)",
    goldPrimary: "#f5c542",
    goldBright: "#fff3b0",
    goldDark: "#d97706",
    accentPrimary: "#e11d48",
    accentSecondary: "#f59e0b",
    accentGlow: "rgba(225, 29, 72, 0.42)",
    bgDeep: "#09020f",
    bgDark: "#16051a",
    bgCard: "rgba(28, 7, 31, 0.84)",
    infoBgTop: "#140414",
    infoBgMid: "#2b0922",
    infoBgBot: "#0b020d"
  },
  "jade-emperor": {
    name: "Sacred Jade & Imperial Gold (หยกจักรพรรดิ-ทองคำ)",
    goldPrimary: "#fbbf24",
    goldBright: "#fef3c7",
    goldDark: "#b45309",
    accentPrimary: "#10b981",
    accentSecondary: "#38bdf8",
    accentGlow: "rgba(16, 185, 129, 0.38)",
    bgDeep: "#030d0b",
    bgDark: "#061e18",
    bgCard: "rgba(8, 33, 27, 0.84)",
    infoBgTop: "#04120e",
    infoBgMid: "#09261e",
    infoBgBot: "#030c09"
  }
};

class BrandThemeEngine {
  constructor() {
    this.settings = this._loadSettings();
    this.applyToDOM();
  }

  _loadSettings() {
    const defaults = {
      logoUrl: "assets/logo.jpg",
      brandTitle: "เซียมซีทาโรต์",
      brandSub: "SIAMSI TAROT ORACLE",
      themeKey: "siamsi-astral-navy",
      customColors: null
    };
    try {
      const raw = localStorage.getItem(STORAGE_KEY_BRAND);
      if (raw) {
        return { ...defaults, ...JSON.parse(raw) };
      }
    } catch (e) {}
    return defaults;
  }

  saveSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    try {
      localStorage.setItem(STORAGE_KEY_BRAND, JSON.stringify(this.settings));
    } catch (e) {}
    this.applyToDOM();
    return this.settings;
  }

  getActivePalette() {
    if (this.settings.themeKey === "custom" && this.settings.customColors) {
      return this.settings.customColors;
    }
    return THEME_PRESETS[this.settings.themeKey] || THEME_PRESETS["siamsi-astral-navy"];
  }

  getLogoUrl() {
    return this.settings.logoUrl || "assets/logo.jpg";
  }

  applyToDOM() {
    if (typeof document === "undefined") return;
    const palette = this.getActivePalette();
    const root = document.documentElement;
    if (root && palette) {
      root.style.setProperty("--gold-primary", palette.goldPrimary);
      root.style.setProperty("--gold-bright", palette.goldBright);
      root.style.setProperty("--gold-dark", palette.goldDark);
      root.style.setProperty("--accent-purple", palette.accentPrimary);
      root.style.setProperty("--accent-purple-glow", palette.accentGlow);
      root.style.setProperty("--bg-deep", palette.bgDeep);
      root.style.setProperty("--bg-dark", palette.bgDark);
      root.style.setProperty("--bg-card", palette.bgCard);
    }

    // Update all logo images on page
    const logoUrl = this.getLogoUrl();
    document.querySelectorAll(".brand-logo-img").forEach(img => {
      img.src = logoUrl;
    });
  }

  /**
   * สกัดสีหลักจากรูปโลโก้ที่ผู้ใช้อัปโหลด แล้วสร้างพาเลตต์สีเข้ากับโลโก้โดยอัตโนมัติ
   */
  extractColorsFromLogoDataUrl(dataUrl) {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          const size = 64;
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, size, size);
          const data = ctx.getImageData(0, 0, size, size).data;

          let rSum = 0, gSum = 0, bSum = 0, count = 0;
          let warmR = 245, warmG = 197, warmB = 66, maxLum = 0;

          for (let i = 0; i < data.length; i += 4) {
            const a = data[i + 3];
            if (a < 128) continue;
            const r = data[i], g = data[i + 1], b = data[i + 2];
            const lum = 0.299 * r + 0.587 * g + 0.114 * b;
            // Skip near-black and near-white pixels for accent average
            if (lum > 30 && lum < 235) {
              rSum += r;
              gSum += g;
              bSum += b;
              count++;
            }
            if (lum > maxLum && (r > g * 0.85)) {
              maxLum = lum;
              warmR = Math.min(255, Math.max(210, r));
              warmG = Math.min(230, Math.max(165, g));
              warmB = Math.min(140, Math.max(45, b));
            }
          }

          const avgR = count > 0 ? Math.round(rSum / count) : 185;
          const avgG = count > 0 ? Math.round(gSum / count) : 28;
          const avgB = count > 0 ? Math.round(bSum / count) : 72;

          const toHex = (n) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
          const accentHex = `#${toHex(avgR)}${toHex(avgG)}${toHex(avgB)}`;
          const goldHex = `#${toHex(warmR)}${toHex(warmG)}${toHex(warmB)}`;
          const bgDeepHex = `#${toHex(avgR * 0.12)}${toHex(avgG * 0.08)}${toHex(Math.max(14, avgB * 0.18))}`;
          const bgDarkHex = `#${toHex(avgR * 0.22)}${toHex(avgG * 0.14)}${toHex(Math.max(26, avgB * 0.28))}`;

          const customPalette = {
            name: "Auto-Synced Logo Theme (ดึงสีจากโลโก้อัตโนมัติ)",
            goldPrimary: goldHex,
            goldBright: "#fff3b0",
            goldDark: "#d97706",
            accentPrimary: accentHex,
            accentGlow: `rgba(${avgR}, ${avgG}, ${avgB}, 0.42)`,
            bgDeep: bgDeepHex,
            bgDark: bgDarkHex,
            bgCard: `rgba(${Math.round(avgR * 0.26)}, ${Math.round(avgG * 0.16)}, ${Math.max(30, Math.round(avgB * 0.32))}, 0.85)`,
            infoBgTop: bgDeepHex,
            infoBgMid: bgDarkHex,
            infoBgBot: bgDeepHex
          };
          resolve(customPalette);
        } catch (err) {
          resolve(THEME_PRESETS["crimson-gold"]);
        }
      };
      img.onerror = () => resolve(THEME_PRESETS["crimson-gold"]);
      img.src = dataUrl;
    });
  }
}

/**
 * ระบบคลังความรู้ตำราพยากรณ์ (NotebookLM / RAG Knowledge Base Engine)
 */
class RAGKnowledgeEngine {
  constructor() {
    this.documents = this._loadDocuments();
    this._ensureDefaultCorpus();
  }

  _loadDocuments() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_RAG);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return [];
  }

  _saveDocuments(docs) {
    this.documents = docs;
    try {
      localStorage.setItem(STORAGE_KEY_RAG, JSON.stringify(docs));
    } catch (e) {}
  }

  _ensureDefaultCorpus() {
    if (this.documents.length > 0) return;
    const now = Date.now();
    const content = `[ความรัก คนโสด] เมื่อไพ่ใบที่ 1 (อดีต) เป็นไพ่ธาตุถ้วยหรือไพ่เมเจอร์ใหญ่ สะท้อนว่าหัวใจผ่านบทเรียนสำคัญที่ทำให้รู้จักคุณค่าของตัวเองมากขึ้น ไพ่ใบที่ 3 (แนวโน้มในอนาคต) คือตัวชี้วัดจังหวะเวลาที่คนใหม่จะก้าวเข้ามา
[ความรัก ไม่โสด/มีคนในใจ] ไพ่ใบที่ 1 (ความรู้สึกเรา) แทนท่าทีและสิ่งที่คุณคาดหวังในใจ ส่วนไพ่ใบที่ 2 (ความรู้สึกอีกฝ่าย) แทนความรู้สึกแท้จริงที่เขาอาจไม่ได้พูดออกมาตรงๆ และไพ่ใบที่ 3 (แนวโน้มในอนาคต) คือบทสรุปทิศทางความสัมพันธ์ว่าจะพัฒนาไปในทิศทางใด
[การงาน] การเรียงแบบ อดีต ➔ ปัจจุบัน ➔ อนาคต ให้ดูน้ำหนักที่ไพ่ใบที่ 2 (สถานการณ์ปัจจุบัน) ควบคู่กับไพ่ใบที่ 3 (อนาคต) เพื่อวางกลยุทธ์รับมือและคว้าโอกาสสำคัญ
[การเงิน] ตำรา เหตุ ➔ ผล ➔ สรุป เน้นวิเคราะห์ต้นเหตุการใช้จ่ายในใบที่ 1 เพื่อแก้สภาพคล่องในใบที่ 2 และเปิดทางรับโชคลาภหรือผลตอบแทนในใบที่ 3
[สุขภาพ] ตำรา เหตุ ➔ ผล ➔ สรุป ให้ดูสมดุลธาตุของไพ่ทั้ง 3 ใบ เพื่อปรับพฤติกรรมการพักผ่อนและฟื้นฟูพลังชีวิต`;
    const chunks = this._splitIntoChunks(content);
    const starterDocs = [
      {
        id: "doc_default_master_tarot",
        title: "คัมภีร์เคล็ดลับการอ่านไพ่ 3 ใบตามตำแหน่ง (อดีต/ความรู้สึกเรา/เหตุ • ปัจจุบัน/ความรู้สึกอีกฝ่าย/ผล • อนาคต/สรุป)",
        source: "NotebookLM Summary",
        sourceType: "NotebookLM Summary",
        discipline: "tarot",
        targetScope: "tarot",
        uploadedAt: now,
        createdAt: now,
        chunks,
        chunksCount: chunks.length,
        content
      }
    ];
    this._saveDocuments(starterDocs);
  }

  getAllDocuments() {
    return this.documents.map(d => ({
      ...d,
      chunks: Array.isArray(d.chunks) ? d.chunks : this._splitIntoChunks(d.content),
      discipline: d.discipline || d.targetScope || "tarot",
      source: d.source || d.sourceType || "NotebookLM",
      uploadedAt: d.uploadedAt || d.createdAt || Date.now()
    }));
  }

  /**
   * แบ่งเนื้อหาสรุปจาก NotebookLM ออกเป็นย่อหน้า/หัวข้อย่อย (Chunks) เพื่อค้นหาด้วย RAG
   */
  _splitIntoChunks(text) {
    if (!text) return [];
    return String(text)
      .split(/\n{2,}|(?=^#{1,3}\s)|(?=^\[)/m)
      .map(s => s.trim())
      .filter(s => s.length >= 15);
  }

  addDocument({ title, content, source = "NotebookLM", sourceType = "NotebookLM", discipline = "tarot", targetScope = "all" }) {
    if (!content || !content.trim()) {
      throw new Error("กรุณาใส่เนื้อหาสรุปตำรา หรือเลือกไฟล์ที่ต้องการอัปโหลด");
    }
    const chunks = this._splitIntoChunks(content);
    const scope = discipline || targetScope || "tarot";
    const now = Date.now();
    const doc = {
      id: "rag-" + now + "-" + Math.random().toString(36).substring(2, 6),
      title: (title && title.trim()) ? title.trim() : `ตำราพยากรณ์ NotebookLM (${new Date().toLocaleDateString("th-TH")})`,
      source: source || sourceType,
      sourceType: source || sourceType,
      discipline: scope,
      targetScope: scope,
      uploadedAt: now,
      createdAt: now,
      chunks,
      chunksCount: chunks.length,
      content: content.trim()
    };
    const docs = this._loadDocuments();
    docs.unshift(doc);
    this._saveDocuments(docs);
    return doc;
  }

  async uploadKnowledgeDocument(params) {
    return this.addDocument(params);
  }

  deleteDocument(docId) {
    const docs = this._loadDocuments().filter(d => d.id !== docId);
    this._saveDocuments(docs);
    return docs;
  }

  /**
   * ค้นหาความรู้จากคลัง RAG (NotebookLM) ที่ตรงกับไพ่ใบที่จับได้ + หมวดหมู่ + ตำแหน่ง
   */
  retrieveCardInsight({ card, isReversed, category, loveStatus, positionTitle }) {
    const docs = this.documents.filter(d => d.targetScope === "all" || d.targetScope === "tarot");
    if (docs.length === 0 || !card) return "";

    const cardNameTh = (card.name_th || "").toLowerCase();
    const cardNameEn = (card.name_en || "").toLowerCase();
    const catNameMap = { love: "ความรัก", career: "การงาน", finance: "การเงิน", health: "สุขภาพ" };
    const catKw = catNameMap[category] || "";
    const statusKw = category === "love" ? (loveStatus === "single" ? "คนโสด" : "มีคนในใจ") : "";
    const orientKw = isReversed ? "กลับหัว" : "ตั้งตรง";

    let bestChunk = "";
    let bestScore = 0;

    for (const doc of docs) {
      const chunks = this._splitIntoChunks(doc.content);
      for (const chunk of chunks) {
        const lower = chunk.toLowerCase();
        let score = 0;

        // ต้องตรงกับชื่อไพ่ใบนั้นๆ จึงจะดึงคำทำนายเฉพาะไพ่ใบนั้นมาแสดง
        const matchesCardName = (cardNameTh && lower.includes(cardNameTh)) ||
          (cardNameEn && lower.includes(cardNameEn)) ||
          (card.id && lower.includes(card.id.toLowerCase()));

        if (!matchesCardName) continue;

        score += 10;
        if (catKw && lower.includes(catKw)) score += 4;
        if (statusKw && lower.includes(statusKw)) score += 3;
        if (lower.includes(orientKw)) score += 2;
        if (positionTitle) {
          const shortPos = positionTitle.split("—")[0].replace(/ใบที่\s*\d+\s*:\s*/, "").trim().toLowerCase();
          if (shortPos && lower.includes(shortPos)) score += 3;
        }

        if (score > bestScore) {
          bestScore = score;
          bestChunk = chunk.replace(/^#+\s*/, "").trim();
        }
      }
    }

    return bestScore >= 10 ? bestChunk : "";
  }

  /**
   * ดึงเคล็ดลับภาพรวมจากคลังตำรา NotebookLM มาเสริมในกล่องบทสรุปฟันธง
   */
  retrieveSpreadSynthesis({ drawnCards = [], category = "love", loveStatus = "couple" }) {
    const docs = this.documents.filter(d => d.targetScope === "all" || d.targetScope === "tarot");
    if (docs.length === 0) return "";

    const catTagMap = {
      love_single: "ความรัก คนโสด",
      love_couple: "ความรัก ไม่โสด",
      career: "การงาน",
      finance: "การเงิน",
      health: "สุขภาพ"
    };
    const key = category === "love" ? (loveStatus === "single" ? "love_single" : "love_couple") : category;
    const targetTag = catTagMap[key] || "";
    const cardNames = drawnCards.map(item => (item.card ? item.card.name_th : "")).filter(Boolean);

    let matchedChunk = "";
    let maxScore = 0;

    for (const doc of docs) {
      const chunks = this._splitIntoChunks(doc.content);
      for (const chunk of chunks) {
        let score = 0;
        for (const cName of cardNames) {
          if (cName && chunk.includes(cName)) score += 5;
        }
        if (targetTag && chunk.includes(targetTag.split(" ")[0])) score += 2;
        if (key === "love_single" && chunk.includes("คนโสด")) score += 3;
        if (key === "love_couple" && (chunk.includes("ความรู้สึกเรา") || chunk.includes("ความรู้สึกอีกฝ่าย") || chunk.includes("ไม่โสด"))) score += 3;

        if (score > maxScore && score >= 5) {
          maxScore = score;
          matchedChunk = chunk.replace(/^\[[^\]]+\]\s*/, "").replace(/^#+\s*/, "").trim();
        }
      }
    }

    return matchedChunk;
  }

  getNotebookLMPromptTemplate() {
    return `โปรดสรุปตำราพยากรณ์ฉบับนี้เพื่อนำไปใช้เป็นฐานข้อมูล RAG สำหรับระบบ "เซียมซีทาโรต์" โดยจัดรูปแบบแยกเป็นหัวข้อดังนี้:

1. ระบุชื่อไพ่ทาโรต์ (ทั้งภาษาไทยและอังกฤษ เช่น The Lovers / ไพ่เดอะเลิฟเวอร์) หรือ หมายเลขใบเซียมซี
2. แยกคำทำนายเฉพาะด้านให้ชัดเจน:
   - [ความรัก คนโสด] (สำหรับการเรียงไพ่: อดีต ➔ ปัจจุบัน ➔ แนวโน้มในอนาคต)
   - [ความรัก ไม่โสด/มีคนในใจ] (สำหรับการเรียงไพ่: ความรู้สึกเรา ➔ ความรู้สึกอีกฝ่าย ➔ แนวโน้มในอนาคต)
   - [การงาน] (อดีต ➔ ปัจจุบัน ➔ อนาคต)
   - [การเงิน] (เหตุ ➔ ผล ➔ สรุป)
   - [สุขภาพ] (เหตุ ➔ ผล ➔ สรุป)
3. สรุปเคล็ดลับการอ่านไพ่เมื่อปรากฏในตำแหน่งที่ 1, 2, หรือ 3 และแนวทางแก้ไขเสริมดวงแบบกระชับ เข้าใจง่าย ไม่วกวน`;
  }
}

window.brandThemeEngine = new BrandThemeEngine();
window.ragEngine = new RAGKnowledgeEngine();
