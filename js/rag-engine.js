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

const STORAGE_KEY_RAG_CUSTOM = "siamsi_tarot_rag_custom_v2";
const STORAGE_KEY_RAG_ACTIVE = "siamsi_tarot_rag_active_v1";

const DISCIPLINE_META = {
  tarot: {
    id: "tarot",
    icon: "🔮",
    label: "ไพ่ทาโรต์ (Tarot 3-Card)",
    shortLabel: "ไพ่ทาโรต์",
    controlMode: "admin",
    defaultBookId: "tarot_classic_rw"
  },
  palm: {
    id: "palm",
    icon: "✋",
    label: "หัตถศาสตร์ / สแกนลายมือ",
    shortLabel: "สแกนลายมือ",
    controlMode: "admin",
    defaultBookId: "palm_thai_classical"
  },
  siamsi: {
    id: "siamsi",
    icon: "🎋",
    label: "เซียมซีศักดิ์สิทธิ์ (Siamsi)",
    shortLabel: "เซียมซี",
    controlMode: "viewer",
    defaultBookId: "siamsi_wongtaisin"
  }
};

const DEFAULT_ACTIVE_BOOKS = {
  tarot: "tarot_classic_rw",
  palm: "palm_thai_classical",
  siamsi: "viewer_choice"
};

function buildBuiltinTextbooks() {
  const baseTs = 1731542400000;
  return [
    // =========================================================================
    // 1. TAROT TEXTBOOKS (คลังตำราไพ่ทาโรต์ - Admin เลือกใช้ได้)
    // =========================================================================
    {
      id: "tarot_classic_rw",
      discipline: "tarot",
      targetScope: "tarot",
      isBuiltIn: true,
      title: "คัมภีร์ทาโรต์มาตรฐาน Rider-Waite & เคล็ดลับอ่าน 3 ตำแหน่ง",
      source: "ตำราหลักในระบบ (Standard Classic)",
      sourceType: "Built-in Standard",
      styleTag: "มาตรฐาน Rider-Waite • ชัดเจน ตรงไปตรงมา",
      description: "ตีความตามสัญลักษณ์ Rider-Waite ดั้งเดิม เชื่อมโยงลำดับเหตุและผลของไพ่ 3 ตำแหน่งอย่างสมดุล",
      uploadedAt: baseTs,
      createdAt: baseTs,
      content: `[ความรัก คนโสด] ไพ่ใบที่ 1 (อดีต) สะท้อนบทเรียนหัวใจที่ผ่านมา ไพ่ใบที่ 2 (ปัจจุบัน) แสดงเสน่ห์และโอกาสที่กำลังเปิดรับ และไพ่ใบที่ 3 (แนวโน้มในอนาคต) ชี้ทิศทางคนที่กำลังจะก้าวเข้ามาในชีวิต
[ความรัก ไม่โสด/มีคนในใจ] ไพ่ใบที่ 1 (ความรู้สึกเรา) แสดงความคาดหวังในใจคุณ ไพ่ใบที่ 2 (ความรู้สึกอีกฝ่าย) เปิดมุมมองความรู้สึกแท้จริงของอีกฝ่าย และไพ่ใบที่ 3 (แนวโน้มในอนาคต) คือบทสรุปการพัฒนาความสัมพันธ์
[การงาน] ดูพัฒนาการจากรากฐานเดิม (ใบที่ 1) สู่ภารกิจปัจจุบัน (ใบที่ 2) และผลลัพธ์ความสำเร็จหรือจุดเปลี่ยนที่ต้องเตรียมรับมือ (ใบที่ 3)
[การเงิน] ใช้โครงสร้าง เหตุ (พฤติกรรมการเงิน) ➔ ผล (สภาพคล่องปัจจุบัน) ➔ สรุป (โอกาสรับทรัพย์และความมั่นคงระยะถัดไป)
[สุขภาพ] ประเมินสมดุลพลังงานกายใจจากพฤติกรรมสะสมเดิม เพื่อปรับการพักผ่อนและดูแลตัวเองให้ถูกจุด`
    },
    {
      id: "tarot_modern_psych",
      discipline: "tarot",
      targetScope: "tarot",
      isBuiltIn: true,
      title: "ตำราไพ่ทาโรต์จิตวิทยาเชิงลึก & Mindset ยุคใหม่",
      source: "ตำราหลักในระบบ (Modern Psychology)",
      sourceType: "Built-in Psychology",
      styleTag: "วิเคราะห์จิตใจ • เหตุ-ผลเชิงพฤติกรรม • พัฒนาตนเอง",
      description: "เจาะลึกสภาวะอารมณ์ กลไกจิตใต้สำนึก รูปแบบความผูกพัน (Attachment) และการตัดสินใจเชิงกลยุทธ์ที่ใช้ได้จริงในชีวิตประจำวัน",
      uploadedAt: baseTs - 1000,
      createdAt: baseTs - 1000,
      content: `[ความรัก คนโสด] ถอดรหัสรูปแบบจิตใต้สำนึกในการเลือกคู่ (Pattern Recognition) ช่วยให้รู้ว่าคุณกำลังดึงดูดคนแบบใด และควรปรับ Mindset จุดไหนเพื่อเจอความรักที่ดีต่อใจ
[ความรัก ไม่โสด/มีคนในใจ] วิเคราะห์ภาษาความรักและกลไกป้องกันตัวเองของทั้งสองฝ่าย (Emotional Triggers) เพื่อสื่อสารอย่างเข้าใจแทนการคาดเดา
[การงาน] เน้นภาวะผู้นำ การจัดการความเครียดจากงาน (Burnout Prevention) และจุดแข็งเชิงทักษะที่ควรหยิบมาใช้ต่อรอง
[การเงิน] ถอดพฤติกรรมการใช้เงินตามอารมณ์ (Emotional Spending) สู่การวางระบบการเงินที่สร้างความอุ่นใจระยะยาว
[สุขภาพ] ดูสัญญาณความล้าทางจิตใจที่ส่งผลต่อร่างกาย พร้อมแนวทางปรับจังหวะชีวิตและการพักฟื้นแบบ Mind-Body Balance`
    },
    {
      id: "tarot_karma_spiritual",
      discipline: "tarot",
      targetScope: "tarot",
      isBuiltIn: true,
      title: "ตำราทาโรต์สายมู เคล็ดกรรม วาสนา & พิธีเสริมดวง",
      source: "ตำราหลักในระบบ (Karma & Spiritual)",
      sourceType: "Built-in Spiritual",
      styleTag: "กรรมลิขิต • บุญวาสนา • เคล็ดทำบุญเสริมชะตา",
      description: "ตีความหน้าไพ่ผ่านแรงอธิษฐาน บุพเพสันนิวาส จังหวะวิบากกรรม และแนะนำเคล็ดทำบุญแก้ชะตาให้เข้ากับพลังงานไพ่ที่เปิดได้",
      uploadedAt: baseTs - 2000,
      createdAt: baseTs - 2000,
      content: `[ความรัก คนโสด] อ่านจังหวะบุพเพสันนิวาสและแรงดึงดูดทางจิตวิญญาณ พร้อมเคล็ดไหว้ขอพรเมตตามหานิยมเพื่อเปิดทางให้คู่บุญพบกันไวขึ้น
[ความรัก ไม่โสด/มีคนในใจ] ตรวจกระแสกรรมสัมพันธ์และความปรองดองระหว่างสองดวงใจ แนะนำการทำบุญร่วมกันหรือถวายแสงสว่างลดแรงกระทบกระทั่ง
[การงาน] เสริมบารมีเมตตาจากผู้ใหญ่และสิ่งศักดิ์สิทธิ์ประจำสายงาน แนะนำวันมงคลและวิธีแก้เคล็ดอุปสรรคติดขัด
[การเงิน] เปิดกระแสโชคลาภและทานบารมี ตามหลักธาตุของไพ่ทั้ง 3 ใบ เพื่อลดรายจ่ายรั่วไหลและหนุนโภคทรัพย์
[สุขภาพ] ปรับธาตุในกายให้สมดุล สวดมนต์ทำสมาธิแผ่เมตตาให้เจ้ากรรมนายเวร เพื่อความเบาสบายใจและฟื้นพลังชีวิต`
    },

    // =========================================================================
    // 2. PALM TEXTBOOKS (คลังตำราหัตถศาสตร์ / สแกนลายมือ - Admin เลือกใช้ได้)
    // =========================================================================
    {
      id: "palm_thai_classical",
      discipline: "palm",
      targetScope: "palm",
      isBuiltIn: true,
      title: "คัมภีร์หัตถศาสตร์ไทย-จีนโบราณ (มือซ้ายกรรมเดิม • มือขวาปัจจุบัน)",
      source: "ตำราหลักในระบบ (Classical Thai-Chinese)",
      sourceType: "Built-in Classical Palmistry",
      styleTag: "เทียบซ้าย-ขวา • บุญบารมีเดิม • เสริมมงคลชีวิต",
      description: "ผสานตำราหัตถศาสตร์ไทยและจีนโบราณ เปรียบเทียบวาสนาเดิมบนมือซ้ายกับการลงมือสร้างปัจจุบันบนมือขวา พร้อมเคล็ดเสริมบารมี",
      uploadedAt: baseTs,
      createdAt: baseTs,
      content: `[สุขภาพ และพลังชีวิต] ดูความสมบูรณ์ของเส้นชีวิตและเนินศุกร์ตามตำราไทย-จีน เพื่อวัดทุนธาตุไฟและแรงกายที่ติดตัวมาแต่กำเนิด
[ความคิด การงาน และการตัดสินใจ] พิจารณาเส้นสมองร่วมกับเนินพฤหัสและเนินเสาร์ เพื่อชี้แนวทางอาชีพที่ถูกโฉลกและมีผู้ใหญ่อุปถัมภ์
[ความรัก และความสัมพันธ์] วิเคราะห์เส้นหัวใจจากขอบมือถึงโคนนิ้ว เพื่อบอกลักษณะคู่บุญและวิธีประคับประคองครอบครัวให้ร่มเย็น
[การเงิน โอกาส และความมั่นคง] เจาะจงเส้นวาสนาและเส้นอาทิตย์ในฐานะเครื่องหมายโภคทรัพย์ ยศถาบรรดาศักดิ์ และโชคลาภจากการขยันทำมาหากิน
[คำแนะนำดวงชะตา] ภาพรวมจังหวะชีวิตและการปรับสมดุลกายใจตามรูปเนินและเส้นลายมือทั้ง 2 ข้างอย่างพอดี`
    },
    {
      id: "palm_western_chirology",
      discipline: "palm",
      targetScope: "palm",
      isBuiltIn: true,
      title: "ตำราหัตถศาสตร์สากล & จิตวิทยาพฤติกรรม (Modern Chirology)",
      source: "ตำราหลักในระบบ (Behavioral Chirology)",
      sourceType: "Built-in Chirology",
      styleTag: "วิเคราะห์พฤติกรรม • ศักยภาพสมอง • วิทยาศาสตร์ชีวิต",
      description: "แปลความเส้นลายมือและเนินฝ่ามือเชิงจิตวิทยาพฤติกรรม สไตล์การคิด การสื่อสาร และการบริหารพลังงานให้เหมาะกับคนทำงานยุคใหม่",
      uploadedAt: baseTs - 1000,
      createdAt: baseTs - 1000,
      content: `[สุขภาพ และพลังชีวิต] ประเมินอัตราการฟื้นตัวของร่างกายและความสมดุลระบบประสาทจากความโค้งของเส้นชีวิตและการใช้พลังงาน
[ความคิด การงาน และการตัดสินใจ] จำแนกโครงสร้างความคิดเชิงตรรกะ (เส้นตรง) กับความคิดสร้างสรรค์/เห็นอกเห็นใจผู้อื่น (เส้นโค้งสู่เนินจันทร์)
[ความรัก และความสัมพันธ์] อธิบายรูปแบบการแสดงออกทางอารมณ์ ความต้องการพื้นที่ส่วนตัว และการสื่อสารกับคนใกล้ตัวตามเส้นหัวใจ
[การเงิน โอกาส และความมั่นคง] วิเคราะห์ความถนัดด้านการสร้างคุณค่า วินัยการจัดการ และโอกาสเติบโตทางอาชีพจากความต่อเนื่องของเส้นวาสนา
[คำแนะนำดวงชะตา] มุมมองเรื่องการแบ่งเวลาพักผ่อนและการดูแลพลังใจให้สอดคล้องกับลักษณะเส้นลายมือโดยรวม`
    },
    {
      id: "palm_wealth_career",
      discipline: "palm",
      targetScope: "palm",
      isBuiltIn: true,
      title: "ตำราลายมือเศรษฐี เส้นวาสนา การงาน และโอกาสทางธุรกิจ",
      source: "ตำราหลักในระบบ (Wealth & Career Focus)",
      sourceType: "Built-in Business Palmistry",
      styleTag: "เจาะลึกการเงิน • เส้นวาสนา & อาทิตย์ • จังหวะธุรกิจ",
      description: "เน้นวิเคราะห์เส้นวาสนา เส้นอาทิตย์ เส้นพุธ และเนินสำคัญที่ชี้จุดทำเงิน เครดิตความน่าเชื่อถือ และการต่อยอดธุรกิจ",
      uploadedAt: baseTs - 2000,
      createdAt: baseTs - 2000,
      content: `[สุขภาพ และพลังชีวิต] ประเมินความอึดและขีดความสามารถในการลุยงานใหญ่โดยไม่หมดไฟระหว่างทาง
[ความคิด การงาน และการตัดสินใจ] เน้นกลยุทธ์การตัดสินใจ จังหวะขยายงาน การบริหารคน และบทบาทผู้นำหรือผู้เชี่ยวชาญเฉพาะทาง
[ความรัก และความสัมพันธ์] อ่านความสมดุลระหว่างเวลาการทำงานกับการดูแลคู่ชีวิต รวมถึงเกณฑ์ได้คู่คิดคู่สร้างคู่สมหนุนฐานะ
[การเงิน โอกาส และความมั่นคง] ถอดรหัสจุดเริ่มต้นเส้นวาสนา (ฐานมือ vs เนินจันทร์) ร่วมกับเส้นอาทิตย์และเส้นพุธ เพื่อชี้ช่องทางรับทรัพย์ที่เหมาะที่สุด
[คำแนะนำดวงชะตา] แนวโน้มจังหวะการวางแผนงาน การเงิน และความสม่ำเสมอในระยะยาวอย่างค่อยเป็นค่อยไป`
    },

    // =========================================================================
    // 3. SIAMSI TEXTBOOKS (คลังตำราเซียมซี - ผู้ดูเลือกเองได้หน้าเว็บ)
    // =========================================================================
    {
      id: "siamsi_wongtaisin",
      discipline: "siamsi",
      targetScope: "siamsi",
      deckKey: "wongtaisin",
      isBuiltIn: true,
      enabledForViewer: true,
      title: "ตำราเซียมซีหว่องไทซิน ต้นฉบับ 100 ใบ (เบอร์ 00–99)",
      source: "ตำราหลักในระบบ (Wong Tai Sin)",
      sourceType: "Built-in 100-Stick Deck",
      styleTag: "บทกลอนจีนโบราณ • ประวัติตำนาน • พยากรณ์ 7 ด้าน",
      description: "คัมภีร์เซียมซีศาลเจ้าหว่องไทซินครบ 100 ใบ (00-99) พร้อมบทกลอนจีน-ไทย ตำนานเปรียบเทียบในอดีต และคำทำนายครบ 7 ด้าน",
      uploadedAt: baseTs,
      createdAt: baseTs,
      content: `[ภาพรวมตำราเซียมซีหว่องไทซิน] ตำราเซียมซีศักดิ์สิทธิ์สายเต๋าจากฮ่องกง โดดเด่นเรื่องบทกลอนอุปมาที่แม่นยำ ระดับโชคชะตา และเรื่องราวบุคคลในประวัติศาสตร์จีน
[การเลือกใช้หน้าเว็บ] ผู้ดูสามารถกดเลือกสลับระหว่างตำรา "หว่องไทซิน" และ "หลวงพ่อทันใจ" ได้โดยตรงทั้งบนแท่นบูชา สารบัญ และหน้าแสดงผลคำทำนาย`
    },
    {
      id: "siamsi_tanjai",
      discipline: "siamsi",
      targetScope: "siamsi",
      deckKey: "tanjai",
      isBuiltIn: true,
      enabledForViewer: true,
      title: "ตำราเซียมซีหลวงพ่อทันใจ ต้นฉบับ 100 ใบ (เบอร์ 01–100)",
      source: "ตำราหลักในระบบ (Luang Por Tanjai)",
      sourceType: "Built-in 100-Stick Deck",
      styleTag: "ตำราศักดิ์สิทธิ์ไทย-ล้านนา • คำทำนายตรงประเด็น 7 ด้าน",
      description: "คัมภีร์เซียมซีหลวงพ่อทันใจ 100 ใบ คำทำนายชัดเจนตรงประเด็นในภาษาเข้าใจง่าย พร้อมคำแนะนำการอธิษฐานขอพรให้สำเร็จไว",
      uploadedAt: baseTs - 1000,
      createdAt: baseTs - 1000,
      content: `[ภาพรวมตำราเซียมซีหลวงพ่อทันใจ] โดดเด่นเรื่องความเมตตา คำทำนายกระชับตรงจุดในเรื่องอาชีพ การเงิน ความรัก สุขภาพ การเรียน และครอบครัว
[การเลือกใช้หน้าเว็บ] ผู้ดูสามารถกดเลือกตำราเซียมซีหลวงพ่อทันใจได้เองอย่างอิสระบนหน้าแท่นบูชาเซียมซี`
    }
  ].map(book => ({
    ...book,
    chunks: RAGKnowledgeEngine.splitTextIntoChunks(book.content)
  }));
}

/**
 * ระบบคลังความรู้ตำราพยากรณ์ (NotebookLM / RAG Knowledge Base Engine)
 * แยกคลังตำราตาม 3 ศาสตร์หลัก (ไพ่ทาโรต์, หัตถศาสตร์/ลายมือ, เซียมซี)
 * - ไพ่ทาโรต์ & สแกนลายมือ: Admin เลือกตั้งค่าได้ว่าศาสตร์นี้ใช้ตำราใด
 * - เซียมซี: ผู้ดู (Customer/Viewer) เป็นผู้เลือกตำราเองได้หน้าเว็บ
 */
class RAGKnowledgeEngine {
  constructor() {
    this.customDocuments = this._loadCustomDocuments();
    this.activeBooks = this._loadActiveBooks();
    this._syncPromise = null;
    this.readyPromise = this.syncFromServer();
  }

  static splitTextIntoChunks(text) {
    if (!text) return [];
    return String(text)
      .split(/\n{2,}|(?=^#{1,3}\s)|(?=^\[)/m)
      .map(s => s.trim())
      .filter(s => s.length >= 12);
  }

  _splitIntoChunks(text) {
    return RAGKnowledgeEngine.splitTextIntoChunks(text);
  }

  _normalizeCustomDoc(doc) {
    if (!doc) return null;
    const rawDisc = doc.discipline || doc.targetScope || "tarot";
    const discipline = ["tarot", "palm", "siamsi"].includes(rawDisc) ? rawDisc : "tarot";
    const chunks = Array.isArray(doc.chunks) && doc.chunks.length > 0
      ? doc.chunks
      : this._splitIntoChunks(doc.content || "");
    return {
      ...doc,
      isBuiltIn: false,
      discipline,
      targetScope: discipline,
      enabledForViewer: doc.enabledForViewer !== false,
      source: doc.source || doc.sourceType || "NotebookLM Upload",
      sourceType: doc.sourceType || doc.source || "NotebookLM Upload",
      uploadedAt: doc.uploadedAt || doc.createdAt || Date.now(),
      chunks,
      chunksCount: chunks.length
    };
  }

  _loadCustomDocuments() {
    try {
      const rawV2 = localStorage.getItem(STORAGE_KEY_RAG_CUSTOM);
      if (rawV2) {
        const parsed = JSON.parse(rawV2);
        if (Array.isArray(parsed)) {
          return parsed
            .filter(d => d && d.id && d.id !== "doc_default_master_tarot" && !d.isBuiltIn)
            .map(d => this._normalizeCustomDoc(d))
            .filter(Boolean);
        }
      }
      // Migrate legacy v1 custom uploads (skip legacy hardcoded default)
      const rawV1 = localStorage.getItem(STORAGE_KEY_RAG);
      if (rawV1) {
        const parsedV1 = JSON.parse(rawV1);
        if (Array.isArray(parsedV1)) {
          const migrated = parsedV1
            .filter(d => d && d.id && d.id !== "doc_default_master_tarot")
            .map(d => this._normalizeCustomDoc(d))
            .filter(Boolean);
          if (migrated.length > 0) {
            localStorage.setItem(STORAGE_KEY_RAG_CUSTOM, JSON.stringify(migrated));
          }
          return migrated;
        }
      }
    } catch (e) {}
    return [];
  }

  _saveCustomDocuments(docs) {
    const cleaned = (docs || [])
      .filter(d => d && !d.isBuiltIn)
      .map(d => this._normalizeCustomDoc(d))
      .filter(Boolean);
    this.customDocuments = cleaned;
    try {
      localStorage.setItem(STORAGE_KEY_RAG_CUSTOM, JSON.stringify(cleaned));
    } catch (e) {}
  }

  _normalizeActiveMap(raw) {
    const src = (raw && typeof raw === "object") ? raw : {};
    return {
      tarot: (typeof src.tarot === "string" && src.tarot.trim()) ? src.tarot.trim() : DEFAULT_ACTIVE_BOOKS.tarot,
      palm: (typeof src.palm === "string" && src.palm.trim()) ? src.palm.trim() : DEFAULT_ACTIVE_BOOKS.palm,
      siamsi: "viewer_choice"
    };
  }

  _loadActiveBooks() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_RAG_ACTIVE);
      if (raw) {
        return this._normalizeActiveMap(JSON.parse(raw));
      }
    } catch (e) {}
    return { ...DEFAULT_ACTIVE_BOOKS };
  }

  _saveActiveBooks(map) {
    const normalized = this._normalizeActiveMap(map);
    this.activeBooks = normalized;
    try {
      localStorage.setItem(STORAGE_KEY_RAG_ACTIVE, JSON.stringify(normalized));
    } catch (e) {}
    return normalized;
  }

  _notifyUpdated() {
    if (typeof window !== "undefined" && typeof window.dispatchEvent === "function") {
      try {
        window.dispatchEvent(new CustomEvent("rag-engine-updated", {
          detail: { activeBooks: this.getActiveBooksMap() }
        }));
      } catch (_) {}
    }
  }

  async _apiJson(url, options = {}) {
    if (typeof fetch !== "function") return null;
    try {
      const controller = new AbortController();
      const tid = setTimeout(() => controller.abort(), 2000);
      const res = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {})
        },
        signal: controller.signal
      });
      clearTimeout(tid);
      if (!res.ok) return null;
      return await res.json();
    } catch (_) {
      return null;
    }
  }

  async syncFromServer() {
    if (this._syncPromise) return this._syncPromise;
    this._syncPromise = (async () => {
      const data = await this._apiJson("/api/rag-docs");
      if (data && Array.isArray(data.docs)) {
        const serverCustom = data.docs
          .filter(d => d && d.id && d.id !== "doc_default_master_tarot" && !d.isBuiltIn)
          .map(d => this._normalizeCustomDoc(d))
          .filter(Boolean);
        // Merge server custom docs cleanly (server is authoritative when available)
        if (serverCustom.length > 0 || this.customDocuments.length === 0) {
          this._saveCustomDocuments(serverCustom);
        }
      }
      if (data && data.activeBooks && typeof data.activeBooks === "object") {
        this._saveActiveBooks(data.activeBooks);
      }
      this._notifyUpdated();
      this._syncPromise = null;
      return { docs: this.getAllDocuments(), activeBooks: this.getActiveBooksMap() };
    })();
    return this._syncPromise;
  }

  getDisciplineMeta(discipline) {
    return DISCIPLINE_META[discipline] || DISCIPLINE_META.tarot;
  }

  getAllDisciplinesMeta() {
    return [DISCIPLINE_META.tarot, DISCIPLINE_META.palm, DISCIPLINE_META.siamsi];
  }

  getBuiltInDocuments(discipline = null) {
    const all = buildBuiltinTextbooks();
    return discipline ? all.filter(b => b.discipline === discipline) : all;
  }

  getDocumentsByDiscipline(discipline = "tarot") {
    const disc = ["tarot", "palm", "siamsi"].includes(discipline) ? discipline : "tarot";
    const builtIns = this.getBuiltInDocuments(disc);
    const custom = this.customDocuments.filter(d => d.discipline === disc || d.targetScope === "all");
    const activeMap = this.getActiveBooksMap();
    const activeId = activeMap[disc];

    const combined = [...custom, ...builtIns];
    return combined.map(doc => ({
      ...doc,
      chunks: Array.isArray(doc.chunks) && doc.chunks.length > 0 ? doc.chunks : this._splitIntoChunks(doc.content || ""),
      isActive: disc === "siamsi"
        ? (doc.isBuiltIn || doc.enabledForViewer !== false)
        : (doc.id === activeId)
    }));
  }

  getAllDocuments() {
    return [
      ...this.getDocumentsByDiscipline("tarot"),
      ...this.getDocumentsByDiscipline("palm"),
      ...this.getDocumentsByDiscipline("siamsi")
    ];
  }

  getActiveBooksMap() {
    const map = this._normalizeActiveMap(this.activeBooks);
    // Validate tarot & palm point to existing docs
    for (const disc of ["tarot", "palm"]) {
      const builtIns = this.getBuiltInDocuments(disc);
      const custom = this.customDocuments.filter(d => d.discipline === disc || d.targetScope === "all");
      const allIds = new Set([...custom, ...builtIns].map(d => d.id));
      if (!allIds.has(map[disc])) {
        map[disc] = DISCIPLINE_META[disc].defaultBookId;
      }
    }
    return map;
  }

  getActiveBook(discipline = "tarot") {
    const disc = ["tarot", "palm", "siamsi"].includes(discipline) ? discipline : "tarot";
    const docs = this.getDocumentsByDiscipline(disc);

    if (disc === "siamsi") {
      let viewerDeck = "wongtaisin";
      try {
        viewerDeck = localStorage.getItem("mystic_siamsi_deck") || "wongtaisin";
      } catch (_) {}
      const targetId = viewerDeck === "tanjai" ? "siamsi_tanjai" : "siamsi_wongtaisin";
      return docs.find(d => d.id === targetId) || docs[0] || null;
    }

    const activeId = this.getActiveBooksMap()[disc];
    return docs.find(d => d.id === activeId) || docs.find(d => d.id === DISCIPLINE_META[disc].defaultBookId) || docs[0] || null;
  }

  getViewerEnabledSiamsiSupplements() {
    return this.customDocuments
      .filter(d => d.discipline === "siamsi" && d.enabledForViewer !== false)
      .map(d => ({ ...d }));
  }

  async setActiveBook(discipline, bookId) {
    if (discipline === "siamsi") {
      throw new Error("ศาสตร์เซียมซีเปิดให้ผู้ดูเลือกตำราเองได้หน้าเว็บ ไม่สามารถล็อกตำราจากหลังบ้าน");
    }
    if (discipline !== "tarot" && discipline !== "palm") {
      throw new Error("ศาสตร์พยากรณ์ไม่ถูกต้อง");
    }
    const docs = this.getDocumentsByDiscipline(discipline);
    const target = docs.find(d => d.id === bookId);
    if (!target) {
      throw new Error("ไม่พบตำราที่เลือกในคลังศาสตร์นี้");
    }

    const updated = this._saveActiveBooks({
      ...this.activeBooks,
      [discipline]: bookId
    });

    await this._apiJson("/api/rag-active", {
      method: "POST",
      body: JSON.stringify({ discipline, bookId })
    });

    this._notifyUpdated();
    return updated;
  }

  async setSiamsiDocViewerEnabled(docId, enabled) {
    const docs = this._loadCustomDocuments();
    const idx = docs.findIndex(d => d.id === docId);
    if (idx === -1) return null;
    docs[idx].enabledForViewer = Boolean(enabled);
    this._saveCustomDocuments(docs);

    await this._apiJson(`/api/rag-docs/${encodeURIComponent(docId)}`, {
      method: "PATCH",
      body: JSON.stringify({ enabledForViewer: Boolean(enabled) })
    });

    this._notifyUpdated();
    return docs[idx];
  }

  addDocument({ title, content, source = "NotebookLM Upload", sourceType = "NotebookLM Upload", discipline = "tarot", targetScope = "tarot" }) {
    if (!content || !content.trim()) {
      throw new Error("กรุณาใส่เนื้อหาสรุปตำรา หรือเลือกไฟล์ที่ต้องการอัปโหลด");
    }
    const rawDisc = discipline || targetScope || "tarot";
    const cleanDisc = ["tarot", "palm", "siamsi"].includes(rawDisc) ? rawDisc : "tarot";
    const chunks = this._splitIntoChunks(content);
    const now = Date.now();
    const doc = this._normalizeCustomDoc({
      id: "rag-" + now + "-" + Math.random().toString(36).substring(2, 6),
      title: (title && title.trim()) ? title.trim() : `ตำรา${DISCIPLINE_META[cleanDisc].shortLabel} (NotebookLM)`,
      source: source || sourceType,
      sourceType: sourceType || source,
      styleTag: `ตำราอัปโหลด NotebookLM • ${chunks.length} หัวข้อ`,
      description: `อัปโหลดเพิ่มเติมสำหรับศาสตร์${DISCIPLINE_META[cleanDisc].shortLabel}`,
      discipline: cleanDisc,
      targetScope: cleanDisc,
      enabledForViewer: true,
      uploadedAt: now,
      createdAt: now,
      chunks,
      chunksCount: chunks.length,
      content: content.trim()
    });
    const docs = this._loadCustomDocuments();
    docs.unshift(doc);
    this._saveCustomDocuments(docs);
    return doc;
  }

  async uploadKnowledgeDocument(params = {}) {
    const activateAfterUpload = params.activateAfterUpload === true;
    const doc = this.addDocument(params);
    if (activateAfterUpload && (doc.discipline === "tarot" || doc.discipline === "palm")) {
      this._saveActiveBooks({
        ...this.activeBooks,
        [doc.discipline]: doc.id
      });
    }
    await this._apiJson("/api/rag-docs", {
      method: "POST",
      body: JSON.stringify({ ...doc, activateAfterUpload })
    });
    this._notifyUpdated();
    return doc;
  }

  async deleteDocument(docId) {
    const builtInIds = new Set(buildBuiltinTextbooks().map(b => b.id));
    if (builtInIds.has(docId)) {
      throw new Error("ไม่สามารถลบตำราหลักในระบบได้");
    }
    const docs = this._loadCustomDocuments().filter(d => d.id !== docId);
    this._saveCustomDocuments(docs);

    const nextActive = { ...this.activeBooks };
    if (nextActive.tarot === docId) nextActive.tarot = DEFAULT_ACTIVE_BOOKS.tarot;
    if (nextActive.palm === docId) nextActive.palm = DEFAULT_ACTIVE_BOOKS.palm;
    this._saveActiveBooks(nextActive);

    await this._apiJson(`/api/rag-docs/${encodeURIComponent(docId)}`, {
      method: "DELETE"
    });
    this._notifyUpdated();
    return this.getAllDocuments();
  }

  // ===========================================================================
  // TAROT RETRIEVAL (อ้างอิงเฉพาะตำราไพ่ทาโรต์ที่ Admin เลือกใช้งาน)
  // ===========================================================================
  retrieveCardInsight({ card, isReversed, category, loveStatus, positionTitle }) {
    const activeBook = this.getActiveBook("tarot");
    if (!activeBook || !card) return "";

    const chunks = activeBook.chunks || this._splitIntoChunks(activeBook.content || "");
    const cardNameTh = (card.name_th || "").toLowerCase();
    const cardNameEn = (card.name_en || "").toLowerCase();
    const catNameMap = { love: "ความรัก", career: "การงาน", finance: "การเงิน", health: "สุขภาพ" };
    const catKw = catNameMap[category] || "";
    const statusKw = category === "love" ? (loveStatus === "single" ? "คนโสด" : "มีคนในใจ") : "";
    const orientKw = isReversed ? "กลับหัว" : "ตั้งตรง";
    const shortPos = positionTitle
      ? positionTitle.split("—")[0].replace(/ใบที่\s*\d+\s*:\s*/, "").trim().toLowerCase()
      : "";

    let bestCardChunk = "";
    let bestCardScore = 0;
    let bestGeneralChunk = "";
    let bestGeneralScore = 0;

    for (const chunk of chunks) {
      const lower = chunk.toLowerCase();
      const matchesCardName =
        (cardNameTh && lower.includes(cardNameTh)) ||
        (cardNameEn && lower.includes(cardNameEn)) ||
        (card.id && lower.includes(card.id.toLowerCase()));

      let score = 0;
      if (catKw && lower.includes(catKw)) score += 4;
      if (statusKw && lower.includes(statusKw)) score += 4;
      if (lower.includes(orientKw)) score += 2;
      if (shortPos && lower.includes(shortPos)) score += 3;

      const cleanChunk = chunk.replace(/^#+\s*/, "").replace(/^\[[^\]]+\]\s*/, "").trim();
      if (matchesCardName) {
        const total = score + 10;
        if (total > bestCardScore) {
          bestCardScore = total;
          bestCardChunk = cleanChunk;
        }
      } else if (score > bestGeneralScore) {
        bestGeneralScore = score;
        bestGeneralChunk = cleanChunk;
      }
    }

    if (bestCardChunk) return bestCardChunk;

    // Built-in distinct textbook interpretive lens per selected Tarot tradition
    const kw = (isReversed ? card.reversed?.keywords?.th?.[0] : card.upright?.keywords?.th?.[0]) || "";
    const advice = (isReversed ? card.reversed?.advice?.th : card.upright?.advice?.th) || "";
    const cleanPos = shortPos || "ตำแหน่งนี้";

    if (!activeBook.isBuiltIn && bestGeneralChunk) {
      return `${bestGeneralChunk} (เชื่อมโยงกับไพ่ ${card.name_th}: เด่นเรื่อง "${kw}")`;
    }
    if (!activeBook.isBuiltIn && chunks.length > 0) {
      return `${chunks[0].replace(/^#+\s*/, "").replace(/^\[[^\]]+\]\s*/, "").trim()} — สะท้อนผ่านหน้าไพ่ ${card.name_th} ("${kw}")`;
    }

    if (activeBook.id === "tarot_modern_psych") {
      const psychFocus = {
        love: loveStatus === "single"
          ? `เชิงจิตวิทยาความรัก: พลังงานของ "${kw}" ใน${cleanPos} สะท้อนเกณฑ์ภายในใจที่ใช้วัดความปลอดภัยทางอารมณ์`
          : `เชิงจิตวิทยาความสัมพันธ์: "${kw}" ใน${cleanPos} แสดงวิธีตอบสนองและขอบเขตทางอารมณ์ระหว่างคุณกับอีกฝ่าย`,
        career: `มุมมองพฤติกรรมการทำงาน: "${kw}" ใน${cleanPos} บอกถึงรูปแบบการรับมือความกดดันและกลยุทธ์ที่ช่วยให้คุมเกมงานได้มั่นคง`,
        finance: `จิตวิทยาการเงิน: "${kw}" ใน${cleanPos} ชี้ให้สังเกตแรงจูงใจในการใช้จ่ายและจังหวะวางแผนสำรองอย่างมีสติ`,
        health: `สมดุล Mind-Body: "${kw}" ใน${cleanPos} สะท้อนความเครียดสะสมที่ส่งผลต่อพลังงานกาย แนะนำให้ปรับจังหวะพักสมอง`
      };
      return `${psychFocus[category] || psychFocus.career} ${advice ? `• แนวคิดปรับใช้: ${advice}` : ""}`.trim();
    }

    if (activeBook.id === "tarot_karma_spiritual") {
      const karmaFocus = {
        love: loveStatus === "single"
          ? `ตำราเคล็ดกรรมความรัก: ไพ่ ${card.name_th} ใน${cleanPos} บอกจังหวะบุญวาสนาเปิดทางผ่าน "${kw}" แนะนำทำบุญด้วยดอกไม้หอมหรือของคู่เพื่อเสริมเมตตา`
          : `ตำรากรรมสัมพันธ์: "${kw}" ใน${cleanPos} เป็นตัวเชื่อมบุญเก่าและบทเรียนใจของทั้งคู่ แนะนำลดทิฐิและทำบุญร่วมกันเพื่อลดแรงปะทะ`,
        career: `ตำราวาสนาการงาน: "${kw}" ใน${cleanPos} ชี้จังหวะเปิดดวงผู้ใหญ่เมตตา หมั่นสวดมนต์ตั้งจิตก่อนเริ่มงานใหญ่และรักษาสัจจะ`,
        finance: `ตำราเปิดทรัพย์: พลัง "${kw}" ใน${cleanPos} แนะนำหมั่นแบ่งปันทานบารมีและเก็บออมให้เป็นระเบียบเพื่อรับโชคลาภระยะยาว`,
        health: `ตำราปรับธาตุเสริมชะตา: "${kw}" ใน${cleanPos} แนะนำแผ่เมตตาให้เจ้ากรรมนายเวร พักผ่อนให้เพียงพอเพื่อปรับสมดุลธาตุในกาย`
      };
      return `${karmaFocus[category] || karmaFocus.career}`.trim();
    }

    // Default tarot_classic_rw
    if (bestGeneralChunk) {
      return `${bestGeneralChunk} • สำหรับ${cleanPos}ของไพ่ ${card.name_th} ให้ยึดแก่นเรื่อง "${kw}" เป็นหลัก`;
    }
    return `ตามคัมภีร์มาตรฐาน (${cleanPos}): พลัง "${kw}" จากไพ่ ${card.name_th} คือกุญแจสำคัญในการขับเคลื่อนสถานการณ์${catKw || ""}`;
  }

  retrieveSpreadSynthesis({ drawnCards = [], category = "love", loveStatus = "couple", verdictType = "neutral" }) {
    const activeBook = this.getActiveBook("tarot");
    if (!activeBook) return null;

    const chunks = activeBook.chunks || this._splitIntoChunks(activeBook.content || "");
    const catNameMap = { love: "ความรัก", career: "การงาน", finance: "การเงิน", health: "สุขภาพ" };
    const catKw = catNameMap[category] || "";
    const statusKw = category === "love" ? (loveStatus === "single" ? "คนโสด" : "ไม่โสด") : "";
    const cardNames = drawnCards.map(item => (item.card ? item.card.name_th : "")).filter(Boolean);

    let matchedChunk = "";
    let maxScore = 0;

    for (const chunk of chunks) {
      let score = 0;
      for (const cName of cardNames) {
        if (cName && chunk.includes(cName)) score += 5;
      }
      if (catKw && chunk.includes(catKw)) score += 3;
      if (statusKw && chunk.includes(statusKw)) score += 4;
      if (score > maxScore) {
        maxScore = score;
        matchedChunk = chunk.replace(/^\[[^\]]+\]\s*/, "").replace(/^#+\s*/, "").trim();
      }
    }

    if (!matchedChunk && chunks.length > 0) {
      matchedChunk = chunks[0].replace(/^\[[^\]]+\]\s*/, "").replace(/^#+\s*/, "").trim();
    }

    return {
      bookId: activeBook.id,
      bookTitle: activeBook.title,
      styleTag: activeBook.styleTag || activeBook.source,
      isBuiltIn: Boolean(activeBook.isBuiltIn),
      synthesisText: matchedChunk,
      verdictType
    };
  }

  // ===========================================================================
  // PALM READING RETRIEVAL (อ้างอิงเฉพาะตำราลายมือที่ Admin เลือกใช้งาน)
  // ===========================================================================
  retrievePalmReadingInsights({ leftScan, rightScan, baseAspects = {} }) {
    const activeBook = this.getActiveBook("palm");
    if (!activeBook) return null;

    const chunks = activeBook.chunks || this._splitIntoChunks(activeBook.content || "");
    const rLines = (rightScan && rightScan.lines) || (leftScan && leftScan.lines) || {};
    const lLines = (leftScan && leftScan.lines) || {};

    const aspectKeywords = {
      life: ["สุขภาพ", "พลังชีวิต", "เส้นชีวิต", "life", "เนินศุกร์", "ร่างกาย"],
      intellect: ["ความคิด", "การงาน", "เส้นสมอง", "head", "ตัดสินใจ", "บริหาร"],
      love: ["ความรัก", "เส้นหัวใจ", "heart", "คู่ครอง", "สัมพันธ์"],
      wealth: ["การเงิน", "วาสนา", "เส้นวาสนา", "เส้นอาทิตย์", "fate", "sun", "ธุรกิจ", "โชค"],
      guidance: ["คำแนะนำดวงชะตา", "คำแนะนำ", "ดวงชะตา", "จังหวะชีวิต", "เส้นพุธ", "mercury", "สมดุล"]
    };

    const aspectInsights = {};
    Object.keys(aspectKeywords).forEach((aspKey) => {
      const kws = aspectKeywords[aspKey];
      let bestChunk = "";
      let bestScore = 0;

      for (const chunk of chunks) {
        let score = 0;
        for (const kw of kws) {
          if (chunk.toLowerCase().includes(kw.toLowerCase())) score += 3;
        }
        if (score > bestScore) {
          bestScore = score;
          bestChunk = chunk.replace(/^\[[^\]]+\]\s*/, "").replace(/^#+\s*/, "").trim();
        }
      }

      if (!activeBook.isBuiltIn) {
        if (!bestChunk && chunks.length > 0) {
          bestChunk = chunks[0].replace(/^\[[^\]]+\]\s*/, "").replace(/^#+\s*/, "").trim();
        }
        aspectInsights[aspKey] = bestChunk;
        return;
      }

      // Tailored built-in textbook lens per aspect (neutral phrasing without callout bloat)
      if (activeBook.id === "palm_western_chirology") {
        const chiroMap = {
          life: "ตามแนวหัตถศาสตร์สากล ลักษณะส่วนโค้งเส้นชีวิตและฐานนิ้วโป้งสะท้อนจังหวะการฟื้นตัวและการใช้พลังงานของร่างกาย",
          intellect: `ตามแนวหัตถศาสตร์สากล เส้นสมอง${rLines.head?.traits?.slope === "curved_moon" ? "ที่โค้งลงด้านข้าง" : "ที่ทอดตัวเป็นแนวชัดเจน"}บ่งบอกสไตล์การคิดและการสื่อสารในชีวิตประจำวัน`,
          love: "แนวเส้นหัวใจบ่งบอกสไตล์การแสดงออกทางความรู้สึก การให้พื้นที่ และวิธีประคับประคองความสัมพันธ์กับคนใกล้ตัว",
          wealth: "ความต่อเนื่องของเส้นวาสนาและเส้นอาทิตย์สะท้อนวินัยในการทำงานและการค่อยๆ สะสมความมั่นคงในระยะยาว",
          guidance: "ภาพรวมดวงชะตาเหมาะกับการรักษาสมดุลระหว่างเวลาทำงานกับการพักผ่อน เพื่อประคองพลังใจให้สบายต่อเนื่อง"
        };
        aspectInsights[aspKey] = chiroMap[aspKey] || bestChunk;
      } else if (activeBook.id === "palm_wealth_career") {
        const hasFate = Boolean(rLines.fate?.detected || lLines.fate?.detected);
        const hasSun = Boolean(rLines.sun?.detected || lLines.sun?.detected);
        const wealthMap = {
          life: "ตามแนวตำราลายมือการงาน พลังชีวิตและฐานมือเป็นตัวแทนของความอดทนและความต่อเนื่องเมื่อต้องรับผิดชอบภาระงานหลายด้าน",
          intellect: "แนวเส้นสมองสะท้อนจังหวะการตัดสินใจและการวางแผนงานในระยะยาวอย่างรอบคอบ",
          love: "แนวเส้นหัวใจชี้ให้เห็นความสำคัญของการแบ่งเวลาให้สมดุลระหว่างภาระหน้าที่กับคนรอบตัว",
          wealth: `ตามลักษณะเส้นวาสนาและเส้นอาทิตย์บนฝ่ามือ ${(hasFate && hasSun) ? "มีเกณฑ์ได้รับการยอมรับจากผลงานและผู้ใหญ่ให้ความไว้วางใจ" : "มีแนวโน้มเติบโตจากงานที่ถนัดและความสม่ำเสมอทีละขั้น"}`,
          guidance: "ภาพรวมดวงชะตาเหมาะกับการค่อยๆ สร้างความน่าเชื่อถือและวางแผนสำรองเรื่องงานและเงินอย่างพอเหมาะพอดี"
        };
        aspectInsights[aspKey] = wealthMap[aspKey] || bestChunk;
      } else {
        // palm_thai_classical
        aspectInsights[aspKey] = bestChunk || "";
      }
    });

    const lensSummaryLabel = activeBook.id === "palm_western_chirology"
      ? "วิเคราะห์ตามตำราหัตถศาสตร์สากล (Modern Chirology)"
      : (activeBook.id === "palm_wealth_career"
        ? "วิเคราะห์ตามตำราลายมือเศรษฐี การงานและการเงิน"
        : (activeBook.isBuiltIn ? "วิเคราะห์ตามคัมภีร์หัตถศาสตร์ไทย-จีนโบราณ" : `อ้างอิงตำรา: ${activeBook.title}`));

    return {
      bookId: activeBook.id,
      bookTitle: activeBook.title,
      styleTag: activeBook.styleTag || activeBook.source,
      isBuiltIn: Boolean(activeBook.isBuiltIn),
      lensSummaryLabel,
      aspectInsights
    };
  }

  // ===========================================================================
  // SIAMSI SUPPLEMENT RETRIEVAL (อ้างอิงตำราที่ผู้ดูเลือกเองหน้าเว็บ)
  // ===========================================================================
  retrieveSiamsiSupplement({ sign, deck = "wongtaisin", customBookId = "" }) {
    if (!sign || !customBookId) return null;
    const enabledCustom = this.getViewerEnabledSiamsiSupplements();
    const book = enabledCustom.find(d => d.id === customBookId);
    if (!book) return null;

    const chunks = book.chunks || this._splitIntoChunks(book.content || "");
    const numStr = String(sign.number || "");
    const fortune = String(sign.fortune_level || "");
    let bestChunk = "";
    let bestScore = 0;

    for (const chunk of chunks) {
      let score = 0;
      if (numStr && (chunk.includes(`เบอร์ ${numStr}`) || chunk.includes(`ใบที่ ${sign.stick_num || sign.id}`) || chunk.includes(numStr))) score += 8;
      if (fortune && chunk.includes(fortune)) score += 4;
      if (chunk.includes(deck === "tanjai" ? "ทันใจ" : "หว่องไทซิน")) score += 2;
      if (score > bestScore) {
        bestScore = score;
        bestChunk = chunk.replace(/^\[[^\]]+\]\s*/, "").replace(/^#+\s*/, "").trim();
      }
    }

    if (!bestChunk && chunks.length > 0) {
      bestChunk = chunks[0].replace(/^\[[^\]]+\]\s*/, "").replace(/^#+\s*/, "").trim();
    }

    return bestChunk
      ? { bookId: book.id, bookTitle: book.title, text: bestChunk }
      : null;
  }

  getNotebookLMPromptTemplate(discipline = "tarot") {
    if (discipline === "palm") {
      return `โปรดสรุปตำราหัตถศาสตร์ (สแกนลายมือ) ฉบับนี้เป็นฐานข้อมูล RAG โดยจัดหัวข้อแยกให้ชัดเจนดังนี้:

1. แยกหัวข้อด้วยเครื่องหมายวงเล็บเหลี่ยมดังนี้:
   - [สุขภาพ และพลังชีวิต] (หลักเกณฑ์ดูเส้นชีวิต และเนินศุกร์ มือซ้ายเทียบมือขวา)
   - [ความคิด การงาน และการตัดสินใจ] (หลักเกณฑ์ดูเส้นสมอง ความโค้ง ความยาว และเนินพฤหัส)
   - [ความรัก และความสัมพันธ์] (หลักเกณฑ์ดูเส้นหัวใจ จุดสิ้นสุด และความมั่นคงทางใจ)
   - [การเงิน โอกาส และความมั่นคง] (หลักเกณฑ์ดูเส้นวาสนา เส้นอาทิตย์ และช่องทางโชคลาภ)
   - [คำแนะนำดวงชะตา] (มุมมองภาพรวมจังหวะชีวิตและดวงชะตาแบบเป็นกลาง เข้าใจง่าย)
2. เขียนภาษาคนธรรมดา อ่านเข้าใจง่าย ไม่ใช้ศัพท์เทคนิคที่ชวนสับสน`;
    }
    if (discipline === "siamsi") {
      return `โปรดสรุปตำราเซียมซีฉบับนี้เป็นฐานข้อมูลเสริม RAG โดยจัดรูปแบบแยกตามใบหรือระดับโชคชะตาดังนี้:

1. ระบุหมายเลขใบเซียมซี เช่น เบอร์ 01, เบอร์ 02 หรือระดับคำทำนาย (ดีที่สุด / ปานกลาง / ควรระวัง)
2. สรุปคำแนะนำเชิงลึกด้าน อาชีพการงาน โชคลาภการเงิน ความรัก สุขภาพ และข้อควรระวังแบบกระชับเข้าใจง่าย`;
    }
    return `โปรดสรุปตำราพยากรณ์ไพ่ทาโรต์ฉบับนี้เพื่อนำไปใช้เป็นฐานข้อมูล RAG สำหรับระบบ "เซียมซีทาโรต์" โดยจัดรูปแบบแยกเป็นหัวข้อดังนี้:

1. ระบุชื่อไพ่ทาโรต์ (ทั้งภาษาไทยและอังกฤษ เช่น The Lovers / ไพ่เดอะเลิฟเวอร์)
2. แยกคำทำนายเฉพาะด้านให้ชัดเจน:
   - [ความรัก คนโสด] (สำหรับการเรียงไพ่: อดีต ➔ ปัจจุบัน ➔ แนวโน้มในอนาคต)
   - [ความรัก ไม่โสด/มีคนในใจ] (สำหรับการเรียงไพ่: ความรู้สึกเรา ➔ ความรู้สึกอีกฝ่าย ➔ แนวโน้มในอนาคต)
   - [การงาน] (อดีต ➔ ปัจจุบัน ➔ อนาคต)
   - [การเงิน] (เหตุ ➔ ผล ➔ สรุป)
   - [สุขภาพ] (เหตุ ➔ ผล ➔ สรุป)
3. สรุปเคล็ดลับการอ่านไพ่เมื่อปรากฏในตำแหน่งที่ 1, 2, หรือ 3 และแนวทางแก้ไขเสริมดวงแบบกระชับ เข้าใจง่าย ไม่วกวน`;
  }
}

// ===========================================================================
// CUSTOMER DISPLAY TYPOGRAPHY ENGINE (ขนาดตัวอักษร & ฟอนต์หน้าลูกค้าโดย Admin)
// ===========================================================================
const STORAGE_KEY_DISPLAY_SETTINGS = "siamsi_customer_display_settings_v1";

const CUSTOMER_FONT_CATALOG = [
  {
    key: "prompt",
    label: "Prompt (พร้อมพ์)",
    badge: "ค่าเริ่มต้น • สมดุล",
    desc: "ทันสมัย โปร่ง สวยงาม อ่านสบายทั้งหัวข้อและเนื้อหา",
    stack: "'Prompt', -apple-system, sans-serif"
  },
  {
    key: "sarabun",
    label: "Sarabun (สารบรรณ)",
    badge: "แนะนำบนมือถือ ⭐",
    desc: "ฟอนต์มีหัว ตัวอักษรใหญ่คมชัดมาก อ่านง่ายที่สุดในหน้าจอมือถือ",
    stack: "'Sarabun', -apple-system, sans-serif"
  },
  {
    key: "noto",
    label: "Noto Sans Thai",
    badge: "คมชัดมาตรฐาน",
    desc: "เส้นสม่ำเสมอ อ่านง่ายทั้ง iOS และ Android แม้ขนาดอักษรใหญ่",
    stack: "'Noto Sans Thai', -apple-system, sans-serif"
  },
  {
    key: "kanit",
    label: "Kanit (คณิต)",
    badge: "เส้นหนาเด่นชัด",
    desc: "ตัวหนาโค้งมน อ่านชัดเจนโดดเด่นแม้ในที่แสงจ้า",
    stack: "'Kanit', -apple-system, sans-serif"
  },
  {
    key: "ibm",
    label: "IBM Plex Sans Thai",
    badge: "มินิมอลหรูหรา",
    desc: "เรียบร้อย อ่านง่าย สัดส่วนตัวอักษรสบายตาแบบงาน Editorial",
    stack: "'IBM Plex Sans Thai', -apple-system, sans-serif"
  },
  {
    key: "pridi",
    label: "Pridi (ปรีดี)",
    badge: "มีหัวกึ่งคัมภีร์",
    desc: "ตัวอักษรมีหัวกึ่งขลัง เหมาะกับคำทำนายยาวๆ แบบคัมภีร์โบราณ",
    stack: "'Pridi', 'Sarabun', serif"
  }
];

const DEFAULT_CUSTOMER_DISPLAY = {
  fontFamilyKey: "prompt",
  desktopFontScale: 100,
  mobileFontScale: 100,
  updatedAt: 0
};

class CustomerDisplayEngine {
  constructor() {
    this.settings = this._loadLocal();
    this._syncPromise = null;
    this._saveSeq = 0;
    this._saveQueue = Promise.resolve();
    this._bindLifecycle();
    this.applyToDocument();
    this.syncFromServer();
  }

  getFontCatalog() {
    return CUSTOMER_FONT_CATALOG;
  }

  getFontOption(key) {
    return CUSTOMER_FONT_CATALOG.find(f => f.key === key) || CUSTOMER_FONT_CATALOG[0];
  }

  _clamp(val, min, max, fallback) {
    const n = Number(val);
    if (!Number.isFinite(n)) return fallback;
    return Math.round(Math.max(min, Math.min(max, n)));
  }

  normalize(raw) {
    const src = (raw && typeof raw === "object") ? raw : {};
    const rawKey = String(src.fontFamilyKey || "").trim().toLowerCase();
    const validFont = CUSTOMER_FONT_CATALOG.some(f => f.key === rawKey)
      ? rawKey
      : DEFAULT_CUSTOMER_DISPLAY.fontFamilyKey;
    return {
      fontFamilyKey: validFont,
      desktopFontScale: this._clamp(src.desktopFontScale, 85, 150, DEFAULT_CUSTOMER_DISPLAY.desktopFontScale),
      mobileFontScale: this._clamp(src.mobileFontScale, 90, 160, DEFAULT_CUSTOMER_DISPLAY.mobileFontScale),
      updatedAt: Number(src.updatedAt) || 0
    };
  }

  _loadLocal() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_DISPLAY_SETTINGS);
      if (raw) return this.normalize(JSON.parse(raw));
    } catch (_) {}
    return { ...DEFAULT_CUSTOMER_DISPLAY };
  }

  _saveLocal(settings) {
    const norm = this.normalize(settings);
    this.settings = norm;
    try {
      localStorage.setItem(STORAGE_KEY_DISPLAY_SETTINGS, JSON.stringify(norm));
    } catch (_) {}
    return norm;
  }

  getSettings() {
    return { ...this.settings };
  }

  toCompactToken() {
    const s = this.getSettings();
    return {
      f: s.fontFamilyKey,
      d: s.desktopFontScale,
      m: s.mobileFontScale,
      u: s.updatedAt || 0
    };
  }

  applyFromUrlToken(compact) {
    if (!compact || typeof compact !== "object") return false;
    const incoming = this.normalize({
      fontFamilyKey: compact.f || compact.fontFamilyKey,
      desktopFontScale: compact.d ?? compact.desktopFontScale,
      mobileFontScale: compact.m ?? compact.mobileFontScale,
      updatedAt: compact.u ?? compact.updatedAt ?? Date.now()
    });
    const curTime = Number(this.settings.updatedAt) || 0;
    const nextTime = Number(incoming.updatedAt) || 0;
    if (nextTime >= curTime || curTime === 0) {
      this._saveLocal(incoming);
      this.applyToDocument();
      return true;
    }
    return false;
  }

  async syncFromServer() {
    if (this._syncPromise) return this._syncPromise;
    const seqAtStart = this._saveSeq;
    this._syncPromise = (async () => {
      if (typeof fetch !== "function") return this.getSettings();
      try {
        const controller = new AbortController();
        const tid = setTimeout(() => controller.abort(), 2000);
        const res = await fetch("/api/display-settings", { signal: controller.signal });
        clearTimeout(tid);
        if (res.ok && this._saveSeq === seqAtStart) {
          const data = await res.json();
          if (data && data.settings && this._saveSeq === seqAtStart) {
            const serverNorm = this.normalize(data.settings);
            const localTime = Number(this.settings.updatedAt) || 0;
            if ((serverNorm.updatedAt || 0) > localTime || localTime === 0) {
              this._saveLocal(serverNorm);
              this.applyToDocument();
              this._dispatchUpdated();
            }
          }
        }
      } catch (_) {}
      this._syncPromise = null;
      return this.getSettings();
    })();
    return this._syncPromise;
  }

  async saveSettings(partial) {
    const seq = ++this._saveSeq;
    const monotonicTime = Math.max(Date.now(), (Number(this.settings.updatedAt) || 0) + 1);
    const next = this.normalize({
      ...this.settings,
      ...(partial || {}),
      updatedAt: monotonicTime
    });
    this._saveLocal(next);
    this.applyToDocument();
    this._dispatchUpdated();

    const snapshot = this.getSettings();
    this._saveQueue = this._saveQueue.then(async () => {
      // Skip superseded intermediate snapshots; the latest call in the queue will persist the newest state.
      if (seq !== this._saveSeq) return;
      if (typeof fetch !== "function") return;
      try {
        const controller = new AbortController();
        const tid = setTimeout(() => controller.abort(), 2000);
        const res = await fetch("/api/display-settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(snapshot),
          signal: controller.signal
        });
        clearTimeout(tid);
        if (res.ok && seq === this._saveSeq) {
          const data = await res.json();
          if (data && data.settings && seq === this._saveSeq) {
            this._saveLocal(data.settings);
            this._dispatchUpdated();
          }
        }
      } catch (_) {}
    }).catch(() => {});

    await this._saveQueue;
    return this.getSettings();
  }

  async resetSettings() {
    return this.saveSettings({
      ...DEFAULT_CUSTOMER_DISPLAY,
      updatedAt: Date.now()
    });
  }

  _dispatchUpdated() {
    if (typeof window !== "undefined" && typeof window.dispatchEvent === "function") {
      try {
        window.dispatchEvent(new CustomEvent("customer-display-updated", {
          detail: { settings: this.getSettings() }
        }));
      } catch (_) {}
    }
  }

  applyToDocument() {
    if (typeof document === "undefined") return;
    const applyNow = () => {
      if (!document.body || document.body.classList.contains("admin-body")) return;
      const cfg = this.getSettings();
      const fontOpt = this.getFontOption(cfg.fontFamilyKey);
      const isMobile = typeof window !== "undefined" ? window.innerWidth <= 768 : false;
      const pct = isMobile ? cfg.mobileFontScale : cfg.desktopFontScale;
      const scale = Math.max(0.85, Math.min(1.65, pct / 100));

      document.body.classList.add("customer-display-active");
      document.body.setAttribute("data-customer-font", fontOpt.key);
      document.documentElement.style.setProperty("--font-thai", fontOpt.stack);
      document.documentElement.style.setProperty("--customer-font-scale", String(scale));
    };

    if (document.body) {
      applyNow();
    } else if (typeof window !== "undefined") {
      window.addEventListener("DOMContentLoaded", applyNow, { once: true });
    }
  }

  _bindLifecycle() {
    if (typeof window === "undefined") return;
    window.addEventListener("resize", () => this.applyToDocument());
    window.addEventListener("DOMContentLoaded", () => this.applyToDocument());
    window.addEventListener("storage", (ev) => {
      if (ev && ev.key === STORAGE_KEY_DISPLAY_SETTINGS) {
        this.settings = this._loadLocal();
        this.applyToDocument();
        this._dispatchUpdated();
      }
    });
  }
}

window.brandThemeEngine = new BrandThemeEngine();
window.ragEngine = new RAGKnowledgeEngine();
window.displaySettingsEngine = new CustomerDisplayEngine();
