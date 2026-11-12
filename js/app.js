/**
 * เซียมซีทาโรต์ (SiamSi Tarot) - Core Application Controller
 * - ระบบตรวจสอบรหัสโค้ด (Access Code Gate) จำกัดสุ่ม 1 ครั้ง อายุ 1 วัน (24 ชม.)
 * - แยกโหมดเด็ดขาด: โค้ดไพ่ทาโรต์แสดงเฉพาะไพ่ทาโรต์ 3 ใบ / โค้ดเซียมซีแสดงเฉพาะเสี่ยงเซียมซี
 * - ไพ่ทาโรต์ล็อกรูปแบบ 3 ใบ และ 4 หมวดหมู่เฉพาะด้าน (ความรัก, การงาน, การเงิน, สุขภาพ)
 * - เอฟเฟกต์จับไพ่และเปิดไพ่สุดขลัง คุ้มค่าบริการ
 * - ระบบแชร์รูป Info Card + คำทำนายเต็มต่อท้าย และดาวน์โหลดไฟล์ PDF แท้ลงเครื่อง
 */

const I18N = {
  th: {
    brand_title: "เซียมซีทาโรต์",
    brand_sub: "SIAMSI TAROT ORACLE",
    sound_on: "เสียง",
    sound_off: "ปิดเสียง",
    hero_title: "แท่นพยากรณ์ไพ่ทาโรต์ 3 ใบ",
    hero_desc: "“จงสงบจิตใจ รวบรวมสมาธิ เลือกหมวดหมู่ที่ท่านปรารถนาจะล่วงรู้ แล้วก้าวเข้าสู่พิธีกรรมสับไพ่...”",
    label_category: "เลือกหมวดหมู่ที่ต้องการพยากรณ์ (เฉพาะด้าน)",
    cat_love: "ความรัก",
    cat_career: "การงาน",
    cat_finance: "การเงิน",
    cat_health: "สุขภาพ",
    spread_3_name: "ไพ่ทาโรต์ 3 ใบ",
    spread_3_desc: "วิเคราะห์เจาะลึก 3 ตำแหน่งสำคัญ",
    btn_begin: "ตั้งจิตอธิษฐาน & เริ่มพิธีกรรมสับไพ่ 3 ใบ",

    drawing_title: "ตั้งจิตอธิษฐานและหยิบไพ่ 3 ใบ",
    drawing_sub: "กรุณาใช้สมาธิแตะเลือกไพ่ทีละใบจากสำรับ หรือใช้ญาณทัศน์สุ่มเลือกให้ครบ 3 ใบ",
    drawing_progress: "เลือกไพ่แล้ว {current} จากทั้งหมด 3 ใบ",
    btn_intuition: "ให้ญาณทัศน์สุ่มเลือกไพ่ให้ครบ 3 ใบ",
    btn_reshuffle: "สับไพ่อีกครั้ง",
    btn_shuffling: "กำลังร่ายมนตร์สับไพ่...",
    shuffle_status_shuffling: "🔮 กำลังร่ายมนตร์สับไพ่ 78 ใบ ประสานพลังจักรวาล...",
    shuffle_status_ready: "✨ สำรับไพ่ 78 ใบพร้อมแล้ว! โปรดแตะเลือกไพ่ 3 ใบตามสัญชาตญาณ",

    results_title: "ผลการพยากรณ์ไพ่ทาโรต์ 3 ใบ",
    verdict_box_title: "บทสรุปฟันธง & แนวทางปฏิบัติ",
    verdict_badge_favorable: "🌟 แนวโน้มเป็นบวกมาก (ราบรื่น / สมหวัง)",
    verdict_badge_neutral: "⚖️ แนวโน้มปานกลาง / ขึ้นอยู่กับการตัดสินใจ",
    verdict_badge_challenging: "⚠️ มีจุดต้องระวัง / ควรตั้งรับอย่างมีสติ",
    verdict_do: "สิ่งที่ควรทำ (เสริมดวง):",
    verdict_dont: "ข้อควรระวัง (ควรหลีกเลี่ยง):",

    positions_section_title: "คำทำนายเจาะลึกทั้ง 3 ใบ (เฉพาะด้าน{domain})",
    positions_section_sub: "วิเคราะห์ความหมายของไพ่แต่ละใบตรงตามหมวดหมู่ที่ท่านเลือก เข้าใจง่าย ชัดเจน",
    card_drawn_label: "ไพ่ที่ปรากฏ:",
    domain_prediction_label: "คำทำนายด้าน{domain}:",
    card_advice_label: "สารเตือนใจประจำไพ่:",
    card_upright: "ไพ่ตั้งตรง",
    card_reversed: "ไพ่กลับหัว",
    witch_advice: "สารเตือนใจจากไพ่",
    keywords: "พลังงานหลัก",

    reading_for_user: "ใบพยากรณ์ดวงชะตาสำหรับ {name}",
    btn_share_reading: "แชร์โซเชียล (รูป Info + คำทำนายเต็ม)",
    btn_download_pdf: "บันทึกเป็นไฟล์ PDF ลงเครื่อง",
    btn_copy_reading: "คัดลอกคำทำนายฉบับเต็ม",
    btn_ask_again: "ดูดวงใหม่อีกครั้ง",

    toast_copied: "📋 คัดลอกคำทำนายฉบับเต็มเรียบร้อยแล้ว! นำไปวางโพสต์หรือคอมเมนต์ได้เลย",
    toast_share_success: "✨ แชร์ผลคำทำนายเรียบร้อยแล้ว!",
    toast_pdf_downloaded: "📄 ดาวน์โหลดไฟล์ PDF คำทำนายลงเครื่องเรียบร้อยแล้ว!",
    toast_info_saved: "🖼️ บันทึกรูป Info Card ลงเครื่องเรียบร้อยแล้ว!",

    love_single_title: "คำทำนายคนโสด",
    love_couple_title: "คำทำนายคนมีคู่ / มีคนคุย",
    mode_tarot: "ไพ่ทาโรต์ 3 ใบ",
    mode_siamsi: "เสี่ยงเซียมซี",
    footer_credits: "เซียมซีทาโรต์ (SiamSi Tarot) • ระบบพยากรณ์ไพ่ทาโรต์ 3 ใบ และเสี่ยงเซียมซีศักดิ์สิทธิ์"
  },
  en: {
    brand_title: "SIAMSI TAROT",
    brand_sub: "SACRED ORACLE SANCTUARY",
    sound_on: "Sound",
    sound_off: "Muted",
    hero_title: "Sacred 3-Card Tarot Altar",
    hero_desc: "“Calm your mind, focus your intention, choose your life domain, and enter the sacred shuffle ritual...”",
    label_category: "Select Specific Divination Domain",
    cat_love: "Love & Romance",
    cat_career: "Career & Work",
    cat_finance: "Finance & Wealth",
    cat_health: "Health & Vitality",
    spread_3_name: "3-Card Tarot Spread",
    spread_3_desc: "Focused 3-Position Sacred Reading",
    btn_begin: "Focus Intention & Begin 3-Card Shuffle",

    drawing_title: "Draw Your 3 Sacred Tarot Cards",
    drawing_sub: "Tap 3 cards from the spread using your intuition, or use Oracle Auto-Draw",
    drawing_progress: "Selected {current} of 3 cards",
    btn_intuition: "Oracle Intuition (Auto-Draw 3 Cards)",
    btn_reshuffle: "Reshuffle Deck",
    btn_shuffling: "Shuffling Deck...",
    shuffle_status_shuffling: "🔮 Weaving sacred energy across all 78 cards...",
    shuffle_status_ready: "✨ 78 Cards Ready! Tap 3 cards that call to your spirit",

    results_title: "Your 3-Card Tarot Oracle Reading",
    verdict_box_title: "Final Oracle Verdict & Actionable Guidance",
    verdict_badge_favorable: "🌟 Highly Favorable & Auspicious",
    verdict_badge_neutral: "⚖️ Balanced / Guided by Your Choices",
    verdict_badge_challenging: "⚠️ Caution & Mindful Preparation Advised",
    verdict_do: "Recommended Action (Do):",
    verdict_dont: "Caution (Avoid):",

    positions_section_title: "3-Card In-Depth Reading ({domain})",
    positions_section_sub: "Clear, focused interpretation tailored directly to your chosen domain",
    card_drawn_label: "Card Drawn:",
    domain_prediction_label: "{domain} Prediction:",
    card_advice_label: "Sacred Reminder:",
    card_upright: "Upright",
    card_reversed: "Reversed",
    witch_advice: "Sacred Guidance",
    keywords: "Core Energy",

    reading_for_user: "Sacred Tarot Reading for {name}",
    btn_share_reading: "Share (Info Image + Full Reading)",
    btn_download_pdf: "Save Reading as PDF",
    btn_copy_reading: "Copy Full Reading Text",
    btn_ask_again: "New Reading",

    toast_copied: "📋 Full reading copied to clipboard! Ready to paste in post or comment.",
    toast_share_success: "✨ Reading shared successfully!",
    toast_pdf_downloaded: "📄 PDF reading downloaded to your device!",
    toast_info_saved: "🖼️ Info Card image saved to your device!",

    love_single_title: "For Singles",
    love_couple_title: "For Couples",
    mode_tarot: "3-Card Tarot",
    mode_siamsi: "Siamsi Oracle",
    footer_credits: "SiamSi Tarot • Professional 3-Card Tarot & Sacred Siamsi Divination"
  }
};

// ตำแหน่งไพ่ 3 ใบตามตำราพยากรณ์ ขึ้นอยู่กับด้านที่เลือกดูและสถานะหัวใจ (โสด / ไม่โสด)
const DOMAIN_POSITIONS_3 = {
  // ความรัก (คนโสด): อดีต ➔ ปัจจุบัน ➔ แนวโน้มในอนาคต
  love_single: [
    { th: "ใบที่ 1: อดีต — พื้นฐานหัวใจและเรื่องราวความรักที่ผ่านมา", en: "Card 1: Past — Your Heart's Past & Foundation" },
    { th: "ใบที่ 2: ปัจจุบัน — สถานการณ์หัวใจและเสน่ห์ของคุณตอนนี้", en: "Card 2: Present — Current Love Energy & Status" },
    { th: "ใบที่ 3: แนวโน้มในอนาคต — โอกาสพบรักใหม่และคนที่กำลังจะเข้ามา", en: "Card 3: Future Trend — Upcoming Romance & Outcome" }
  ],
  // ความรัก (ไม่โสด / มีคนคุย / มีคนในใจ / มีคู่): ความรู้สึกเรา ➔ ความรู้สึกอีกฝ่าย ➔ แนวโน้มในอนาคต
  love_couple: [
    { th: "ใบที่ 1: ความรู้สึกเรา — ความในใจและมุมมองของคุณที่มีต่อเขา", en: "Card 1: Your Feelings — Your Heart & Attitude" },
    { th: "ใบที่ 2: ความรู้สึกอีกฝ่าย — ความในใจและท่าทีของเขาที่มีต่อคุณ", en: "Card 2: Their Feelings — Their Heart & Attitude" },
    { th: "ใบที่ 3: แนวโน้มในอนาคต — ทิศทางและบทสรุปความสัมพันธ์", en: "Card 3: Future Trend — Relationship Outcome" }
  ],
  // การงาน: อดีต ➔ ปัจจุบัน ➔ อนาคต
  career: [
    { th: "ใบที่ 1: อดีต — ที่มา รากฐาน และผลงานที่ผ่านมา", en: "Card 1: Past — Career Foundation & Background" },
    { th: "ใบที่ 2: ปัจจุบัน — สถานการณ์การงานและสิ่งที่กำลังเผชิญ", en: "Card 2: Present — Current Work Situation" },
    { th: "ใบที่ 3: อนาคต — แนวโน้มความก้าวหน้าและบทสรุปการงาน", en: "Card 3: Future — Career Trend & Outcome" }
  ],
  // การเงิน: เหตุ ➔ ผล ➔ สรุป (อดีต ➔ ปัจจุบัน ➔ อนาคต)
  finance: [
    { th: "ใบที่ 1: เหตุ (อดีต) — ต้นเหตุและพฤติกรรมทางการเงินที่ผ่านมา", en: "Card 1: Cause (Past) — Financial Origin" },
    { th: "ใบที่ 2: ผล (ปัจจุบัน) — สภาพคล่องและกระแสการเงินในตอนนี้", en: "Card 2: Effect (Present) — Current Cashflow" },
    { th: "ใบที่ 3: สรุป (อนาคต) — แนวโน้มรายได้ โชคลาภ และบทสรุปการเงิน", en: "Card 3: Summary (Future) — Wealth & Financial Outcome" }
  ],
  // สุขภาพ: เหตุ ➔ ผล ➔ สรุป
  health: [
    { th: "ใบที่ 1: เหตุ — ต้นเหตุและพฤติกรรมการดูแลสุขภาพสะสม", en: "Card 1: Cause — Root Health Habits" },
    { th: "ใบที่ 2: ผล — สภาวะร่างกายและจิตใจในปัจจุบัน", en: "Card 2: Effect — Current Body & Mind State" },
    { th: "ใบที่ 3: สรุป — แนวโน้มการฟื้นฟูและบทสรุปสุขภาพในอนาคต", en: "Card 3: Summary — Future Recovery & Vitality" }
  ]
};

const SPREAD_BANNER_TITLES = {
  love_single: "🎴 ลำดับการเปิดไพ่ 3 ใบ (ความรัก • คนโสด): อดีต ➔ ปัจจุบัน ➔ แนวโน้มในอนาคต",
  love_couple: "🎴 ลำดับการเปิดไพ่ 3 ใบ (ความรัก • มีคนในใจ/มีคู่): ความรู้สึกเรา ➔ ความรู้สึกอีกฝ่าย ➔ แนวโน้มในอนาคต",
  career: "🎴 ลำดับการเปิดไพ่ 3 ใบ (การงาน): อดีต ➔ ปัจจุบัน ➔ อนาคต",
  finance: "🎴 ลำดับการเปิดไพ่ 3 ใบ (การเงิน): เหตุ (อดีต) ➔ ผล (ปัจจุบัน) ➔ สรุป (อนาคต)",
  health: "🎴 ลำดับการเปิดไพ่ 3 ใบ (สุขภาพ): เหตุ ➔ ผล ➔ สรุป"
};

class TarotApp {
  constructor() {
    this.lang = localStorage.getItem("mystic_lang") || "th";
    this.category = "love"; // 4 หมวด: love, career, finance, health
    this.loveStatus = "couple"; // เฉพาะหมวดความรัก: "single" (โสด) หรือ "couple" (ไม่โสด / มีคนคุย / มีคู่)
    this.spreadCount = 3; // ล็อกไพ่ 3 ใบเสมอ
    this.seekerName = "";
    this.activeCode = "";
    this.activeCodeObj = null;
    this.isSharedView = false;

    this.deck = [];
    this.drawnCards = [];
    this.currentReadingPayload = null;

    this.initDOM();
    this.bindEvents();
    this.applyLanguage();
    this.updateCategoryPreviewPills();
    this.initAccessFlow();
  }

  getSpreadKey() {
    if (this.category === "love") {
      return this.loveStatus === "single" ? "love_single" : "love_couple";
    }
    return this.category;
  }

  getPositions() {
    const key = this.getSpreadKey();
    return DOMAIN_POSITIONS_3[key] || DOMAIN_POSITIONS_3.love_couple;
  }

  initDOM() {
    // Header & Access Gate
    this.navBrand = document.getElementById("nav-brand");
    this.btnToggleAudio = document.getElementById("btn-toggle-audio");
    this.btnToggleLang = document.getElementById("btn-toggle-lang");
    this.audioIcon = document.getElementById("audio-icon");
    this.audioLabel = document.getElementById("audio-label");
    this.langLabel = document.getElementById("lang-label");

    this.activeCodeBanner = document.getElementById("active-code-banner");
    this.activeCodeModeIcon = document.getElementById("active-code-mode-icon");
    this.activeCodeText = document.getElementById("active-code-text");
    this.activeCodeExpiry = document.getElementById("active-code-expiry");
    this.btnBackToCombo = document.getElementById("btn-back-to-combo");
    this.btnChangeCode = document.getElementById("btn-change-code");
    this.sanctuaryModeNav = document.getElementById("sanctuary-mode-nav");

    this.accessGateScreen = document.getElementById("access-gate-screen");
    this.accessCodeForm = document.getElementById("access-code-form");
    this.accessCodeInput = document.getElementById("access-code-input");
    this.accessCodeError = document.getElementById("access-code-error");
    this.demoCodeChips = document.querySelectorAll(".demo-code-chip");

    // Combo Selector Screen (Package 3)
    this.comboSelectorScreen = document.getElementById("combo-selector-screen");
    this.comboWelcomeTitle = document.getElementById("combo-welcome-title");
    this.comboTarotStatus = document.getElementById("combo-tarot-status");
    this.comboSiamsiStatus = document.getElementById("combo-siamsi-status");
    this.comboTarotMiniResult = document.getElementById("combo-tarot-mini-result");
    this.comboSiamsiMiniResult = document.getElementById("combo-siamsi-mini-result");
    this.btnComboEnterTarot = document.getElementById("btn-combo-enter-tarot");
    this.btnComboTarotLabel = document.getElementById("btn-combo-tarot-label");
    this.btnComboEnterSiamsi = document.getElementById("btn-combo-enter-siamsi");
    this.btnComboSiamsiLabel = document.getElementById("btn-combo-siamsi-label");
    this.btnTarotGoCombo = document.getElementById("btn-tarot-go-combo");
    this.btnSiamsiGoCombo = document.getElementById("btn-siamsi-go-combo");

    this.tarotModeContainer = document.getElementById("tarot-mode-container");
    this.siamsiModeContainer = document.getElementById("siamsi-mode-container");
    this.climaxOverlay = document.getElementById("ritual-climax-overlay");

    // Tarot Screens
    this.screens = {
      intention: document.getElementById("screen-intention"),
      drawing: document.getElementById("screen-drawing"),
      results: document.getElementById("screen-results")
    };

    // Screen 1: Intention
    this.seekerNameInput = document.getElementById("seeker-name-input");
    this.catChips = document.querySelectorAll(".cat-chip");
    this.loveStatusGroup = document.getElementById("love-status-group");
    this.loveStatusChips = document.querySelectorAll(".love-status-chip");
    this.ritualBannerBadge = document.getElementById("ritual-banner-badge");
    this.ritualPositionsPreview = document.getElementById("ritual-positions-preview");
    this.btnBegin = document.getElementById("btn-begin-ritual");

    // Screen 2: Drawing
    this.altarMagicCircle = document.getElementById("altar-sacred-magic-circle");
    this.drawingDomainPill = document.getElementById("drawing-domain-pill");
    this.drawingInstructions = document.getElementById("drawing-instructions");
    this.targetSlotsRack = document.getElementById("target-slots-rack");
    this.deckRibbonContainer = document.getElementById("deck-ribbon-container");
    this.btnWitchIntuition = document.getElementById("btn-witch-intuition");
    this.btnReShuffle = document.getElementById("btn-re-shuffle");
    this.btnReShuffleText = document.getElementById("btn-re-shuffle-text");
    this.altarShuffleStatus = document.getElementById("altar-shuffle-status");
    this.shuffleStatusText = document.getElementById("shuffle-status-text");
    this.isShuffling = false;

    // Screen 3: Results
    this.resultsSeekerGreeting = document.getElementById("results-seeker-greeting");
    this.printSeekerLine = document.getElementById("print-seeker-line");
    this.printMetaLine = document.getElementById("print-meta-line");
    this.resultsQuestionRecap = document.getElementById("results-question-recap");
    this.revealedCardsContainer = document.getElementById("revealed-cards-container");
    this.positionsSectionTitle = document.getElementById("positions-section-title");
    this.positionsSectionSubtitle = document.getElementById("positions-section-subtitle");
    this.interpretationsFeed = document.getElementById("interpretations-feed");
    this.sharedReadingNotice = document.getElementById("shared-reading-notice");
    this.btnStartOwnReading = document.getElementById("btn-start-own-reading");
    this.btnAskAgain = document.getElementById("btn-ask-again");
    this.btnSocialShare = document.getElementById("btn-social-share");
    this.btnDownloadPdf = document.getElementById("btn-download-pdf");
    this.btnCopyReading = document.getElementById("btn-copy-reading");
    this.codeLockedNotice = document.getElementById("code-locked-notice");

    // Direct Verdict Elements
    this.directVerdictBox = document.getElementById("direct-verdict-box");
    this.verdictBadge = document.getElementById("verdict-badge");
    this.verdictTitle = document.getElementById("verdict-title");
    this.verdictContent = document.getElementById("verdict-content");
    this.verdictActionsSummary = document.getElementById("verdict-actions-summary");

    // Social Share Studio Modal
    this.shareModal = document.getElementById("social-share-modal");
    this.btnCloseShareModal = document.getElementById("btn-close-share-modal");
    this.shareInfoPreviewImg = document.getElementById("share-info-preview-img");
    this.shareFullCaptionTextarea = document.getElementById("share-full-caption-textarea");
    this.btnSaveInfoImage = document.getElementById("btn-save-info-image");
    this.btnNativeShareAll = document.getElementById("btn-native-share-all");
    this.btnCopyFullCaption = document.getElementById("btn-copy-full-caption");
    this.btnModalDownloadPdf = document.getElementById("btn-modal-download-pdf");

    // Card Detail Modal
    this.modal = document.getElementById("card-detail-modal");
    this.modalBody = document.getElementById("modal-card-body");
    this.modalCloseBtn = document.getElementById("btn-close-modal");

    // Toast
    this.toast = document.getElementById("mystic-toast");
  }

  bindEvents() {
    // Brand logo click
    if (this.navBrand) {
      this.navBrand.addEventListener("click", (e) => {
        e.preventDefault();
        if (!this.activeCode) {
          this.showAccessGate();
        } else if (this.activeCodeObj && this.activeCodeObj.mode === "combo") {
          this.showComboSelector(this.activeCodeObj);
        }
      });
    }

    // Combo Selector Buttons (Package 3)
    if (this.btnBackToCombo) {
      this.btnBackToCombo.addEventListener("click", () => {
        window.mysticAudio.playClick();
        if (this.activeCodeObj) this.showComboSelector(this.activeCodeObj);
      });
    }
    if (this.btnComboEnterTarot) {
      this.btnComboEnterTarot.addEventListener("click", () => {
        window.mysticAudio.playClick();
        this.openTarotServiceForCode(this.activeCodeObj);
      });
    }
    if (this.btnComboEnterSiamsi) {
      this.btnComboEnterSiamsi.addEventListener("click", () => {
        window.mysticAudio.playClick();
        this.openSiamsiServiceForCode(this.activeCodeObj);
      });
    }
    if (this.btnTarotGoCombo) {
      this.btnTarotGoCombo.addEventListener("click", () => {
        window.mysticAudio.playClick();
        this.openSiamsiServiceForCode(this.activeCodeObj);
      });
    }
    if (this.btnSiamsiGoCombo) {
      this.btnSiamsiGoCombo.addEventListener("click", () => {
        window.mysticAudio.playClick();
        this.openTarotServiceForCode(this.activeCodeObj);
      });
    }

    // Change Code button
    if (this.btnChangeCode) {
      this.btnChangeCode.addEventListener("click", () => {
        window.mysticAudio.playClick();
        window.codeManager.saveActiveSessionCode("");
        this.activeCode = "";
        this.activeCodeObj = null;
        if (window.history && window.history.replaceState) {
          window.history.replaceState({}, document.title, window.location.pathname);
        }
        this.showAccessGate();
      });
    }

    // Access Code Form Submit
    if (this.accessCodeForm) {
      this.accessCodeForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const codeVal = this.accessCodeInput ? this.accessCodeInput.value.trim() : "";
        await this.enterWithCode(codeVal);
      });
    }

    // Demo Code Chips
    if (this.demoCodeChips) {
      this.demoCodeChips.forEach(chip => {
        chip.addEventListener("click", async () => {
          const code = chip.getAttribute("data-demo-code");
          if (this.accessCodeInput) this.accessCodeInput.value = code;
          await this.enterWithCode(code);
        });
      });
    }

    // Audio & Language
    if (this.btnToggleAudio) {
      this.btnToggleAudio.addEventListener("click", () => {
        const isMuted = window.mysticAudio.toggleMute();
        this.updateAudioButton(isMuted);
      });
    }

    if (this.btnToggleLang) {
      this.btnToggleLang.addEventListener("click", () => {
        window.mysticAudio.playClick();
        this.toggleLanguage();
      });
    }

    // Category Selector (4 categories: love, career, finance, health)
    this.catChips.forEach(chip => {
      chip.addEventListener("click", () => {
        if (chip.disabled) return;
        window.mysticAudio.playClick();
        this.catChips.forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        this.category = chip.dataset.cat;
        this.updateCategoryPreviewPills();
      });
    });

    // Love Status Selector ("โสดมั้ย?" — single vs couple)
    if (this.loveStatusChips) {
      this.loveStatusChips.forEach(chip => {
        chip.addEventListener("click", () => {
          window.mysticAudio.playClick();
          this.loveStatusChips.forEach(c => c.classList.remove("active"));
          chip.classList.add("active");
          this.loveStatus = chip.getAttribute("data-love-status") || "couple";
          this.updateCategoryPreviewPills();
        });
      });
    }

    // Begin 3-Card Ritual Button
    if (this.btnBegin) {
      this.btnBegin.addEventListener("click", () => {
        const tarotSaved = this.activeCodeObj && (this.activeCodeObj.tarotResult || (this.activeCodeObj.readingResult && this.activeCodeObj.readingResult.mode === "tarot" ? this.activeCodeObj.readingResult : null));
        const tarotCount = this.activeCodeObj ? (this.activeCodeObj.tarotDrawCount || (tarotSaved ? 1 : 0)) : 0;
        if (tarotCount >= 1 && tarotSaved) {
          this.restoreSavedTarotReading(tarotSaved);
          return;
        }
        this.spreadCount = 3;
        window.mysticAudio.playCardShuffle();
        this.setupDrawingTable();
        this.switchScreen("drawing");
      });
    }

    // Witch Intuition (Auto Draw 3 cards)
    if (this.btnWitchIntuition) {
      this.btnWitchIntuition.addEventListener("click", () => {
        this.autoDrawCards();
      });
    }

    // Re-shuffle
    if (this.btnReShuffle) {
      this.btnReShuffle.addEventListener("click", () => {
        this.triggerShuffleAnimation(false);
      });
    }

    // Results Actions
    if (this.btnAskAgain) {
      this.btnAskAgain.addEventListener("click", () => {
        window.mysticAudio.playClick();
        if (this.activeCodeObj && this.activeCodeObj.drawCount >= 1) {
          this.showToast("โค้ดนี้ใช้สิทธิ์เปิดไพ่ครบ 1 ครั้งแล้ว");
          return;
        }
        this.switchScreen("intention");
      });
    }

    if (this.btnStartOwnReading) {
      this.btnStartOwnReading.addEventListener("click", () => {
        window.mysticAudio.playClick();
        this.resetToOwnReading();
      });
    }

    if (this.btnSocialShare) {
      this.btnSocialShare.addEventListener("click", () => {
        this.openSocialShareStudio(this.currentReadingPayload);
      });
    }

    if (this.btnDownloadPdf) {
      this.btnDownloadPdf.addEventListener("click", () => {
        this.downloadDirectPDF(this.currentReadingPayload);
      });
    }

    if (this.btnCopyReading) {
      this.btnCopyReading.addEventListener("click", () => {
        this.copyReadingToClipboard();
      });
    }

    // Social Share Studio Modal Actions
    if (this.btnCloseShareModal) {
      this.btnCloseShareModal.addEventListener("click", () => {
        this.shareModal.classList.remove("active");
      });
    }
    if (this.shareModal) {
      this.shareModal.addEventListener("click", (e) => {
        if (e.target === this.shareModal) this.shareModal.classList.remove("active");
      });
    }

    if (this.btnSaveInfoImage) {
      this.btnSaveInfoImage.addEventListener("click", async () => {
        const payload = window.shareAndPdfEngine.currentReadingData || this.currentReadingPayload;
        if (!payload) return;
        await window.shareAndPdfEngine.downloadInfoImageFile(payload);
        if (this.activeCode) {
          window.codeManager.recordActionLog(this.activeCode, "share", "ลูกค้าบันทึกรูป Info Card ลงเครื่อง");
        }
        this.showToast(I18N[this.lang].toast_info_saved);
      });
    }

    if (this.btnCopyFullCaption) {
      this.btnCopyFullCaption.addEventListener("click", () => {
        const text = this.shareFullCaptionTextarea ? this.shareFullCaptionTextarea.value : "";
        if (!text) return;
        navigator.clipboard.writeText(text).then(() => {
          if (this.activeCode) {
            window.codeManager.recordActionLog(this.activeCode, "share", "ลูกค้าคัดลอกคำทำนายเต็มเพื่อแชร์โซเชียล");
          }
          this.showToast(I18N[this.lang].toast_copied);
          window.mysticAudio.playCrystalBell(880, 1.2);
        });
      });
    }

    if (this.btnNativeShareAll) {
      this.btnNativeShareAll.addEventListener("click", async () => {
        await this.executeNativeShareWithInfoAndCaption();
      });
    }

    if (this.btnModalDownloadPdf) {
      this.btnModalDownloadPdf.addEventListener("click", async () => {
        const payload = window.shareAndPdfEngine.currentReadingData || this.currentReadingPayload;
        await this.downloadDirectPDF(payload);
      });
    }

    // Direct Social Platform Share Buttons (Facebook, Instagram, TikTok, LINE, X)
    document.querySelectorAll(".btn-platform-share").forEach(btn => {
      btn.addEventListener("click", async () => {
        const platform = btn.getAttribute("data-share-platform") || "facebook";
        const modeHint = btn.getAttribute("data-share-mode") || "active";
        await this.shareToSocialPlatform(platform, modeHint);
      });
    });

    // Card Zoom Modal Close
    if (this.modalCloseBtn) {
      this.modalCloseBtn.addEventListener("click", () => this.closeModal());
    }
    if (this.modal) {
      this.modal.addEventListener("click", (e) => {
        if (e.target === this.modal) this.closeModal();
      });
    }
  }

  // =========================================================================
  // ACCESS CODE GATE & STRICT MODE ISOLATION
  // =========================================================================

  async initAccessFlow() {
    // 1. Check if shared public preview link (?share=1&cards=...)
    if (this.checkSharedReadingUrl()) {
      return;
    }

    // 2. Check URL ?code=XXXX parameter (from Fastwork chat link)
    const params = new URLSearchParams(window.location.search);
    const urlCode = params.get("code");
    if (urlCode) {
      await this.enterWithCode(urlCode.trim());
      return;
    }

    // 3. Check active session code
    const savedCode = window.codeManager.getActiveSessionCode();
    if (savedCode) {
      await this.enterWithCode(savedCode, false);
      return;
    }

    // 4. Otherwise show the Access Code Gate screen
    this.showAccessGate();
  }

  showAccessGate() {
    if (this.accessGateScreen) this.accessGateScreen.classList.add("active");
    if (this.comboSelectorScreen) this.comboSelectorScreen.classList.remove("active");
    if (this.tarotModeContainer) this.tarotModeContainer.style.display = "none";
    if (this.siamsiModeContainer) this.siamsiModeContainer.style.display = "none";
    if (this.activeCodeBanner) this.activeCodeBanner.style.display = "none";
    if (this.sanctuaryModeNav) this.sanctuaryModeNav.style.display = "none";
  }

  async enterWithCode(rawCode, recordAccess = true) {
    if (!rawCode) return;
    if (this.accessCodeError) this.accessCodeError.style.display = "none";

    // 0. ตรวจสอบรหัสผู้ดูแลระบบ (Admin Passcode) จากช่องกรอกโค้ดหน้าลูกค้า
    if (window.codeManager && typeof window.codeManager.isAdminPasscode === "function" && window.codeManager.isAdminPasscode(rawCode)) {
      window.mysticAudio.playCrystalBell(1046.5, 1.4);
      this.showToast("🔐 กำลังเข้าสู่ระบบจัดการหลังบ้าน (Admin Backoffice)...");
      setTimeout(() => {
        window.location.href = "admin.html";
      }, 450);
      return;
    }

    const res = await window.codeManager.verifyAndAccessCode(rawCode, recordAccess);
    if (!res.valid) {
      if (this.accessCodeError) {
        this.accessCodeError.style.display = "block";
        if (res.reason === "expired") {
          this.accessCodeError.innerHTML = `⚠️ รหัสโค้ด <strong>${rawCode.toUpperCase()}</strong> หมดอายุแล้ว (โค้ดมีอายุใช้งาน 1 วัน / 24 ชั่วโมง) กรุณาติดต่อผู้พยากรณ์ใน Fastwork`;
        } else {
          this.accessCodeError.innerHTML = `❌ ไม่พบรหัสโค้ด <strong>${rawCode.toUpperCase()}</strong> ในระบบ กรุณาตรวจสอบรหัสอีกครั้ง`;
        }
      }
      this.showAccessGate();
      return;
    }

    const codeObj = res.codeObj;
    this.activeCode = codeObj.code;
    this.activeCodeObj = codeObj;
    this.seekerName = "";
    window.codeManager.saveActiveSessionCode(codeObj.code);

    window.mysticAudio.playCrystalBell(784, 1.4);

    // Hide Access Gate
    if (this.accessGateScreen) this.accessGateScreen.classList.remove("active");

    // Show Active Code Header Pill & STRICTLY hide top mode switcher so unrelated menus never appear
    if (this.sanctuaryModeNav) this.sanctuaryModeNav.style.display = "none";
    if (this.activeCodeBanner) {
      this.activeCodeBanner.style.display = "inline-flex";
      const shortLabelMap = { tarot: "ไพ่ 3 ใบ", siamsi: "เซียมซี", combo: "แพ็กคู่" };
      if (this.activeCodeText) {
        this.activeCodeText.textContent = `🔑 ${codeObj.code} • ${shortLabelMap[codeObj.mode] || "ดูดวง"}`;
      }
      if (this.activeCodeExpiry) {
        this.activeCodeExpiry.textContent = window.codeManager.getRemainingTimeText(codeObj, this.lang);
      }
      if (this.btnBackToCombo) {
        this.btnBackToCombo.style.display = codeObj.mode === "combo" ? "inline-flex" : "none";
      }
    }

    // Show/hide combo switch buttons in results panels
    if (this.btnTarotGoCombo) {
      this.btnTarotGoCombo.style.display = codeObj.mode === "combo" ? "inline-flex" : "none";
    }
    if (this.btnSiamsiGoCombo) {
      this.btnSiamsiGoCombo.style.display = codeObj.mode === "combo" ? "inline-flex" : "none";
    }

    // Route according to the 3 packages:
    // 1. Package 3 (combo): Show the Service Selector Screen first!
    if (codeObj.mode === "combo") {
      this.showComboSelector(codeObj);
      return;
    }

    // 2. Package 2 (siamsi): Go directly to Siamsi
    if (codeObj.mode === "siamsi") {
      this.openSiamsiServiceForCode(codeObj);
      return;
    }

    // 3. Package 1 (tarot): Go directly to Tarot 3-card
    this.openTarotServiceForCode(codeObj);
  }

  showComboSelector(codeObj) {
    if (!codeObj) return;
    if (this.accessGateScreen) this.accessGateScreen.classList.remove("active");
    if (this.tarotModeContainer) this.tarotModeContainer.style.display = "none";
    if (this.siamsiModeContainer) this.siamsiModeContainer.style.display = "none";
    if (this.comboSelectorScreen) this.comboSelectorScreen.classList.add("active");

    if (this.comboWelcomeTitle) {
      this.comboWelcomeTitle.textContent = `ยินดีต้อนรับสู่แพ็กเกจคู่พิเศษ (ไพ่ทาโรต์ + เซียมซี)`;
    }

    const tarotDone = (codeObj.tarotDrawCount || 0) >= 1 && !!codeObj.tarotResult;
    const siamsiDone = (codeObj.siamsiDrawCount || 0) >= 1 && !!codeObj.siamsiResult;

    if (this.comboTarotStatus) {
      this.comboTarotStatus.textContent = tarotDone
        ? "✅ ใช้สิทธิ์เปิดไพ่แล้ว (1/1 ครั้ง)"
        : "🎯 สิทธิ์คงเหลือ: 1 / 1 ครั้ง (พร้อมเปิดไพ่)";
      this.comboTarotStatus.className = `combo-service-status ${tarotDone ? "used" : "ready"}`;
    }
    if (this.comboTarotMiniResult) {
      if (tarotDone && codeObj.tarotResult && codeObj.tarotResult.cards) {
        const names = codeObj.tarotResult.cards.map(c => c.name_th).join(" • ");
        this.comboTarotMiniResult.style.display = "block";
        this.comboTarotMiniResult.innerHTML = `<strong>ผลที่เปิดได้ (หมวด${codeObj.tarotResult.categoryName || ""}):</strong><br>${names}`;
      } else {
        this.comboTarotMiniResult.style.display = "none";
      }
    }
    if (this.btnComboTarotLabel) {
      this.btnComboTarotLabel.textContent = tarotDone
        ? "เปิดดูผลคำทำนายไพ่ทาโรต์ 3 ใบของคุณ"
        : "เริ่มเปิดดวงไพ่ทาโรต์ 3 ใบ (1 ครั้ง)";
    }

    if (this.comboSiamsiStatus) {
      this.comboSiamsiStatus.textContent = siamsiDone
        ? "✅ ใช้สิทธิ์เสี่ยงเซียมซีแล้ว (1/1 ครั้ง)"
        : "🎯 สิทธิ์คงเหลือ: 1 / 1 ครั้ง (พร้อมเสี่ยงทาย)";
      this.comboSiamsiStatus.className = `combo-service-status ${siamsiDone ? "used" : "ready"}`;
    }
    if (this.comboSiamsiMiniResult) {
      if (siamsiDone && codeObj.siamsiResult) {
        this.comboSiamsiMiniResult.style.display = "block";
        this.comboSiamsiMiniResult.innerHTML = `<strong>ผลที่ได้:</strong> เซียมซีเบอร์ ${codeObj.siamsiResult.signNumber} (${codeObj.siamsiResult.signTitle || ""})`;
      } else {
        this.comboSiamsiMiniResult.style.display = "none";
      }
    }
    if (this.btnComboSiamsiLabel) {
      this.btnComboSiamsiLabel.textContent = siamsiDone
        ? "เปิดดูผลคำทำนายเซียมซีของคุณ"
        : "เริ่มเสี่ยงเซียมซีศักดิ์สิทธิ์ (1 ครั้ง)";
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  openTarotServiceForCode(codeObj) {
    if (!codeObj) return;
    if (this.comboSelectorScreen) this.comboSelectorScreen.classList.remove("active");
    if (this.siamsiModeContainer) this.siamsiModeContainer.style.display = "none";
    if (this.tarotModeContainer) this.tarotModeContainer.style.display = "block";

    // Check if category is pre-locked by admin
    if (codeObj.lockedCategory && ["love", "career", "finance", "health"].includes(codeObj.lockedCategory)) {
      this.category = codeObj.lockedCategory;
      this.catChips.forEach(c => {
        c.classList.toggle("active", c.dataset.cat === this.category);
      });
      this.updateCategoryPreviewPills();
    }

    const savedTarot = codeObj.tarotResult || (codeObj.readingResult && codeObj.readingResult.mode === "tarot" ? codeObj.readingResult : null);
    const tarotUsed = (codeObj.tarotDrawCount || 0) >= 1 || (codeObj.mode === "tarot" && codeObj.drawCount >= 1);

    if (tarotUsed && savedTarot && Array.isArray(savedTarot.cards)) {
      this.restoreSavedTarotReading(savedTarot);
    } else {
      this.switchScreen("intention");
    }
  }

  openSiamsiServiceForCode(codeObj) {
    if (!codeObj) return;
    if (this.comboSelectorScreen) this.comboSelectorScreen.classList.remove("active");
    if (this.tarotModeContainer) this.tarotModeContainer.style.display = "none";
    if (this.siamsiModeContainer) this.siamsiModeContainer.style.display = "block";

    if (this.siamsiApp) {
      this.siamsiApp.enterWithCustomerCode(codeObj);
    }
  }

  restoreSavedTarotReading(readingResult) {
    if (!readingResult || !Array.isArray(readingResult.cards)) return;
    this.category = readingResult.category || "love";
    if (readingResult.loveStatus) {
      this.loveStatus = readingResult.loveStatus;
      if (this.loveStatusChips) {
        this.loveStatusChips.forEach(c => {
          c.classList.toggle("active", c.getAttribute("data-love-status") === this.loveStatus);
        });
      }
    }
    this.spreadCount = 3;
    this.seekerName = "";

    this.drawnCards = readingResult.cards.map((savedCard, idx) => {
      const found = TAROT_CARDS.find(c => c.id === savedCard.id) || TAROT_CARDS[idx];
      return {
        card: found,
        isReversed: !!savedCard.isReversed,
        positionIndex: idx
      };
    });

    this.renderResults();
    this.switchScreen("results");
  }

  updateCategoryPreviewPills() {
    // Show/hide "โสดมั้ย?" question depending on whether category is love
    if (this.loveStatusGroup) {
      this.loveStatusGroup.style.display = this.category === "love" ? "block" : "none";
    }
    const spreadKey = this.getSpreadKey();
    if (this.ritualBannerBadge && SPREAD_BANNER_TITLES[spreadKey]) {
      this.ritualBannerBadge.textContent = SPREAD_BANNER_TITLES[spreadKey];
    }

    if (!this.ritualPositionsPreview) return;
    const positions = this.getPositions();
    this.ritualPositionsPreview.innerHTML = positions.map((pos, idx) => {
      const shortText = pos[this.lang].split("—")[0].trim();
      const arrow = idx < positions.length - 1 ? `<span class="pos-step-arrow">➔</span>` : "";
      return `<span class="pos-step-pill">${shortText}</span>${arrow}`;
    }).join("");
  }

  // =========================================================================
  // SCREEN SWITCHER & LANGUAGE
  // =========================================================================

  switchScreen(screenName) {
    Object.keys(this.screens).forEach(key => {
      if (this.screens[key]) {
        this.screens[key].classList.remove("active");
      }
    });
    if (this.screens[screenName]) {
      this.screens[screenName].classList.add("active");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  toggleLanguage() {
    this.lang = this.lang === "th" ? "en" : "th";
    localStorage.setItem("mystic_lang", this.lang);
    this.applyLanguage();
    this.updateCategoryPreviewPills();
    if (this.screens.results && this.screens.results.classList.contains("active")) {
      this.renderResults();
    }
  }

  applyLanguage() {
    const dict = I18N[this.lang];
    if (this.langLabel) {
      this.langLabel.textContent = this.lang === "th" ? "TH / ไทย" : "EN / Eng";
    }

    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (dict[key]) el.textContent = dict[key];
    });

    if (this.siamsiApp) {
      this.siamsiApp.applyLanguage(this.lang);
    }

    this.updateAudioButton(window.mysticAudio.isMuted);
  }

  updateAudioButton(isMuted) {
    const dict = I18N[this.lang];
    if (isMuted) {
      this.audioIcon.textContent = "🔇";
      this.audioLabel.textContent = dict.sound_off;
      this.btnToggleAudio.classList.remove("active");
    } else {
      this.audioIcon.textContent = "🔔";
      this.audioLabel.textContent = dict.sound_on;
      this.btnToggleAudio.classList.add("active");
    }
  }

  showToast(message) {
    if (!this.toast) return;
    this.toast.textContent = message;
    this.toast.classList.add("active");
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => {
      this.toast.classList.remove("active");
    }, 3200);
  }

  // =========================================================================
  // 3-CARD DRAWING STAGE & SACRED EFFECTS
  // =========================================================================

  setupDrawingTable() {
    this.drawnCards = [];
    this.spreadCount = 3;

    const domainIcons = { love: "💖", career: "💼", finance: "💰", health: "🌿" };
    const domainName = I18N[this.lang]["cat_" + this.category];
    const loveSuffix = this.category === "love"
      ? (this.loveStatus === "single" ? " (คนโสด: อดีต • ปัจจุบัน • แนวโน้มในอนาคต)" : " (มีคนในใจ/มีคู่: ความรู้สึกเรา • ความรู้สึกอีกฝ่าย • แนวโน้มในอนาคต)")
      : "";
    if (this.drawingDomainPill) {
      this.drawingDomainPill.textContent = `${domainIcons[this.category] || "🔮"} หมวด${domainName}${loveSuffix}`;
    }

    if (this.altarMagicCircle) {
      this.altarMagicCircle.className = "altar-sacred-magic-circle";
    }

    // Build 3 Sacred Target Slots
    this.targetSlotsRack.innerHTML = "";
    const positions = this.getPositions();
    for (let i = 0; i < 3; i++) {
      const slot = document.createElement("div");
      slot.className = "card-target-slot";
      slot.id = `target-slot-${i}`;
      slot.innerHTML = `
        <span class="slot-position-label">${positions[i][this.lang]}</span>
        <span class="slot-placeholder-icon">✦</span>
      `;
      this.targetSlotsRack.appendChild(slot);
    }

    // Shuffle fresh 78 cards
    this.deck = [...TAROT_CARDS].sort(() => Math.random() - 0.5);

    // Build Ribbon of 78 Cards
    this.deckRibbonContainer.innerHTML = "";
    this.deck.forEach((card, index) => {
      const cardEl = document.createElement("div");
      cardEl.className = "tarot-card-deck-item";
      cardEl.dataset.index = index;

      const rot = ((index - 39) / 39) * 16;
      cardEl.style.transform = `rotate(${rot}deg)`;

      cardEl.innerHTML = `<div class="card-back-pattern"></div>`;

      cardEl.addEventListener("click", (e) => {
        this.handleCardClick(card, cardEl, e);
      });

      this.deckRibbonContainer.appendChild(cardEl);
    });

    this.updateDrawingProgress();
    this.triggerShuffleAnimation(true);
  }

  triggerShuffleAnimation(isInitial = false) {
    if (this.isShuffling) return;
    this.isShuffling = true;

    const dict = I18N[this.lang];

    if (!isInitial && this.drawnCards.length > 0) {
      this.drawnCards = [];
      const positions = this.getPositions();
      for (let i = 0; i < 3; i++) {
        const slot = document.getElementById(`target-slot-${i}`);
        if (slot) {
          slot.classList.remove("filled", "slot-energized");
          slot.innerHTML = `
            <span class="slot-position-label">${positions[i][this.lang]}</span>
            <span class="slot-placeholder-icon">✦</span>
          `;
        }
      }
      if (this.altarMagicCircle) {
        this.altarMagicCircle.className = "altar-sacred-magic-circle";
      }
      this.updateDrawingProgress();
    }

    window.mysticAudio.playRiffleShuffle();
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try { navigator.vibrate([25, 40, 25, 40, 60]); } catch (err) {}
    }

    if (this.altarShuffleStatus) {
      this.altarShuffleStatus.classList.remove("is-ready");
      this.altarShuffleStatus.classList.add("is-shuffling");
      if (this.shuffleStatusText) {
        this.shuffleStatusText.textContent = dict.shuffle_status_shuffling;
      }
    }

    if (this.btnReShuffle) this.btnReShuffle.classList.add("is-active");
    if (this.btnReShuffleText) this.btnReShuffleText.textContent = dict.btn_shuffling;
    if (this.btnWitchIntuition) this.btnWitchIntuition.disabled = true;

    const cardEls = Array.from(this.deckRibbonContainer.querySelectorAll(".tarot-card-deck-item"));
    if (this.deckRibbonContainer) {
      this.deckRibbonContainer.classList.add("is-shuffling");
    }

    cardEls.forEach((cardEl) => {
      cardEl.classList.remove("selected", "shuffling-split-left", "shuffling-split-right", "shuffling-riffle", "shuffling-fan-out");
      cardEl.classList.add("shuffling-phase-gather");
    });

    setTimeout(() => {
      cardEls.forEach((cardEl, idx) => {
        cardEl.classList.remove("shuffling-phase-gather");
        if (idx < 39) {
          cardEl.classList.add("shuffling-split-left");
        } else {
          cardEl.classList.add("shuffling-split-right");
        }
      });
    }, 420);

    setTimeout(() => {
      cardEls.forEach((cardEl, idx) => {
        const isLeft = idx < 39;
        const normalized = isLeft ? (idx / 39) : ((idx - 39) / 39);
        const riffleX = isLeft ? (-60 + (normalized * 60)) : (60 - (normalized * 60));
        const riffleRot = isLeft ? (-8 + (normalized * 8)) : (8 - (normalized * 8));

        cardEl.style.setProperty("--riffle-x", `${riffleX}px`);
        cardEl.style.setProperty("--riffle-rot", `${riffleRot}deg`);

        const stagger = (idx % 2 === 0 ? (idx * 5) : ((77 - idx) * 5));
        cardEl.style.animationDelay = `${stagger}ms`;

        cardEl.classList.remove("shuffling-split-left", "shuffling-split-right");
        cardEl.classList.add("shuffling-riffle");
      });
    }, 800);

    setTimeout(() => {
      this.deck = [...TAROT_CARDS].sort(() => Math.random() - 0.5);

      if (window.mysticParticles && this.deckRibbonContainer) {
        const rect = this.deckRibbonContainer.getBoundingClientRect();
        window.mysticParticles.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 36);
      }

      cardEls.forEach((cardEl, idx) => {
        cardEl.classList.remove("shuffling-riffle");
        cardEl.classList.add("shuffling-fan-out");

        const rot = ((idx - 39) / 39) * 16;
        cardEl.style.transform = `rotate(${rot}deg)`;
        cardEl.style.marginLeft = idx === 0 ? "0px" : "-32px";
        cardEl.style.animationDelay = "";

        const newCard = this.deck[idx];
        cardEl.dataset.index = idx;
        cardEl.onclick = (e) => {
          this.handleCardClick(newCard, cardEl, e);
        };
      });
    }, 1450);

    setTimeout(() => {
      cardEls.forEach((cardEl) => {
        cardEl.classList.remove("shuffling-fan-out");
      });

      if (this.deckRibbonContainer) {
        this.deckRibbonContainer.classList.remove("is-shuffling");
      }

      if (this.altarShuffleStatus) {
        this.altarShuffleStatus.classList.remove("is-shuffling");
        this.altarShuffleStatus.classList.add("is-ready");
        if (this.shuffleStatusText) {
          this.shuffleStatusText.textContent = dict.shuffle_status_ready;
        }
      }

      if (this.btnReShuffle) this.btnReShuffle.classList.remove("is-active");
      if (this.btnReShuffleText) this.btnReShuffleText.textContent = dict.btn_reshuffle;
      if (this.btnWitchIntuition) this.btnWitchIntuition.disabled = false;

      this.isShuffling = false;
    }, 1850);
  }

  handleCardClick(card, cardEl, event) {
    if (this.isShuffling) return;
    if (this.drawnCards.length >= 3) return;
    if (cardEl.classList.contains("selected")) return;

    cardEl.classList.add("selected");

    // ไล่ระดับเสียงระฆังคริสตัลศักดิ์สิทธิ์ตามใบที่ 1, 2, 3
    const bellNotes = [659.25, 783.99, 1046.50];
    window.mysticAudio.playCrystalBell(bellNotes[this.drawnCards.length] || 880, 1.6);
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try { navigator.vibrate(35); } catch (e) {}
    }

    // เอฟเฟกต์เสาแสงทองคำและวงแหวนมนตราจุดที่แตะไพ่
    const rect = cardEl.getBoundingClientRect();
    const burstX = (event && event.clientX) ? event.clientX : (rect.left + rect.width / 2);
    const burstY = (event && event.clientY) ? event.clientY : (rect.top + rect.height / 2);
    if (window.mysticParticles) {
      window.mysticParticles.burst(burstX, burstY, 35);
    }
    this.spawnFloatingRuneEffect(burstX, burstY, this.drawnCards.length + 1);

    const isReversed = Math.random() < 0.25;
    const slotIdx = this.drawnCards.length;

    this.drawnCards.push({
      card: card,
      isReversed: isReversed,
      positionIndex: slotIdx
    });

    // อัปเดตความสว่างของวงเวทย์ตามจำนวนไพ่ที่หยิบ
    if (this.altarMagicCircle) {
      this.altarMagicCircle.classList.add(`draw-step-${this.drawnCards.length}`);
    }

    // อัปเดตช่องวางไพ่พร้อมเอฟเฟกต์ล็อกพลังเวทย์
    const slotEl = document.getElementById(`target-slot-${slotIdx}`);
    if (slotEl) {
      slotEl.classList.add("filled", "slot-energized");
      slotEl.innerHTML = `
        <span class="slot-position-label">${this.getPositions()[slotIdx][this.lang]}</span>
        <div class="slot-locked-card-back">
          <div class="card-back-pattern"></div>
          <span class="slot-rune-seal">✦</span>
        </div>
      `;
    }

    this.updateDrawingProgress();

    // เมื่อหยิบครบ 3 ใบ: แสดงฉาก Climax ประสานพลังไพ่ทั้ง 3 ใบก่อนเปิดคำทำนาย!
    if (this.drawnCards.length >= 3) {
      this.triggerGrandRevealCeremony();
    }
  }

  spawnFloatingRuneEffect(x, y, stepNum) {
    const el = document.createElement("div");
    el.className = "floating-draw-rune";
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.innerHTML = `<span>✦ ใบที่ ${stepNum} ✦</span>`;
    document.body.appendChild(el);
    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 1100);
  }

  triggerGrandRevealCeremony() {
    window.mysticAudio.playSuccessOracle();
    if (this.climaxOverlay) {
      this.climaxOverlay.classList.add("active");
    }

    setTimeout(async () => {
      this.renderResults();
      this.switchScreen("results");

      // บันทึกผลไพ่ 3 ใบผูกกับรหัสโค้ดทันที (จำกัด 1 ครั้ง)
      if (this.activeCode && this.currentReadingPayload) {
        const updated = await window.codeManager.recordReadingDraw(this.activeCode, this.currentReadingPayload);
        if (updated) {
          this.activeCodeObj = updated;
        }
      }

      setTimeout(() => {
        if (this.climaxOverlay) {
          this.climaxOverlay.classList.remove("active");
        }
      }, 350);
    }, 1350);
  }

  autoDrawCards() {
    if (this.isShuffling) return;
    const needed = 3 - this.drawnCards.length;
    if (needed <= 0) return;

    const unselectedCards = Array.from(this.deckRibbonContainer.children).filter(
      c => !c.classList.contains("selected")
    );

    for (let i = 0; i < needed; i++) {
      setTimeout(() => {
        if (unselectedCards.length > 0) {
          const randIdx = Math.floor(Math.random() * unselectedCards.length);
          const chosenEl = unselectedCards.splice(randIdx, 1)[0];
          const cardDataIndex = parseInt(chosenEl.dataset.index, 10);
          this.handleCardClick(this.deck[cardDataIndex], chosenEl, null);
        }
      }, i * 320);
    }
  }

  updateDrawingProgress() {
    const dict = I18N[this.lang];
    this.drawingInstructions.textContent = dict.drawing_progress.replace("{current}", this.drawnCards.length);
  }

  // =========================================================================
  // RESULTS & DEEP, NON-REPETITIVE INTERPRETATION + GRAND MASTER SUMMARY
  // =========================================================================

  buildPositionDeepContext(card, isReversed, category, posIdx, lang = "th") {
    const aspect = isReversed ? card.reversed : card.upright;
    const kws = (aspect.keywords && aspect.keywords[lang]) ? aspect.keywords[lang] : [];
    const kwText = kws.slice(0, 3).join(" • ");
    const cardName = lang === "th" ? card.name_th : card.name_en;

    if (category === "love") {
      if (this.loveStatus === "single") {
        if (posIdx === 0) {
          return `เมื่อไพ่ ${cardName} ปรากฏในตำแหน่ง "อดีตของคนโสด" สะท้อนถึงรากฐานประสบการณ์ความรักที่ผ่านมาซึ่งหล่อหลอมมุมมองหัวใจของคุณ พลังงานของ "${kwText}" บ่งบอกว่าสิ่งที่ผ่านพ้นมาแล้วคือบทเรียนสำคัญที่ช่วยให้คุณรู้จักคุณค่าของตัวเองและคัดกรองคนที่เหมาะสมได้ดีขึ้น`;
        }
        if (posIdx === 1) {
          return `เมื่อไพ่ ${cardName} ปรากฏในตำแหน่ง "สถานการณ์หัวใจและเสน่ห์ปัจจุบันของคนโสด" บ่งบอกถึงคลื่นพลังงานรอบตัวคุณในเวลานี้ ซึ่งโดดเด่นเรื่อง "${kwText}" เป็นจังหวะที่ออร่าและบุคลิกของคุณสะท้อนสภาวะจิตใจภายในออกมาอย่างชัดเจนต่อผู้คนที่ได้พบเจอ`;
        }
        return `เมื่อไพ่ ${cardName} ปรากฏในตำแหน่ง "แนวโน้มความรักในอนาคตของคนโสด" ชี้ถึงทิศทางความรักบทถัดไปที่กำลังเคลื่อนเข้ามาหาคุณ โดยมีหัวใจสำคัญอยู่ที่ "${kwText}" ซึ่งจะเป็นตัวกำหนดจังหวะการได้พบเจอหรือพัฒนาความสัมพันธ์ครั้งใหม่`;
      }

      // มีคนในใจ / มีคนคุย / มีคู่
      if (posIdx === 0) {
        return `เมื่อไพ่ ${cardName} ปรากฏในตำแหน่ง "ความรู้สึกและมุมมองของคุณ" สะท้อนสภาวะจิตใจลึกๆ ที่คุณมีต่อความสัมพันธ์นี้ พลังงานของ "${kwText}" เผยให้เห็นความปรารถนา ความทุ่มเท หรือสิ่งที่คุณกำลังให้ความสำคัญเป็นอันดับแรกในหัวใจ`;
      }
      if (posIdx === 1) {
        return `เมื่อไพ่ ${cardName} ปรากฏในตำแหน่ง "ความรู้สึกและมุมมองของอีกฝ่าย" ช่วยถอดรหัสความในใจและท่าทีของเขาที่มีต่อคุณในระยะนี้ พลังงานของ "${kwText}" อธิบายเหตุผลเบื้องหลังการกระทำ คำพูด หรือจังหวะการแสดงออกของเขาได้อย่างชัดเจน`;
      }
      return `เมื่อไพ่ ${cardName} ปรากฏในตำแหน่ง "แนวโน้มความสัมพันธ์ในอนาคต" เป็นจุดบรรจบของพลังงานทั้งสองฝ่าย โดยมีแกนหลักคือ "${kwText}" ซึ่งบ่งชี้ถึงพัฒนาการและทิศทางความชัดเจนของความสัมพันธ์ในระยะถัดไป`;
    }

    if (category === "career") {
      if (posIdx === 0) {
        return `ในตำแหน่ง "รากฐานและที่มาของการงาน" ไพ่ ${cardName} สะท้อนถึงต้นทุนความสามารถ ผลงาน หรือสถานการณ์ก่อนหน้าที่ปูทางมาถึงจุดนี้ โดยมีพลังของ "${kwText}" เป็นตัวขับเคลื่อนหลัก`;
      }
      if (posIdx === 1) {
        return `ในตำแหน่ง "สถานการณ์การงานปัจจุบัน" ไพ่ ${cardName} ชี้ให้เห็นบรรยากาศการทำงาน ภารกิจสำคัญ หรือโจทย์ตรงหน้าที่คุณกำลังบริหารจัดการอยู่ ซึ่งเกี่ยวข้องกับ "${kwText}" โดยตรง`;
      }
      return `ในตำแหน่ง "แนวโน้มและผลลัพธ์การงานในอนาคต" ไพ่ ${cardName} บ่งบอกถึงทิศทางความก้าวหน้า โอกาสใหม่ หรือผลสำเร็จที่กำลังจะปรากฏชัดขึ้นภายใต้พลังงานของ "${kwText}"`;
    }

    if (category === "finance") {
      if (posIdx === 0) {
        return `ในตำแหน่ง "เหตุและรากฐานทางการเงิน" ไพ่ ${cardName} อธิบายถึงที่มาของกระแสเงิน พฤติกรรมการบริหารจัดการ หรือการตัดสินใจทางการเงินในช่วงที่ผ่านมา (${kwText})`;
      }
      if (posIdx === 1) {
        return `ในตำแหน่ง "ผลลัพธ์และสภาพคล่องปัจจุบัน" ไพ่ ${cardName} สะท้อนจังหวะการหมุนเวียนของรายรับ-รายจ่าย และสภาวะทางการเงินที่คุณกำลังสัมผัสอยู่ในขณะนี้ (${kwText})`;
      }
      return `ในตำแหน่ง "บทสรุปและแนวโน้มการเงินในอนาคต" ไพ่ ${cardName} ชี้เป้าทิศทางโชคลาภ ผลตอบแทน และความมั่นคงทางการเงินที่กำลังจะตามมา (${kwText})`;
    }

    // สุขภาพ (health)
    if (posIdx === 0) {
      return `ในตำแหน่ง "เหตุและพฤติกรรมสะสมด้านสุขภาพ" ไพ่ ${cardName} สะท้อนรูปแบบการใช้ชีวิต การพักผ่อน หรือการใช้พลังงานสะสมในช่วงที่ผ่านมา (${kwText})`;
    }
    if (posIdx === 1) {
      return `ในตำแหน่ง "ผลลัพธ์และสภาวะร่างกาย-จิตใจปัจจุบัน" ไพ่ ${cardName} บ่งบอกสัญญาณของร่างกายและระดับพลังงานชีวิตในปัจจุบัน (${kwText})`;
    }
    return `ในตำแหน่ง "บทสรุปและแนวโน้มการฟื้นฟูสุขภาพ" ไพ่ ${cardName} ชี้ทิศทางการดูแลตัวเองและพลังการฟื้นฟูร่างกาย-จิตใจในระยะถัดไป (${kwText})`;
  }

  getCardDomainText(card, isReversed, category, lang = "th", posIdx = 0) {
    const aspect = isReversed ? card.reversed : card.upright;
    const deepPosContext = this.buildPositionDeepContext(card, isReversed, category, posIdx, lang);

    if (category === "love") {
      const isSingle = this.loveStatus === "single";
      const headerLabel = isSingle
        ? "💫 คำทำนายความรัก (สำหรับคนโสด)"
        : "💑 คำทำนายความรัก (สำหรับคนมีคนในใจ / มีคนคุย / มีคู่)";

      // เลือกคำทำนายที่ตรงสถานะโดยตรง ไม่แสดงซ้ำซ้อน 2 กล่อง
      const directStatusText = (aspect.love && aspect.love.single && aspect.love.couple)
        ? (isSingle ? (aspect.love.single[lang] || aspect.love[lang]) : (aspect.love.couple[lang] || aspect.love[lang]))
        : (aspect.love[lang] || "");

      const plainCombined = `${directStatusText} ${deepPosContext}`;

      return {
        headerLabel,
        fullHtml: `
          <p class="domain-lead-meaning">${directStatusText}</p>
          <p class="domain-pos-context">${deepPosContext}</p>
        `,
        plainText: plainCombined,
        shortText: directStatusText
      };
    }

    const domainNames = { career: "การงานและธุรกิจ", finance: "การเงินและโชคลาภ", health: "สุขภาพและพลังงานชีวิต" };
    const headerLabel = `คำทำนายเจาะลึกด้าน${domainNames[category] || "ดวงชะตา"}`;
    const raw = (aspect[category] && aspect[category][lang]) ? aspect[category][lang] : aspect.career[lang];
    const plainCombined = `${raw} ${deepPosContext}`;

    return {
      headerLabel,
      fullHtml: `
        <p class="domain-lead-meaning">${raw}</p>
        <p class="domain-pos-context">${deepPosContext}</p>
      `,
      plainText: plainCombined,
      shortText: raw
    };
  }

  renderResults() {
    const dict = I18N[this.lang];
    const domainName = I18N[this.lang]["cat_" + this.category] || I18N[this.lang].cat_love;
    const positions = this.getPositions();

    if (this.resultsSeekerGreeting) {
      this.resultsSeekerGreeting.style.display = "none";
    }

    const nowStr = new Date().toLocaleDateString(this.lang === "th" ? "th-TH" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });

    if (this.printSeekerLine) {
      this.printSeekerLine.textContent = `รหัสพยากรณ์: ${this.activeCode || "เซียมซีทาโรต์"}`;
    }
    const spreadFormulaMap = {
      love_single: "อดีต ➔ ปัจจุบัน ➔ แนวโน้มในอนาคต",
      love_couple: "ความรู้สึกเรา ➔ ความรู้สึกอีกฝ่าย ➔ แนวโน้มในอนาคต",
      career: "อดีต ➔ ปัจจุบัน ➔ อนาคต",
      finance: "เหตุ (อดีต) ➔ ผล (ปัจจุบัน) ➔ สรุป (อนาคต)",
      health: "เหตุ ➔ ผล ➔ สรุป"
    };
    const spreadFormula = spreadFormulaMap[this.getSpreadKey()] || "อดีต ➔ ปัจจุบัน ➔ อนาคต";
    const loveStatusBadge = this.category === "love"
      ? (this.loveStatus === "single" ? " (สำหรับคนโสด)" : " (สำหรับคนมีคนในใจ / มีคู่)")
      : "";

    if (this.printMetaLine) {
      this.printMetaLine.textContent = `หมวดหมู่เฉพาะด้าน: ${domainName}${loveStatusBadge} • ลำดับหน้าไพ่: ${spreadFormula} • วันที่: ${nowStr}`;
    }

    if (this.resultsQuestionRecap) {
      this.resultsQuestionRecap.innerHTML = `
        <span>✦ หมวดหมู่: </span><strong style="color:var(--gold-primary);">${domainName}${loveStatusBadge}</strong>
        <span style="margin: 0 0.6rem; opacity:0.5;">•</span>
        <span>ลำดับหน้าไพ่: </span><strong style="color:#fde68a;">${spreadFormula}</strong>
      `;
    }

    // 1. Render 3D Revealed Cards with Dramatic Flip & Aura Shockwave
    this.revealedCardsContainer.innerHTML = "";
    this.drawnCards.forEach((item, index) => {
      const card = item.card;
      const cardName = this.lang === "th" ? card.name_th : card.name_en;
      const orientTag = item.isReversed ? dict.card_reversed : dict.card_upright;
      const orientClass = item.isReversed ? "reversed" : "upright";
      const posLabel = positions[index][this.lang].split("—")[0].trim();
      const safeImg = encodeURI(card.image);

      const unit = document.createElement("div");
      unit.className = "revealed-card-cardunit";
      unit.innerHTML = `
        <span class="card-slot-badge">${posLabel}</span>
        <div class="card-3d-flipper ${item.isReversed ? 'reversed' : ''}" id="flipper-${index}" title="แตะเพื่อซูมดูรายละเอียดไพ่">
          <div class="card-flip-aura-ring" id="aura-ring-${index}"></div>
          <div class="card-face card-front-face">
            <img src="${safeImg}" alt="${cardName}" loading="lazy" />
          </div>
          <div class="card-face card-back-pattern"></div>
        </div>
        <div class="revealed-card-caption">
          <div class="revealed-card-title">${cardName}</div>
          <span class="card-orientation-tag ${orientClass}">[ ${orientTag} ]</span>
        </div>
      `;

      unit.addEventListener("click", () => {
        window.mysticAudio.playClick();
        this.openCardModal(card, item.isReversed);
      });

      this.revealedCardsContainer.appendChild(unit);

      // Staggered dramatic 3D Flip + Sound + Particle Shockwave
      setTimeout(() => {
        const flipper = document.getElementById(`flipper-${index}`);
        const auraRing = document.getElementById(`aura-ring-${index}`);
        if (flipper) {
          flipper.classList.add("flipped");
          window.mysticAudio.playCardFlip();
          if (auraRing) auraRing.classList.add("pulse-burst");
          if (window.mysticParticles) {
            const rect = flipper.getBoundingClientRect();
            window.mysticParticles.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 24);
          }
        }
      }, index * 480 + 280);
    });

    // 2. Render Modern, Non-Redundant 3-Card Domain Predictions
    const domainIcons = { love: "💖", career: "💼", finance: "💰", health: "🌿" };
    const domainIcon = domainIcons[this.category] || "✨";

    if (this.positionsSectionTitle) {
      this.positionsSectionTitle.textContent = `${dict.positions_section_title.replace("{domain}", domainName)}${loveStatusBadge}`;
    }
    if (this.positionsSectionSubtitle) {
      this.positionsSectionSubtitle.textContent = "เจาะลึกความหมายตามตำแหน่งไพ่แต่ละใบอย่างละเอียด ชัดเจน ไม่วกวนซ้ำซ้อน";
    }

    this.interpretationsFeed.innerHTML = "";
    const payloadCards = [];

    this.drawnCards.forEach((item, index) => {
      const card = item.card;
      const aspect = item.isReversed ? card.reversed : card.upright;
      const cardName = this.lang === "th" ? card.name_th : card.name_en;
      const orientTag = item.isReversed ? dict.card_reversed : dict.card_upright;
      const orientClass = item.isReversed ? "reversed" : "upright";
      const posLabel = positions[index][this.lang];
      const safeImg = encodeURI(card.image);

      const domainInfo = this.getCardDomainText(card, item.isReversed, this.category, this.lang, index);
      const pillLabel = this.category === "love"
        ? (this.loveStatus === "single" ? "💫 ความรัก (คนโสด)" : "💑 ความรัก (มีคนในใจ/มีคู่)")
        : `${domainIcon} ด้าน${domainName}`;

      payloadCards.push({
        id: card.id,
        name_th: card.name_th,
        name_en: card.name_en,
        image: card.image,
        isReversed: item.isReversed,
        positionTitle: posLabel,
        domainHeaderLabel: domainInfo.headerLabel,
        domainMeaning: domainInfo.plainText,
        shortMeaning: domainInfo.shortText,
        advice: aspect.advice[this.lang]
      });

      const cardCard = document.createElement("article");
      cardCard.className = "pos-reading-card modern-pos-card";
      cardCard.innerHTML = `
        <div class="pos-reading-header">
          <div class="pos-number-badge">${index + 1}</div>
          <div class="pos-title-wrap">
            <h4 class="pos-title">${posLabel}</h4>
            <span class="pos-domain-pill">${pillLabel}</span>
          </div>
        </div>

        <div class="pos-card-drawn-box">
          <img src="${safeImg}" alt="${cardName}" class="pos-card-drawn-thumb ${item.isReversed ? 'is-reversed-thumb' : ''}" loading="lazy" />
          <div class="pos-card-drawn-info">
            <div class="pos-card-drawn-name">
              <span class="card-name-main">${cardName}</span>
              <span class="card-orient-pill ${orientClass}">[ ${orientTag} ]</span>
            </div>
            <div class="pos-card-keywords-row">
              ${aspect.keywords[this.lang].slice(0, 3).map(kw => `<span class="kw-pill">#${kw}</span>`).join(" ")}
            </div>
          </div>
        </div>

        <div class="pos-domain-prediction-block modern-prediction-block">
          <div class="prediction-block-header">
            <span class="prediction-icon">${domainIcon}</span>
            <h5 class="prediction-title">${domainInfo.headerLabel}</h5>
          </div>
          <div class="prediction-text-content">
            ${domainInfo.fullHtml}
          </div>
        </div>
      `;

      this.interpretationsFeed.appendChild(cardCard);
    });

    // 3. Render Unified Summary & Analysis + Recommendations & Precautions (ไม่แยกเข็มทิศซ้ำซ้อน และไม่อ้างตำรา)
    const verdictResult = this.renderDirectVerdict();

    // Save structured reading payload for Social Share Info Card, PDF, and Admin Backoffice
    this.currentReadingPayload = {
      mode: "tarot",
      code: this.activeCode || "",
      customerName: "",
      category: this.category,
      loveStatus: this.category === "love" ? this.loveStatus : "",
      categoryName: `${domainName}${loveStatusBadge}`,
      spreadFormula,
      timestamp: Date.now(),
      dateText: nowStr,
      cards: payloadCards,
      verdictBadge: verdictResult.badgeText,
      verdictPlain: verdictResult.plainText,
      doAction: verdictResult.doAction,
      dontAction: verdictResult.dontAction,
      luckyBoost: verdictResult.luckyBoost
    };
  }

  renderDirectVerdict() {
    const dict = I18N[this.lang];
    let score = 0;
    const positiveIds = ["m_01", "m_03", "m_04", "m_06", "m_07", "m_08", "m_10", "m_11", "m_14", "m_17", "m_19", "m_21"];
    const challengingIds = ["m_12", "m_13", "m_15", "m_16", "m_18"];

    this.drawnCards.forEach((item, idx) => {
      const isOutcome = idx === this.drawnCards.length - 1;
      const weight = isOutcome ? 2 : 1;
      const card = item.card;

      if (card.suite === "major") {
        if (positiveIds.includes(card.id)) score += (item.isReversed ? 0 : 2) * weight;
        else if (challengingIds.includes(card.id)) score -= (item.isReversed ? 1 : 2.5) * weight;
        else score += (item.isReversed ? -1 : 1) * weight;
      } else {
        const num = card.number;
        if (card.suite === "swords") {
          if ([3, 5, 7, 8, 9, 10].includes(num)) score -= (item.isReversed ? 1 : 2) * weight;
          else score += (item.isReversed ? 0 : 1) * weight;
        } else if (card.suite === "cups" || card.suite === "pentacles" || card.suite === "wands") {
          if ([5, 8, 10].includes(num) && card.suite !== "pentacles") score -= (item.isReversed ? 0.5 : 1.2) * weight;
          else if (num === 5 && card.suite === "pentacles") score -= (item.isReversed ? 1 : 2) * weight;
          else score += (item.isReversed ? 0.3 : 1.5) * weight;
        }
      }
    });

    let verdictType = "neutral";
    if (score >= 2) verdictType = "favorable";
    else if (score <= -2) verdictType = "challenging";

    let badgeText = dict.verdict_badge_neutral;
    if (verdictType === "favorable") badgeText = dict.verdict_badge_favorable;
    else if (verdictType === "challenging") badgeText = dict.verdict_badge_challenging;

    if (this.verdictBadge) {
      this.verdictBadge.className = `verdict-badge ${verdictType}`;
      this.verdictBadge.textContent = badgeText;
    }
    if (this.verdictTitle) {
      this.verdictTitle.textContent = "บทสรุปวิเคราะห์ดวงชะตา & คำแนะนำ";
    }

    const verdictData = this.generateConciseVerdictText(verdictType);

    // รวบรวมคำแนะนำจากหน้าไพ่มาผสานรวมในส่วนคำแนะนำโดยตรง (ไม่แยกเป็นหัวข้อเข็มทิศให้สับสน)
    const cardsGuidanceSentences = this.drawnCards.map((item) => {
      const c = item.card;
      const aspect = item.isReversed ? c.reversed : c.upright;
      return aspect.advice[this.lang] || "";
    }).filter(Boolean);

    const combinedDoAction = `${verdictData.doAction} โดยแนวทางสำคัญในการก้าวต่อไปคือ ${cardsGuidanceSentences.join(" • ")} ${verdictData.luckyBoost}`;

    if (this.verdictContent) {
      this.verdictContent.innerHTML = `
        <div class="verdict-storyline-card">
          <div class="verdict-sub-section-title">🔮 สรุปและวิเคราะห์ดวงชะตา</div>
          <p class="storyline-lead" style="margin-bottom:0.85rem; line-height:1.85; color:#f8fafc;">${verdictData.plainText}</p>
          <p class="storyline-deep" style="margin:0; line-height:1.85; color:#e2e8f0;">${verdictData.deepNarrative}</p>
        </div>
      `;
    }

    if (this.verdictActionsSummary) {
      this.verdictActionsSummary.innerHTML = `
        <div class="do-box modern-action-card">
          <div class="action-card-head">
            <span class="action-card-icon">✅</span>
            <strong style="margin:0;">คำแนะนำและแนวทางที่ควรทำ</strong>
          </div>
          <p style="margin:0; line-height:1.78;">${combinedDoAction}</p>
        </div>
        <div class="dont-box modern-action-card">
          <div class="action-card-head">
            <span class="action-card-icon">⚠️</span>
            <strong style="margin:0;">ข้อควรระวัง</strong>
          </div>
          <p style="margin:0; line-height:1.78;">${verdictData.dontAction}</p>
        </div>
      `;
    }

    return {
      verdictType,
      badgeText,
      plainText: `${verdictData.plainText} ${verdictData.deepNarrative}`,
      doAction: combinedDoAction,
      dontAction: verdictData.dontAction,
      luckyBoost: verdictData.luckyBoost
    };
  }

  getGuidanceStageTitles() {
    if (this.category === "love") {
      if (this.loveStatus === "single") {
        return [
          "การปลดล็อกหัวใจและบทเรียนจากอดีต",
          "การบริหารเสน่ห์และการวางตัวในปัจจุบัน",
          "กุญแจสำคัญในการเปิดรับความรักครั้งใหม่"
        ];
      }
      return [
        "การดูแลจิตใจและการสื่อสารจากฝั่งของคุณ",
        "วิธีเข้าถึงหัวใจและรับมือกับท่าทีของอีกฝ่าย",
        "แนวทางประคับประคองความสัมพันธ์สู่อนาคต"
      ];
    }
    if (this.category === "career") {
      return [
        "การต่อยอดจากต้นทุนและประสบการณ์เดิม",
        "กลยุทธ์การจัดการงานและโอกาสตรงหน้า",
        "เข็มทิศสร้างความก้าวหน้าและผลสำเร็จระยะยาว"
      ];
    }
    if (this.category === "finance") {
      return [
        "การปรับวินัยและรากฐานทางการเงิน",
        "การบริหารสภาพคล่องและกระแสเงินสดปัจจุบัน",
        "แนวทางต่อยอดความมั่งคั่งและเปิดรับโชคลาภ"
      ];
    }
    return [
      "การปรับเปลี่ยนพฤติกรรมสะสมเดิม",
      "การฟื้นฟูสมดุลร่างกายและจิตใจในปัจจุบัน",
      "แนวทางดูแลสุขภาพเชิงป้องกันในระยะยาว"
    ];
  }

  generateConciseVerdictText(verdictType) {
    const c1Obj = this.drawnCards[0] ? this.drawnCards[0].card : null;
    const c2Obj = this.drawnCards[1] ? this.drawnCards[1].card : null;
    const c3Obj = this.drawnCards[2] ? this.drawnCards[2].card : null;
    const c1 = c1Obj ? c1Obj.name_th : "";
    const c2 = c2Obj ? c2Obj.name_th : "";
    const outcomeName = c3Obj ? c3Obj.name_th : c1;

    const k1 = c1Obj ? (this.drawnCards[0].isReversed ? c1Obj.reversed.keywords.th[0] : c1Obj.upright.keywords.th[0]) : "";
    const k2 = c2Obj ? (this.drawnCards[1].isReversed ? c2Obj.reversed.keywords.th[0] : c2Obj.upright.keywords.th[0]) : "";
    const k3 = c3Obj ? (this.drawnCards[2].isReversed ? c3Obj.reversed.keywords.th[0] : c3Obj.upright.keywords.th[0]) : "";

    if (this.category === "love") {
      if (this.loveStatus === "single") {
        if (verdictType === "favorable") {
          return {
            plainText: `จากหน้าไพ่คนโสดทั้ง 3 ใบ (อดีต: ${c1} ➔ ปัจจุบัน: ${c2} ➔ แนวโน้มในอนาคต: ${outcomeName}) เส้นทางหัวใจของคุณกำลังก้าวผ่านจากจังหวะ "${k1}" ในอดีต เข้าสู่สภาวะปัจจุบันที่มีพลังของ "${k2}" และกำลังเปิดประตูสู่แนวโน้มอนาคตที่โดดเด่นด้วย "${k3}" ดวงความรักของคนโสดเปิดกว้างและมีเสน่ห์ดึงดูดสูงมาก`,
            deepNarrative: `การเรียงตัวของไพ่ชุดนี้ยืนยันว่าช่วงเวลาที่หัวใจต้องโดดเดี่ยวหรือคลุมเครือกำลังคลี่คลายลง พลังงานในปัจจุบันส่งผลให้คุณมีความมั่นใจและมีออร่าที่ดึงดูดคนที่มีทัศนคติหรือไลฟ์สไตล์สอดคล้องกันเข้ามาในชีวิต โดยมีเกณฑ์ได้พบเจอผ่านสังคมการทำงาน การเดินทาง หรือคนแนะนำให้รู้จัก และพัฒนาความสัมพันธ์ได้อย่างอบอุ่นมั่นคง`,
            doAction: "เปิดโอกาสให้ตัวเองได้ก้าวเข้าสู่สังคมหรือกิจกรรมใหม่ๆ ดูแลบุคลิกภาพให้สดใส ยิ้มแย้มเปิดรับบทสนทนา และกล้าที่จะเปิดใจเรียนรู้คนที่เข้ามาด้วยทัศนคติเชิงบวก",
            dontAction: "อย่านำความผิดหวังหรือแผลใจในอดีตมาตั้งกำแพงตัดสินคนใหม่ที่เพิ่งเข้ามา และอย่าเร่งรัดกดดันตัวเองจนเสียความเป็นธรรมชาติ",
            luckyBoost: `เสริมพลังเสน่ห์คนโสดจากไพ่ ${outcomeName}: จัดพื้นที่ห้องนอนให้โปร่งสบายเปิดรับแสงธรรมชาติ สวมใส่เสื้อผ้าโทนสีสว่างหรือสีมงคลที่เสริมความมั่นใจ และตั้งจิตอธิษฐานถึงคุณลักษณะของคู่ที่เกื้อกูลกัน`
          };
        } else if (verdictType === "challenging") {
          return {
            plainText: `จากหน้าไพ่คนโสดทั้ง 3 ใบ (อดีต: ${c1} ➔ ปัจจุบัน: ${c2} ➔ แนวโน้มในอนาคต: ${outcomeName}) เส้นทางหัวใจเดินทางจาก "${k1}" มาสู่จังหวะ "${k2}" และส่งสัญญาณเตือนเรื่อง "${k3}" ในอนาคต ช่วงนี้เป็นจังหวะที่คนโสดควรให้ความสำคัญกับการคัดกรองคนและดูแลหัวใจตัวเองเป็นอันดับแรก`,
            deepNarrative: `หน้าไพ่สะท้อนว่าลึกๆ แล้วคุณอาจยังมีเรื่องราวในอดีตที่ตกค้าง หรือคนที่มีเกณฑ์เข้ามาในช่วงนี้ยังมีความไม่ชัดเจนบางอย่างซ่อนอยู่ การไม่รีบร้อนตกลงปลงใจแต่ใช้เวลาสังเกตความสม่ำเสมอและการกระทำระยะยาว จะช่วยปกป้องหัวใจของคุณจากความสัมพันธ์ที่เหนื่อยเปล่า และเตรียมพื้นที่ให้พร้อมสำหรับคนที่คู่ควรจริงๆ`,
            doAction: "โฟกัสกับการพัฒนาคุณค่าในตัวเอง สร้างความสุขจากสิ่งที่รัก และใช้เวลาดูความจริงใจของคนที่เข้ามาให้รอบด้านก่อนมอบใจ",
            dontAction: "อย่าให้ความเหงาผลักดันให้รีบคว้าคนที่ยังไม่ชัดเจน หรือกลับไปวนลูปความสัมพันธ์แบบเดิมที่เคยทำให้คุณเสียพลังงานชีวิต",
            luckyBoost: `เสริมพลังคุ้มครองหัวใจจากไพ่ ${outcomeName}: หมั่นเติมพลังบวกให้ตัวเองด้วยการพักผ่อนริมน้ำหรือธรรมชาติ เคลียร์ของใช้หรือความทรงจำเก่าๆ ที่ทำให้หม่นหมองออกจากพื้นที่ส่วนตัว`
          };
        }
        return {
          plainText: `จากหน้าไพ่คนโสดทั้ง 3 ใบ (อดีต: ${c1} ➔ ปัจจุบัน: ${c2} ➔ แนวโน้มในอนาคต: ${outcomeName}) พลังงานความรักเคลื่อนตัวจาก "${k1}" สู่ "${k2}" และค่อยๆ พัฒนาไปสู่ "${k3}" ความรักของคนโสดในช่วงนี้จะเติบโตจากมิตรภาพและความสบายใจแบบค่อยเป็นค่อยไป`,
          deepNarrative: `ไพ่ทั้ง 3 ใบบอกว่าความรักครั้งต่อไปไม่ได้มาในรูปแบบฉาบฉวยหวือหวา แต่จะค่อยๆ ก่อตัวขึ้นจากการพูดคุยที่ถูกคอ การช่วยเหลือเกื้อกูลกัน หรือการได้รู้จักกันในฐานะเพื่อนและกัลยาณมิตรก่อน ยิ่งคุณปล่อยให้ทุกอย่างดำเนินไปตามจังหวะธรรมชาติ ความสัมพันธ์จะยิ่งมั่นคงและปลอดภัยสำหรับหัวใจ`,
          doAction: "เริ่มต้นทำความรู้จักคนใหม่ๆ ในฐานะเพื่อนที่ปรึกษา คุยกันด้วยความสบายใจ และค่อยๆ เรียนรู้นิสัยใจคอตามจังหวะเวลา",
          dontAction: "อย่าเพิ่งปิดกั้นคนที่เข้ามาแบบเงียบๆ หรือเรียบง่าย และอย่าเพิ่งด่วนสรุปตัดสินใครจากความประทับใจแรกเพียงอย่างเดียว",
          luckyBoost: `เสริมดวงความรักคนโสดจากไพ่ ${outcomeName}: เปิดรับบทสนทนาใหม่ๆ ด้วยรอยยิ้มและความเป็นกันเอง ทำบุญหรือแบ่งปันน้ำใจให้ผู้อื่นเพื่อเปิดกระแสเมตตามหานิยม`
        };
      }

      // ไม่โสด / มีคนคุย / มีคนในใจ / มีคู่
      if (verdictType === "favorable") {
        return {
          plainText: `จากหน้าไพ่ความสัมพันธ์ทั้ง 3 ใบ (ความรู้สึกเรา: ${c1} ➔ ความรู้สึกอีกฝ่าย: ${c2} ➔ แนวโน้มในอนาคต: ${outcomeName}) พลังงานหัวใจของคุณที่เปี่ยมด้วย "${k1}" สอดรับกับความรู้สึกของอีกฝ่ายที่มี "${k2}" ส่งผลให้ทิศทางความสัมพันธ์ก้าวไปสู่ "${k3}" อย่างงดงามและมั่นคง`,
          deepNarrative: `เมื่ออ่านเชื่อมโยงทั้ง 3 ตำแหน่ง จะเห็นได้ชัดว่าความรู้สึกของทั้งสองฝ่ายมีแรงดึงดูดและความปรารถนาดีที่ตรงกัน แม้บางช่วงอาจมีจังหวะการแสดงออกที่ต่างกันบ้าง แต่แก่นแท้ของความสัมพันธ์กำลังพัฒนาไปสู่ความเข้าใจที่ลึกซึ้งขึ้น มีเกณฑ์ได้รับความชัดเจน การขยับสถานะ หรือการวางแผนอนาคตที่อบอุ่นร่วมกัน`,
          doAction: "เปิดใจสื่อสารความรู้สึกดีๆ อย่างตรงไปตรงมา แสดงความใส่ใจอย่างสม่ำเสมอ และสร้างช่วงเวลาคุณภาพร่วมกันเพื่อกระชับความผูกพัน",
          dontAction: "อย่าเก็บความสงสัยเล็กๆ น้อยๆ ไปคิดปรุงแต่งเองโดยไม่ถามไถ่ และอย่าประชดประชันเมื่ออีกฝ่ายยุ่งหรือแสดงออกไม่ทันใจ",
          luckyBoost: `เสริมดวงความสัมพันธ์จากไพ่ ${outcomeName}: ชวนกันเปลี่ยนบรรยากาศไปทานอาหารมื้อพิเศษหรือเดินทางท่องเที่ยวพักผ่อน และใช้คำพูดชื่นชมให้กำลังใจกันและกันเสมอ`
        };
      } else if (verdictType === "challenging") {
        return {
          plainText: `จากหน้าไพ่ความสัมพันธ์ทั้ง 3 ใบ (ความรู้สึกเรา: ${c1} ➔ ความรู้สึกอีกฝ่าย: ${c2} ➔ แนวโน้มในอนาคต: ${outcomeName}) สะท้อนว่าฝั่งของคุณอยู่ในสภาวะ "${k1}" ในขณะที่อีกฝ่ายมีพลังงานของ "${k2}" จึงต้องระมัดระวังจังหวะ "${k3}" ในอนาคตอันใกล้นี้`,
          deepNarrative: `หน้าไพ่ชี้ให้เห็นว่าความต้องการหรือจังหวะอารมณ์ของทั้งสองฝ่ายในช่วงนี้ยังจูนกันไม่ติด 100% อาจมีความกดดันสะสม ความเข้าใจคลาดเคลื่อน หรือระยะห่างที่เกิดจากภาระหน้าที่ การใช้ความใจเย็นและให้พื้นที่แก่กันและกันจะช่วยคลี่คลายความตึงเครียดได้ดีกว่าการเร่งรัดเอาคำตอบในทันที`,
          doAction: "เว้นระยะให้ต่างฝ่ายได้ทบทวนอารมณ์ของตัวเอง รับฟังเหตุผลของอีกฝ่ายโดยไม่ตัดสิน และใช้ความนุ่มนวลในการพูดคุยเรื่องสำคัญ",
          dontAction: "ห้ามใช้อารมณ์กดดัน คาดคั้น หรือพูดจาประชดประชันท้าทายความสัมพันธ์ในขณะที่อารมณ์กำลังคุกรุ่นเด็ดขาด",
          luckyBoost: `เคล็ดลับปรับสมดุลความรักจากไพ่ ${outcomeName}: ผ่อนคลายความคาดหวังลงชั่วคราว หันมาดูแลความสุขของตัวเองให้เต็มอิ่ม เมื่อพลังงานของคุณนิ่งและเย็นลง อีกฝ่ายจะค่อยๆ เปิดใจเข้าหาเอง`
        };
      }
      return {
        plainText: `จากหน้าไพ่ความสัมพันธ์ทั้ง 3 ใบ (ความรู้สึกเรา: ${c1} ➔ ความรู้สึกอีกฝ่าย: ${c2} ➔ แนวโน้มในอนาคต: ${outcomeName}) ความรู้สึกของคุณ ("${k1}") และความรู้สึกของอีกฝ่าย ("${k2}") กำลังปรับจูนเข้าหากันเพื่อมุ่งไปสู่ "${k3}" ในอนาคต`,
        deepNarrative: `ความสัมพันธ์นี้อยู่ในจังหวะของการเรียนรู้และปรับตัวเข้าหากัน ผลลัพธ์ในอนาคตขึ้นอยู่กับการกระทำและการเปิดใจสื่อสารของทั้งสองฝ่ายในปัจจุบัน หากลดความกังวลและเน้นสร้างความสบายใจเวลาอยู่ด้วยกัน ความสัมพันธ์จะค่อยๆ ชัดเจนและแข็งแรงขึ้นตามลำดับ`,
        doAction: "รักษาความสม่ำเสมอ สร้างบรรยากาศการพูดคุยที่ผ่อนคลายและเป็นพื้นที่ปลอดภัยให้แก่กันและกัน",
        dontAction: "อย่าด่วนสรุปความรู้สึกของอีกฝ่ายจากท่าทีภายนอกเพียงชั่วคราว และอย่านำเรื่องเก่ามาเล่าใหม่",
        luckyBoost: `เสริมพลังความเข้าอกเข้าใจจากไพ่ ${outcomeName}: เน้นการเป็นผู้ฟังที่ดีและส่งมอบความปรารถนาดีอย่างจริงใจโดยไม่กดดันเรื่องเวลา`
      };
    }

    if (this.category === "career") {
      if (verdictType === "favorable") {
        return {
          plainText: `จากหน้าไพ่การงานทั้ง 3 ใบ (อดีต: ${c1} ➔ ปัจจุบัน: ${c2} ➔ อนาคต: ${outcomeName}) เส้นทางอาชีพของคุณต่อยอดจาก "${k1}" สู่จังหวะปัจจุบัน "${k2}" และกำลังพุ่งทะยานสู่ "${k3}" อย่างมั่นคงและโดดเด่น`,
          deepNarrative: `ความทุ่มเทและประสบการณ์ที่คุณสั่งสมมาในอดีตกำลังออกดอกออกผลอย่างชัดเจนในปัจจุบัน และเปิดทางไปสู่ความสำเร็จก้าวสำคัญในอนาคต มีเกณฑ์ได้รับความไว้วางใจจากผู้ใหญ่ การเลื่อนขั้น การปิดดีลสำคัญ หรือการขยับขยายโปรเจกต์ที่สร้างชื่อเสียงและผลตอบแทนที่คุ้มค่า`,
          doAction: "เดินหน้าลงมือทำตามแผนที่วางไว้ด้วยความมั่นใจ แสดงศักยภาพความเป็นผู้นำ และคว้าโอกาสใหม่ที่เข้ามาทันที",
          dontAction: "อย่าลังเลหรือถ่อมตัวจนปล่อยให้โอกาสสำคัญหลุดมือ และอย่าละเลยรายละเอียดในสัญญาหรือเอกสารสำคัญ",
          luckyBoost: `เสริมพลังความสำเร็จด้านการงานจากไพ่ ${outcomeName}: จัดโต๊ะทำงานให้เป็นระเบียบโปร่งโล่ง เปิดรับแสงสว่าง และเริ่มต้นวันด้วยการจดลำดับเป้าหมายสำคัญ 3 ข้อเสมอ`
        };
      } else if (verdictType === "challenging") {
        return {
          plainText: `จากหน้าไพ่การงานทั้ง 3 ใบ (อดีต: ${c1} ➔ ปัจจุบัน: ${c2} ➔ อนาคต: ${outcomeName}) สะท้อนการเปลี่ยนผ่านจาก "${k1}" มาเผชิญโจทย์ "${k2}" ในปัจจุบัน และเตือนให้วางแผนรับมือ "${k3}" ในระยะถัดไปอย่างรอบคอบ`,
          deepNarrative: `ช่วงนี้การงานอาจมีบททดสอบด้านเวลา ขั้นตอนที่ซับซ้อน หรือแรงกดดันจากสภาพแวดล้อมรอบข้าง แต่หน้าไพ่ชี้ว่าปัญหานี้สามารถแก้ไขได้ด้วยการจัดระบบงานใหม่และการสื่อสารที่รัดกุม การมีแผนสำรองและไม่ใช้อารมณ์ตัดสินใจจะช่วยให้คุณพลิกวิกฤตเป็นโอกาสพิสูจน์ฝีมือได้สำเร็จ`,
          doAction: "ตรวจสอบรายละเอียดงานและเอกสารทุกชิ้นให้รัดกุม วางแผนสำรองล่วงหน้า และประสานงานกับทีมด้วยความชัดเจนเป็นลายลักษณ์อักษร",
          dontAction: "อย่าวู่วามตัดสินใจลาออกหรือเปลี่ยนแผนกะทันหันด้วยอารมณ์ชั่ววูบ และหลีกเลี่ยงการปะทะคารมในที่ทำงาน",
          luckyBoost: `เสริมพลังความมั่นคงในการทำงานจากไพ่ ${outcomeName}: พักสายตาและสูดลมหายใจลึกๆ ก่อนตัดสินใจเรื่องยากๆ และขอคำปรึกษาจากผู้เชี่ยวชาญที่มีประสบการณ์`
        };
      }
      return {
        plainText: `จากหน้าไพ่การงานทั้ง 3 ใบ (อดีต: ${c1} ➔ ปัจจุบัน: ${c2} ➔ อนาคต: ${outcomeName}) ทิศทางการงานพัฒนาจาก "${k1}" สู่ "${k2}" และมุ่งหน้าสู่ "${k3}" ด้วยความมั่นคงตามลำดับขั้นตอน`,
        deepNarrative: `ดวงการงานของคุณอยู่ในจังหวะของการสร้างรากฐานและพัฒนาทักษะให้แข็งแกร่ง ยิ่งคุณรักษามาตรฐานความรับผิดชอบและทำงานอย่างเป็นระบบมากเท่าไร ผลลัพธ์ในอนาคตก็จะยิ่งมั่นคงและเปิดทางสู่โอกาสที่ใหญ่ขึ้นในจังหวะเวลาที่เหมาะสม`,
        doAction: "จัดลำดับความสำคัญของงาน พัฒนาทักษะเฉพาะทางเพิ่มเติม และรักษามาตรฐานผลงานให้สม่ำเสมอ",
        dontAction: "อย่าปล่อยให้งานคั่งค้างสะสม หรือทำงานแบบไร้ทิศทางโดยไม่กำหนดกรอบเวลา",
        luckyBoost: `เสริมพลังความก้าวหน้าจากไพ่ ${outcomeName}: เรียนรู้เทคโนโลยีหรือทักษะใหม่ๆ เพิ่มเติม และสร้างเครือข่ายกัลยาณมิตรในสายงาน`
      };
    }

    if (this.category === "finance") {
      if (verdictType === "favorable") {
        return {
          plainText: `จากหน้าไพ่การเงินทั้ง 3 ใบ (เหตุ: ${c1} ➔ ผลปัจจุบัน: ${c2} ➔ สรุปอนาคต: ${outcomeName}) กระแสการเงินเชื่อมต่อจาก "${k1}" สู่ "${k2}" และเปิดทางรับโชคลาภความมั่งคั่ง "${k3}" อย่างชัดเจน`,
          deepNarrative: `การบริหารจัดการหรือสิ่งที่คุณได้ลงทุนลงแรงไว้ในอดีตกำลังส่งผลบวกต่อสภาพคล่องในปัจจุบัน และมีแนวโน้มเติบโตต่อเนื่องในอนาคต มีเกณฑ์ได้รับเงินก้อน ผลกำไร รายได้เสริม หรือโชคลาภทางการเงินที่ช่วยให้ฐานะการเงินมั่งคั่งและมั่นคงยิ่งขึ้น`,
          doAction: "แบ่งสัดส่วนรายรับเพื่อการออมและต่อยอดการลงทุนในสินทรัพย์ที่มีความมั่นคงทันทีที่เงินเข้ามือ",
          dontAction: "อย่าใช้จ่ายตามอารมณ์หรือซื้อของฟุ่มเฟือยเกินความจำเป็นเพียงเพราะเห็นว่ากระแสเงินกำลังไหลเข้าดี",
          luckyBoost: `เสริมพลังเรียกทรัพย์จากไพ่ ${outcomeName}: จัดกระเป๋าสตางค์ให้เป็นระเบียบเรียบร้อย แยกธนบัตรเรียงตามมูลค่า และแบ่งปันทำบุญตามกำลังเพื่อเปิดกระแสทานบารมี`
        };
      } else if (verdictType === "challenging") {
        return {
          plainText: `จากหน้าไพ่การเงินทั้ง 3 ใบ (เหตุ: ${c1} ➔ ผลปัจจุบัน: ${c2} ➔ สรุปอนาคต: ${outcomeName}) เตือนให้เห็นผลต่อเนื่องจาก "${k1}" สู่ "${k2}" และต้องวางแผนรัดกุมเพื่อรับมือ "${k3}" ในอนาคต`,
          deepNarrative: `หน้าไพ่ส่งสัญญาณให้ระมัดระวังรายจ่ายแฝง รายจ่ายฉุกเฉิน หรือการหมุนเงินที่อาจตึงมือในช่วงสั้นๆ การชะลอการลงทุนที่มีความเสี่ยงสูงและกลับมาอุดรูรั่วทางการเงินตั้งแต่วันนี้ จะช่วยให้คุณผ่านพ้นจังหวะนี้ไปได้อย่างปลอดภัยไร้หนี้สินพอกพูน`,
          doAction: "ทำบัญชีรายรับ-รายจ่ายอย่างละเอียด ตัดค่าใช้จ่ายที่ไม่จำเป็นออก และกันเงินสำรองฉุกเฉินไว้เป็นอันดับแรก",
          dontAction: "ห้ามให้ผู้อื่นหยิบยืมเงิน ห้ามเซ็นค้ำประกัน และงดการเสี่ยงโชคหรือลงทุนตามคำชักชวนที่เกินตัวเด็ดขาด",
          luckyBoost: `เคล็ดลับแก้เคล็ดการเงินจากไพ่ ${outcomeName}: ชำระบิลหรือหนี้สินตรงเวลา และตั้งเป้าหมายการออมแบบอัตโนมัติแม้เป็นจำนวนเงินเล็กน้อยเพื่อสร้างวินัยใหม่`
        };
      }
      return {
        plainText: `จากหน้าไพ่การเงินทั้ง 3 ใบ (เหตุ: ${c1} ➔ ผลปัจจุบัน: ${c2} ➔ สรุปอนาคต: ${outcomeName}) กระแสการเงินเคลื่อนจาก "${k1}" สู่ "${k2}" และสรุปจบที่ "${k3}" ในเกณฑ์สมดุลและหมุนเวียนได้ดี`,
        deepNarrative: `สถานะการเงินโดยรวมมีความมั่นคงในระดับที่ควบคุมได้ รายรับและรายจ่ายสอดคล้องกัน หากคุณวางแผนงบประมาณล่วงหน้าและมองหาช่องทางสร้างรายได้เสริมจากทักษะที่มี จะช่วยให้การเงินเติบโตอย่างต่อเนื่อง`,
        doAction: "วางแผนงบประมาณรายเดือนอย่างชัดเจน และต่อยอดทักษะที่มีเพื่อสร้างช่องทางรายได้เสริม",
        dontAction: "อย่าก่อภาระผ่อนชำระก้อนใหม่ที่ยังไม่จำเป็นในช่วงนี้",
        luckyBoost: `เสริมดวงการเงินสมดุลจากไพ่ ${outcomeName}: จดบันทึกเป้าหมายทางการเงินระยะสั้นและระยะยาวให้ชัดเจนเพื่อดึงดูดโอกาสใหม่ๆ`
      };
    }

    // สุขภาพ (health)
    if (verdictType === "favorable") {
      return {
        plainText: `จากหน้าไพ่สุขภาพทั้ง 3 ใบ (เหตุ: ${c1} ➔ ผลปัจจุบัน: ${c2} ➔ สรุปอนาคต: ${outcomeName}) พลังงานชีวิตส่งผลจาก "${k1}" สู่ "${k2}" และมุ่งสู่สภาวะสมดุลแข็งแรง "${k3}"`,
        deepNarrative: `ทั้งร่างกายและจิตใจของคุณมีเกณฑ์ฟื้นฟูและกลับมามีชีวิตชีวาอย่างเต็มเปี่ยม อาการเหนื่อยล้าหรือความกังวลก่อนหน้าจะค่อยๆ คลี่คลายลง เป็นจังหวะที่ดีเยี่ยมในการเริ่มต้นดูแลสุขภาพเชิงรุกเพื่อความแข็งแรงในระยะยาว`,
        doAction: "รักษาวินัยการออกกำลังกายสม่ำเสมอ พักผ่อนให้เพียงพอ และเลือกรับประทานอาหารที่สดใหม่มีประโยชน์",
        dontAction: "อย่าโหมงานหนักติดต่อกันจนละเลยสัญญาณเตือนพื้นฐานของร่างกาย",
        luckyBoost: `เสริมพลังสุขภาพจากไพ่ ${outcomeName}: รับแสงแดดอ่อนๆ ยามเช้า ฝึกหายใจลึกๆ และดื่มน้ำสะอาดให้เพียงพอตลอดวัน`
      };
    } else if (verdictType === "challenging") {
      return {
        plainText: `จากหน้าไพ่สุขภาพทั้ง 3 ใบ (เหตุ: ${c1} ➔ ผลปัจจุบัน: ${c2} ➔ สรุปอนาคต: ${outcomeName}) สะท้อนผลสะสมจาก "${k1}" ที่ส่งผลเป็น "${k2}" ในปัจจุบัน และเตือนให้ดูแลเรื่อง "${k3}" อย่างใกล้ชิด`,
        deepNarrative: `หน้าไพ่เตือนว่าการใช้พลังงานสะสมหรือความเครียดในช่วงที่ผ่านมาเริ่มส่งสัญญาณผ่านร่างกาย เช่น อาการอ่อนเพลีย นอนไม่หลับ หรือออฟฟิศซินโดรม การหันมาจัดเวลาพักผ่อนและตรวจเช็กสุขภาพตั้งแต่เนิ่นๆ จะช่วยให้ฟื้นตัวได้อย่างรวดเร็ว`,
        doAction: "จัดสรรเวลาพักผ่อนให้เพียงพอ ผ่อนคลายความเครียดก่อนนอน และพบแพทย์เพื่อตรวจเช็กร่างกายหากมีอาการผิดปกติ",
        dontAction: "อย่าฝืนร่างกายทำงานหามรุ่งหามค่ำ และหลีกเลี่ยงความประมาทในการเดินทางหรือการใช้ชีวิตประจำวัน",
        luckyBoost: `เสริมพลังฟื้นฟูกายใจจากไพ่ ${outcomeName}: งดหน้าจอก่อนนอนอย่างน้อย 30 นาที ฟังเพลงบรรเลงผ่อนคลาย และปรับสภาพแวดล้อมห้องนอนให้สงบมืดสนิท`
      };
    }
    return {
      plainText: `จากหน้าไพ่สุขภาพทั้ง 3 ใบ (เหตุ: ${c1} ➔ ผลปัจจุบัน: ${c2} ➔ สรุปอนาคต: ${outcomeName}) พลังงานสุขภาพเชื่อมโยงจาก "${k1}" สู่ "${k2}" และสรุปที่ "${k3}" ในเกณฑ์สมดุลตามการดูแลตัวเอง`,
      deepNarrative: `สุขภาพโดยรวมอยู่ในเกณฑ์ปานกลางที่สามารถฟื้นฟูให้ดีขึ้นได้อย่างชัดเจนหากปรับสมดุลการทำงานและการพักผ่อนให้เหมาะสม ร่างกายพร้อมตอบสนองต่อการดูแลเอาใจใส่ในชีวิตประจำวันเป็นอย่างดี`,
      doAction: "ปรับเวลานอนให้ตรงเวลา ขยับร่างกายยืดเหยียดกล้ามเนื้อทุกวัน และดูแลสุขภาพจิตให้แจ่มใส",
      dontAction: "อย่าปล่อยให้ความเครียดสะสมค้างคาข้ามวัน",
      luckyBoost: `เสริมสมดุลพลังชีวิตจากไพ่ ${outcomeName}: หาเวลาออกไปสูดอากาศบริสุทธิ์ท่ามกลางธรรมชาติในวันหยุด`
    };
  }

  // =========================================================================
  // SOCIAL SHARE STUDIO (INFO CARD + FULL READING CAPTION) & PDF DOWNLOAD
  // =========================================================================

  async openSocialShareStudio(readingPayload) {
    const payload = readingPayload || this.currentReadingPayload;
    if (!payload) return;

    window.mysticAudio.playClick();
    window.shareAndPdfEngine.currentReadingData = payload;

    if (this.shareModal) {
      this.shareModal.classList.add("active");
    }

    // Populate Full Caption Textarea
    const fullCaption = window.shareAndPdfEngine.buildFullSocialCaption(payload);
    if (this.shareFullCaptionTextarea) {
      this.shareFullCaptionTextarea.value = fullCaption;
    }

    // Render Info Card PNG
    if (payload.mode === "siamsi") {
      const { dataUrl } = await window.shareAndPdfEngine.generateSiamsiInfoCard(payload);
      if (this.shareInfoPreviewImg) this.shareInfoPreviewImg.src = dataUrl;
    } else {
      const { dataUrl } = await window.shareAndPdfEngine.generateTarotInfoCard(payload);
      if (this.shareInfoPreviewImg) this.shareInfoPreviewImg.src = dataUrl;
    }
  }

  async executeNativeShareWithInfoAndCaption() {
    const payload = window.shareAndPdfEngine.currentReadingData || this.currentReadingPayload;
    if (!payload) return;

    const fullCaption = window.shareAndPdfEngine.buildFullSocialCaption(payload);

    // Copy full caption to clipboard automatically so user can also paste in comments immediately
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(fullCaption);
      }
    } catch (e) {}

    if (this.activeCode) {
      window.codeManager.recordActionLog(this.activeCode, "share", "ลูกค้ากดแชร์รูป Info + คำทำนายเต็มไปยังโซเชียล");
    }

    const blob = window.shareAndPdfEngine.currentInfoBlob;
    if (navigator.share && blob) {
      const file = new File([blob], `SiamSiTarot_Info_${payload.code || "Reading"}.png`, { type: "image/png" });
      const shareData = {
        title: `🔮 ผลคำทำนายเซียมซีทาโรต์`,
        text: fullCaption,
        files: [file]
      };

      if (!navigator.canShare || navigator.canShare({ files: [file] })) {
        try {
          await navigator.share(shareData);
          this.showToast(I18N[this.lang].toast_share_success);
          return;
        } catch (err) {
          if (err.name === "AbortError") return;
        }
      }

      // Fallback share text if file sharing not supported on desktop browser
      try {
        await navigator.share({
          title: `🔮 ผลคำทำนายเซียมซีทาโรต์`,
          text: fullCaption
        });
        this.showToast(I18N[this.lang].toast_share_success);
        return;
      } catch (err) {}
    }

    // Desktop fallback: download the Info Card PNG and copy full text to clipboard
    await window.shareAndPdfEngine.downloadInfoImageFile(payload);
    this.showToast("🖼️ ดาวน์โหลดรูป Info Card และคัดลอกคำทำนายเต็มให้แล้ว! นำไปโพสต์ได้เลย");
  }

  async shareToSocialPlatform(platform, modeHint = "active") {
    let payload = null;
    if (modeHint === "siamsi" && this.siamsiApp && this.siamsiApp.currentSign) {
      payload = this.siamsiApp.buildSiamsiReadingPayload(this.siamsiApp.currentSign);
    } else if (modeHint === "tarot" && this.currentReadingPayload) {
      payload = this.currentReadingPayload;
    } else {
      payload = window.shareAndPdfEngine.currentReadingData ||
        this.currentReadingPayload ||
        (this.siamsiApp && this.siamsiApp.currentSign ? this.siamsiApp.buildSiamsiReadingPayload(this.siamsiApp.currentSign) : null);
    }
    if (!payload) return;

    await this.openSocialShareStudio(payload);

    const fullCaption = window.shareAndPdfEngine.buildFullSocialCaption(payload);
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(fullCaption);
      }
    } catch (e) {}

    if (this.activeCode) {
      window.codeManager.recordActionLog(this.activeCode, "share", `ลูกค้ากดแชร์ผลคำทำนายไปยัง ${platform.toUpperCase()}`);
    }

    // Download the Info Card PNG so user can attach it immediately on Facebook / IG / TikTok / LINE / X
    await window.shareAndPdfEngine.downloadInfoImageFile(payload);

    const shareUrl = window.location.origin + window.location.pathname;
    const shortSummary = payload.mode === "siamsi"
      ? `🎋 ผลคำทำนายเซียมซีทาโรต์ เบอร์ ${payload.signNumber} (${payload.signTitle || ""}) — "${payload.oneLine || ""}" #เซียมซีทาโรต์ #ดูดวง`
      : `🔮 ผลคำทำนายไพ่ทาโรต์ 3 ใบ หมวด${payload.categoryName || "ดวงชะตา"}: ${(payload.cards || []).map(c => c.name_th).join(" • ")} (${payload.verdictBadge || ""}) #เซียมซีทาโรต์ #ดูดวงไพ่ทาโรต์`;

    if (platform === "facebook") {
      const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shortSummary)}`;
      window.open(fbUrl, "_blank", "noopener,noreferrer");
      this.showToast("📘 บันทึกรูป Info Card + คัดลอกคำทำนายเต็มแล้ว! กดวางโพสต์ลง Facebook ได้เลย");
    } else if (platform === "instagram") {
      window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
      this.showToast("📸 บันทึกรูป Info Card + คัดลอกคำทำนายแล้ว! เลือกรูปโพสต์ลง IG Story / Feed แล้ววางแคปชันได้เลย");
    } else if (platform === "tiktok") {
      window.open("https://www.tiktok.com/upload", "_blank", "noopener,noreferrer");
      this.showToast("🎵 บันทึกรูป Info Card + คัดลอกคำทำนายแล้ว! อัปโหลดรูปลง TikTok แล้ววางแคปชันได้เลย");
    } else if (platform === "line") {
      const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shortSummary)}`;
      window.open(lineUrl, "_blank", "noopener,noreferrer");
      this.showToast("💚 บันทึกรูป Info Card + คัดลอกคำทำนายเต็มสำหรับแชร์ลง LINE เรียบร้อยแล้ว!");
    } else if (platform === "x") {
      const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shortSummary)}`;
      window.open(xUrl, "_blank", "noopener,noreferrer");
      this.showToast("𝕏 บันทึกรูป Info Card + เปิดหน้าโพสต์ X เรียบร้อยแล้ว!");
    }
  }

  async downloadDirectPDF(readingPayload) {
    const payload = readingPayload || this.currentReadingPayload;
    if (!payload) return;

    window.mysticAudio.playClick();
    this.showToast("⏳ กำลังสร้างไฟล์ PDF ใบคำทำนาย...");

    const ok = await window.shareAndPdfEngine.downloadReadingPdfFile(payload);
    if (ok) {
      if (this.activeCode) {
        await window.codeManager.recordActionLog(this.activeCode, "pdf", "ลูกค้าดาวน์โหลดไฟล์ PDF คำทำนายลงเครื่อง");
      }
      this.showToast(I18N[this.lang].toast_pdf_downloaded);
      window.mysticAudio.playCrystalBell(880, 1.3);
    }
  }

  copyReadingToClipboard() {
    if (!this.currentReadingPayload) return;
    const textToCopy = window.shareAndPdfEngine.buildFullSocialCaption(this.currentReadingPayload);
    navigator.clipboard.writeText(textToCopy).then(() => {
      if (this.activeCode) {
        window.codeManager.recordActionLog(this.activeCode, "share", "ลูกค้าคัดลอกคำทำนายฉบับเต็ม");
      }
      this.showToast(I18N[this.lang].toast_copied);
      window.mysticAudio.playCrystalBell(880, 1.2);
    });
  }

  // =========================================================================
  // SHARED URL VIEWER & CARD DETAIL MODAL
  // =========================================================================

  checkSharedReadingUrl() {
    try {
      const params = new URLSearchParams(window.location.search);
      const cardsParam = params.get("cards");
      if (!cardsParam) return false;

      const cardEntries = cardsParam.split(",").map(s => s.trim()).filter(Boolean);
      if (cardEntries.length === 0) return false;

      const reconstructedCards = [];
      for (const entry of cardEntries.slice(0, 3)) {
        const parts = entry.split(":");
        const cardId = parts[0].trim();
        const isReversed = parts[1] === "1" || parts[1] === "true";
        const card = TAROT_CARDS.find(c => c.id === cardId);
        if (card) {
          reconstructedCards.push({ card, isReversed });
        }
      }

      if (reconstructedCards.length === 0) return false;

      this.isSharedView = true;
      this.drawnCards = reconstructedCards;
      this.spreadCount = 3;

      const catParam = params.get("cat");
      if (catParam && ["love", "career", "finance", "health"].includes(catParam)) {
        this.category = catParam;
      }

      const nameParam = params.get("name");
      if (nameParam) this.seekerName = nameParam.trim();

      if (this.accessGateScreen) this.accessGateScreen.classList.remove("active");
      if (this.tarotModeContainer) this.tarotModeContainer.style.display = "block";
      if (this.sharedReadingNotice) this.sharedReadingNotice.style.display = "flex";

      this.renderResults();
      this.switchScreen("results");
      return true;
    } catch (err) {
      return false;
    }
  }

  resetToOwnReading() {
    this.isSharedView = false;
    if (window.history && window.history.replaceState) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    if (this.sharedReadingNotice) this.sharedReadingNotice.style.display = "none";
    this.showAccessGate();
  }

  openCardModal(card, isReversed = false) {
    const dict = I18N[this.lang];
    const cardName = this.lang === "th" ? card.name_th : card.name_en;
    const orientTag = isReversed ? dict.card_reversed : dict.card_upright;
    const aspect = isReversed ? card.reversed : card.upright;
    const domainName = I18N[this.lang]["cat_" + this.category];
    const domainInfo = this.getCardDomainText(card, isReversed, this.category, this.lang);
    const safeImg = encodeURI(card.image);

    this.modalBody.innerHTML = `
      <div class="modal-card-detail-layout">
        <div class="modal-card-image-col">
          <img src="${safeImg}" alt="${cardName}" style="${isReversed ? 'transform:rotate(180deg);' : ''}" />
          <div style="margin-top:0.8rem; text-align:center;">
            <span class="kw-badge">${card.element[this.lang]}</span>
          </div>
        </div>
        <div class="modal-card-info-col">
          <h2 style="font-family:var(--font-title); color:var(--gold-primary); margin-bottom:0.3rem;">
            ${cardName} [${orientTag}]
          </h2>
          <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:1rem;">
            หมวด${domainName} • ${aspect.keywords[this.lang].join(" • ")}
          </p>
          <div style="margin-bottom:1.2rem; background:rgba(245, 197, 66, 0.08); border-left:3px solid var(--gold-primary); padding:1rem; border-radius:8px;">
            <h4 style="color:var(--gold-primary); margin-bottom:0.5rem;">✦ คำทำนายด้าน${domainName}</h4>
            <div style="font-size:0.95rem; line-height:1.65;">${domainInfo.fullHtml}</div>
          </div>
          <div class="witch-advice-box">
            <div class="witch-icon-small">🔮</div>
            <div>
              <h5>${dict.witch_advice}</h5>
              <p>“${aspect.advice[this.lang]}”</p>
            </div>
          </div>
        </div>
      </div>
    `;

    this.modal.classList.add("active");
  }

  closeModal() {
    if (this.modal) this.modal.classList.remove("active");
  }
}

window.addEventListener("DOMContentLoaded", () => {
  window.tarotApp = new TarotApp();
  if (window.siamsiApp) {
    window.siamsiApp.app = window.tarotApp;
    window.tarotApp.siamsiApp = window.siamsiApp;
  } else if (typeof SiamsiApp !== "undefined") {
    window.siamsiApp = new SiamsiApp(window.tarotApp);
    window.tarotApp.siamsiApp = window.siamsiApp;
  }
});
