/**
 * เซียมซีทาโรต์ (SiamSi Tarot) - Fastwork Admin Backoffice Controller
 * จัดการรหัสโค้ดดูดวง (จำกัด 1 ครั้ง อายุ 1 วัน), ตรวจสอบ Log การเข้าใช้งาน/แชร์/PDF,
 * และดาวน์โหลดไฟล์ PDF / รูป Info คำทำนายของลูกค้าเพื่อส่งงานใน Fastwork แบบแมนนวล
 */

const CATEGORY_NAMES_TH = {
  love: "ความรัก",
  career: "การงาน",
  finance: "การเงิน",
  health: "สุขภาพ",
  wongtaisin: "ตำราหว่องไทซิน",
  tanjai: "ตำราหลวงพ่อทันใจ"
};

class AdminBackoffice {
  constructor() {
    this.codes = [];
    this.lastCreatedCodeObj = null;
    this.activeRagDiscipline = "tarot";
    this.expandedRagDocIds = new Set();

    this.initDOM();
    this.bindEvents();
    this.refreshData();

    // Auto-refresh logs every 8 seconds when tab is visible
    setInterval(() => {
      if (document.visibilityState === "visible") {
        this.refreshData(true);
      }
    }, 8000);
  }

  escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  initDOM() {
    this.syncModeBadge = document.getElementById("sync-mode-badge");
    this.btnRefreshCodes = document.getElementById("btn-refresh-codes");

    // Admin Menu Tabs & Views
    this.btnTabCodes = document.getElementById("btn-admin-tab-codes");
    this.btnTabRag = document.getElementById("btn-admin-tab-rag");
    this.btnBackToCodesView = document.getElementById("btn-back-to-codes-view");
    this.adminViewCodes = document.getElementById("admin-view-codes");
    this.ragKnowledgeSection = document.getElementById("rag-knowledge-section");

    // Stats
    this.statTotal = document.getElementById("stat-total-codes");
    this.statAccessed = document.getElementById("stat-accessed-codes");
    this.statDrawn = document.getElementById("stat-drawn-codes");
    this.statShared = document.getElementById("stat-shared-codes");
    this.statRagChunks = document.getElementById("stat-rag-chunks");

    // Admin Passcode & Quick Demo Bar
    this.inputAdminPasscode = document.getElementById("input-admin-passcode");
    this.btnSaveAdminPasscode = document.getElementById("btn-save-admin-passcode");

    // RAG Knowledge Base Elements
    this.ragUploadForm = document.getElementById("rag-upload-form");
    this.ragDocTitle = document.getElementById("rag-doc-title");
    this.ragDocDiscipline = document.getElementById("rag-doc-discipline");
    this.ragFileInput = document.getElementById("rag-file-input");
    this.ragDocContent = document.getElementById("rag-doc-content");
    this.ragDocsList = document.getElementById("rag-docs-list");
    this.btnCopyNotebookLmPrompt = document.getElementById("btn-copy-notebooklm-prompt");
    this.ragActiveSummaryBar = document.getElementById("rag-active-summary-bar");
    this.ragDisciplineTabs = document.getElementById("rag-discipline-tabs");
    this.ragDisciplineNotice = document.getElementById("rag-discipline-notice");
    this.ragActivateOnUpload = document.getElementById("rag-activate-on-upload");
    this.ragActivateUploadWrap = document.getElementById("rag-activate-upload-wrap");

    // Create Code Form
    this.createForm = document.getElementById("create-code-form");
    this.inputCustomerName = document.getElementById("input-customer-name");
    this.inputOrderId = document.getElementById("input-order-id");
    this.selectServiceMode = document.getElementById("select-service-mode");
    this.selectLockedCategory = document.getElementById("select-locked-category");
    this.inputCustomCode = document.getElementById("input-custom-code");

    // Newly Created Box
    this.newlyCreatedBox = document.getElementById("newly-created-box");
    this.newlyCreatedCodeLabel = document.getElementById("newly-created-code-label");
    this.newlyCreatedMeta = document.getElementById("newly-created-meta");
    this.newlyCreatedMessage = document.getElementById("newly-created-message");
    this.btnCopyFastworkMsg = document.getElementById("btn-copy-fastwork-msg");
    this.btnCopyDirectLink = document.getElementById("btn-copy-direct-link");
    this.btnOpenCreatedLink = document.getElementById("btn-open-created-link");

    // Filters & Table
    this.searchInput = document.getElementById("admin-search-input");
    this.filterMode = document.getElementById("admin-filter-mode");
    this.filterStatus = document.getElementById("admin-filter-status");
    this.codesTbody = document.getElementById("admin-codes-tbody");

    // Detail Modal
    this.detailModal = document.getElementById("admin-detail-modal");
    this.detailModalBody = document.getElementById("admin-modal-body");
    this.btnCloseDetailModal = document.getElementById("btn-close-admin-modal");

    // Toast
    this.toast = document.getElementById("mystic-toast");
  }

  bindEvents() {
    // Admin Menu Tab Switching (แสดงระบบปรับปรุงตำรา RAG เฉพาะเมื่อกดเข้าเมนูอัปโหลดตำรา RAG เท่านั้น)
    if (this.btnTabCodes) {
      this.btnTabCodes.addEventListener("click", () => this.switchAdminTab("codes"));
    }
    if (this.btnTabRag) {
      this.btnTabRag.addEventListener("click", () => this.switchAdminTab("rag"));
    }
    if (this.btnBackToCodesView) {
      this.btnBackToCodesView.addEventListener("click", () => this.switchAdminTab("codes"));
    }
    if (window.location.hash === "#rag-knowledge-section") {
      this.switchAdminTab("rag");
    } else {
      this.switchAdminTab("codes");
    }

    if (this.btnRefreshCodes) {
      this.btnRefreshCodes.addEventListener("click", () => {
        this.refreshData();
        this.showToast("🔄 อัปเดตข้อมูลโค้ดและ Log ล่าสุดแล้ว");
      });
    }

    // Update category dropdown options when switching between Tarot and Siamsi
    if (this.selectServiceMode) {
      this.selectServiceMode.addEventListener("change", () => {
        this.updateCategoryDropdownForMode(this.selectServiceMode.value);
      });
    }

    // Create Code Submit
    if (this.createForm) {
      this.createForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        await this.handleCreateCode();
      });
    }

    if (this.btnCopyFastworkMsg) {
      this.btnCopyFastworkMsg.addEventListener("click", () => {
        if (!this.newlyCreatedMessage) return;
        navigator.clipboard.writeText(this.newlyCreatedMessage.value).then(() => {
          this.showToast("📋 คัดลอกข้อความส่งลูกค้า Fastwork เรียบร้อยแล้ว!");
        });
      });
    }

    if (this.btnCopyDirectLink) {
      this.btnCopyDirectLink.addEventListener("click", () => {
        if (!this.lastCreatedCodeObj) return;
        const link = this.buildCustomerDirectUrl(this.lastCreatedCodeObj.code);
        navigator.clipboard.writeText(link).then(() => {
          this.showToast("🔗 คัดลอกลิงก์เข้าดูดวงเรียบร้อยแล้ว!");
        });
      });
    }

    if (this.btnOpenCreatedLink) {
      this.btnOpenCreatedLink.addEventListener("click", () => {
        if (!this.lastCreatedCodeObj) return;
        const link = this.buildCustomerDirectUrl(this.lastCreatedCodeObj.code);
        window.open(link, "_blank");
      });
    }

    // Search & Filters
    if (this.searchInput) {
      this.searchInput.addEventListener("input", () => this.renderTable());
    }
    if (this.filterMode) {
      this.filterMode.addEventListener("change", () => this.renderTable());
    }
    if (this.filterStatus) {
      this.filterStatus.addEventListener("change", () => this.renderTable());
    }

    // Modal close
    if (this.btnCloseDetailModal) {
      this.btnCloseDetailModal.addEventListener("click", () => {
        this.detailModal.classList.remove("active");
      });
    }
    if (this.detailModal) {
      this.detailModal.addEventListener("click", (e) => {
        if (e.target === this.detailModal) this.detailModal.classList.remove("active");
      });
    }

    // Admin Passcode Save
    if (this.inputAdminPasscode && window.codeManager && typeof window.codeManager.getAdminPasscode === "function") {
      const currentPass = window.codeManager.getAdminPasscode();
      this.inputAdminPasscode.value = currentPass;
      const hintEl = document.querySelector(".pass-hint-pill");
      if (hintEl) {
        hintEl.innerHTML = `รหัสปัจจุบัน: <strong>${currentPass}</strong> (หรือ <strong>ADMIN99</strong>)`;
      }
      this.inputAdminPasscode.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          if (this.btnSaveAdminPasscode) this.btnSaveAdminPasscode.click();
        }
      });
    }
    if (this.btnSaveAdminPasscode) {
      this.btnSaveAdminPasscode.addEventListener("click", () => {
        const rawVal = this.inputAdminPasscode ? this.inputAdminPasscode.value.trim() : "";
        if (!rawVal) {
          this.showToast("⚠️ กรุณาระบุรหัสผ่านแอดมินที่ต้องการตั้ง");
          return;
        }
        if (window.codeManager && typeof window.codeManager.setAdminPasscode === "function") {
          const saved = window.codeManager.setAdminPasscode(rawVal) || rawVal.toUpperCase();
          if (this.inputAdminPasscode) this.inputAdminPasscode.value = saved;
          const hintEl = document.querySelector(".pass-hint-pill");
          if (hintEl) {
            hintEl.innerHTML = `รหัสปัจจุบัน: <strong>${saved}</strong> (หรือ <strong>ADMIN99</strong>)`;
          }
          this.showToast(`🔐 บันทึกรหัสผ่านเข้าหน้าแอดมินเป็น "${saved}" เรียบร้อยแล้ว!`);
        }
      });
    }

    // Demo Code Quick Test & Reset Buttons in Admin Bar
    document.querySelectorAll("[data-test-code]").forEach(btn => {
      btn.addEventListener("click", () => {
        const code = btn.getAttribute("data-test-code");
        const url = this.buildCustomerDirectUrl(code);
        window.open(url, "_blank");
      });
    });
    document.querySelectorAll("[data-reset-code]").forEach(btn => {
      btn.addEventListener("click", async () => {
        const code = btn.getAttribute("data-reset-code");
        await window.codeManager.updateCodeAdmin(code, "reset_draw");
        await this.refreshData();
        this.showToast(`🔄 รีเซ็ตสิทธิ์โค้ดทดสอบ ${code} เรียบร้อยแล้ว!`);
      });
    });

    // NotebookLM RAG Knowledge Base File Input & Submit
    if (this.ragFileInput) {
      this.ragFileInput.addEventListener("change", (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          const text = String(ev.target.result || "");
          if (this.ragDocContent) this.ragDocContent.value = text;
          if (this.ragDocTitle && !this.ragDocTitle.value.trim()) {
            this.ragDocTitle.value = file.name.replace(/\.(md|txt|json)$/i, "");
          }
          this.showToast(`📂 อ่านไฟล์ตำรา "${file.name}" เรียบร้อย พร้อมอัปโหลดเข้าคลัง RAG`);
        };
        reader.readAsText(file, "utf-8");
      });
    }

    if (this.ragDisciplineTabs) {
      this.ragDisciplineTabs.querySelectorAll("[data-rag-tab]").forEach(btn => {
        btn.addEventListener("click", () => {
          const disc = btn.getAttribute("data-rag-tab");
          this.setActiveRagTab(disc, true);
        });
      });
    }

    if (this.ragDocDiscipline) {
      this.ragDocDiscipline.addEventListener("change", () => {
        const disc = this.ragDocDiscipline.value || "tarot";
        this.setActiveRagTab(disc, false);
      });
    }

    if (this.ragUploadForm) {
      this.ragUploadForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (!window.ragEngine) return;
        const title = this.ragDocTitle ? this.ragDocTitle.value.trim() : "";
        const discipline = this.ragDocDiscipline ? this.ragDocDiscipline.value : "tarot";
        const content = this.ragDocContent ? this.ragDocContent.value.trim() : "";
        const activateAfterUpload = (discipline !== "siamsi") && Boolean(this.ragActivateOnUpload && this.ragActivateOnUpload.checked);
        if (!content) {
          this.showToast("⚠️ กรุณาวางเนื้อหาสรุปตำราหรือเลือกไฟล์ก่อนอัปโหลด");
          return;
        }
        const doc = await window.ragEngine.uploadKnowledgeDocument({
          title: title || "ตำราพยากรณ์เสริม (NotebookLM)",
          source: "NotebookLM Upload",
          discipline,
          content,
          activateAfterUpload
        });
        this.activeRagDiscipline = doc.discipline || discipline;
        if (this.ragDocTitle) this.ragDocTitle.value = "";
        if (this.ragDocContent) this.ragDocContent.value = "";
        if (this.ragFileInput) this.ragFileInput.value = "";
        this.renderRagKnowledgeBase();
        this.renderStats();
        const activatedNote = activateAfterUpload ? " และตั้งเป็นตำราหลักของศาสตร์นี้แล้ว!" : "";
        this.showToast(`📚 อัปโหลดตำรา "${doc.title}" (${(doc.chunks || []).length} หัวข้อ)${activatedNote}`);
      });
    }

    if (this.btnCopyNotebookLmPrompt) {
      this.btnCopyNotebookLmPrompt.addEventListener("click", () => {
        if (!window.ragEngine) return;
        const promptText = window.ragEngine.getNotebookLMPromptTemplate(this.activeRagDiscipline);
        navigator.clipboard.writeText(promptText).then(() => {
          const discMeta = window.ragEngine.getDisciplineMeta(this.activeRagDiscipline);
          this.showToast(`📋 คัดลอก Prompt สำหรับสั่ง NotebookLM สรุปตำรา "${discMeta.shortLabel}" เรียบร้อยแล้ว!`);
        });
      });
    }
  }

  setActiveRagTab(discipline, syncSelect = true) {
    const cleanDisc = ["tarot", "palm", "siamsi"].includes(discipline) ? discipline : "tarot";
    this.activeRagDiscipline = cleanDisc;
    if (syncSelect && this.ragDocDiscipline) {
      this.ragDocDiscipline.value = cleanDisc;
    }
    if (this.ragActivateUploadWrap) {
      this.ragActivateUploadWrap.style.display = cleanDisc === "siamsi" ? "none" : "flex";
    }
    if (this.ragDocContent) {
      if (cleanDisc === "palm") {
        this.ragDocContent.placeholder = "[สุขภาพ และพลังชีวิต] ...\n[ความคิด การงาน และการตัดสินใจ] ...\n[ความรัก และความสัมพันธ์] ...\n[การเงิน โอกาส และความมั่นคง] ...";
      } else if (cleanDisc === "siamsi") {
        this.ragDocContent.placeholder = "เบอร์ 01: คำอธิบายเสริมพิเศษหรือข้อแนะนำเพิ่มเติมสำหรับใบเซียมซี...";
      } else {
        this.ragDocContent.placeholder = "# The Lovers (ไพ่เดอะเลิฟเวอร์)\n- ความรักคนโสด: มีเกณฑ์พบรักที่มีแรงดึงดูดสูงมาก...\n- ความรักคนมีคู่: ความรู้สึกเชื่อมโยงลึกซึ้ง...\n- การงาน: ได้พาร์ทเนอร์หรือหุ้นส่วนที่เกื้อหนุน...";
      }
    }
    this.renderRagKnowledgeBase();
  }

  switchAdminTab(tabName) {
    const isRag = tabName === "rag";
    if (this.adminViewCodes) {
      this.adminViewCodes.style.display = isRag ? "none" : "block";
    }
    if (this.ragKnowledgeSection) {
      this.ragKnowledgeSection.style.display = isRag ? "block" : "none";
    }
    if (this.btnTabCodes) {
      this.btnTabCodes.classList.toggle("active", !isRag);
      this.btnTabCodes.setAttribute("aria-selected", String(!isRag));
    }
    if (this.btnTabRag) {
      this.btnTabRag.classList.toggle("active", isRag);
      this.btnTabRag.setAttribute("aria-selected", String(isRag));
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  updateCategoryDropdownForMode(mode) {
    if (!this.selectLockedCategory) return;
    if (mode === "siamsi") {
      this.selectLockedCategory.innerHTML = `
        <option value="">🎋 ให้ผู้ดูเลือกตำราเซียมซีเองหน้าเว็บ (แนะนำ)</option>
        <option value="wongtaisin">🏛️ ค่าเริ่มต้น: เซียมซีหว่องไทซิน (ผู้ดูสลับเองได้)</option>
        <option value="tanjai">🪷 ค่าเริ่มต้น: เซียมซีหลวงพ่อทันใจ (ผู้ดูสลับเองได้)</option>
      `;
    } else {
      this.selectLockedCategory.innerHTML = `
        <option value="">ให้ลูกค้าเลือกหมวดหมู่เอง (ความรัก/การงาน/การเงิน/สุขภาพ)</option>
        <option value="love">💖 ล็อกหมวด: ความรัก</option>
        <option value="career">💼 ล็อกหมวด: การงาน</option>
        <option value="finance">💰 ล็อกหมวด: การเงิน</option>
        <option value="health">🌿 ล็อกหมวด: สุขภาพ</option>
      `;
    }
  }

  buildCustomerDirectUrl(codeObjOrStr) {
    const isObj = typeof codeObjOrStr === "object" && codeObjOrStr !== null;
    const codeStr = isObj ? codeObjOrStr.code : codeObjOrStr;
    const codeObj = isObj ? codeObjOrStr : (this.codes.find(c => c.code === codeStr) || null);
    const basePath = window.location.pathname.replace(/admin\.html.*$/, "index.html");
    const token = (codeObj && window.codeManager.encodeCodeToken) ? window.codeManager.encodeCodeToken(codeObj) : "";
    const tokenParam = token ? `&t=${encodeURIComponent(token)}` : "";
    return `${window.location.origin}${basePath}?code=${encodeURIComponent(codeStr)}${tokenParam}`;
  }

  buildFastworkCustomerMessage(codeObj) {
    const link = this.buildCustomerDirectUrl(codeObj);
    const serviceMap = {
      tarot: "🔮 แพ็กเกจ 1: ดูดวงไพ่ทาโรต์ 3 ใบ (สิทธิ์สุ่มด้วยตนเอง 1 ครั้ง)",
      siamsi: "🎋 แพ็กเกจ 2: เสี่ยงเซียมซีศักดิ์สิทธิ์ (สิทธิ์เขย่าด้วยตนเอง 1 ครั้ง)",
      combo: "🌟 แพ็กเกจ 3 (VIP รวม 3 ศาสตร์): ไพ่ทาโรต์ + เซียมซี + สแกนลายมือ (ใช้ได้ทุกบริการ อย่างละ 1 ครั้ง)",
      palm: "✋ แพ็กเกจ 4: สแกนดูลายมืออัจฉริยะ (สิทธิ์สแกนด้วยตนเอง 1 ครั้ง)"
    };
    const serviceName = serviceMap[codeObj.mode] || serviceMap.tarot;
    const catNote = codeObj.lockedCategory && CATEGORY_NAMES_TH[codeObj.lockedCategory]
      ? ` (${CATEGORY_NAMES_TH[codeObj.lockedCategory]})`
      : "";
    const expireStr = new Date(codeObj.expiresAt).toLocaleString("th-TH", {
      dateStyle: "medium",
      timeStyle: "short"
    });
    const limitRule = codeObj.mode === "combo"
      ? `- โค้ดพิเศษนี้สามารถเลือกใช้บริการได้ทั้ง "ดูดวงไพ่ทาโรต์ 3 ใบ" และ "เสี่ยงเซียมซี" อย่างละ 1 ครั้ง (มีอายุใช้งาน 1 วัน ถึง ${expireStr})`
      : `- โค้ดนี้ให้คุณกดสุ่มเปิดดวงด้วยตนเองได้ 1 ครั้ง และมีอายุใช้งาน 1 วัน (หมดอายุ: ${expireStr})`;

    return `🔮 ขอต้อนรับสู่ "เซียมซีทาโรต์" (SIAMSI TAROT • ORACLE)\n` +
      `✦ ${serviceName}${catNote}\n` +
      `🔑 รหัสโค้ดเข้าดูดวงของคุณ: ${codeObj.code}\n` +
      `🔗 คลิกเข้าสู่ระบบเพื่อกดดูดวงด้วยตนเอง: ${link}\n\n` +
      `📌 เงื่อนไขการใช้งาน:\n` +
      `${limitRule}\n` +
      `- หลังกดเปิดคำทำนายแล้ว สามารถกดแชร์รูป Info พร้อมคำทำนายเต็มไปยังโซเชียล หรือดาวน์โหลดเก็บเป็นไฟล์ PDF ลงเครื่องได้ทันทีค่ะ ✨`;
  }

  async handleCreateCode() {
    try {
      const fastworkOrder = this.inputOrderId ? this.inputOrderId.value.trim() : "";
      const mode = this.selectServiceMode.value;
      const lockedCategory = this.selectLockedCategory.value;
      const customCode = this.inputCustomCode.value.trim();

      const codeObj = await window.codeManager.createCode({
        customerName: "",
        fastworkOrder,
        mode,
        lockedCategory,
        customCode,
        durationHours: 24
      });

      this.lastCreatedCodeObj = codeObj;
      const msg = this.buildFastworkCustomerMessage(codeObj);

      if (this.newlyCreatedBox) {
        const modeTitleMap = {
          tarot: "แพ็กเกจ 1: ดูดวงไพ่ทาโรต์ 3 ใบ",
          siamsi: "แพ็กเกจ 2: เสี่ยงเซียมซี",
          combo: "แพ็กเกจ 3: ดูดวง + เสี่ยงเซียมซี (อย่างละ 1 ครั้ง)"
        };
        this.newlyCreatedBox.style.display = "block";
        this.newlyCreatedCodeLabel.textContent = `รหัสโค้ด: ${codeObj.code}`;
        this.newlyCreatedMeta.textContent = `(${modeTitleMap[codeObj.mode] || "ดูดวง"}${fastworkOrder ? ` • ออเดอร์: ${fastworkOrder}` : ""})`;
        this.newlyCreatedMessage.value = msg;
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(msg).catch(() => {});
      }

      if (this.inputCustomerName) this.inputCustomerName.value = "";
      if (this.inputOrderId) this.inputOrderId.value = "";
      if (this.inputCustomCode) this.inputCustomCode.value = "";

      await this.refreshData();
      this.showToast(`✨ สร้างโค้ด ${codeObj.code} และคัดลอกข้อความสำหรับส่งลูกค้า Fastwork แล้ว!`);
    } catch (err) {
      alert(err.message || "ไม่สามารถสร้างโค้ดได้");
    }
  }

  async refreshData(silent = false) {
    this.codes = await window.codeManager.getAllCodes();

    if (window.ragEngine && typeof window.ragEngine.syncFromServer === "function") {
      if (!silent) {
        await window.ragEngine.syncFromServer().catch(() => {});
      }
    }

    if (this.syncModeBadge) {
      if (window.codeManager.apiAvailable) {
        this.syncModeBadge.textContent = "🟢 เชื่อมต่อฐานข้อมูล Server API แล้ว";
      } else {
        this.syncModeBadge.textContent = "🟢 โหมดพร้อมใช้งาน (Local & Smart Sync)";
      }
    }

    this.renderRagKnowledgeBase();
    this.renderStats();
    this.renderTable();
  }

  isDemoCode(codeObjOrStr) {
    if (window.codeManager && typeof window.codeManager.isDemoCode === "function") {
      return window.codeManager.isDemoCode(codeObjOrStr);
    }
    const codeStr = typeof codeObjOrStr === "string" ? codeObjOrStr : (codeObjOrStr && codeObjOrStr.code ? codeObjOrStr.code : "");
    return ["TAROT99", "SIAMSI99", "COMBO99", "PALM99"].includes(String(codeStr).trim().toUpperCase());
  }

  getCustomerCodes() {
    return (this.codes || []).filter(c => !this.isDemoCode(c));
  }

  renderStats() {
    const customerCodes = this.getCustomerCodes();
    const total = customerCodes.length;
    const accessed = customerCodes.filter(c => c.logs && c.logs.accessCount > 0).length;
    const drawn = customerCodes.filter(c => (c.drawCount > 0 && c.readingResult) || c.tarotResult || c.siamsiResult || c.palmResult || (c.palmDrawCount || 0) >= 1).length;
    const sharedOrPdf = customerCodes.filter(c => c.logs && (c.logs.shareCount > 0 || c.logs.pdfDownloadCount > 0)).length;

    if (this.statTotal) this.statTotal.textContent = total;
    if (this.statAccessed) this.statAccessed.textContent = accessed;
    if (this.statDrawn) this.statDrawn.textContent = drawn;
    if (this.statShared) this.statShared.textContent = sharedOrPdf;

    if (this.statRagChunks && window.ragEngine) {
      const docs = window.ragEngine.getAllDocuments();
      const totalChunks = docs.reduce((acc, d) => acc + ((d.chunks && d.chunks.length) || 0), 0);
      this.statRagChunks.textContent = `${totalChunks} หัวข้อ (${docs.length} ตำรา / 3 ศาสตร์)`;
    }
  }

  renderRagKnowledgeBase() {
    if (!this.ragDocsList || !window.ragEngine) return;

    const tarotActive = window.ragEngine.getActiveBook("tarot");
    const palmActive = window.ragEngine.getActiveBook("palm");

    // 1. Summary Bar showing active book per discipline
    if (this.ragActiveSummaryBar) {
      this.ragActiveSummaryBar.innerHTML = `
        <div class="rag-summary-chip ${this.activeRagDiscipline === "tarot" ? "is-focused" : ""}" data-summary-disc="tarot">
          <div class="rag-summary-label">
            <span>🔮 ไพ่ทาโรต์</span>
            <span class="rag-summary-mode-pill">Admin เลือก</span>
          </div>
          <div class="rag-summary-book">${this.escapeHtml(tarotActive ? tarotActive.title : "-")}</div>
        </div>
        <div class="rag-summary-chip ${this.activeRagDiscipline === "palm" ? "is-focused" : ""}" data-summary-disc="palm">
          <div class="rag-summary-label">
            <span>✋ สแกนลายมือ</span>
            <span class="rag-summary-mode-pill">Admin เลือก</span>
          </div>
          <div class="rag-summary-book">${this.escapeHtml(palmActive ? palmActive.title : "-")}</div>
        </div>
        <div class="rag-summary-chip viewer-choice ${this.activeRagDiscipline === "siamsi" ? "is-focused" : ""}" data-summary-disc="siamsi">
          <div class="rag-summary-label">
            <span>🎋 เซียมซีศักดิ์สิทธิ์</span>
            <span class="rag-summary-mode-pill viewer">ผู้ดูเลือกเองได้</span>
          </div>
          <div class="rag-summary-book">ผู้ดูเลือกใช้หน้าเว็บ (หว่องไทซิน / หลวงพ่อทันใจ)</div>
        </div>
      `;
      this.ragActiveSummaryBar.querySelectorAll("[data-summary-disc]").forEach(el => {
        el.addEventListener("click", () => {
          this.setActiveRagTab(el.getAttribute("data-summary-disc"), true);
        });
      });
    }

    // 2. Sync discipline tab states & counts
    const counts = {
      tarot: window.ragEngine.getDocumentsByDiscipline("tarot").length,
      palm: window.ragEngine.getDocumentsByDiscipline("palm").length,
      siamsi: window.ragEngine.getDocumentsByDiscipline("siamsi").length
    };
    if (this.ragDisciplineTabs) {
      this.ragDisciplineTabs.querySelectorAll("[data-rag-tab]").forEach(btn => {
        const t = btn.getAttribute("data-rag-tab");
        const isOn = t === this.activeRagDiscipline;
        btn.classList.toggle("active", isOn);
        btn.setAttribute("aria-selected", String(isOn));
      });
      this.ragDisciplineTabs.querySelectorAll("[data-rag-count]").forEach(span => {
        const t = span.getAttribute("data-rag-count");
        span.textContent = String(counts[t] || 0);
      });
    }

    // 3. Discipline policy notice
    const disc = this.activeRagDiscipline;
    if (this.ragDisciplineNotice) {
      if (disc === "siamsi") {
        this.ragDisciplineNotice.className = "rag-discipline-notice is-viewer-mode";
        this.ragDisciplineNotice.innerHTML = `🔓 <strong>ศาสตร์เซียมซี (ข้อยกเว้น):</strong> ระบบเปิดสิทธิ์ให้ <strong>ผู้ดู / ลูกค้า</strong> เลือกตำราเซียมซีที่ต้องการเองได้โดยตรงบนหน้าเว็บ (หว่องไทซิน / หลวงพ่อทันใจ) และสามารถเลือกอ่านตำราเสริมที่ Admin เปิดไว้ได้`;
      } else if (disc === "palm") {
        this.ragDisciplineNotice.className = "rag-discipline-notice";
        this.ragDisciplineNotice.innerHTML = `✋ <strong>คลังตำราหัตถศาสตร์ (สแกนลายมือ):</strong> Admin สามารถกด <strong>"🎯 เลือกใช้ตำรานี้"</strong> เพื่อกำหนดตำราหลักที่ระบบจะใช้แปลผลลายมือ 2 ข้างให้ลูกค้าทุกคน`;
      } else {
        this.ragDisciplineNotice.className = "rag-discipline-notice";
        this.ragDisciplineNotice.innerHTML = `🔮 <strong>คลังตำราไพ่ทาโรต์:</strong> Admin สามารถกด <strong>"🎯 เลือกใช้ตำรานี้"</strong> เพื่อกำหนดสำนัก/แนวทางตำราหลักที่ระบบจะใช้วิเคราะห์ไพ่ 3 ใบให้ลูกค้าทุกคน`;
      }
    }

    // 4. Render documents for current discipline tab
    const docs = window.ragEngine.getDocumentsByDiscipline(disc);
    if (docs.length === 0) {
      this.ragDocsList.innerHTML = `<div style="padding:1rem; color:var(--text-muted);">ยังไม่มีตำราในคลังศาสตร์นี้</div>`;
      return;
    }

    this.ragDocsList.innerHTML = docs.map(doc => {
      const isExpanded = this.expandedRagDocIds.has(doc.id);
      const safeTitle = this.escapeHtml(doc.title);
      const safeSource = this.escapeHtml(doc.source || "NotebookLM");
      const safeStyle = this.escapeHtml(doc.styleTag || "");
      const safeDesc = this.escapeHtml(doc.description || "");
      const safeContent = this.escapeHtml(doc.content || "");
      const chunkCount = (doc.chunks || []).length;

      let statusControlHtml = "";
      if (disc === "siamsi") {
        if (doc.isBuiltIn) {
          statusControlHtml = `<span class="rag-viewer-pill">👤 ผู้ดูเลือกเองหน้าเว็บ</span>`;
        } else {
          const isOn = doc.enabledForViewer !== false;
          statusControlHtml = `
            <button type="button" class="${isOn ? "rag-active-pill" : "btn-preview-rag"}" data-toggle-siamsi-rag="${doc.id}" style="cursor:pointer;">
              ${isOn ? "✅ เปิดให้ผู้ดูเลือก" : "⏸️ ปิดชั่วคราว"}
            </button>
          `;
        }
      } else {
        if (doc.isActive) {
          statusControlHtml = `<span class="rag-active-pill">✅ ใช้งานอยู่</span>`;
        } else {
          statusControlHtml = `<button type="button" class="btn-activate-rag" data-act-rag="${doc.id}" data-act-disc="${disc}">🎯 เลือกใช้ตำรานี้</button>`;
        }
      }

      const cardActiveClass = (disc !== "siamsi" && doc.isActive) ? "is-active-book" : "";

      return `
        <div class="rag-doc-card ${cardActiveClass}" data-rag-doc-id="${doc.id}">
          <div class="rag-doc-card-head">
            <div class="rag-doc-card-main">
              <div class="rag-doc-title-row">
                <strong>📖 ${safeTitle}</strong>
                <span class="rag-chunk-pill">${chunkCount} หัวข้อความรู้</span>
                ${safeStyle ? `<span class="rag-style-pill">${safeStyle}</span>` : ""}
              </div>
              ${safeDesc ? `<div class="rag-doc-desc">${safeDesc}</div>` : ""}
              <div class="rag-doc-meta">
                <span>• แหล่งที่มา: ${safeSource}</span>
                <span>• อัปเดต: ${doc.isBuiltIn ? "ตำรามาตรฐานในระบบ" : this.formatDateTime(doc.uploadedAt)}</span>
              </div>
            </div>
            <div class="rag-doc-actions">
              ${statusControlHtml}
              <div class="rag-doc-action-row">
                <button type="button" class="btn-preview-rag" data-preview-rag="${doc.id}">
                  ${isExpanded ? "🔼 ซ่อนตัวอย่าง" : "👁️ อ่านตัวอย่าง"}
                </button>
                ${!doc.isBuiltIn ? `<button type="button" class="btn-row-act btn-danger" data-del-rag="${doc.id}">🗑️ ลบ</button>` : ""}
              </div>
            </div>
          </div>
          ${isExpanded ? `<div class="rag-doc-preview-box">${safeContent}</div>` : ""}
        </div>
      `;
    }).join("");

    // Bind card buttons
    this.ragDocsList.querySelectorAll("[data-act-rag]").forEach(btn => {
      btn.addEventListener("click", async () => {
        const docId = btn.getAttribute("data-act-rag");
        const targetDisc = btn.getAttribute("data-act-disc");
        try {
          await window.ragEngine.setActiveBook(targetDisc, docId);
          const activeNow = window.ragEngine.getActiveBook(targetDisc);
          this.renderRagKnowledgeBase();
          this.showToast(`✅ เปลี่ยนตำราประจำศาสตร์เป็น "${activeNow ? activeNow.title : docId}" เรียบร้อยแล้ว!`);
        } catch (err) {
          this.showToast(`⚠️ ${err.message || "ไม่สามารถเปลี่ยนตำราได้"}`);
        }
      });
    });

    this.ragDocsList.querySelectorAll("[data-toggle-siamsi-rag]").forEach(btn => {
      btn.addEventListener("click", async () => {
        const docId = btn.getAttribute("data-toggle-siamsi-rag");
        const curDoc = docs.find(d => d.id === docId);
        const nextState = !(curDoc && curDoc.enabledForViewer !== false);
        await window.ragEngine.setSiamsiDocViewerEnabled(docId, nextState);
        this.renderRagKnowledgeBase();
        this.showToast(nextState ? "✅ เปิดตำราเสริมเซียมซีให้ผู้ดูเลือกใช้ได้แล้ว" : "⏸️ พักตำราเสริมเซียมซีไว้ชั่วคราวแล้ว");
      });
    });

    this.ragDocsList.querySelectorAll("[data-preview-rag]").forEach(btn => {
      btn.addEventListener("click", () => {
        const docId = btn.getAttribute("data-preview-rag");
        if (this.expandedRagDocIds.has(docId)) {
          this.expandedRagDocIds.delete(docId);
        } else {
          this.expandedRagDocIds.add(docId);
        }
        this.renderRagKnowledgeBase();
      });
    });

    this.ragDocsList.querySelectorAll("[data-del-rag]").forEach(btn => {
      btn.addEventListener("click", async () => {
        const docId = btn.getAttribute("data-del-rag");
        this.expandedRagDocIds.delete(docId);
        await window.ragEngine.deleteDocument(docId);
        this.renderRagKnowledgeBase();
        this.renderStats();
        this.showToast("🗑️ ลบชุดตำราออกจากคลัง RAG เรียบร้อยแล้ว");
      });
    });
  }

  formatDateTime(ts) {
    if (!ts) return "-";
    return new Date(ts).toLocaleString("th-TH", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  getEffectiveStatus(codeObj) {
    if (window.codeManager.isCodeExpired(codeObj)) return "expired";
    if ((codeObj.drawCount > 0 && codeObj.readingResult) || codeObj.tarotResult || codeObj.siamsiResult || codeObj.palmResult || (codeObj.palmDrawCount || 0) >= 1) return "drawn";
    if (codeObj.logs && codeObj.logs.accessCount > 0) return "accessed";
    return "unused";
  }

  renderTable() {
    if (!this.codesTbody) return;
    const q = (this.searchInput ? this.searchInput.value : "").trim().toLowerCase();
    const modeFilter = this.filterMode ? this.filterMode.value : "all";
    const statusFilter = this.filterStatus ? this.filterStatus.value : "all";

    // ไม่รวมโค้ดทดสอบ (TAROT99, SIAMSI99, COMBO99) ในตาราง Log ของลูกค้า
    const customerCodes = this.getCustomerCodes();

    const filtered = customerCodes.filter(c => {
      if (modeFilter !== "all" && c.mode !== modeFilter) return false;
      const effStatus = this.getEffectiveStatus(c);
      if (statusFilter !== "all" && effStatus !== statusFilter) return false;

      if (q) {
        const hay = `${c.code} ${c.fastworkOrder || ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    if (filtered.length === 0) {
      this.codesTbody.innerHTML = `
        <tr>
          <td colspan="4" style="text-align:center; padding: 1.5rem; color: var(--text-muted);">
            ไม่พบรายการรหัสโค้ดที่ตรงกับเงื่อนไข
          </td>
        </tr>
      `;
      return;
    }

    this.codesTbody.innerHTML = "";

    filtered.forEach(codeObj => {
      const tr = document.createElement("tr");
      tr.className = "compact-code-tr";
      const isExpired = window.codeManager.isCodeExpired(codeObj);
      const remainText = window.codeManager.getRemainingTimeText(codeObj, "th");
      const logs = codeObj.logs || {};
      const hasAccessed = logs.accessCount > 0;
      const tarotRes = codeObj.tarotResult || (codeObj.readingResult && codeObj.readingResult.mode === "tarot" ? codeObj.readingResult : null);
      const siamsiRes = codeObj.siamsiResult || (codeObj.readingResult && codeObj.readingResult.mode === "siamsi" ? codeObj.readingResult : null);
      const palmRes = codeObj.palmResult || (codeObj.readingResult && codeObj.readingResult.mode === "palm" ? codeObj.readingResult : null);
      const isPalmOnly = codeObj.mode === "palm";
      const hasDrawn = !!(tarotRes || siamsiRes || palmRes || (codeObj.palmDrawCount || 0) >= 1);
      const hasShared = logs.shareCount > 0;
      const hasPdf = logs.pdfDownloadCount > 0;

      let modeBadge = `<span class="mode-pill tarot">🔮 ทาโรต์ 3 ใบ</span>`;
      if (codeObj.mode === "siamsi") {
        modeBadge = `<span class="mode-pill siamsi">🎋 เซียมซี</span>`;
      } else if (codeObj.mode === "combo") {
        modeBadge = `<span class="mode-pill combo">🌟 รวม 3 ศาสตร์</span>`;
      } else if (codeObj.mode === "palm") {
        modeBadge = `<span class="mode-pill palm" style="background: rgba(16, 185, 129, 0.15); border-color: rgba(16, 185, 129, 0.45); color: #86efac;">✋ สแกนลายมือ</span>`;
      }

      const catShort = codeObj.lockedCategory && CATEGORY_NAMES_TH[codeObj.lockedCategory]
        ? `<span class="compact-cat-pill">${CATEGORY_NAMES_TH[codeObj.lockedCategory]}</span>`
        : "";

      const orderBadge = (codeObj.fastworkOrder && codeObj.fastworkOrder !== "-")
        ? `<span class="compact-order-tag">#${codeObj.fastworkOrder}</span>`
        : "";

      // Compact status chips on single line
      const statusChipsHtml = `
        <div class="compact-status-row">
          <span class="mini-status-chip ${hasAccessed ? 'done' : 'pending'}" title="การเข้าระบบ">
            ${hasAccessed ? `👁️ เข้าแล้ว (${logs.accessCount})` : '⏳ ยังไม่เข้า'}
          </span>
          <span class="mini-status-chip ${hasDrawn ? 'done' : 'pending'}" title="${isPalmOnly ? 'สถานะการวิเคราะห์ลายมือ' : 'การสุ่มคำทำนาย'}">
            ${hasDrawn ? (isPalmOnly || (palmRes && !tarotRes && !siamsiRes) ? '✋ วิเคราะห์แล้ว' : '🎴 สุ่มแล้ว') : (isPalmOnly ? '⚪ รอวิเคราะห์ลายมือ' : '⚪ รอสุ่ม')}
          </span>
          ${hasShared ? `<span class="mini-status-chip done">📤 แชร์ (${logs.shareCount})</span>` : ""}
          ${hasPdf ? `<span class="mini-status-chip done">📄 PDF (${logs.pdfDownloadCount})</span>` : ""}
          <span class="mini-time-chip ${isExpired ? 'expired' : 'active'}">${remainText}</span>
        </div>
      `;

      // Quick PDF buttons on the main line if drawn
      let quickPdfBtns = "";
      if (tarotRes) {
        quickPdfBtns += `
          <button type="button" class="btn-row-act btn-pdf-highlight" data-act="download-pdf-tarot" title="ดาวน์โหลด PDF ไพ่ทาโรต์">
            📄 PDF ทาโรต์
          </button>
        `;
      }
      if (siamsiRes) {
        quickPdfBtns += `
          <button type="button" class="btn-row-act btn-pdf-highlight" data-act="download-pdf-siamsi" title="ดาวน์โหลด PDF เซียมซี">
            📄 PDF เซียมซี
          </button>
        `;
      }
      if (palmRes) {
        quickPdfBtns += `
          <button type="button" class="btn-row-act btn-pdf-highlight" data-act="download-pdf-palm" title="ดาวน์โหลด PDF วิเคราะห์ลายมือ">
            📄 PDF ลายมือ
          </button>
        `;
      }

      // Detailed drawer content (hidden by default inside <details>)
      const resultBlocks = [];
      if (tarotRes) {
        const cardsInline = (tarotRes.cards || []).map((card, idx) =>
          `${idx + 1}. ${card.name_th} ${card.isReversed ? '(กลับหัว)' : '(ตั้งตรง)'}`
        ).join(" • ");
        resultBlocks.push(`<div><strong style="color:var(--gold-primary);">🔮 ไพ่ทาโรต์ (${tarotRes.categoryName || tarotRes.category}):</strong> ${cardsInline}</div>`);
      }
      if (siamsiRes) {
        resultBlocks.push(`<div><strong style="color:var(--gold-primary);">🎋 เซียมซีเบอร์ ${siamsiRes.signNumber}:</strong> ${siamsiRes.signTitle || ""} (${siamsiRes.fortuneLevel || ""})</div>`);
      }
      if (palmRes) {
        const palmSum = palmRes.summary || (palmRes.reading && palmRes.reading.summaryVerdict) || "วิเคราะห์ลายมือครบ 2 มือแล้ว";
        resultBlocks.push(`<div><strong style="color:#86efac;">✋ วิเคราะห์ลายมือ (2 มือ):</strong> ${palmSum}</div>`);
      }
      const hiddenResultHtml = resultBlocks.length > 0
        ? resultBlocks.join("")
        : `<div style="color:var(--text-muted);">⏳ รอลูกค้าเข้ามากดสุ่มคำทำนายด้วยตนเอง</div>`;

      tr.innerHTML = `
        <td class="compact-td-code">
          <div class="compact-code-cell">
            <span class="code-badge-main">${codeObj.code}</span>
            ${orderBadge}
          </div>
        </td>
        <td class="compact-td-mode">
          <div class="compact-mode-cell">
            ${modeBadge}
            ${catShort}
          </div>
        </td>
        <td class="compact-td-status">
          ${statusChipsHtml}
        </td>
        <td class="compact-td-actions">
          <div class="compact-actions-bar">
            <button type="button" class="btn-row-act" data-act="copy-msg" title="คัดลอกข้อความ+ลิงก์ส่งลูกค้า">
              📋 คัดลอก
            </button>
            <button type="button" class="btn-row-act" data-act="open-link" title="เปิดลิงก์หน้าลูกค้า">
              🚀 เปิด
            </button>
            ${quickPdfBtns}
            <button type="button" class="btn-row-act" data-act="reset-draw" title="${isPalmOnly ? 'รีเซ็ตสิทธิ์วิเคราะห์ลายมือใหม่' : 'รีเซ็ตสิทธิ์สุ่มใหม่'}">
              🔄 รีเซ็ต
            </button>
            <button type="button" class="btn-row-act btn-danger" data-act="delete" title="ลบโค้ดนี้">
              🗑️
            </button>
            <details class="code-inline-details">
              <summary class="btn-row-act btn-details-toggle">รายละเอียด</summary>
              <div class="code-details-drawer">
                <div class="drawer-reading-summary">${hiddenResultHtml}</div>
                <div class="drawer-timestamps">
                  <span>สร้าง: ${this.formatDateTime(codeObj.createdAt)}</span>
                  <span>• หมดอายุ: ${this.formatDateTime(codeObj.expiresAt)}</span>
                  ${logs.lastAccessedAt ? `<span>• เข้าล่าสุด: ${this.formatDateTime(logs.lastAccessedAt)}</span>` : ""}
                  ${(logs.palmAnalyzedAt || logs.palmDrawnAt) ? `<span>• วิเคราะห์ลายมือเมื่อ: ${this.formatDateTime(logs.palmAnalyzedAt || logs.palmDrawnAt)}</span>` : ""}
                  ${(logs.drawnAt && !isPalmOnly) ? `<span>• สุ่มเมื่อ: ${this.formatDateTime(logs.drawnAt)}</span>` : ""}
                </div>
                <div class="drawer-extra-actions">
                  ${tarotRes ? `<button type="button" class="btn-row-act" data-act="download-info-tarot">🖼️ รูป Info ทาโรต์</button>` : ""}
                  ${siamsiRes ? `<button type="button" class="btn-row-act" data-act="download-info-siamsi">🖼️ รูป Info เซียมซี</button>` : ""}
                  ${palmRes ? `<button type="button" class="btn-row-act" data-act="download-info-palm">🖼️ รูป Info ลายมือ</button>` : ""}
                  ${hasDrawn ? `<button type="button" class="btn-row-act" data-act="copy-reading">💬 ก๊อบปี้คำทำนายเต็ม</button>` : ""}
                  <button type="button" class="btn-row-act" data-act="view-logs">📜 ประวัติ Log เต็ม</button>
                  <button type="button" class="btn-row-act" data-act="extend-1d">⏳ ต่ออายุ +1 วัน</button>
                </div>
              </div>
            </details>
          </div>
        </td>
      `;

      // Bind row action buttons
      tr.querySelectorAll("[data-act]").forEach(btn => {
        btn.addEventListener("click", () => {
          const act = btn.getAttribute("data-act");
          this.handleRowAction(act, codeObj);
        });
      });

      this.codesTbody.appendChild(tr);
    });
  }

  async handleRowAction(act, codeObj) {
    if (act === "copy-msg") {
      const msg = this.buildFastworkCustomerMessage(codeObj);
      await navigator.clipboard.writeText(msg);
      this.showToast(`📋 คัดลอกข้อความและโค้ด ${codeObj.code} สำหรับส่งลูกค้าแล้ว!`);
      return;
    }

    if (act === "open-link") {
      const url = this.buildCustomerDirectUrl(codeObj.code);
      window.open(url, "_blank");
      return;
    }

    const tarotRes = codeObj.tarotResult || (codeObj.readingResult && codeObj.readingResult.mode === "tarot" ? codeObj.readingResult : null);
    const siamsiRes = codeObj.siamsiResult || (codeObj.readingResult && codeObj.readingResult.mode === "siamsi" ? codeObj.readingResult : null);
    const palmRes = codeObj.palmResult || (codeObj.readingResult && codeObj.readingResult.mode === "palm" ? codeObj.readingResult : null);

    if (act === "download-pdf-tarot" && tarotRes) {
      this.showToast(`⏳ กำลังสร้างไฟล์ PDF ไพ่ทาโรต์สำหรับโค้ด ${codeObj.code}...`);
      const ok = await window.shareAndPdfEngine.downloadReadingPdfFile(
        tarotRes,
        `SiamSiTarot_Tarot_${codeObj.code}.pdf`
      );
      if (ok) {
        await window.codeManager.recordActionLog(codeObj.code, "pdf", "แอดมินดาวน์โหลดไฟล์ PDF ไพ่ทาโรต์เพื่อส่งให้ลูกค้า");
        await this.refreshData(true);
        this.showToast(`📄 ดาวน์โหลดไฟล์ PDF ไพ่ทาโรต์ของโค้ด ${codeObj.code} เรียบร้อยแล้ว!`);
      }
      return;
    }

    if (act === "download-pdf-siamsi" && siamsiRes) {
      this.showToast(`⏳ กำลังสร้างไฟล์ PDF เซียมซีสำหรับโค้ด ${codeObj.code}...`);
      const ok = await window.shareAndPdfEngine.downloadReadingPdfFile(
        siamsiRes,
        `SiamSiTarot_Siamsi_${codeObj.code}.pdf`
      );
      if (ok) {
        await window.codeManager.recordActionLog(codeObj.code, "pdf", "แอดมินดาวน์โหลดไฟล์ PDF เซียมซีเพื่อส่งให้ลูกค้า");
        await this.refreshData(true);
        this.showToast(`📄 ดาวน์โหลดไฟล์ PDF เซียมซีของโค้ด ${codeObj.code} เรียบร้อยแล้ว!`);
      }
      return;
    }

    if (act === "download-pdf-palm" && palmRes) {
      this.showToast(`⏳ กำลังสร้างไฟล์ PDF วิเคราะห์ลายมือสำหรับโค้ด ${codeObj.code}...`);
      const palmPayload = this._buildAdminPalmPayload(codeObj, palmRes);
      const ok = await window.shareAndPdfEngine.downloadReadingPdfFile(
        palmPayload,
        `SiamSiTarot_Palm_${codeObj.code}.pdf`
      );
      if (ok) {
        await window.codeManager.recordActionLog(codeObj.code, "pdf", "แอดมินดาวน์โหลดไฟล์ PDF วิเคราะห์ลายมือเพื่อส่งให้ลูกค้า");
        await this.refreshData(true);
        this.showToast(`📄 ดาวน์โหลดไฟล์ PDF ลายมือของโค้ด ${codeObj.code} เรียบร้อยแล้ว!`);
      }
      return;
    }

    if (act === "download-info-tarot" && tarotRes) {
      this.showToast(`⏳ กำลังสร้างรูป Info Card ไพ่ทาโรต์...`);
      await window.shareAndPdfEngine.downloadInfoImageFile(tarotRes);
      this.showToast(`🖼️ ดาวน์โหลดรูป Info Card ไพ่ทาโรต์ของโค้ด ${codeObj.code} เรียบร้อยแล้ว!`);
      return;
    }

    if (act === "download-info-siamsi" && siamsiRes) {
      this.showToast(`⏳ กำลังสร้างรูป Info Card เซียมซี...`);
      await window.shareAndPdfEngine.downloadInfoImageFile(siamsiRes);
      this.showToast(`🖼️ ดาวน์โหลดรูป Info Card เซียมซีของโค้ด ${codeObj.code} เรียบร้อยแล้ว!`);
      return;
    }

    if (act === "download-info-palm" && palmRes) {
      this.showToast(`⏳ กำลังสร้างรูป Info Card วิเคราะห์ลายมือ...`);
      await window.shareAndPdfEngine.downloadInfoImageFile(this._buildAdminPalmPayload(codeObj, palmRes));
      this.showToast(`🖼️ ดาวน์โหลดรูป Info Card ลายมือของโค้ด ${codeObj.code} เรียบร้อยแล้ว!`);
      return;
    }

    if (act === "copy-reading") {
      const blocks = [];
      if (tarotRes) blocks.push(window.shareAndPdfEngine.buildFullSocialCaption(tarotRes));
      if (siamsiRes) blocks.push(window.shareAndPdfEngine.buildFullSocialCaption(siamsiRes));
      if (palmRes) blocks.push(window.shareAndPdfEngine.buildFullSocialCaption(this._buildAdminPalmPayload(codeObj, palmRes)));
      if (blocks.length === 0) return;
      await navigator.clipboard.writeText(blocks.join("\n\n==============================\n\n"));
      this.showToast(`💬 คัดลอกคำทำนายฉบับเต็มของโค้ด ${codeObj.code} แล้ว! นำไปวางส่งลูกค้าได้เลย`);
      return;
    }

    if (act === "view-logs") {
      this.openCodeDetailModal(codeObj);
      return;
    }

    if (act === "reset-draw") {
      await window.codeManager.updateCodeAdmin(codeObj.code, "reset_draw");
      await this.refreshData();
      const resetHint = codeObj.mode === "palm" ? "วิเคราะห์ลายมือใหม่ได้ 1 ครั้ง" : "สุ่มใหม่ได้ 1 ครั้ง";
      this.showToast(`🔄 รีเซ็ตสิทธิ์โค้ด ${codeObj.code} เรียบร้อย (${resetHint})`);
      return;
    }

    if (act === "extend-1d") {
      await window.codeManager.updateCodeAdmin(codeObj.code, "extend_1day");
      await this.refreshData();
      this.showToast(`⏳ ต่ออายุโค้ด ${codeObj.code} เพิ่มอีก 24 ชั่วโมงแล้ว`);
      return;
    }

    if (act === "delete") {
      if (!confirm(`ยืนยันการลบรหัสโค้ด ${codeObj.code} ?`)) return;
      await window.codeManager.deleteCode(codeObj.code);
      await this.refreshData();
      this.showToast(`🗑️ ลบรหัสโค้ด ${codeObj.code} เรียบร้อยแล้ว`);
    }
  }

  /**
   * สุ่มไพ่ทาโรต์ 3 ใบ หรือเสี่ยงเซียมซีให้ลูกค้าทันทีจากหน้าแอดมิน (กรณีลูกค้าให้หมอดูสุ่มแล้วส่ง PDF ให้)
   */
  async manualDrawForCustomer(codeObj) {
    const nowStr = new Date().toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric" });

    if (codeObj.mode === "siamsi") {
      const isTanjai = codeObj.lockedCategory === "tanjai";
      const data = isTanjai && window.SIAMSI_TANJAI_DATA ? window.SIAMSI_TANJAI_DATA : window.SIAMSI_DATA;
      const sign = data[Math.floor(Math.random() * data.length)];

      const aspectLabels = {
        career: "💼 อาชีพการงาน",
        wealth: "💰 โชคลาภการเงิน",
        love: "❤️ ความรักคู่ครอง",
        health: "🌿 สุขภาพพลานามัย",
        study: "🎓 การเรียนการสอบ",
        home: "🏡 ครอบครัวเคหสถาน",
        general: "🔮 ภาพรวมดวงชะตา"
      };
      const aspectsSummary = [];
      if (sign.aspects) {
        Object.keys(aspectLabels).forEach(k => {
          if (sign.aspects[k]) {
            aspectsSummary.push({
              key: k,
              label: aspectLabels[k],
              text: sign.aspects[k].summary || "",
              detail: sign.aspects[k].detail || sign.aspects[k].summary || ""
            });
          }
        });
      }

      const payload = {
        mode: "siamsi",
        code: codeObj.code,
        customerName: "",
        deck: isTanjai ? "tanjai" : "wongtaisin",
        deckName: isTanjai ? "เซียมซีหลวงพ่อทันใจ" : "เซียมซีหว่องไทซิน",
        signNumber: sign.number,
        stickNum: sign.stick_num || sign.id,
        signTitle: sign.thai_title || "",
        chineseTitle: sign.chinese_title || "",
        fortuneLevel: sign.fortune_level || "",
        oneLine: sign.one_line_summary || "",
        poemLines: sign.poem_th || [],
        aspectsSummary,
        timestamp: Date.now()
      };

      await window.codeManager.recordReadingDraw(codeObj.code, payload);
      await this.refreshData();
      this.showToast(`🎋 สุ่มเซียมซีรหัส ${codeObj.code} เรียบร้อย (ได้เบอร์ ${sign.number})! กดโหลด PDF ส่งลูกค้าได้เลย`);
      return;
    }

    // สุ่มไพ่ทาโรต์ 3 ใบ
    const cat = (codeObj.lockedCategory && ["love", "career", "finance", "health"].includes(codeObj.lockedCategory))
      ? codeObj.lockedCategory
      : "love";
    const catName = CATEGORY_NAMES_TH[cat] || "ความรัก";

    const posMap = {
      love: [
        "ใบที่ 1: เขา — ความรู้สึกและมุมมองของอีกฝ่าย",
        "ใบที่ 2: คุณ — สถานะหัวใจและพลังงานของคุณ",
        "ใบที่ 3: ความสัมพันธ์ — แนวโน้มและบทสรุปความรัก"
      ],
      career: [
        "ใบที่ 1: รากฐาน — ที่มาและผลงานที่ผ่านมา",
        "ใบที่ 2: ปัจจุบัน — สถานการณ์การงานที่กำลังเผชิญ",
        "ใบที่ 3: อนาคต — โอกาสความก้าวหน้าและผลลัพธ์"
      ],
      finance: [
        "ใบที่ 1: พื้นฐานการเงิน — พฤติกรรมและที่มาของรายได้",
        "ใบที่ 2: กระแสเงินปัจจุบัน — สภาพคล่องและภาระ",
        "ใบที่ 3: แนวโน้มการเงิน — โชคลาภและผลตอบแทนข้างหน้า"
      ],
      health: [
        "ใบที่ 1: พื้นฐานสุขภาพ — พฤติกรรมสะสมที่ผ่านมา",
        "ใบที่ 2: สภาวะปัจจุบัน — พลังงานร่างกายและจิตใจตอนนี้",
        "ใบที่ 3: แนวโน้มการฟื้นฟู — ทิศทางสุขภาพในอนาคต"
      ]
    };

    const shuffled = [...TAROT_CARDS].sort(() => Math.random() - 0.5).slice(0, 3);
    const payloadCards = shuffled.map((card, idx) => {
      const isReversed = Math.random() < 0.25;
      const aspect = isReversed ? card.reversed : card.upright;
      let domainMeaning = "";
      let shortMeaning = "";
      if (cat === "love") {
        const base = aspect.love.th || "";
        const single = (aspect.love.single && aspect.love.single.th) ? `คนโสด: ${aspect.love.single.th}` : "";
        const couple = (aspect.love.couple && aspect.love.couple.th) ? `คนมีคู่: ${aspect.love.couple.th}` : "";
        domainMeaning = [base, single, couple].filter(Boolean).join(" | ");
        shortMeaning = base;
      } else {
        domainMeaning = aspect[cat] ? aspect[cat].th : aspect.career.th;
        shortMeaning = domainMeaning;
      }

      return {
        id: card.id,
        name_th: card.name_th,
        name_en: card.name_en,
        image: card.image,
        isReversed,
        positionTitle: posMap[cat][idx],
        domainMeaning,
        shortMeaning,
        advice: aspect.advice.th
      };
    });

    const cNames = payloadCards.map(c => c.name_th).join(" ➔ ");
    const payload = {
      mode: "tarot",
      code: codeObj.code,
      customerName: "",
      category: cat,
      categoryName: catName,
      timestamp: Date.now(),
      dateText: nowStr,
      cards: payloadCards,
      verdictBadge: "🌟 พลังงานดวงชะตาเปิดกว้างและเกื้อหนุน",
      verdictPlain: `จากหน้าไพ่ทั้ง 3 ใบ (${cNames}) ในหมวด${catName} สะท้อนถึงจังหวะการเปลี่ยนแปลงที่ชัดเจน หากตั้งสติและนำคำแนะนำของไพ่แต่ละใบไปปรับใช้ จะช่วยให้ตัดสินใจได้อย่างแม่นยำและเกิดผลลัพธ์ที่ดีที่สุด`,
      doAction: "เปิดใจรับโอกาสใหม่ วางแผนเป็นขั้นตอน และทำตามคำแนะนำของไพ่ทั้ง 3 ใบ",
      dontAction: "อย่าตัดสินใจด้วยความใจร้อนวู่วาม หรือปล่อยให้ความกังวลบดบังสติปัญญา"
    };

    await window.codeManager.recordReadingDraw(codeObj.code, payload);
    await this.refreshData();
    this.showToast(`🎴 สุ่มไพ่ทาโรต์ 3 ใบรหัส ${codeObj.code} เรียบร้อยแล้ว! กดปุ่ม "โหลด PDF" เพื่อส่งให้ลูกค้าได้เลย`);
  }

  _buildAdminPalmPayload(codeObj, palmRes) {
    const r = (palmRes && palmRes.reading) || palmRes || {};
    return {
      mode: "palm",
      hand: palmRes.hand || r.hand || "both",
      code: (codeObj && codeObj.code) || "",
      confidence: palmRes.confidence || r.avgConfidence || 92,
      summaryVerdict: palmRes.summary || r.summaryVerdict || "วิเคราะห์ลายมือครบ 2 มือสำเร็จ",
      aspects: palmRes.aspects || r.aspects || {},
      leftHudDataUrl: palmRes.leftHudThumbDataUrl || palmRes.leftHudDataUrl || "",
      rightHudDataUrl: palmRes.rightHudThumbDataUrl || palmRes.rightHudDataUrl || "",
      timestamp: (codeObj && codeObj.logs && (codeObj.logs.palmAnalyzedAt || codeObj.logs.palmDrawnAt)) || Date.now()
    };
  }

  openCodeDetailModal(codeObj) {
    if (!this.detailModal || !this.detailModalBody) return;
    const eventsHtml = (codeObj.events || []).map(ev => `
      <div style="padding: 0.55rem 0.75rem; border-bottom: 1px solid rgba(255,255,255,0.08); display:flex; justify-content:space-between; gap:1rem; font-size:0.84rem;">
        <span>• ${ev.detail}</span>
        <span style="color:var(--text-muted); white-space:nowrap;">${this.formatDateTime(ev.time)}</span>
      </div>
    `).join("") || `<div style="padding:1rem; color:var(--text-muted);">ยังไม่มีประวัติการใช้งาน</div>`;

    const tarotRes = codeObj.tarotResult || (codeObj.readingResult && codeObj.readingResult.mode === "tarot" ? codeObj.readingResult : null);
    const siamsiRes = codeObj.siamsiResult || (codeObj.readingResult && codeObj.readingResult.mode === "siamsi" ? codeObj.readingResult : null);
    const palmRes = codeObj.palmResult || (codeObj.readingResult && codeObj.readingResult.mode === "palm" ? codeObj.readingResult : null);
    const blocks = [];
    if (tarotRes) blocks.push(window.shareAndPdfEngine.buildFullSocialCaption(tarotRes));
    if (siamsiRes) blocks.push(window.shareAndPdfEngine.buildFullSocialCaption(siamsiRes));
    if (palmRes) blocks.push(window.shareAndPdfEngine.buildFullSocialCaption(this._buildAdminPalmPayload(codeObj, palmRes)));
    const fullReadingText = blocks.length > 0
      ? blocks.join("\n\n==============================\n\n")
      : (codeObj.mode === "palm" ? "ลูกค้ายังไม่ได้วิเคราะห์ลายมือ" : "ลูกค้ายังไม่ได้กดสุ่มคำทำนาย");

    const modeMap = {
      tarot: "แพ็กเกจ 1: ดูดวงไพ่ทาโรต์ 3 ใบ",
      siamsi: "แพ็กเกจ 2: เสี่ยงเซียมซี",
      combo: "แพ็กเกจ 3: ดูดวง + เสี่ยงเซียมซี + วิเคราะห์ลายมือ (อย่างละ 1 ครั้ง)",
      palm: "แพ็กเกจ 4: วิเคราะห์ลายมือ (2 มือ)"
    };

    this.detailModalBody.innerHTML = `
      <h3 style="color:var(--gold-primary); margin-bottom:0.4rem;">🔑 รายละเอียดโค้ด ${codeObj.code}</h3>
      <p style="font-size:0.86rem; color:var(--text-muted); margin-bottom:1.2rem;">
        ออเดอร์: ${codeObj.fastworkOrder || "-"} • ${modeMap[codeObj.mode] || "ดูดวง"}
      </p>

      <h4 style="color:#fde68a; font-size:0.95rem; margin-bottom:0.5rem;">📜 ประวัติ Log การใช้งาน (Activity Timeline)</h4>
      <div style="background:rgba(8,3,18,0.85); border:1px solid rgba(245,197,66,0.3); border-radius:8px; max-height:200px; overflow-y:auto; margin-bottom:1.2rem;">
        ${eventsHtml}
      </div>

      <h4 style="color:#fde68a; font-size:0.95rem; margin-bottom:0.5rem;">🔮 คำทำนายฉบับเต็มของรหัสนี้</h4>
      <textarea style="width:100%; min-height:220px; background:rgba(8,3,18,0.9); border:1px solid rgba(245,197,66,0.35); border-radius:8px; padding:0.8rem; color:#fff; font-family:var(--font-thai); font-size:0.85rem; line-height:1.55;" readonly>${fullReadingText}</textarea>
    `;

    this.detailModal.classList.add("active");
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
}

window.addEventListener("DOMContentLoaded", () => {
  window.adminBackoffice = new AdminBackoffice();
});
