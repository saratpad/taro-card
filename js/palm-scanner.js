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
    this.capturedImage = null;
    this.isScanning = false;

    // Interactive Palm Alignment & Calibration State
    this.palmTransform = { x: 0, y: 0, scale: 1.0, rotation: 0 };
    this.isDragging = false;
    this.dragStart = { x: 0, y: 0, initX: 0, initY: 0 };
    this.pinMode = false; // Fine-tune anchor pins mode
    this.showLines = true; // Toggle visibility for skin comparison
    this.activePin = null; // { lineKey, pointIndex }

    // Normalized line landmark templates (Right Hand view; mirrored horizontally for Left Hand)
    this.defaultLinePoints = {
      life: [
        { x: 0.36, y: 0.44 },
        { x: 0.32, y: 0.56 },
        { x: 0.36, y: 0.72 },
        { x: 0.44, y: 0.88 }
      ],
      head: [
        { x: 0.36, y: 0.45 },
        { x: 0.48, y: 0.52 },
        { x: 0.63, y: 0.57 },
        { x: 0.78, y: 0.62 }
      ],
      heart: [
        { x: 0.84, y: 0.41 },
        { x: 0.68, y: 0.37 },
        { x: 0.52, y: 0.34 },
        { x: 0.38, y: 0.31 }
      ],
      fate: [
        { x: 0.52, y: 0.88 },
        { x: 0.51, y: 0.68 },
        { x: 0.50, y: 0.48 },
        { x: 0.48, y: 0.32 }
      ],
      marriage: [
        { x: 0.88, y: 0.36 },
        { x: 0.78, y: 0.365 }
      ]
    };

    // Active working line points (editable by user)
    this.customLinePoints = JSON.parse(JSON.stringify(this.defaultLinePoints));

    // Default line variations (The Street Ratchada baseline)
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
    this.silhouetteSvg = document.querySelector(".palm-silhouette-svg");

    // Analysis / Refinement Screen Elements
    this.analysisCanvas = document.getElementById("palm-analysis-canvas");
    this.refinementTabs = document.getElementById("palm-refinement-tabs");
    this.btnConfirmAnalysis = document.getElementById("btn-confirm-palm-analysis");
    this.btnRetakePalm = document.getElementById("btn-retake-palm");
    this.canvasDragHint = document.getElementById("canvas-drag-hint-badge");

    // Calibration Toolbar Elements
    this.btnTogglePinMode = document.getElementById("btn-toggle-pin-mode");
    this.pinModeText = document.getElementById("pin-mode-text");
    this.btnPeekLines = document.getElementById("btn-peek-lines");
    this.peekLinesText = document.getElementById("peek-lines-text");
    this.btnAutoDetect = document.getElementById("btn-auto-detect-palm");
    this.btnResetTransform = document.getElementById("btn-reset-palm-transform");
    this.scaleSlider = document.getElementById("palm-scale-slider");
    this.scaleValBadge = document.getElementById("scale-val-badge");
    this.rotateSlider = document.getElementById("palm-rotate-slider");
    this.rotateValBadge = document.getElementById("rotate-val-badge");
    this.nudgeButtons = document.querySelectorAll(".btn-nudge");

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
        this.updateSilhouetteMirror();
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

    // Calibration Toolbar Controls
    if (this.btnTogglePinMode) {
      this.btnTogglePinMode.addEventListener("click", () => {
        this.togglePinMode();
      });
    }

    if (this.btnPeekLines) {
      this.btnPeekLines.addEventListener("click", () => {
        this.togglePeekLines();
      });
    }

    if (this.btnAutoDetect) {
      this.btnAutoDetect.addEventListener("click", () => {
        this.runAutoDetect();
      });
    }

    if (this.btnResetTransform) {
      this.btnResetTransform.addEventListener("click", () => {
        this.resetTransform();
      });
    }

    if (this.scaleSlider) {
      this.scaleSlider.addEventListener("input", (e) => {
        this.onScaleChange(parseFloat(e.target.value));
      });
    }

    if (this.rotateSlider) {
      this.rotateSlider.addEventListener("input", (e) => {
        this.onRotateChange(parseFloat(e.target.value));
      });
    }

    if (this.nudgeButtons) {
      this.nudgeButtons.forEach(btn => {
        btn.addEventListener("click", () => {
          this.onNudge(btn.dataset.dir);
        });
      });
    }

    // Direct Interactive Canvas Pointer Events (Touch & Mouse)
    if (this.analysisCanvas) {
      this.bindCanvasPointerEvents();
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

    // Initial mirror state and hand rule update
    this.updateHandRuleNotice();
    this.updateSilhouetteMirror();
  }

  updateSilhouetteMirror() {
    const silhouette = document.querySelector(".palm-silhouette-svg");
    if (silhouette) {
      if (this.handSide === "left") {
        silhouette.classList.add("mirror-silhouette");
      } else {
        silhouette.classList.remove("mirror-silhouette");
      }
    }
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
      this.updateSilhouetteMirror();
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
    this.updateSilhouetteMirror();
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
            ? "วางฝ่ามือให้เต็มกรอบแสงเวทมนตร์ แล้วกดปุ่มสแกน" 
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
      
      // If front camera, mirror it horizontally for intuitive feel
      if (this.facingMode === "user") {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      this.capturedDataUrl = canvas.toDataURL("image/jpeg", 0.92);
    } else {
      // Fallback synthetic palm template if camera feed is blank
      this.capturedDataUrl = this.generateSyntheticPalmCanvas();
    }

    this.proceedToScanningEffect();
  }

  proceedToScanningEffect() {
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
  // 3. PALM ANALYSIS, AUTO-DETECTION & INTERACTIVE CALIBRATION
  // =========================================================================
  openAnalysisScreen() {
    this.switchPalmScreen("analysis");
    this.renderAnalysisCanvas(true, () => {
      this.renderRefinementTabs();
    });

    // Show temporary drag hint badge
    if (this.canvasDragHint) {
      this.canvasDragHint.style.display = "flex";
      this.canvasDragHint.style.opacity = "1";
      setTimeout(() => {
        if (this.canvasDragHint) {
          this.canvasDragHint.style.transition = "opacity 1.2s ease";
          this.canvasDragHint.style.opacity = "0.2";
        }
      }, 5000);
    }
  }

  renderAnalysisCanvas(runDetection = false, callback = null) {
    if (!this.analysisCanvas || !this.capturedDataUrl) return;

    const img = new Image();
    img.onload = () => {
      this.capturedImage = img;
      const aspect = img.height / img.width;
      this.analysisCanvas.width = 720;
      this.analysisCanvas.height = Math.round(720 * aspect);

      if (runDetection) {
        // Run automatic hand region detection
        const ctx = this.analysisCanvas.getContext("2d");
        ctx.drawImage(img, 0, 0, this.analysisCanvas.width, this.analysisCanvas.height);
        const detection = this.detectPalmRegion(ctx, this.analysisCanvas.width, this.analysisCanvas.height);

        if (detection.detected) {
          this.palmTransform.x = detection.x;
          this.palmTransform.y = detection.y;
          this.palmTransform.scale = detection.scale;
          this.palmTransform.rotation = 0;
        } else {
          this.palmTransform = { x: 0, y: 0, scale: 1.0, rotation: 0 };
        }
      }

      this.updateCalibrationUI();
      this.redrawAnalysisCanvas();
      if (typeof callback === "function") callback();
    };
    img.src = this.capturedDataUrl;
  }

  // Smart skin-color segmentation to auto-align palm bounds
  detectPalmRegion(ctx, width, height) {
    try {
      const imgData = ctx.getImageData(0, 0, width, height);
      const data = imgData.data;
      const step = 4; // Sample every 4th pixel for speed

      let minX = width, maxX = 0, minY = height, maxY = 0;
      let sumX = 0, sumY = 0, count = 0;

      const startX = Math.floor(width * 0.05);
      const endX = Math.floor(width * 0.95);
      const startY = Math.floor(height * 0.06);
      const endY = Math.floor(height * 0.94);

      for (let y = startY; y < endY; y += step) {
        for (let x = startX; x < endX; x += step) {
          const idx = (y * width + x) * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];

          // Human skin color heuristics (robust across varied lighting & skin tones)
          const isSkin = (
            r > 65 && g > 40 && b > 20 &&
            r > g && (r - b) > 14 && (g - b) > -8 &&
            (Math.max(r, g, b) - Math.min(r, g, b)) > 14 &&
            !(r > 248 && g > 248 && b > 248)
          );

          if (isSkin) {
            sumX += x;
            sumY += y;
            count++;
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }

      const totalSamples = ((endX - startX) / step) * ((endY - startY) / step);
      const skinRatio = count / totalSamples;

      if (skinRatio > 0.05 && maxX > minX && maxY > minY) {
        const handWidth = maxX - minX;
        const handHeight = maxY - minY;
        const palmCenterX = sumX / count;
        // In palm photos, the palm center of mass sits around 56% down the hand
        const palmCenterY = minY + handHeight * 0.56;

        // Scale relative to canonical palm width (approx 52% of canvas width)
        const idealScale = Math.min(1.5, Math.max(0.7, handWidth / (width * 0.52)));
        const offsetX = palmCenterX - (width * 0.5);
        const offsetY = palmCenterY - (height * 0.54);

        return {
          detected: true,
          x: Math.round(offsetX),
          y: Math.round(offsetY),
          scale: parseFloat(idealScale.toFixed(2)),
          rotation: 0
        };
      }
    } catch (err) {
      console.warn("Palm auto-detection fallback:", err);
    }

    return { detected: false, x: 0, y: 0, scale: 1.0, rotation: 0 };
  }

  // 100% Reversible Coordinate Transformation (Screen <-> Normalized Model)
  toCanvasCoords(point) {
    if (!this.analysisCanvas) return { x: 0, y: 0 };
    const w = this.analysisCanvas.width;
    const h = this.analysisCanvas.height;
    const isRight = this.handSide === "right";

    // 1. Mirror horizontally if Left Hand
    const bx = (isRight ? point.x : (1.0 - point.x)) * w;
    const by = point.y * h;

    // 2. Scale & Rotate around estimated palm center
    const cx = w * 0.5;
    const cy = h * 0.54;

    const sx = cx + (bx - cx) * this.palmTransform.scale;
    const sy = cy + (by - cy) * this.palmTransform.scale;

    const rad = (this.palmTransform.rotation * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    const rx = cx + (sx - cx) * cos - (sy - cy) * sin;
    const ry = cy + (sx - cx) * sin + (sy - cy) * cos;

    // 3. Translate
    return {
      x: rx + this.palmTransform.x,
      y: ry + this.palmTransform.y
    };
  }

  fromCanvasCoords(canvasX, canvasY) {
    if (!this.analysisCanvas) return { x: 0.5, y: 0.5 };
    const w = this.analysisCanvas.width;
    const h = this.analysisCanvas.height;
    const isRight = this.handSide === "right";
    const cx = w * 0.5;
    const cy = h * 0.54;

    // 1. Untranslate
    const tx = canvasX - this.palmTransform.x;
    const ty = canvasY - this.palmTransform.y;

    // 2. Unrotate
    const rad = (-this.palmTransform.rotation * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    const ux = cx + (tx - cx) * cos - (ty - cy) * sin;
    const uy = cy + (tx - cx) * sin + (ty - cy) * cos;

    // 3. Unscale
    const scale = this.palmTransform.scale || 1.0;
    const bx = cx + (ux - cx) / scale;
    const by = cy + (uy - cy) / scale;

    // 4. Unnormalize and unmirror
    const ny = by / h;
    const nx = isRight ? (bx / w) : (1.0 - (bx / w));

    return {
      x: Math.max(0.02, Math.min(0.98, nx)),
      y: Math.max(0.02, Math.min(0.98, ny))
    };
  }

  findPinAt(canvasX, canvasY, hitRadius = 32) {
    let closest = null;
    let minDistance = hitRadius;

    const lineKeys = ["life", "head", "heart", "fate", "marriage"];
    for (const key of lineKeys) {
      if (key === "fate" && this.selectedLines.fate === "fate_absent_or_faint") continue;

      const pts = this.customLinePoints[key];
      if (!pts) continue;

      for (let i = 0; i < pts.length; i++) {
        const cp = this.toCanvasCoords(pts[i]);
        const d = Math.hypot(canvasX - cp.x, canvasY - cp.y);
        if (d < minDistance) {
          minDistance = d;
          closest = { lineKey: key, pointIndex: i, dist: d, canvasPoint: cp };
        }
      }
    }
    return closest;
  }

  // Pointer event listeners on canvas for intuitive direct touch/drag
  bindCanvasPointerEvents() {
    const canvas = this.analysisCanvas;

    const getCanvasPos = (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
      };
    };

    canvas.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      const pos = getCanvasPos(e);

      // Check if touching an anchor pin (in Fine-Tune mode or general touch)
      const pinHit = this.findPinAt(pos.x, pos.y, this.pinMode ? 36 : 28);
      if (pinHit) {
        this.activePin = { lineKey: pinHit.lineKey, pointIndex: pinHit.pointIndex };
        this.isDragging = false;
        try { canvas.setPointerCapture(e.pointerId); } catch (_) {}
        if (this.canvasDragHint) this.canvasDragHint.style.display = "none";
        this.redrawAnalysisCanvas();
        return;
      }

      // Otherwise, drag the entire line constellation
      this.isDragging = true;
      this.activePin = null;
      this.dragStart = {
        x: pos.x,
        y: pos.y,
        initX: this.palmTransform.x,
        initY: this.palmTransform.y
      };

      canvas.classList.add("dragging");
      try { canvas.setPointerCapture(e.pointerId); } catch (_) {}
      if (this.canvasDragHint) this.canvasDragHint.style.display = "none";
    });

    canvas.addEventListener("pointermove", (e) => {
      if (!this.isDragging && !this.activePin) return;
      e.preventDefault();
      const pos = getCanvasPos(e);

      if (this.activePin) {
        // Drag individual landmark pin
        const norm = this.fromCanvasCoords(pos.x, pos.y);
        this.customLinePoints[this.activePin.lineKey][this.activePin.pointIndex] = norm;
        this.redrawAnalysisCanvas();
      } else if (this.isDragging) {
        // Move whole constellation
        this.palmTransform.x = this.dragStart.initX + (pos.x - this.dragStart.x);
        this.palmTransform.y = this.dragStart.initY + (pos.y - this.dragStart.y);
        this.redrawAnalysisCanvas();
      }
    });

    const endDrag = (e) => {
      this.isDragging = false;
      this.activePin = null;
      canvas.classList.remove("dragging");
      try { canvas.releasePointerCapture(e.pointerId); } catch (_) {}
      this.redrawAnalysisCanvas();
    };

    canvas.addEventListener("pointerup", endDrag);
    canvas.addEventListener("pointercancel", endDrag);
  }

  // Calibration toolbar actions
  togglePinMode() {
    this.pinMode = !this.pinMode;
    window.mysticAudio && window.mysticAudio.playClick();
    this.updateCalibrationUI();
    this.redrawAnalysisCanvas();
    if (this.pinMode) {
      this.showToast(this.lang === "th" ? "📍 แตะลากจุดหมุดบนเส้นเพื่อดัดให้ตรงรอยมือ" : "Drag the glowing pins to adjust line creases");
    }
  }

  togglePeekLines() {
    this.showLines = !this.showLines;
    window.mysticAudio && window.mysticAudio.playClick();
    this.updateCalibrationUI();
    this.redrawAnalysisCanvas();
  }

  runAutoDetect() {
    if (!this.analysisCanvas || !this.capturedImage) return;
    window.mysticAudio && window.mysticAudio.playCardFlip();
    const ctx = this.analysisCanvas.getContext("2d");
    const det = this.detectPalmRegion(ctx, this.analysisCanvas.width, this.analysisCanvas.height);

    if (det.detected) {
      this.palmTransform.x = det.x;
      this.palmTransform.y = det.y;
      this.palmTransform.scale = det.scale;
      this.palmTransform.rotation = 0;
      this.updateCalibrationUI();
      this.redrawAnalysisCanvas();
      this.showToast(this.lang === "th" ? "🎯 ปรับตำแหน่งให้ตรงกับรูปมืออัตโนมัติแล้ว!" : "Auto-aligned lines with your palm!");
    } else {
      this.showToast(this.lang === "th" ? "⚠️ แตะหรือลากบนรูปเพื่อปรับตำแหน่งด้วยตนเอง" : "Please drag directly on canvas to position lines");
    }
  }

  resetTransform() {
    window.mysticAudio && window.mysticAudio.playClick();
    this.palmTransform = { x: 0, y: 0, scale: 1.0, rotation: 0 };
    this.customLinePoints = JSON.parse(JSON.stringify(this.defaultLinePoints));
    
    // Re-apply any currently selected variations
    Object.keys(this.selectedLines).forEach(key => {
      this.applyVariationPreset(key, this.selectedLines[key]);
    });

    this.updateCalibrationUI();
    this.redrawAnalysisCanvas();
    this.showToast(this.lang === "th" ? "🔄 คืนค่าตำแหน่งและขนาดเส้นเริ่มต้นแล้ว" : "Reset lines to default position");
  }

  onScaleChange(val) {
    this.palmTransform.scale = val;
    this.updateCalibrationUI();
    this.redrawAnalysisCanvas();
  }

  onRotateChange(val) {
    this.palmTransform.rotation = val;
    this.updateCalibrationUI();
    this.redrawAnalysisCanvas();
  }

  onNudge(dir) {
    const step = 8;
    if (dir === "up") this.palmTransform.y -= step;
    if (dir === "down") this.palmTransform.y += step;
    if (dir === "left") this.palmTransform.x -= step;
    if (dir === "right") this.palmTransform.x += step;
    this.redrawAnalysisCanvas();
  }

  updateCalibrationUI() {
    if (this.scaleSlider) this.scaleSlider.value = this.palmTransform.scale;
    if (this.scaleValBadge) this.scaleValBadge.textContent = Math.round(this.palmTransform.scale * 100) + "%";

    if (this.rotateSlider) this.rotateSlider.value = this.palmTransform.rotation;
    if (this.rotateValBadge) this.rotateValBadge.textContent = this.palmTransform.rotation + "°";

    if (this.btnTogglePinMode) {
      this.btnTogglePinMode.classList.toggle("active", this.pinMode);
    }
    if (this.pinModeText) {
      this.pinModeText.textContent = this.pinMode 
        ? (this.lang === "th" ? "ปิดโหมดดัดจุด" : "Exit Pin Mode") 
        : (this.lang === "th" ? "ดัดจุดเส้นอิสระ" : "Fine-Tune Pins");
    }

    if (this.btnPeekLines) {
      this.btnPeekLines.classList.toggle("active", !this.showLines);
    }
    if (this.peekLinesText) {
      this.peekLinesText.textContent = this.showLines 
        ? (this.lang === "th" ? "เทียบรอยมือ" : "Hide Lines") 
        : (this.lang === "th" ? "แสดงลายเส้น" : "Show Lines");
    }

    if (this.analysisCanvas) {
      this.analysisCanvas.classList.toggle("pin-mode", this.pinMode);
    }
  }

  // Synchronous, high-performance canvas redraw (60 FPS during drag & calibration)
  redrawAnalysisCanvas() {
    if (!this.analysisCanvas || !this.capturedImage) return;
    const canvas = this.analysisCanvas;
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;

    // 1. Draw base photo
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(this.capturedImage, 0, 0, w, h);

    // If lines are toggled off for peeking, show clean photo
    if (!this.showLines) return;

    // 2. Add subtle mystical vignette overlay
    const grad = ctx.createRadialGradient(
      w / 2, h / 2, w * 0.25,
      w / 2, h / 2, w * 0.78
    );
    grad.addColorStop(0, "rgba(10, 5, 20, 0.12)");
    grad.addColorStop(1, "rgba(5, 2, 12, 0.72)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // 3. Draw 5 Luminous Palm Lines with smooth Bezier splines
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // 1. เส้นชีวิต (Life Line) - Emerald Green
    const lifeCanvasPts = this.customLinePoints.life.map(p => this.toCanvasCoords(p));
    this.drawSmoothSpline(ctx, lifeCanvasPts, "#10b981", "🌱 เส้นชีวิต", "life");

    // 2. เส้นสมอง (Head Line) - Sapphire Blue
    const headCanvasPts = this.customLinePoints.head.map(p => this.toCanvasCoords(p));
    this.drawSmoothSpline(ctx, headCanvasPts, "#3b82f6", "🧠 เส้นสมอง", "head");

    // 3. เส้นหัวใจ (Heart Line) - Ruby Rose
    const heartCanvasPts = this.customLinePoints.heart.map(p => this.toCanvasCoords(p));
    this.drawSmoothSpline(ctx, heartCanvasPts, "#ec4899", "💖 เส้นหัวใจ", "heart");

    // 4. เส้นวาสนา (Fate Line) - Radiant Gold
    if (this.selectedLines.fate !== "fate_absent_or_faint") {
      const fateCanvasPts = this.customLinePoints.fate.map(p => this.toCanvasCoords(p));
      this.drawSmoothSpline(ctx, fateCanvasPts, "#f59e0b", "👑 เส้นวาสนา", "fate");
    }

    // 5. เส้นสมรส (Marriage Line) - Mystic Purple
    const marriageCanvasPts = this.customLinePoints.marriage.map(p => this.toCanvasCoords(p));
    this.drawSmoothSpline(ctx, marriageCanvasPts, "#a855f7", "💍 เส้นสมรส", "marriage");

    // 4. Draw Draggable Anchor Pins when Pin Mode is enabled
    if (this.pinMode) {
      this.drawAllAnchorPins(ctx);
    }

    ctx.restore();
  }

  // Smooth Catmull-Rom cubic Bezier path passing directly through all control points
  drawSmoothSpline(ctx, points, color, label, lineKey) {
    if (points.length < 2) return;

    const buildPath = () => {
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      if (points.length === 2) {
        ctx.lineTo(points[1].x, points[1].y);
      } else {
        for (let i = 0; i < points.length - 1; i++) {
          const p0 = i > 0 ? points[i - 1] : points[i];
          const p1 = points[i];
          const p2 = points[i + 1];
          const p3 = i < points.length - 2 ? points[i + 2] : p2;

          const cp1x = p1.x + (p2.x - p0.x) / 6;
          const cp1y = p1.y + (p2.y - p0.y) / 6;
          const cp2x = p2.x - (p3.x - p1.x) / 6;
          const cp2y = p2.y - (p3.y - p1.y) / 6;

          ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
        }
      }
    };

    // Glowing outer halo
    buildPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 14;
    ctx.shadowColor = color;
    ctx.shadowBlur = 18;
    ctx.globalAlpha = 0.38;
    ctx.stroke();

    // Crisp inner core
    buildPath();
    ctx.lineWidth = 4.2;
    ctx.strokeStyle = "#ffffff";
    ctx.shadowBlur = 8;
    ctx.globalAlpha = 0.95;
    ctx.stroke();

    // Line Label pill at midpoint
    const midIdx = Math.floor(points.length / 2);
    const mid = points[midIdx];
    ctx.globalAlpha = 1.0;
    ctx.font = "bold 13px 'Prompt', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const textWidth = ctx.measureText(label).width;
    ctx.fillStyle = "rgba(10, 5, 20, 0.88)";
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;

    ctx.beginPath();
    ctx.roundRect(mid.x - textWidth / 2 - 8, mid.y - 12, textWidth + 16, 24, 12);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = color;
    ctx.fillText(label, mid.x, mid.y);
  }

  // Draw interactive anchor pins for fine-tuning
  drawAllAnchorPins(ctx) {
    const pinColors = {
      life: "#10b981",
      head: "#3b82f6",
      heart: "#ec4899",
      fate: "#f59e0b",
      marriage: "#a855f7"
    };

    Object.keys(this.customLinePoints).forEach(lineKey => {
      if (lineKey === "fate" && this.selectedLines.fate === "fate_absent_or_faint") return;
      const pts = this.customLinePoints[lineKey];
      const color = pinColors[lineKey] || "#f5c542";

      pts.forEach((p, idx) => {
        const cp = this.toCanvasCoords(p);
        const isActive = this.activePin && this.activePin.lineKey === lineKey && this.activePin.pointIndex === idx;

        // Outer pulsing ring
        ctx.beginPath();
        ctx.arc(cp.x, cp.y, isActive ? 16 : 11, 0, Math.PI * 2);
        ctx.fillStyle = isActive ? "rgba(255, 255, 255, 0.4)" : "rgba(20, 10, 35, 0.85)";
        ctx.strokeStyle = color;
        ctx.lineWidth = isActive ? 3 : 2;
        ctx.shadowColor = color;
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.stroke();

        // Inner solid core dot
        ctx.beginPath();
        ctx.arc(cp.x, cp.y, isActive ? 6 : 4, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
      });
    });
  }

  // Update line landmark presets based on The Street Ratchada variations
  applyVariationPreset(lineKey, varId) {
    if (!this.customLinePoints[lineKey]) return;

    if (lineKey === "life") {
      if (varId === "life_short_or_broken") {
        this.customLinePoints.life[2] = { x: 0.36, y: 0.65 };
        this.customLinePoints.life[3] = { x: 0.39, y: 0.72 };
      } else {
        this.customLinePoints.life[2] = { x: 0.36, y: 0.72 };
        this.customLinePoints.life[3] = { x: 0.44, y: 0.88 };
      }
    } else if (lineKey === "head") {
      if (varId === "head_curved_down") {
        this.customLinePoints.head[2] = { x: 0.63, y: 0.66 };
        this.customLinePoints.head[3] = { x: 0.76, y: 0.76 };
      } else if (varId === "head_straight_long") {
        this.customLinePoints.head[2] = { x: 0.63, y: 0.57 };
        this.customLinePoints.head[3] = { x: 0.78, y: 0.60 };
      } else {
        this.customLinePoints.head[2] = { x: 0.63, y: 0.58 };
        this.customLinePoints.head[3] = { x: 0.76, y: 0.64 };
      }
    } else if (lineKey === "heart") {
      if (varId === "heart_straight_to_jupiter") {
        this.customLinePoints.heart[3] = { x: 0.32, y: 0.33 };
      } else if (varId === "heart_between_fingers") {
        this.customLinePoints.heart[3] = { x: 0.38, y: 0.30 };
      } else if (varId === "heart_curved_steep") {
        this.customLinePoints.heart[2] = { x: 0.50, y: 0.32 };
        this.customLinePoints.heart[3] = { x: 0.40, y: 0.25 };
      }
    } else if (lineKey === "fate") {
      if (varId === "fate_from_moon") {
        this.customLinePoints.fate[0] = { x: 0.66, y: 0.88 };
        this.customLinePoints.fate[1] = { x: 0.56, y: 0.68 };
      } else if (varId === "fate_from_life") {
        this.customLinePoints.fate[0] = { x: 0.39, y: 0.72 };
        this.customLinePoints.fate[1] = { x: 0.46, y: 0.58 };
      } else {
        this.customLinePoints.fate[0] = { x: 0.52, y: 0.88 };
        this.customLinePoints.fate[1] = { x: 0.51, y: 0.68 };
      }
    } else if (lineKey === "marriage") {
      if (varId === "marriage_forked_tail") {
        this.customLinePoints.marriage[1] = { x: 0.76, y: 0.37 };
      } else {
        this.customLinePoints.marriage[1] = { x: 0.78, y: 0.365 };
      }
    }
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
          this.applyVariationPreset(lineKey, v.id);
          this.redrawAnalysisCanvas();
        });

        chipsContainer.appendChild(chip);
      });

      section.innerHTML = titleHtml;
      section.appendChild(chipsContainer);
      this.refinementTabs.appendChild(section);
    });
  }

  showToast(msg) {
    if (this.app && typeof this.app.showToast === "function") {
      this.app.showToast(msg);
    }
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
      this.renderAnalysisCanvas(false, () => {
        this.renderPalmResults();
        this.switchPalmScreen("results");
      });

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
