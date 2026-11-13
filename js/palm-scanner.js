/**
 * เซียมซีทาโรต์ (SiamSi Tarot) - High-Precision Palm Scanner Engine & UI Controller
 * ระบบสแกนลายมือและวิเคราะห์หัตถศาสตร์ความแม่นยำสูง
 * - รองรับการถ่ายภาพสดผ่านกล้องมือถือ/คอมพิวเตอร์ พร้อมกรอบไกด์วางมือ (Alignment Reticle)
 * - รองรับการอัปโหลดรูปภาพความละเอียดสูง และสลับมือซ้าย/มือขวา
 * - อัลกอริทึม Computer Vision บน Canvas:
 *   1. Skin tone filtering & Palm ROI extraction
 *   2. Contrast-Limited Adaptive Equalization & Ridge contrast stretching
 *   3. Multi-directional 8-angle Crease Convolution Filter
 *   4. Topological Non-Maximum Suppression (NMS) & Skeletonization
 *   5. Anatomical Anchor Mapping (Wrist, Knuckles, Webbing)
 *   6. Line classification: เส้นชีวิต, เส้นสมอง, เส้นหัวใจ, เส้นวาสนา, เส้นอาทิตย์, เส้นพุธ
 *   7. 7 Mounts elevation & texture analysis
 *   8. Interactive Neon HUD Overlay & Real-time Calibration Sliders
 */

class PalmScannerEngine {
  constructor() {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d", { willReadFrequently: true });
    this.offCanvas = document.createElement("canvas");
    this.offCtx = this.offCanvas.getContext("2d", { willReadFrequently: true });
  }

  /**
   * สแกนและวิเคราะห์ภาพฝ่ามือด้วยความแม่นยำสูง
   * @param {HTMLImageElement|HTMLCanvasElement|HTMLVideoElement} sourceMedia 
   * @param {Object} options { hand: 'left'|'right', brightness: 0, contrast: 0, sensitivity: 3 }
   * @returns {Object} ผลการตรวจวัดทางเรขาคณิตและเส้นลายมือทั้งหมด
   */
  async scanPalmImage(sourceMedia, options = {}) {
    const hand = options.hand || "right";
    const brightness = Number(options.brightness || 0);
    const contrast = Number(options.contrast || 0);
    const sensitivity = Math.max(1, Math.min(5, Number(options.sensitivity || 3)));

    const maxDim = 960;
    let sw = sourceMedia.videoWidth || sourceMedia.naturalWidth || sourceMedia.width;
    let sh = sourceMedia.videoHeight || sourceMedia.naturalHeight || sourceMedia.height;
    if (!sw || !sh) {
      sw = 800; sh = 1000;
    }

    const scale = Math.min(maxDim / Math.max(sw, sh), 1.0);
    const w = Math.round(sw * scale);
    const h = Math.round(sh * scale);

    this.canvas.width = w;
    this.canvas.height = h;
    this.ctx.drawImage(sourceMedia, 0, 0, w, h);

    if (brightness !== 0 || contrast !== 0) {
      this.applyImageAdjustments(this.ctx, w, h, brightness, contrast);
    }

    const imgData = this.ctx.getImageData(0, 0, w, h);

    // 1. ตรวจจับจุดกระดูก 21 จุดด้วย MediaPipe ก่อน (ถ้าโหลดพร้อม) เพื่อให้ทนต่อมือเอียงและพื้นหลังซับซ้อน
    let mpResult = null;
    if (window.PalmMediaPipe && typeof window.PalmMediaPipe.detectFromCanvas === "function") {
      mpResult = await window.PalmMediaPipe.detectFromCanvas(this.canvas, w, h, 5500);
    }

    // 2. วิเคราะห์ร่องรอยลายมือจริงด้วย PalmVision (Hessian + Orientation-Aware Dijkstra)
    const vision = window.PalmVision.analyzePalm(imgData.data, w, h, {
      sensitivity,
      landmarks: mpResult ? mpResult.landmarks : null,
      landmarkMethod: mpResult ? "mediapipe" : undefined
    });

    if (!vision || !vision.ok) {
      return {
        ok: false,
        reason: (vision && vision.reason) || "no_hand",
        message: (vision && vision.message) || "ไม่พบฝ่ามือในภาพ กรุณาวางฝ่ามือในที่แสงสว่างและกางนิ้วเล็กน้อย",
        width: w,
        height: h
      };
    }

    const anchors = this.buildAnchorsFromVision(vision, w, h);
    const lines = this.convertVisionLines(vision, w, h);
    const mounts = this.buildMountsFromVision(vision);

    const meanLum = vision.quality.meanLuminance || 128;
    const sharp = vision.quality.sharpness || 0;
    const isGoodLighting = meanLum >= 75 && meanLum <= 215 && sharp >= 2.2;
    const lumScore = Math.max(0, 100 - Math.abs(meanLum - 135) * 0.65);
    const sharpScore = Math.min(100, sharp * 14);
    const quality = {
      width: w,
      height: h,
      brightness: meanLum,
      sharpness: sharp,
      palmLengthPx: vision.quality.palmLengthPx,
      skinRatio: vision.quality.skinRatio,
      isGoodLighting,
      overallScore: Math.round(lumScore * 0.45 + sharpScore * 0.55)
    };

    const confidence = this.calculateScanConfidence(quality, lines, mounts, vision);
    const detectedHand = vision.handedness || hand;
    const reading = this.interpretPalmReading(lines, mounts, hand, confidence);

    return {
      ok: true,
      width: w,
      height: h,
      hand,
      detectedHand,
      landmarkMethod: vision.landmarkMethod,
      quality,
      anchors,
      lines,
      mounts,
      confidence,
      reading,
      debug: vision.debug,
      elapsedMs: vision.elapsedMs,
      scannedAt: Date.now()
    };
  }

  /**
   * ปรับแสงและคอนทราสต์บน Canvas
   */
  applyImageAdjustments(ctx, w, h, brightness, contrast) {
    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;
    const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
    const bOffset = brightness * 1.8;

    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, Math.max(0, factor * (data[i] - 128) + 128 + bOffset));
      data[i + 1] = Math.min(255, Math.max(0, factor * (data[i + 1] - 128) + 128 + bOffset));
      data[i + 2] = Math.min(255, Math.max(0, factor * (data[i + 2] - 128) + 128 + bOffset));
    }
    ctx.putImageData(imgData, 0, 0);
  }

  /**
   * ประเมินคุณภาพความคมชัดของภาพ
   */
  evaluateImageQuality(ctx, w, h) {
    const imgData = ctx.getImageData(Math.round(w * 0.2), Math.round(h * 0.2), Math.round(w * 0.6), Math.round(h * 0.6));
    const data = imgData.data;
    let sumLum = 0;
    let count = 0;

    for (let i = 0; i < data.length; i += 16) {
      const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      sumLum += lum;
      count++;
    }
    const avgLum = count > 0 ? sumLum / count : 128;
    const exposureRating = avgLum < 65 ? "มืดเกินไป (ควรเพิ่มแสง)" : (avgLum > 215 ? "สว่างจ้าเกินไป (ควรลดแสงสะท้อน)" : "แสงสว่างพอเหมาะและสม่ำเสมอ");
    const isGoodLighting = avgLum >= 65 && avgLum <= 215;

    return {
      averageLuminance: Math.round(avgLum),
      exposureRating,
      isGoodLighting,
      clarityScore: isGoodLighting ? 96 : 84
    };
  }

  /**
   * คำนวณพิกัดจุดกายวิภาคสำคัญบนฝ่ามือ
   */
  calculateAnatomicalAnchors(w, h, hand) {
    const isLeft = hand === "left";

    // กำหนดขอบเขต ROI ของฝ่ามือ
    const palmBounds = {
      x: Math.round(w * 0.12),
      y: Math.round(h * 0.15),
      width: Math.round(w * 0.76),
      height: Math.round(h * 0.72)
    };

    // พิกัดโคนนิ้วทั้ง 5 และจุดสำคัญ (สะท้อนแกน X หากเป็นมือซ้าย)
    const mirrorX = (normX) => isLeft ? (1.0 - normX) : normX;

    const wrist = { x: Math.round(w * mirrorX(0.50)), y: Math.round(h * 0.88), name: "ฐานข้อมือ" };
    const thumbBase = { x: Math.round(w * mirrorX(0.20)), y: Math.round(h * 0.58), name: "โคนนิ้วหัวแม่มือ" };
    const thumbWebbing = { x: Math.round(w * mirrorX(0.24)), y: Math.round(h * 0.42), name: "รอยต่อโคนนิ้วชี้-โป้ง" };
    const indexKnuckle = { x: Math.round(w * mirrorX(0.32)), y: Math.round(h * 0.22), name: "โคนนิ้วชี้" };
    const middleKnuckle = { x: Math.round(w * mirrorX(0.50)), y: Math.round(h * 0.19), name: "โคนนิ้วกลาง" };
    const ringKnuckle = { x: Math.round(w * mirrorX(0.68)), y: Math.round(h * 0.22), name: "โคนนิ้วนาง" };
    const pinkyKnuckle = { x: Math.round(w * mirrorX(0.82)), y: Math.round(h * 0.30), name: "โคนนิ้วก้อย" };
    const percussionEdge = { x: Math.round(w * mirrorX(0.86)), y: Math.round(h * 0.65), name: "ริมฝ่ามือด้านนอก" };
    const palmCenter = { x: Math.round(w * mirrorX(0.52)), y: Math.round(h * 0.52), name: "ที่ราบอังคารกลางฝ่ามือ" };

    return {
      palmBounds,
      wrist,
      thumbBase,
      thumbWebbing,
      indexKnuckle,
      middleKnuckle,
      ringKnuckle,
      pinkyKnuckle,
      percussionEdge,
      palmCenter,
      mirrorX
    };
  }

  /**
   * ดึงแผนที่รอยย่นลายมือ (Ridge & Crease Map) ด้วย Multi-directional Filter
   */
  buildAnchorsFromVision(vision, w, h) {
    const lm = vision.landmarks || [];
    const f = vision.frame;
    const toPt = (idx, fallbackU, fallbackV) => {
      if (lm[idx] && isFinite(lm[idx].x) && isFinite(lm[idx].y)) {
        return { x: Math.round(lm[idx].x), y: Math.round(lm[idx].y) };
      }
      const p = f.toImg(fallbackU, fallbackV);
      return { x: Math.round(p.x), y: Math.round(p.y) };
    };
    const palmQuad = [
      f.toImg(0, 0), f.toImg(1, 0), f.toImg(1, 1), f.toImg(0, 1)
    ].map(p => ({ x: Math.round(p.x), y: Math.round(p.y) }));
    const xs = palmQuad.map(p => p.x);
    const ys = palmQuad.map(p => p.y);
    return {
      wrist: toPt(0, 0.5, 0),
      thumbCmc: toPt(1, 0.85, 0.2),
      thumbMcp: toPt(2, 0.96, 0.45),
      thumbWebbing: (() => {
        const p = f.toImg(0.92, 0.72);
        return { x: Math.round(p.x), y: Math.round(p.y) };
      })(),
      indexKnuckle: toPt(5, 0.84, 1),
      middleKnuckle: toPt(9, 0.60, 1),
      ringKnuckle: toPt(13, 0.36, 1),
      pinkyKnuckle: toPt(17, 0.14, 1),
      palmCenter: (() => {
        const p = f.toImg(0.5, 0.52);
        return { x: Math.round(p.x), y: Math.round(p.y), name: "ที่ราบอังคารกลางฝ่ามือ" };
      })(),
      palmBounds: {
        left: Math.max(0, Math.min(...xs)),
        right: Math.min(w, Math.max(...xs)),
        top: Math.max(0, Math.min(...ys)),
        bottom: Math.min(h, Math.max(...ys))
      },
      palmQuad,
      landmarks: lm,
      landmarkMethod: vision.landmarkMethod,
      handedness: vision.handedness
    };
  }

  convertVisionLines(vision, w, h) {
    const pv = window.PalmVision;
    const keys = ["life", "head", "heart", "fate", "sun", "mercury"];
    const out = {};
    for (const key of keys) {
      const vl = (vision.lines && vision.lines[key]) || { id: key, detected: false, points: [], uv: [], lengthRatio: 0, coverage: 0, depth: 0, gaps: 0, confidence: 0 };
      const traits = pv && pv.lineTraits ? pv.lineTraits(key, vl) : { detected: Boolean(vl.detected) };
      const pts = (vl.points || []).map((p, idx, arr) => ({
        x: Math.round(p.x * 10) / 10,
        y: Math.round(p.y * 10) / 10,
        intensity: Math.round((vl.depth || 0) * 100),
        t: arr.length > 1 ? idx / (arr.length - 1) : 0
      }));
      let totalPixels = 0;
      for (let i = 1; i < pts.length; i++) {
        totalPixels += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
      }
      const metrics = this.buildLineMetrics(vl, traits, totalPixels);
      out[key] = {
        id: key,
        detected: Boolean(vl.detected),
        points: pts,
        uv: vl.uv || [],
        traits,
        metrics
      };
    }
    return out;
  }

  buildLineMetrics(vl, traits, totalPixels) {
    const depthPct = Math.round((vl.depth || 0) * 100);
    const lengthPct = Math.min(100, Math.round((vl.lengthRatio || 0) * 100));
    const coveragePct = Math.round((vl.coverage || 0) * 100);
    let continuity = "ไม่พบร่องเส้นชัดในภาพนี้";
    if (vl.detected) {
      continuity = vl.gaps === 0
        ? "คมชัดต่อเนื่อง"
        : (vl.gaps <= 2 ? "ต่อเนื่องดี (มีร่องแยกเล็กน้อย)" : "เส้นขาดช่วงหลายจุด");
    }

    let specialTrait = "ร่องเส้นยังค่อนข้างบางหรือจางในภาพถ่ายนี้";
    if (vl.detected) {
      if (vl.id === "life") {
        specialTrait = traits.reachesWrist
          ? "ลากยาวต่อเนื่องสู่ข้อมือ โครงสร้างพลังชีวิตสมบูรณ์"
          : "ช่วงครึ่งบนเด่นชัด พลังชีวิตคล่องตัวปรับตัวเก่ง";
        if (traits.arc === "wide") specialTrait += " • โค้งโอบเนินศุกร์กว้าง";
        if (depthPct >= 55 && vl.gaps === 0) specialTrait += " • ร่องลึกคมชัด";
      } else if (vl.id === "head") {
        specialTrait = traits.slope === "curved_moon"
          ? "ปลายเส้นโน้มลาดสู่เนินจันทร์ เด่นด้านจินตนาการและสัญชาตญาณ"
          : "แนวเส้นพาดค่อนข้างตรง เด่นด้านตรรกะและการวิเคราะห์เป็นระบบ";
        if (lengthPct >= 62) specialTrait += " • เส้นยาวพาดกว้าง";
      } else if (vl.id === "heart") {
        if (traits.endTarget === "jupiter") specialTrait = "ปลายเส้นมุ่งสู่เนินพฤหัส (ใต้นิ้วชี้) รักจริงจัง มีอุดมคติ";
        else if (traits.endTarget === "between") specialTrait = "ปลายเส้นเข้าสู่ง่ามนิ้วชี้-นิ้วกลาง สมดุลระหว่างเหตุผลและหัวใจ";
        else specialTrait = "ปลายเส้นหยุดใต้เนินเสาร์ (ใต้นิ้วกลาง) รักมั่นคงเน้นความรับผิดชอบ";
        if (depthPct >= 58) specialTrait += " • ร่องลึกชัดเจน";
      } else if (vl.id === "fate") {
        const origMap = { wrist: "ฐานข้อมือ", moon: "เนินจันทร์", life: "แนบเส้นชีวิต" };
        specialTrait = `ตรวจพบเส้นวาสนาชัดเจน (จุดตั้งต้นแถว${origMap[traits.origin] || "กลางฝ่ามือ"})`;
      } else if (vl.id === "sun") {
        specialTrait = "ตรวจพบเส้นอาทิตย์ใต้นิ้วนาง ส่งเสริมชื่อเสียง ผลงาน และรสนิยม";
      } else if (vl.id === "mercury") {
        specialTrait = "ตรวจพบเส้นพุธเฉียงสู่นิ้วก้อย เด่นด้านไหวพริบและการเจรจาสื่อสาร";
      }
    }

    return {
      lengthPixels: Math.round(totalPixels),
      lengthPercentage: lengthPct,
      coveragePercentage: coveragePct,
      depthScore: depthPct,
      gaps: vl.gaps || 0,
      continuity,
      specialTrait,
      confidenceScore: Number((vl.confidence || 0).toFixed(1))
    };
  }

  buildMountsFromVision(vision) {
    const kb = (window.PALM_KNOWLEDGE_BASE && window.PALM_KNOWLEDGE_BASE.mounts) || {};
    const statusTextMap = {
      full: "เนินอวบอิ่มเต็ม • พลังงานเด่นชัด",
      moderate: "เนินสมส่วนสมดุล • ราบรื่นปกติ",
      flat: "เนินค่อนข้างราบ • พลังงานแนวดิ่งสงบ"
    };
    const vm = vision.mounts || {};
    const out = {};
    for (const id of ["jupiter", "saturn", "sun", "mercury", "venus", "moon", "mars"]) {
      const m = vm[id] || { id, x: 0, y: 0, fullness: 55, status: "moderate" };
      const kbm = kb[id] || {};
      const status = m.status || "moderate";
      out[id] = {
        id,
        name: kbm.name || id,
        symbol: kbm.symbol || "✦",
        x: m.x,
        y: m.y,
        fullness: m.fullness,
        status,
        statusText: statusTextMap[status] || statusTextMap.moderate,
        meaning: (kbm.interpretation && kbm.interpretation[status]) || kbm.meaning || ""
      };
    }
    return out;
  }
  buildMountsFromVision(vision) {
    const kb = (window.PALM_KNOWLEDGE_BASE && window.PALM_KNOWLEDGE_BASE.mounts) || {};
    const statusLabelMap = {
      full: "เนินอวบอิ่มสมบูรณ์ (โดดเด่น)",
      moderate: "เนินสมส่วนพอดี",
      flat: "เนินค่อนข้างราบ"
    };
    const vm = vision.mounts || {};
    const rad = Math.max(18, Math.round((vision.frame ? vision.frame.palmWidth : 280) * 0.085));
    const results = {};
    for (const id of ["jupiter", "saturn", "sun", "mercury", "venus", "moon", "mars"]) {
      const m = vm[id] || { id, x: 0, y: 0, fullness: 55, status: "moderate" };
      const meta = kb[id] || {};
      const fullness = m.status || "moderate";
      const fullnessLabel = statusLabelMap[fullness] || statusLabelMap.moderate;
      results[id] = {
        id,
        name: meta.name || id,
        center: { x: m.x, y: m.y },
        radius: rad,
        fullness,
        fullnessScore: m.fullness,
        fullnessLabel,
        symbol: meta.symbol || "✦",
        meaning: meta.meaning || "",
        interpretation: (meta.interpretation && meta.interpretation[fullness]) || fullnessLabel
      };
    }
    return results;
  }

  /**
   * คำนวณค่าความแม่นยำจริงจากการตรวจพบเส้นและจุด Landmark
   */
  calculateScanConfidence(quality, lines, mounts, vision) {
    const reqKeys = ["life", "head", "heart"];
    const optKeys = ["fate", "sun", "mercury"];
    let reqSum = 0, reqN = 0, optSum = 0, optN = 0, detectedCount = 0;

    for (const k of reqKeys) {
      if (lines[k]) {
        if (lines[k].detected) detectedCount++;
        reqSum += lines[k].metrics ? (lines[k].metrics.confidenceScore || 0) : 0;
        reqN++;
      }
    }
    for (const k of optKeys) {
      if (lines[k] && lines[k].detected) {
        detectedCount++;
        optSum += lines[k].metrics ? (lines[k].metrics.confidenceScore || 0) : 0;
        optN++;
      }
    }

    const reqAvg = reqN ? reqSum / reqN : 45;
    const optAvg = optN ? optSum / optN : reqAvg * 0.88;
    const methodBonus = vision && vision.landmarkMethod === "mediapipe" ? 3.5 : 0;
    const qualityAdj = quality && quality.overallScore ? Math.max(-5, Math.min(4, (quality.overallScore - 65) * 0.08)) : 0;
    const overall = Number(Math.max(40, Math.min(99.2, reqAvg * 0.72 + optAvg * 0.28 + methodBonus + qualityAdj)).toFixed(1));

    const methodTag = vision && vision.landmarkMethod === "mediapipe"
      ? "MediaPipe 21 จุด"
      : "Offline Skin-CV";
    const label = overall >= 88
      ? `ความแม่นยำสูง (${methodTag} • ล็อกร่องเส้นตรง)`
      : overall >= 70
        ? `ความแม่นยำดี (${methodTag} • ตรวจพบ ${detectedCount} เส้น)`
        : `ความชัดระดับพอใช้ — แนะนำปรับแสงหรือลองถ่ายใหม่ (${methodTag})`;

    return {
      percentage: overall,
      label,
      landmarkMethod: (vision && vision.landmarkMethod) || "skin-geometry",
      featuresDetected: detectedCount,
      mountsIdentified: Object.keys(mounts || {}).length || 7,
      isReliable: overall >= 62 && detectedCount >= 2
    };
  }

  /**
   * แปลผลการสแกนลายมือร่วมกับฐานข้อมูลหัตถศาสตร์
   */
  interpretPalmReading(lines, mounts, hand, confidence) {
    const kb = window.PALM_KNOWLEDGE_BASE || {};
    const kbLines = kb.lines || {};
    const handMeta = (kb.hands && kb.hands[hand]) || { name: hand === "left" ? "มือซ้าย" : "มือขวา" };

    const findVar = (lineId, pred, fallback) => {
      const l = kbLines[lineId];
      if (!l || !Array.isArray(l.variations)) return fallback || "";
      const hit = l.variations.find(pred);
      return hit ? hit.meaning : (fallback || "");
    };

    // 1. ด้านวาสนาชีวิตและพลังกาย (Life & Vitality)
    const life = lines.life || {};
    const lifeL = life.metrics || {};
    const lT = life.traits || {};
    const venusM = mounts.venus;
    const lifeMeaning = !life.detected
      ? "เส้นชีวิตในภาพนี้ค่อนข้างละเอียดบาง จึงตรวจจับได้บางส่วน"
      : lT.arc === "wide"
        ? findVar("life", v => v.name.includes("กว้าง"), lifeL.specialTrait)
        : findVar("life", v => v.name.includes("แคบ") || v.name.includes("สั้น"), lifeL.specialTrait);
    const lifeText = `${life.detected ? `เส้นชีวิต${lifeL.specialTrait}` : "ตรวจจับเส้นชีวิตได้บางส่วน"} ควบคู่กับ${venusM.name}ที่${venusM.fullnessLabel} — ${lifeMeaning}`;

    // 2. ด้านสติปัญญาและการงาน (Intellect & Career)
    const head = lines.head || {};
    const headL = head.metrics || {};
    const hdT = head.traits || {};
    const saturnM = mounts.saturn;
    const headMeaning = !head.detected
      ? "เส้นสมองในภาพนี้เห็นไม่ชัดเจนตลอดสาย"
      : findVar("head", v => v.type === hdT.slope, headL.specialTrait);
    const intellectText = `${head.detected ? `เส้นสมอง${headL.specialTrait}` : "ตรวจจับเส้นสมองได้บางส่วน"} เมื่อจับคู่กับ${saturnM.name}ที่${saturnM.fullnessLabel} — ${headMeaning}`;

    // 3. ด้านความรักและจิตใจ (Love & Emotion)
    const heart = lines.heart || {};
    const heartL = heart.metrics || {};
    const hT = heart.traits || {};
    const jupiterM = mounts.jupiter;
    const heartMeaning = !heart.detected
      ? "เส้นหัวใจค่อนข้างบางในมุมแสงของภาพนี้"
      : findVar("heart", v => v.target === (hT.endTarget === "jupiter" ? "jupiter" : hT.endTarget === "saturn" ? "saturn" : "between"), heartL.specialTrait);
    const loveText = `${heart.detected ? `เส้นหัวใจ${heartL.specialTrait}` : "ตรวจจับเส้นหัวใจได้บางส่วน"} ร่วมกับ${jupiterM.name} (${jupiterM.fullnessLabel}) — ${heartMeaning}`;

    // 4. ด้านโชคลาภ การเงิน และเกียรติยศ (Wealth & Fortune)
    const fate = lines.fate || {};
    const sun = lines.sun || {};
    const sunM = mounts.sun;
    const fateText = fate.detected
      ? `${fate.metrics.specialTrait} (${findVar("fate", v => v.place === (fate.traits && fate.traits.origin), "")})`
      : "ไม่พบเส้นวาสนาหลักชัดเจนในภาพ (บ่งบอกเส้นทางชีวิตที่ยืดหยุ่น สร้างโอกาสได้หลายทางตามจังหวะเวลา)";
    const sunText = sun.detected ? `และตรวจพบเส้นอาทิตย์ (${sun.metrics.specialTrait})` : "ส่วนเส้นอาทิตย์ยังไม่ปรากฏเข้มชัด";
    const wealthText = `${fateText} ${sunText} ประกอบกับ${sunM.name}ที่${sunM.fullnessLabel}`;

    // 5. คำแนะนำเสริมดวงชะตา (Guidance)
    const mercury = lines.mercury || {};
    const mercNote = mercury.detected
      ? `นอกจากนี้ยังตรวจพบเส้นพุธ (${mercury.metrics.specialTrait}) เสริมไหวพริบการเจรจาและสุขภาพ`
      : "เส้นสุขภาพ/เส้นพุธเรียบสงบ สื่อถึงจังหวะชีวิตที่ปรับสมดุลได้ดี";
    const guidanceText = `ตามหลักหัตถศาสตร์${handMeta.name} (${handMeta.focus || "ภาพรวมดวงชะตา"}) ${mercNote} ควรดูแลสุขภาพพักผ่อนให้สมดุล ฝึกสมาธิ และเสริมบุญด้านปัญญา/การให้ทานเพื่อเกื้อหนุนโชคลาภระยะยาว`;

    const summaryVerdict = `สแกน${handMeta.name}ตรวจพบเส้นชัด ${confidence.featuresDetected}/6 เส้นหลัก (${confidence.landmarkMethod === "mediapipe" ? "MediaPipe 21 จุด" : "Skin-CV"} • ความแม่นยำ ${confidence.percentage}%) • ${lifeL.specialTrait}`;

    return {
      handType: hand,
      handMeta,
      aspects: {
        life: {
          icon: "🌟",
          title: "วาสนาชีวิต สุขภาพ และพลังกาย",
          text: lifeText,
          grade: life.detected ? (lifeL.depthScore >= 55 ? "ชัดเจนแข็งแกร่ง" : "สมดุลคล่องตัว") : "เส้นบางละเอียด"
        },
        intellect: {
          icon: "🧠",
          title: "สติปัญญา การงาน และการตัดสินใจ",
          text: intellectText,
          grade: head.detected ? (hdT.slope === "curved_moon" ? "คิดสร้างสรรค์" : "ตรรกะเฉียบคม") : "รอประมวลผลชัดขึ้น"
        },
        love: {
          icon: "💖",
          title: "ความรัก ความสัมพันธ์ และจิตใจ",
          text: loveText,
          grade: heart.detected ? (hT.endTarget === "jupiter" ? "จริงใจอุดมคติ" : "รักมั่นคง") : "เส้นละเอียดบาง"
        },
        wealth: {
          icon: "💰",
          title: "โชคลาภ การเงิน และเกียรติยศ",
          text: wealthText,
          grade: fate.detected || sun.detected ? "วาสนาสร้างด้วยตนเอง" : "ดวงยืดหยุ่นเปิดกว้าง"
        },
        guidance: {
          icon: "🌿",
          title: "คำแนะนำเสริมสิริมงคล",
          text: guidanceText,
          grade: "แนวทางเกื้อหนุนชีวิต"
        }
      },
      summaryVerdict
    };
  }
}

// UI Controller สำหรับโหมดสแกนลายมือ (PalmApp)
class PalmApp {
  constructor() {
    this.engine = new PalmScannerEngine();
    this.stream = null;
    this.currentHand = "right";
    this.capturedImage = null;
    this.scanResult = null;
    this.activeLayer = "all"; // all, life, head, heart, fate, sun, mercury, mounts
    this.showSkeletonOverlay = false;
    this.showRidgeOverlay = false;
    this.isScanning = false;
    this.torchOn = false;

    this.initDOM();
    this.initEvents();
    if (window.PalmMediaPipe && typeof window.PalmMediaPipe.warmup === "function") {
      window.PalmMediaPipe.warmup();
    }
  }

  initDOM() {
    // Mode Container
    this.container = document.getElementById("palm-mode-container");

    // Screens inside Palm Container
    this.screenCapture = document.getElementById("screen-palm-capture");
    this.screenScanning = document.getElementById("screen-palm-scanning");
    this.screenResult = document.getElementById("screen-palm-result");

    // Camera & Capture Elements
    this.video = document.getElementById("palm-camera-feed");
    this.cameraContainer = document.getElementById("palm-camera-container");
    this.cameraReticle = document.getElementById("palm-camera-reticle");
    this.btnCapturePhoto = document.getElementById("btn-palm-capture-photo");
    this.btnSwitchCamera = document.getElementById("btn-palm-switch-camera");
    this.btnToggleTorch = document.getElementById("btn-palm-toggle-torch");
    this.btnHandToggleLeft = document.getElementById("btn-palm-hand-left");
    this.btnHandToggleRight = document.getElementById("btn-palm-hand-right");
    this.fileInput = document.getElementById("palm-file-input");
    this.btnUploadPhoto = document.getElementById("btn-palm-upload-trigger");
    this.btnSampleDemo = document.getElementById("btn-palm-sample-demo");
    this.uploadDropZone = document.getElementById("palm-upload-dropzone");

    // Scanning Animation Elements
    this.scanProgressBar = document.getElementById("palm-scan-progress-fill");
    this.scanStepText = document.getElementById("palm-scan-step-text");
    this.scanLaserBeam = document.getElementById("palm-scan-laser-beam");

    // Result & Inspection Elements
    this.resultCanvas = document.getElementById("palm-result-canvas");
    this.resultCanvasWrap = document.getElementById("palm-result-canvas-wrap");
    this.confidenceBadge = document.getElementById("palm-confidence-badge");
    this.confidenceValue = document.getElementById("palm-confidence-val");
    this.handInfoPill = document.getElementById("palm-hand-info-pill");
    this.layerFilterChips = document.querySelectorAll("[data-palm-layer]");
    this.btnToggleSkeleton = document.getElementById("btn-palm-toggle-skeleton");
    this.btnToggleRidge = document.getElementById("btn-palm-toggle-ridge");
    this.activeLineDetailBox = document.getElementById("palm-active-line-detail");

    // Calibration Sliders
    this.sliderBrightness = document.getElementById("palm-slider-brightness");
    this.sliderContrast = document.getElementById("palm-slider-contrast");
    this.sliderSensitivity = document.getElementById("palm-slider-sensitivity");
    this.btnRecalibrate = document.getElementById("btn-palm-recalibrate");

    // Action Buttons
    this.btnRetake = document.getElementById("btn-palm-retake");
    this.btnCopyReading = document.getElementById("btn-palm-copy-reading");
    this.btnShareSocial = document.getElementById("btn-palm-share-social");
    this.btnDownloadPdf = document.getElementById("btn-palm-download-pdf");

    // Result Aspects
    this.readingAspectsContainer = document.getElementById("palm-reading-aspects");
    this.summaryVerdictText = document.getElementById("palm-summary-verdict");
  }

  initEvents() {
    // Hand Toggle (ซ้าย/ขวา)
    if (this.btnHandToggleLeft) {
      this.btnHandToggleLeft.addEventListener("click", () => this.setHand("left"));
    }
    if (this.btnHandToggleRight) {
      this.btnHandToggleRight.addEventListener("click", () => this.setHand("right"));
    }

    // Capture & Camera Buttons
    if (this.btnCapturePhoto) {
      this.btnCapturePhoto.addEventListener("click", () => this.captureCameraFrame());
    }
    if (this.btnSwitchCamera) {
      this.btnSwitchCamera.addEventListener("click", () => this.switchCameraFacing());
    }
    if (this.btnToggleTorch) {
      this.btnToggleTorch.addEventListener("click", () => this.toggleCameraTorch());
    }

    // File Upload & Demo
    if (this.btnUploadPhoto && this.fileInput) {
      this.btnUploadPhoto.addEventListener("click", () => this.fileInput.click());
    }
    if (this.fileInput) {
      this.fileInput.addEventListener("change", (e) => {
        if (e.target.files && e.target.files[0]) {
          this.loadFile(e.target.files[0]);
        }
      });
    }
    if (this.btnSampleDemo) {
      this.btnSampleDemo.addEventListener("click", () => this.loadSamplePalmDemo());
    }

    // Drag & Drop
    if (this.uploadDropZone) {
      this.uploadDropZone.addEventListener("dragover", (e) => {
        e.preventDefault();
        this.uploadDropZone.classList.add("dragover");
      });
      this.uploadDropZone.addEventListener("dragleave", () => {
        this.uploadDropZone.classList.remove("dragover");
      });
      this.uploadDropZone.addEventListener("drop", (e) => {
        e.preventDefault();
        this.uploadDropZone.classList.remove("dragover");
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          this.loadFile(e.dataTransfer.files[0]);
        }
      });
    }

    // Layer Filter Chips
    if (this.layerFilterChips) {
      this.layerFilterChips.forEach(chip => {
        chip.addEventListener("click", () => {
          this.layerFilterChips.forEach(c => c.classList.remove("active"));
          chip.classList.add("active");
          this.activeLayer = chip.getAttribute("data-palm-layer") || "all";
          this.renderResultHUD();
          this.updateActiveLineDetail(this.activeLayer);
        });
      });
    }

    if (this.btnToggleSkeleton) {
      this.btnToggleSkeleton.addEventListener("click", () => {
        this.showSkeletonOverlay = !this.showSkeletonOverlay;
        this.btnToggleSkeleton.classList.toggle("active", this.showSkeletonOverlay);
        this.renderResultHUD();
      });
    }
    if (this.btnToggleRidge) {
      this.btnToggleRidge.addEventListener("click", () => {
        this.showRidgeOverlay = !this.showRidgeOverlay;
        this.btnToggleRidge.classList.toggle("active", this.showRidgeOverlay);
        this.renderResultHUD();
      });
    }

    // Recalibrate
    if (this.btnRecalibrate) {
      this.btnRecalibrate.addEventListener("click", () => this.recalibrateScan());
    }

    // Retake
    if (this.btnRetake) {
      this.btnRetake.addEventListener("click", () => this.resetToCaptureScreen());
    }

    // Actions
    if (this.btnCopyReading) {
      this.btnCopyReading.addEventListener("click", () => this.copyReadingToClipboard());
    }
    if (this.btnShareSocial) {
      this.btnShareSocial.addEventListener("click", () => this.sharePalmToSocial());
    }
    if (this.btnDownloadPdf) {
      this.btnDownloadPdf.addEventListener("click", () => this.downloadPalmPdf());
    }
  }

  setHand(hand) {
    this.currentHand = hand;
    if (this.btnHandToggleLeft) this.btnHandToggleLeft.classList.toggle("active", hand === "left");
    if (this.btnHandToggleRight) this.btnHandToggleRight.classList.toggle("active", hand === "right");
    if (this.cameraReticle) {
      this.cameraReticle.setAttribute("data-hand", hand);
    }
    if (window.mysticAudio) window.mysticAudio.playClick();
  }

  async startCamera(facingMode = "environment") {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.warn("Camera not supported on this browser/environment.");
      return false;
    }
    try {
      this.stopCamera();
      const constraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 960 }
        },
        audio: false
      };
      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (this.video) {
        this.video.srcObject = this.stream;
        await this.video.play();
      }
      return true;
    } catch (err) {
      console.warn("Could not start camera with constraints:", err);
      // Fallback to basic video
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (this.video) {
          this.video.srcObject = this.stream;
          await this.video.play();
        }
        return true;
      } catch (e) {
        console.warn("Camera access denied or unavailable:", e);
        return false;
      }
    }
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(t => t.stop());
      this.stream = null;
    }
    if (this.video) {
      this.video.srcObject = null;
    }
  }

  async switchCameraFacing() {
    this.cameraFacing = this.cameraFacing === "user" ? "environment" : "user";
    await this.startCamera(this.cameraFacing);
    if (window.mysticAudio) window.mysticAudio.playClick();
  }

  async toggleCameraTorch() {
    if (!this.stream) return;
    const track = this.stream.getVideoTracks()[0];
    if (track && track.applyConstraints) {
      this.torchOn = !this.torchOn;
      try {
        await track.applyConstraints({ advanced: [{ torch: this.torchOn }] });
        if (this.btnToggleTorch) {
          this.btnToggleTorch.classList.toggle("active", this.torchOn);
        }
      } catch (_) {}
    }
  }

  captureCameraFrame() {
    if (!this.video || !this.video.videoWidth) {
      // If camera not ready, offer sample demo or file picker
      if (this.fileInput) this.fileInput.click();
      return;
    }
    if (window.mysticAudio) window.mysticAudio.playWhoosh();
    const c = document.createElement("canvas");
    c.width = this.video.videoWidth;
    c.height = this.video.videoHeight;
    const ctx = c.getContext("2d");
    ctx.drawImage(this.video, 0, 0);

    const img = new Image();
    img.onload = () => {
      this.capturedImage = img;
      this.startScanningProcess(img);
    };
    img.src = c.toDataURL("image/jpeg", 0.95);
  }

  loadFile(file) {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        this.capturedImage = img;
        this.startScanningProcess(img);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  loadSamplePalmDemo() {
    if (window.mysticAudio) window.mysticAudio.playCrystalBell(880, 1.2);
    // สร้างภาพตัวอย่างฝ่ามือ (นิ้ว 5 นิ้ว + ข้อมือ + โทนสีผิวจริง + ร่องเส้นหลัก) ให้ระบบ CV ตรวจจับได้จริง
    const w = 720, h = 960;
    const isLeft = this.currentHand === "left";
    const mx = (x) => (isLeft ? w - x : x);
    const demoCanvas = document.createElement("canvas");
    demoCanvas.width = w;
    demoCanvas.height = h;
    const ctx = demoCanvas.getContext("2d");

    ctx.fillStyle = "#3f4654";
    ctx.fillRect(0, 0, w, h);

    const skinGrad = ctx.createRadialGradient(mx(w * 0.50), h * 0.65, 30, mx(w * 0.50), h * 0.65, 360);
    skinGrad.addColorStop(0, "#e6b39c");
    skinGrad.addColorStop(0.75, "#d4987f");
    skinGrad.addColorStop(1, "#bc7d66");

    const drawDigit = (x1, y1, x2, y2, radius) => {
      ctx.save();
      ctx.strokeStyle = skinGrad;
      ctx.lineWidth = radius * 2;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(mx(x1), y1);
      ctx.lineTo(mx(x2), y2);
      ctx.stroke();
      ctx.restore();
    };

    // ข้อมือ + ตัวฝ่ามือ
    ctx.fillStyle = skinGrad;
    ctx.beginPath();
    ctx.rect(mx(isLeft ? w * 0.66 : w * 0.33), h * 0.85, w * 0.33, h * 0.15);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(mx(w * 0.23), h * 0.50);
    ctx.bezierCurveTo(mx(w * 0.21), h * 0.70, mx(w * 0.28), h * 0.86, mx(w * 0.34), h * 0.89);
    ctx.lineTo(mx(w * 0.65), h * 0.89);
    ctx.bezierCurveTo(mx(w * 0.76), h * 0.81, mx(w * 0.79), h * 0.64, mx(w * 0.72), h * 0.46);
    ctx.bezierCurveTo(mx(w * 0.55), h * 0.42, mx(w * 0.35), h * 0.44, mx(w * 0.23), h * 0.50);
    ctx.closePath();
    ctx.fill();

    // นิ้วก้อย นาง กลาง ชี้ โป้ง (แยกช่องนิ้วให้ skin-geometry & MediaPipe จับได้ชัด)
    drawDigit(w * 0.26, h * 0.50, w * 0.24, h * 0.20, 26); // pinky
    drawDigit(w * 0.38, h * 0.46, w * 0.37, h * 0.09, 29); // ring
    drawDigit(w * 0.50, h * 0.44, w * 0.50, h * 0.04, 31); // middle
    drawDigit(w * 0.63, h * 0.46, w * 0.63, h * 0.10, 30); // index
    drawDigit(w * 0.70, h * 0.72, w * 0.86, h * 0.42, 34); // thumb

    // ร่องรอยเส้นหลักตามพิกัดฝ่ามือจริง (u: ขอบก้อย→ขอบชี้, v: ข้อมือ→โคนนิ้ว)
    const S = (u, v) => [mx(w * (0.24 + u * 0.48)), h * (0.87 - v * 0.39)];
    const drawCrease = (pts, width, alpha) => {
      ctx.save();
      ctx.strokeStyle = `rgba(92, 42, 32, ${alpha})`;
      ctx.lineWidth = width;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.shadowColor = "rgba(70, 30, 22, 0.45)";
      ctx.shadowBlur = 4;
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
      ctx.stroke();
      ctx.restore();
    };
    drawCrease([S(0.03, 0.70), S(0.32, 0.79), S(0.60, 0.90), S(0.79, 1.01)], 5.2, 0.62); // heart
    drawCrease([S(0.92, 0.72), S(0.69, 0.64), S(0.43, 0.56), S(0.12, 0.45)], 4.8, 0.56); // head
    drawCrease([S(0.92, 0.72), S(0.75, 0.61), S(0.67, 0.40), S(0.69, 0.10)], 5.4, 0.60); // life
    drawCrease([S(0.50, 0.08), S(0.50, 0.42), S(0.54, 0.78)], 4.0, 0.48);                // fate
    drawCrease([S(0.34, 0.46), S(0.34, 0.68), S(0.36, 0.84)], 3.2, 0.40);                // sun

    const img = new Image();
    img.onload = () => {
      this.capturedImage = img;
      this.startScanningProcess(img);
    };
    img.src = demoCanvas.toDataURL("image/jpeg", 0.95);
  }

  async startScanningProcess(imageSource) {
    this.isScanning = true;
    this.stopCamera();

    // สลับไปยังหน้าต่างแอนิเมชันการสแกน
    if (this.screenCapture) this.screenCapture.classList.remove("active");
    if (this.screenResult) this.screenResult.classList.remove("active");
    if (this.screenScanning) this.screenScanning.classList.add("active");

    const steps = [
      { text: "กำลังตรวจจับตำแหน่งฝ่ามือและจุดกระดูก 21 ข้อ (MediaPipe / Skin-CV)...", pct: 35 },
      { text: "กำลังสกัดร่องรอยลายมือแบบ Multi-Scale Hessian & Orientation Alignment...", pct: 70 }
    ];

    for (let i = 0; i < steps.length; i++) {
      if (this.scanStepText) this.scanStepText.textContent = steps[i].text;
      if (this.scanProgressBar) this.scanProgressBar.style.width = `${steps[i].pct}%`;
      if (window.mysticAudio && i === 0) {
        window.mysticAudio.playCrystalBell(560, 0.5);
      }
      await new Promise(r => setTimeout(r, 180));
    }

    // ประมวลผลด้วย Engine จริง
    const brightness = this.sliderBrightness ? Number(this.sliderBrightness.value) : 0;
    const contrast = this.sliderContrast ? Number(this.sliderContrast.value) : 0;
    const sensitivity = this.sliderSensitivity ? Number(this.sliderSensitivity.value) : 3;

    this.scanResult = await this.engine.scanPalmImage(imageSource, {
      hand: this.currentHand,
      brightness,
      contrast,
      sensitivity
    });

    if (!this.scanResult || this.scanResult.ok === false) {
      this.isScanning = false;
      const errMsg = (this.scanResult && this.scanResult.message) || "ไม่พบฝ่ามือชัดเจนในภาพ กรุณาวางฝ่ามือในที่แสงสว่างและกางนิ้วเล็กน้อย";
      if (window.taroApp && typeof window.taroApp.showToast === "function") {
        window.taroApp.showToast(errMsg);
      } else {
        alert(errMsg);
      }
      this.resetToCaptureScreen();
      return;
    }

    if (this.scanStepText) this.scanStepText.textContent = "ตรวจวัดความลึก ความยาว และเนินทั้ง 7 สำเร็จเรียบร้อย!";
    if (this.scanProgressBar) this.scanProgressBar.style.width = "100%";

    if (window.codeManager && window.taroApp && window.taroApp.activeCode && typeof window.codeManager.recordReadingDraw === "function") {
      try {
        window.codeManager.recordReadingDraw(window.taroApp.activeCode, {
          mode: "palm",
          hand: this.scanResult.hand,
          confidence: this.scanResult.confidence ? this.scanResult.confidence.percentage : 0,
          summary: this.scanResult.reading ? this.scanResult.reading.summaryVerdict : ""
        });
      } catch (_) {}
    }

    this.isScanning = false;
    this.showResultScreen();
  }

  showResultScreen() {
    if (!this.scanResult || this.scanResult.ok === false) return;

    if (this.screenScanning) this.screenScanning.classList.remove("active");
    if (this.screenCapture) this.screenCapture.classList.remove("active");
    if (this.screenResult) this.screenResult.classList.add("active");

    const conf = this.scanResult.confidence;
    if (this.confidenceBadge) {
      this.confidenceBadge.innerHTML = `🎯 ${conf.label} (<strong id="palm-confidence-val">${conf.percentage}%</strong>)`;
      this.confidenceValue = document.getElementById("palm-confidence-val");
    }
    if (this.handInfoPill) {
      const hMeta = this.scanResult.reading.handMeta || {};
      const detLabel = this.scanResult.detectedHand === "left" ? "มือซ้าย" : "มือขวา";
      const matchNote = this.scanResult.detectedHand && this.scanResult.detectedHand !== this.currentHand
        ? ` • ภาพตรวจพบ: ${detLabel}`
        : "";
      this.handInfoPill.textContent = `✋ ${hMeta.name || (this.currentHand === "left" ? "มือซ้าย" : "มือขวา")}${matchNote}`;
    }
    if (this.summaryVerdictText) {
      const meth = this.scanResult.landmarkMethod === "mediapipe" ? "MediaPipe 21 จุด" : "Offline Skin-CV";
      this.summaryVerdictText.textContent = `ตรวจพบเส้นชัดเจน ${conf.featuresDetected} จาก 6 เส้นหลัก (${meth} • ใช้เวลา ${this.scanResult.elapsedMs || 0} ms) พร้อมคำทำนายจากคัมภีร์หัตถศาสตร์`;
    }

    // เรนเดอร์ Canvas ภาพลายมือพร้อมเส้นเวกเตอร์ HUD
    this.renderResultHUD();

    // แสดงคำทำนาย 5 ด้าน
    this.renderReadingAspects();

    // อัปเดตรายละเอียดเส้นที่เลือก
    this.updateActiveLineDetail("all");

    if (window.mysticAudio) {
      window.mysticAudio.playCrystalBell(1046.5, 1.6);
    }
  }

  renderResultHUD() {
    if (!this.scanResult || !this.resultCanvas || !this.capturedImage) return;

    const res = this.scanResult;
    const canvas = this.resultCanvas;
    canvas.width = res.width;
    canvas.height = res.height;
    const ctx = canvas.getContext("2d");

    // 1. วาดภาพจริงของฝ่ามือ
    ctx.drawImage(this.capturedImage, 0, 0, res.width, res.height);

    // 2. เคลือบฟิล์ม Mystic Dark เพื่อให้เส้นเวกเตอร์เด่นชัด
    ctx.fillStyle = "rgba(4, 7, 20, 0.34)";
    ctx.fillRect(0, 0, res.width, res.height);

    // 2b. แผนที่ร่องลายมือจาก Hessian (ถอด/เปิดดูได้)
    if (this.showRidgeOverlay && res.debug && res.debug.ridge) {
      this.drawRidgeOverlay(ctx, res.debug);
    }

    // 2c. กรอบฝ่ามือและจุดกระดูก 21 ข้อ (MediaPipe / Skin-CV)
    if (this.showSkeletonOverlay && res.anchors) {
      this.drawSkeletonOverlay(ctx, res.anchors);
    }

    // 3. วาดเส้นลายมือตาม Layer ที่เลือก
    const kb = window.PALM_KNOWLEDGE_BASE ? window.PALM_KNOWLEDGE_BASE.lines : {};
    const linesToDraw = this.activeLayer === "all"
      ? ["life", "head", "heart", "fate", "sun", "mercury"]
      : (this.activeLayer === "mounts" ? [] : [this.activeLayer]);

    linesToDraw.forEach(lineKey => {
      const lineData = res.lines[lineKey];
      if (!lineData || !lineData.points || lineData.points.length < 2) return;
      if (this.activeLayer === "all" && !lineData.detected) return;

      const meta = kb[lineKey] || { color: "#38bdf8", name: lineKey };
      const pts = lineData.points;

      if (!lineData.detected) {
        ctx.save();
        ctx.strokeStyle = meta.color;
        ctx.lineWidth = 2.5;
        ctx.setLineDash([6, 6]);
        ctx.globalAlpha = 0.55;
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
        ctx.stroke();
        ctx.restore();
        return;
      }

      // Glow Effect ภายนอก
      ctx.save();
      ctx.strokeStyle = meta.color;
      ctx.lineWidth = this.activeLayer === lineKey ? 10 : 8;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.shadowColor = meta.color;
      ctx.shadowBlur = 14;
      ctx.globalAlpha = 0.4;

      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) {
        ctx.lineTo(pts[i].x, pts[i].y);
      }
      ctx.stroke();
      ctx.restore();

      // เส้นเวกเตอร์คมชัดภายใน
      ctx.save();
      ctx.strokeStyle = meta.color;
      ctx.lineWidth = this.activeLayer === lineKey ? 4.2 : 3.2;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.shadowColor = "#ffffff";
      ctx.shadowBlur = 5;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) {
        ctx.lineTo(pts[i].x, pts[i].y);
      }
      ctx.stroke();

      // วาดโหนดจุดหัว-ท้าย
      [pts[0], pts[Math.floor(pts.length / 2)], pts[pts.length - 1]].forEach(p => {
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = meta.color;
        ctx.lineWidth = 1.8;
        ctx.stroke();
      });

      // ป้ายชื่อเส้น
      const midPoint = pts[Math.floor(pts.length / 2)];
      ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
      ctx.strokeStyle = meta.color;
      ctx.lineWidth = 1.5;
      const labelText = `${meta.name} (${lineData.metrics.confidenceScore.toFixed(0)}%)`;
      ctx.font = "bold 13px 'Prompt', sans-serif";
      const textW = ctx.measureText(labelText).width;
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(midPoint.x - (textW / 2) - 6, midPoint.y - 18, textW + 12, 22, 6);
      } else {
        ctx.rect(midPoint.x - (textW / 2) - 6, midPoint.y - 18, textW + 12, 22);
      }
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(labelText, midPoint.x, midPoint.y - 7);
      ctx.restore();
    });

    // 4. วาดเนินทั้ง 7 หากเลือก "all" หรือ "mounts"
    if (this.activeLayer === "all" || this.activeLayer === "mounts") {
      ctx.save();
      for (const [mKey, mData] of Object.entries(res.mounts)) {
        ctx.strokeStyle = "rgba(243, 207, 122, 0.65)";
        ctx.lineWidth = 1.8;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(mData.center.x, mData.center.y, mData.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Glyphs & Label
        ctx.fillStyle = "rgba(243, 207, 122, 0.9)";
        ctx.font = "bold 14px 'Cinzel', serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(mData.symbol, mData.center.x, mData.center.y - 5);

        ctx.font = "11px 'Prompt', sans-serif";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(mData.name, mData.center.x, mData.center.y + 12);
      }
      ctx.restore();
    }
  }

  drawRidgeOverlay(ctx, debug) {
    const c = debug.crop;
    if (!c || !c.w || !c.h) return;
    const tmp = document.createElement("canvas");
    tmp.width = c.w;
    tmp.height = c.h;
    const tctx = tmp.getContext("2d");
    const img = tctx.createImageData(c.w, c.h);
    const d = img.data;
    const r = debug.ridge;
    for (let i = 0; i < r.length; i++) {
      const val = r[i];
      if (val < 0.08) continue;
      const q = i * 4;
      const intensity = Math.min(255, Math.round(val * 255));
      d[q] = 120 + Math.round(intensity * 0.5);
      d[q + 1] = 240;
      d[q + 2] = 255;
      d[q + 3] = Math.min(220, Math.round(val * 230));
    }
    tctx.putImageData(img, 0, 0);
    ctx.save();
    ctx.drawImage(tmp, c.x, c.y, c.w / c.scale, c.h / c.scale);
    ctx.restore();
  }

  drawSkeletonOverlay(ctx, anchors) {
    ctx.save();
    if (anchors.palmQuad && anchors.palmQuad.length === 4) {
      ctx.strokeStyle = "rgba(255, 255, 255, 0.72)";
      ctx.lineWidth = 1.8;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(anchors.palmQuad[0].x, anchors.palmQuad[0].y);
      for (let i = 1; i < 4; i++) ctx.lineTo(anchors.palmQuad[i].x, anchors.palmQuad[i].y);
      ctx.closePath();
      ctx.stroke();
      ctx.setLineDash([]);
    }

    const lm = anchors.landmarks || [];
    const pairs = [
      [0, 1], [1, 2], [2, 3], [3, 4],
      [0, 5], [5, 6], [6, 7], [7, 8],
      [0, 17], [5, 9], [9, 13], [13, 17],
      [9, 10], [10, 11], [11, 12],
      [13, 14], [14, 15], [15, 16],
      [17, 18], [18, 19], [19, 20]
    ];
    ctx.strokeStyle = "rgba(250, 204, 21, 0.85)";
    ctx.lineWidth = 2;
    for (const [a, b] of pairs) {
      if (!lm[a] || !lm[b]) continue;
      ctx.beginPath();
      ctx.moveTo(lm[a].x, lm[a].y);
      ctx.lineTo(lm[b].x, lm[b].y);
      ctx.stroke();
    }
    for (let i = 0; i < lm.length; i++) {
      const p = lm[i];
      if (!p) continue;
      const isCore = i === 0 || i === 5 || i === 9 || i === 13 || i === 17;
      ctx.fillStyle = isCore ? "#facc15" : "#fef08a";
      ctx.beginPath();
      ctx.arc(p.x, p.y, isCore ? 5 : 3.2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  updateActiveLineDetail(layerKey) {
    if (!this.activeLineDetailBox || !this.scanResult) return;

    const res = this.scanResult;
    const kbLines = window.PALM_KNOWLEDGE_BASE ? window.PALM_KNOWLEDGE_BASE.lines : {};

    if (layerKey === "all") {
      const mini = (id, name, color) => {
        const l = res.lines[id] || {};
        const m = l.metrics || {};
        const stat = l.detected ? `${m.confidenceScore || 0}%` : "ไม่ชัดเจน";
        return `
          <div class="line-mini-badge" style="border-left: 3px solid ${color}; opacity:${l.detected ? 1 : 0.72};">
            <strong>${name}:</strong> ${m.specialTrait || "-"} (${stat})
          </div>`;
      };
      this.activeLineDetailBox.innerHTML = `
        <div class="line-detail-summary-grid">
          ${mini("life", "เส้นชีวิต", "#10b981")}
          ${mini("head", "เส้นสมอง", "#06b6d4")}
          ${mini("heart", "เส้นหัวใจ", "#ec4899")}
          ${mini("fate", "เส้นวาสนา", "#eab308")}
        </div>
      `;
      return;
    }

    if (layerKey === "mounts") {
      const topMounts = Object.values(res.mounts || {})
        .filter(m => m.fullness === "full")
        .map(m => `${m.name} (${m.fullnessScore || "-"}%)`)
        .join(", ") || "สมดุลทุกเนิน";
      this.activeLineDetailBox.innerHTML = `
        <div class="mounts-detail-summary">
          <strong>ตรวจวัดตำแหน่งเนินบนฝ่ามือครบ 7 เนิน (ตำแหน่งอ้างอิงตาม Landmark จริง):</strong>
          <p>เนินเด่นพิเศษในภาพนี้: <strong>${topMounts}</strong></p>
        </div>
      `;
      return;
    }

    const line = res.lines[layerKey];
    const meta = kbLines[layerKey] || { name: layerKey, color: "#f3cf7a", description: "" };
    if (!line) return;
    const m = line.metrics || {};
    const statusBadge = line.detected
      ? `ความแม่นยำวัดจริง: ${Number(m.confidenceScore || 0).toFixed(1)}%`
      : `ไม่พบร่องเส้นชัดเจนในภาพ (${Number(m.confidenceScore || 0).toFixed(0)}%)`;

    this.activeLineDetailBox.innerHTML = `
      <div class="line-focused-card" style="border-color: ${meta.color};">
        <div class="focused-header">
          <span class="focused-title" style="color: ${meta.color};">✦ ${meta.name} (${meta.enName || ""})</span>
          <span class="focused-accuracy">${statusBadge}</span>
        </div>
        <p class="focused-desc">${meta.description || ""}</p>
        <div class="focused-stats">
          <span>ความต่อเนื่อง: <strong>${m.coveragePercentage || 0}%</strong></span>
          <span>ความลึกชัด: <strong>${m.depthScore || 0}%</strong></span>
          <span>ความยาวเทียบฝ่ามือ: <strong>${m.lengthPercentage || 0}%</strong></span>
          <span>ลักษณะที่วัดได้: <strong>${m.specialTrait || "-"}</strong></span>
        </div>
      </div>
    `;
  }

  renderReadingAspects() {
    if (!this.scanResult || !this.readingAspectsContainer) return;
    const reading = this.scanResult.reading;

    const cardsHtml = Object.values(reading.aspects).map(asp => `
      <div class="palm-aspect-card">
        <div class="aspect-card-header">
          <span class="aspect-icon">${asp.icon}</span>
          <div class="aspect-title-wrap">
            <h4>${asp.title}</h4>
            <span class="aspect-grade-pill">${asp.grade}</span>
          </div>
        </div>
        <p class="aspect-text">${asp.text}</p>
      </div>
    `).join("");

    this.readingAspectsContainer.innerHTML = cardsHtml;

    if (this.summaryVerdictText) {
      this.summaryVerdictText.textContent = reading.summaryVerdict;
    }
  }

  async recalibrateScan() {
    if (!this.capturedImage) return;
    if (window.mysticAudio) window.mysticAudio.playWhoosh();
    this.startScanningProcess(this.capturedImage);
  }

  resetToCaptureScreen() {
    this.scanResult = null;
    this.capturedImage = null;
    if (this.screenResult) this.screenResult.classList.remove("active");
    if (this.screenScanning) this.screenScanning.classList.remove("active");
    if (this.screenCapture) this.screenCapture.classList.add("active");
    this.startCamera();
  }

  copyReadingToClipboard() {
    if (!this.scanResult) return;
    const reading = this.scanResult.reading;
    const text = `✋ ผลการสแกนดูลายมืออัจฉริยะ (${reading.handMeta.name})\n` +
      `ความแม่นยำการตรวจวัด: ${this.scanResult.confidence.percentage}%\n\n` +
      `🌟 วาสนาชีวิต & สุขภาพ: ${reading.aspects.life.text}\n\n` +
      `🧠 สติปัญญา & การงาน: ${reading.aspects.intellect.text}\n\n` +
      `💖 ความรัก & จิตใจ: ${reading.aspects.love.text}\n\n` +
      `💰 โชคลาภ & เกียรติยศ: ${reading.aspects.wealth.text}\n\n` +
      `🌿 คำแนะนำมงคล: ${reading.aspects.guidance.text}\n\n` +
      `บทสรุป: ${reading.summaryVerdict}\n#สแกนลายมือ #ดูดวงลายมือ #เซียมซีทาโรต์`;

    navigator.clipboard.writeText(text).then(() => {
      if (window.taroApp && window.taroApp.showToast) {
        window.taroApp.showToast("📋 คัดลอกผลการสแกนลายมือฉบับเต็มเรียบร้อยแล้ว!");
      }
      if (window.mysticAudio) window.mysticAudio.playCrystalBell(880, 1.2);
    });
  }

  sharePalmToSocial() {
    if (!this.scanResult) return;
    const payload = {
      mode: "palm",
      hand: this.currentHand,
      confidence: this.scanResult.confidence.percentage,
      summaryVerdict: this.scanResult.reading.summaryVerdict,
      aspects: this.scanResult.reading.aspects,
      timestamp: Date.now()
    };
    if (window.taroApp && typeof window.taroApp.shareToSocialPlatform === "function") {
      window.taroApp.activeSocialPayload = payload;
      window.taroApp.shareToSocialPlatform("facebook", "palm");
    }
  }

  downloadPalmPdf() {
    if (!this.scanResult) return;
    const payload = {
      mode: "palm",
      hand: this.currentHand,
      confidence: this.scanResult.confidence.percentage,
      summaryVerdict: this.scanResult.reading.summaryVerdict,
      aspects: this.scanResult.reading.aspects,
      timestamp: Date.now()
    };
    if (window.taroApp && typeof window.taroApp.downloadDirectPDF === "function") {
      window.taroApp.downloadDirectPDF(payload);
    }
  }
}

// Global instance
if (typeof window !== "undefined") {
  window.PalmScannerEngine = PalmScannerEngine;
  window.PalmApp = PalmApp;
}
