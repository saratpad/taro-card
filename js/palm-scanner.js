/**
 * =========================================================================
 * MYSTIC WITCH PALMISTRY - PALM SCANNER & INTERPRETATION ENGINE
 * Interactive Camera Feed, Palm HUD Overlay, Laser Scan, Visual Line Tracing,
 * The Street Ratchada Knowledge Engine & Gemini AI Integration
 * =========================================================================
 */

class PalmScanner {
  constructor(app) {
    this.app = app;
    this.gender = "female"; // female | male | general
    this.handSide = "right"; // right | left
    this.seekerName = "";
    this.userQuestion = "";
    
    this.stream = null;
    this.facingMode = "environment";
    this.capturedDataUrl = null;
    this.isScanning = false;

    // Default line variations (intelligent fallback defaults)
    this.selectedLines = {
      life: "life_long_deep",
      head: "head_straight_long",
      heart: "heart_between_fingers",
      fate: "fate_from_moon",
      marriage: "marriage_single_clear"
    };

    this.initDOM();
    this.bindEvents();
    this.checkSharedPalmUrl();
  }

  get lang() {
    return this.app ? this.app.lang : (localStorage.getItem("mystic_lang") || "th");
  }

  initDOM() {
    // Mode Switcher Buttons (in Header)
    this.modeTarotBtn = document.getElementById("mode-switch-tarot");
    this.modePalmBtn = document.getElementById("mode-switch-palm");

    // Palm Screens
    this.screens = {
      intro: document.getElementById("screen-palm-intro"),
      camera: document.getElementById("screen-palm-camera"),
      analysis: document.getElementById("screen-palm-analysis"),
      results: document.getElementById("screen-palm-results")
    };

    // Intro Screen Elements
    this.palmSeekerInput = document.getElementById("palm-seeker-name");
    this.palmGenderChips = document.querySelectorAll(".palm-gender-chip");
    this.palmHandCards = document.querySelectorAll(".palm-hand-card");
    this.palmHandRuleNotice = document.getElementById("palm-hand-rule-notice");
    this.btnStartPalmScan = document.getElementById("btn-start-palm-scan");
    this.btnBackToTarot = document.getElementById("btn-back-to-tarot");

    // Camera Screen Elements
    this.videoElement = document.getElementById("palm-video-feed");
    this.cameraHudCanvas = document.getElementById("palm-hud-canvas");
    this.laserBeam = document.getElementById("palm-laser-beam");
    this.btnCapturePalm = document.getElementById("btn-capture-palm");
    this.btnSwitchCamera = document.getElementById("btn-switch-camera");
    this.fileUploadInput = document.getElementById("palm-file-upload");
    this.btnUploadFallback = document.getElementById("btn-upload-palm-photo");
    this.btnCancelCamera = document.getElementById("btn-cancel-camera");
    this.cameraStatusText = document.getElementById("camera-status-text");

    // Analysis / Refinement Screen Elements
    this.analysisCanvas = document.getElementById("palm-analysis-canvas");
    this.refinementTabs = document.getElementById("palm-refinement-tabs");
    this.btnConfirmAnalysis = document.getElementById("btn-confirm-palm-analysis");
    this.btnRetakePalm = document.getElementById("btn-retake-palm");

    // Results Screen Elements
    this.palmResultGreeting = document.getElementById("palm-result-seeker-greeting");
    this.palmRuleBanner = document.getElementById("palm-result-rule-banner");
    this.palmCanvasDisplay = document.getElementById("palm-result-canvas-display");
    this.palmSynthesisBox = document.getElementById("palm-synthesis-text");
    this.palmLinesFeed = document.getElementById("palm-lines-feed");
    this.palmCustomQuestion = document.getElementById("palm-custom-question");
    this.btnPalmCopyGemini = document.getElementById("btn-palm-copy-gemini");
    this.btnPalmOpenGemini = document.getElementById("btn-palm-open-gemini");
    this.palmGeminiPrompt = document.getElementById("palm-gemini-prompt");
    this.btnPalmShare = document.getElementById("btn-palm-share");
    this.btnPalmPdf = document.getElementById("btn-palm-pdf");
    this.btnPalmScanAgain = document.getElementById("btn-palm-scan-again");
    this.palmSharedNotice = document.getElementById("palm-shared-notice");
    this.btnPalmStartOwn = document.getElementById("btn-palm-start-own");
  }

  bindEvents() {
    // Mode Switcher
    if (this.modeTarotBtn) {
      this.modeTarotBtn.addEventListener("click", () => this.switchMode("tarot"));
    }
    if (this.modePalmBtn) {
      this.modePalmBtn.addEventListener("click", () => this.switchMode("palm"));
    }
    if (this.btnBackToTarot) {
      this.btnBackToTarot.addEventListener("click", () => this.switchMode("tarot"));
    }

    // Gender Selection
    this.palmGenderChips.forEach(chip => {
      chip.addEventListener("click", () => {
        window.mysticAudio && window.mysticAudio.playClick();
        this.palmGenderChips.forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        this.gender = chip.dataset.gender;
        this.updateHandRuleNotice();
      });
    });

    // Hand Selection (Left / Right)
    this.palmHandCards.forEach(card => {
      card.addEventListener("click", () => {
        window.mysticAudio && window.mysticAudio.playClick();
        this.palmHandCards.forEach(c => c.classList.remove("active"));
        card.classList.add("active");
        this.handSide = card.dataset.hand;
        this.updateHandRuleNotice();
      });
    });

    // Name Input
    if (this.palmSeekerInput) {
      this.palmSeekerInput.addEventListener("input", (e) => {
        this.seekerName = e.target.value.trim();
      });
    }

    // Start Scanning Ritual Button
    if (this.btnStartPalmScan) {
      this.btnStartPalmScan.addEventListener("click", () => {
        window.mysticAudio && window.mysticAudio.playClick();
        this.seekerName = this.palmSeekerInput ? this.palmSeekerInput.value.trim() : "";
        this.openCameraScreen();
      });
    }

    // Camera Controls
    if (this.btnSwitchCamera) {
      this.btnSwitchCamera.addEventListener("click", () => {
        this.switchCamera();
      });
    }

    if (this.btnCancelCamera) {
      this.btnCancelCamera.addEventListener("click", () => {
        this.stopCamera();
        this.switchPalmScreen("intro");
      });
    }

    if (this.btnCapturePalm) {
      this.btnCapturePalm.addEventListener("click", () => {
        this.performPalmScan();
      });
    }

    // File Upload Fallback
    if (this.btnUploadFallback && this.fileUploadInput) {
      this.btnUploadFallback.addEventListener("click", () => {
        this.fileUploadInput.click();
      });

      this.fileUploadInput.addEventListener("change", (e) => {
        this.handleFileUpload(e);
      });
    }

    // Analysis / Refinement Screen Actions
    if (this.btnConfirmAnalysis) {
      this.btnConfirmAnalysis.addEventListener("click", () => {
        window.mysticAudio && window.mysticAudio.playCrystalBell(659, 1.2);
        this.renderPalmResults();
        this.switchPalmScreen("results");
      });
    }

    if (this.btnRetakePalm) {
      this.btnRetakePalm.addEventListener("click", () => {
        this.openCameraScreen();
      });
    }

    // Results Screen Actions
    if (this.btnPalmScanAgain) {
      this.btnPalmScanAgain.addEventListener("click", () => {
        window.mysticAudio && window.mysticAudio.playClick();
        this.resetPalmState();
        this.switchPalmScreen("intro");
      });
    }

    if (this.btnPalmStartOwn) {
      this.btnPalmStartOwn.addEventListener("click", () => {
        window.mysticAudio && window.mysticAudio.playClick();
        this.resetPalmState();
        this.switchPalmScreen("intro");
      });
    }

    if (this.btnPalmShare) {
      this.btnPalmShare.addEventListener("click", () => {
        this.sharePalmReading();
      });
    }

    if (this.btnPalmPdf) {
      this.btnPalmPdf.addEventListener("click", () => {
        this.downloadPalmPDF();
      });
    }

    if (this.palmCustomQuestion) {
      this.palmCustomQuestion.addEventListener("input", (e) => {
        this.userQuestion = e.target.value;
        this.renderGeminiPrompt();
      });
    }

    if (this.btnPalmCopyGemini) {
      this.btnPalmCopyGemini.addEventListener("click", () => {
        this.copyGeminiPrompt();
      });
    }

    if (this.btnPalmOpenGemini) {
      this.btnPalmOpenGemini.addEventListener("click", () => {
        this.openGemini();
      });
    }

    // Update rule notice on load
    this.updateHandRuleNotice();
  }

  // =========================================================================
  // 1. MODE & SCREEN MANAGEMENT
  // =========================================================================
  switchMode(mode) {
    window.mysticAudio && window.mysticAudio.playClick();
    const tarotSection = document.getElementById("tarot-mode-container");
    const palmSection = document.getElementById("palm-mode-container");

    if (mode === "palm") {
      if (this.modeTarotBtn) this.modeTarotBtn.classList.remove("active");
      if (this.modePalmBtn) this.modePalmBtn.classList.add("active");
      if (tarotSection) tarotSection.style.display = "none";
      if (palmSection) palmSection.style.display = "block";
      this.updateHandRuleNotice();
      this.switchPalmScreen("intro");
    } else {
      if (this.modePalmBtn) this.modePalmBtn.classList.remove("active");
      if (this.modeTarotBtn) this.modeTarotBtn.classList.add("active");
      if (palmSection) palmSection.style.display = "none";
      if (tarotSection) tarotSection.style.display = "block";
      this.stopCamera();
    }
  }

  switchPalmScreen(screenKey) {
    Object.keys(this.screens).forEach(key => {
      if (this.screens[key]) {
        this.screens[key].classList.toggle("active", key === screenKey);
      }
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  updateHandRuleNotice() {
    if (!this.palmHandRuleNotice) return;
    const rules = PALM_HAND_RULES[this.lang] || PALM_HAND_RULES.th;
    const genderKey = this.gender === "male" ? "male" : (this.gender === "female" ? "female" : "general");
    const handKey = this.handSide;
    
    let info = rules[genderKey] && rules[genderKey][handKey];
    if (!info && rules.general) {
      info = handKey === "right" ? rules.general.dominant : rules.general.passive;
    }

    if (info) {
      this.palmHandRuleNotice.innerHTML = `
        <div class="rule-badge-highlight">📖 ตำรา The Street Ratchada</div>
        <strong>${info.title}</strong>
        <p>${info.desc}</p>
      `;
    }
  }

  // =========================================================================
  // 2. CAMERA & SCANNER ENGINE
  // =========================================================================
  async openCameraScreen() {
    this.switchPalmScreen("camera");
    await this.startCamera();
  }

  async startCamera() {
    this.stopCamera();
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      this.showCameraStatus(
        this.lang === "th" 
          ? "เบราว์เซอร์ไม่รองรับกล้อง กรุณาใช้ปุ่ม 'ถ่ายรูปหรือเลือกรูปจากคลังภาพ'" 
          : "Camera not supported in this browser. Please use photo upload.",
        true
      );
      return;
    }

    try {
      this.showCameraStatus(this.lang === "th" ? "กำลังเชื่อมต่อเนตรเวทมนตร์ (กล้อง)..." : "Connecting to camera...");
      const constraints = {
        video: {
          facingMode: { ideal: this.facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };

      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (this.videoElement) {
        this.videoElement.srcObject = this.stream;
        await this.videoElement.play();
        this.showCameraStatus(
          this.lang === "th" 
            ? "วางฝ่ามือให้ตรงกับกรอบแสงเวทมนตร์ แล้วกดปุ่มสแกน" 
            : "Align your palm with the mystical outline and tap scan"
        );
      }
    } catch (err) {
      console.warn("Could not start environment camera, trying default video:", err);
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (this.videoElement) {
          this.videoElement.srcObject = this.stream;
          await this.videoElement.play();
          this.showCameraStatus(
            this.lang === "th" ? "กล้องพร้อมแล้ว วางฝ่ามือให้ตรงกรอบ" : "Camera ready. Align your palm."
          );
        }
      } catch (fallbackErr) {
        console.error("Camera access failed:", fallbackErr);
        this.showCameraStatus(
          this.lang === "th" 
            ? "ไม่สามารถเปิดกล้องได้ (กรุณาอนุญาตสิทธิ์กล้อง หรือใช้ปุ่ม 'เลือกรูปจากคลังภาพ')" 
            : "Camera permission denied. Please upload a photo instead.",
          true
        );
      }
    }
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }

  async switchCamera() {
    this.facingMode = this.facingMode === "environment" ? "user" : "environment";
    await this.startCamera();
  }

  showCameraStatus(msg, isError = false) {
    if (this.cameraStatusText) {
      this.cameraStatusText.textContent = msg;
      this.cameraStatusText.style.color = isError ? "#f87171" : "var(--gold-primary)";
    }
  }

  handleFileUpload(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      this.capturedDataUrl = e.target.result;
      this.stopCamera();
      this.proceedToScanningEffect();
    };
    reader.readAsDataURL(file);
  }

  performPalmScan() {
    if (this.isScanning) return;
    this.isScanning = true;

    // Snapshot from video feed to canvas
    const canvas = document.createElement("canvas");
    const video = this.videoElement;
    
    if (video && video.videoWidth > 0) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      
      // If user camera, mirror it horizontally for intuitive feel
      if (this.facingMode === "user") {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      this.capturedDataUrl = canvas.toDataURL("image/jpeg", 0.9);
    } else {
      // Fallback synthetic palm template if camera feed is blank
      this.capturedDataUrl = this.generateSyntheticPalmCanvas();
    }

    this.proceedToScanningEffect();
  }

  proceedToScanningEffect() {
    // Play sound and trigger laser sweep
    if (window.mysticAudio && window.mysticAudio.playCardFlip) {
      window.mysticAudio.playCardFlip();
    }
    if (this.laserBeam) {
      this.laserBeam.classList.add("active");
    }

    this.showCameraStatus(
      this.lang === "th" 
        ? "🔮 กำลังสแกนพลังงานหัตถศาสตร์ The Street Ratchada..." 
        : "Scanning palm lines according to The Street Ratchada..."
    );

    setTimeout(() => {
      if (this.laserBeam) this.laserBeam.classList.remove("active");
      this.stopCamera();
      this.isScanning = false;
      this.openAnalysisScreen();
    }, 1800);
  }

  // =========================================================================
  // 3. PALM ANALYSIS & CANVAS LINE TRACING
  // =========================================================================
  openAnalysisScreen() {
    this.switchPalmScreen("analysis");
    this.renderAnalysisCanvas();
    this.renderRefinementTabs();
  }

  renderAnalysisCanvas() {
    if (!this.analysisCanvas || !this.capturedDataUrl) return;
    const canvas = this.analysisCanvas;
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      // Fit to reasonable resolution (max 800px width)
      const aspect = img.height / img.width;
      canvas.width = 720;
      canvas.height = Math.round(720 * aspect);

      // 1. Draw user photo
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // 2. Add subtle mystical vignette overlay
      const grad = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, canvas.width * 0.25,
        canvas.width / 2, canvas.height / 2, canvas.width * 0.75
      );
      grad.addColorStop(0, "rgba(10, 5, 20, 0.15)");
      grad.addColorStop(1, "rgba(5, 2, 12, 0.75)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 3. Draw luminous traced palm lines
      this.drawLuminousPalmLines(ctx, canvas.width, canvas.height);
    };

    img.src = this.capturedDataUrl;
  }

  drawLuminousPalmLines(ctx, w, h) {
    const isRight = this.handSide === "right";
    const xMult = isRight ? 1 : -1;
    const xBase = isRight ? 0 : w;

    // Helper: translate relative coordinates considering Left / Right hand geometry
    const tx = (relX) => isRight ? (relX * w) : (w - relX * w);
    const ty = (relY) => relY * h;

    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // 1. เส้นชีวิต (Life Line) - Emerald Green
    this.traceCurvedLine(ctx, [
      { x: tx(0.38), y: ty(0.48) },
      { x: tx(0.35), y: ty(0.60) },
      { x: tx(0.38), y: ty(0.75) },
      { x: tx(0.44), y: ty(0.88) }
    ], "#10b981", "🌱 เส้นชีวิต (Life)");

    // 2. เส้นสมอง (Head Line) - Sapphire Blue
    const isHeadCurved = this.selectedLines.head === "head_curved_down";
    this.traceCurvedLine(ctx, [
      { x: tx(0.38), y: ty(0.48) },
      { x: tx(0.50), y: ty(0.54) },
      { x: tx(0.65), y: ty(isHeadCurved ? 0.65 : 0.58) },
      { x: tx(0.78), y: ty(isHeadCurved ? 0.76 : 0.62) }
    ], "#3b82f6", "🧠 เส้นสมอง (Head)");

    // 3. เส้นหัวใจ (Heart Line) - Ruby Rose
    this.traceCurvedLine(ctx, [
      { x: tx(0.82), y: ty(0.42) },
      { x: tx(0.65), y: ty(0.38) },
      { x: tx(0.50), y: ty(0.36) },
      { x: tx(0.38), y: ty(0.33) }
    ], "#ec4899", "💖 เส้นหัวใจ (Heart)");

    // 4. เส้นวาสนา (Fate Line) - Radiant Gold
    if (this.selectedLines.fate !== "fate_absent_or_faint") {
      const fromMoon = this.selectedLines.fate === "fate_from_moon";
      const startX = fromMoon ? tx(0.65) : tx(0.50);
      this.traceCurvedLine(ctx, [
        { x: startX, y: ty(0.88) },
        { x: tx(0.51), y: ty(0.68) },
        { x: tx(0.50), y: ty(0.48) },
        { x: tx(0.48), y: ty(0.32) }
      ], "#f59e0b", "👑 เส้นวาสนา (Fate)");
    }

    // 5. เส้นสมรส (Marriage Line) - Mystic Purple
    this.traceCurvedLine(ctx, [
      { x: tx(0.88), y: ty(0.36) },
      { x: tx(0.78), y: ty(0.365) }
    ], "#a855f7", "💍 เส้นสมรส");

    ctx.restore();
  }

  traceCurvedLine(ctx, points, color, label) {
    if (points.length < 2) return;

    // Glowing outer halo
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = 14;
    ctx.shadowColor = color;
    ctx.shadowBlur = 18;
    ctx.globalAlpha = 0.35;
    ctx.stroke();

    // Crisp inner core
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.lineWidth = 4.5;
    ctx.strokeStyle = "#ffffff";
    ctx.shadowBlur = 8;
    ctx.globalAlpha = 0.95;
    ctx.stroke();

    // Line Label pill
    const midIdx = Math.floor(points.length / 2);
    const mid = points[midIdx];
    ctx.globalAlpha = 1.0;
    ctx.font = "bold 13px 'Prompt', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const textWidth = ctx.measureText(label).width;
    ctx.fillStyle = "rgba(10, 5, 20, 0.85)";
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    
    // Draw small rounded pill background
    ctx.beginPath();
    ctx.roundRect(mid.x - textWidth / 2 - 8, mid.y - 12, textWidth + 16, 24, 12);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = color;
    ctx.fillText(label, mid.x, mid.y);
  }

  renderRefinementTabs() {
    if (!this.refinementTabs) return;
    const dict = PALM_LINES_DATA;
    this.refinementTabs.innerHTML = "";

    const linesList = ["life", "head", "heart", "fate", "marriage"];

    linesList.forEach(lineKey => {
      const lineData = dict[lineKey];
      const section = document.createElement("div");
      section.className = "refinement-line-card";
      section.style.borderLeftColor = lineData.color;

      const titleHtml = `
        <div class="refine-card-header">
          <span class="refine-icon" style="color:${lineData.color}">${lineData.icon}</span>
          <div>
            <strong>${this.lang === "th" ? lineData.name_th : lineData.name_en}</strong>
            <p class="refine-def">${this.lang === "th" ? lineData.definition_th : lineData.definition_en}</p>
          </div>
        </div>
      `;

      const chipsContainer = document.createElement("div");
      chipsContainer.className = "refine-chips-row";

      lineData.variations.forEach(v => {
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = `refine-option-chip ${this.selectedLines[lineKey] === v.id ? 'active' : ''}`;
        chip.innerHTML = `
          <div class="chip-name">${this.lang === "th" ? v.name_th : v.name_en}</div>
          <div class="chip-summary">${this.lang === "th" ? v.summary_th : v.summary_en}</div>
        `;

        chip.addEventListener("click", () => {
          window.mysticAudio && window.mysticAudio.playClick();
          this.selectedLines[lineKey] = v.id;
          chipsContainer.querySelectorAll(".refine-option-chip").forEach(c => c.classList.remove("active"));
          chip.classList.add("active");
          this.renderAnalysisCanvas();
        });

        chipsContainer.appendChild(chip);
      });

      section.innerHTML = titleHtml;
      section.appendChild(chipsContainer);
      this.refinementTabs.appendChild(section);
    });
  }

  // Fallback synthetic palm preview if browser camera is not accessible
  generateSyntheticPalmCanvas() {
    const c = document.createElement("canvas");
    c.width = 600;
    c.height = 800;
    const ctx = c.getContext("2d");

    // Mystic dark background
    const bg = ctx.createLinearGradient(0, 0, 0, 800);
    bg.addColorStop(0, "#1a0f2e");
    bg.addColorStop(1, "#0d0614");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 600, 800);

    // Warm skin silhouette of palm
    ctx.fillStyle = "rgba(224, 186, 154, 0.4)";
    ctx.strokeStyle = "rgba(212, 175, 55, 0.6)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(300, 480, 160, 200, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    return c.toDataURL("image/jpeg", 0.9);
  }

  // =========================================================================
  // 4. RESULTS RENDERING & SYNTHESIS
  // =========================================================================
  renderPalmResults() {
    // 1. Seeker Greeting
    if (this.palmResultGreeting) {
      if (this.seekerName) {
        this.palmResultGreeting.innerHTML = `<span>✋</span> ${this.lang === "th" ? "ผลพยากรณ์ลายมือตามตำราของ" : "Sacred Palm Reading for"} <strong style="color:var(--gold-primary);">${this.seekerName}</strong>`;
        this.palmResultGreeting.style.display = "inline-flex";
      } else {
        this.palmResultGreeting.style.display = "none";
      }
    }

    // 2. Hand Rule Banner based on The Street Ratchada
    if (this.palmRuleBanner) {
      const rules = PALM_HAND_RULES[this.lang] || PALM_HAND_RULES.th;
      const genderKey = this.gender === "male" ? "male" : (this.gender === "female" ? "female" : "general");
      const info = (rules[genderKey] && rules[genderKey][this.handSide]) || rules.general.dominant;

      this.palmRuleBanner.innerHTML = `
        <div class="rule-icon">📖</div>
        <div>
          <h4>${this.lang === "th" ? "หลักการหัตถศาสตร์ (The Street Ratchada)" : "The Street Ratchada Palmistry Rule"}</h4>
          <p><strong>${info.title}:</strong> ${info.desc}</p>
        </div>
      `;
    }

    // 3. Display Scanned Canvas Preview
    if (this.palmCanvasDisplay && this.analysisCanvas) {
      this.palmCanvasDisplay.innerHTML = "";
      const displayImg = document.createElement("img");
      displayImg.src = this.analysisCanvas.toDataURL("image/jpeg", 0.85);
      displayImg.alt = "Scanned Palmistry Map";
      displayImg.className = "palm-result-preview-image";
      this.palmCanvasDisplay.appendChild(displayImg);
    }

    // 4. Grand Synthesis
    if (this.palmSynthesisBox) {
      this.palmSynthesisBox.innerHTML = this.generatePalmGrandSynthesis();
    }

    // 5. Render Individual Lines Feed
    this.renderLinesFeed();

    // 6. Render Gemini AI Prompt
    this.renderGeminiPrompt();
  }

  generatePalmGrandSynthesis() {
    const lifeVar = this.getVariation("life");
    const headVar = this.getVariation("head");
    const heartVar = this.getVariation("heart");
    const fateVar = this.getVariation("fate");
    const marriageVar = this.getVariation("marriage");

    if (this.lang === "th") {
      return `
        <p><strong>✨ สรุปภาพรวมชะตาชีวิตจากฝ่ามือ:</strong></p>
        <p>ฝ่ามือของท่านเผยให้เห็นพลังชีวิตด้าน <strong>สุขภาพ</strong> ที่${lifeVar.summary_th} ควบคู่กับกระบวนการคิดด้าน <strong>สติปัญญา</strong> แบบ${headVar.summary_th}</p>
        <p>ในด้าน <strong>ความรักและอารมณ์</strong> ท่านเป็นผู้ที่${heartVar.summary_th} ขณะที่เส้นทาง <strong>หน้าที่การงานและโชคลาภ</strong> บ่งชี้ว่า${fateVar.summary_th}</p>
        <p>ส่วนด้าน <strong>ชีวิตคู่และคู่ครอง</strong> มีแนวโน้ม${marriageVar.summary_th}</p>
        <p style="margin-top:0.8rem; color:var(--gold-primary);"><em>“หัตถศาสตร์คือแผนที่ชีวิตที่สะท้อนการกระทำและจิตสำนึก ทุกเส้นสายสามารถงอกงามและเปลี่ยนแปลงไปในทางที่ดียิ่งขึ้นได้ด้วยการเลือกและการปฏิบัติดีของท่านเอง”</em></p>
      `;
    } else {
      return `
        <p><strong>✨ Overall Palmistry Destiny Synthesis:</strong></p>
        <p>Your palm map reveals <strong>vitality</strong> characterized by ${lifeVar.summary_en}, complemented by an <strong>intellect</strong> that is ${headVar.summary_en}.</p>
        <p>In <strong>love and emotional resonance</strong>, you reflect ${heartVar.summary_en}, while your <strong>vocational destiny and fortune</strong> indicate ${fateVar.summary_en}.</p>
        <p>Regarding <strong>marriage and soulmate bonding</strong>, your palm forecasts ${marriageVar.summary_en}.</p>
      `;
    }
  }

  renderLinesFeed() {
    if (!this.palmLinesFeed) return;
    this.palmLinesFeed.innerHTML = "";
    const lines = ["life", "head", "heart", "fate", "marriage"];

    lines.forEach((lineKey, index) => {
      const lineData = PALM_LINES_DATA[lineKey];
      const selectedVar = this.getVariation(lineKey);

      const card = document.createElement("div");
      card.className = "palm-line-detail-card";
      card.style.borderTop = `3px solid ${lineData.color}`;

      card.innerHTML = `
        <div class="line-detail-header">
          <div class="line-badge" style="background:${lineData.color}22; color:${lineData.color}; border:1px solid ${lineData.color}66;">
            <span>${lineData.icon}</span>
            <span>${this.lang === "th" ? lineData.name_th : lineData.name_en}</span>
          </div>
          <span class="line-variation-tag">${this.lang === "th" ? selectedVar.name_th : selectedVar.name_en}</span>
        </div>

        <div class="line-summary-banner" style="background:${lineData.color}15;">
          <strong>✦ ${this.lang === "th" ? selectedVar.summary_th : selectedVar.summary_en}</strong>
        </div>

        <div class="line-prediction-body">
          <p>${this.lang === "th" ? selectedVar.prediction_th : selectedVar.prediction_en}</p>
        </div>

        <div class="line-advice-box">
          <span class="advice-icon">🔮</span>
          <div>
            <strong>${this.lang === "th" ? "สารเตือนใจและคำแนะนำ:" : "Sage Guidance:"}</strong>
            <p>${this.lang === "th" ? selectedVar.advice_th : selectedVar.advice_en}</p>
          </div>
        </div>
      `;

      this.palmLinesFeed.appendChild(card);
    });
  }

  getVariation(lineKey) {
    const varId = this.selectedLines[lineKey];
    const lineData = PALM_LINES_DATA[lineKey];
    if (!lineData) return null;
    return lineData.variations.find(v => v.id === varId) || lineData.variations[0];
  }

  // =========================================================================
  // 5. GEMINI AI INTEGRATION
  // =========================================================================
  renderGeminiPrompt() {
    if (!this.palmGeminiPrompt) return;
    const promptText = this.buildGeminiPromptText();
    this.palmGeminiPrompt.textContent = promptText;
  }

  buildGeminiPromptText() {
    const seeker = this.seekerName ? `คุณ${this.seekerName}` : "ผู้รับคำทำนาย";
    const handText = this.handSide === "right" ? "มือขวา" : "มือซ้าย";
    const genderText = this.gender === "male" ? "ชาย" : (this.gender === "female" ? "หญิง" : "ทั่วไป");

    const lifeVar = this.getVariation("life");
    const headVar = this.getVariation("head");
    const heartVar = this.getVariation("heart");
    const fateVar = this.getVariation("fate");
    const marriageVar = this.getVariation("marriage");

    let prompt = `คุณคือผู้เชี่ยวชาญด้านหัตถศาสตร์ (ศาสตร์แห่งการดูลายมือ) และที่ปรึกษาชีวิตเชิงจิตวิทยา ขอให้ช่วยวิเคราะห์ดวงชะตาและให้คำแนะนำอย่างอบอุ่น ลึกซึ้ง และเป็นรูปธรรม โดยอ้างอิงข้อมูลลายมือดังต่อไปนี้:\n\n`;
    prompt += `✦ ผู้รับคำทำนาย: ${seeker} (เพศ: ${genderText})\n`;
    prompt += `✦ ข้างมือที่สแกน: ${handText} (อ้างอิงตามหลักการของ The Street Ratchada)\n\n`;
    prompt += `✦ ข้อมูลเส้นลายมือที่สแกนได้:\n`;
    prompt += `1. เส้นชีวิต (Life Line): ${lifeVar.name_th} — ${lifeVar.summary_th}\n`;
    prompt += `2. เส้นสมอง (Head Line): ${headVar.name_th} — ${headVar.summary_th}\n`;
    prompt += `3. เส้นหัวใจ (Heart Line): ${heartVar.name_th} — ${heartVar.summary_th}\n`;
    prompt += `4. เส้นวาสนา (Fate Line): ${fateVar.name_th} — ${fateVar.summary_th}\n`;
    prompt += `5. เส้นสมรส (Marriage Line): ${marriageVar.name_th} — ${marriageVar.summary_th}\n\n`;

    if (this.userQuestion && this.userQuestion.trim()) {
      prompt += `✦ คำถามเจาะจงที่ผู้ทำนายต้องการถามเพิ่มเติม:\n"${this.userQuestion.trim()}"\n\n`;
    }

    prompt += `ขอให้ช่วยวิเคราะห์เจาะลึก:
1. การเชื่อมโยงพลังระหว่างเส้นสมองและเส้นหัวใจ (การตัดสินใจและความรัก)
2. แนวโน้มความสำเร็จในการงานและโชคลาภตามเส้นวาสนา
3. คำแนะนำในการดูแลสุขภาพและชีวิตคู่
4. ตอบคำถามเจาะจงข้างต้น (ถ้ามี) อย่างสร้างสรรค์และให้กำลังใจ`;

    return prompt;
  }

  copyGeminiPrompt() {
    const text = this.buildGeminiPromptText();
    navigator.clipboard.writeText(text).then(() => {
      this.app && this.app.showToast(this.lang === "th" ? "คัดลอกข้อความสำหรับ Gemini เรียบร้อยแล้ว!" : "Prompt copied to clipboard!");
      window.mysticAudio && window.mysticAudio.playCrystalBell(880, 1.2);
    }).catch(err => {
      console.error("Clipboard copy failed:", err);
    });
  }

  openGemini() {
    this.copyGeminiPrompt();
    setTimeout(() => {
      window.open("https://gemini.google.com/app", "_blank");
    }, 400);
  }

  // =========================================================================
  // 6. SHARING & PDF DOWNLOAD
  // =========================================================================
  generateShareableUrl() {
    const url = new URL(window.location.origin + window.location.pathname);
    url.searchParams.set("mode", "palm");
    url.searchParams.set("share", "1");
    if (this.seekerName) url.searchParams.set("name", this.seekerName);
    url.searchParams.set("gender", this.gender);
    url.searchParams.set("hand", this.handSide);
    
    // Encode lines: life:varId,head:varId,...
    const linesParam = Object.entries(this.selectedLines)
      .map(([k, v]) => `${k}:${v}`)
      .join(",");
    url.searchParams.set("lines", linesParam);

    if (this.userQuestion) url.searchParams.set("q", this.userQuestion);
    return url.toString();
  }

  sharePalmReading() {
    const seeker = this.seekerName ? `ของคุณ${this.seekerName}` : "";
    const shareUrl = this.generateShareableUrl();
    const lifeVar = this.getVariation("life");
    const fateVar = this.getVariation("fate");

    const shareTitle = `✋ ผลดวงดูลายมือหัตถศาสตร์ ${seeker} | Mystic Witch Palmistry`;
    const shareText = `✋ ผลทำนายดวงชะตาจากลายมือ (The Street Ratchada) ${seeker}:\n` +
      `✦ เส้นชีวิต: ${lifeVar.summary_th}\n` +
      `✦ เส้นวาสนา: ${fateVar.summary_th}\n` +
      `✦ เข้าดูแผนที่ลายมือฉบับเต็มและคำทำนายทุกเส้นได้ที่:\n${shareUrl}`;

    if (navigator.share) {
      navigator.share({
        title: shareTitle,
        text: shareText,
        url: shareUrl
      }).then(() => {
        this.app && this.app.showToast(this.lang === "th" ? "แชร์ผลดวงลายมือสำเร็จ!" : "Shared successfully!");
      }).catch(err => {
        if (err.name !== "AbortError") {
          this.copyShareFallback(shareText);
        }
      });
    } else {
      this.copyShareFallback(shareText);
    }
  }

  copyShareFallback(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        this.app && this.app.showToast(this.lang === "th" ? "คัดลอกลิงก์ผลดวงลายมือไปยังคลิปบอร์ดแล้ว!" : "Link copied to clipboard!");
        window.mysticAudio && window.mysticAudio.playCrystalBell(880, 1.2);
      });
    }
  }

  downloadPalmPDF() {
    window.mysticAudio && window.mysticAudio.playClick();
    const origTitle = document.title;
    const namePart = this.seekerName ? `_${this.seekerName}` : "";
    document.title = `MysticWitch_Palmistry${namePart}_Reading`;
    setTimeout(() => {
      window.print();
      document.title = origTitle;
    }, 250);
  }

  resetPalmState() {
    if (window.history && window.history.replaceState) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    if (this.palmSharedNotice) {
      this.palmSharedNotice.style.display = "none";
    }
    this.seekerName = "";
    if (this.palmSeekerInput) this.palmSeekerInput.value = "";
    if (this.palmCustomQuestion) this.palmCustomQuestion.value = "";
    this.userQuestion = "";
  }

  checkSharedPalmUrl() {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get("mode") !== "palm") return false;

      const linesParam = params.get("lines");
      if (!linesParam) return false;

      // Parse lines
      const pairs = linesParam.split(",").filter(Boolean);
      pairs.forEach(p => {
        const [k, v] = p.split(":");
        if (this.selectedLines[k] && PALM_LINES_DATA[k]) {
          const exists = PALM_LINES_DATA[k].variations.some(item => item.id === v);
          if (exists) this.selectedLines[k] = v;
        }
      });

      if (params.get("name")) {
        this.seekerName = params.get("name").trim();
        if (this.palmSeekerInput) this.palmSeekerInput.value = this.seekerName;
      }
      if (params.get("gender")) {
        this.gender = params.get("gender");
      }
      if (params.get("hand")) {
        this.handSide = params.get("hand");
      }
      if (params.get("q")) {
        this.userQuestion = params.get("q");
        if (this.palmCustomQuestion) this.palmCustomQuestion.value = this.userQuestion;
      }

      // Switch mode to palm
      this.switchMode("palm");

      // Show shared notice banner
      if (this.palmSharedNotice) {
        this.palmSharedNotice.style.display = "flex";
      }

      // Generate synthetic palm canvas to display
      this.capturedDataUrl = this.generateSyntheticPalmCanvas();
      this.renderAnalysisCanvas();
      this.renderPalmResults();
      this.switchPalmScreen("results");

      return true;
    } catch (err) {
      console.warn("Could not parse shared palm URL:", err);
      return false;
    }
  }
}

if (typeof window !== "undefined") {
  window.PalmScanner = PalmScanner;
}
