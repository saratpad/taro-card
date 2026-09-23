/**
 * SIAMSI (เซียมซีหว่องไทซิน 100 ใบ เบอร์ 00 - 99)
 * ระบบเสี่ยงเซียมซีจำลองเสมือนจริง:
 * - อนิเมชันไม้ติ้วกระเด้งลอยละลิ่วหล่นลงมากระทบแท่นบูชาสมจริง (3D Physics Flight & Multi-stage Bounce)
 * - แสดงเลขเซียมซีที่ได้ชัดเจน ทั้งบนไม้ติ้วและป้ายประกาศมงคล
 * - คำนวณและแสดงผลคำทำนายครบถ้วน 7 ด้านตามตำรา kaucim.ai (อาชีพ, โชคลาภ, ความรัก, สุขภาพ, การเรียน, ครอบครัว, ภาพรวม)
 * - รองรับ 2 ภาษาอย่างสมบูรณ์ (TH / EN) สลับภาษาคำทำนายได้ทันทีตามที่ผู้ใช้เลือก
 * - เพิ่มความยากในการเขย่าให้เต็มหลอดนานขึ้น (~30 วินาที)
 * - กลไก Decay Loop: หากหยุดเขย่า หลอดพลังจะค่อยๆ ลดลงอัตโนมัติ
 * - ระบบเสียงไม้ไผ่กระทบกันสมจริงตลอดการเขย่า (Web Audio API)
 * - ปุ่ม "เขย่าใหม่" รีเซ็ตการเขย่าเพื่อเริ่มต้นใหม่ได้ทุกขณะ
 * - รองรับเซนเซอร์ตรวจจับการเขย่าบนมือถือ (DeviceMotionEvent) และการลากสะบัดเมาส์บนคอมพิวเตอร์
 * - สารบัญค้นหาเบอร์ 00 - 99 หรือระบุเบอร์ที่ต้องการได้โดยตรง
 */

class SiamsiApp {
  constructor(tarotApp) {
    this.app = tarotApp;
    this.currentSign = null;
    this.isShaking = false;
    this.isAutoShaking = false;
    this.isStickDropped = false;
    this.shakeProgress = 0; // 0 to 100%
    this.lastShakeActionTime = 0;
    this._autoShakeTimer = null;
    this._decayInterval = null;
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
    this.lastDirection = 0;

    this.initDOM();
    this.bindEvents();
    this.setupShakeSensors();
    this.startDecayLoop();
    this.checkUrlForSign();
  }

  get lang() {
    return this.app ? this.app.lang : (localStorage.getItem("mystic_lang") || "th");
  }

  getData() {
    if (typeof window !== "undefined" && window.SIAMSI_DATA && window.SIAMSI_DATA.length > 0) {
      return window.SIAMSI_DATA;
    }
    if (typeof SIAMSI_DATA !== "undefined" && SIAMSI_DATA && SIAMSI_DATA.length > 0) {
      return SIAMSI_DATA;
    }
    return [];
  }

  getSignByNumberOrId(query) {
    if (!query && query !== 0) return null;
    const str = String(query).trim();
    const pad = str.padStart(2, "0");

    const byNum = (typeof window !== "undefined" && window.SIAMSI_BY_NUMBER) 
      ? window.SIAMSI_BY_NUMBER 
      : (typeof SIAMSI_BY_NUMBER !== "undefined" ? SIAMSI_BY_NUMBER : null);

    const byId = (typeof window !== "undefined" && window.SIAMSI_BY_ID) 
      ? window.SIAMSI_BY_ID 
      : (typeof SIAMSI_BY_ID !== "undefined" ? SIAMSI_BY_ID : null);

    if (byNum && byNum[pad]) return byNum[pad];
    if (byNum && byNum[str]) return byNum[str];
    const intVal = parseInt(str, 10);
    if (byId && byId[intVal]) return byId[intVal];

    // Direct linear search fallback
    const all = this.getData();
    return all.find(s => s.number === pad || s.number === str || s.id === intVal || s.stick_num === intVal) || null;
  }

  getLevelConfig(levelName) {
    const defaultConf = {
      badgeClass: "fortune-level-good",
      icon: "✨",
      color: "#ffd700",
      bg: "rgba(255, 215, 0, 0.15)",
      border: "rgba(255, 215, 0, 0.5)",
      th: "ค่อนข้างดี",
      en: "Good"
    };

    const configs = (typeof window !== "undefined" && window.SIAMSI_LEVEL_CONFIG)
      ? window.SIAMSI_LEVEL_CONFIG
      : (typeof SIAMSI_LEVEL_CONFIG !== "undefined" ? SIAMSI_LEVEL_CONFIG : {});

    return configs[levelName] || defaultConf;
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
    this.risingStick = document.getElementById("siamsi-rising-stick");

    // Flying Projectile Stick Stage
    this.flyingStage = document.getElementById("siamsi-flying-stick-stage");
    this.projectileStick = document.getElementById("siamsi-projectile-stick");
    this.projectileNumber = document.getElementById("projectile-number");
    this.projectileChinese = document.getElementById("projectile-chinese");
    this.projectileShadow = document.getElementById("siamsi-projectile-shadow");
    this.impactSparkles = document.getElementById("siamsi-impact-sparkles");

    // Fallen Stick Mat Display & Revelation Banner
    this.droppedStickContainer = document.getElementById("siamsi-dropped-stick-container");
    this.revelationBanner = document.getElementById("siamsi-revelation-banner");
    this.revNumberHighlight = document.getElementById("rev-number-highlight");
    this.revStickId = document.getElementById("rev-stick-id");
    this.revLevelBadge = document.getElementById("rev-level-badge");
    this.revTitles = document.getElementById("rev-titles");

    this.altarRedMat = document.getElementById("altar-red-mat");
    this.droppedStick = document.getElementById("siamsi-dropped-stick");
    this.droppedStickLabel = document.getElementById("siamsi-dropped-stick-label");
    this.fallenStickThaiTitle = document.getElementById("fallen-stick-thai-title");
    this.fallenStickChineseTag = document.getElementById("fallen-stick-chinese-tag");

    // Shake progress meter & Action Buttons
    this.shakeProgressBar = document.getElementById("siamsi-shake-progress-fill");
    this.shakeHintText = document.getElementById("siamsi-shake-hint");
    this.btnAutoShake = document.getElementById("btn-siamsi-auto-shake");
    this.btnResetShake = document.getElementById("btn-siamsi-reset-shake");
    this.btnOpenReveal = document.getElementById("btn-siamsi-open-reveal");
    this.btnOpenRevealLabel = document.getElementById("btn-open-reveal-label");
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

    // Auto Shake Button (ritual prayer loop ~30s)
    if (this.btnAutoShake) {
      this.btnAutoShake.addEventListener("click", () => this.triggerAutoShake());
    }

    // Reset Shake Button ("เขย่าใหม่")
    if (this.btnResetShake) {
      this.btnResetShake.addEventListener("click", () => this.resetShakeAltar());
    }

    // Open Reveal Button (when stick drops)
    if (this.btnOpenReveal) {
      this.btnOpenReveal.addEventListener("click", () => {
        if (this.currentSign) {
          this.showResultScreen(this.currentSign);
        }
      });
    }

    // Direct click on Altar Mat or Fallen Stick ALSO opens result immediately
    if (this.altarRedMat) {
      this.altarRedMat.addEventListener("click", () => {
        if (this.currentSign) {
          this.showResultScreen(this.currentSign);
        }
      });
    }

    // Reshake from Result Screen
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
        if (this.isShaking && !this.isMouseDown) return;
        if (this.screenShaking && !this.screenShaking.classList.contains("active")) return;
        if (window.mysticAudio && window.mysticAudio.init) {
          window.mysticAudio.init();
        }
        this.isMouseDown = true;
        const pt = e.touches ? e.touches[0] : e;
        this.lastMouseX = pt.clientX;
        this.lastMouseY = pt.clientY;
        this.lastMouseTime = performance.now();
      };

      const doDrag = (e) => {
        if (!this.isMouseDown || this.isStickDropped) return;
        const pt = e.touches ? e.touches[0] : e;
        const now = performance.now();
        const dt = (now - this.lastMouseTime) || 16;
        const dx = pt.clientX - this.lastMouseX;
        const dy = pt.clientY - this.lastMouseY;
        const dist = Math.hypot(dx, dy);
        const speed = dist / dt; // pixels per ms

        // Visual tilt following mouse motion
        const tiltX = Math.max(-28, Math.min(28, dx * 0.45));
        const tiltY = Math.max(-18, Math.min(22, -dy * 0.35 + 10));
        if (this.bambooCup) {
          this.bambooCup.style.transform = `perspective(900px) rotateY(${tiltX}deg) rotateX(${tiltY}deg) scale(1.03)`;
        }

        // Detect direction reversal with sufficient speed -> counts as shake stroke
        const currentDirection = Math.sign(dy || dx);
        if (speed > 0.38 && currentDirection !== 0 && currentDirection !== this.lastDirection) {
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
        if (this.bambooCup && !this.isAutoShaking) {
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
      if (this.isStickDropped || !this.screenShaking || !this.screenShaking.classList.contains("active")) {
        return;
      }

      const acc = event.accelerationIncludingGravity || event.acceleration;
      if (!acc) return;

      const now = performance.now();
      if ((now - this.lastMotionTime) < 90) return; // rate limit sample window

      const x = acc.x || 0;
      const y = acc.y || 0;
      const z = acc.z || 0;

      if (this.lastX !== null) {
        const deltaX = Math.abs(x - this.lastX);
        const deltaY = Math.abs(y - this.lastY);
        const deltaZ = Math.abs(z - this.lastZ);
        const totalDelta = deltaX + deltaY + deltaZ;

        // Mobile shake threshold
        if (totalDelta > 13) {
          const intensity = Math.min(1.8, totalDelta / 14);
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

  // =========================================================================
  // SHAKE BURST, SOUND & DECAY SYSTEM (~30 SECONDS TO FILL)
  // =========================================================================

  registerShakeBurst(intensity = 1.0) {
    if (this.shakeProgress >= 100 || this.isStickDropped) return;

    // Calibrated progress gain: requires ~75-80 continuous shakes (~30s of shaking)
    const gain = Math.max(0.65, Math.min(1.85, 1.25 * intensity));
    this.shakeProgress = Math.min(100, this.shakeProgress + gain);
    this.lastShakeActionTime = Date.now();

    // Bamboo rattling sound on every shake burst
    if (window.mysticAudio && window.mysticAudio.playBambooRattle) {
      window.mysticAudio.playBambooRattle(intensity);
    }
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(Math.min(45, Math.floor(20 * intensity)));
    }

    // Physical cylinder rattle animation
    if (this.bambooCup) {
      this.bambooCup.classList.add("rattling");
      clearTimeout(this._rattleTimeout);
      this._rattleTimeout = setTimeout(() => {
        if (this.bambooCup && !this.isAutoShaking) {
          this.bambooCup.classList.remove("rattling");
        }
      }, 180);
    }

    // Rising stick slides higher proportionally
    if (this.risingStick) {
      const riseOffset = (this.shakeProgress / 100) * 44;
      this.risingStick.style.transform = `translateX(-50%) translateY(-${riseOffset.toFixed(1)}px)`;
    }

    // Update progress meter
    this.updateShakeMeter();

    // Check if ready to drop stick
    if (this.shakeProgress >= 100) {
      this.finalizeStickDrop();
    }
  }

  /**
   * Continuous Decay Loop:
   * If the user stops shaking for > 650ms, energy drains slowly (~3.6% per second)
   * Lowering the stick and draining the gauge until shaken again.
   */
  startDecayLoop() {
    if (this._decayInterval) clearInterval(this._decayInterval);
    this._decayInterval = setInterval(() => {
      if (!this.screenShaking || !this.screenShaking.classList.contains("active")) return;
      if (this.isAutoShaking || this.isStickDropped || this.shakeProgress <= 0 || this.shakeProgress >= 100) return;

      const idleMs = Date.now() - (this.lastShakeActionTime || 0);
      if (idleMs > 650) {
        // Decay by 0.36% every 100ms (~3.6% per second)
        this.shakeProgress = Math.max(0, this.shakeProgress - 0.36);

        if (this.shakeProgressBar) {
          this.shakeProgressBar.style.width = `${this.shakeProgress.toFixed(1)}%`;
        }
        if (this.risingStick) {
          const riseOffset = (this.shakeProgress / 100) * 44;
          this.risingStick.style.transform = `translateX(-50%) translateY(-${riseOffset.toFixed(1)}px)`;
        }

        // Show decaying warning hint
        if (this.shakeHintText && this.shakeProgress > 0) {
          this.shakeHintText.textContent = this.lang === "en"
            ? `⏳ Paused... Energy is decaying (${Math.round(this.shakeProgress)}%)! Keep shaking continuously!`
            : `⏳ หยุดเขย่า... หลอดกำลังลดลง (${Math.round(this.shakeProgress)}%)! เขย่ากระบอกอย่างต่อเนื่อง!`;
        }
      }
    }, 100);
  }

  updateShakeMeter() {
    if (this.shakeProgressBar) {
      this.shakeProgressBar.style.width = `${this.shakeProgress.toFixed(1)}%`;
    }
    if (this.shakeHintText) {
      const isEn = this.lang === "en";
      if (this.shakeProgress === 0) {
        this.shakeHintText.textContent = isEn
          ? "📱 Shake your phone or 🖱️ Click & hold while shaking your mouse (~30s)"
          : "📱 เขย่ามือถือของคุณ หรือ 🖱️ คลิกค้างแล้วสะบัดเมาส์เขย่ากระบอก (ประมาณ 30 วิ)";
      } else if (this.shakeProgress < 30) {
        this.shakeHintText.textContent = isEn
          ? "🎋 Keep shaking continuously... (~30 seconds needed)"
          : "🎋 เขย่ากระบอกเซียมซีต่อไปเรื่อยๆ... (ใช้เวลาประมาณ 30 วินาที)";
      } else if (this.shakeProgress < 70) {
        this.shakeHintText.textContent = isEn
          ? "✨ Bamboo sticks are vibrating and rising upward!"
          : "✨ แท่งไม้กำลังสั่นไหวและเลื่อนโผล่ขึ้นมา!";
      } else if (this.shakeProgress < 99) {
        this.shakeHintText.textContent = isEn
          ? "🌟 Focus your divine intent, a stick is about to leap out..."
          : "🌟 สมาธิตั้งมั่น อีกนิดเดียวไม้จะกระเด้งหล่นแล้ว...";
      } else {
        this.shakeHintText.textContent = isEn
          ? "🎉 The fortune stick has fallen onto the altar!"
          : "🎉 ไม้เซียมซีหล่นลงมาแล้ว!";
      }
    }
  }

  /**
   * Sacred Prayer & Auto Shake Ritual (~29-30 seconds duration)
   * Plays rhythmic clatter sounds and smoothly increases gauge.
   * Can be cancelled or reset anytime via "เขย่าใหม่" button.
   */
  triggerAutoShake() {
    if (this.isShaking || this.isAutoShaking || this.shakeProgress >= 100 || this.isStickDropped) return;
    this.isAutoShaking = true;
    this.isShaking = true;
    this.requestMotionPermissionIfNeeded();

    if (window.mysticAudio && window.mysticAudio.init) {
      window.mysticAudio.init();
    }

    if (this.btnAutoShake) {
      this.btnAutoShake.disabled = true;
      this.btnAutoShake.classList.add("active");
    }

    if (this.bambooCup) {
      this.bambooCup.classList.add("auto-shaking-loop");
    }

    let elapsed = 0;
    const totalDuration = 29000; // ~29 seconds
    const interval = 240; // ms per tick (~120 ticks)

    if (this._autoShakeTimer) clearInterval(this._autoShakeTimer);
    this._autoShakeTimer = setInterval(() => {
      elapsed += interval;
      const remainingSec = Math.max(1, Math.ceil((totalDuration - elapsed) / 1000));

      // Continuous rhythmic bamboo rattle sound
      if (window.mysticAudio && window.mysticAudio.playBambooRattle) {
        window.mysticAudio.playBambooRattle(1.0 + Math.random() * 0.4);
      }
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(20);
      }

      // Smooth progress calculation
      const targetProgress = Math.min(100, (elapsed / totalDuration) * 100);
      this.shakeProgress = targetProgress;
      this.lastShakeActionTime = Date.now();

      // Subtle physical cylinder rattle
      if (this.bambooCup) {
        this.bambooCup.classList.add("rattling");
        setTimeout(() => {
          if (this.bambooCup) this.bambooCup.classList.remove("rattling");
        }, 150);
      }

      // Protruding stick rises higher
      if (this.risingStick) {
        const riseOffset = (this.shakeProgress / 100) * 44;
        this.risingStick.style.transform = `translateX(-50%) translateY(-${riseOffset.toFixed(1)}px)`;
      }

      if (this.shakeProgressBar) {
        this.shakeProgressBar.style.width = `${this.shakeProgress.toFixed(1)}%`;
      }

      // Countdown hint
      if (this.shakeHintText) {
        this.shakeHintText.textContent = this.lang === "en"
          ? `🎋 Focusing intent & rattling sacred bamboo... (${remainingSec}s remaining)`
          : `🎋 กำลังตั้งจิตอธิษฐานและเขย่ากระบอกเซียมซี... (เหลืออีกประมาณ ${remainingSec} วินาที)`;
      }

      if (this.shakeProgress >= 100 || elapsed >= totalDuration) {
        clearInterval(this._autoShakeTimer);
        this._autoShakeTimer = null;
        this.shakeProgress = 100;
        this.isAutoShaking = false;
        this.isShaking = false;

        if (this.bambooCup) this.bambooCup.classList.remove("auto-shaking-loop");
        if (this.btnAutoShake) {
          this.btnAutoShake.disabled = false;
          this.btnAutoShake.classList.remove("active");
        }
        this.finalizeStickDrop();
      }
    }, interval);
  }

  /**
   * Reset Shaking Altar ("เขย่าใหม่" Button)
   * Cancels in-progress auto-shaking, resets gauge to 0%, restores cylinder and stick
   */
  resetShakeAltar() {
    if (this._autoShakeTimer) {
      clearInterval(this._autoShakeTimer);
      this._autoShakeTimer = null;
    }
    this.isAutoShaking = false;
    this.isShaking = false;
    this.isStickDropped = false;
    this.shakeProgress = 0;
    this.lastShakeActionTime = 0;

    if (this.btnAutoShake) {
      this.btnAutoShake.disabled = false;
      this.btnAutoShake.classList.remove("active");
    }

    if (this.bambooCup) {
      this.bambooCup.style.transform = "";
      this.bambooCup.classList.remove("rattling", "auto-shaking-loop", "cylinder-eject-thrust");
    }
    if (this.stickBundle) {
      this.stickBundle.style.transform = "";
    }
    if (this.risingStick) {
      this.risingStick.style.transform = "";
    }
    if (this.flyingStage) {
      this.flyingStage.classList.remove("active", "animating");
    }
    if (this.impactSparkles) {
      this.impactSparkles.classList.remove("burst");
    }
    if (this.droppedStickContainer) {
      this.droppedStickContainer.classList.remove("visible");
    }

    this.updateShakeMeter();

    if (window.mysticAudio && window.mysticAudio.playBambooRattle) {
      window.mysticAudio.playBambooRattle(0.7);
    }
    this.startListeningMotion();
  }

  // =========================================================================
  // REALISTIC PHYSICS STICK DROP (EJECTION & MULTI-BOUNCE SEQUENCE)
  // =========================================================================

  finalizeStickDrop() {
    this.stopListeningMotion();
    this.isStickDropped = true;

    const data = this.getData();
    if (!data || data.length === 0) {
      console.error("SIAMSI_DATA is missing or empty!");
      return;
    }

    // Select random sign from 100 items (00 - 99)
    const randomIndex = Math.floor(Math.random() * data.length);
    const sign = data[randomIndex];
    this.currentSign = sign;

    // Reset any previous drop display state
    if (this.droppedStickContainer) {
      this.droppedStickContainer.classList.remove("visible");
    }
    if (this.impactSparkles) {
      this.impactSparkles.classList.remove("burst");
    }

    // Configure the flying projectile stick appearance
    if (this.projectileNumber) {
      this.projectileNumber.textContent = sign.number;
    }
    if (this.projectileChinese) {
      this.projectileChinese.textContent = (sign.chinese_title && sign.chinese_title.slice(0, 2)) || "靈籤";
    }

    // Play ejection whoosh sound
    if (window.mysticAudio && window.mysticAudio.playStickEject) {
      window.mysticAudio.playStickEject();
    }

    // Cylinder thrust animation (tip forward violently to spit stick out)
    if (this.bambooCup) {
      this.bambooCup.classList.add("cylinder-eject-thrust");
      setTimeout(() => {
        if (this.bambooCup) this.bambooCup.classList.remove("cylinder-eject-thrust");
      }, 700);
    }

    // Start 3D Physics Flight Animation (Parabolic arc + 3D spin + shadow)
    if (this.flyingStage) {
      this.flyingStage.classList.add("active", "animating");
    }

    // -------------------------------------------------------------
    // Synchronized Sound & Haptic Events during Flight:
    // -------------------------------------------------------------

    // Impact 1: First hard landing strike onto the altar at t = 480ms
    setTimeout(() => {
      if (window.mysticAudio && window.mysticAudio.playStickDrop) {
        window.mysticAudio.playStickDrop(1.0);
      }
      if (this.impactSparkles) {
        this.impactSparkles.classList.add("burst");
      }
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(40);
      }
    }, 480);

    // Impact 2: Second rebound bounce at t = 750ms
    setTimeout(() => {
      if (window.mysticAudio && window.mysticAudio.playStickDrop) {
        window.mysticAudio.playStickDrop(0.5);
      }
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(25);
      }
    }, 750);

    // Final Settle: Stick comes to a rest flat on the red velvet mat at t = 1100ms
    setTimeout(() => {
      // Deactivate projectile animation
      if (this.flyingStage) {
        this.flyingStage.classList.remove("animating");
        this.flyingStage.classList.remove("active");
      }

      // Populate Revelation Banner & Fallen Stick
      this.updateRevelationBanner(sign);

      // Show Dropped Stick Container on the altar
      if (this.droppedStickContainer) {
        this.droppedStickContainer.classList.add("visible");
      }

      // Play sacred gong chime
      if (window.mysticAudio && window.mysticAudio.playGongChime) {
        window.mysticAudio.playGongChime(260, 2.5);
      }

      // Smooth scroll down to highlight the fallen stick and revelation banner
      setTimeout(() => {
        if (this.droppedStickContainer) {
          this.droppedStickContainer.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      }, 150);

    }, 1100);
  }

  updateRevelationBanner(sign) {
    if (!sign) return;
    const isEn = this.lang === "en";
    const title = (isEn && sign.en && sign.en.title) ? sign.en.title : sign.thai_title;
    const levelText = (isEn && sign.en && sign.en.fortune_level) ? sign.en.fortune_level : sign.fortune_level;
    const levelConf = this.getLevelConfig(levelText);

    if (this.revNumberHighlight) {
      this.revNumberHighlight.textContent = isEn ? `Sign ${sign.number}` : `เบอร์ ${sign.number}`;
    }
    if (this.revStickId) {
      this.revStickId.textContent = isEn ? `(Stick #${sign.stick_num || sign.id})` : `(ใบที่ ${sign.stick_num || sign.id})`;
    }
    if (this.revTitles) {
      this.revTitles.textContent = `${sign.chinese_title} • ${title}`;
    }

    if (this.revLevelBadge) {
      this.revLevelBadge.className = `siamsi-level-badge ${levelConf.badgeClass}`;
      this.revLevelBadge.innerHTML = `<span class="level-icon">${levelConf.icon}</span> <span>${levelText}</span>`;
      this.revLevelBadge.style.borderColor = levelConf.border;
      this.revLevelBadge.style.backgroundColor = levelConf.bg;
      this.revLevelBadge.style.color = levelConf.color;
    }

    if (this.droppedStickLabel) {
      this.droppedStickLabel.textContent = isEn ? `Sign ${sign.number}` : `เบอร์ ${sign.number}`;
    }
    if (this.fallenStickThaiTitle) {
      this.fallenStickThaiTitle.textContent = title;
    }
    if (this.fallenStickChineseTag) {
      this.fallenStickChineseTag.textContent = sign.chinese_title;
    }

    if (this.btnOpenRevealLabel) {
      this.btnOpenRevealLabel.textContent = isEn
        ? `Reveal Full Reading for Sign ${sign.number} (7 Aspects)`
        : `เปิดอ่านคำทำนายเซียมซี เบอร์ ${sign.number} (ครบ 7 ด้าน)`;
    }
  }

  // =========================================================================
  // RESULT SCREEN DISPLAY (ครบถ้วนทุกด้านตามตำรา kaucim.ai ทั้ง TH และ EN)
  // =========================================================================

  showResultScreen(targetSign) {
    const sign = targetSign || this.currentSign;
    if (!sign) {
      console.warn("No sign to display!");
      return;
    }
    this.currentSign = sign;
    const isEn = this.lang === "en";

    // Switch views
    if (this.screenShaking) this.screenShaking.classList.remove("active");
    if (this.screenDirectory) this.screenDirectory.classList.remove("active");
    if (this.screenResult) this.screenResult.classList.add("active");

    // Scroll to top of results smoothly
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Seeker Name greeting
    const rawSeeker = (this.seekerNameInput && typeof this.seekerNameInput.value === "string") ? this.seekerNameInput.value.trim() : "";
    const seekerName = rawSeeker || (this.app ? this.app.seekerName : "");
    if (this.resultSeekerGreeting) {
      if (isEn) {
        this.resultSeekerGreeting.textContent = seekerName 
          ? `Heavenly Oracle for "${seekerName}"`
          : "Heavenly Oracle for the Honored Seeker";
      } else {
        this.resultSeekerGreeting.textContent = seekerName 
          ? `ชะตาแห่งสวรรค์สำหรับคุณ "${seekerName}"`
          : "ชะตาแห่งสวรรค์สำหรับท่านผู้ขอพร";
      }
    }

    // Number badge (เบอร์ 00 - 99 & ใบที่ 1 - 100)
    if (this.resultNumberBadge) {
      this.resultNumberBadge.textContent = isEn
        ? `Sign ${sign.number} (Stick #${sign.stick_num || sign.id})`
        : `เบอร์ ${sign.number} (ใบที่ ${sign.stick_num || sign.id})`;
    }

    // Fortune level badge
    const fortuneLevelText = (isEn && sign.en && sign.en.fortune_level) ? sign.en.fortune_level : sign.fortune_level;
    const levelConf = this.getLevelConfig(fortuneLevelText);
    if (this.resultBadgeLevel) {
      this.resultBadgeLevel.className = `siamsi-level-badge ${levelConf.badgeClass}`;
      this.resultBadgeLevel.innerHTML = `<span class="level-icon">${levelConf.icon}</span> <span>${fortuneLevelText}</span>`;
      this.resultBadgeLevel.style.borderColor = levelConf.border;
      this.resultBadgeLevel.style.backgroundColor = levelConf.bg;
      this.resultBadgeLevel.style.color = levelConf.color;
    }

    // Titles
    if (this.resultChineseTitle) {
      this.resultChineseTitle.textContent = sign.chinese_title || "";
    }
    if (this.resultThaiTitle) {
      this.resultThaiTitle.textContent = (isEn && sign.en && sign.en.title) ? sign.en.title : (sign.thai_title || "");
    }

    // One line summary wisdom quote
    if (this.resultOneLine) {
      const wisdom = (isEn && sign.en && sign.en.one_line_summary) ? sign.en.one_line_summary : sign.one_line_summary;
      this.resultOneLine.textContent = wisdom ? `"${wisdom}"` : "";
    }

    // Poem verses (TH or EN)
    if (this.resultPoemTh) {
      this.resultPoemTh.innerHTML = "";
      const poemLines = (isEn && sign.en && Array.isArray(sign.en.poem)) ? sign.en.poem : (sign.poem_th || []);
      poemLines.forEach(line => {
        const p = document.createElement("p");
        p.className = "poem-verse-line";
        p.textContent = line;
        this.resultPoemTh.appendChild(p);
      });
    }

    // Chinese original poem
    if (this.resultPoemCn) {
      this.resultPoemCn.textContent = sign.poem_cn || "";
    }

    // Historical Legend & Origin Story (TH or EN)
    if (this.resultStoryText) {
      this.resultStoryText.innerHTML = "";
      const storyText = (isEn && sign.en && sign.en.story) ? sign.en.story : (sign.story || "");
      if (storyText) {
        const paragraphs = storyText.split("\n\n");
        paragraphs.forEach(text => {
          if (text.trim()) {
            const p = document.createElement("p");
            p.textContent = text.trim();
            this.resultStoryText.appendChild(p);
          }
        });
      }
    }

    // Render 7 Aspects Comprehensive Cards (TH or EN)
    this.renderAspectCards(sign);

    // Update URL hash for sharing / bookmarking
    try {
      history.replaceState(null, "", `#siamsi=${sign.number}`);
    } catch (e) {}
  }

  renderAspectCards(sign) {
    if (!this.aspectCardsContainer) return;
    this.aspectCardsContainer.innerHTML = "";
    const isEn = this.lang === "en";

    const aspectMeta = {
      career: {
        icon: "💼",
        label: isEn ? "Career & Ambition" : "อาชีพการงาน"
      },
      wealth: {
        icon: "💰",
        label: isEn ? "Wealth & Finance" : "โชคลาภและการเงิน"
      },
      love: {
        icon: "❤️",
        label: isEn ? "Love & Romance" : "ความรักและคู่ครอง"
      },
      health: {
        icon: "🌿",
        label: isEn ? "Health & Well-being" : "สุขภาพและพลานามัย"
      },
      study: {
        icon: "🎓",
        label: isEn ? "Academics & Exams" : "การเรียนและการสอบ"
      },
      home: {
        icon: "🏡",
        label: isEn ? "Family & Household" : "ครอบครัวและเคหสถาน"
      },
      general: {
        icon: "🔮",
        label: isEn ? "Overall Situation" : "ภาพรวมและเรื่องทั่วไป"
      }
    };

    const keys = ["career", "wealth", "love", "health", "study", "home", "general"];

    keys.forEach(key => {
      let summary = "";
      let detail = "";

      if (isEn && sign.en && sign.en.aspects && sign.en.aspects[key]) {
        const enData = sign.en.aspects[key];
        summary = enData.summary || "";
        detail = enData.detail || "";
      } else if (sign.aspects && sign.aspects[key]) {
        const thData = sign.aspects[key];
        summary = thData.summary || thData.name || "";
        detail = thData.detail || "";
      }

      if (!summary && !detail) return;

      const meta = aspectMeta[key] || { icon: "✦", label: key };
      const card = document.createElement("div");
      card.className = "siamsi-aspect-card";
      card.setAttribute("data-aspect-type", key);

      const hasDetail = detail && detail.trim() && detail.trim() !== summary.trim();

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
            <p>${summary}</p>
          </div>
          ${hasDetail ? `
            <div class="aspect-deep-detail">
              ${detail.split("\n\n").map(p => `<p>${p.trim()}</p>`).join("")}
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

  /**
   * Called by App when language is toggled via top bar (TH/EN)
   * Dynamically switches active screen content without requiring re-shake
   */
  applyLanguage(lang) {
    if (this.screenResult && this.screenResult.classList.contains("active") && this.currentSign) {
      this.showResultScreen(this.currentSign);
    }
    if (this.currentSign && this.droppedStickContainer && this.droppedStickContainer.classList.contains("visible")) {
      this.updateRevelationBanner(this.currentSign);
    }
    if (this.screenDirectory && this.screenDirectory.classList.contains("active")) {
      this.renderDirectoryGrid();
    }
    this.updateShakeMeter();
  }

  resetToShakingScreen() {
    this.resetShakeAltar();

    if (this.screenResult) this.screenResult.classList.remove("active");
    if (this.screenDirectory) this.screenDirectory.classList.remove("active");
    if (this.screenShaking) this.screenShaking.classList.add("active");

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // =========================================================================
  // DIRECT NUMBER MODAL
  // =========================================================================

  handleDirectNumberSubmit() {
    if (!this.directNumberInput) return;
    const rawVal = this.directNumberInput.value.trim();
    if (!rawVal) return;

    const targetSign = this.getSignByNumberOrId(rawVal);

    if (targetSign) {
      if (this.directNumberModal) this.directNumberModal.classList.remove("active");
      this.showResultScreen(targetSign);
    } else {
      const msg = this.lang === "en" 
        ? "Please enter a valid number between 00 and 99 (or 1 to 100)"
        : "กรุณาระบุตัวเลขระหว่าง 00 ถึง 99 หรือ 1 ถึง 100";
      alert(msg);
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
    if (!this.directoryGrid) return;
    const data = this.getData();
    if (!data || data.length === 0) return;

    this.directoryGrid.innerHTML = "";
    const isEn = this.lang === "en";

    const query = this.directorySearchInput ? this.directorySearchInput.value.trim().toLowerCase() : "";
    let activeLevel = "all";
    if (this.directoryLevelFilters) {
      const activeChip = Array.from(this.directoryLevelFilters).find(c => c.classList.contains("active"));
      if (activeChip) activeLevel = activeChip.getAttribute("data-level") || "all";
    }

    const filtered = data.filter(sign => {
      let matchLevel = (activeLevel === "all");
      if (!matchLevel) {
        const signLevelTh = sign.fortune_level;
        const signLevelEn = (sign.en && sign.en.fortune_level) ? sign.en.fortune_level : "";
        matchLevel = (signLevelTh === activeLevel) || (signLevelEn === activeLevel);
      }
      if (!matchLevel) return false;

      if (!query) return true;
      const enTitle = (sign.en && sign.en.title) || "";
      const enSummary = (sign.en && sign.en.one_line_summary) || "";
      const textToSearch = `${sign.number} ${sign.id} ${sign.stick_num} ${sign.thai_title} ${enTitle} ${sign.chinese_title} ${sign.fortune_level} ${sign.one_line_summary} ${enSummary}`.toLowerCase();
      return textToSearch.includes(query);
    });

    if (filtered.length === 0) {
      this.directoryGrid.innerHTML = `
        <div class="directory-empty-state">
          <p>${isEn ? "No signs found matching your search." : "ไม่พบใบเซียมซีที่ตรงกับการค้นหา"}</p>
        </div>
      `;
      return;
    }

    filtered.forEach(sign => {
      const card = document.createElement("div");
      card.className = "siamsi-dir-card";
      
      const title = (isEn && sign.en && sign.en.title) ? sign.en.title : sign.thai_title;
      const summary = (isEn && sign.en && sign.en.one_line_summary) ? sign.en.one_line_summary : (sign.one_line_summary || "");
      const levelText = (isEn && sign.en && sign.en.fortune_level) ? sign.en.fortune_level : sign.fortune_level;
      const levelConf = this.getLevelConfig(levelText);

      card.innerHTML = `
        <div class="dir-card-num-badge">${isEn ? `Sign ${sign.number}` : `เบอร์ ${sign.number}`}</div>
        <div class="dir-card-level-tag ${levelConf.badgeClass}">
          <span>${levelConf.icon}</span> <span>${levelText}</span>
        </div>
        <div class="dir-card-titles">
          <h4 class="dir-chinese">${sign.chinese_title}</h4>
          <p class="dir-thai">${title}</p>
        </div>
        <p class="dir-summary">${summary}</p>
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
    const isEn = this.lang === "en";

    let text = "";
    if (isEn && sign.en) {
      const poem = Array.isArray(sign.en.poem) ? sign.en.poem.join("\n") : "";
      const aspects = sign.en.aspects || {};
      text = `🎋 Wong Tai Sin Sacred Siamsi Oracle
Sign ${sign.number} (Stick #${sign.stick_num || sign.id})
✨ Fortune Level: ${sign.en.fortune_level || sign.fortune_level}
📜 ${sign.chinese_title} (${sign.en.title || sign.thai_title})
💡 Essence: "${sign.en.one_line_summary || sign.one_line_summary}"

Sacred Verse:
${poem}

💼 Career: ${aspects.career ? aspects.career.summary : "-"}
💰 Wealth: ${aspects.wealth ? aspects.wealth.summary : "-"}
❤️ Love: ${aspects.love ? aspects.love.summary : "-"}
🌿 Health: ${aspects.health ? aspects.health.summary : "-"}

Divinate online at: ${window.location.origin}${window.location.pathname}#siamsi=${sign.number}`;
    } else {
      const poem = Array.isArray(sign.poem_th) ? sign.poem_th.join("\n") : "";
      text = `🎋 ผลการเสี่ยงเซียมซีหว่องไทซิน
เบอร์ ${sign.number} (ใบที่ ${sign.stick_num || sign.id})
✨ ระดับ: ${sign.fortune_level}
📜 ${sign.chinese_title} (${sign.thai_title})
💡 สรุป: "${sign.one_line_summary}"

บทกลอน:
${poem}

💼 อาชีพ: ${sign.aspects && sign.aspects.career ? sign.aspects.career.summary : "-"}
💰 โชคลาภ: ${sign.aspects && sign.aspects.wealth ? sign.aspects.wealth.summary : "-"}
❤️ ความรัก: ${sign.aspects && sign.aspects.love ? sign.aspects.love.summary : "-"}
🌿 สุขภาพ: ${sign.aspects && sign.aspects.health ? sign.aspects.health.summary : "-"}

เสี่ยงเซียมซีออนไลน์ได้ที่: ${window.location.origin}${window.location.pathname}#siamsi=${sign.number}`;
    }

    const toastMsg = isEn ? "📋 Siamsi reading copied to clipboard!" : "📋 คัดลอกคำทำนายเซียมซีเรียบร้อยแล้ว";
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        if (this.app) this.app.showToast(toastMsg);
      });
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      if (this.app) this.app.showToast(toastMsg);
    }
  }

  shareResult() {
    if (!this.currentSign) return;
    const sign = this.currentSign;
    const isEn = this.lang === "en";
    const shareUrl = `${window.location.origin}${window.location.pathname}#siamsi=${sign.number}`;
    const title = (isEn && sign.en && sign.en.title) ? `Siamsi #${sign.number} - ${sign.en.title}` : `เซียมซีเบอร์ ${sign.number} - ${sign.thai_title}`;
    const level = (isEn && sign.en && sign.en.fortune_level) ? sign.en.fortune_level : sign.fortune_level;
    const summary = (isEn && sign.en && sign.en.one_line_summary) ? sign.en.one_line_summary : sign.one_line_summary;

    if (navigator.share) {
      navigator.share({
        title: title,
        text: `Siamsi #${sign.number} (${level}): ${summary}`,
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
      if (match && match[1]) {
        const sign = this.getSignByNumberOrId(match[1]);
        if (sign) {
          setTimeout(() => {
            this.switchToSiamsiMode();
            this.showResultScreen(sign);
          }, 350);
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
    const seekerVal = (this.seekerNameInput && typeof this.seekerNameInput.value === "string") ? this.seekerNameInput.value.trim() : "";
    if (seekerVal && this.app) {
      this.app.seekerName = seekerVal;
      const tarotInput = document.getElementById("seeker-name-input");
      if (tarotInput) tarotInput.value = this.app.seekerName;
    }
  }
}

// Global Export
window.SiamsiApp = SiamsiApp;

// Auto-initialization check to guarantee activation
function initSiamsiIfReady() {
  if (!window.siamsiApp && typeof SiamsiApp !== "undefined") {
    window.siamsiApp = new SiamsiApp(window.tarotApp || null);
    if (window.tarotApp) {
      window.tarotApp.siamsiApp = window.siamsiApp;
    }
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSiamsiIfReady);
} else {
  initSiamsiIfReady();
}
