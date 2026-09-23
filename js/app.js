/**
 * Mystic Witch Tarot Sanctuary - Core Application Controller
 * Handles I18n, Spread Logic, Ritual Transitions, 3D Card Reveals,
 * Question Intent Synthesis, and Grimoire Exploration.
 */

// =========================================================================
// 1. I18N DICTIONARY (THAI & ENGLISH)
// =========================================================================
const I18N = {
  th: {
    brand_title: "MYSTIC WITCH",
    brand_sub: "Tarot Sanctuary",
    btn_grimoire: "คัมภีร์ 78 ใบ",
    sound_on: "เสียง",
    sound_off: "ปิดเสียง",
    hero_title: "แท่นบูชาแม่มดพยากรณ์",
    hero_desc: "“จงสงบจิตใจ รวบรวมสมาธิ และเอ่ยวาจาถึงเรื่องที่ท่านปรารถนาจะล่วงรู้ผ่านม่านแห่งชะตากรรม...”",
    label_category: "เลือกเรื่องที่ต้องการพยากรณ์",
    cat_love: "ความรัก",
    cat_career: "การงาน",
    cat_finance: "การเงิน",
    cat_health: "สุขภาพ",
    cat_general: "ทั่วไป/ตัดสินใจ",
    label_question: "พิมพ์คำถามของท่านอย่างตั้งใจ",
    placeholder_question: "เช่น คนที่คุยอยู่ตอนนี้เขารู้สึกอย่างไรกับเรา? หรือ มีโอกาสได้งานใหม่ในเดือนนี้ไหม?",
    label_spread: "รูปแบบการวางไพ่ทาโรต์",
    spread_1_name: "ไพ่ 1 ใบ",
    spread_1_desc: "คำตอบเร่งด่วน หรือไพ่ประจำวัน",
    spread_3_name: "ไพ่ 3 ใบ",
    spread_3_desc: "อดีต • ปัจจุบัน • อนาคต",
    spread_4_name: "ไพ่ 4 ใบ",
    spread_4_desc: "เจาะลึกแก้ไขปัญหา",
    spread_5_name: "ไพ่ 5 ใบ",
    spread_5_desc: "ภาพรวมทิศทางชีวิต",
    btn_begin: "เริ่มพิธีกรรมสับไพ่และเปิดดวงชะตา",
    
    drawing_title: "เลือกไพ่ทาโรต์ของท่าน",
    drawing_sub: "กรุณาใช้สมาธิเลือกไพ่ทีละใบจากสำรับ หรือใช้ญาณทัศน์ของแม่มดเลือกให้อัตโนมัติ",
    drawing_progress: "เลือกไพ่แล้ว {current} จากทั้งหมด {total} ใบ",
    btn_intuition: "พลังญาณทัศน์แม่มด (สุ่มเลือกให้)",
    btn_reshuffle: "สับไพ่อีกครั้ง",
    
    results_title: "คำทำนายจากม่านมนตรา",
    synthesis_title: "บทสังเคราะห์พลังงานชะตาจากแม่มด",
    btn_ask_again: "ถามคำถามใหม่",
    btn_copy_reading: "คัดลอกคำทำนาย",
    btn_explore_grimoire: "เปิดดูคัมภีร์ไพ่ 78 ใบ",
    toast_copied: "คัดลอกคำทำนายไปยังคลิปบอร์ดแล้ว!",
    
    // Direct Verdict & Gemini Integration
    verdict_box_title: "บทสรุปภาพรวมดวงชะตาตามตำรา",
    verdict_badge_favorable: "🌟 แนวโน้มเป็นบวกมาก (สำเร็จ / ราบรื่น)",
    verdict_badge_neutral: "⚖️ แนวโน้มปานกลาง / ขึ้นอยู่กับการตัดสินใจ",
    verdict_badge_challenging: "⚠️ มีอุปสรรค / ควรตั้งรับอย่างระมัดระวัง",
    verdict_do: "สิ่งที่ควรทำตามคำแนะนำของไพ่:",
    verdict_dont: "สิ่งที่ไม่ควรทำ / ข้อควรระวัง:",
    card_question_connection: "ความหมายและคำทำนายตามตำราในตำแหน่งนี้",
    gemini_box_title: "คุยต่อกับ Gemini AI เพื่อความเข้าใจที่ลึกซึ้งยิ่งขึ้น",
    gemini_box_desc: "ต้องการเจาะลึกเฉพาะจุด หรือขอคำปรึกษาเพิ่มเติม? กรอกคำถามที่ท่านสงสัยด้านล่าง แล้วกดปุ่มเพื่อคัดลอกคำทำนายและเปิด Gemini ทันที จากนั้นเพียงกดวาง (Ctrl+V / Cmd+V) ในหน้าต่าง Gemini เพื่อคุยต่อได้เลย!",
    gemini_input_label: "กรอกคำถามเฉพาะเจาะจงที่ท่านอยากปรึกษา AI เพิ่มเติมจากไพ่ชุดนี้ (ถ้ามี):",
    gemini_input_placeholder: "เช่น คนที่คุยอยู่ตอนนี้เขารู้สึกอย่างไรกับเรา? หรือ ควรตัดสินใจเปลี่ยนงานดีไหม? (หรือเว้นว่างไว้เพื่อให้ AI วิเคราะห์ภาพรวม)",
    btn_copy_open_gemini: "คัดลอกคำถาม+คำทำนาย & เข้าสู่ Gemini ทันที (แค่กดวาง)",
    btn_copy_gemini: "คัดลอกข้อความอย่างเดียว",
    btn_open_gemini: "เปิดเว็บ Gemini.google.com",
    gemini_preview_title: "ข้อความคำถามที่จัดเตรียมไว้ให้ Gemini:",
    toast_gemini_copied: "คัดลอกคำถามและคำทำนายสำหรับ Gemini เรียบร้อยแล้ว! นำไปวาง (Ctrl+V / Cmd+V) ในหน้าต่าง Gemini ได้ทันที",
    toast_gemini_copied_and_opened: "✨ คัดลอกคำถามและคำทำนายแล้ว! กำลังพาเข้า Gemini... เพียงกดวาง (Ctrl+V / Cmd+V) ได้ทันที",

    grimoire_heading: "คัมภีร์ไพ่ทาโรต์ (Tarot Grimoire)",
    grimoire_sub: "ศึกษาความหมาย ลวดลาย และจิตวิญญาณแห่งไพ่ทาโรต์ทั้ง 78 ใบ",
    placeholder_search: "ค้นหาชื่อไพ่ หรือคีย์เวิร์ด...",
    filter_all: "ทั้งหมด (78)",
    filter_major: "Major Arcana (22)",
    filter_pentacles: "ไพ่เหรียญ (14)",
    filter_cups: "ไพ่ถ้วย (14)",
    filter_swords: "ไพ่ดาบ (14)",
    filter_wands: "ไพ่ไม้ (14)",
    
    footer_credits: "Mystic Witch Tarot • พัฒนาด้วยความเคารพในศาสตร์แห่งไพ่ทาโรต์และจิตวิทยาเชิงสัญลักษณ์",
    card_upright: "ไพ่ตั้งตรง (Upright)",
    card_reversed: "ไพ่กลับหัว (Reversed)",
    witch_advice: "คำแนะนำจากแม่มด",
    category_meaning: "คำทำนายเฉพาะด้าน",
    general_meaning: "ความหมายโดยรวม",
    keywords: "คีย์เวิร์ดสำคัญ",
    empty_question: "คำถามเรื่องทั่วไปและทิศทางโชคชะตา"
  },
  en: {
    brand_title: "MYSTIC WITCH",
    brand_sub: "Tarot Sanctuary",
    btn_grimoire: "78 Cards Grimoire",
    sound_on: "Sound",
    sound_off: "Muted",
    hero_title: "Witch's Divination Altar",
    hero_desc: "“Still your mind, gather your focus, and speak the longing of your heart into the cosmic tapestry of fate...”",
    label_category: "Select Divination Domain",
    cat_love: "Love & Romance",
    cat_career: "Career & Work",
    cat_finance: "Wealth & Finance",
    cat_health: "Health & Well-being",
    cat_general: "General & Decision",
    label_question: "Enter Your Sacred Question",
    placeholder_question: "e.g., How does someone feel about me right now? Or, will my new business venture succeed?",
    label_spread: "Tarot Spread Selection",
    spread_1_name: "1 Card Oracle",
    spread_1_desc: "Direct answer or daily guidance",
    spread_3_name: "3 Cards Spread",
    spread_3_desc: "Past • Present • Future",
    spread_4_name: "4 Cards Problem Solver",
    spread_4_desc: "Root cause & clear remedies",
    spread_5_name: "5 Cards Destiny",
    spread_5_desc: "Comprehensive life path guidance",
    btn_begin: "Commence the Sacred Shuffle Ritual",
    
    drawing_title: "Select Your Tarot Cards",
    drawing_sub: "Draw each card with mindful intent, or invoke the Witch's Intuition for an automatic draw.",
    drawing_progress: "Drawn {current} of {total} cards",
    btn_intuition: "Witch's Intuition (Auto Draw)",
    btn_reshuffle: "Reshuffle the Deck",
    
    results_title: "Whispers from the Arcana",
    synthesis_title: "The Witch's Grand Synthesis",
    btn_ask_again: "Ask Another Question",
    btn_copy_reading: "Copy Reading",
    btn_explore_grimoire: "Explore 78 Grimoire",
    toast_copied: "Reading copied to clipboard!",
    
    // Direct Verdict & Gemini Integration
    verdict_box_title: "Traditional Tarot Oracle Synthesis",
    verdict_badge_favorable: "🌟 Highly Favorable / Affirmative",
    verdict_badge_neutral: "⚖️ Neutral / Agency & Decision Required",
    verdict_badge_challenging: "⚠️ Challenging / Caution & Preparation Advised",
    verdict_do: "Recommended Actions (Do):",
    verdict_dont: "What to Avoid (Don't):",
    card_question_connection: "Traditional Meaning in This Spread Position",
    gemini_box_title: "Continue the Consultation with Gemini AI",
    gemini_box_desc: "Desire deeper psychological insights or personalized guidance? Enter any specific question below, then click to copy and launch Gemini directly to paste (Ctrl+V / Cmd+V)!",
    gemini_input_label: "Enter a specific question you want Gemini AI to answer based on these cards (optional):",
    gemini_input_placeholder: "e.g., How does someone feel about me right now? Or, will my business venture succeed? (or leave blank for in-depth overview)",
    btn_copy_open_gemini: "Copy Question + Reading & Launch Gemini (Ready to Paste)",
    btn_copy_gemini: "Copy Text Prompt Only",
    btn_open_gemini: "Open Gemini.google.com",
    gemini_preview_title: "Prepared Prompt for Gemini AI:",
    toast_gemini_copied: "Copied Gemini prompt to clipboard! Paste (Ctrl+V / Cmd+V) into Gemini to start chatting.",
    toast_gemini_copied_and_opened: "✨ Reading copied! Launching Gemini... simply press Paste (Ctrl+V / Cmd+V)!",

    grimoire_heading: "The Tarot Grimoire",
    grimoire_sub: "Explore the sacred symbolism and profound wisdom of all 78 Tarot Cards.",
    placeholder_search: "Search card name or keyword...",
    filter_all: "All Cards (78)",
    filter_major: "Major Arcana (22)",
    filter_pentacles: "Pentacles (14)",
    filter_cups: "Cups (14)",
    filter_swords: "Swords (14)",
    filter_wands: "Wands (14)",
    
    footer_credits: "Mystic Witch Tarot • Crafted with devotion to archetypal psychology and occult tradition.",
    card_upright: "Upright",
    card_reversed: "Reversed",
    witch_advice: "The Witch's Guidance",
    category_meaning: "Domain Reading",
    general_meaning: "General Archetype",
    keywords: "Core Keywords",
    empty_question: "General Life Guidance & Destiny"
  }
};

// =========================================================================
// 2. SPREAD POSITIONS SPECIFICATION
// =========================================================================
const SPREAD_DEFINITIONS = {
  1: [
    {
      th: "คำตอบและแก่นแท้ของสถานการณ์",
      en: "The Core Oracle & Situation Essence"
    }
  ],
  3: [
    {
      th: "1. อดีต / รากเหง้าของเรื่องราว",
      en: "1. Past / The Root of Matter"
    },
    {
      th: "2. ปัจจุบัน / สถานการณ์ที่เป็นอยู่",
      en: "2. Present / Current Dynamics"
    },
    {
      th: "3. อนาคต / แนวโน้มผลลัพธ์ที่จะเกิดขึ้น",
      en: "3. Future / Likely Manifestation"
    }
  ],
  4: [
    {
      th: "1. จุดเริ่มต้นและสาเหตุของปัญหา",
      en: "1. Origin & Root of Problem"
    },
    {
      th: "2. อุปสรรคและสิ่งที่ขัดขวางในปัจจุบัน",
      en: "2. Current Obstacle & Challenge"
    },
    {
      th: "3. ปัจจัยภายนอกหรือสิ่งที่คาดไม่ถึง",
      en: "3. Hidden or External Influences"
    },
    {
      th: "4. ทางออก บทสรุป และคำแนะนำแก้ไข",
      en: "4. Resolution & Actionable Solution"
    }
  ],
  5: [
    {
      th: "1. ตัวตนและพลังงานของคุณในตอนนี้",
      en: "1. Your Core State & Mindset"
    },
    {
      th: "2. สถานการณ์แวดล้อมที่ส่งผลกระทบ",
      en: "2. Surrounding Energies"
    },
    {
      th: "3. ความกลัว ความหวัง หรือสิ่งที่ซ่อนอยู่ในใจ",
      en: "3. Inner Hopes & Subconscious Fears"
    },
    {
      th: "4. อุปสรรคสำคัญ หรือปัจจัยชี้ขาด",
      en: "4. The Decisive Factor / Challenge"
    },
    {
      th: "5. บทสรุปปลายทางและคำแนะนำแห่งโชคชะตา",
      en: "5. Ultimate Outcome & Destiny"
    }
  ]
};

// =========================================================================
// 3. APPLICATION STATE
// =========================================================================
class TarotApp {
  constructor() {
    this.lang = localStorage.getItem("mystic_lang") || "th";
    this.category = "love";
    this.spreadCount = 3;
    this.userQuestion = "";
    
    this.deck = [];
    this.drawnCards = [];
    this.currentFilter = "all";

    this.initDOM();
    this.bindEvents();
    this.applyLanguage();
    this.renderGrimoire();
  }

  initDOM() {
    // Nav elements
    this.navBrand = document.getElementById("nav-brand");
    this.btnGrimoire = document.getElementById("btn-open-grimoire");
    this.btnToggleAudio = document.getElementById("btn-toggle-audio");
    this.btnToggleLang = document.getElementById("btn-toggle-lang");
    this.audioIcon = document.getElementById("audio-icon");
    this.audioLabel = document.getElementById("audio-label");
    this.langLabel = document.getElementById("lang-label");

    // Screens
    this.screens = {
      intention: document.getElementById("screen-intention"),
      drawing: document.getElementById("screen-drawing"),
      results: document.getElementById("screen-results"),
      grimoire: document.getElementById("screen-grimoire")
    };

    // Screen 1: Intention
    this.catChips = document.querySelectorAll(".cat-chip");
    this.spreadCards = document.querySelectorAll(".spread-card");
    this.questionInput = document.getElementById("user-question-input");
    this.btnBegin = document.getElementById("btn-begin-ritual");

    // Screen 2: Drawing
    this.drawingInstructions = document.getElementById("drawing-instructions");
    this.targetSlotsRack = document.getElementById("target-slots-rack");
    this.deckRibbonContainer = document.getElementById("deck-ribbon-container");
    this.btnWitchIntuition = document.getElementById("btn-witch-intuition");
    this.btnReShuffle = document.getElementById("btn-re-shuffle");

    // Screen 3: Results
    this.resultsQuestionRecap = document.getElementById("results-question-recap");
    this.revealedCardsContainer = document.getElementById("revealed-cards-container");
    this.grandSynthesisText = document.getElementById("grand-synthesis-text");
    this.interpretationsFeed = document.getElementById("interpretations-feed");
    this.btnAskAgain = document.getElementById("btn-ask-again");
    this.btnShareReading = document.getElementById("btn-share-reading");
    this.btnBrowseAll = document.getElementById("btn-browse-all-cards");

    // Direct Verdict Elements
    this.directVerdictBox = document.getElementById("direct-verdict-box");
    this.verdictBadge = document.getElementById("verdict-badge");
    this.verdictTitle = document.getElementById("verdict-title");
    this.verdictContent = document.getElementById("verdict-content");
    this.verdictActionsSummary = document.getElementById("verdict-actions-summary");

    // Gemini AI Assistant Elements
    this.geminiAiCard = document.getElementById("gemini-ai-card");
    this.geminiCustomQuestion = document.getElementById("gemini-custom-question");
    this.btnCopyAndOpenGemini = document.getElementById("btn-copy-and-open-gemini");
    this.btnCopyGemini = document.getElementById("btn-copy-gemini");
    this.btnOpenGemini = document.getElementById("btn-open-gemini");
    this.geminiPromptText = document.getElementById("gemini-prompt-text");

    // Screen 4: Grimoire
    this.grimoireSearchInput = document.getElementById("grimoire-search-input");
    this.filterTabBtns = document.querySelectorAll(".filter-tab-btn");
    this.grimoireCardsGrid = document.getElementById("grimoire-cards-grid");

    // Modal
    this.modal = document.getElementById("card-detail-modal");
    this.modalBody = document.getElementById("modal-card-body");
    this.modalCloseBtn = document.getElementById("btn-close-modal");

    // Toast
    this.toast = document.getElementById("mystic-toast");
  }

  bindEvents() {
    // Header navigation
    this.navBrand.addEventListener("click", (e) => {
      e.preventDefault();
      this.switchScreen("intention");
    });

    this.btnGrimoire.addEventListener("click", () => {
      window.mysticAudio.playClick();
      this.switchScreen("grimoire");
    });

    this.btnToggleAudio.addEventListener("click", () => {
      const isMuted = window.mysticAudio.toggleMute();
      this.updateAudioButton(isMuted);
    });

    this.btnToggleLang.addEventListener("click", () => {
      window.mysticAudio.playClick();
      this.toggleLanguage();
    });

    // Category Selector
    this.catChips.forEach(chip => {
      chip.addEventListener("click", () => {
        window.mysticAudio.playClick();
        this.catChips.forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        this.category = chip.dataset.cat;
      });
    });

    // Spread Selector
    this.spreadCards.forEach(card => {
      card.addEventListener("click", () => {
        window.mysticAudio.playClick();
        this.spreadCards.forEach(c => c.classList.remove("active"));
        card.classList.add("active");
        this.spreadCount = parseInt(card.dataset.spread, 10);
      });
    });

    // Begin Ritual Button
    this.btnBegin.addEventListener("click", () => {
      this.userQuestion = this.questionInput ? this.questionInput.value.trim() : "";
      window.mysticAudio.playCardShuffle();
      this.setupDrawingTable();
      this.switchScreen("drawing");
    });

    // Witch Intuition (Auto Draw)
    this.btnWitchIntuition.addEventListener("click", () => {
      this.autoDrawCards();
    });

    // Re-shuffle
    this.btnReShuffle.addEventListener("click", () => {
      window.mysticAudio.playCardShuffle();
      this.setupDrawingTable();
    });

    // Results Actions
    this.btnAskAgain.addEventListener("click", () => {
      window.mysticAudio.playClick();
      if (this.questionInput) this.questionInput.value = "";
      if (this.geminiCustomQuestion) this.geminiCustomQuestion.value = "";
      this.switchScreen("intention");
    });

    this.btnShareReading.addEventListener("click", () => {
      this.copyReadingToClipboard();
    });

    if (this.geminiCustomQuestion) {
      this.geminiCustomQuestion.addEventListener("input", () => {
        this.renderGeminiPrompt();
      });
    }

    if (this.btnCopyAndOpenGemini) {
      this.btnCopyAndOpenGemini.addEventListener("click", () => {
        this.copyAndOpenGemini();
      });
    }

    if (this.btnCopyGemini) {
      this.btnCopyGemini.addEventListener("click", () => {
        this.copyGeminiPrompt();
      });
    }

    this.btnBrowseAll.addEventListener("click", () => {
      window.mysticAudio.playClick();
      this.switchScreen("grimoire");
    });

    // Grimoire Filtering & Searching
    this.filterTabBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        window.mysticAudio.playClick();
        this.filterTabBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.currentFilter = btn.dataset.filter;
        this.filterGrimoire();
      });
    });

    this.grimoireSearchInput.addEventListener("input", () => {
      this.filterGrimoire();
    });

    // Modal Close
    this.modalCloseBtn.addEventListener("click", () => {
      this.closeModal();
    });

    this.modal.addEventListener("click", (e) => {
      if (e.target === this.modal) this.closeModal();
    });
  }

  // =========================================================================
  // 4. SCREEN SWITCHER & LANGUAGE
  // =========================================================================
  switchScreen(screenName) {
    Object.keys(this.screens).forEach(key => {
      this.screens[key].classList.remove("active");
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
    if (this.screens.results.classList.contains("active")) {
      this.renderResults();
    }
    this.renderGrimoire();
  }

  applyLanguage() {
    const dict = I18N[this.lang];
    this.langLabel.textContent = this.lang === "th" ? "TH / ภาษาไทย" : "EN / English";

    // Update all data-i18n elements
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (dict[key]) el.textContent = dict[key];
    });

    // Update placeholders
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (dict[key]) el.placeholder = dict[key];
    });

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
    this.toast.textContent = message;
    this.toast.classList.add("active");
    setTimeout(() => {
      this.toast.classList.remove("active");
    }, 2800);
  }

  // =========================================================================
  // 5. DRAWING STAGE LOGIC
  // =========================================================================
  setupDrawingTable() {
    this.drawnCards = [];
    const dict = I18N[this.lang];

    // Build Slots
    this.targetSlotsRack.innerHTML = "";
    const positions = SPREAD_DEFINITIONS[this.spreadCount];
    for (let i = 0; i < this.spreadCount; i++) {
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
      
      // Slight staggered rotation for authentic fan look
      const rot = ((index - 39) / 39) * 16;
      cardEl.style.transform = `rotate(${rot}deg)`;

      cardEl.innerHTML = `
        <div class="card-back-pattern"></div>
      `;

      cardEl.addEventListener("click", (e) => {
        this.handleCardClick(card, cardEl, e);
      });

      this.deckRibbonContainer.appendChild(cardEl);
    });

    this.updateDrawingProgress();
  }

  handleCardClick(card, cardEl, event) {
    if (this.drawnCards.length >= this.spreadCount) return;
    if (cardEl.classList.contains("selected")) return;

    // Mark drawn
    cardEl.classList.add("selected");
    window.mysticAudio.playCrystalBell(650 + (this.drawnCards.length * 90), 1.4);

    // Particle burst at card click
    if (window.mysticParticles && event) {
      window.mysticParticles.burst(event.clientX, event.clientY, 20);
    }

    // Determine upright or reversed (~25% reversed chance according to authentic tarot practice)
    const isReversed = Math.random() < 0.25;
    const slotIdx = this.drawnCards.length;

    this.drawnCards.push({
      card: card,
      isReversed: isReversed,
      positionIndex: slotIdx
    });

    // Update visual slot
    const slotEl = document.getElementById(`target-slot-${slotIdx}`);
    if (slotEl) {
      slotEl.classList.add("filled");
      slotEl.innerHTML = `
        <span class="slot-position-label">${SPREAD_DEFINITIONS[this.spreadCount][slotIdx][this.lang]}</span>
        <div class="card-back-pattern" style="width:100%; height:130px; border-radius:6px;"></div>
      `;
    }

    this.updateDrawingProgress();

    // If complete, trigger ritual climax
    if (this.drawnCards.length >= this.spreadCount) {
      setTimeout(() => {
        window.mysticAudio.playSuccessOracle();
        this.renderResults();
        this.switchScreen("results");
      }, 700);
    }
  }

  autoDrawCards() {
    const needed = this.spreadCount - this.drawnCards.length;
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
      }, i * 220);
    }
  }

  updateDrawingProgress() {
    const dict = I18N[this.lang];
    const text = dict.drawing_progress
      .replace("{current}", this.drawnCards.length)
      .replace("{total}", this.spreadCount);
    this.drawingInstructions.textContent = text;
  }

  // =========================================================================
  // 6. RESULTS & SYNTHESIS GENERATION
  // =========================================================================
  renderResults() {
    const dict = I18N[this.lang];
    const domainName = I18N[this.lang]["cat_" + this.category];
    const spreadName = I18N[this.lang][`spread_${this.spreadCount}_name`];
    this.resultsQuestionRecap.innerHTML = `<span>🔮 ${this.lang === "th" ? "หมวดหมู่พยากรณ์" : "Divination Domain"}: </span><strong>${domainName}</strong> <span style="margin: 0 0.6rem; opacity:0.5;">•</span> <span>${this.lang === "th" ? "รูปแบบการเปิดไพ่" : "Tarot Spread"}: </span><strong>${spreadName}</strong>`;

    // 1. Render Direct Verdict (Traditional synthesis based on cards and domain)
    this.renderDirectVerdict();

    // 2. Render 3D Cards Row
    this.revealedCardsContainer.innerHTML = "";
    const positions = SPREAD_DEFINITIONS[this.spreadCount];

    this.drawnCards.forEach((item, index) => {
      const card = item.card;
      const cardName = this.lang === "th" ? card.name_th : card.name_en;
      const orientTag = item.isReversed ? dict.card_reversed : dict.card_upright;
      const orientClass = item.isReversed ? "reversed" : "upright";
      const posLabel = positions[index][this.lang];
      const safeImg = encodeURI(card.image);

      const unit = document.createElement("div");
      unit.className = "revealed-card-cardunit";
      unit.innerHTML = `
        <span class="card-slot-badge">${posLabel}</span>
        <div class="card-3d-flipper ${item.isReversed ? 'reversed' : ''}" id="flipper-${index}">
          <div class="card-face card-front-face">
            <img src="${safeImg}" alt="${cardName}" loading="lazy" onerror="this.style.opacity='0.6'; console.warn('Image failed to load:', '${safeImg}');" />
          </div>
          <div class="card-face card-back-pattern"></div>
        </div>
        <div style="text-align:center;">
          <div style="font-weight:700; font-size:0.95rem; color:var(--gold-primary); margin-top:0.3rem;">${cardName}</div>
          <span class="card-orientation-tag ${orientClass}">[ ${orientTag} ]</span>
        </div>
      `;

      this.revealedCardsContainer.appendChild(unit);

      // Staggered 3D Flip after mounting
      setTimeout(() => {
        const flipper = document.getElementById(`flipper-${index}`);
        if (flipper) {
          flipper.classList.add("flipped");
          window.mysticAudio.playCardFlip();
        }
      }, index * 350 + 200);
    });

    // 3. Render Gemini Prompt for easy AI follow-up
    this.renderGeminiPrompt();

    // 2. Generate Grand Synthesis
    this.grandSynthesisText.innerHTML = this.generateWitchSynthesis();

    // 3. Render Detailed Interpretations Feed
    this.interpretationsFeed.innerHTML = "";
    this.drawnCards.forEach((item, index) => {
      const card = item.card;
      const aspect = item.isReversed ? card.reversed : card.upright;
      const cardName = this.lang === "th" ? card.name_th : card.name_en;
      const orientTag = item.isReversed ? dict.card_reversed : dict.card_upright;
      const orientClass = item.isReversed ? "reversed" : "upright";
      const posLabel = positions[index][this.lang];
      const quote = card.quote[this.lang];

      // Domain-specific interpretation
      let categoryContent = "";
      if (this.category === "love") categoryContent = aspect.love[this.lang];
      else if (this.category === "career") categoryContent = aspect.career[this.lang];
      else if (this.category === "finance") categoryContent = aspect.finance[this.lang];
      else if (this.category === "health") categoryContent = aspect.health[this.lang];
      else categoryContent = aspect.general[this.lang];

      const connectionText = this.generateCardQuestionConnection(item, index);

      const cardCard = document.createElement("div");
      cardCard.className = "interpretation-card";
      cardCard.innerHTML = `
        <div class="interp-header">
          <div class="interp-title-group">
            <span class="card-slot-badge" style="margin-bottom:0.4rem; display:inline-block;">${posLabel}</span>
            <h4>${cardName}</h4>
            <p>${card.element[this.lang]}</p>
          </div>
          <span class="card-orientation-tag ${orientClass}">[ ${orientTag} ]</span>
        </div>

        <div class="interp-quote-box">
          "${quote}"
        </div>

        <!-- Connection to User's Specific Question -->
        <div class="interp-question-connection-box">
          <div class="connection-box-title">
            <span>🔮</span>
            <span>${dict.card_question_connection}</span>
          </div>
          <p class="connection-box-text">${connectionText}</p>
        </div>

        <div class="interp-keywords-cloud">
          ${aspect.keywords[this.lang].map(kw => `<span class="kw-badge"># ${kw}</span>`).join("")}
        </div>

        <div style="margin-bottom: 1rem;">
          <h5 style="color:var(--gold-primary); font-size:1.05rem; margin-bottom:0.4rem;">
            ✦ ${dict.category_meaning} (${I18N[this.lang]["cat_" + this.category]}):
          </h5>
          <p class="interp-body-text">${categoryContent}</p>
        </div>

        <div style="margin-bottom: 1.2rem;">
          <h5 style="color:var(--text-muted); font-size:0.95rem; margin-bottom:0.3rem;">
            ✦ ${dict.general_meaning}:
          </h5>
          <p class="interp-body-text" style="color:var(--text-dim); font-size:0.92rem;">
            ${aspect.general[this.lang]}
          </p>
        </div>

        <div class="witch-advice-box">
          <div class="witch-icon-small">🔮</div>
          <div>
            <h5>${dict.witch_advice}</h5>
            <p>${aspect.advice[this.lang]}</p>
          </div>
        </div>
      `;

      this.interpretationsFeed.appendChild(cardCard);
    });
  }

  generateWitchSynthesis() {
    const cardNames = this.drawnCards.map(item => {
      const name = this.lang === "th" ? item.card.name_th : item.card.name_en;
      const orient = item.isReversed 
        ? (this.lang === "th" ? "(กลับหัว)" : "(Reversed)") 
        : (this.lang === "th" ? "(ตรง)" : "(Upright)");
      return `${name} ${orient}`;
    });

    const hasReversed = this.drawnCards.some(c => c.isReversed);
    const majorCount = this.drawnCards.filter(c => c.card.suite === "major").length;

    if (this.lang === "th") {
      let impactText = majorCount >= 2 
        ? "พลังงานหลักมาจากไพ่ชุดใหญ่ (Major Arcana) ชี้ชัดว่าเหตุการณ์นี้คือจุดเปลี่ยนสำคัญของชะตากรรมที่ไม่อาจหลีกเลี่ยงได้"
        : "พลังงานในสำรับสะท้อนถึงการกระทำและอารมณ์ในชีวิตประจำวันที่คุณสามารถควบคุมและปรับเปลี่ยนได้ด้วยสติปัญญา";

      let tensionText = hasReversed 
        ? "ไพ่ปรากฏสภาวะกลับหัวเตือนให้ระวังความเร่งรีบ ทัศนคติ หรือความขัดแย้งในจิตใจที่ยังตกค้าง"
        : "กระแสพลังงานไหลเวียนอย่างราบรื่น ทัศนคติที่ดีและความมุ่งมั่นจะนำพาสิ่งที่ปรารถนามาสู่มือคุณ";

      return `จากคำถามที่ท่านได้ตั้งจิตอธิษฐาน ไพ่ทาโรต์ทั้ง ${this.drawnCards.length} ใบ ได้แก่ <strong>${cardNames.join(", ")}</strong> ได้ร่วมประสานเสียงกันบอกว่า: ${impactText} ในมิติของ${I18N.th["cat_" + this.category]} ${tensionText} จงใช้คำแนะนำของไพ่เป็นประทีปส่องทาง แต่จงจำไว้เสมอว่า <em>'ชะตากรรมเป็นเพียงเข็มทิศ เจตจำนงของท่านคือผู้กุมหางเสือ'</em>`;
    } else {
      let impactText = majorCount >= 2
        ? "With multiple Major Arcana dominating the spread, this matter represents a pivotal karmic milestone in your soul's journey."
        : "The minor arcana forces indicate everyday decisions, practical actions, and emotional habits that remain fully within your agency to reshape.";

      let tensionText = hasReversed
        ? "The presence of reversed cards whispers a gentle warning regarding subconscious resistance, impatience, or unresolved emotional tension."
        : "The energies flow in pristine alignment. Your clarity, integrity, and focused intent will swiftly manifest your desired fruition.";

      return `Regarding your sacred inquiry, the Arcana drawn — <strong>${cardNames.join(", ")}</strong> — declare that: ${impactText} Within the realm of ${I18N.en["cat_" + this.category]}, ${tensionText} Let the wisdom of these archetypes illuminate your path, while remembering: <em>'The stars may incline, but your sovereign will decides.'</em>`;
    }
  }

  copyReadingToClipboard() {
    const dict = I18N[this.lang];
    const questionText = this.userQuestion || dict.empty_question;
    const cardsSummary = this.drawnCards.map((item, idx) => {
      const pos = SPREAD_DEFINITIONS[this.spreadCount][idx][this.lang];
      const name = this.lang === "th" ? item.card.name_th : item.card.name_en;
      const orient = item.isReversed ? dict.card_reversed : dict.card_upright;
      return `• ${pos}: ${name} [${orient}]`;
    }).join("\n");

    const textToCopy = `🔮 MYSTIC WITCH TAROT READING 🔮\n\n` +
      `✦ Question: ${questionText}\n` +
      `✦ Domain: ${I18N[this.lang]["cat_" + this.category]}\n\n` +
      `✦ Direct Verdict:\n${this.verdictContent ? this.verdictContent.innerText : ""}\n\n` +
      `✦ Cards Drawn:\n${cardsSummary}\n\n` +
      `✦ Witch's Synthesis:\n${this.grandSynthesisText.innerText}\n\n` +
      `Mystic Witch Tarot Sanctuary`;

    navigator.clipboard.writeText(textToCopy).then(() => {
      this.showToast(dict.toast_copied);
      window.mysticAudio.playCrystalBell(880, 1.2);
    }).catch(err => {
      console.error("Clipboard copy failed:", err);
    });
  }

  // =========================================================================
  // DIRECT VERDICT ENGINE (QUESTION-ALIGNED & CLEAR ANSWERS)
  // =========================================================================
  renderDirectVerdict() {
    if (!this.directVerdictBox) return;
    const dict = I18N[this.lang];
    const question = (this.userQuestion || "").trim();

    // 1. Calculate spread polarity score
    let score = 0;
    const positiveIds = [
      "m_01", "m_03", "m_04", "m_06", "m_07", "m_08", "m_10", "m_11", "m_14", "m_17", "m_19", "m_21"
    ];
    const challengingIds = [
      "m_12", "m_13", "m_15", "m_16", "m_18"
    ];

    this.drawnCards.forEach((item, idx) => {
      const isOutcome = idx === this.drawnCards.length - 1;
      const weight = isOutcome ? 2 : 1;
      const card = item.card;

      if (card.suite === "major") {
        if (positiveIds.includes(card.id)) {
          score += (item.isReversed ? 0 : 2) * weight;
        } else if (challengingIds.includes(card.id)) {
          score -= (item.isReversed ? 1 : 2.5) * weight;
        } else {
          score += (item.isReversed ? -1 : 1) * weight;
        }
      } else {
        const num = card.number;
        if (card.suite === "swords") {
          if ([3, 5, 7, 8, 9, 10].includes(num)) {
            score -= (item.isReversed ? 1 : 2) * weight;
          } else if ([1, 6].includes(num)) {
            score += (item.isReversed ? 0 : 1) * weight;
          }
        } else if (card.suite === "cups") {
          if ([1, 2, 3, 9, 10].includes(num)) {
            score += (item.isReversed ? 0.5 : 2) * weight;
          } else if ([5, 8].includes(num)) {
            score -= (item.isReversed ? 0.5 : 1.5) * weight;
          } else {
            score += (item.isReversed ? 0 : 1) * weight;
          }
        } else if (card.suite === "pentacles") {
          if ([1, 3, 9, 10].includes(num)) {
            score += (item.isReversed ? 0.5 : 2) * weight;
          } else if ([5].includes(num)) {
            score -= (item.isReversed ? 1 : 2) * weight;
          } else {
            score += (item.isReversed ? 0 : 1) * weight;
          }
        } else if (card.suite === "wands") {
          if ([1, 3, 4, 6].includes(num)) {
            score += (item.isReversed ? 0.5 : 2) * weight;
          } else if ([10].includes(num)) {
            score -= (item.isReversed ? 0.5 : 1.5) * weight;
          } else {
            score += (item.isReversed ? 0 : 1) * weight;
          }
        }
      }
    });

    let verdictType = "neutral";
    if (score >= 2) verdictType = "favorable";
    else if (score <= -2) verdictType = "challenging";

    // Update Badge
    this.verdictBadge.className = `verdict-badge ${verdictType}`;
    if (verdictType === "favorable") {
      this.verdictBadge.textContent = dict.verdict_badge_favorable;
    } else if (verdictType === "challenging") {
      this.verdictBadge.textContent = dict.verdict_badge_challenging;
    } else {
      this.verdictBadge.textContent = dict.verdict_badge_neutral;
    }

    this.verdictTitle.textContent = dict.verdict_box_title;

    // 2. Synthesize direct verdict text matching intent
    const verdictData = this.generateDirectVerdictText(verdictType, question);
    this.verdictContent.innerHTML = verdictData.body;

    // 3. Render Do & Don't action boxes
    this.verdictActionsSummary.innerHTML = `
      <div class="do-box">
        <strong>✦ ${dict.verdict_do}</strong>
        ${verdictData.doAction}
      </div>
      <div class="dont-box">
        <strong>✦ ${dict.verdict_dont}</strong>
        ${verdictData.dontAction}
      </div>
    `;
  }

  generateDirectVerdictText(verdictType, question) {
    const primaryCard = this.drawnCards[this.drawnCards.length - 1] || this.drawnCards[0];
    const primaryName = this.lang === "th" ? primaryCard.card.name_th : primaryCard.card.name_en;
    const primaryAspect = primaryCard.isReversed ? primaryCard.card.reversed : primaryCard.card.upright;
    const primaryKw = primaryAspect.keywords[this.lang].slice(0, 2).join(", ");
    const domainName = I18N[this.lang]["cat_" + this.category];

    if (this.lang === "th") {
      let body = "";
      let doAction = "";
      let dontAction = "";

      if (this.category === "love") {
        if (verdictType === "favorable") {
          body = `บทสรุปดวงชะตาความรักตามตำรา: <strong style="color:#86efac;">กระแสพลังงานความรักสดใส มีเกณฑ์สมหวังและพบความสุขทางใจสูงมาก!</strong> ไพ่สะท้อนถึงความรู้สึกที่บริสุทธิ์ มีการเปิดใจและมองเห็นคุณค่าซึ่งกันและกันอย่างแท้จริง หากมีเรื่องค้างคาใจหรือความห่างเหิน พลังงานแห่งความเข้าอกเข้าใจจะเข้ามาช่วยประสานรอยร้าว โดยมีไพ่หลักอย่าง <strong>${primaryName}</strong> (${primaryKw}) ชี้ชัดว่าความสัมพันธ์มีเกณฑ์พัฒนาไปสู่ความมั่นคงและชัดเจน`;
          doAction = "เปิดใจสื่อสารอย่างตรงไปตรงมา แสดงความจริงใจสม่ำเสมอ และให้เกียรติความรู้สึกของกันและกัน";
          dontAction = "อย่าคิดมากหรือสร้างความระแวงไปเอง และหลีกเลี่ยงการประชดประชันหรือเล่นเกมความรู้สึก";
        } else if (verdictType === "challenging") {
          body = `บทสรุปดวงชะตาความรักตามตำรา: <strong style="color:#fca5a5;">มีจุดที่ต้องใช้ความระมัดระวัง มีความลังเลหรือความไม่เข้าใจกันอยู่</strong> พลังงานของไพ่สะท้อนถึงความอึดอัด ความไม่ชัดเจน หรือมีเรื่องส่วนตัวที่ต้องจัดการ ยังไม่ใช่จังหวะที่ควรเร่งรัดเอาคำตอบ ไพ่ <strong>${primaryName}</strong> (${primaryKw}) แนะนำให้เว้นระยะห่างที่พอเหมาะและมีสติเพื่อประคองสถานการณ์`;
          doAction = "ให้เวลาและพื้นที่ส่วนตัว รับฟังให้มากกว่าพูด และหันกลับมารักและเห็นคุณค่าในตัวเอง";
          dontAction = "อย่าเซ้าซี้ กดดัน หรือใช้อารมณ์ตัดสินปัญหา เพราะจะยิ่งทำให้กำแพงในใจของอีกฝ่ายสูงขึ้น";
        } else {
          body = `บทสรุปดวงชะตาความรักตามตำรา: <strong style="color:#fef08a;">ความสัมพันธ์อยู่ในช่วงทรงตัวและรอดูทิศทาง</strong> พลังงานของไพ่ยังไม่เอนเอียงไปด้านใดด้านหนึ่งอย่างชัดเจน มีทั้งโอกาสและความลังเล ไพ่ <strong>${primaryName}</strong> (${primaryKw}) ชี้ว่าผลลัพธ์ในอนาคตจะขึ้นอยู่กับทัศนคติและการวางตัวของคุณเป็นสำคัญ`;
          doAction = "สร้างบรรยากาศที่สบายใจ เป็นมิตร และพิจารณาการกระทำมากกว่าเพียงคำพูด";
          dontAction = "อย่าด่วนสรุปหรือตัดสินใจด้วยความใจร้อนในขณะที่อารมณ์ยังไม่มั่นคง";
        }
      } else if (this.category === "career") {
        if (verdictType === "favorable") {
          body = `บทสรุปดวงชะตาการงานตามตำรา: <strong style="color:#86efac;">ทิศทางเปิดกว้าง มีเกณฑ์สำเร็จและได้รับข่าวดีสูงมาก!</strong> ผลงาน ความรู้ความสามารถที่คุณสั่งสมมาจะได้รับการยอมรับ มีโอกาสได้เลื่อนตำแหน่ง ได้งานใหม่ หรือโครงการที่วางแผนไว้จะลุล่วงอย่างงดงาม โดยมีไพ่หลัก <strong>${primaryName}</strong> (${primaryKw}) สนับสนุนให้ก้าวไปข้างหน้าอย่างมั่นใจ`;
          doAction = "เตรียมข้อมูลและทักษะให้พร้อม แสดงความเป็นมืออาชีพ และคว้าโอกาสที่เข้ามา";
          dontAction = "อย่าละเลยรายละเอียดในสัญญาหรือข้อตกลง และอย่าลังเลจนพลาดจังหวะสำคัญ";
        } else if (verdictType === "challenging") {
          body = `บทสรุปดวงชะตาการงานตามตำรา: <strong style="color:#fca5a5;">เส้นทางการงานยังมีอุปสรรค ความล่าช้า หรือแรงกดดันสูง</strong> อาจมีปัจจัยการแข่งขัน ความขัดแย้งในที่ทำงาน หรือข้อตกลงที่ยังไม่ลงตัว ไพ่ <strong>${primaryName}</strong> (${primaryKw}) แนะนำให้รอบคอบเป็นพิเศษ ตรวจทานเอกสาร และชะลอการตัดสินใจที่เสี่ยงสูงไว้ก่อน`;
          doAction = "พัฒนาทักษะเฉพาะทาง ทำงานอย่างรัดกุมรอบคอบ และสร้างพันธมิตรที่ไว้ใจได้";
          dontAction = "อย่าวู่วามลาออกจากงานโดยยังไม่มีที่รองรับ และหลีกเลี่ยงการปะทะอารมณ์ในที่ทำงาน";
        } else {
          body = `บทสรุปดวงชะตาการงานตามตำรา: <strong style="color:#fef08a;">ทิศทางการงานอยู่ในระดับปานกลาง ผลลัพธ์ขึ้นอยู่กับความเพียรพยายาม</strong> ไพ่ <strong>${primaryName}</strong> (${primaryKw}) ชี้ว่าโอกาสไม่ได้ปิดตาย แต่อาจต้องใช้เวลาและการวางแผนอย่างเป็นขั้นตอนเพื่อฝ่าฟันอุปสรรค`;
          doAction = "วางแผนงานเป็นลำดับขั้นตอน ขอคำปรึกษาจากผู้มีประสบการณ์ และลงมือทำอย่างสม่ำเสมอ";
          dontAction = "อย่ารอคอยโชคช่วยโดยไม่ลงมือทำ หรือปล่อยให้ความลังเลทำให้เสียเวลา";
        }
      } else if (this.category === "finance") {
        if (verdictType === "favorable") {
          body = `บทสรุปดวงชะตาการเงินตามตำรา: <strong style="color:#86efac;">สภาพคล่องทางการเงินกำลังฟื้นตัว มีเกณฑ์ได้รับผลตอบแทนหรือโชคลาภที่น่าพอใจ!</strong> การเจรจาทางการเงิน การค้าขาย หรือการลงทุนที่ศึกษามาอย่างดีมีแนวโน้มผลิดอกออกผล ไพ่ <strong>${primaryName}</strong> (${primaryKw}) บ่งชี้ถึงความมั่นคงทางการเงินที่ดีขึ้น`;
          doAction = "จัดสรรเงินออมสำรอง ต่อยอดการลงทุนอย่างมีสติ และวางแผนภาษีหรือหนี้สินให้เป็นระบบ";
          dontAction = "อย่าใช้จ่ายสุรุ่ยสุร่ายตามอารมณ์ชั่ววูบเพียงเพราะเห็นว่ามีเงินเข้ามาคล่องมือ";
        } else if (verdictType === "challenging") {
          body = `บทสรุปดวงชะตาการเงินตามตำรา: <strong style="color:#fca5a5;">การเงินมีเกณฑ์สะดุด รั่วไหล หรือมีรายจ่ายกะทันหัน</strong> ยังไม่ใช่จังหวะที่ดีสำหรับการเสี่ยงโชค กู้ยืม หรือลงทุนก้อนใหญ่ ไพ่ <strong>${primaryName}</strong> (${primaryKw}) เตือนให้ระวังการเสียเปรียบหรือข้อสัญญาทางการเงินที่ไม่เป็นธรรม`;
          doAction = "รัดเข็มขัด ควบคุมบัญชีรายรับ-รายจ่ายอย่างเข้มงวด และสำรองเงินสดไว้รองรับฉุกเฉิน";
          dontAction = "ห้ามเซ็นค้ำประกันให้ใครเด็ดขาด และอย่าหลงเชื่อข้อเสนอที่ให้ผลตอบแทนสูงเกินจริง";
        } else {
          body = `บทสรุปดวงชะตาการเงินตามตำรา: <strong style="color:#fef08a;">การเงินยังทรงตัว พอหมุนเวียนได้แต่ต้องระมัดระวัง</strong> รายรับกับรายจ่ายยังสูสีกัน ไพ่ <strong>${primaryName}</strong> (${primaryKw}) แนะนำให้รักษาวินัยการเงินและหลีกเลี่ยงการก่อหนี้ก้อนใหม่`;
          doAction = "วางแผนค่าใช้จ่ายล่วงหน้า และเน้นการสร้างรายได้เสริมจากทักษะที่มี";
          dontAction = "อย่าก่อหนี้ใหม่มาหมุนหนี้เก่า และชะลอการซื้อของฟุ่มเฟือยไว้ก่อน";
        }
      } else if (this.category === "health") {
        if (verdictType === "favorable") {
          body = `บทสรุปดวงชะตาสุขภาพตามตำรา: <strong style="color:#86efac;">ร่างกายและจิตใจมีพลังฟื้นตัวที่ดี มีความสดชื่นและมีพลังชีวิต!</strong> หากกำลังพักฟื้นจากการเจ็บป่วย ทิศทางจะดีขึ้นตามลำดับ ไพ่ <strong>${primaryName}</strong> (${primaryKw}) สะท้อนถึงพลังงานบวกที่สมดุล`;
          doAction = "ออกกำลังกายสม่ำเสมอ รับประทานอาหารที่มีประโยชน์ และรักษาสุขอนามัยที่ดี";
          dontAction = "อย่าโหมงานหนักจนลืมดูแลร่างกาย หรือละเลยสัญญาณเตือนเล็กๆ น้อยๆ ของสุขภาพ";
        } else if (verdictType === "challenging") {
          body = `บทสรุปดวงชะตาสุขภาพตามตำรา: <strong style="color:#fca5a5;">ควรระวังความเครียดสะสม การพักผ่อนไม่เพียงพอ หรืออาการเจ็บป่วยเก่ากำเริบ</strong> ไพ่ <strong>${primaryName}</strong> (${primaryKw}) เตือนให้ตรวจเช็กร่างกาย และระวังอุบัติเหตุจากการเร่งรีบ`;
          doAction = "พักผ่อนให้เพียงพอ หาเวลาผ่อนคลายจิตใจ และไปพบแพทย์หากมีอาการผิดปกติ";
          dontAction = "อย่าประมาทในการขับขี่หรือทำกิจกรรมโลดโผน และหลีกเลี่ยงพฤติกรรมเสี่ยงทำร้ายสุขภาพ";
        } else {
          body = `บทสรุปดวงชะตาสุขภาพตามตำรา: <strong style="color:#fef08a;">สุขภาพอยู่ในเกณฑ์ปานกลาง ร่างกายตอบสนองตามการดูแล</strong> ไพ่ <strong>${primaryName}</strong> (${primaryKw}) แนะนำให้ปรับสมดุลระหว่างการทำงานและการพักผ่อน`;
          doAction = "ปรับเปลี่ยนเวลานอนให้เป็นเวลา ดื่มน้ำให้เพียงพอ และทำกิจกรรมที่ช่วยลดความตึงเครียด";
          dontAction = "อย่าปล่อยให้ความเครียดสะสมโดยไม่มีทางระบาย";
        }
      } else {
        // General
        if (verdictType === "favorable") {
          body = `บทสรุปดวงชะตาภาพรวมตามตำรา: <strong style="color:#86efac;">ทิศทางชีวิตเป็นบวกอย่างยิ่ง มีโอกาสประสบความสำเร็จตามที่ตั้งใจ!</strong> พลังงานแห่งโชคชะตากำลังส่งเสริมให้เรื่องราวต่างๆ เดินหน้าได้อย่างราบรื่น ไพ่ <strong>${primaryName}</strong> (${primaryKw}) บ่งบอกว่าความมุ่งมั่นของคุณจะนำพาไปสู่ผลลัพธ์ที่คุ้มค่า`;
          doAction = "ตัดสินใจด้วยความเชื่อมั่น ลงมือทำอย่างต่อเนื่อง และเปิดรับโอกาสใหม่ๆ";
          dontAction = "อย่าปล่อยให้ความกลัวหรือเสียงวิจารณ์รอบข้างทำให้คุณสูญเสียความมั่นใจ";
        } else if (verdictType === "challenging") {
          body = `บทสรุปดวงชะตาภาพรวมตามตำรา: <strong style="color:#fca5a5;">ไพ่เตือนว่ามีจุดสะดุดหรืออุปสรรคที่ต้องระวังอย่างยิ่ง</strong> สถานการณ์อาจยังไม่ถึงจังหวะเวลาที่พร้อม หรือมีปัจจัยที่คุณยังมองไม่เห็นซ่อนอยู่ ไพ่ <strong>${primaryName}</strong> (${primaryKw}) แนะนำให้หยุดประเมินสถานการณ์ ชะลอการตัดสินใจเรื่องสำคัญไว้ก่อน`;
          doAction = "ตั้งสติ ตรวจสอบข้อเท็จจริงรอบด้าน และปรึกษาผู้ใหญ่หรือคนที่ไว้ใจได้";
          dontAction = "อย่าดันทุรังผลักดันในสิ่งที่ยังติดขัด เพราะอาจเกิดความเสียหายตามมา";
        } else {
          body = `บทสรุปดวงชะตาภาพรวมตามตำรา: <strong style="color:#fef08a;">พลังงานโดยรวมอยู่ในระดับปานกลาง ขึ้นอยู่กับการตัดสินใจของคุณ</strong> สถานการณ์สามารถปรับเปลี่ยนได้ตามทัศนคติและการกระทำของคุณ ไพ่ <strong>${primaryName}</strong> (${primaryKw}) ย้ำเตือนว่าชะตากรรมอยู่ในมือของคุณ`;
          doAction = "ชั่งน้ำหนักข้อดีข้อเสียอย่างมีเหตุผล และเลือกเส้นทางที่สอดคล้องกับคุณค่าในใจ";
          dontAction = "อย่าปล่อยให้ผู้อื่นมาตัดสินใจแทนคุณในเรื่องสำคัญของชีวิต";
        }
      }

      return { body, doAction, dontAction };
    } else {
      let body = "";
      let doAction = "";
      let dontAction = "";

      if (verdictType === "favorable") {
        body = `Traditional Tarot Synthesis in ${domainName}: <strong style="color:#86efac;">Highly favorable energy with strong momentum towards fruition!</strong> Led by <strong>${primaryName}</strong> (${primaryKw}), the cards forecast auspicious breakthroughs, clarity, and genuine progress.`;
        doAction = "Act decisively with confidence, maintain open communication, and seize momentum.";
        dontAction = "Avoid self-doubt or procrastination; do not overthink genuine opportunities.";
      } else if (verdictType === "challenging") {
        body = `Traditional Tarot Synthesis in ${domainName}: <strong style="color:#fca5a5;">Caution is advised — unexpected friction or delays are present.</strong> Led by <strong>${primaryName}</strong> (${primaryKw}), take time to resolve underlying issues before committing to major decisions.`;
        doAction = "Step back, re-evaluate facts objectively, and protect your inner peace and resources.";
        dontAction = "Do not force quick conclusions, avoid emotional escalation, and do not take high-stakes risks.";
      } else {
        body = `Traditional Tarot Synthesis in ${domainName}: <strong style="color:#fef08a;">Neutral & Balanced — The outcome hinges on your conscious agency.</strong> Guided by <strong>${primaryName}</strong> (${primaryKw}), steady steps and patience will steer this toward harmony.`;
        doAction = "Clarify your core values, plan in steady steps, and stay patient.";
        dontAction = "Avoid passive waiting or letting external voices dictate your direction.";
      }

      return { body, doAction, dontAction };
    }
  }

  // =========================================================================
  // GEMINI AI PROMPT GENERATOR & CLIPBOARD INTEGRATION
  // =========================================================================
  renderGeminiPrompt() {
    if (!this.geminiPromptText) return;
    const dict = I18N[this.lang];
    const customQuestion = this.geminiCustomQuestion ? this.geminiCustomQuestion.value.trim() : "";
    const domain = I18N[this.lang]["cat_" + this.category];
    const spreadName = I18N[this.lang][`spread_${this.spreadCount}_name`];
    const positions = SPREAD_DEFINITIONS[this.spreadCount];

    let prompt = "";
    if (this.lang === "th") {
      const cardsList = this.drawnCards.map((item, idx) => {
        const card = item.card;
        const pos = positions[idx].th;
        const orient = item.isReversed ? "กลับหัว (Reversed)" : "ตั้งตรง (Upright)";
        const aspect = item.isReversed ? card.reversed : card.upright;
        const kw = aspect.keywords.th.join(", ");
        let domainMeaning = "";
        if (this.category === "love") domainMeaning = aspect.love.th;
        else if (this.category === "career") domainMeaning = aspect.career.th;
        else if (this.category === "finance") domainMeaning = aspect.finance.th;
        else if (this.category === "health") domainMeaning = aspect.health.th;
        else domainMeaning = aspect.general.th;

        return `[ตำแหน่งที่ ${idx + 1}] ${pos}
- ไพ่: ${card.name_th} (${card.name_en}) [${orient}]
- ธาตุ/ดวงดาว: ${card.element.th}
- คีย์เวิร์ดสำคัญ: ${kw}
- คำทำนายตามตำรา (${domain}): ${domainMeaning}
- คำแนะนำจากไพ่: ${aspect.advice.th}`;
      }).join("\n\n");

      const questionSection = customQuestion 
        ? `🔮 คำถามเฉพาะเจาะจงที่ฉันต้องการปรึกษา: "${customQuestion}"`
        : `🔮 คำถามของฉัน: "ช่วยวิเคราะห์เจาะลึกภาพรวมดวงชะตาและให้คำแนะนำในหมวด ${domain} จากไพ่ชุดนี้"`;

      prompt = `สวัสดี Gemini ฉันเพิ่งเปิดไพ่ทาโรต์ดูดวงหมวด: ${domain} ตามตำราไพ่ทาโรต์ Rider-Waite

${questionSection}
🏷️ หมวดหมู่เรื่อง: ${domain}
🎴 รูปแบบการเปิดไพ่: ${spreadName} (${this.spreadCount} ใบ)

🃏 รายละเอียดไพ่ตามตำราที่เปิดได้ทั้งหมด:
${cardsList}

--------------------------------------------------
💡 คำสั่งสำหรับ Gemini:
ช่วยสวมบทบาทเป็น "ผู้เชี่ยวชาญการพยากรณ์ไพ่ทาโรต์และที่ปรึกษาชีวิต (Empathetic Tarot Master)" ช่วยวิเคราะห์และตอบคำถามของฉันข้างต้น โดยอิงจากความหมาย พลังงาน และสัญลักษณ์ของไพ่ทาโรต์แต่ละใบตามตำราที่เปิดได้จริง:
1. ฟันธงคำตอบสำหรับคำถามของฉันอย่างตรงไปตรงมา ชัดเจน เข้าใจง่าย ไม่อ้อมค้อม
2. อธิบายว่าไพ่แต่ละใบที่เปิดได้ตามตำแหน่ง สะท้อนและเชื่อมโยงกับคำถาม/สถานการณ์ของฉันอย่างไร
3. แนะนำสิ่งที่ควรทำ (Do's) และสิ่งที่ไม่ควรทำ / ข้อควรระวัง (Don'ts) อย่างเป็นรูปธรรม
4. แนวโน้มและช่วงเวลาของเหตุการณ์ในระยะอันใกล้นี้
5. ข้อคิดเตือนใจและคำแนะนำเสริมกำลังใจในแบบที่อบอุ่นและมีพลังบวก`;
    } else {
      const cardsList = this.drawnCards.map((item, idx) => {
        const card = item.card;
        const pos = positions[idx].en;
        const orient = item.isReversed ? "Reversed" : "Upright";
        const aspect = item.isReversed ? card.reversed : card.upright;
        const kw = aspect.keywords.en.join(", ");
        let domainMeaning = "";
        if (this.category === "love") domainMeaning = aspect.love.en;
        else if (this.category === "career") domainMeaning = aspect.career.en;
        else if (this.category === "finance") domainMeaning = aspect.finance.en;
        else if (this.category === "health") domainMeaning = aspect.health.en;
        else domainMeaning = aspect.general.en;

        return `[Position ${idx + 1}] ${pos}
- Card: ${card.name_en} [${orient}]
- Element / Planetary: ${card.element.en}
- Core Keywords: ${kw}
- Traditional Meaning (${domain}): ${domainMeaning}
- Card Advice: ${aspect.advice.en}`;
      }).join("\n\n");

      const questionSection = customQuestion 
        ? `🔮 Specific Question I wish to consult: "${customQuestion}"`
        : `🔮 Inquiry: "Please analyze the in-depth dynamics and life guidance in ${domain} based on these cards."`;

      prompt = `Hello Gemini, I have just drawn a tarot spread in the domain of ${domain} based on traditional Rider-Waite tarot lore.

${questionSection}
🏷️ Life Domain: ${domain}
🎴 Tarot Spread: ${spreadName} (${this.spreadCount} Cards)

🃏 Cards Drawn in This Session:
${cardsList}

--------------------------------------------------
💡 Instructions for Gemini:
Please act as an "Empathetic Master Tarot Reader and Life Advisor", analyzing this spread and directly answering my question based on the actual cards and their traditional symbolism:
1. Provide a direct, unequivocal answer addressing my specific inquiry with clarity.
2. Explain how each card in its spread position connects to my situation and question.
3. Recommend concrete, actionable Do's and Donts to navigate this energy.
4. Offer insights into near-term timeline and manifestation likelihood.
5. Conclude with an uplifting, empowering message to inspire my journey.`;
    }

    this.geminiPromptText.textContent = prompt;
  }

  copyGeminiPrompt() {
    const dict = I18N[this.lang];
    const textToCopy = this.geminiPromptText ? this.geminiPromptText.textContent : "";
    if (!textToCopy) return;

    navigator.clipboard.writeText(textToCopy).then(() => {
      this.showToast(dict.toast_gemini_copied);
      window.mysticAudio.playCrystalBell(920, 1.3);
    }).catch(err => {
      console.error("Failed to copy Gemini prompt:", err);
      const textarea = document.createElement("textarea");
      textarea.value = textToCopy;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      this.showToast(dict.toast_gemini_copied);
    });
  }

  copyAndOpenGemini() {
    const dict = I18N[this.lang];
    const textToCopy = this.geminiPromptText ? this.geminiPromptText.textContent : "";
    if (!textToCopy) return;

    const launchGemini = () => {
      this.showToast(dict.toast_gemini_copied_and_opened);
      window.mysticAudio.playCrystalBell(980, 1.4);
      // Immediately open Gemini in a new tab so user only needs to paste!
      window.open("https://gemini.google.com/app", "_blank", "noopener,noreferrer");
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        launchGemini();
      }).catch(err => {
        console.warn("Clipboard API write failed, using textarea fallback:", err);
        const textarea = document.createElement("textarea");
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        launchGemini();
      });
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = textToCopy;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      launchGemini();
    }
  }

  generateCardQuestionConnection(item, index) {
    const card = item.card;
    const isReversed = item.isReversed;
    const aspect = isReversed ? card.reversed : card.upright;
    const cardName = this.lang === "th" ? card.name_th : card.name_en;
    const orientText = isReversed 
      ? (this.lang === "th" ? "กลับหัว (Reversed)" : "Reversed") 
      : (this.lang === "th" ? "ตั้งตรง (Upright)" : "Upright");
    const kw = aspect.keywords[this.lang].slice(0, 3).join(", ");
    const pos = SPREAD_DEFINITIONS[this.spreadCount][index][this.lang];
    const domainName = I18N[this.lang]["cat_" + this.category];

    let categoryText = "";
    if (this.category === "love") categoryText = aspect.love[this.lang];
    else if (this.category === "career") categoryText = aspect.career[this.lang];
    else if (this.category === "finance") categoryText = aspect.finance[this.lang];
    else if (this.category === "health") categoryText = aspect.health[this.lang];
    else categoryText = aspect.general[this.lang];

    if (this.lang === "th") {
      let roleDesc = "";
      if (this.spreadCount === 1) {
        roleDesc = `ในฐานะไพ่ชี้ขาดของดวงชะตาเรื่องนี้`;
      } else if (this.spreadCount === 3) {
        if (index === 0) roleDesc = `ในตำแหน่ง <strong>1. อดีต / รากเหง้าของเรื่องราว</strong>`;
        else if (index === 1) roleDesc = `ในตำแหน่ง <strong>2. ปัจจุบัน / สถานการณ์ที่เป็นอยู่</strong>`;
        else roleDesc = `ในตำแหน่ง <strong>3. อนาคต / แนวโน้มผลลัพธ์ที่จะเกิดขึ้น</strong>`;
      } else if (this.spreadCount === 4) {
        if (index === 0) roleDesc = `ในตำแหน่ง <strong>1. จุดเริ่มต้นและสาเหตุของปัญหา</strong>`;
        else if (index === 1) roleDesc = `ในตำแหน่ง <strong>2. อุปสรรคและสิ่งที่ขัดขวางในปัจจุบัน</strong>`;
        else if (index === 2) roleDesc = `ในตำแหน่ง <strong>3. ปัจจัยภายนอกหรือสิ่งที่คาดไม่ถึง</strong>`;
        else roleDesc = `ในตำแหน่ง <strong>4. ทางออก บทสรุป และคำแนะนำแก้ไข</strong>`;
      } else {
        roleDesc = `ในตำแหน่ง <strong>${pos}</strong>`;
      }

      return `${roleDesc} ไพ่ <strong>${cardName}</strong> [${orientText}] ซึ่งเป็นตัวแทนของพลัง <em>"${kw}"</em> ตามตำราพยากรณ์ในหมวด${domainName}ระบุว่า: ${categoryText} <br><span style="display:inline-block; margin-top:0.4rem; color:var(--gold-primary);">✦ สารเตือนใจจากไพ่:</span> <em>"${aspect.advice.th}"</em>`;
    } else {
      let roleDesc = `In position <strong>${pos}</strong>`;
      return `${roleDesc}, <strong>${cardName}</strong> [${orientText}] embodying <em>"${kw}"</em> reveals in the domain of ${domainName}: ${categoryText} <br><span style="display:inline-block; margin-top:0.4rem; color:var(--gold-primary);">✦ Sacred Guidance:</span> <em>"${aspect.advice.en}"</em>`;
    }
  }

  // =========================================================================
  // 7. GRIMOIRE / ENCYCLOPEDIA (78 CARDS)
  // =========================================================================
  renderGrimoire() {
    this.filterGrimoire();
  }

  filterGrimoire() {
    const query = this.grimoireSearchInput.value.toLowerCase().trim();
    this.grimoireCardsGrid.innerHTML = "";

    const filtered = TAROT_CARDS.filter(card => {
      // Suit filter
      if (this.currentFilter !== "all" && card.suite !== this.currentFilter) {
        return false;
      }
      // Search query
      if (query) {
        const matchTh = card.name_th.toLowerCase().includes(query) || 
          card.upright.keywords.th.some(k => k.toLowerCase().includes(query));
        const matchEn = card.name_en.toLowerCase().includes(query) || 
          card.upright.keywords.en.some(k => k.toLowerCase().includes(query));
        return matchTh || matchEn;
      }
      return true;
    });

    filtered.forEach(card => {
      const cardName = this.lang === "th" ? card.name_th : card.name_en;
      const suiteName = card.suite === "major" 
        ? "Major Arcana" 
        : (SUIT_INFO[card.suite] ? SUIT_INFO[card.suite]["name_" + this.lang] : card.suite);
      const safeImg = encodeURI(card.image);

      const itemEl = document.createElement("div");
      itemEl.className = "grimoire-card-item";
      itemEl.innerHTML = `
        <div class="grimoire-card-thumb">
          <img src="${safeImg}" alt="${cardName}" loading="lazy" onerror="this.style.opacity='0.6';" />
        </div>
        <div class="grimoire-card-name">${cardName}</div>
        <div class="grimoire-card-suite">${suiteName}</div>
      `;

      itemEl.addEventListener("click", () => {
        window.mysticAudio.playClick();
        this.openCardModal(card);
      });

      this.grimoireCardsGrid.appendChild(itemEl);
    });
  }

  openCardModal(card) {
    const dict = I18N[this.lang];
    const cardName = this.lang === "th" ? card.name_th : card.name_en;
    const quote = card.quote[this.lang];
    const safeImg = encodeURI(card.image);

    this.modalBody.innerHTML = `
      <div class="modal-card-detail-layout">
        <div class="modal-card-image-col">
          <img src="${safeImg}" alt="${cardName}" onerror="this.style.opacity='0.6';" />
          <div style="margin-top:1rem; text-align:center;">
            <span class="kw-badge">${card.element[this.lang]}</span>
          </div>
        </div>
        <div class="modal-card-info-col">
          <h2 style="font-family:var(--font-title); color:var(--gold-primary); margin-bottom:0.3rem;">
            ${cardName}
          </h2>
          <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:1rem;">
            ${card.suite === "major" ? "Major Arcana" : SUIT_INFO[card.suite]["name_" + this.lang]}
          </p>

          <div class="interp-quote-box" style="margin-bottom:1.5rem;">
            "${quote}"
          </div>

          <!-- Upright Section -->
          <div style="margin-bottom:1.5rem; background:rgba(74, 222, 128, 0.06); border-left:3px solid #4ade80; padding:1rem;">
            <h4 style="color:#4ade80; margin-bottom:0.5rem;">✦ ${dict.card_upright}</h4>
            <div class="interp-keywords-cloud" style="margin-bottom:0.6rem;">
              ${card.upright.keywords[this.lang].map(k => `<span class="kw-badge"># ${k}</span>`).join("")}
            </div>
            <p style="font-size:0.95rem; line-height:1.6;">${card.upright.general[this.lang]}</p>
          </div>

          <!-- Reversed Section -->
          <div style="margin-bottom:1.5rem; background:rgba(248, 113, 113, 0.06); border-left:3px solid #f87171; padding:1rem;">
            <h4 style="color:#f87171; margin-bottom:0.5rem;">✦ ${dict.card_reversed}</h4>
            <div class="interp-keywords-cloud" style="margin-bottom:0.6rem;">
              ${card.reversed.keywords[this.lang].map(k => `<span class="kw-badge"># ${k}</span>`).join("")}
            </div>
            <p style="font-size:0.95rem; line-height:1.6;">${card.reversed.general[this.lang]}</p>
          </div>

          <!-- Witch Guidance -->
          <div class="witch-advice-box">
            <div class="witch-icon-small">🔮</div>
            <div>
              <h5>${dict.witch_advice}</h5>
              <p>${card.upright.advice[this.lang]}</p>
            </div>
          </div>

        </div>
      </div>
    `;

    this.modal.classList.add("active");
  }

  closeModal() {
    this.modal.classList.remove("active");
  }
}

// Initialize on DOM load
window.addEventListener("DOMContentLoaded", () => {
  window.tarotApp = new TarotApp();
});
