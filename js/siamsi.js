/**
 * SIAMSI (เซียมซีหว่องไทซิน 100 ใบ เบอร์ 00 - 99)
 * ระบบเสี่ยงเซียมซีจำลองเสมือนจริง:
 * - รองรับเซนเซอร์ตรวจจับการเขย่าบนมือถือ (DeviceMotionEvent / Accelerometer)
 * - รองรับการใช้เมาส์คลิกค้างแล้วสะบัดเขย่าบนคอมพิวเตอร์ (Mouse Drag & Shake)
 * - รองรับปุ่มเขย่าอัตโนมัติ พร้อมเสียงไม้ไผ่กระทบกัน (Web Audio API)
 * - อนิเมชันไม้ติ้วค่อยๆ โผล่และหล่นลงบนแท่น
 * - แสดงผลคำทำนายครบถ้วน 7 ด้าน (อาชีพ, โชคลาภ, ความรัก, สุขภาพ, การเรียน, ครอบครัว, ภาพรวม)
 * - สารบัญค้นหาเบอร์ 00 - 99 หรือระบุเบอร์ที่ต้องการได้โดยตรง
 */

class SiamsiApp {
  constructor(tarotApp) {
    this.app = tarotApp;
    this.currentSign = null;
    this.isShaking = false;
    this.shakeProgress = 0; // 0 to 100%
    this.shakeRequirement = 100;
    this.droppedStickNum = null;
    this.selectedAspect = "all";

    // Motion Sensor state (Mobile)
    this.lastMotionTime = 0;
    this.lastX = null;
    this.lastY = null;
    this.lastZ = null;
    this.motionBoundHandler = null;
    this.isMotionListening = false;

    // Mouse Shake state (Desktop)
    this.isMouseDown = false;
    this.lastMouseX = 0;
    this.lastMouseY = 0;
    this.lastMouseTime = 0;
    this.mouseVelocity = 0;
    this.lastDirection = 0;

    this.initDOM();
    this.bindEvents();
    this.setupShakeSensors();
    this.checkUrlForSign();
  }

  get lang() {
    return this.app ? this.app.lang : (localStorage.getItem("mystic_lang") || "th");
  }

  initDOM() {
    // Mode Switcher Buttons in Top Nav
    this.modeTarotBtn = document.getElementById("mode-switch-tarot");
    this.modeSiamsiBtn = document.getElementById("mode-switch-siamsi");

    // Containers
    this.tarotContainer = document.getElementById("tarot-mode-container");
    this.siamsiContainer = document.getElementById("siamsi-mode-container");

    // Screens inside Siamsi Container
    this.screenShaking = document.getElementById("screen-siamsi-shaking");
    this.screenResult = document.getElementById("screen-siamsi-result");
    this.screenDirectory = document.getElementById("screen-siamsi-directory");

    // Shaking Screen Elements
    this.seekerNameInput = document.getElementById("siamsi-seeker-name");
    this.bambooCupWrapper = document.getElementById("siamsi-cylinder-wrapper");
    this.bambooCup = document.getElementById("siamsi-bamboo-cylinder");
    this.stickBundle = document.getElementById("siamsi-stick-bundle");
    this.emergingStick = document.getElementById("siamsi-emerging-stick");
    this.droppedStickContainer = document.getElementById("siamsi-dropped-stick-container");
    this.droppedStick = document.getElementById("siamsi-dropped-stick");
    this.droppedStickLabel = document.getElementById("siamsi-dropped-stick-label");

    // Shake progress meter
    this.shakeProgressBar = document.getElementById("siamsi-shake-progress-fill");
    this.shakeHintText = document.getElementById("siamsi-shake-hint");
    this.btnAutoShake = document.getElementById("btn-siamsi-auto-shake");
    this.btnOpenReveal = document.getElementById("btn-siamsi-open-reveal");
    this.btnDirectNumber = document.getElementById("btn-open-direct-number-modal");
    this.btnOpenDirectory = document.getElementById("btn-open-siamsi-directory");

    // Result Screen Elements
    this.resultSeekerGreeting = document.getElementById("siamsi-result-seeker-greeting");
    this.resultBadgeLevel = document.getElementById("siamsi-result-level-badge");
    this.resultNumberBadge = document.getElementById("siamsi-result-number-badge");
    this.resultChineseTitle = document.getElementById("siamsi-result-chinese-title");
    this.resultThaiTitle = document.getElementById("siamsi-result-thai-title");
    this.resultOneLine = document.getElementById("siamsi-result-oneline");
    this.resultPoemTh = document.getElementById("siamsi-result-poem-th");
    this.resultPoemCn = document.getElementById("siamsi-result-poem-cn");
    this.resultStoryText = document.getElementById("siamsi-result-story-text");
    this.aspectCardsContainer = document.getElementById("siamsi-aspects-grid");
    this.aspectFilterTabs = document.querySelectorAll(".siamsi-aspect-filter-chip");

    // Action buttons on Result
    this.btnReshake = document.getElementById("btn-siamsi-reshake");
    this.btnCopyResult = document.getElementById("btn-siamsi-copy-result");
    this.btnShareResult = document.getElementById("btn-siamsi-share-result");
    this.btnViewDirectoryFromResult = document.getElementById("btn-siamsi-view-directory");

    // Directory Screen Elements
    this.directoryGrid = document.getElementById("siamsi-directory-grid");
    this.directorySearchInput = document.getElementById("siamsi-directory-search");
    this.directoryLevelFilters = document.querySelectorAll(".siamsi-dir-filter-chip");
    this.btnBackFromDirectory = document.getElementById("btn-back-from-directory");

    // Direct Number Modal
    this.directNumberModal = document.getElementById("siamsi-direct-modal");
    this.directNumberInput = document.getElementById("siamsi-direct-num-input");
    this.btnConfirmDirectNum = document.getElementById("btn-confirm-direct-num");
    this.btnCloseDirectModal = document.getElementById("btn-close-direct-modal");
  }

  bindEvents() {
    // Mode Switching
    if (this.modeSiamsiBtn) {
      this.modeSiamsiBtn.addEventListener("click", () => this.switchToSiamsiMode());
    }
    if (this.modeTarotBtn) {
      this.modeTarotBtn.addEventListener("click", () => this.switchToTarotMode());
    }

    // Auto Shake Button (fallback or manual tap)
    if (this.btnAutoShake) {
      this.btnAutoShake.addEventListener("click", () => this.triggerAutoShake());
    }

    // Open Reveal Button (when stick drops)
    if (this.btnOpenReveal) {
      this.btnOpenReveal.addEventListener("click", () => {
        if (this.currentSign) {
          this.showResultScreen(this.currentSign);
        }
      });
    }

    // Reshake
    if (this.btnReshake) {
      this.btnReshake.addEventListener("click", () => this.resetToShakingScreen());
    }

    // Direct Number Modal
    if (this.btnDirectNumber) {
      this.btnDirectNumber.addEventListener("click", () => {
        if (this.directNumberModal) {
          this.directNumberModal.classList.add("active");
          if (this.directNumberInput) {
            this.directNumberInput.value = "";
            this.directNumberInput.focus();
          }
        }
      });
    }
    if (this.btnCloseDirectModal) {
      this.btnCloseDirectModal.addEventListener("click", () => {
        if (this.directNumberModal) this.directNumberModal.classList.remove("active");
      });
    }
    if (this.btnConfirmDirectNum) {
      this.btnConfirmDirectNum.addEventListener("click", () => this.handleDirectNumberSubmit());
    }
    if (this.directNumberInput) {
      this.directNumberInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") this.handleDirectNumberSubmit();
      });
    }

    // Directory
    if (this.btnOpenDirectory) {
      this.btnOpenDirectory.addEventListener("click", () => this.openDirectoryScreen());
    }
    if (this.btnViewDirectoryFromResult) {
      this.btnViewDirectoryFromResult.addEventListener("click", () => this.openDirectoryScreen());
    }
    if (this.btnBackFromDirectory) {
      this.btnBackFromDirectory.addEventListener("click", () => {
        if (this.currentSign) {
          this.showResultScreen(this.currentSign);
        } else {
          this.resetToShakingScreen();
        }
      });
    }

    // Directory search & filter
    if (this.directorySearchInput) {
      this.directorySearchInput.addEventListener("input", () => this.renderDirectoryGrid());
    }
    if (this.directoryLevelFilters) {
      this.directoryLevelFilters.forEach(chip => {
        chip.addEventListener("click", () => {
          this.directoryLevelFilters.forEach(c => c.classList.remove("active"));
          chip.classList.add("active");
          this.renderDirectoryGrid();
        });
      });
    }

    // Aspect Filter Tabs in Result
    if (this.aspectFilterTabs) {
      this.aspectFilterTabs.forEach(chip => {
        chip.addEventListener("click", () => {
          this.aspectFilterTabs.forEach(c => c.classList.remove("active"));
          chip.classList.add("active");
          this.selectedAspect = chip.getAttribute("data-aspect") || "all";
          this.filterAspectCards();
        });
      });
    }

    // Share & Copy
    if (this.btnCopyResult) {
      this.btnCopyResult.addEventListener("click", () => this.copyResultToClipboard());
    }
    if (this.btnShareResult) {
      this.btnShareResult.addEventListener("click", () => this.shareResult());
    }
  }

  // =========================================================================
  // MULTI-PLATFORM SHAKE SENSORS (MOBILE & DESKTOP)
  // =========================================================================

  setupShakeSensors() {
    // 1. Desktop Mouse Drag & Shake interaction
    if (this.bambooCupWrapper) {
      const startDrag = (e) => {
        if (this.isShaking || (this.screenShaking && !this.screenShaking.classList.contains("active"))) return;
        this.isMouseDown = true;
        const pt = e.touches ? e.touches[0] : e;
        this.lastMouseX = pt.clientX;
        this.lastMouseY = pt.clientY;
        this.lastMouseTime = performance.now();
        if (this.bambooCup) this.bambooCup.classList.add("mouse-dragging");
      };

      const doDrag = (e) => {
        if (!this.isMouseDown) return;
        const pt = e.touches ? e.touches[0] : e;
        const now = performance.now();
        const dt = (now - this.lastMouseTime) || 16;
        const dx = pt.clientX - this.lastMouseX;
        const dy = pt.clientY - this.lastMouseY;
        const dist = Math.hypot(dx, dy);
        const speed = dist / dt; // pixels per ms

        // Visual tilt following mouse
        const tiltX = Math.max(-25, Math.min(25, dx * 0.4));
        const tiltY = Math.max(-15, Math.min(15, -dy * 0.3));
        if (this.bambooCup) {
          this.bambooCup.style.transform = `perspective(800px) rotateY(${tiltX}deg) rotateX(${tiltY}deg) scale(1.03)`;
        }

        // Detect direction change with sufficient velocity -> counts as shake stroke
        const currentDirection = Math.sign(dy || dx);
        if (speed > 0.45 && currentDirection !== 0 && currentDirection !== this.lastDirection) {
          this.registerShakeBurst(Math.min(1.8, speed));
          this.lastDirection = currentDirection;
        }

        this.lastMouseX = pt.clientX;
        this.lastMouseY = pt.clientY;
        this.lastMouseTime = now;
      };

      const endDrag = () => {
        if (!this.isMouseDown) return;
        this.isMouseDown = false;
        if (this.bambooCup) {
          this.bambooCup.classList.remove("mouse-dragging");
          this.bambooCup.style.transform = "";
        }
      };

      this.bambooCupWrapper.addEventListener("mousedown", startDrag);
      window.addEventListener("mousemove", doDrag);
      window.addEventListener("mouseup", endDrag);

      this.bambooCupWrapper.addEventListener("touchstart", startDrag, { passive: true });
      window.addEventListener("touchmove", doDrag, { passive: true });
      window.addEventListener("touchend", endDrag);
    }

    // 2. Mobile Accelerometer Shake (DeviceMotionEvent)
    this.initMobileMotionSensor();
  }

  initMobileMotionSensor() {
    if (typeof window === "undefined" || !("DeviceMotionEvent" in window)) {
      return;
    }

    this.motionBoundHandler = (event) => {
      if (this.isShaking || !this.screenShaking || !this.screenShaking.classList.contains("active")) {
        return;
      }

      const acc = event.accelerationIncludingGravity || event.acceleration;
      if (!acc) return;

      const now = performance.now();
      if ((now - this.lastMotionTime) < 80) return; // limit sampling rate to ~12 Hz

      const x = acc.x || 0;
      const y = acc.y || 0;
      const z = acc.z || 0;

      if (this.lastX !== null) {
        const deltaX = Math.abs(x - this.lastX);
        const deltaY = Math.abs(y - this.lastY);
        const deltaZ = Math.abs(z - this.lastZ);
        const totalDelta = deltaX + deltaY + deltaZ;

        // Mobile shake threshold (typically > 14 - 18)
        if (totalDelta > 15) {
          const intensity = Math.min(2.0, totalDelta / 15);
          this.registerShakeBurst(intensity);
        }
      }

      this.lastX = x;
      this.lastY = y;
      this.lastZ = z;
      this.lastMotionTime = now;
    };
  }

  requestMotionPermissionIfNeeded() {
    if (typeof DeviceMotionEvent !== "undefined" && typeof DeviceMotionEvent.requestPermission === "function") {
      DeviceMotionEvent.requestPermission()
        .then(response => {
          if (response === "granted") {
            this.startListeningMotion();
          }
        })
        .catch(console.warn);
    } else {
      this.startListeningMotion();
    }
  }

  startListeningMotion() {
    if (this.isMotionListening || !this.motionBoundHandler) return;
    window.addEventListener("devicemotion", this.motionBoundHandler, false);
    this.isMotionListening = true;
  }

  stopListeningMotion() {
    if (!this.isMotionListening || !this.motionBoundHandler) return;
    window.removeEventListener("devicemotion", this.motionBoundHandler, false);
    this.isMotionListening = false;
  }

  registerShakeBurst(intensity = 1.0) {
    if (this.shakeProgress >= 100) return;

    // Increment progress
    const gain = Math.floor(12 * intensity);
    this.shakeProgress = Math.min(100, this.shakeProgress + gain);

    // Audio & Haptic Feedback
    if (window.mysticAudio) {
      window.mysticAudio.playBambooRattle(intensity);
    }
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(Math.min(50, Math.floor(20 * intensity)));
    }

    // Physical cylinder rattle animation
    if (this.bambooCup) {
      this.bambooCup.classList.add("rattling");
      clearTimeout(this._rattleTimeout);
      this._rattleTimeout = setTimeout(() => {
        if (this.bambooCup) this.bambooCup.classList.remove("rattling");
      }, 180);
    }

    // Animate stick bundle vibrating upward
    if (this.stickBundle) {
      const riseOffset = (this.shakeProgress / 100) * 28;
      this.stickBundle.style.transform = `translateY(-${riseOffset}px)`;
    }

    // Update progress meter
    this.updateShakeMeter();

    // Check if ready to drop stick
    if (this.shakeProgress >= 100) {
      this.finalizeStickDrop();
    }
  }

  updateShakeMeter() {
    if (this.shakeProgressBar) {
      this.shakeProgressBar.style.width = `${this.shakeProgress}%`;
    }
    if (this.shakeHintText) {
      if (this.shakeProgress < 30) {
        this.shakeHintText.textContent = this.lang === "th" 
          ? "🎋 เขย่ากระบอกเซียมซีต่อไปเรื่อยๆ..." 
          : "🎋 Keep shaking the bamboo cylinder...";
      } else if (this.shakeProgress < 75) {
        this.shakeHintText.textContent = this.lang === "th" 
          ? "✨ ไม้เซียมซีกำลังจะเลื่อนหลุดออกมาแล้ว!" 
          : "✨ A stick is about to slide out!";
      } else if (this.shakeProgress < 100) {
        this.shakeHintText.textContent = this.lang === "th" 
          ? "🌟 สมาธิตั้งมั่น อีกนิดเดียว..." 
          : "🌟 Hold your intention, almost there...";
      } else {
        this.shakeHintText.textContent = this.lang === "th" 
          ? "🎉 ไม้เซียมซีหล่นลงมาแล้ว!" 
          : "🎉 The fortune stick has fallen!";
      }
    }
  }

  triggerAutoShake() {
    if (this.isShaking || this.shakeProgress >= 100) return;
    this.isShaking = true;
    this.requestMotionPermissionIfNeeded();

    if (this.btnAutoShake) {
      this.btnAutoShake.disabled = true;
      this.btnAutoShake.classList.add("active");
    }

    if (this.bambooCup) {
      this.bambooCup.classList.add("auto-shaking-loop");
    }

    // Simulate rhythmic shaking over 2.2 seconds
    let elapsed = 0;
    const interval = 220; // ms
    const timer = setInterval(() => {
      elapsed += interval;
      this.registerShakeBurst(1.1);

      if (this.shakeProgress >= 100 || elapsed >= 2400) {
        clearInterval(timer);
        this.shakeProgress = 100;
        this.updateShakeMeter();
        if (this.bambooCup) this.bambooCup.classList.remove("auto-shaking-loop");
        if (this.btnAutoShake) {
          this.btnAutoShake.disabled = false;
          this.btnAutoShake.classList.remove("active");
        }
        this.isShaking = false;
        this.finalizeStickDrop();
      }
    }, interval);
  }

  finalizeStickDrop() {
    this.stopListeningMotion();

    // Select random sign from SIAMSI_DATA
    if (!window.SIAMSI_DATA || window.SIAMSI_DATA.length === 0) {
      console.error("SIAMSI_DATA is missing or empty!");
      return;
    }

    const randomIndex = Math.floor(Math.random() * window.SIAMSI_DATA.length);
    const sign = window.SIAMSI_DATA[randomIndex];
    this.currentSign = sign;

    // Emergence animation
    if (this.emergingStick) {
      this.emergingStick.classList.add("emerging");
    }

    // After 600ms, stick falls to mat
    setTimeout(() => {
      if (window.mysticAudio) {
        window.mysticAudio.playStickDrop();
      }

      if (this.emergingStick) {
        this.emergingStick.classList.remove("emerging");
      }

      if (this.droppedStickContainer && this.droppedStickLabel) {
        this.droppedStickContainer.classList.add("visible");
        this.droppedStickLabel.textContent = `เบอร์ ${sign.number}`;
      }

      // Gong chime after stick settles
      setTimeout(() => {
        if (window.mysticAudio) {
          window.mysticAudio.playGongChime(260, 2.5);
        }
        if (this.btnOpenReveal) {
          this.btnOpenReveal.classList.add("active");
          this.btnOpenReveal.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 500);

    }, 600);
  }

  // =========================================================================
  // RESULT SCREEN DISPLAY
  // =========================================================================

  showResultScreen(sign) {
    if (!sign) return;
    this.currentSign = sign;

    // Switch views
    if (this.screenShaking) this.screenShaking.classList.remove("active");
    if (this.screenDirectory) this.screenDirectory.classList.remove("active");
    if (this.screenResult) this.screenResult.classList.add("active");

    // Scroll to top of results
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Seeker Name greeting
    const seekerName = (this.seekerNameInput && this.seekerNameInput.value.trim()) 
      ? this.seekerNameInput.value.trim() 
      : (this.app ? this.app.seekerName : "");
    if (this.resultSeekerGreeting) {
      this.resultSeekerGreeting.textContent = seekerName 
        ? `ชะตาแห่งสวรรค์สำหรับคุณ "${seekerName}"`
        : "ชะตาแห่งสวรรค์สำหรับท่านผู้ขอพร";
    }

    // Number badge (เบอร์ 00 - 99 & ใบที่ 1 - 100)
    if (this.resultNumberBadge) {
      this.resultNumberBadge.textContent = `เบอร์ ${sign.number} (ใบที่ ${sign.stick_num || sign.id})`;
    }

    // Fortune level badge
    const levelConf = (window.SIAMSI_LEVEL_CONFIG && window.SIAMSI_LEVEL_CONFIG[sign.fortune_level]) || {
      badgeClass: "fortune-level-good",
      icon: "✨",
      color: "#ffd700",
      bg: "rgba(255, 215, 0, 0.15)",
      border: "rgba(255, 215, 0, 0.5)"
    };

    if (this.resultBadgeLevel) {
      this.resultBadgeLevel.className = `siamsi-level-badge ${levelConf.badgeClass}`;
      this.resultBadgeLevel.innerHTML = `<span class="level-icon">${levelConf.icon}</span> <span>${sign.fortune_level}</span>`;
      this.resultBadgeLevel.style.borderColor = levelConf.border;
      this.resultBadgeLevel.style.backgroundColor = levelConf.bg;
      this.resultBadgeLevel.style.color = levelConf.color;
    }

    // Titles
    if (this.resultChineseTitle) {
      this.resultChineseTitle.textContent = sign.chinese_title || "";
    }
    if (this.resultThaiTitle) {
      this.resultThaiTitle.textContent = sign.thai_title || "";
    }

    // One line summary
    if (this.resultOneLine) {
      this.resultOneLine.textContent = sign.one_line_summary ? `"${sign.one_line_summary}"` : "";
    }

    // Thai poem lines
    if (this.resultPoemTh) {
      this.resultPoemTh.innerHTML = "";
      if (Array.isArray(sign.poem_th)) {
        sign.poem_th.forEach(line => {
          const p = document.createElement("p");
          p.className = "poem-verse-line";
          p.textContent = line;
          this.resultPoemTh.appendChild(p);
        });
      }
    }

    // Chinese original poem
    if (this.resultPoemCn) {
      this.resultPoemCn.textContent = sign.poem_cn || "";
    }

    // Story / Legend
    if (this.resultStoryText) {
      this.resultStoryText.innerHTML = "";
      if (sign.story) {
        const paragraphs = sign.story.split("\n\n");
        paragraphs.forEach(text => {
          if (text.trim()) {
            const p = document.createElement("p");
            p.textContent = text.trim();
            this.resultStoryText.appendChild(p);
          }
        });
      }
    }

    // Render 7 Aspects Cards
    this.renderAspectCards(sign);

    // Update URL hash for sharing / bookmarking
    try {
      history.replaceState(null, "", `#siamsi=${sign.number}`);
    } catch (e) {}
  }

  renderAspectCards(sign) {
    if (!this.aspectCardsContainer || !sign.aspects) return;
    this.aspectCardsContainer.innerHTML = "";

    const aspectIcons = {
      career: { icon: "💼", label: "อาชีพการงาน" },
      wealth: { icon: "💰", label: "โชคลาภและการเงิน" },
      love: { icon: "❤️", label: "ความรักและคู่ครอง" },
      health: { icon: "🌿", label: "สุขภาพและพลานามัย" },
      study: { icon: "🎓", label: "การเรียนและการสอบ" },
      home: { icon: "🏡", label: "ครอบครัวและเคหสถาน" },
      general: { icon: "🔮", label: "ภาพรวมและเรื่องทั่วไป" }
    };

    const keys = ["career", "wealth", "love", "health", "study", "home", "general"];

    keys.forEach(key => {
      const data = sign.aspects[key];
      if (!data) return;

      const meta = aspectIcons[key] || { icon: "✦", label: key };
      const card = document.createElement("div");
      card.className = "siamsi-aspect-card";
      card.setAttribute("data-aspect-type", key);

      card.innerHTML = `
        <div class="aspect-card-header">
          <div class="aspect-header-title">
            <span class="aspect-icon">${meta.icon}</span>
            <h4 class="aspect-title">${meta.label}</h4>
          </div>
          <span class="aspect-toggle-icon">▾</span>
        </div>
        <div class="aspect-card-body">
          <div class="aspect-summary-callout">
            <p>${data.summary || data.name || ""}</p>
          </div>
          ${data.detail && data.detail !== data.summary ? `
            <div class="aspect-deep-detail">
              ${data.detail.split("\n\n").map(p => `<p>${p}</p>`).join("")}
            </div>
          ` : ""}
        </div>
      `;

      // Accordion toggle on click
      const header = card.querySelector(".aspect-card-header");
      header.addEventListener("click", () => {
        card.classList.toggle("collapsed");
      });

      this.aspectCardsContainer.appendChild(card);
    });

    this.filterAspectCards();
  }

  filterAspectCards() {
    if (!this.aspectCardsContainer) return;
    const cards = this.aspectCardsContainer.querySelectorAll(".siamsi-aspect-card");
    cards.forEach(card => {
      const type = card.getAttribute("data-aspect-type");
      if (this.selectedAspect === "all" || this.selectedAspect === type) {
        card.style.display = "";
      } else {
        card.style.display = "none";
      }
    });
  }

  resetToShakingScreen() {
    this.isShaking = false;
    this.shakeProgress = 0;
    this.droppedStickNum = null;
    this.updateShakeMeter();

    if (this.bambooCup) {
      this.bambooCup.style.transform = "";
      this.bambooCup.classList.remove("rattling", "auto-shaking-loop");
    }
    if (this.stickBundle) {
      this.stickBundle.style.transform = "";
    }
    if (this.emergingStick) {
      this.emergingStick.classList.remove("emerging");
    }
    if (this.droppedStickContainer) {
      this.droppedStickContainer.classList.remove("visible");
    }
    if (this.btnOpenReveal) {
      this.btnOpenReveal.classList.remove("active");
    }

    if (this.screenResult) this.screenResult.classList.remove("active");
    if (this.screenDirectory) this.screenDirectory.classList.remove("active");
    if (this.screenShaking) this.screenShaking.classList.add("active");

    window.scrollTo({ top: 0, behavior: "smooth" });
    this.startListeningMotion();
  }

  // =========================================================================
  // DIRECT NUMBER MODAL
  // =========================================================================

  handleDirectNumberSubmit() {
    if (!this.directNumberInput) return;
    const rawVal = this.directNumberInput.value.trim();
    if (!rawVal) return;

    let targetSign = null;
    const num = parseInt(rawVal, 10);

    // Try finding by number ("00" to "99") or by id (1 to 100)
    if (window.SIAMSI_BY_NUMBER) {
      const padNum = rawVal.length === 1 ? `0${rawVal}` : rawVal;
      targetSign = window.SIAMSI_BY_NUMBER[padNum] || window.SIAMSI_BY_ID[num];
    }

    if (targetSign) {
      if (this.directNumberModal) this.directNumberModal.classList.remove("active");
      this.showResultScreen(targetSign);
    } else {
      alert("กรุณาระบุตัวเลขระหว่าง 00 ถึง 99 หรือ 1 ถึง 100");
    }
  }

  // =========================================================================
  // 100 SIGNS DIRECTORY SCREEN
  // =========================================================================

  openDirectoryScreen() {
    if (this.screenShaking) this.screenShaking.classList.remove("active");
    if (this.screenResult) this.screenResult.classList.remove("active");
    if (this.screenDirectory) this.screenDirectory.classList.add("active");

    window.scrollTo({ top: 0, behavior: "smooth" });
    this.renderDirectoryGrid();
  }

  renderDirectoryGrid() {
    if (!this.directoryGrid || !window.SIAMSI_DATA) return;
    this.directoryGrid.innerHTML = "";

    const query = this.directorySearchInput ? this.directorySearchInput.value.trim().toLowerCase() : "";
    let activeLevel = "all";
    if (this.directoryLevelFilters) {
      const activeChip = Array.from(this.directoryLevelFilters).find(c => c.classList.contains("active"));
      if (activeChip) activeLevel = activeChip.getAttribute("data-level") || "all";
    }

    const filtered = window.SIAMSI_DATA.filter(sign => {
      const matchLevel = (activeLevel === "all") || (sign.fortune_level === activeLevel);
      if (!matchLevel) return false;

      if (!query) return true;
      const textToSearch = `${sign.number} ${sign.id} ${sign.stick_num} ${sign.thai_title} ${sign.chinese_title} ${sign.fortune_level} ${sign.one_line_summary}`.toLowerCase();
      return textToSearch.includes(query);
    });

    if (filtered.length === 0) {
      this.directoryGrid.innerHTML = `
        <div class="directory-empty-state">
          <p>ไม่พบใบเซียมซีที่ตรงกับการค้นหา</p>
        </div>
      `;
      return;
    }

    filtered.forEach(sign => {
      const card = document.createElement("div");
      card.className = "siamsi-dir-card";
      
      const levelConf = (window.SIAMSI_LEVEL_CONFIG && window.SIAMSI_LEVEL_CONFIG[sign.fortune_level]) || {
        badgeClass: "fortune-level-good",
        icon: "✨",
        color: "#ffd700"
      };

      card.innerHTML = `
        <div class="dir-card-num-badge">เบอร์ ${sign.number}</div>
        <div class="dir-card-level-tag ${levelConf.badgeClass}">
          <span>${levelConf.icon}</span> <span>${sign.fortune_level}</span>
        </div>
        <div class="dir-card-titles">
          <h4 class="dir-chinese">${sign.chinese_title}</h4>
          <p class="dir-thai">${sign.thai_title}</p>
        </div>
        <p class="dir-summary">${sign.one_line_summary || ""}</p>
      `;

      card.addEventListener("click", () => {
        this.showResultScreen(sign);
      });

      this.directoryGrid.appendChild(card);
    });
  }

  // =========================================================================
  // COPY & SHARE
  // =========================================================================

  copyResultToClipboard() {
    if (!this.currentSign) return;
    const sign = this.currentSign;
    const poem = Array.isArray(sign.poem_th) ? sign.poem_th.join("\n") : "";
    const text = `🎋 ผลการเสี่ยงเซียมซีหว่องไทซิน
เบอร์ ${sign.number} (ใบที่ ${sign.stick_num || sign.id})
✨ ระดับ: ${sign.fortune_level}
📜 ${sign.chinese_title} (${sign.thai_title})
💡 สรุป: ${sign.one_line_summary}

บทกลอน:
${poem}

💼 อาชีพ: ${sign.aspects.career ? sign.aspects.career.summary : "-"}
💰 โชคลาภ: ${sign.aspects.wealth ? sign.aspects.wealth.summary : "-"}
❤️ ความรัก: ${sign.aspects.love ? sign.aspects.love.summary : "-"}
🌿 สุขภาพ: ${sign.aspects.health ? sign.aspects.health.summary : "-"}

เสี่ยงเซียมซีออนไลน์ได้ที่: ${window.location.origin}${window.location.pathname}#siamsi=${sign.number}`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        if (this.app) this.app.showToast("📋 คัดลอกคำทำนายเซียมซีเรียบร้อยแล้ว");
      });
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      if (this.app) this.app.showToast("📋 คัดลอกคำทำนายเซียมซีเรียบร้อยแล้ว");
    }
  }

  shareResult() {
    if (!this.currentSign) return;
    const sign = this.currentSign;
    const shareUrl = `${window.location.origin}${window.location.pathname}#siamsi=${sign.number}`;
    if (navigator.share) {
      navigator.share({
        title: `เซียมซีเบอร์ ${sign.number} - ${sign.thai_title}`,
        text: `ได้เซียมซีเบอร์ ${sign.number} (${sign.fortune_level}): ${sign.one_line_summary}`,
        url: shareUrl
      }).catch(() => {});
    } else {
      this.copyResultToClipboard();
    }
  }

  // =========================================================================
  // URL HASH CHECK
  // =========================================================================

  checkUrlForSign() {
    const hash = window.location.hash;
    if (hash && hash.includes("siamsi=")) {
      const match = hash.match(/siamsi=([0-9a-zA-Z]+)/);
      if (match && match[1] && window.SIAMSI_BY_NUMBER) {
        const signNum = match[1].padStart(2, "0");
        const sign = window.SIAMSI_BY_NUMBER[signNum] || window.SIAMSI_BY_ID[parseInt(signNum, 10)];
        if (sign) {
          setTimeout(() => {
            this.switchToSiamsiMode();
            this.showResultScreen(sign);
          }, 300);
        }
      }
    }
  }

  // =========================================================================
  // MODE SWITCHING (TAROT <-> SIAMSI)
  // =========================================================================

  switchToSiamsiMode() {
    if (this.modeTarotBtn) this.modeTarotBtn.classList.remove("active");
    if (this.modeSiamsiBtn) this.modeSiamsiBtn.classList.add("active");

    if (this.tarotContainer) this.tarotContainer.style.display = "none";
    if (this.siamsiContainer) this.siamsiContainer.style.display = "block";

    // Set seeker name from Tarot if available
    if (this.app && this.app.seekerName && this.seekerNameInput && !this.seekerNameInput.value) {
      this.seekerNameInput.value = this.app.seekerName;
    }

    this.startListeningMotion();
  }

  switchToTarotMode() {
    this.stopListeningMotion();

    if (this.modeSiamsiBtn) this.modeSiamsiBtn.classList.remove("active");
    if (this.modeTarotBtn) this.modeTarotBtn.classList.add("active");

    if (this.siamsiContainer) this.siamsiContainer.style.display = "none";
    if (this.tarotContainer) this.tarotContainer.style.display = "block";

    // Transfer seeker name back to Tarot if filled
    if (this.seekerNameInput && this.seekerNameInput.value.trim() && this.app) {
      this.app.seekerName = this.seekerNameInput.value.trim();
      const tarotInput = document.getElementById("seeker-name-input");
      if (tarotInput) tarotInput.value = this.app.seekerName;
    }
  }
}

window.SiamsiApp = SiamsiApp;
