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
    const detectedHand = options.forceHand || vision.handedness || hand;
    const effectiveHand = detectedHand === "left" || detectedHand === "right" ? detectedHand : hand;
    const reading = this.interpretPalmReading(lines, mounts, effectiveHand, confidence);

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
  interpretDualHandReading(leftScan, rightScan) {
    const lScan = leftScan || rightScan || {};
    const rScan = rightScan || leftScan || {};
    const lR = lScan.reading || this.interpretPalmReading(lScan.lines || {}, lScan.mounts || {}, "left", lScan.confidence || {});
    const rR = rScan.reading || this.interpretPalmReading(rScan.lines || {}, rScan.mounts || {}, "right", rScan.confidence || {});

    const lPct = Math.round(Number((lScan.confidence && lScan.confidence.percentage) || 78));
    const rPct = Math.round(Number((rScan.confidence && rScan.confidence.percentage) || 78));
    const avgPct = Number(((lPct + rPct) / 2).toFixed(1));

    const lLines = lScan.lines || {};
    const rLines = rScan.lines || {};
    const lMounts = lScan.mounts || {};
    const rMounts = rScan.mounts || {};

    const lifeL = lLines.life || {};
    const lifeR = rLines.life || {};
    const lifeDepthR = (lifeR.metrics && lifeR.metrics.depthScore) || 55;
    const lifeArcR = (lifeR.traits && lifeR.traits.arc) || "moderate";
    const venusFullR = rMounts.venus && rMounts.venus.fullness === "full";
    const venusFullL = lMounts.venus && lMounts.venus.fullness === "full";

    const headR = rLines.head || {};
    const headL = lLines.head || {};
    const headSlopeR = (headR.traits && headR.traits.slope) || "straight";
    const headLenR = (headR.metrics && headR.metrics.lengthPercentage) || 50;

    const heartR = rLines.heart || {};
    const heartTargetR = (heartR.traits && heartR.traits.endTarget) || "between";

    const fateL = Boolean(lLines.fate && lLines.fate.detected);
    const fateR = Boolean(rLines.fate && rLines.fate.detected);
    const sunL = Boolean(lLines.sun && lLines.sun.detected);
    const sunR = Boolean(rLines.sun && rLines.sun.detected);
    const mercBoth = Boolean((lLines.mercury && lLines.mercury.detected) || (rLines.mercury && rLines.mercury.detected));
    const fateOrigR = (rLines.fate && rLines.fate.traits && rLines.fate.traits.origin) || "wrist";

    // 1. สุขภาพและพลังชีวิต
    const lifeGrade = (lifeR.detected && (lifeArcR === "wide" || lifeDepthR >= 55 || venusFullR))
      ? "แข็งแรง ฟื้นตัวไว"
      : (lifeR.detected ? "สมดุล คล่องตัวดี" : "ควรเน้นพักผ่อนให้เพียงพอ");
    let lifeDualText = "";
    if (lifeR.detected && (lifeArcR === "wide" || venusFullR || venusFullL)) {
      lifeDualText = "พื้นฐานร่างกายและพลังใจของคุณค่อนข้างอึด ลุยงานหนักหรือรับผิดชอบหลายเรื่องพร้อมกันได้ดี เวลาเหนื่อยล้าก็ฟื้นตัวไว ช่วงนี้แค่ดูแลเรื่องนอนหลับและดื่มน้ำให้พอก็จะยิ่งสดชื่นมีพลังเต็มที่";
    } else if (lifeR.detected && lifeL.detected && lifeDepthR >= 50) {
      lifeDualText = "จังหวะพลังชีวิตสม่ำเสมอ ร่างกายปรับตัวเข้ากับความเปลี่ยนแปลงและงานที่เร่งรีบได้ดี พื้นฐานสุขภาพถือว่าอยู่ในเกณฑ์ดี แต่ควรแบ่งเวลาผ่อนคลายความเครียดบ้างเพื่อไม่ให้ล้าสะสม";
    } else {
      lifeDualText = "คุณเป็นคนใช้พลังงานอย่างรู้จังหวะ ไม่ชอบฝืนหักโหมเกินกำลัง จึงทำงานระยะยาวได้ต่อเนื่อง หากจัดตารางนอนให้เป็นเวลาและออกกำลังกายเบาๆ สม่ำเสมอ สุขภาพจะนิ่งและแข็งแรงขึ้นมาก";
    }

    // 2. ความคิดและการงาน
    const intellectGrade = headSlopeR === "curved_moon"
      ? "ไอเดียดี มีไหวพริบ"
      : (headLenR >= 60 ? "คิดเป็นระบบ ตัดสินใจคม" : "รอบคอบ แก้ปัญหาเก่ง");
    let intellectDualText = "";
    if (headSlopeR === "curved_moon") {
      intellectDualText = "ความคิดของคุณผสานทั้งเหตุผลและมุมมองสร้างสรรค์ได้ดี อ่านคนและจับจังหวะสถานการณ์เก่ง เหมาะกับงานที่ได้วางแผน คิดไอเดียใหม่ หรือสื่อสารกับผู้คน แค่จัดลำดับงานให้ชัดก็จะไปได้ไวมาก";
    } else if (headLenR >= 60) {
      intellectDualText = "แนวคิดของคุณเป็นขั้นเป็นตอน มองความเป็นจริงชัดและตัดสินใจได้เด็ดขาด เมื่อเจอปัญหาเฉพาะหน้าจะตั้งสติและหาทางออกได้ไว เหมาะกับการคุมงานหรือรับหน้าที่สำคัญที่ต้องอาศัยความแม่นยำ";
    } else if (headL.detected || headR.detected) {
      intellectDualText = "คุณเป็นคนคิดรอบคอบและเรียนรู้จากประสบการณ์จริงได้ดี มีความละเอียดถี่ถ้วนก่อนลงมือทำ ในเรื่องงานถ้ามั่นใจในตัวเองมากขึ้นและกล้าตัดสินใจเร็วขึ้นอีกนิด โอกาสดีๆ จะเข้ามาชัดมาก";
    } else {
      intellectDualText = "สไตล์การทำงานเน้นความยืดหยุ่นและปรับวิธีคิดตามหน้างานเก่ง ไม่ยึดติดกรอบเดิมๆ ช่วงนี้หากจดบันทึกวางแผนล่วงหน้าและโฟกัสทีละเป้าหมาย ผลงานจะออกมาโดดเด่นและไม่เหนื่อยฟรี";
    }

    // 3. ความรักและความสัมพันธ์
    const loveGrade = heartTargetR === "jupiter"
      ? "รักจริง ทุ่มเทใจ"
      : (heartTargetR === "between" ? "รักเข้าใจ ดูแลกันดี" : "รักมั่นคง ไม่หวือหวา");
    let loveDualText = "";
    if (heartTargetR === "jupiter") {
      loveDualText = "คุณเป็นคนรักจริงและคาดหวังความชัดเจน เวลาให้ใจใครจะซื่อสัตย์และดูแลอีกฝ่ายเต็มที่ ความสัมพันธ์จะราบรื่นมากเมื่อเปิดใจคุยกันตรงๆ และลดความคาดหวังเล็กๆ น้อยๆ ลงบ้าง";
    } else if (heartTargetR === "between") {
      loveDualText = "ความรักของคุณเดินด้วยความเข้าใจและเหตุผล รู้จักใส่ใจความรู้สึกของคนใกล้ตัวโดยไม่งี่เง่า เป็นคู่คิดที่ดีให้กันได้ยาวนาน ยิ่งแบ่งปันเรื่องราวในแต่ละวันกันสม่ำเสมอใจยิ่งใกล้กัน";
    } else {
      loveDualText = "ภายนอกอาจดูนิ่งๆ หรือไม่ใช่สายหวานจัด แต่ลึกๆ เป็นคนรักมั่นคงและรับผิดชอบความสัมพันธ์เก่ง ช่วยเหลือดูแลด้วยความจริงใจ หากแสดงออกหรือพูดความรู้สึกดีๆ บ่อยขึ้นจะช่วยเติมความอบอุ่นได้ดีมาก";
    }

    // 4. การเงินและโชคโอกาส
    const wealthGrade = (fateR && sunR)
      ? "การเงินเด่น มีคนสนับสนุน"
      : (fateR || fateL ? "สร้างฐานะมั่นคงขึ้นเรื่อยๆ" : "หาเงินคล่อง ได้หลายช่องทาง");
    let wealthDualText = "";
    if (fateR && sunR) {
      wealthDualText = "ดวงการเงินและโอกาสก้าวหน้าเปิดชัด งานที่ลงแรงไว้กำลังผลิดอกออกผลและมีเกณฑ์ได้รับการยอมรับหรือผู้ใหญ่คอยหนุน รายได้จะทยอยขยับขึ้นตามผลงานที่มีความสม่ำเสมอ";
    } else if (fateR || fateL) {
      const channelHint = fateOrigR === "moon"
        ? "โอกาสและรายรับมักเข้ามาจากการติดต่อผู้คน งานออนไลน์ หรือลูกค้าที่บอกต่อ"
        : "ความขยันและวินัยในการเก็บออมของคุณกำลังสร้างความมั่นคงให้ฐานะแบบค่อยเป็นค่อยไป";
      wealthDualText = `${channelHint} ยิ่งโฟกัสกับงานถนัดและทำอย่างต่อเนื่อง การเงินจะเริ่มลงตัวและมีเงินสำรองอุ่นใจขึ้นชัด`;
    } else {
      wealthDualText = "เส้นทางการเงินเป็นแบบอิสระ เติบโตจากไหวพริบและความสามารถเฉพาะตัว ไม่ถูกจำกัดด้วยทางเดียว ช่วงนี้มีช่องทางรายได้เสริมหรืองานโปรเจกต์ใหม่เข้ามาให้หยิบจับได้ดี";
    }

    // 5. คำแนะนำเสริมชีวิต
    const guidanceGrade = mercBoth ? "สื่อสารให้ชัด เปิดรับโอกาส" : "รักษาสมดุลแล้วเดินหน้าต่อ";
    const guidanceDualText = mercBoth
      ? "จุดแข็งของคุณอยู่ที่การพูดคุย เจรจา และสังเกตจังหวะเก่ง ถ้ากล้านำเสนอไอเดียและสร้างความสม่ำเสมอในการดูแลสุขภาพ โอกาสดีเรื่องงานกับเงินจะเข้ามาง่ายขึ้น พร้อมแบ่งเวลาทำบุญทำทานตามกำลังใจจะยิ่งสบายใจ"
      : "ชีวิตช่วงนี้เน้นความนิ่งและการลงมือทำทีละก้าวอย่างมั่นคง อย่าเร่งกดดันตัวเองเกินไป แค่พักผ่อนให้พอ รักษาคำพูดและความตั้งใจดีไว้ สิ่งที่วางแผนไว้จะค่อยๆ สำเร็จและราบรื่นอย่างเป็นธรรมชาติ";

    const rightConfirmFallback = {
      life: "ช่วงปัจจุบันสุขภาพและแรงกายยังหนุนได้ดี ควรรักษาเวลานอนให้สม่ำเสมอแล้วพลังจะอยู่ตัวนาน",
      intellect: "แนวโน้มช่วงนี้ตัดสินใจเรื่องงานและวางแผนได้คมขึ้นเมื่อโฟกัสทีละเป้าหมาย",
      love: "ช่วงนี้ความสัมพันธ์พัฒนาไปในทางที่มั่นคงขึ้นเมื่อเปิดใจสื่อสารกันตรงๆ",
      wealth: "จังหวะปัจจุบันเดินหน้าต่อได้สวย เน้นลงมือทำสม่ำเสมอแล้วรายรับจะค่อยๆ ชัดเจนขึ้น",
      guidance: "ทิศทางต่อจากนี้เน้นความต่อเนื่องและจัดสมดุลงานกับเวลาพักให้ลงตัวที่สุด"
    };

    const buildMergedAspect = (key, defaultIcon, defaultTitle, dualGrade, plainText) => {
      const lAsp = (lR.aspects && lR.aspects[key]) || { grade: "", text: "", shortNote: "" };
      const rAsp = (rR.aspects && rR.aspects[key]) || { grade: "", text: "", shortNote: "" };
      const cleanStr = (s) => String(s || "").replace(/\s*\(\s*\)/g, "").trim();
      const leftSummary = cleanStr(lAsp.shortNote || lAsp.text);
      let rightSummary = cleanStr(rAsp.shortNote || rAsp.text);
      if (rightSummary === leftSummary) {
        rightSummary = rightConfirmFallback[key] || rightSummary;
      }
      return {
        icon: rAsp.icon || lAsp.icon || defaultIcon,
        title: rAsp.title || lAsp.title || defaultTitle,
        grade: dualGrade || rAsp.grade || lAsp.grade || "สมดุลดี",
        leftNote: `มือซ้าย (พื้นดวงเดิม): ${leftSummary}`,
        rightNote: `มือขวา (ปัจจุบัน-อนาคต): ${rightSummary}`,
        text: cleanStr(plainText)
      };
    };

    const aspects = {
      life: buildMergedAspect("life", "🌟", "สุขภาพ และพลังชีวิต", lifeGrade, lifeDualText),
      intellect: buildMergedAspect("intellect", "🧠", "ความคิด การงาน และการตัดสินใจ", intellectGrade, intellectDualText),
      love: buildMergedAspect("love", "💖", "ความรัก และความสัมพันธ์", loveGrade, loveDualText),
      wealth: buildMergedAspect("wealth", "💰", "การเงิน โอกาส และความมั่นคง", wealthGrade, wealthDualText),
      guidance: buildMergedAspect("guidance", "🌿", "คำแนะนำที่ใช้ได้จริง", guidanceGrade, guidanceDualText)
    };

    const mentalSummary = headSlopeR === "curved_moon" ? "หัวไวด้านไอเดียและการสื่อสาร" : "ความคิดเป็นระบบและรอบคอบ";
    const fortuneSummary = (fateR || sunR) ? "มีจังหวะเติบโตจากการลงมือทำและผู้ใหญ่หนุน" : "หาโอกาสและรายได้เสริมได้หลายช่องทาง";

    return {
      hand: "both",
      handMeta: {
        name: "ฝ่ามือทั้ง 2 ข้าง (ซ้าย + ขวา)",
        role: "เปรียบเทียบพื้นนิสัยเดิมกับทิศทางชีวิตปัจจุบัน"
      },
      avgConfidence: avgPct,
      aspects,
      summaryVerdict: `ภาพรวมทั้ง 2 มือ (ความชัดเฉลี่ย ${avgPct}%): พื้นฐานร่างกายและกำลังใจดี ${mentalSummary} และ${fortuneSummary}`
    };
  }

  interpretPalmReading(lines, mounts, hand, confidence) {
    const kb = window.PALM_KNOWLEDGE_BASE || {};
    const handMeta = (kb.hands && kb.hands[hand]) || { name: hand === "left" ? "มือซ้าย" : "มือขวา" };

    const safeMount = (id) => (mounts && mounts[id]) || { fullness: "moderate", fullnessScore: 55 };
    const venusM = safeMount("venus");
    const saturnM = safeMount("saturn");
    const jupiterM = safeMount("jupiter");
    const sunM = safeMount("sun");

    // 1. สุขภาพและพลังชีวิต
    const life = (lines && lines.life) || {};
    const lifeL = life.metrics || {};
    const lT = life.traits || {};
    let lifeShort = "";
    let lifeText = "";
    let lifeGrade = "สมดุล คล่องตัวดี";
    if (!life.detected) {
      lifeGrade = "ต้องใส่ใจการพักผ่อน";
      lifeShort = "เส้นชีวิตค่อนข้างบาง จึงไวต่อความเหนื่อยล้าและต้องดูแลการนอนให้สม่ำเสมอ";
      lifeText = "ร่างกายไวต่อการพักผ่อนน้อยและความเครียดสะสม ถ้าโหมงานหนักติดต่อกันอาจอ่อนเพลียง่าย ช่วงนี้ควรเข้านอนให้เป็นเวลา ดื่มน้ำให้พอ และหาเวลาพักสมองระหว่างวันแล้วพลังกายจะกลับมาดีมาก";
    } else if (lT.arc === "wide" || venusM.fullness === "full") {
      lifeGrade = "แข็งแรง ฟื้นตัวไว";
      lifeShort = "อึดและฟื้นตัวเก่ง มีพลังใจพร้อมลุยเรื่องสำคัญและรับแรงกดดันได้ดี";
      lifeText = "คุณมีพื้นฐานกำลังกายและกำลังใจดี ลุยงานได้นานกว่าคนทั่วไปและเวลาป่วยหรือล้าก็ฟื้นตัวไว ระวังเพียงอย่ารับเรื่องคนอื่นมาแบกมากเกินไปจนลืมดูแลสุขภาพตัวเอง";
    } else if (lT.reachesWrist) {
      lifeGrade = "อึดทน ดูแลตัวเองดี";
      lifeShort = "พลังชีวิตต่อเนื่องยาวนาน ปรับตัวเข้ากับการทำงานและจังหวะชีวิตได้สบาย";
      lifeText = "ความแข็งแรงและการฟื้นตัวอยู่ในเกณฑ์ดี ทำงานระยะยาวได้สม่ำเสมอไม่แผ่วง่าย หากออกกำลังกายเบาๆ ต่อเนื่องและเลี่ยงการนอนดึกติดต่อกัน จะยิ่งช่วยให้ร่างกายสดชื่นกระปรี้กระเปร่า";
    } else {
      lifeShort = "ใช้พลังอย่างประหยัด เน้นความพอดีและจังหวะที่ไม่หักโหมเกินไป";
      lifeText = "คุณรู้ขีดจำกัดของตัวเองดี ไม่ค่อยฝืนใช้แรงเกินตัวจึงประคองงานและชีวิตได้ดี แนะนำให้แบ่งช่วงพักผ่อนให้ชัดและขยับร่างกายเบาๆ จะช่วยเสริมความสดใสและภูมิคุ้มกันได้ดีขึ้น";
    }

    // 2. ความคิดและการงาน
    const head = (lines && lines.head) || {};
    const headL = head.metrics || {};
    const hdT = head.traits || {};
    let headShort = "";
    let intellectText = "";
    let headGrade = "คิดรอบคอบ เป็นเหตุเป็นผล";
    if (!head.detected) {
      headGrade = "ปรับตัวไว ตามหน้างาน";
      headShort = "คิดไวพลิกแพลงตามสถานการณ์เก่ง แต่บางครั้งอาจลังเลเมื่อต้องตัดสินใจหลายเรื่องพร้อมกัน";
      intellectText = "คุณเป็นคนหัวไวและแก้ปัญหาเฉพาะหน้าตามสถานการณ์ได้ดี เพียงแต่บางช่วงถ้าต้องคิดหลายเรื่องพร้อมกันอาจเกิดความลังเล แนะนำให้เขียนเรียงลำดับสิ่งที่สำคัญที่สุดก่อนลงมือทำแล้วงานจะเดินหน้าไวมาก";
    } else if (hdT.slope === "curved_moon") {
      headGrade = "ไอเดียดี เข้าใจคนเก่ง";
      headShort = "เด่นด้านความคิดสร้างสรรค์ มองภาพรวมขาด และจับอารมณ์หรือความต้องการของคนอื่นได้ดี";
      intellectText = "มีจินตนาการและไอเดียสดใหม่อยู่เสมอ อ่านสถานการณ์และเข้าใจความรู้สึกคนรอบตัวเก่ง จึงเหมาะกับงานที่ได้วางแผน คิดคอนเทนต์ งานบริการ หรือการสื่อสารกับลูกค้า ยิ่งลงมือทำตามแผนให้จบทีละชิ้นผลลัพธ์ยิ่งปัง";
    } else if ((headL.lengthPercentage || 0) >= 62 || saturnM.fullness === "full") {
      headGrade = "วางแผนแม่น ตัดสินใจชัด";
      headShort = "คิดเป็นขั้นเป็นตอน มองความเป็นจริงชัด และรับผิดชอบเรื่องยากๆ ได้น่าเชื่อถือ";
      intellectText = "วิธีคิดค่อนข้างเป็นระบบ มองเหตุและผลชัดเจนก่อนตัดสินใจ ไม่ค่อยหวั่นไหวตามกระแสง่ายๆ จึงเหมาะกับงานบริหาร งานวิเคราะห์ งานตัวเลข หรือการดูแลโครงการสำคัญที่จะเติบโตได้ด้วยความน่าเชื่อถือ";
    } else {
      headShort = "มองโลกตามความจริง รอบคอบและเรียนรู้ไวจากประสบการณ์ที่เจอ";
      intellectText = "เป็นคนคิดรอบคอบและปฏิบัติจริงจัง ไม่ชอบพูดลอยๆ เวลาทำงานจะเก็บรายละเอียดได้ดีและค่อยๆ พัฒนาฝีมือขึ้นเรื่อยๆ หากมั่นใจในการตัดสินใจของตัวเองเพิ่มอีกนิดจะก้าวหน้าเร็วขึ้นมาก";
    }

    // 3. ความรักและความสัมพันธ์
    const heart = (lines && lines.heart) || {};
    const hT = heart.traits || {};
    let heartShort = "";
    let loveText = "";
    let loveGrade = "รักมั่นคง เข้าใจกันดี";
    if (!heart.detected) {
      loveGrade = "อ่อนโยน แสดงออกด้วยกระทำ";
      heartShort = "ใส่ใจความรู้สึกเก่งแต่มักเก็บไว้ในใจ เลือกดูแลคนรักผ่านการกระทำมากกว่าคำพูด";
      loveText = "คุณเป็นคนจิตใจดีและแคร์ความรู้สึกคนใกล้ตัว แต่ไม่ค่อยถนัดบอกรักเป็นคำพูดหวานๆ มักแสดงออกด้วยการช่วยดูแลในเรื่องชีวิตประจำวัน ถ้าลองเอ่ยชมหรือสื่อสารความรู้สึกตรงๆ บ้าง ความสัมพันธ์จะอบอุ่นขึ้นอีกมาก";
    } else if (hT.endTarget === "jupiter" || jupiterM.fullness === "full") {
      loveGrade = "รักจริง จริงใจสูง";
      heartShort = "รักจริงจัง ซื่อสัตย์ และคาดหวังความชัดเจนจากคนที่คบด้วยเต็มร้อย";
      loveText = "เวลาคบใครคุณให้ความสำคัญและความจริงใจสูงมาก เป็นคนทุ่มเทและอยากสร้างความสัมพันธ์ที่ชัดเจนมั่นคง ข้อแนะนำคือเปิดโอกาสให้ต่างฝ่ายต่างค่อยๆ ปรับตัว อย่ากดดันตัวเองหรืออีกฝ่ายด้วยมาตรฐานที่สูงเกินไป";
    } else if (hT.endTarget === "between") {
      loveGrade = "รักสมดุล มีเหตุผล";
      heartShort = "รักอย่างมีเหตุผล รู้จักให้พื้นที่กันและพูดคุยปรับความเข้าใจได้ง่าย";
      loveText = "คุณบาลานซ์ระหว่างความรู้สึกรักกับเหตุผลได้ดี เวลาคบใครจึงเข้าใจกันง่าย ไม่งอนหรือเอาแต่ใจเกินเหตุ เป็นทั้งคนรักและเพื่อนคู่คิดที่ดี ยิ่งหมั่นคุยกันเปิดอกอย่างสม่ำเสมอดวงความรักจะราบรื่นยาวนาน";
    } else {
      heartShort = "ความรู้สึกมั่นคง ไม่เปลี่ยนใจง่าย รักใครแล้วดูแลช่วยเหลือกันเงียบๆ";
      loveText = "ความรักของคุณค่อยเป็นค่อยไปแต่มั่นคงมาก ไม่ชอบความหวือหวาชั่วคราว เมื่อตัดสินใจเลือกใครแล้วจะดูแลรับผิดชอบอย่างดี แค่เติมเวลาพูดคุยหยอกล้อและแบ่งปันเรื่องราวกันมากขึ้นก็จะยิ่งสนิทใจกันกว่าเดิม";
    }

    // 4. การเงินและโอกาส
    const fate = (lines && lines.fate) || {};
    const sun = (lines && lines.sun) || {};
    const fateOrigin = fate.traits && fate.traits.origin;
    let wealthShort = "";
    let wealthText = "";
    let wealthGrade = "หาเงินคล่อง เปิดโอกาสใหม่";
    if (fate.detected && sun.detected) {
      wealthGrade = "การเงินเด่น มีคนสนับสนุน";
      wealthShort = "จังหวะงานและการเงินเดินคู่กัน ผลงานโดดเด่นและมีโอกาสได้คนคอยเกื้อหนุน";
      wealthText = "มีเกณฑ์สร้างรายได้และความก้าวหน้าจากฝีมือตัวเองอย่างชัดเจน สิ่งที่ตั้งใจทำมีโอกาสเข้าตาหัวหน้า ลูกค้า หรือผู้ใหญ่ให้การสนับสนุน ถ้าวางแผนเก็บออมควบคู่ไปกับลงทุนพัฒนาทักษะ ฐานะจะขยับมั่นคงเร็วมาก";
    } else if (fate.detected) {
      wealthGrade = "สร้างฐานะมั่นคงด้วยตนเอง";
      wealthShort = fateOrigin === "moon"
        ? "รายได้ดีมักมาจากงานติดต่อสื่อสาร ผู้คนบอกต่อ หรือโอกาสต่างถิ่น"
        : "ฐานะการเงินค่อยๆ เติบโตจากความขยันและความสม่ำเสมอของตัวเอง";
      wealthText = fateOrigin === "moon"
        ? "ดวงการเงินเปิดรับโอกาสจากผู้คน การเจรจา หรือการเดินทางทำงาน ยิ่งขยันสร้างคอนเนกชันและรักษามาตรฐานงาน รายรับจะเข้ามาหลายทางและต่อยอดได้ดี"
        : "เป็นคนพึ่งพาตัวเองได้และสร้างฐานะขึ้นด้วยสองมือ ยิ่งโฟกัสงานหลักให้ต่อเนื่องและจัดสรรเงินเก็บให้เป็นระบบ รายรับและเงินสำรองจะมั่นคงขึ้นตามลำดับเวลา";
    } else if (sun.detected || sunM.fullness === "full") {
      wealthGrade = "เครดิตดี เงินเข้าเพราะความน่าเชื่อถือ";
      wealthShort = "มีเสน่ห์และความน่าเชื่อถือ ดึงดูดโอกาสและลูกค้าใหม่ๆ เข้ามาได้เรื่อยๆ";
      wealthText = "ความน่าเชื่อถือและสไตล์การทำงานเฉพาะตัวเป็นจุดขายที่ช่วยสร้างรายได้ให้คุณ เวลาลงมือทำอะไรมักมีคนเชื่อมั่นและช่วยแนะนำต่อ ทำให้เกิดช่องทางทำเงินหรือโอกาสใหม่ๆ อยู่เสมอ";
    } else {
      wealthShort = "ดวงการเงินยืดหยุ่น สร้างรายได้เสริมและขยับขยายได้หลายแนวทางตามจังหวะ";
      wealthText = "เส้นทางการเงินของคุณไม่ได้ถูกจำกัดแค่ทางเดียว สามารถพลิกแพลงหาช่องทางสร้างรายได้เสริมหรืองานอิสระได้ดี ช่วงนี้หากลองจับงานถนัดมาต่อยอดอย่างจริงจังและจดบันทึกรายรับรายจ่ายให้ชัด จะเห็นเงินเหลือเก็บชัดขึ้นมาก";
    }

    // 5. คำแนะนำเสริมสิริมงคล
    const mercury = (lines && lines.mercury) || {};
    const guidanceShort = mercury.detected
      ? "ไหวพริบและการพูดคุยชัดเจนคือจุดแข็ง ใช้สื่อสารดีๆ แล้วโอกาสจะเปิดไว"
      : "รักษาจังหวะชีวิตให้สมดุล พักผ่อนให้พอ และเดินหน้าตามแผนทีละขั้นอย่างสบายใจ";
    const guidanceText = mercury.detected
      ? "คุณมีจุดเด่นเรื่องการพูดคุยประสานงานและสังเกตสิ่งรอบตัวเก่ง ให้ใช้จุดนี้สื่อสารให้ชัดเจนและจริงใจ พร้อมแบ่งเวลาพักผ่อนดูแลสุขภาพให้ดี เสริมด้วยการช่วยเหลือผู้อื่นหรือทำบุญตามกำลัง ชีวิตจะยิ่งราบรื่นและมีโชคลาภเข้ามาง่ายขึ้น"
      : "แนวโน้มชีวิตดีขึ้นเมื่อจัดสมดุลระหว่างเรื่องงานกับเวลาพักผ่อน ไม่กดดันตัวเองให้รีบเกินไป ทำสิ่งที่ตั้งใจไว้ให้สม่ำเสมอ และทำบุญเสริมสติปัญญาหรือปล่อยวางเรื่องจุกจิกบ้าง จะช่วยให้ใจเบาและดึงดูดเรื่องดีๆ เข้ามาได้ตลอด";

    const confPct = (confidence && confidence.percentage) || 88;
    const summaryVerdict = `ผลสแกน${handMeta.name} (ความชัด ${confPct}%): ${lifeShort} ส่วนเรื่องงานและความคิด${headShort.replace(/^คิด/, "เป็นคนคิด")}`;

    return {
      handType: hand,
      handMeta,
      aspects: {
        life: {
          icon: "🌟",
          title: "สุขภาพ และพลังชีวิต",
          text: lifeText,
          shortNote: lifeShort,
          grade: lifeGrade
        },
        intellect: {
          icon: "🧠",
          title: "ความคิด การงาน และการตัดสินใจ",
          text: intellectText,
          shortNote: headShort,
          grade: headGrade
        },
        love: {
          icon: "💖",
          title: "ความรัก และความสัมพันธ์",
          text: loveText,
          shortNote: heartShort,
          grade: loveGrade
        },
        wealth: {
          icon: "💰",
          title: "การเงิน โอกาส และความมั่นคง",
          text: wealthText,
          shortNote: wealthShort,
          grade: wealthGrade
        },
        guidance: {
          icon: "🌿",
          title: "คำแนะนำที่ใช้ได้จริง",
          text: guidanceText,
          shortNote: guidanceShort,
          grade: "เคล็ดเสริมดวงประจำตัว"
        }
      },
      summaryVerdict
    };
  }
}

// UI Controller สำหรับโหมดสแกนลายมือ (PalmApp)
class PalmApp {
  constructor() {
    this.cameraFacing = "environment";
    this.autoCaptureEnabled = true;
    this.cameraStatus = "idle";
    this.isCapturing = false;
    this._liveTimer = null;
    this._liveBusy = false;
    this._liveCanvas = null;
    this.detectState = "searching";
    this.steadySince = 0;
    this.prevPalmAnchor = null;
    this.missFrames = 0;
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

    // 2-Hand Dual Scan & Entitlement State
    this.dualScans = { left: null, right: null };
    this.capturedImages = { left: null, right: null };
    this.hudThumbs = { left: "", right: "" };
    this.hudFullUrls = { left: "", right: "" };
    this.dualReading = null;
    this.scanStep = 1;
    this.activeHudHand = "right";
    this.isEntitlementLocked = false;
    this.pendingDuplicateScan = null;
    this.savedLockedData = null;

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
    this.guideHintBox = document.getElementById("palm-guide-hint");
    this.guideTextEl = document.getElementById("palm-guide-text");
    this.steadyProgressBar = document.getElementById("palm-steady-progress-bar");
    this.captureFlashEl = document.getElementById("palm-capture-flash");
    this.cameraFallbackEl = document.getElementById("palm-camera-fallback");
    this.cameraFallbackMsgEl = document.getElementById("palm-camera-fallback-msg");
    this.btnRetryCamera = document.getElementById("btn-palm-retry-camera");
    this.btnFallbackUpload = document.getElementById("btn-palm-fallback-upload");
    this.btnToggleAutoCapture = document.getElementById("btn-palm-toggle-autocapture");
    this.autoCaptureLabel = document.getElementById("palm-autocapture-label");
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

    // Dual-Hand Guided Flow & Entitlement Elements
    this.dualStepBanner = document.getElementById("palm-dual-step-banner");
    this.dualStepPill = document.getElementById("palm-dual-step-pill");
    this.dualStepDesc = document.getElementById("palm-dual-step-desc");
    this.hand1DoneCard = document.getElementById("palm-hand1-done-card");
    this.hand1ThumbImg = document.getElementById("palm-hand1-thumb");
    this.hand1BadgeEl = document.getElementById("palm-hand1-badge");
    this.hand1TitleEl = document.getElementById("palm-hand1-title");
    this.hand1DescEl = document.getElementById("palm-hand1-desc");
    this.btnScanSecondHand = document.getElementById("btn-palm-scan-second-hand");
    this.btnScanSecondLabel = document.getElementById("btn-palm-scan-second-label");
    this.btnOverrideHand = document.getElementById("btn-palm-override-hand");
    this.btnOverrideLabel = document.getElementById("btn-palm-override-label");
    this.btnRestartBoth = document.getElementById("btn-palm-restart-both");
    this.hudHandTabs = document.getElementById("palm-hud-hand-tabs");
    this.btnHudViewLeft = document.getElementById("btn-hud-view-left");
    this.btnHudViewRight = document.getElementById("btn-hud-view-right");
    this.entitlementBadge = document.getElementById("palm-entitlement-badge");

    // Result & Inspection Elements
    this.resultCanvas = document.getElementById("palm-result-canvas");
    this.resultCanvasWrap = document.getElementById("palm-result-canvas-wrap");
    this.confidenceBadge = document.getElementById("palm-confidence-badge");
    this.confidenceValue = document.getElementById("palm-confidence-val");
    this.handInfoPill = document.getElementById("palm-hand-info-pill");
    this.layerFilterChips = document.querySelectorAll("[data-palm-layer]");
    this.btnToggleSkeleton = document.getElementById("btn-palm-toggle-skeleton");
    this.btnToggleRidge = document.getElementById("btn-palm-toggle-ridge");

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
    if (this.btnRetryCamera) {
      this.btnRetryCamera.addEventListener("click", () => this.startCamera(this.cameraFacing || "environment"));
    }
    if (this.btnFallbackUpload && this.fileInput) {
      this.btnFallbackUpload.addEventListener("click", () => this.fileInput.click());
    }
    if (this.btnToggleAutoCapture) {
      this.btnToggleAutoCapture.addEventListener("click", () => this.toggleAutoCapture());
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

    // Dual-Hand Flow Actions
    if (this.btnScanSecondHand) {
      this.btnScanSecondHand.addEventListener("click", () => this.resumeCameraForSecondHand());
    }
    if (this.btnOverrideHand) {
      this.btnOverrideHand.addEventListener("click", () => this.confirmDuplicateAsMissingHand());
    }
    if (this.btnRestartBoth) {
      this.btnRestartBoth.addEventListener("click", () => this.startNewPalmSession());
    }
    if (this.btnHudViewLeft) {
      this.btnHudViewLeft.addEventListener("click", () => this.switchHudResultHand("left"));
    }
    if (this.btnHudViewRight) {
      this.btnHudViewRight.addEventListener("click", () => this.switchHudResultHand("right"));
    }

    // Retake (disabled/hidden when entitlement locked)
    if (this.btnRetake) {
      this.btnRetake.addEventListener("click", () => {
        if (!this.isEntitlementLocked) this.resetToCaptureScreen();
      });
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

  playSound(methodName, ...args) {
    try {
      const audio = window.mysticAudio;
      if (audio && typeof audio[methodName] === "function") {
        audio[methodName](...args);
      }
    } catch (_) {}
  }

  flashShutter() {
    if (!this.captureFlashEl) return;
    this.captureFlashEl.classList.add("flashing");
    setTimeout(() => {
      if (this.captureFlashEl) this.captureFlashEl.classList.remove("flashing");
    }, 180);
  }

  toggleAutoCapture() {
    this.autoCaptureEnabled = !this.autoCaptureEnabled;
    if (this.btnToggleAutoCapture) {
      this.btnToggleAutoCapture.classList.toggle("active", this.autoCaptureEnabled);
    }
    if (this.autoCaptureLabel) {
      this.autoCaptureLabel.textContent = this.autoCaptureEnabled ? "อัตโนมัติ: เปิด" : "อัตโนมัติ: ปิด";
    }
    this.steadySince = 0;
    this.playSound("playClick");
    if (window.taroApp && typeof window.taroApp.showToast === "function") {
      window.taroApp.showToast(
        this.autoCaptureEnabled
          ? "⚡ เปิดถ่ายภาพอัตโนมัติเมื่อวางฝ่ามือตรงกรอบแล้ว"
          : "📸 ปิดถ่ายอัตโนมัติแล้ว (กดปุ่มถ่ายภาพด้วยตนเอง)"
      );
    }
  }

  setDetectUI(state, message, progressPct = 0) {
    this.detectState = state || "searching";
    if (this.cameraContainer) this.cameraContainer.setAttribute("data-detect-state", this.detectState);
    if (this.cameraReticle) this.cameraReticle.setAttribute("data-detect-state", this.detectState);
    if (this.guideHintBox) this.guideHintBox.setAttribute("data-detect-state", this.detectState);
    if (this.guideTextEl && message) this.guideTextEl.textContent = message;
    if (this.steadyProgressBar) {
      this.steadyProgressBar.style.width = `${Math.max(0, Math.min(100, progressPct))}%`;
    }
  }

  setHand(hand) {
    this.currentHand = hand;
    if (this.btnHandToggleLeft) this.btnHandToggleLeft.classList.toggle("active", hand === "left");
    if (this.btnHandToggleRight) this.btnHandToggleRight.classList.toggle("active", hand === "right");
    if (this.cameraReticle) {
      this.cameraReticle.setAttribute("data-hand", hand);
    }
    this.steadySince = 0;
    this.prevPalmAnchor = null;
    const handLabel = hand === "left" ? "ซ้าย" : "ขวา";
    this.setDetectUI("searching", `วางฝ่ามือ${handLabel}ให้ตรงรูปมือ กางนิ้วเล็กน้อย`, 0);
    this.playSound("playClick");
  }

  async startCamera(facingMode) {
    const targetFacing = facingMode || this.cameraFacing || "environment";
    this.cameraFacing = targetFacing;

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      this.cameraStatus = "error";
      this._showCameraFallback("เบราว์เซอร์นี้ไม่รองรับการเปิดกล้องโดยตรง (หรือไม่ได้เปิดผ่าน HTTPS) กรุณาเลือกรูปภาพจากเครื่อง");
      return false;
    }

    try {
      this.stopCamera();
      this.cameraStatus = "starting";
      this._hideCameraFallback();

      const constraints = {
        video: {
          facingMode: { ideal: targetFacing },
          width: { ideal: 1280 },
          height: { ideal: 960 }
        },
        audio: false
      };
      try {
        this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (_) {
        this.stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      }

      const track = this.stream && this.stream.getVideoTracks ? this.stream.getVideoTracks()[0] : null;
      const settings = track && track.getSettings ? track.getSettings() : {};
      const actualFacing = settings.facingMode || "";
      this._captureMirrored = actualFacing === "user" || (!actualFacing && targetFacing === "user");

      if (this.video) {
        this.video.classList.toggle("is-mirrored", !!this._captureMirrored);
        this.video.srcObject = this.stream;
        try {
          await this.video.play();
        } catch (playErr) {
          console.warn("Video play notice:", playErr);
        }
      }

      this.cameraStatus = "ready";
      const handLabel = this.currentHand === "left" ? "ซ้าย" : "ขวา";
      this.setDetectUI("searching", `วางฝ่ามือ${handLabel}ให้ตรงรูปมือ กางนิ้วเล็กน้อย`, 0);

      if (window.PalmMediaPipe && typeof window.PalmMediaPipe.warmup === "function") {
        Promise.resolve(window.PalmMediaPipe.warmup()).catch(() => {});
      }
      this.startLiveMonitor();
      return true;
    } catch (err) {
      console.warn("Camera access denied or unavailable:", err);
      this.cameraStatus = "error";
      const isDenied = err && (err.name === "NotAllowedError" || err.name === "PermissionDeniedError");
      this._showCameraFallback(
        isDenied
          ? "ไม่ได้รับอนุญาตให้ใช้กล้อง กรุณากดอนุญาตกล้องที่แถบเบราว์เซอร์ แล้วกด \"เปิดกล้องอีกครั้ง\""
          : "ไม่พบกล้องที่พร้อมใช้งาน หรือกล้องถูกใช้งานโดยแอปอื่นอยู่"
      );
      return false;
    }
  }

  _showCameraFallback(msg) {
    if (this.cameraFallbackMsgEl && msg) this.cameraFallbackMsgEl.textContent = msg;
    if (this.cameraFallbackEl) this.cameraFallbackEl.style.display = "flex";
    this.setDetectUI("searching", "ยังไม่ได้เปิดกล้อง — กดเปิดกล้องอีกครั้งหรือเลือกรูปภาพ", 0);
  }

  _hideCameraFallback() {
    if (this.cameraFallbackEl) this.cameraFallbackEl.style.display = "none";
  }

  stopCamera() {
    this.stopLiveMonitor();
    this.torchOn = false;
    if (this.btnToggleTorch) this.btnToggleTorch.classList.remove("active");
    if (this.stream) {
      this.stream.getTracks().forEach(t => t.stop());
      this.stream = null;
    }
    if (this.video) {
      this.video.srcObject = null;
    }
    this.cameraStatus = "idle";
  }

  startLiveMonitor() {
    this.stopLiveMonitor();
    if (!this.stream || !this.video) return;
    this.steadySince = 0;
    this.prevPalmAnchor = null;
    this.missFrames = 0;
    this._scheduleNextLiveCheck(250);
  }

  stopLiveMonitor() {
    if (this._liveTimer) {
      clearTimeout(this._liveTimer);
      this._liveTimer = null;
    }
    this._liveBusy = false;
    this.steadySince = 0;
    this.prevPalmAnchor = null;
    this.missFrames = 0;
  }

  _scheduleNextLiveCheck(delayMs = 180) {
    if (this._liveTimer) clearTimeout(this._liveTimer);
    this._liveTimer = setTimeout(() => this._runLiveCheck(), delayMs);
  }

  async _runLiveCheck() {
    this._liveTimer = null;
    const captureVisible = this.container && this.container.style.display !== "none"
      && this.screenCapture && this.screenCapture.classList.contains("active");
    if (!captureVisible || !this.stream || this.isScanning || this.isCapturing) {
      return;
    }
    if (!this.video || this.video.readyState < 2 || !this.video.videoWidth || !this.video.videoHeight) {
      this._scheduleNextLiveCheck(220);
      return;
    }
    if (this._liveBusy) {
      this._scheduleNextLiveCheck(180);
      return;
    }

    this._liveBusy = true;
    try {
      await this.evaluateLiveFrame();
    } catch (_) {
      // keep camera preview smooth even if a single analysis tick fails
    } finally {
      this._liveBusy = false;
      const stillVisible = this.container && this.container.style.display !== "none"
        && this.screenCapture && this.screenCapture.classList.contains("active");
      if (stillVisible && this.stream && !this.isScanning && !this.isCapturing) {
        this._scheduleNextLiveCheck(170);
      }
    }
  }

  async evaluateLiveFrame() {
    const vw = this.video.videoWidth;
    const vh = this.video.videoHeight;
    const maxSide = 224;
    const scale = Math.min(1, maxSide / Math.max(vw, vh));
    const lw = Math.max(64, Math.round(vw * scale));
    const lh = Math.max(64, Math.round(vh * scale));

    if (!this._liveCanvas) this._liveCanvas = document.createElement("canvas");
    if (this._liveCanvas.width !== lw) this._liveCanvas.width = lw;
    if (this._liveCanvas.height !== lh) this._liveCanvas.height = lh;

    const lctx = this._liveCanvas.getContext("2d", { willReadFrequently: true });
    lctx.save();
    if (this._captureMirrored) {
      lctx.translate(lw, 0);
      lctx.scale(-1, 1);
    }
    lctx.drawImage(this.video, 0, 0, lw, lh);
    lctx.restore();

    let verdict = null;
    if (window.PalmMediaPipe && typeof window.PalmMediaPipe.isReady === "function" && window.PalmMediaPipe.isReady()) {
      const mp = await window.PalmMediaPipe.detectFromCanvas(this._liveCanvas, lw, lh, 320);
      if (mp && Array.isArray(mp.landmarks) && mp.landmarks.length >= 21) {
        verdict = this._assessMediaPipeHand(mp.landmarks, lw, lh);
      }
    }

    if (!verdict && window.PalmVision && typeof window.PalmVision.skinMask === "function") {
      const imgData = lctx.getImageData(0, 0, lw, lh);
      verdict = this._assessSkinHand(imgData.data, lw, lh);
    }

    const handLabel = this.currentHand === "left" ? "ซ้าย" : "ขวา";
    if (!verdict || verdict.state === "searching") {
      this.missFrames++;
      if (this.missFrames > 2) {
        this.steadySince = 0;
        this.prevPalmAnchor = null;
        this.setDetectUI("searching", `วางฝ่ามือ${handLabel}ให้ตรงรูปมือ กางนิ้วเล็กน้อย`, 0);
      }
      return;
    }

    if (verdict.state === "adjusting") {
      this.missFrames++;
      if (this.missFrames > 2) {
        this.steadySince = 0;
        this.prevPalmAnchor = verdict.anchor || null;
        this.setDetectUI("adjusting", verdict.hint, 0);
      }
      return;
    }

    // Aligned hand detected! Verify stability before auto-capture
    this.missFrames = 0;
    const now = performance.now();
    const anchor = verdict.anchor;
    let moved = false;
    if (this.prevPalmAnchor && anchor) {
      const delta = Math.hypot(anchor.cx - this.prevPalmAnchor.cx, anchor.cy - this.prevPalmAnchor.cy)
        + Math.abs((anchor.size || 0) - (this.prevPalmAnchor.size || 0));
      if (delta > 0.045) moved = true;
    }
    this.prevPalmAnchor = anchor;

    if (moved || !this.steadySince) {
      this.steadySince = now;
    }

    const HOLD_MS = 1200;
    const elapsed = now - this.steadySince;
    const pct = Math.min(100, Math.round((elapsed / HOLD_MS) * 100));

    if (!this.autoCaptureEnabled) {
      this.setDetectUI("steady", "✅ ตรวจพบฝ่ามือตรงกรอบแล้ว! กดปุ่มถ่ายภาพได้เลย", 100);
      return;
    }

    if (elapsed < HOLD_MS) {
      const secLeft = Math.max(0.1, (HOLD_MS - elapsed) / 1000).toFixed(1);
      this.setDetectUI(
        "steady",
        `✅ ตรวจพบฝ่ามือตรงกรอบ! ทำมือนิ่งค้างไว้ (${secLeft} วิ)...`,
        pct
      );
      return;
    }

    // Steady hold completed -> auto-capture!
    this.setDetectUI("steady", "📸 กำลังบันทึกภาพฝ่ามืออัตโนมัติ!", 100);
    this.playSound("playCrystalBell", 880, 0.35);
    await this.captureCameraFrame();
  }

  _assessMediaPipeHand(landmarks, w, h) {
    let minX = 1, maxX = 0, minY = 1, maxY = 0;
    for (let i = 0; i < 21; i++) {
      const nx = landmarks[i].x / w;
      const ny = landmarks[i].y / h;
      if (nx < minX) minX = nx;
      if (nx > maxX) maxX = nx;
      if (ny < minY) minY = ny;
      if (ny > maxY) maxY = ny;
    }
    const handW = maxX - minX;
    const handH = maxY - minY;
    const palmIds = [0, 5, 9, 13, 17];
    let pcx = 0, pcy = 0;
    for (const id of palmIds) {
      pcx += landmarks[id].x / w;
      pcy += landmarks[id].y / h;
    }
    pcx /= palmIds.length;
    pcy /= palmIds.length;

    const wrist = { x: landmarks[0].x / w, y: landmarks[0].y / h };
    const midMcp = { x: landmarks[9].x / w, y: landmarks[9].y / h };
    const anchor = { cx: pcx, cy: pcy, size: handH };

    // Orientation check (upright hand, wrist below knuckles)
    if (wrist.y < midMcp.y + 0.06) {
      return { state: "adjusting", hint: "🔄 ตั้งฝ่ามือตรง ให้ปลายนิ้วชี้ขึ้นด้านบน", anchor };
    }
    // Crop margin check
    if (minX < 0.025 || maxX > 0.975 || minY < 0.02 || maxY > 0.985) {
      return { state: "adjusting", hint: "🖐️ ถอยออกเล็กน้อย ให้เห็นฝ่ามือและปลายนิ้วครบในกรอบ", anchor };
    }
    // Scale check
    if (handH < 0.36 || handW < 0.20) {
      return { state: "adjusting", hint: "🔍 ขยับฝ่ามือเข้าใกล้กล้องอีกนิด", anchor };
    }
    if (handH > 0.92) {
      return { state: "adjusting", hint: "🔍 ขยับฝ่ามือออกห่างกล้องเล็กน้อย", anchor };
    }
    // Center check
    if (pcx < 0.27 || pcx > 0.73 || pcy < 0.28 || pcy > 0.78) {
      return { state: "adjusting", hint: "↔️ เลื่อนฝ่ามือมาวางไว้ตรงกลางรูปมือ", anchor };
    }
    // Open palm check (at least 3 of 4 fingers extended farther from wrist than MCP)
    const pairs = [[8, 5], [12, 9], [16, 13], [20, 17]];
    let extended = 0;
    for (const [tipId, mcpId] of pairs) {
      const tipDist = Math.hypot(landmarks[tipId].x / w - wrist.x, landmarks[tipId].y / h - wrist.y);
      const mcpDist = Math.hypot(landmarks[mcpId].x / w - wrist.x, landmarks[mcpId].y / h - wrist.y);
      if (tipDist > mcpDist * 1.25) extended++;
    }
    if (extended < 3) {
      return { state: "adjusting", hint: "✋ แบฝ่ามือและกางนิ้วออกเล็กน้อย", anchor };
    }
    return { state: "steady", anchor };
  }

  _assessSkinHand(rgba, w, h) {
    const sm = window.PalmVision.skinMask(rgba, w, h);
    const total = w * h;
    const areaRatio = sm.area / total;
    if (areaRatio < 0.06) return { state: "searching" };
    if (areaRatio > 0.64) {
      return { state: "adjusting", hint: "🔍 ขยับฝ่ามือออกห่างกล้องเล็กน้อย" };
    }

    let minX = w, maxX = -1, minY = h, maxY = -1;
    let sumX = 0, sumY = 0;
    let centerHits = 0, centerTotal = 0;
    let topEdgeHits = 0;
    const cxMin = Math.floor(w * 0.22), cxMax = Math.ceil(w * 0.78);
    const cyMin = Math.floor(h * 0.14), cyMax = Math.ceil(h * 0.88);
    const topBandY = Math.max(4, Math.floor(h * 0.05));

    for (let y = 0; y < h; y++) {
      const row = y * w;
      const inCy = y >= cyMin && y <= cyMax;
      for (let x = 0; x < w; x++) {
        const inBox = inCy && x >= cxMin && x <= cxMax;
        if (inBox) centerTotal++;
        if (!sm.mask[row + x]) continue;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
        sumX += x;
        sumY += y;
        if (inBox) centerHits++;
        if (y < topBandY) topEdgeHits++;
      }
    }

    const nMinX = minX / w, nMaxX = maxX / w;
    const nMinY = minY / h;
    const boxW = (maxX - minX) / w;
    const boxH = (maxY - minY) / h;
    const cx = (sumX / sm.area) / w;
    const cy = (sumY / sm.area) / h;
    const anchor = { cx, cy, size: boxH };

    if (topEdgeHits > w * topBandY * 0.45 || nMinY < 0.02 || nMinX < 0.02 || nMaxX > 0.98) {
      return { state: "adjusting", hint: "🖐️ ขยับมือเข้ามาด้านในกรอบ ให้พ้นขอบภาพ", anchor };
    }
    if (boxH < 0.36 || boxW < 0.18) {
      return { state: "adjusting", hint: "🔍 ขยับฝ่ามือเข้าใกล้กล้องอีกนิด", anchor };
    }
    if (cx < 0.28 || cx > 0.72 || cy < 0.28 || cy > 0.76) {
      return { state: "adjusting", hint: "↔️ เลื่อนฝ่ามือมาวางไว้ตรงกลางรูปมือ", anchor };
    }
    const aspect = boxW / Math.max(0.01, boxH);
    const fillInCenter = centerHits / Math.max(1, sm.area);
    if (aspect < 0.32 || aspect > 1.05 || fillInCenter < 0.65) {
      return { state: "adjusting", hint: "✋ ตั้งฝ่ามือตรงให้พอดีกับกรอบรูปมือ", anchor };
    }
    return { state: "steady", anchor };
  }

  async switchCameraFacing() {
    this.cameraFacing = this.cameraFacing === "user" ? "environment" : "user";
    this.playSound("playClick");
    await this.startCamera(this.cameraFacing);
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

  async captureCameraFrame() {
    if (this.isScanning || this.isCapturing) return;
    if (!this.video || this.video.readyState < 2 || !this.video.videoWidth || !this.video.videoHeight) {
      // Camera not active yet — try waking/starting camera instead of dead click
      this.setDetectUI("searching", "กำลังเชื่อมต่อกล้อง กรุณาอนุญาตการเข้าถึงกล้อง...", 0);
      await this.startCamera(this.cameraFacing || "environment");
      if (!this.video || !this.video.videoWidth) {
        if (window.taroApp && typeof window.taroApp.showToast === "function") {
          window.taroApp.showToast("ยังไม่พบสัญญาณกล้อง กรุณาอนุญาตกล้องหรือกดเลือกรูปภาพจากเครื่อง");
        }
      }
      return;
    }
    this.isCapturing = true;
    this.stopLiveMonitor();
    this.flashShutter();
    this.playSound("playCardFlip");
    const maxSide = 1440;
    const vw = this.video.videoWidth;
    const vh = this.video.videoHeight;
    const scale = Math.min(1, maxSide / Math.max(vw, vh));
    const c = document.createElement("canvas");
    c.width = Math.max(1, Math.round(vw * scale));
    c.height = Math.max(1, Math.round(vh * scale));
    const ctx = c.getContext("2d");
    if (this.cameraFacing === "user") {
      ctx.translate(c.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(this.video, 0, 0, c.width, c.height);

    const dataUrl = c.toDataURL("image/jpeg", 0.95);
    if (!dataUrl || dataUrl === "data:,") {
      this.isCapturing = false;
      return;
    }
    const img = new Image();
    img.onload = () => {
      this.isCapturing = false;
      this.capturedImage = img;
      this.startScanningProcess(img);
    };
    img.onerror = () => {
      this.isCapturing = false;
      if (window.taroApp && typeof window.taroApp.showToast === "function") {
        window.taroApp.showToast("เกิดข้อผิดพลาดในการจับภาพ กรุณาลองอีกครั้ง");
      }
      this.startLiveMonitor();
    };
    img.src = dataUrl;
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
    this._nextScanForcedHand = this.currentHand;
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

    // ประมวลผลด้วย Engine จริง (ปรับพารามิเตอร์อัตโนมัติ)
    const forceHand = this._nextScanForcedHand || undefined;
    this._nextScanForcedHand = null;

    this.scanResult = await this.engine.scanPalmImage(imageSource, {
      hand: this.currentHand,
      forceHand,
      brightness: 0,
      contrast: 0,
      sensitivity: 3
    });

    if (!this.scanResult || this.scanResult.ok === false) {
      this.isScanning = false;
      const errMsg = (this.scanResult && this.scanResult.message) || "ไม่พบฝ่ามือชัดเจนในภาพ กรุณาวางฝ่ามือในที่แสงสว่างและกางนิ้วเล็กน้อย";
      if (window.taroApp && typeof window.taroApp.showToast === "function") {
        window.taroApp.showToast(errMsg);
      } else {
        alert(errMsg);
      }
      this.resumeCaptureOrStep2();
      return;
    }

    if (this.scanStepText) this.scanStepText.textContent = "ตรวจวัดความลึก ความยาว และเนินทั้ง 7 สำเร็จเรียบร้อย!";
    if (this.scanProgressBar) this.scanProgressBar.style.width = "100%";

    this.isScanning = false;
    await this.handleCompletedSingleScan(this.scanResult, imageSource);
  }

  startNewPalmSession(codeObj = null) {
    this.stopCamera();
    this.dualScans = { left: null, right: null };
    this.capturedImages = { left: null, right: null };
    this.hudThumbs = { left: "", right: "" };
    this.hudFullUrls = { left: "", right: "" };
    this.dualReading = null;
    this.scanResult = null;
    this.capturedImage = null;
    this.pendingDuplicateScan = null;
    this.savedLockedData = null;
    this._nextScanForcedHand = null;
    this.isCapturing = false;
    this.isScanning = false;
    this.scanStep = 1;
    this.activeHudHand = "right";

    const isCodeBound = Boolean((codeObj && codeObj.code) || (window.taroApp && window.taroApp.activeCode));
    const alreadyDone = Boolean(codeObj && (codeObj.palmDrawCount || 0) >= 1 && codeObj.palmResult);
    this.isEntitlementLocked = Boolean(isCodeBound && alreadyDone);

    if (this.screenResult) this.screenResult.classList.remove("active");
    if (this.screenScanning) this.screenScanning.classList.remove("active");
    if (this.screenCapture) this.screenCapture.classList.add("active");

    if (this.hand1DoneCard) {
      this.hand1DoneCard.style.display = "none";
      this.hand1DoneCard.classList.remove("warning-state");
    }
    if (this.btnOverrideHand) this.btnOverrideHand.style.display = "none";
    this._updateDualStepBanner(1, null);
    this.setHand("right");
    this.startCamera(this.cameraFacing || "environment");
  }

  restoreSavedPalmReading(savedPalm, options = {}) {
    if (!savedPalm) return;
    this.stopCamera();
    this.isCapturing = false;
    this.isScanning = false;
    this.pendingDuplicateScan = null;
    this.savedLockedData = savedPalm;
    this.isEntitlementLocked = options.locked !== false;

    const reading = savedPalm.reading || {
      hand: "both",
      handMeta: { name: "ฝ่ามือทั้ง 2 ข้าง (ซ้าย + ขวา)", role: "วิเคราะห์ครบพื้นดวงเดิมและปัจจุบัน-อนาคต" },
      avgConfidence: savedPalm.confidence || 92,
      summaryVerdict: savedPalm.summary || savedPalm.summaryVerdict || "วิเคราะห์ลายมือครบ 2 มือสำเร็จ",
      aspects: savedPalm.aspects || {}
    };

    this.dualReading = reading;
    this.hudThumbs = {
      left: savedPalm.leftHudThumbDataUrl || savedPalm.leftHudDataUrl || "",
      right: savedPalm.rightHudThumbDataUrl || savedPalm.rightHudDataUrl || ""
    };
    this.hudFullUrls = { ...this.hudThumbs };
    this.capturedImages = { left: null, right: null };
    this.dualScans = {
      left: {
        hand: "left",
        detectedHand: "left",
        confidence: {
          percentage: savedPalm.leftConfidence || reading.avgConfidence || 90,
          featuresDetected: 5,
          landmarkMethod: "mediapipe",
          label: "บันทึกผลการวิเคราะห์แล้ว"
        },
        lines: {},
        mounts: {},
        reading
      },
      right: {
        hand: "right",
        detectedHand: "right",
        confidence: {
          percentage: savedPalm.rightConfidence || reading.avgConfidence || 90,
          featuresDetected: 5,
          landmarkMethod: "mediapipe",
          label: "บันทึกผลการวิเคราะห์แล้ว"
        },
        lines: {},
        mounts: {},
        reading
      }
    };

    this.activeHudHand = this.hudThumbs.left ? "left" : "right";
    this.scanResult = this.dualScans[this.activeHudHand];
    this.capturedImage = null;
    this.showResultScreen();
  }

  _updateDualStepBanner(stepNum, scannedFirstHand) {
    if (!this.dualStepBanner) return;
    this.dualStepBanner.dataset.step = String(stepNum);
    this.dualStepBanner.classList.toggle("step-two", stepNum === 2);
    if (stepNum === 1) {
      if (this.dualStepPill) this.dualStepPill.textContent = "ขั้นตอนที่ 1 / 2 • สแกนฝ่ามือข้างแรก";
      if (this.dualStepDesc) {
        this.dualStepDesc.textContent = "วางฝ่ามือซ้ายหรือขวาก็ได้ ระบบจะวิเคราะห์ให้อัตโนมัติว่าเป็นมือข้างใด แล้วแจ้งให้สแกนอีกข้างต่อ";
      }
    } else {
      const doneThai = scannedFirstHand === "left" ? "มือซ้าย" : "มือขวา";
      const nextThai = scannedFirstHand === "left" ? "มือขวา" : "มือซ้าย";
      if (this.dualStepPill) this.dualStepPill.textContent = `ขั้นตอนที่ 2 / 2 • รอสแกน${nextThai}`;
      if (this.dualStepDesc) {
        this.dualStepDesc.textContent = `วิเคราะห์${doneThai}เรียบร้อยแล้ว กรุณาวาง "${nextThai}" ให้ตรงกรอบรูปมือเพื่อดูดวงครบทั้ง 2 มือ`;
      }
    }
  }

  resumeCaptureOrStep2() {
    if (this.screenScanning) this.screenScanning.classList.remove("active");
    if (this.screenResult) this.screenResult.classList.remove("active");
    if (this.screenCapture) this.screenCapture.classList.add("active");
    this.isCapturing = false;
    this.startCamera(this.cameraFacing || "environment");
  }

  resumeCameraForSecondHand() {
    this.isCapturing = false;
    const firstHand = this.dualScans.left ? "left" : (this.dualScans.right ? "right" : null);
    const nextHand = firstHand ? (firstHand === "left" ? "right" : "left") : this.currentHand;
    this.setHand(nextHand);
    this.startCamera(this.cameraFacing || "environment");
    if (this.cameraContainer && this.cameraContainer.scrollIntoView) {
      this.cameraContainer.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  async handleCompletedSingleScan(scanRes, imageSource) {
    const detected = (scanRes.detectedHand === "left" || scanRes.detectedHand === "right")
      ? scanRes.detectedHand
      : this.currentHand;

    const alreadyLeft = Boolean(this.dualScans.left);
    const alreadyRight = Boolean(this.dualScans.right);

    // กรณีสแกนข้างแรก (Step 1)
    if (!alreadyLeft && !alreadyRight) {
      if (scanRes.hand !== detected) {
        scanRes.hand = detected;
        scanRes.reading = this.engine.interpretPalmReading(scanRes.lines, scanRes.mounts, detected, scanRes.confidence);
      }
      this.dualScans[detected] = scanRes;
      this.capturedImages[detected] = imageSource;
      this.hudThumbs[detected] = this._renderOffscreenHud(scanRes, imageSource, 360, 0.72);
      this.hudFullUrls[detected] = this._renderOffscreenHud(scanRes, imageSource, 760, 0.85);
      this.scanStep = 2;

      const otherHand = detected === "left" ? "right" : "left";
      const detectedThai = detected === "left" ? "มือซ้าย" : "มือขวา";
      const otherThai = otherHand === "left" ? "มือซ้าย" : "มือขวา";
      const confPct = Math.round(Number((scanRes.confidence && scanRes.confidence.percentage) || 85));

      this.stopCamera();
      this.isCapturing = false;
      this.setHand(otherHand);
      this._updateDualStepBanner(2, detected);

      if (this.screenScanning) this.screenScanning.classList.remove("active");
      if (this.screenResult) this.screenResult.classList.remove("active");
      if (this.screenCapture) this.screenCapture.classList.add("active");

      if (this.hand1DoneCard) {
        this.hand1DoneCard.classList.remove("warning-state");
        this.hand1DoneCard.style.display = "block";
      }
      if (this.hand1ThumbImg) {
        this.hand1ThumbImg.src = this.hudThumbs[detected] || imageSource.src || "";
        this.hand1ThumbImg.style.display = "block";
      }
      if (this.hand1BadgeEl) this.hand1BadgeEl.textContent = `✅ วิเคราะห์${detectedThai}สำเร็จ! (ขั้นที่ 1 / 2)`;
      if (this.hand1TitleEl) this.hand1TitleEl.textContent = `กรุณานำ "${otherThai}" อีกข้างมาสแกนต่อ (ขั้นตอนที่ 2 / 2)`;
      if (this.hand1DescEl) {
        this.hand1DescEl.textContent = `ระบบตรวจจับ${detectedThai}เรียบร้อย (ความชัด ${confPct}%) เพื่อเปรียบเทียบพื้นดวงเดิมและปัจจุบันให้คำพยากรณ์ครบทุกด้าน`;
      }
      if (this.btnOverrideHand) this.btnOverrideHand.style.display = "none";
      if (this.btnScanSecondLabel) this.btnScanSecondLabel.textContent = `พร้อมแล้ว — เปิดกล้องสแกน${otherThai}`;

      if (window.mysticAudio) window.mysticAudio.playCrystalBell(880, 1.0);
      if (window.taroApp && typeof window.taroApp.showToast === "function") {
        window.taroApp.showToast(`วิเคราะห์${detectedThai}สำเร็จ! กรุณาสแกน${otherThai}ต่อเพื่อดูดวงครบ 2 มือ`);
      }
      if (this.hand1DoneCard && this.hand1DoneCard.scrollIntoView) {
        this.hand1DoneCard.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    // กรณี Step 2 (มีมือข้างหนึ่งอยู่แล้ว)
    const existingHand = alreadyLeft ? "left" : "right";
    const missingHand = existingHand === "left" ? "right" : "left";

    if (detected === existingHand) {
      // สแกนซ้ำข้างเดิม — เก็บผลชั่วคราวแล้วเตือนผู้ใช้พร้อมปุ่มยืนยันหรือถ่ายใหม่
      this.pendingDuplicateScan = { scan: scanRes, image: imageSource };
      const existingThai = existingHand === "left" ? "มือซ้าย" : "มือขวา";
      const missingThai = missingHand === "left" ? "มือซ้าย" : "มือขวา";

      this.stopCamera();
      this.isCapturing = false;
      this.setHand(missingHand);
      if (this.screenScanning) this.screenScanning.classList.remove("active");
      if (this.screenResult) this.screenResult.classList.remove("active");
      if (this.screenCapture) this.screenCapture.classList.add("active");

      if (this.hand1DoneCard) {
        this.hand1DoneCard.classList.add("warning-state");
        this.hand1DoneCard.style.display = "block";
      }
      if (this.hand1BadgeEl) this.hand1BadgeEl.textContent = `⚠️ ภาพที่สแกนล่าสุดตรวจพบเป็น ${existingThai} ซ้ำ`;
      if (this.hand1TitleEl) this.hand1TitleEl.textContent = `กรุณานำ "${missingThai}" อีกข้างมาสแกน (หรือกดยืนยันหากถ่ายถูกข้างแล้ว)`;
      if (this.hand1DescEl) {
        this.hand1DescEl.textContent = `ระบบต้องการข้อมูลทั้งมือซ้ายและมือขวา หากภาพเมื่อสักครู่คือ${missingThai}ของคุณจริง สามารถกดยืนยันใช้ภาพนี้ได้ทันที`;
      }
      if (this.btnOverrideHand) this.btnOverrideHand.style.display = "inline-flex";
      if (this.btnOverrideLabel) this.btnOverrideLabel.textContent = `✓ ยืนยันใช้ภาพนี้เป็น${missingThai}`;
      if (this.btnScanSecondLabel) this.btnScanSecondLabel.textContent = `📷 เปิดกล้องสแกน${missingThai}ใหม่`;
      if (window.taroApp && typeof window.taroApp.showToast === "function") {
        window.taroApp.showToast(`⚠️ ตรวจพบ${existingThai}ซ้ำ กรุณาสแกน${missingThai}หรือกดยืนยัน`);
      }
      return;
    }

    // สแกนครบทั้ง 2 มือ!
    if (scanRes.hand !== missingHand) {
      scanRes.hand = missingHand;
      scanRes.reading = this.engine.interpretPalmReading(scanRes.lines, scanRes.mounts, missingHand, scanRes.confidence);
    }
    this.pendingDuplicateScan = null;
    this.dualScans[missingHand] = scanRes;
    this.capturedImages[missingHand] = imageSource;
    await this.finalizeDualHandReading();
  }

  async confirmDuplicateAsMissingHand() {
    const existingHand = this.dualScans.left ? "left" : (this.dualScans.right ? "right" : null);
    if (!existingHand || !this.pendingDuplicateScan) return;
    const missingHand = existingHand === "left" ? "right" : "left";
    const { scan, image } = this.pendingDuplicateScan;
    this.pendingDuplicateScan = null;

    scan.hand = missingHand;
    scan.detectedHand = missingHand;
    scan.reading = this.engine.interpretPalmReading(scan.lines, scan.mounts, missingHand, scan.confidence);
    this.dualScans[missingHand] = scan;
    this.capturedImages[missingHand] = image;
    await this.finalizeDualHandReading();
  }

  async finalizeDualHandReading() {
    const leftScan = this.dualScans.left;
    const rightScan = this.dualScans.right;
    if (!leftScan || !rightScan) return;

    for (const side of ["left", "right"]) {
      if (!this.hudThumbs[side] && this.capturedImages[side]) {
        this.hudThumbs[side] = this._renderOffscreenHud(this.dualScans[side], this.capturedImages[side], 360, 0.72);
      }
      if (!this.hudFullUrls[side] && this.capturedImages[side]) {
        this.hudFullUrls[side] = this._renderOffscreenHud(this.dualScans[side], this.capturedImages[side], 760, 0.85);
      }
    }

    this.dualReading = this.engine.interpretDualHandReading(leftScan, rightScan);
    this.activeHudHand = "left";
    this.scanResult = leftScan;
    this.capturedImage = this.capturedImages.left;
    this.stopCamera();
    this.isCapturing = false;
    this.isScanning = false;

    if (this.hand1DoneCard) this.hand1DoneCard.style.display = "none";

    // บันทึกสิทธิ์ว่า "วิเคราะห์แล้ว" 1/1 เมื่อวิเคราะห์ครบทั้ง 2 มือ
    const summarizeHandLines = (scan) => {
      const out = {};
      for (const k of ["life", "head", "heart", "fate", "sun", "mercury"]) {
        const l = scan.lines && scan.lines[k];
        if (l) {
          out[k] = {
            detected: Boolean(l.detected),
            confidenceScore: l.metrics ? Number(l.metrics.confidenceScore || 0) : 0,
            specialTrait: l.metrics ? String(l.metrics.specialTrait || "") : ""
          };
        }
      }
      return out;
    };

    if (window.codeManager && window.taroApp && window.taroApp.activeCode && typeof window.codeManager.recordReadingDraw === "function") {
      try {
        await Promise.resolve(window.codeManager.recordReadingDraw(window.taroApp.activeCode, {
          mode: "palm",
          hand: "both",
          confidence: this.dualReading.avgConfidence,
          summary: this.dualReading.summaryVerdict,
          reading: {
            hand: "both",
            handMeta: this.dualReading.handMeta,
            avgConfidence: this.dualReading.avgConfidence,
            summaryVerdict: this.dualReading.summaryVerdict,
            aspects: this.dualReading.aspects
          },
          leftConfidence: leftScan.confidence ? leftScan.confidence.percentage : 0,
          rightConfidence: rightScan.confidence ? rightScan.confidence.percentage : 0,
          leftLinesSummary: summarizeHandLines(leftScan),
          rightLinesSummary: summarizeHandLines(rightScan),
          leftHudThumbDataUrl: this.hudThumbs.left || "",
          rightHudThumbDataUrl: this.hudThumbs.right || "",
          analyzedAt: new Date().toISOString()
        }));
        if (typeof window.taroApp.refreshActiveCodeState === "function") {
          window.taroApp.refreshActiveCodeState();
        }
      } catch (err) {
        console.warn("Palm draw record warning:", err);
      }
      this.isEntitlementLocked = true;
    }

    this.showResultScreen();
  }

  switchHudResultHand(handSide) {
    if (handSide !== "left" && handSide !== "right") return;
    if (!this.dualScans[handSide] && !this.hudThumbs[handSide]) return;
    this.activeHudHand = handSide;
    this.scanResult = this.dualScans[handSide] || this.scanResult;
    this.capturedImage = (this.capturedImages && this.capturedImages[handSide]) || null;
    if (this.btnHudViewLeft) this.btnHudViewLeft.classList.toggle("active", handSide === "left");
    if (this.btnHudViewRight) this.btnHudViewRight.classList.toggle("active", handSide === "right");
    this.renderResultHUD();
  }

  _renderOffscreenHud(scanRes, imgEl, maxSide = 360, jpegQuality = 0.72) {
    if (!scanRes || !imgEl) return "";
    try {
      const fullCanvas = document.createElement("canvas");
      this.renderHudOntoCanvas(fullCanvas, scanRes, imgEl, {
        activeLayer: "all",
        showSkeletonOverlay: false,
        showRidgeOverlay: false
      });
      const scale = Math.min(1, maxSide / Math.max(fullCanvas.width || 1, fullCanvas.height || 1));
      const outCanvas = document.createElement("canvas");
      outCanvas.width = Math.max(1, Math.round(fullCanvas.width * scale));
      outCanvas.height = Math.max(1, Math.round(fullCanvas.height * scale));
      const octx = outCanvas.getContext("2d");
      octx.drawImage(fullCanvas, 0, 0, outCanvas.width, outCanvas.height);
      return outCanvas.toDataURL("image/jpeg", jpegQuality);
    } catch (_) {
      return "";
    }
  }

  showResultScreen() {
    if (!this.scanResult && !this.dualReading) return;

    if (this.screenScanning) this.screenScanning.classList.remove("active");
    if (this.screenCapture) this.screenCapture.classList.remove("active");
    if (this.screenResult) this.screenResult.classList.add("active");

    const reading = this.dualReading || (this.scanResult && this.scanResult.reading) || {};
    const avgPct = this.dualReading
      ? this.dualReading.avgConfidence
      : (this.scanResult && this.scanResult.confidence ? this.scanResult.confidence.percentage : 0);

    if (this.confidenceBadge) {
      this.confidenceBadge.innerHTML = this.dualReading
        ? `🎯 วิเคราะห์ครบ 2 มือ (ความแม่นยำเฉลี่ย <strong id="palm-confidence-val">${avgPct}%</strong>)`
        : `🎯 ${(this.scanResult.confidence && this.scanResult.confidence.label) || "วิเคราะห์แล้ว"} (<strong id="palm-confidence-val">${avgPct}%</strong>)`;
      this.confidenceValue = document.getElementById("palm-confidence-val");
    }
    if (this.handInfoPill) {
      this.handInfoPill.textContent = this.dualReading
        ? "✋ มือซ้าย (พื้นดวงเดิม) + มือขวา (ปัจจุบัน-อนาคต)"
        : `✋ ${this.activeHudHand === "left" ? "มือซ้าย" : "มือขวา"}`;
    }
    if (this.hudHandTabs) {
      const hasBoth = Boolean(this.dualScans.left && this.dualScans.right);
      this.hudHandTabs.style.display = hasBoth ? "inline-flex" : "none";
      if (this.btnHudViewLeft) this.btnHudViewLeft.classList.toggle("active", this.activeHudHand === "left");
      if (this.btnHudViewRight) this.btnHudViewRight.classList.toggle("active", this.activeHudHand === "right");
    }
    if (this.entitlementBadge) {
      if (this.isEntitlementLocked) {
        this.entitlementBadge.style.display = "inline-flex";
        this.entitlementBadge.classList.add("locked");
        this.entitlementBadge.textContent = "🔒 วิเคราะห์ครบ 2 มือแล้ว (บันทึกสิทธิ์ 1/1)";
      } else {
        this.entitlementBadge.style.display = "none";
        this.entitlementBadge.classList.remove("locked");
      }
    }
    if (this.btnRetake) {
      this.btnRetake.style.display = this.isEntitlementLocked ? "none" : "inline-flex";
    }
    if (this.summaryVerdictText) {
      this.summaryVerdictText.textContent = reading.summaryVerdict || "";
    }

    // เรนเดอร์ Canvas ภาพลายมือพร้อมเส้นเวกเตอร์ HUD
    this.renderResultHUD();

    // แสดงคำทำนาย 5 ด้านเรียงทีละด้านอ่านง่ายในมือถือ
    this.renderReadingAspects();

    if (window.mysticAudio) {
      window.mysticAudio.playCrystalBell(1046.5, 1.6);
    }
  }

  renderResultHUD() {
    if (!this.resultCanvas) return;
    if (!this.capturedImage && this.hudThumbs && this.hudThumbs[this.activeHudHand]) {
      const thumbUrl = this.hudThumbs[this.activeHudHand];
      const img = new Image();
      img.onload = () => {
        this.resultCanvas.width = img.width || 480;
        this.resultCanvas.height = img.height || 640;
        const ctx = this.resultCanvas.getContext("2d");
        ctx.drawImage(img, 0, 0, this.resultCanvas.width, this.resultCanvas.height);
      };
      img.src = thumbUrl;
      return;
    }
    if (!this.scanResult || !this.capturedImage) return;
    this.renderHudOntoCanvas(this.resultCanvas, this.scanResult, this.capturedImage, {
      activeLayer: this.activeLayer,
      showSkeletonOverlay: this.showSkeletonOverlay,
      showRidgeOverlay: this.showRidgeOverlay
    });
  }

  renderHudOntoCanvas(canvas, res, capturedImage, opts = {}) {
    if (!res || !canvas || !capturedImage) return;
    const activeLayer = opts.activeLayer !== undefined ? opts.activeLayer : this.activeLayer;
    const showRidge = opts.showRidgeOverlay !== undefined ? opts.showRidgeOverlay : this.showRidgeOverlay;
    const showSkeleton = opts.showSkeletonOverlay !== undefined ? opts.showSkeletonOverlay : this.showSkeletonOverlay;

    canvas.width = res.width;
    canvas.height = res.height;
    const ctx = canvas.getContext("2d");

    // 1. วาดภาพจริงของฝ่ามือ
    ctx.drawImage(capturedImage, 0, 0, res.width, res.height);

    // 2. เคลือบฟิล์มบางเบาเพื่อให้รอยย่นผิวหนังยังมองเห็นเปรียบเทียบความตรงได้อย่างชัดเจน
    ctx.fillStyle = "rgba(4, 7, 20, 0.14)";
    ctx.fillRect(0, 0, res.width, res.height);

    // 2b. แผนที่ร่องลายมือจาก Hessian (ถอด/เปิดดูได้)
    if (showRidge && res.debug && res.debug.ridge) {
      this.drawRidgeOverlay(ctx, res.debug);
    }

    // 2c. กรอบฝ่ามือและจุดกระดูก 21 ข้อ (MediaPipe / Skin-CV)
    if (showSkeleton && res.anchors) {
      this.drawSkeletonOverlay(ctx, res.anchors);
    }

    // 3. วาดเส้นลายมือตาม Layer ที่เลือก
    const kb = window.PALM_KNOWLEDGE_BASE ? window.PALM_KNOWLEDGE_BASE.lines : {};
    const linesToDraw = activeLayer === "all"
      ? ["life", "head", "heart", "fate", "sun", "mercury"]
      : (activeLayer === "mounts" ? [] : [activeLayer]);
    const isFocusedCheck = (k) => activeLayer === k;
    const showAllLines = activeLayer === "all";
    const drawMounts = activeLayer === "mounts";
    const placedLabels = [];
    const pillH = Math.max(17, Math.round(res.width * 0.024));
    const fontSize = Math.max(10, Math.round(res.width * 0.0155));

    linesToDraw.forEach(lineKey => {
      const lineData = res.lines[lineKey];
      if (!lineData || !lineData.points || lineData.points.length < 2) return;
      if (showAllLines && !lineData.detected) return;

      const meta = kb[lineKey] || { color: "#38bdf8", name: lineKey };
      const pts = lineData.points;
      const isFocused = isFocusedCheck(lineKey);

      if (!lineData.detected) {
        ctx.save();
        ctx.strokeStyle = meta.color;
        ctx.lineWidth = 2.0;
        ctx.setLineDash([5, 5]);
        ctx.globalAlpha = 0.55;
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
        ctx.stroke();
        ctx.restore();
        return;
      }

      // เงาฟุ้งบางๆ รอบเส้นหลักโดยไม่บดบังร่องฝ่ามือจริง
      ctx.save();
      ctx.strokeStyle = meta.color;
      ctx.lineWidth = isFocused ? 5.2 : 3.8;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.shadowColor = meta.color;
      ctx.shadowBlur = 5;
      ctx.globalAlpha = 0.24;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.stroke();
      ctx.restore();

      // เส้นแกนเวกเตอร์คมชัดแนบกลางร่องลายมือ
      ctx.save();
      ctx.strokeStyle = meta.color;
      ctx.lineWidth = isFocused ? 2.4 : 1.85;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.stroke();

      // จุดมาร์คปลายเริ่มต้นและปลายสิ้นสุด (ไม่บังกลางจุดตัดเส้น)
      [pts[0], pts[pts.length - 1]].forEach(p => {
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = meta.color;
        ctx.lineWidth = 1.4;
        ctx.stroke();
      });

      // ป้ายชื่อแบบกะทัดรัดตรงปลายเส้นด้านนอก พร้อมหลีกเลี่ยงการซ้อนทับ
      const pStart = pts[0], pEnd = pts[pts.length - 1];
      let anchor = pEnd;
      let dx = 0, dy = -16;
      if (lineKey === "heart") {
        anchor = pStart.x < pEnd.x ? pStart : pEnd;
        dx = anchor.x < res.width * 0.5 ? -8 : 8;
        dy = -16;
      } else if (lineKey === "head") {
        anchor = pEnd;
        dx = pEnd.x < res.width * 0.5 ? -14 : 14;
        dy = 16;
      } else if (lineKey === "life") {
        anchor = pEnd;
        dx = 26;
        dy = 14;
      } else if (lineKey === "fate") {
        anchor = pStart.y > pEnd.y ? pStart : pEnd;
        dx = -28;
        dy = 15;
      } else {
        anchor = pEnd;
        dy = -16;
      }

      const confPct = Math.round(Number((lineData.metrics && lineData.metrics.confidenceScore) || 0));
      const labelText = `${meta.name} ${confPct}%`;
      ctx.font = `600 ${fontSize}px 'Prompt', sans-serif`;
      const textW = ctx.measureText(labelText).width;
      const boxW = textW + 10;
      let cx = Math.max(boxW / 2 + 6, Math.min(res.width - boxW / 2 - 6, anchor.x + dx));
      let cy = Math.max(pillH / 2 + 6, Math.min(res.height - pillH / 2 - 6, anchor.y + dy));

      for (let attempt = 0; attempt < 4; attempt++) {
        const overlaps = placedLabels.some(b =>
          Math.abs(cx - b.cx) < (boxW + b.w) * 0.5 + 4 &&
          Math.abs(cy - b.cy) < (pillH + b.h) * 0.5 + 3
        );
        if (!overlaps) break;
        cy = Math.max(pillH / 2 + 6, Math.min(res.height - pillH / 2 - 6, cy + (dy >= 0 ? 20 : -20)));
      }
      placedLabels.push({ cx, cy, w: boxW, h: pillH });

      // เส้นชี้บางเชื่อมปลายเส้นกับป้ายชื่อ
      ctx.strokeStyle = meta.color;
      ctx.globalAlpha = 0.65;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(anchor.x, anchor.y);
      ctx.lineTo(cx, cy);
      ctx.stroke();

      ctx.globalAlpha = 1;
      ctx.fillStyle = "rgba(9, 14, 30, 0.82)";
      ctx.strokeStyle = meta.color;
      ctx.lineWidth = 1.25;
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(cx - boxW / 2, cy - pillH / 2, boxW, pillH, 5);
      } else {
        ctx.rect(cx - boxW / 2, cy - pillH / 2, boxW, pillH);
      }
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#f8fafc";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(labelText, cx, cy + 0.5);
      ctx.restore();
    });

    // 4. วาดเนินทั้ง 7 เฉพาะเมื่อเลือกแท็บ "เนินทั้ง 7" เพื่อไม่ให้บังเส้นลายมือในหน้าหลัก
    if (drawMounts) {
      ctx.save();
      for (const [mKey, mData] of Object.entries(res.mounts)) {
        const rad = Math.min(mData.radius || 26, Math.max(18, Math.round(res.width * 0.044)));
        ctx.fillStyle = "rgba(243, 207, 122, 0.09)";
        ctx.strokeStyle = "rgba(243, 207, 122, 0.85)";
        ctx.lineWidth = 1.7;
        ctx.setLineDash([4, 3]);
        ctx.beginPath();
        ctx.arc(mData.center.x, mData.center.y, rad, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.setLineDash([]);

        // จุดกึ่งกลาง + ชื่อเนิน
        ctx.fillStyle = "#fde68a";
        ctx.beginPath();
        ctx.arc(mData.center.x, mData.center.y, 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = "bold 12px 'Cinzel', serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = "rgba(9, 14, 30, 0.88)";
        ctx.fillStyle = "#fde68a";
        ctx.strokeText(mData.symbol, mData.center.x, mData.center.y - 8);
        ctx.fillText(mData.symbol, mData.center.x, mData.center.y - 8);

        ctx.font = "600 10px 'Prompt', sans-serif";
        ctx.strokeText(mData.name, mData.center.x, mData.center.y + 9);
        ctx.fillStyle = "#ffffff";
        ctx.fillText(mData.name, mData.center.x, mData.center.y + 9);
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

  renderReadingAspects() {
    if (!this.readingAspectsContainer) return;
    const reading = this.dualReading || (this.scanResult && this.scanResult.reading);
    if (!reading || !reading.aspects) return;

    const cardsHtml = Object.values(reading.aspects).map(asp => {
      const breakdownHtml = (asp.leftNote || asp.rightNote)
        ? `
          <div class="aspect-dual-breakdown">
            ${asp.leftNote ? `<div class="aspect-hand-note"><strong>✋ มือซ้าย (พื้นดวงเดิม):</strong> ${asp.leftNote.replace(/^มือซ้าย \(พื้นดวงเดิม\):\s*/, "")}</div>` : ""}
            ${asp.rightNote ? `<div class="aspect-hand-note right-note"><strong>🤚 มือขวา (ปัจจุบัน-อนาคต):</strong> ${asp.rightNote.replace(/^มือขวา \(ปัจจุบัน-อนาคต\):\s*/, "")}</div>` : ""}
          </div>
        `
        : "";
      return `
        <div class="palm-aspect-card">
          <div class="aspect-card-header">
            <span class="aspect-icon">${asp.icon || "✦"}</span>
            <div class="aspect-title-wrap">
              <h4>${asp.title || ""}</h4>
              <span class="aspect-grade-pill">${asp.grade || ""}</span>
            </div>
          </div>
          <p class="aspect-text">${asp.text || ""}</p>
          ${breakdownHtml}
        </div>
      `;
    }).join("");

    this.readingAspectsContainer.innerHTML = cardsHtml;

    if (this.summaryVerdictText) {
      this.summaryVerdictText.textContent = reading.summaryVerdict || "";
    }
  }

  resetToCaptureScreen() {
    if (this.isEntitlementLocked) {
      if (window.taroApp && typeof window.taroApp.showToast === "function") {
        window.taroApp.showToast("สิทธิ์นี้วิเคราะห์ครบ 2 มือและบันทึกผลเรียบร้อยแล้ว");
      }
      return;
    }
    this.startNewPalmSession();
  }

  buildPalmSharePayload() {
    const reading = this.dualReading || (this.scanResult && this.scanResult.reading);
    if (!reading) return null;
    const avgConf = this.dualReading
      ? this.dualReading.avgConfidence
      : (this.scanResult && this.scanResult.confidence ? this.scanResult.confidence.percentage : 0);
    const activeCode = (window.taroApp && window.taroApp.activeCode) || "";
    const leftConf = (this.dualScans.left && this.dualScans.left.confidence && this.dualScans.left.confidence.percentage)
      || (this.savedLockedData && this.savedLockedData.leftConfidence)
      || avgConf;
    const rightConf = (this.dualScans.right && this.dualScans.right.confidence && this.dualScans.right.confidence.percentage)
      || (this.savedLockedData && this.savedLockedData.rightConfidence)
      || avgConf;
    const leftHudDataUrl = (this.hudFullUrls && this.hudFullUrls.left) || (this.hudThumbs && this.hudThumbs.left) || "";
    const rightHudDataUrl = (this.hudFullUrls && this.hudFullUrls.right) || (this.hudThumbs && this.hudThumbs.right) || "";
    return {
      mode: "palm",
      hand: this.dualReading ? "both" : this.currentHand,
      code: activeCode,
      confidence: avgConf,
      leftConfidence: leftConf,
      rightConfidence: rightConf,
      summaryVerdict: reading.summaryVerdict || "",
      aspects: reading.aspects || {},
      leftHudDataUrl,
      rightHudDataUrl,
      timestamp: Date.now()
    };
  }

  copyReadingToClipboard() {
    const payload = this.buildPalmSharePayload();
    if (!payload) return;
    const text = (window.shareAndPdfEngine && typeof window.shareAndPdfEngine.buildFullSocialCaption === "function")
      ? window.shareAndPdfEngine.buildFullSocialCaption(payload)
      : `${payload.summaryVerdict || ""}\n${Object.values(payload.aspects || {}).map(a => `${a.icon || "✦"} ${a.title}: ${a.text}`).join("\n\n")}`;

    navigator.clipboard.writeText(text).then(() => {
      if (window.taroApp && window.taroApp.showToast) {
        window.taroApp.showToast("📋 คัดลอกผลคำทำนายลายมือครบทั้ง 2 มือเรียบร้อยแล้ว!");
      }
      if (window.mysticAudio) window.mysticAudio.playCrystalBell(880, 1.2);
    });
  }

  sharePalmToSocial() {
    const payload = this.buildPalmSharePayload();
    if (!payload) return;
    if (window.taroApp) {
      window.taroApp.activeSocialPayload = payload;
      if (typeof window.taroApp.openSocialShareStudio === "function") {
        window.taroApp.openSocialShareStudio(payload);
      } else if (typeof window.taroApp.shareToSocialPlatform === "function") {
        window.taroApp.shareToSocialPlatform("facebook", "palm");
      }
    }
  }

  downloadPalmPdf() {
    const payload = this.buildPalmSharePayload();
    if (!payload) return;
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
