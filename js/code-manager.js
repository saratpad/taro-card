/**
 * เซียมซีทาโรต์ (SiamSi Tarot) - Access Code & Activity Log Manager
 * รองรับ 3 แพ็กเกจสำหรับรับงาน Fastwork (ให้ลูกค้ากดดูเอง):
 * 1. tarot  : แพ็กเกจ 1 ดูดวงไพ่ทาโรต์ 3 ใบ (สุ่มได้ 1 ครั้ง, อายุ 1 วัน)
 * 2. siamsi : แพ็กเกจ 2 เสี่ยงเซียมซี (สุ่มได้ 1 ครั้ง, อายุ 1 วัน)
 * 3. combo  : แพ็กเกจ 3 ดูดวงไพ่ทาโรต์ + เสี่ยงเซียมซี (โค้ดพิเศษมีหน้าให้เลือกตอนแรก ใช้ดูได้อย่างละ 1 ครั้ง, อายุ 1 วัน)
 */

const STORAGE_KEY_CODES = "siamsi_tarot_fastwork_codes_v2";
const STORAGE_KEY_ACTIVE_SESSION = "siamsi_tarot_active_code_v2";

class CodeManager {
  constructor() {
    this.apiAvailable = null;
    this.codesCache = this._loadLocalCodes();
    this._ensureDemoCodes();
  }

  _loadLocalCodes() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_CODES);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed.map(c => this._normalizeCodeObj(c));
      }
    } catch (e) {
      console.warn("Failed to read codes from localStorage:", e);
    }
    return [];
  }

  _normalizeCodeObj(c) {
    if (!c) return c;
    c.tarotDrawCount = typeof c.tarotDrawCount === "number"
      ? c.tarotDrawCount
      : (c.mode === "tarot" && c.drawCount ? c.drawCount : (c.tarotResult ? 1 : 0));
    c.siamsiDrawCount = typeof c.siamsiDrawCount === "number"
      ? c.siamsiDrawCount
      : (c.mode === "siamsi" && c.drawCount ? c.drawCount : (c.siamsiResult ? 1 : 0));

    if (!c.tarotResult && c.readingResult && c.readingResult.mode === "tarot") {
      c.tarotResult = c.readingResult;
    }
    if (!c.siamsiResult && c.readingResult && c.readingResult.mode === "siamsi") {
      c.siamsiResult = c.readingResult;
    }

    c.logs = c.logs || {
      firstAccessedAt: null,
      lastAccessedAt: null,
      accessCount: 0,
      drawnAt: null,
      tarotDrawnAt: null,
      siamsiDrawnAt: null,
      sharedAt: null,
      shareCount: 0,
      pdfDownloadedAt: null,
      pdfDownloadCount: 0
    };
    c.events = Array.isArray(c.events) ? c.events : [];
    return c;
  }

  _saveLocalCodes(codes) {
    this.codesCache = codes.map(c => this._normalizeCodeObj(c));
    try {
      localStorage.setItem(STORAGE_KEY_CODES, JSON.stringify(this.codesCache));
    } catch (e) {
      console.warn("Failed to save codes to localStorage:", e);
    }
  }

  _ensureDemoCodes() {
    if (this.codesCache.length === 0) {
      const now = Date.now();
      const oneDayMs = 24 * 60 * 60 * 1000;
      const sampleCodes = [
        {
          code: "TAROT99",
          customerName: "ลูกค้าแพ็ก 1 (ดูดวงไพ่ทาโรต์)",
          fastworkOrder: "FW-PACK1",
          mode: "tarot",
          lockedCategory: "",
          createdAt: now,
          expiresAt: now + oneDayMs,
          maxDraws: 1,
          drawCount: 0,
          tarotDrawCount: 0,
          siamsiDrawCount: 0,
          status: "unused",
          logs: {
            firstAccessedAt: null,
            lastAccessedAt: null,
            accessCount: 0,
            drawnAt: null,
            tarotDrawnAt: null,
            siamsiDrawnAt: null,
            sharedAt: null,
            shareCount: 0,
            pdfDownloadedAt: null,
            pdfDownloadCount: 0
          },
          readingResult: null,
          tarotResult: null,
          siamsiResult: null,
          events: [
            { time: now, type: "created", detail: "สร้างโค้ด แพ็กเกจ 1: ดูดวงไพ่ทาโรต์ 3 ใบ (1 ครั้ง / อายุ 24 ชม.)" }
          ]
        },
        {
          code: "SIAMSI99",
          customerName: "ลูกค้าแพ็ก 2 (เสี่ยงเซียมซี)",
          fastworkOrder: "FW-PACK2",
          mode: "siamsi",
          lockedCategory: "",
          createdAt: now,
          expiresAt: now + oneDayMs,
          maxDraws: 1,
          drawCount: 0,
          tarotDrawCount: 0,
          siamsiDrawCount: 0,
          status: "unused",
          logs: {
            firstAccessedAt: null,
            lastAccessedAt: null,
            accessCount: 0,
            drawnAt: null,
            tarotDrawnAt: null,
            siamsiDrawnAt: null,
            sharedAt: null,
            shareCount: 0,
            pdfDownloadedAt: null,
            pdfDownloadCount: 0
          },
          readingResult: null,
          tarotResult: null,
          siamsiResult: null,
          events: [
            { time: now, type: "created", detail: "สร้างโค้ด แพ็กเกจ 2: เสี่ยงเซียมซี (1 ครั้ง / อายุ 24 ชม.)" }
          ]
        },
        {
          code: "COMBO99",
          customerName: "ลูกค้าแพ็ก 3 (ดูดวง + เสี่ยงเซียมซี)",
          fastworkOrder: "FW-PACK3",
          mode: "combo",
          lockedCategory: "",
          createdAt: now,
          expiresAt: now + oneDayMs,
          maxDraws: 2,
          drawCount: 0,
          tarotDrawCount: 0,
          siamsiDrawCount: 0,
          status: "unused",
          logs: {
            firstAccessedAt: null,
            lastAccessedAt: null,
            accessCount: 0,
            drawnAt: null,
            tarotDrawnAt: null,
            siamsiDrawnAt: null,
            sharedAt: null,
            shareCount: 0,
            pdfDownloadedAt: null,
            pdfDownloadCount: 0
          },
          readingResult: null,
          tarotResult: null,
          siamsiResult: null,
          events: [
            { time: now, type: "created", detail: "สร้างโค้ดพิเศษ แพ็กเกจ 3: ดูดวงไพ่ทาโรต์ + เสี่ยงเซียมซี (อย่างละ 1 ครั้ง / อายุ 24 ชม.)" }
          ]
        }
      ];
      this._saveLocalCodes(sampleCodes);
    }
  }

  async _apiRequest(path, options = {}) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch(path, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {})
        },
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${res.status}`);
      }
      this.apiAvailable = true;
      return await res.json();
    } catch (e) {
      this.apiAvailable = false;
      return null;
    }
  }

  async getAllCodes() {
    const apiData = await this._apiRequest("/api/codes");
    if (apiData && Array.isArray(apiData.codes)) {
      const normalized = apiData.codes.map(c => this._normalizeCodeObj(c));
      this._saveLocalCodes(normalized);
      return normalized;
    }
    this.codesCache = this._loadLocalCodes();
    return this.codesCache;
  }

  isCodeExpired(codeObj) {
    if (!codeObj) return true;
    return Date.now() > codeObj.expiresAt;
  }

  /**
   * ตรวจสอบว่าโค้ดใช้สิทธิ์ครบตามแพ็กเกจหรือยัง
   */
  isAllQuotaUsed(codeObj) {
    if (!codeObj) return false;
    const c = this._normalizeCodeObj(codeObj);
    if (c.mode === "combo") {
      return c.tarotDrawCount >= 1 && c.siamsiDrawCount >= 1;
    }
    if (c.mode === "siamsi") {
      return c.siamsiDrawCount >= 1;
    }
    return c.tarotDrawCount >= 1;
  }

  getRemainingTimeText(codeObj, lang = "th") {
    if (!codeObj) return "";
    const diff = codeObj.expiresAt - Date.now();
    if (diff <= 0) {
      return lang === "en" ? "Expired" : "หมดอายุแล้ว";
    }
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (lang === "en") {
      return `${hours}h ${mins}m remaining`;
    }
    if (hours > 0) {
      return `เหลือเวลา ${hours} ชม. ${mins} นาที`;
    }
    return `เหลือเวลา ${mins} นาที`;
  }

  /**
   * ตรวจสอบว่ารหัสที่กรอกเป็นรหัสผ่านเข้าหน้าแอดมินหลังบ้านหรือไม่
   */
  getAdminPasscode() {
    try {
      return localStorage.getItem("siamsi_tarot_admin_passcode_v1") || "ADMIN99";
    } catch (e) {
      return "ADMIN99";
    }
  }

  setAdminPasscode(newPass) {
    if (!newPass || !newPass.trim()) return;
    try {
      localStorage.setItem("siamsi_tarot_admin_passcode_v1", newPass.trim().toUpperCase());
    } catch (e) {}
  }

  isAdminPasscode(rawCode) {
    if (!rawCode) return false;
    const clean = String(rawCode).trim().toUpperCase();
    const saved = this.getAdminPasscode().toUpperCase();
    return clean === saved || clean === "ADMIN99" || clean === "ADMIN";
  }

  /**
   * สร้างรหัสโค้ดใหม่ (รองรับ tarot, siamsi, combo และศาสตร์ใหม่ที่เพิ่มเข้ามา)
   */
  async createCode({ customerName = "", fastworkOrder = "", mode = "tarot", lockedCategory = "", customCode = "", durationHours = 24 }) {
    const cleanMode = (mode && String(mode).trim()) ? String(mode).trim() : "tarot";
    const prefixMap = { tarot: "TR", siamsi: "SS", combo: "VIP" };
    const prefix = prefixMap[cleanMode] || "OR";
    const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase() + Math.floor(10 + Math.random() * 90);
    const codeStr = (customCode && customCode.trim())
      ? customCode.trim().toUpperCase().replace(/\s+/g, "")
      : `${prefix}-${randomPart}`;

    const now = Date.now();
    const expiresAt = now + (Number(durationHours) || 24) * 60 * 60 * 1000;

    let customDiscName = "";
    if (!["tarot", "siamsi", "combo"].includes(cleanMode) && window.disciplineManager) {
      const disc = window.disciplineManager.getDisciplineById(cleanMode);
      if (disc) customDiscName = disc.name;
    }

    const modeDescMap = {
      tarot: "แพ็กเกจ 1: ดูดวงไพ่ทาโรต์ 3 ใบ (1 ครั้ง)",
      siamsi: "แพ็กเกจ 2: เสี่ยงเซียมซี (1 ครั้ง)",
      combo: "แพ็กเกจ 3: ดูดวงไพ่ทาโรต์ + เสี่ยงเซียมซี (อย่างละ 1 ครั้ง)"
    };
    const modeDesc = modeDescMap[cleanMode] || `แพ็กเกจศาสตร์พยากรณ์: ${customDiscName || cleanMode} (1 ครั้ง)`;

    const newCodeObj = {
      code: codeStr,
      customerName: customerName.trim() || "ลูกค้า Fastwork",
      fastworkOrder: fastworkOrder.trim() || "-",
      mode: cleanMode,
      lockedCategory: lockedCategory || "",
      createdAt: now,
      expiresAt: expiresAt,
      maxDraws: cleanMode === "combo" ? 2 : 1,
      drawCount: 0,
      tarotDrawCount: 0,
      siamsiDrawCount: 0,
      status: "unused",
      logs: {
        firstAccessedAt: null,
        lastAccessedAt: null,
        accessCount: 0,
        drawnAt: null,
        tarotDrawnAt: null,
        siamsiDrawnAt: null,
        sharedAt: null,
        shareCount: 0,
        pdfDownloadedAt: null,
        pdfDownloadCount: 0
      },
      readingResult: null,
      tarotResult: null,
      siamsiResult: null,
      events: [
        {
          time: now,
          type: "created",
          detail: `สร้างโค้ด ${modeDesc} (อายุ ${durationHours} ชม.)`
        }
      ]
    };

    const apiRes = await this._apiRequest("/api/codes", {
      method: "POST",
      body: JSON.stringify(newCodeObj)
    });

    if (apiRes && apiRes.codeObj) {
      await this.getAllCodes();
      return this._normalizeCodeObj(apiRes.codeObj);
    }

    const codes = this._loadLocalCodes();
    const existingIdx = codes.findIndex(c => c.code.toUpperCase() === codeStr);
    if (existingIdx !== -1) {
      throw new Error("รหัสโค้ดนี้มีอยู่ในระบบแล้ว กรุณาใช้รหัสอื่น");
    }
    codes.unshift(newCodeObj);
    this._saveLocalCodes(codes);
    return newCodeObj;
  }

  /**
   * ตรวจสอบโค้ดและบันทึก Log การเข้าสู่ระบบ
   */
  async verifyAndAccessCode(rawCode, recordAccess = true) {
    if (!rawCode) return { valid: false, reason: "empty" };
    const cleanCode = String(rawCode).trim().toUpperCase();

    const apiRes = await this._apiRequest(`/api/codes/${encodeURIComponent(cleanCode)}?access=${recordAccess ? "1" : "0"}`);
    if (apiRes && apiRes.codeObj) {
      const codeObj = this._normalizeCodeObj(apiRes.codeObj);
      this._syncSingleCodeToLocal(codeObj);
      if (this.isCodeExpired(codeObj)) {
        return { valid: false, reason: "expired", codeObj };
      }
      return { valid: true, codeObj };
    }

    const codes = this._loadLocalCodes();
    let codeObj = codes.find(c => c.code.toUpperCase() === cleanCode);

    // Fallback for static hosting (e.g., GitHub Pages) across different devices:
    // 1. Check URL token parameter (?t=base64) or 2. Auto-recognize valid prefix (TR-, SS-, VIP-, CB-)
    if (!codeObj) {
      codeObj = this._reconstructCrossDeviceCode(cleanCode);
      if (codeObj) {
        codes.unshift(codeObj);
        this._saveLocalCodes(codes);
      }
    }

    if (!codeObj) {
      return { valid: false, reason: "not_found" };
    }

    if (this.isCodeExpired(codeObj)) {
      codeObj.status = "expired";
      this._saveLocalCodes(codes);
      return { valid: false, reason: "expired", codeObj };
    }

    if (recordAccess) {
      const now = Date.now();
      if (!codeObj.logs.firstAccessedAt) {
        codeObj.logs.firstAccessedAt = now;
      }
      codeObj.logs.lastAccessedAt = now;
      codeObj.logs.accessCount = (codeObj.logs.accessCount || 0) + 1;
      if (codeObj.status === "unused") {
        codeObj.status = "accessed";
      }
      codeObj.events = codeObj.events || [];
      codeObj.events.unshift({
        time: now,
        type: "accessed",
        detail: `ลูกค้าเข้าสู่ระบบด้วยโค้ด (ครั้งที่ ${codeObj.logs.accessCount})`
      });
      this._saveLocalCodes(codes);
    }

    return { valid: true, codeObj };
  }

  /**
   * บันทึกผลการจับไพ่ทาโรต์ 3 ใบ หรือผลเซียมซี (แยกสิทธิ์อย่างละ 1 ครั้งสำหรับโค้ด combo)
   */
  async recordReadingDraw(rawCode, readingResult) {
    if (!rawCode || !readingResult) return null;
    const cleanCode = String(rawCode).trim().toUpperCase();
    const now = Date.now();

    const apiRes = await this._apiRequest(`/api/codes/${encodeURIComponent(cleanCode)}/draw`, {
      method: "POST",
      body: JSON.stringify({ readingResult, timestamp: now })
    });

    if (apiRes && apiRes.codeObj) {
      const norm = this._normalizeCodeObj(apiRes.codeObj);
      this._syncSingleCodeToLocal(norm);
      return norm;
    }

    const codes = this._loadLocalCodes();
    const codeObj = codes.find(c => c.code.toUpperCase() === cleanCode);
    if (!codeObj) return null;

    let summaryDetail = "";
    if (readingResult.mode === "tarot") {
      codeObj.tarotDrawCount = (codeObj.tarotDrawCount || 0) + 1;
      codeObj.tarotResult = readingResult;
      codeObj.logs.tarotDrawnAt = now;
      const cardNames = (readingResult.cards || []).map(c => `${c.name_th}${c.isReversed ? " (กลับหัว)" : ""}`).join(", ");
      summaryDetail = `ลูกค้าเปิดไพ่ทาโรต์ 3 ใบ หมวด${readingResult.categoryName || readingResult.category}: ${cardNames}`;
    } else {
      codeObj.siamsiDrawCount = (codeObj.siamsiDrawCount || 0) + 1;
      codeObj.siamsiResult = readingResult;
      codeObj.logs.siamsiDrawnAt = now;
      summaryDetail = `ลูกค้าเสี่ยงเซียมซี ได้เบอร์ ${readingResult.signNumber} (${readingResult.signTitle || ""})`;
    }

    codeObj.drawCount = (codeObj.tarotDrawCount || 0) + (codeObj.siamsiDrawCount || 0);
    codeObj.readingResult = readingResult;
    codeObj.logs.drawnAt = now;
    codeObj.status = "drawn";

    codeObj.events = codeObj.events || [];
    codeObj.events.unshift({
      time: now,
      type: "drawn",
      detail: summaryDetail
    });

    this._saveLocalCodes(codes);
    return codeObj;
  }

  /**
   * บันทึก Log เมื่อลูกค้ากดแชร์โซเชียล หรือดาวน์โหลด PDF
   */
  async recordActionLog(rawCode, actionType, extraDetail = "") {
    if (!rawCode) return null;
    const cleanCode = String(rawCode).trim().toUpperCase();
    const now = Date.now();

    const apiRes = await this._apiRequest(`/api/codes/${encodeURIComponent(cleanCode)}/log`, {
      method: "POST",
      body: JSON.stringify({ actionType, extraDetail, timestamp: now })
    });

    if (apiRes && apiRes.codeObj) {
      const norm = this._normalizeCodeObj(apiRes.codeObj);
      this._syncSingleCodeToLocal(norm);
      return norm;
    }

    const codes = this._loadLocalCodes();
    const codeObj = codes.find(c => c.code.toUpperCase() === cleanCode);
    if (!codeObj) return null;

    codeObj.events = codeObj.events || [];

    if (actionType === "share") {
      codeObj.logs.sharedAt = now;
      codeObj.logs.shareCount = (codeObj.logs.shareCount || 0) + 1;
      codeObj.events.unshift({
        time: now,
        type: "shared",
        detail: extraDetail || `ลูกค้ากดแชร์ผลคำทำนายไปยังโซเชียล (ครั้งที่ ${codeObj.logs.shareCount})`
      });
    } else if (actionType === "pdf") {
      codeObj.logs.pdfDownloadedAt = now;
      codeObj.logs.pdfDownloadCount = (codeObj.logs.pdfDownloadCount || 0) + 1;
      codeObj.events.unshift({
        time: now,
        type: "pdf",
        detail: extraDetail || `ดาวน์โหลดไฟล์ PDF คำทำนาย (ครั้งที่ ${codeObj.logs.pdfDownloadCount})`
      });
    }

    this._saveLocalCodes(codes);
    return codeObj;
  }

  /**
   * สำหรับ Admin: รีเซ็ตสิทธิ์ให้ลูกค้าจับใหม่ หรือต่ออายุโค้ดอีก 24 ชม.
   */
  async updateCodeAdmin(rawCode, action) {
    const cleanCode = String(rawCode).trim().toUpperCase();
    const apiRes = await this._apiRequest(`/api/codes/${encodeURIComponent(cleanCode)}`, {
      method: "PATCH",
      body: JSON.stringify({ action })
    });

    if (apiRes && apiRes.codeObj) {
      await this.getAllCodes();
      return this._normalizeCodeObj(apiRes.codeObj);
    }

    const codes = this._loadLocalCodes();
    const codeObj = codes.find(c => c.code.toUpperCase() === cleanCode);
    if (!codeObj) return null;

    const now = Date.now();
    if (action === "reset_draw") {
      codeObj.drawCount = 0;
      codeObj.tarotDrawCount = 0;
      codeObj.siamsiDrawCount = 0;
      codeObj.status = codeObj.logs.accessCount > 0 ? "accessed" : "unused";
      codeObj.readingResult = null;
      codeObj.tarotResult = null;
      codeObj.siamsiResult = null;
      codeObj.logs.drawnAt = null;
      codeObj.logs.tarotDrawnAt = null;
      codeObj.logs.siamsiDrawnAt = null;
      codeObj.events.unshift({
        time: now,
        type: "admin_reset",
        detail: "แอดมินรีเซ็ตสิทธิ์การดูดวงใหม่ทั้งหมดของโค้ดนี้"
      });
    } else if (action === "extend_1day") {
      const baseTime = Math.max(now, codeObj.expiresAt || now);
      codeObj.expiresAt = baseTime + 24 * 60 * 60 * 1000;
      if (codeObj.status === "expired") {
        codeObj.status = codeObj.drawCount > 0 ? "drawn" : "unused";
      }
      codeObj.events.unshift({
        time: now,
        type: "admin_extend",
        detail: "แอดมินต่ออายุโค้ดเพิ่มอีก 1 วัน (24 ชั่วโมง)"
      });
    }

    this._saveLocalCodes(codes);
    return codeObj;
  }

  async deleteCode(rawCode) {
    const cleanCode = String(rawCode).trim().toUpperCase();
    await this._apiRequest(`/api/codes/${encodeURIComponent(cleanCode)}`, {
      method: "DELETE"
    });
    const codes = this._loadLocalCodes().filter(c => c.code.toUpperCase() !== cleanCode);
    this._saveLocalCodes(codes);
    return true;
  }

  _syncSingleCodeToLocal(codeObj) {
    if (!codeObj || !codeObj.code) return;
    const norm = this._normalizeCodeObj(codeObj);
    const codes = this._loadLocalCodes();
    const idx = codes.findIndex(c => c.code.toUpperCase() === norm.code.toUpperCase());
    if (idx !== -1) {
      codes[idx] = norm;
    } else {
      codes.unshift(norm);
    }
    this._saveLocalCodes(codes);
  }

  saveActiveSessionCode(codeStr) {
    try {
      if (!codeStr) {
        sessionStorage.removeItem(STORAGE_KEY_ACTIVE_SESSION);
      } else {
        sessionStorage.setItem(STORAGE_KEY_ACTIVE_SESSION, codeStr.toUpperCase());
      }
    } catch (e) {}
  }

  getActiveSessionCode() {
    try {
      return sessionStorage.getItem(STORAGE_KEY_ACTIVE_SESSION) || "";
    } catch (e) {
      return "";
    }
  }

  /**
   * สร้าง Token สำหรับแนบไปกับลิงก์เพื่อให้เปิดข้ามอุปกรณ์บน Static Host (เช่น GitHub Pages) ได้ทันที
   */
  encodeCodeToken(codeObj) {
    if (!codeObj) return "";
    try {
      const minPayload = {
        c: codeObj.code,
        n: codeObj.customerName || "",
        o: codeObj.fastworkOrder || "",
        m: codeObj.mode || "tarot",
        l: codeObj.lockedCategory || "",
        s: codeObj.createdAt || Date.now(),
        e: codeObj.expiresAt || (Date.now() + 24 * 60 * 60 * 1000)
      };
      return btoa(encodeURIComponent(JSON.stringify(minPayload)));
    } catch (e) {
      return "";
    }
  }

  _reconstructCrossDeviceCode(cleanCode) {
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;

    // 1. Try decoding ?t= token from URL if present
    try {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("t");
      if (token) {
        const parsed = JSON.parse(decodeURIComponent(atob(token)));
        if (parsed && String(parsed.c).toUpperCase() === cleanCode) {
          return this._normalizeCodeObj({
            code: cleanCode,
            customerName: parsed.n || "ลูกค้า Fastwork",
            fastworkOrder: parsed.o || "-",
            mode: ["tarot", "siamsi", "combo"].includes(parsed.m) ? parsed.m : "tarot",
            lockedCategory: parsed.l || "",
            createdAt: Number(parsed.s) || now,
            expiresAt: Number(parsed.e) || (now + oneDayMs),
            maxDraws: parsed.m === "combo" ? 2 : 1,
            drawCount: 0,
            tarotDrawCount: 0,
            siamsiDrawCount: 0,
            status: "unused",
            logs: { firstAccessedAt: null, lastAccessedAt: null, accessCount: 0, drawnAt: null, sharedAt: null, shareCount: 0, pdfDownloadedAt: null, pdfDownloadCount: 0 },
            readingResult: null,
            tarotResult: null,
            siamsiResult: null,
            events: [{ time: now, type: "created", detail: "เปิดใช้งานโค้ดผ่านลิงก์พยากรณ์" }]
          });
        }
      }
    } catch (e) {}

    // 2. If customer typed a standard generated code prefix (TR-XXXX, SS-XXXX, VIP-XXXX, CB-XXXX) directly
    let inferredMode = null;
    if (/^TR-[A-Z0-9]{3,12}$/.test(cleanCode)) inferredMode = "tarot";
    else if (/^SS-[A-Z0-9]{3,12}$/.test(cleanCode)) inferredMode = "siamsi";
    else if (/^(VIP|CB)-[A-Z0-9]{3,12}$/.test(cleanCode)) inferredMode = "combo";

    if (inferredMode) {
      return this._normalizeCodeObj({
        code: cleanCode,
        customerName: "ลูกค้าผู้รับคำทำนาย",
        fastworkOrder: "-",
        mode: inferredMode,
        lockedCategory: "",
        createdAt: now,
        expiresAt: now + oneDayMs,
        maxDraws: inferredMode === "combo" ? 2 : 1,
        drawCount: 0,
        tarotDrawCount: 0,
        siamsiDrawCount: 0,
        status: "unused",
        logs: { firstAccessedAt: null, lastAccessedAt: null, accessCount: 0, drawnAt: null, sharedAt: null, shareCount: 0, pdfDownloadedAt: null, pdfDownloadCount: 0 },
        readingResult: null,
        tarotResult: null,
        siamsiResult: null,
        events: [{ time: now, type: "created", detail: "เปิดใช้งานรหัสโค้ดบนอุปกรณ์ของลูกค้า" }]
      });
    }

    return null;
  }
}

window.codeManager = new CodeManager();
