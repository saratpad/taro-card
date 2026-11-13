/**
 * PalmVision — ระบบตรวจจับฝ่ามือและเส้นลายมือจากภาพจริง (ไม่พึ่ง dependency)
 *
 * แนวทางอ้างอิงจากโปรเจกต์ palmistry แบบโอเพนซอร์ส (MediaPipe landmarks → rectify palm →
 * enhance principal lines → classify Heart/Head/Life) แต่ทำงานบน Canvas/ImageData ล้วน:
 *
 *   1. Hand landmarks: รับจาก MediaPipe HandLandmarker (ถ้ามี) หรือประมาณจาก skin mask (fallback)
 *   2. Palm frame: สร้างพิกัดฝ่ามือ (u: ขอบนิ้วก้อย→ขอบนิ้วชี้, v: ข้อมือ→โคนนิ้ว) จาก landmark จริง
 *      ทำให้ไม่ขึ้นกับตำแหน่ง/ขนาด/การเอียงของมือในภาพ
 *   3. Crease enhancement: illumination normalization + multi-scale Hessian ridge filter
 *      (Frangi-style) ตรวจ "ร่องมืด" บนผิว และตัดขอบมือออกด้วย skin mask ที่ถูก erode
 *   4. Line tracing: หาเส้นทางต้นทุนต่ำสุด (Dijkstra) ภายใน corridor ตามกายวิภาคของแต่ละเส้น
 *      ทำให้เส้นเกาะร่องจริงต่อเนื่อง แม้ร่องจะขาดเป็นช่วง ๆ
 *   5. Evidence: ตัดปลายเส้นที่ไม่มีร่องรองรับ และคำนวณ coverage/ความลึกจริง → ค่าความมั่นใจที่วัดได้จริง
 */
(function (root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (root) root.PalmVision = api;
})(typeof window !== "undefined" ? window : null, function () {
  "use strict";

  // ---------------------------------------------------------------------------
  // Basic image ops
  // ---------------------------------------------------------------------------
  function gaussKernel(sigma) {
    const r = Math.max(1, Math.ceil(sigma * 3));
    const k = new Float32Array(2 * r + 1);
    let s = 0;
    for (let i = -r; i <= r; i++) {
      const v = Math.exp(-(i * i) / (2 * sigma * sigma));
      k[i + r] = v;
      s += v;
    }
    for (let i = 0; i < k.length; i++) k[i] /= s;
    return { k, r };
  }

  function blur(src, w, h, sigma) {
    const { k, r } = gaussKernel(sigma);
    const tmp = new Float32Array(w * h);
    const out = new Float32Array(w * h);
    for (let y = 0; y < h; y++) {
      const row = y * w;
      for (let x = 0; x < w; x++) {
        let acc = 0;
        for (let i = -r; i <= r; i++) {
          let xx = x + i;
          if (xx < 0) xx = 0; else if (xx >= w) xx = w - 1;
          acc += src[row + xx] * k[i + r];
        }
        tmp[row + x] = acc;
      }
    }
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        let acc = 0;
        for (let i = -r; i <= r; i++) {
          let yy = y + i;
          if (yy < 0) yy = 0; else if (yy >= h) yy = h - 1;
          acc += tmp[yy * w + x] * k[i + r];
        }
        out[y * w + x] = acc;
      }
    }
    return out;
  }

  function percentile(values, mask, p) {
    const arr = [];
    for (let i = 0; i < values.length; i++) if (!mask || mask[i]) arr.push(values[i]);
    if (!arr.length) return 0;
    arr.sort((a, b) => a - b);
    return arr[Math.min(arr.length - 1, Math.max(0, Math.floor(p * (arr.length - 1))))];
  }

  // ---------------------------------------------------------------------------
  // Skin segmentation (YCrCb) + largest connected component
  // ---------------------------------------------------------------------------
  function skinMask(rgba, w, h) {
    const raw = new Float32Array(w * h);
    for (let i = 0, p = 0; i < w * h; i++, p += 4) {
      const r = rgba[p], g = rgba[p + 1], b = rgba[p + 2];
      const y = 0.299 * r + 0.587 * g + 0.114 * b;
      const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;
      const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
      raw[i] = (cr >= 135 && cr <= 180 && cb >= 77 && cb <= 130 && y > 45) ? 1 : 0;
    }
    // majority filter (smooth) ด้วย blur + threshold
    const sm = blur(raw, w, h, Math.max(1.5, Math.min(w, h) / 300));
    const m = new Uint8Array(w * h);
    for (let i = 0; i < m.length; i++) m[i] = sm[i] > 0.5 ? 1 : 0;
    return largestComponent(m, w, h);
  }

  function largestComponent(m, w, h) {
    const label = new Int32Array(w * h);
    let best = 0, bestLabel = 0, cur = 0;
    const stack = new Int32Array(w * h);
    for (let i = 0; i < m.length; i++) {
      if (!m[i] || label[i]) continue;
      cur++;
      let sp = 0, count = 0;
      stack[sp++] = i;
      label[i] = cur;
      while (sp) {
        const p = stack[--sp];
        count++;
        const x = p % w, y = (p / w) | 0;
        if (x > 0 && m[p - 1] && !label[p - 1]) { label[p - 1] = cur; stack[sp++] = p - 1; }
        if (x < w - 1 && m[p + 1] && !label[p + 1]) { label[p + 1] = cur; stack[sp++] = p + 1; }
        if (y > 0 && m[p - w] && !label[p - w]) { label[p - w] = cur; stack[sp++] = p - w; }
        if (y < h - 1 && m[p + w] && !label[p + w]) { label[p + w] = cur; stack[sp++] = p + w; }
      }
      if (count > best) { best = count; bestLabel = cur; }
    }
    const out = new Uint8Array(w * h);
    if (!bestLabel) return { mask: out, area: 0 };
    for (let i = 0; i < out.length; i++) out[i] = label[i] === bestLabel ? 1 : 0;
    return { mask: out, area: best };
  }

  // ---------------------------------------------------------------------------
  // Fallback landmark estimation from the skin silhouette (มือตั้งตรง นิ้วชี้ขึ้น)
  // คืนค่าเฉพาะจุดที่ระบบใช้: 0 ข้อมือ, 1 thumb CMC, 2 thumb MCP, 5/9/13/17 MCP นิ้วชี้-ก้อย
  // ---------------------------------------------------------------------------
  function rowRuns(mask, w, y, minLen) {
    const runs = [];
    let start = -1;
    const row = y * w;
    for (let x = 0; x <= w; x++) {
      const on = x < w && mask[row + x];
      if (on && start < 0) start = x;
      if (!on && start >= 0) {
        if (x - start >= minLen) runs.push([start, x - 1]);
        start = -1;
      }
    }
    return runs;
  }

  function detectHandedness(lm) {
    // ในมุมมองหงายฝ่ามือเข้าหากล้อง: det > 0 = มือขวา, det < 0 = มือซ้าย (ไม่ขึ้นกับมุมหมุน)
    if (!lm || !lm[0] || !lm[5] || !lm[17]) return "right";
    const M = { x: (lm[5].x + lm[17].x) / 2, y: (lm[5].y + lm[17].y) / 2 };
    const ax = { x: M.x - lm[0].x, y: M.y - lm[0].y };
    const e = { x: lm[5].x - lm[17].x, y: lm[5].y - lm[17].y };
    return (ax.x * e.y - ax.y * e.x) >= 0 ? "right" : "left";
  }

  function estimateLandmarksFromSkin(mask, w, h) {
    let yTop = -1, yBot = -1;
    for (let y = 0; y < h; y++) {
      const runs = rowRuns(mask, w, y, 3);
      if (runs.length) { if (yTop < 0) yTop = y; yBot = y; }
    }
    if (yTop < 0 || yBot - yTop < h * 0.25) return null;
    const handH = yBot - yTop;
    const minRun = Math.max(4, Math.round(w * 0.012));
    const maxFingerRun = Math.max(20, Math.round(w * 0.19));

    const widest = (y) => {
      const runs = rowRuns(mask, w, y, minRun);
      let bestRun = null;
      for (const r of runs) if (!bestRun || (r[1] - r[0]) > (bestRun[1] - bestRun[0])) bestRun = r;
      return { runs, main: bestRun };
    };

    // 1. หาแถวบนที่มีนิ้วแยกกันชัดเจน 4 (หรือ 5 รวมโป้ง) ในครึ่งบนของมือ
    const bandRows = [];
    const scanStart = Math.round(yTop + handH * 0.14);
    const scanEnd = Math.round(yTop + handH * 0.50);
    for (let y = scanStart; y <= scanEnd; y += 2) {
      const runs = rowRuns(mask, w, y, minRun).filter(r => (r[1] - r[0]) <= maxFingerRun);
      if (runs.length >= 4 && runs.length <= 5) {
        const lens = runs.map(r => r[1] - r[0]).sort((a, b) => a - b);
        const med = lens[Math.floor(lens.length / 2)] || 1;
        if (lens[lens.length - 1] <= med * 1.6) {
          bandRows.push({ y, runs });
        }
      } else if (bandRows.length >= 6 && runs.length <= 2) {
        break;
      }
    }
    if (!bandRows.length) return null;

    const rows5 = bandRows.filter(b => b.runs.length === 5);
    const rows4 = bandRows.filter(b => b.runs.length === 4);
    const pickPool = rows5.length >= 3 ? rows5 : (rows4.length ? rows4 : bandRows);
    const pick = pickPool[Math.min(pickPool.length - 1, Math.floor(pickPool.length * 0.7))];
    let fingers = pick.runs.slice().sort((a, b) => a[0] - b[0]);

    // หาปลายนิ้วสูงสุด (yTip) ของแต่ละ run โดยสแกนย้อนขึ้นตามแกน x
    const findTipY = (run, fromY) => {
      let cx = Math.round((run[0] + run[1]) / 2);
      const runW = run[1] - run[0];
      let topY = fromY;
      for (let y = fromY; y >= yTop; y--) {
        const rs = rowRuns(mask, w, y, 2);
        const hit = rs.find(r => cx >= r[0] - 4 && cx <= r[1] + 4);
        if (!hit) {
          if (y < fromY - 2 && !mask[y * w + cx]) break;
          continue;
        }
        if (hit[1] - hit[0] <= runW * 1.45) cx = Math.round((hit[0] + hit[1]) / 2);
        topY = y;
      }
      return { y: topY, x: cx };
    };

    // หากได้ 5 run ให้ตัดนิ้วโป้งออก (นิ้วโป้งอยู่ริมสุดและปลายนิ้วต่ำกว่านิ้วชี้-นาง-ก้อยมาก)
    let tips = fingers.map(r => findTipY(r, pick.y));
    let thumbSide = 0; // -1 = ซ้ายของภาพ, +1 = ขวาของภาพ
    if (fingers.length === 5) {
      if (tips[4].y > tips[0].y) { thumbSide = 1; fingers = fingers.slice(0, 4); tips = tips.slice(0, 4); }
      else { thumbSide = -1; fingers = fingers.slice(1, 5); tips = tips.slice(1, 5); }
    } else {
      // นิ้วก้อยจะปลายต่ำกว่าอีก 3 นิ้วเสมอ จึงบอกด้านฝ่ามือได้แม่นยำทั้งซ้าย/ขวา
      const outerDiff = tips[0].y - tips[3].y;
      if (Math.abs(outerDiff) > handH * 0.03) {
        thumbSide = outerDiff > 0 ? 1 : -1;
      }
    }

    // 2. ติดตามร่องง่ามนิ้วทีละคู่ [0-1], [1-2], [2-3] ลงมาจนเนื้อฝ่ามือเชื่อมติดเป็น run เดียวกัน (3 แถวติดกัน)
    const webY = [];
    const webScanMax = Math.min(h - 1, Math.round(yTop + handH * 0.65));
    for (let k = 0; k < 3; k++) {
      let found = -1;
      let lc = Math.round((fingers[k][0] + fingers[k][1]) / 2);
      let rc = Math.round((fingers[k + 1][0] + fingers[k + 1][1]) / 2);
      for (let y = pick.y; y < webScanMax; y++) {
        const rs = rowRuns(mask, w, y, 3);
        const span = rs.find(r => r[0] <= lc && r[1] >= rc);
        if (span) {
          let solidAhead = 0;
          const checkEnd = Math.min(h - 1, y + 20);
          for (let yy = y; yy <= checkEnd; yy++) {
            const rs2 = rowRuns(mask, w, yy, 3);
            if (rs2.some(r => r[0] <= lc && r[1] >= rc)) solidAhead++;
          }
          if (solidAhead >= Math.min(16, (checkEnd - y + 1) * 0.8)) {
            found = y;
            break;
          }
        } else {
          const mid = (lc + rc) / 2;
          const lRun = rs.find(r => r[0] <= lc && r[1] >= lc && r[1] < mid + 4);
          const rRun = rs.find(r => r[0] <= rc && r[1] >= rc && r[0] > mid - 4);
          if (lRun) lc = Math.round((lRun[0] + lRun[1]) / 2);
          if (rRun) rc = Math.round((rRun[0] + rRun[1]) / 2);
        }
      }
      webY.push(found > 0 ? found : Math.round(yTop + handH * 0.44));
    }
    const avgWebY = (webY[0] + webY[1] + webY[2]) / 3;

    // ถ้านิ้วก้อย-นิ้วชี้ยังแยก thumbSide ไม่ชัด ใช้ส่วนฐานนิ้วโป้งครึ่งล่างฝ่ามือช่วยตัดสิน
    if (!thumbSide) {
      const topInfo = widest(Math.min(h - 1, Math.round(Math.max(...webY) + 8)));
      const midInfo = widest(Math.min(h - 1, Math.round(avgWebY + handH * 0.18)));
      if (midInfo.runs.length >= 2 && midInfo.main) {
        const o = midInfo.runs.filter(r => r !== midInfo.main).sort((a, b) => (b[1] - b[0]) - (a[1] - a[0]))[0];
        thumbSide = ((o[0] + o[1]) / 2) > ((midInfo.main[0] + midInfo.main[1]) / 2) ? 1 : -1;
      } else if (topInfo.main && midInfo.main) {
        thumbSide = (midInfo.main[1] - topInfo.main[1]) > (topInfo.main[0] - midInfo.main[0]) ? 1 : -1;
      } else {
        thumbSide = 1;
      }
    }

    // 3. กำหนดตำแหน่งโคนนิ้ว (MCP) แบบ MediaPipe ตามความยาวนิ้วและง่ามนิ้วจริงของแต่ละนิ้ว
    // orderedLeft: [0=leftmost..3=rightmost] → map เป็น Index(5), Middle(9), Ring(13), Pinky(17)
    const fingerWebForCol = [webY[0], (webY[0] + webY[1]) / 2, (webY[1] + webY[2]) / 2, webY[2]];
    const mcpDropRatio = thumbSide > 0 ? [0.20, 0.12, 0.12, 0.16] : [0.16, 0.12, 0.12, 0.20];
    const colIdx = thumbSide > 0 ? [3, 2, 1, 0] : [0, 1, 2, 3]; // [Index, Middle, Ring, Pinky]
    const lm = new Array(21).fill(null);
    const tipIds = [8, 12, 16, 20];
    const mcpIds = [5, 9, 13, 17];
    for (let k = 0; k < 4; k++) {
      const c = colIdx[k];
      const fCenter = (fingers[c][0] + fingers[c][1]) / 2;
      const wY = fingerWebForCol[c];
      const fLen = Math.max(40, wY - tips[c].y);
      lm[tipIds[k]] = { x: tips[c].x, y: tips[c].y };
      lm[mcpIds[k]] = { x: fCenter * 0.7 + tips[c].x * 0.3, y: wY + fLen * mcpDropRatio[c] };
    }

    // 4. ข้อมือ: แถวแรกในช่วง 1.12..1.58 เท่าของความกว้างสันนิ้ว ที่แคบเข้าใกล้จุดคอดข้อมือ (<= minW * 1.035)
    const knuckleSpan = Math.hypot(lm[5].x - lm[17].x, lm[5].y - lm[17].y);
    const refTopY = (lm[5].y + lm[17].y) / 2;
    const wMinY = Math.min(yBot, Math.round(refTopY + knuckleSpan * 1.15));
    const wMaxY = Math.min(yBot, Math.round(refTopY + knuckleSpan * 1.62));
    let minW = Infinity;
    for (let y = wMinY; y <= wMaxY; y++) {
      const info = widest(y);
      if (info.main) minW = Math.min(minW, info.main[1] - info.main[0]);
    }
    let yWrist = Math.min(yBot, Math.round(refTopY + knuckleSpan * 1.45));
    if (isFinite(minW)) {
      for (let y = wMinY; y <= wMaxY; y++) {
        const info = widest(y);
        if (info.main && (info.main[1] - info.main[0]) <= minW * 1.035) { yWrist = y; break; }
      }
    }
    const wristInfo = widest(yWrist);
    const wristCx = wristInfo.main ? (wristInfo.main[0] + wristInfo.main[1]) / 2 : (lm[5].x + lm[17].x) / 2;
    lm[0] = { x: wristCx, y: yWrist };

    const palmEdgeThumb = (y) => {
      const info = widest(Math.max(yTop, Math.min(yBot, y)));
      if (!info.main) return wristCx;
      return thumbSide > 0 ? info.main[1] : info.main[0];
    };
    const palmSpanY = yWrist - avgWebY;
    const yCmc = Math.round(yWrist - palmSpanY * 0.18);
    lm[1] = { x: palmEdgeThumb(yCmc) - thumbSide * palmSpanY * 0.16, y: yCmc };
    const yMcpT = Math.round(avgWebY + palmSpanY * 0.48);
    lm[2] = { x: palmEdgeThumb(yMcpT) - thumbSide * palmSpanY * 0.14, y: yMcpT };

    return { landmarks: lm, thumbSide, handedness: detectHandedness(lm), method: "skin-geometry" };
  }

  // ---------------------------------------------------------------------------
  // Palm coordinate frame from landmarks
  //   u: 0 = ขอบฝั่งนิ้วก้อย, 1 = ขอบฝั่งนิ้วชี้/นิ้วโป้ง
  //   v: 0 = ข้อมือ, 1 = แนวโคนนิ้ว (MCP)
  // ---------------------------------------------------------------------------
  function buildFrame(lm) {
    const W = lm[0], I = lm[5], P = lm[17];
    const M = { x: (I.x + P.x) / 2, y: (I.y + P.y) / 2 };
    const ax = { x: M.x - W.x, y: M.y - W.y };
    const e = { x: I.x - P.x, y: I.y - P.y };
    const sTop = 1.32, sBot = 1.12; // ความกว้างฝ่ามือเทียบระยะ MCP นิ้วชี้-ก้อย
    const s = (v) => sBot + (sTop - sBot) * Math.max(0, Math.min(1.1, v));
    const det = ax.x * e.y - ax.y * e.x;
    const palmLength = Math.hypot(ax.x, ax.y);
    const palmWidth = Math.hypot(e.x, e.y) * sTop;
    return {
      palmLength,
      palmWidth,
      toImg(u, v) {
        const k = (u - 0.5) * s(v);
        return { x: W.x + v * ax.x + k * e.x, y: W.y + v * ax.y + k * e.y };
      },
      toUV(x, y) {
        const px = x - W.x, py = y - W.y;
        const a = (px * e.y - py * e.x) / det;
        const b = (ax.x * py - ax.y * px) / det;
        return { u: b / s(a) + 0.5, v: a };
      }
    };
  }

  const MOUNT_UV = {
    jupiter: [0.84, 0.90],
    saturn:  [0.60, 0.96],
    sun:     [0.37, 0.95],
    mercury: [0.14, 0.89],
    venus:   [0.82, 0.36],
    moon:    [0.16, 0.28],
    mars:    [0.49, 0.56]
  };

  function computeMounts(landmarks, frame, gray, ridge, roi, cw, ch, scale, minX, minY, meanLum) {
    const rad = Math.max(6, Math.round(frame.palmWidth * 0.065 * scale));
    const lerpPt = (a, b, t) => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
    const lm = landmarks || [];
    const hasCore = lm[0] && lm[5] && lm[9] && lm[13] && lm[17];

    const resolvePt = (id, uvFallback) => {
      if (!hasCore) return frame.toImg(uvFallback[0], uvFallback[1]);
      if (id === "jupiter") return lerpPt(lm[5], lm[0], 0.11);
      if (id === "saturn")  return lerpPt(lm[9], lm[0], 0.10);
      if (id === "sun")     return lerpPt(lm[13], lm[0], 0.10);
      if (id === "mercury") return lerpPt(lm[17], lm[0], 0.11);
      if (id === "venus") {
        const uvPt = frame.toImg(uvFallback[0], uvFallback[1]);
        if (lm[1] && lm[2]) {
          return {
            x: 0.24 * lm[1].x + 0.10 * lm[2].x + 0.20 * lm[0].x + 0.46 * uvPt.x,
            y: 0.24 * lm[1].y + 0.10 * lm[2].y + 0.20 * lm[0].y + 0.46 * uvPt.y
          };
        }
        return uvPt;
      }
      return frame.toImg(uvFallback[0], uvFallback[1]);
    };

    const mounts = {};
    for (const [id, uvFb] of Object.entries(MOUNT_UV)) {
      const pt = resolvePt(id, uvFb);
      const uv = frame.toUV(pt.x, pt.y);
      const cx = Math.round((pt.x - minX) * scale);
      const cy = Math.round((pt.y - minY) * scale);
      let lumSum = 0, ridgeSum = 0, n = 0;
      for (let dy = -rad; dy <= rad; dy++) {
        const yy = cy + dy;
        if (yy < 0 || yy >= ch) continue;
        for (let dx = -rad; dx <= rad; dx++) {
          if (dx * dx + dy * dy > rad * rad) continue;
          const xx = cx + dx;
          if (xx < 0 || xx >= cw) continue;
          const i = yy * cw + xx;
          if (!roi[i]) continue;
          lumSum += gray[i];
          ridgeSum += ridge[i];
          n++;
        }
      }
      const relBright = n ? (lumSum / n - meanLum) / Math.max(20, meanLum) : 0;
      const meanR = n ? ridgeSum / n : 0;
      const baseBias = id === "venus" ? 72 : id === "mars" ? 64 : 66;
      const fullness = Math.max(38, Math.min(96, Math.round(baseBias + relBright * 140 - meanR * 22)));
      const status = fullness >= 74 ? "full" : (fullness >= 56 ? "moderate" : "flat");
      mounts[id] = {
        id,
        x: Math.round(pt.x),
        y: Math.round(pt.y),
        u: Number(uv.u.toFixed(3)),
        v: Number(uv.v.toFixed(3)),
        fullness,
        status
      };
    }
    return mounts;
  }

  // ---------------------------------------------------------------------------
  // Line templates (ตำแหน่งตามกายวิภาคมาตรฐาน) — smooth C1 spline corridors สำหรับ DP
  // ---------------------------------------------------------------------------
  const LINE_TEMPLATES = {
    heart:   { poly: [[-0.06, 0.67], [0.22, 0.72], [0.54, 0.80], [0.82, 0.94]], hw: 0.14, hwStart: 0.14, minLen: 0.28, required: true },
    head:    { poly: [[1.00, 0.72], [0.70, 0.66], [0.40, 0.59], [0.02, 0.52]], hw: 0.13, hwStart: 0.10, minLen: 0.28, required: true, sharedHeadLife: true },
    life:    { poly: [[1.00, 0.72], [0.71, 0.67], [0.61, 0.51], [0.63, 0.30], [0.71, 0.06]], hw: 0.13, hwStart: 0.085, minLen: 0.30, required: true, sharedHeadLife: true },
    fate:    { poly: [[0.48, 0.05], [0.49, 0.36], [0.53, 0.64], [0.60, 0.89]], hw: 0.12, hwStart: 0.11, minLen: 0.18, required: false },
    sun:     { poly: [[0.38, 0.38], [0.36, 0.64], [0.37, 0.90]], hw: 0.075, hwStart: 0.07, minLen: 0.15, required: false },
    mercury: { poly: [[0.42, 0.14], [0.27, 0.46], [0.15, 0.78]], hw: 0.08, hwStart: 0.08, minLen: 0.16, required: false }
  };
  const TRACE_ORDER = ["heart", "head", "life", "fate", "sun", "mercury"];

  // Smooth Catmull-Rom spline sampler along control points in UV space
  function sampleSplineUV(poly, t) {
    const m = poly.length;
    if (t <= 0) return { u: poly[0][0], v: poly[0][1] };
    if (t >= 1) return { u: poly[m - 1][0], v: poly[m - 1][1] };
    const f = t * (m - 1);
    const i = Math.min(m - 2, Math.floor(f));
    const s = f - i;
    const p0 = poly[Math.max(0, i - 1)];
    const p1 = poly[i];
    const p2 = poly[i + 1];
    const p3 = poly[Math.min(m - 1, i + 2)];
    const s2 = s * s, s3 = s2 * s;
    const cm = (a, b, c, d) => 0.5 * (
      2 * b + (-a + c) * s + (2 * a - 5 * b + 4 * c - d) * s2 + (-a + 3 * b - 3 * c + d) * s3
    );
    return { u: cm(p0[0], p1[0], p2[0], p3[0]), v: cm(p0[1], p1[1], p2[1], p3[1]) };
  }

  // Morphological 1D & 2D Black-Hat helpers for crisp valley enhancement
  function morph1D(src, w, h, r, isMax, horiz) {
    const out = new Float32Array(w * h);
    if (horiz) {
      for (let y = 0; y < h; y++) {
        const row = y * w;
        for (let x = 0; x < w; x++) {
          let best = isMax ? -Infinity : Infinity;
          const x0 = Math.max(0, x - r), x1 = Math.min(w - 1, x + r);
          for (let xx = x0; xx <= x1; xx++) {
            const v = src[row + xx];
            if (isMax ? v > best : v < best) best = v;
          }
          out[row + x] = best;
        }
      }
    } else {
      for (let y = 0; y < h; y++) {
        const y0 = Math.max(0, y - r), y1 = Math.min(h - 1, y + r);
        for (let x = 0; x < w; x++) {
          let best = isMax ? -Infinity : Infinity;
          for (let yy = y0; yy <= y1; yy++) {
            const v = src[yy * w + x];
            if (isMax ? v > best : v < best) best = v;
          }
          out[y * w + x] = best;
        }
      }
    }
    return out;
  }

  function closing2D(src, w, h, r) {
    const d1 = morph1D(src, w, h, r, true, true);
    const d2 = morph1D(d1, w, h, r, true, false);
    const e1 = morph1D(d2, w, h, r, false, true);
    return morph1D(e1, w, h, r, false, false);
  }

  // ---------------------------------------------------------------------------
  // Main analysis
  // ---------------------------------------------------------------------------
  /**
   * @param {Uint8ClampedArray} rgba  ImageData.data
   * @param {number} w
   * @param {number} h
   * @param {Object} opts { landmarks?: [{x,y}] (pixel coords, 21 จุดแบบ MediaPipe), sensitivity?: 1..5 }
   */
  function analyzePalm(rgba, w, h, opts = {}) {
    const t0 = Date.now();
    const sensitivity = Math.max(1, Math.min(5, Number(opts.sensitivity || 3)));

    // --- 1. Skin mask (ใช้ทั้ง fallback landmark และตัดขอบมือ) ---
    const skin = skinMask(rgba, w, h);
    const skinRatio = skin.area / (w * h);

    let landmarks = opts.landmarks || null;
    let landmarkMethod = opts.landmarkMethod || (landmarks ? "mediapipe" : null);
    if (!landmarks) {
      if (skinRatio < 0.04) {
        return { ok: false, reason: "no_hand", message: "ไม่พบฝ่ามือในภาพ กรุณาวางฝ่ามือให้เต็มกรอบและมีแสงสว่างเพียงพอ" };
      }
      const est = estimateLandmarksFromSkin(skin.mask, w, h);
      if (!est) {
        return { ok: false, reason: "no_landmarks", message: "ตรวจไม่พบตำแหน่งนิ้วและข้อมือ กรุณากางนิ้วเล็กน้อย ตั้งมือตรง และถ่ายบนพื้นหลังเรียบ" };
      }
      landmarks = est.landmarks;
      landmarkMethod = est.method;
    }
    const frame = buildFrame(landmarks);
    if (!isFinite(frame.palmLength) || frame.palmLength < 60) {
      return { ok: false, reason: "too_small", message: "ฝ่ามือในภาพเล็กเกินไป กรุณาถ่ายให้ใกล้ขึ้น" };
    }

    // --- 2. Crop + rescale palm (palm length ≈ 420px) ---
    const target = 420;
    const scale = Math.max(0.2, Math.min(1.6, target / frame.palmLength));
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const [u, v] of [[-0.16, -0.06], [1.14, -0.06], [-0.16, 1.08], [1.14, 1.08], [1.14, 0.4], [-0.16, 0.5]]) {
      const p = frame.toImg(u, v);
      minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x);
      minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y);
    }
    minX = Math.max(0, Math.floor(minX)); minY = Math.max(0, Math.floor(minY));
    maxX = Math.min(w - 1, Math.ceil(maxX)); maxY = Math.min(h - 1, Math.ceil(maxY));
    const cw = Math.max(16, Math.round((maxX - minX) * scale));
    const ch = Math.max(16, Math.round((maxY - minY) * scale));
    const toOrig = (x, y) => ({ x: minX + x / scale, y: minY + y / scale });

    const gray = new Float32Array(cw * ch);
    const skinC = new Float32Array(cw * ch);
    const U = new Float32Array(cw * ch), V = new Float32Array(cw * ch);
    for (let y = 0; y < ch; y++) {
      for (let x = 0; x < cw; x++) {
        const ox = minX + x / scale, oy = minY + y / scale;
        const x0 = Math.min(w - 2, Math.max(0, Math.floor(ox))), y0 = Math.min(h - 2, Math.max(0, Math.floor(oy)));
        const fx = Math.min(1, Math.max(0, ox - x0)), fy = Math.min(1, Math.max(0, oy - y0));
        let acc = 0;
        for (const [dx, dy, wt] of [[0, 0, (1 - fx) * (1 - fy)], [1, 0, fx * (1 - fy)], [0, 1, (1 - fx) * fy], [1, 1, fx * fy]]) {
          const p = ((y0 + dy) * w + (x0 + dx)) * 4;
          // ช่องสีเขียวให้คอนทราสต์ของร่องบนผิวดีที่สุด
          acc += wt * (0.20 * rgba[p] + 0.68 * rgba[p + 1] + 0.12 * rgba[p + 2]);
        }
        const i = y * cw + x;
        gray[i] = acc;
        skinC[i] = skin.mask[Math.round(oy) * w + Math.round(ox)] || 0;
        const uv = frame.toUV(ox, oy);
        U[i] = uv.u; V[i] = uv.v;
      }
    }

    // --- 3. ROI: ฝ่ามือ (รวมขอบด้านข้างสำหรับจุดเริ่มต้นเส้นหัวใจและง่ามนิ้วโป้ง) ---
    const edgeSigma = 3;
    const skinB = blur(skinC, cw, ch, edgeSigma);
    const roi = new Uint8Array(cw * ch);
    let roiCount = 0;
    for (let i = 0; i < roi.length; i++) {
      const inPalm = U[i] > -0.13 && U[i] < 1.07 && V[i] > -0.02 && V[i] < 1.08;
      if (inPalm && skinB[i] > 0.84) { roi[i] = 1; roiCount++; }
    }
    if (roiCount < cw * ch * 0.15) {
      return { ok: false, reason: "roi_small", message: "พื้นที่ฝ่ามือที่ตรวจเจอน้อยเกินไป กรุณาหงายฝ่ามือเข้าหากล้องให้เต็มกรอบ" };
    }

    // --- 4. Illumination normalization (Weber) + Black-Hat valley + sharper Hessian + Directional NMS ---
    const bg = blur(gray, cw, ch, 14);
    const norm = new Float32Array(cw * ch);
    for (let i = 0; i < norm.length; i++) {
      norm[i] = (gray[i] - bg[i]) / Math.max(8, 0.08 * bg[i]);
    }
    const closed = closing2D(norm, cw, ch, 4);
    const valleyNorm = new Float32Array(cw * ch);
    for (let i = 0; i < norm.length; i++) {
      const bh = Math.max(0, closed[i] - norm[i]);
      valleyNorm[i] = norm[i] - 0.35 * bh;
    }

    const ridge = new Float32Array(cw * ch);
    const dirX = new Float32Array(cw * ch);
    const dirY = new Float32Array(cw * ch);
    const sigmas = [1.1, 1.8, 2.8];
    for (const s of sigmas) {
      const L = blur(valleyNorm, cw, ch, s);
      const sWeight = Math.pow(s, 1.25);
      for (let y = 1; y < ch - 1; y++) {
        for (let x = 1; x < cw - 1; x++) {
          const i = y * cw + x;
          if (!roi[i]) continue;
          const dxx = L[i + 1] - 2 * L[i] + L[i - 1];
          const dyy = L[i + cw] - 2 * L[i] + L[i - cw];
          const dxy = (L[i + cw + 1] - L[i + cw - 1] - L[i - cw + 1] + L[i - cw - 1]) / 4;
          const tmp = Math.sqrt((dxx - dyy) * (dxx - dyy) + 4 * dxy * dxy);
          const l1 = (dxx + dyy + tmp) / 2; // ค่าบวกมาก = ร่องมืด
          const l2 = (dxx + dyy - tmp) / 2;
          if (l1 <= 0) continue;
          const rb = l2 / l1;
          const resp = sWeight * l1 * Math.exp(-(rb * rb) / 0.5);
          if (resp > ridge[i]) {
            ridge[i] = resp;
            let vx = dxy, vy = l2 - dxx;
            const vx2 = l2 - dyy, vy2 = dxy;
            if (vx2 * vx2 + vy2 * vy2 > vx * vx + vy * vy) { vx = vx2; vy = vy2; }
            const vl = Math.hypot(vx, vy) || 1;
            dirX[i] = vx / vl;
            dirY[i] = vy / vl;
          }
        }
      }
    }
    const pLow = percentile(ridge, roi, 0.56);
    const pHigh = percentile(ridge, roi, 0.986 - (sensitivity - 3) * 0.007);
    const rSpan = Math.max(1e-4, pHigh - pLow);
    const Rraw = new Float32Array(cw * ch);
    for (let i = 0; i < Rraw.length; i++) Rraw[i] = roi[i] ? Math.max(0, Math.min(1, (ridge[i] - pLow) / rSpan)) : 0;

    // Directional Non-Maximum Suppression (NMS) along normal (-dirY, dirX)
    const sampleRaw = (sx, sy) => {
      const x0 = Math.max(0, Math.min(cw - 2, Math.floor(sx)));
      const y0 = Math.max(0, Math.min(ch - 2, Math.floor(sy)));
      const fx = Math.max(0, Math.min(1, sx - x0));
      const fy = Math.max(0, Math.min(1, sy - y0));
      const p = y0 * cw + x0;
      return (
        Rraw[p] * (1 - fx) * (1 - fy) +
        Rraw[p + 1] * fx * (1 - fy) +
        Rraw[p + cw] * (1 - fx) * fy +
        Rraw[p + cw + 1] * fx * fy
      );
    };
    const Rnms = new Float32Array(cw * ch);
    for (let y = 1; y < ch - 1; y++) {
      for (let x = 1; x < cw - 1; x++) {
        const i = y * cw + x;
        const val = Rraw[i];
        if (!roi[i] || val <= 0.02) continue;
        const nx = -dirY[i], ny = dirX[i];
        const rp = sampleRaw(x + 1.15 * nx, y + 1.15 * ny);
        const rm = sampleRaw(x - 1.15 * nx, y - 1.15 * ny);
        const mx = Math.max(rp, rm);
        if (val >= mx) Rnms[i] = val;
        else if (val >= 0.88 * mx) Rnms[i] = 0.60 * val;
        else Rnms[i] = 0.16 * val;
      }
    }
    const R = new Float32Array(cw * ch);
    for (let i = 0; i < R.length; i++) R[i] = 0.72 * Rnms[i] + 0.28 * Rraw[i];

    // --- 5. Trace each principal line via smooth directional DP ---
    const usedMask = new Uint8Array(cw * ch);
    const lines = {};
    for (let idx = 0; idx < TRACE_ORDER.length; idx++) {
      const key = TRACE_ORDER[idx];
      const bit = 1 << idx;
      lines[key] = traceLine(key, bit, LINE_TEMPLATES[key], R, Rraw, dirX, dirY, roi, usedMask, cw, ch, frame, scale, toOrig, sensitivity, lines);
    }

    // --- 6. Quality metrics + landmark-anchored mounts ---
    let lumSum = 0, lumN = 0;
    for (let i = 0; i < gray.length; i += 7) if (roi[i]) { lumSum += gray[i]; lumN++; }
    const meanLum = lumN ? lumSum / lumN : 0;
    let sharp = 0, sharpN = 0;
    for (let y = 1; y < ch - 1; y += 2) for (let x = 1; x < cw - 1; x += 2) {
      const i = y * cw + x;
      if (!roi[i]) continue;
      const lap = 4 * gray[i] - gray[i - 1] - gray[i + 1] - gray[i - cw] - gray[i + cw];
      sharp += lap * lap; sharpN++;
    }
    const sharpness = sharpN ? Math.sqrt(sharp / sharpN) : 0;
    const mounts = computeMounts(landmarks, frame, gray, R, roi, cw, ch, scale, minX, minY, meanLum);
    const handedness = opts.handedness || detectHandedness(landmarks);

    return {
      ok: true,
      landmarkMethod,
      handedness,
      landmarks,
      frame,
      lines,
      mounts,
      quality: {
        meanLuminance: Math.round(meanLum),
        sharpness: Number(sharpness.toFixed(2)),
        palmLengthPx: Math.round(frame.palmLength),
        skinRatio: Number(skinRatio.toFixed(3))
      },
      debug: { crop: { x: minX, y: minY, w: cw, h: ch, scale }, ridge: R, roi },
      elapsedMs: Date.now() - t0
    };
  }

  function traceLine(key, bit, tpl, R, Rraw, dirX, dirY, roi, usedMask, cw, ch, frame, scale, toOrig, sensitivity, lines) {
    const T = 88;
    const M = 53;
    const midJ = (M - 1) >> 1;
    const maxJump = 2;

    // ระยะห่างกายวิภาคระหว่างเส้นหัวใจกับเส้นสมอง (ป้องกันเส้นสมองปีนขึ้นเกาะแนวเส้นหัวใจ)
    const heartUV = (key === "head" && lines && lines.heart && lines.heart.detected && lines.heart.uv.length >= 2)
      ? lines.heart.uv
      : null;
    const heartVAt = (u) => {
      if (!heartUV || u > 0.76) return Infinity;
      let best = Infinity;
      for (let i = 0; i < heartUV.length - 1; i++) {
        const a = heartUV[i], b = heartUV[i + 1];
        const uMin = Math.min(a.u, b.u), uMax = Math.max(a.u, b.u);
        if (u >= uMin - 0.03 && u <= uMax + 0.03) {
          const span = b.u - a.u;
          const s = Math.abs(span) > 1e-4 ? Math.max(0, Math.min(1, (u - a.u) / span)) : 0.5;
          const v = a.v + (b.v - a.v) * s;
          if (v < best) best = v;
        }
      }
      return best;
    };

    const bilerp = (arr, x, y) => {
      const x0 = Math.max(0, Math.min(cw - 2, Math.floor(x)));
      const y0 = Math.max(0, Math.min(ch - 2, Math.floor(y)));
      const fx = Math.max(0, Math.min(1, x - x0));
      const fy = Math.max(0, Math.min(1, y - y0));
      const p = y0 * cw + x0;
      return (
        arr[p] * (1 - fx) * (1 - fy) +
        arr[p + 1] * fx * (1 - fy) +
        arr[p + cw] * (1 - fx) * fy +
        arr[p + cw + 1] * fx * fy
      );
    };

    const gCx = new Float32Array(T * M);
    const gCy = new Float32Array(T * M);
    const gR = new Float32Array(T * M);
    const gRaw = new Float32Array(T * M);
    const gDx = new Float32Array(T * M);
    const gDy = new Float32Array(T * M);
    const gDn = new Float32Array(M);
    const gUsed = new Uint8Array(T * M);
    const gBlocked = new Uint8Array(T * M);
    const gInRoi = new Uint8Array(T * M);
    const stepInRoi = new Uint8Array(T);
    const normX = new Float32Array(T);
    const normY = new Float32Array(T);

    for (let j = 0; j < M; j++) gDn[j] = -1 + 2 * (j / (M - 1));

    const hwStart = tpl.hwStart || tpl.hw;
    for (let k = 0; k < T; k++) {
      const t = k / (T - 1);
      const cUV = sampleSplineUV(tpl.poly, t);
      const pA = sampleSplineUV(tpl.poly, Math.max(0, t - 0.005));
      const pB = sampleSplineUV(tpl.poly, Math.min(1, t + 0.005));
      const du = pB.u - pA.u, dv = pB.v - pA.v;
      const luv = Math.hypot(du, dv) || 1;
      const nu = -dv / luv, nv = du / luv;
      const hw = hwStart + (tpl.hw - hwStart) * Math.min(1, t / 0.35);

      const n0 = frame.toImg(cUV.u, cUV.v);
      const n1 = frame.toImg(cUV.u + nu * 0.05, cUV.v + nv * 0.05);
      const nxC = n1.x - n0.x, nyC = n1.y - n0.y;
      const nLen = Math.hypot(nxC, nyC) || 1;
      normX[k] = nxC / nLen;
      normY[k] = nyC / nLen;

      let anyIn = 0;
      for (let j = 0; j < M; j++) {
        const idx = k * M + j;
        const dUV = gDn[j] * hw;
        const uu = cUV.u + dUV * nu, vv = cUV.v + dUV * nv;
        const pt = frame.toImg(uu, vv);
        const cx = (pt.x - (toOrig(0, 0).x)) * scale;
        const cy = (pt.y - (toOrig(0, 0).y)) * scale;
        gCx[idx] = cx;
        gCy[idx] = cy;

        if (heartUV && uu < 0.76 && vv > heartVAt(uu) - 0.038) {
          gBlocked[idx] = 1;
        }

        const ix = Math.round(cx), iy = Math.round(cy);
        if (ix >= 1 && iy >= 1 && ix < cw - 1 && iy < ch - 1 && roi[iy * cw + ix]) {
          gInRoi[idx] = 1;
          anyIn = 1;
          const pix = iy * cw + ix;
          gR[idx] = gBlocked[idx] ? 0 : bilerp(R, cx, cy);
          gRaw[idx] = gBlocked[idx] ? 0 : bilerp(Rraw, cx, cy);
          gDx[idx] = dirX[pix];
          gDy[idx] = dirY[pix];
          gUsed[idx] = usedMask[pix];
        }
      }
      stepInRoi[k] = anyIn;
    }

    // Dynamic Programming (Smooth Directional Viterbi)
    const dp = new Float64Array(T * M).fill(-1e9);
    const back = new Int16Array(T * M).fill(midJ);
    const wPrior = tpl.required ? 0.045 : 0.060;
    const wJump = tpl.required ? 0.105 : 0.125;

    for (let j = 0; j < M; j++) {
      const idx = j;
      if (!gInRoi[idx]) {
        dp[idx] = -0.30 - wPrior * gDn[j] * gDn[j];
      } else {
        const uPenalty = (gUsed[idx] && !(key === "life" && (gUsed[idx] & 2))) ? (tpl.required ? 0.35 : 0.65) : 0;
        dp[idx] = gR[idx] * 0.85 - wPrior * gDn[j] * gDn[j] - uPenalty - (gBlocked[idx] ? 0.95 : 0);
      }
    }

    for (let k = 1; k < T; k++) {
      const t = k / (T - 1);
      const prevRow = (k - 1) * M;
      const curRow = k * M;
      const freeEntry = !stepInRoi[k - 1] && stepInRoi[k];
      const allowHeadShare = key === "life" && t < 0.34;

      for (let j = 0; j < M; j++) {
        const idx = curRow + j;
        const inR = gInRoi[idx];
        const priorCost = wPrior * gDn[j] * gDn[j];
        let best = -1e9, bestP = j;

        const jLo = freeEntry ? 0 : Math.max(0, j - maxJump);
        const jHi = freeEntry ? (M - 1) : Math.min(M - 1, j + maxJump);
        for (let jp = jLo; jp <= jHi; jp++) {
          const pIdx = prevRow + jp;
          const prevDp = dp[pIdx];
          if (prevDp <= -1e8) continue;

          const dj = j - jp;
          const jumpCost = freeEntry
            ? 0.004 * Math.abs(dj)
            : ((gInRoi[pIdx] && inR) ? wJump * dj * dj : 0.02 * dj * dj);
          let nodeScore;
          if (!inR) {
            nodeScore = -0.35 - priorCost;
          } else {
            const sx = gCx[idx] - gCx[pIdx], sy = gCy[idx] - gCy[pIdx];
            const slen = Math.hypot(sx, sy) || 1;
            const align = gR[idx] > 0.04 ? Math.abs((sx * gDx[idx] + sy * gDy[idx]) / slen) : 0.55;
            const eff = gR[idx] * (0.20 + 0.80 * align * align);
            const uM = gUsed[idx];
            let uPen = gBlocked[idx] ? 0.95 : 0;
            if (uM) {
              if (allowHeadShare && (uM & 2) && !(uM & ~2)) uPen -= 0.04; // ดึงดูดเล็กน้อยเฉพาะช่วงโคนเส้นสมอง/ชีวิต
              else if (key === "fate" && align < 0.45) uPen += 0.08;     // ข้ามเส้นขวางเกือบตั้งฉากได้สะดวก
              else uPen += tpl.required ? 0.45 : 0.70;
            }
            nodeScore = eff - priorCost - uPen;
          }
          const cand = prevDp + nodeScore - jumpCost;
          if (cand > best) { best = cand; bestP = jp; }
        }
        dp[idx] = best;
        back[idx] = bestP;
      }
    }

    // เลือกจุดปลายทางที่ดีที่สุด (ภายใน ROI หากมี)
    let bestEnd = midJ, bestEndScore = -1e9;
    const lastRow = (T - 1) * M;
    for (let j = 0; j < M; j++) {
      const s = dp[lastRow + j] + (gInRoi[lastRow + j] ? 0.05 : 0);
      if (s > bestEndScore) { bestEndScore = s; bestEnd = j; }
    }

    // Backtrack path
    const jPath = new Int16Array(T);
    let cur = bestEnd;
    for (let k = T - 1; k >= 0; k--) {
      jPath[k] = cur;
      if (k > 0) cur = back[k * M + cur];
    }

    // Per-step directional evidence & raw ridge along tracked curve
    const rv = new Float32Array(T);
    const ev = new Float32Array(T);
    const inRoiArr = new Uint8Array(T);
    for (let k = 0; k < T; k++) {
      const idx = k * M + jPath[k];
      inRoiArr[k] = gInRoi[idx];
      if (!gInRoi[idx]) continue;
      const kPrev = Math.max(0, k - 1), kNext = Math.min(T - 1, k + 1);
      const pIdx = kPrev * M + jPath[kPrev], nIdx = kNext * M + jPath[kNext];
      const sx = gCx[nIdx] - gCx[pIdx], sy = gCy[nIdx] - gCy[pIdx];
      const slen = Math.hypot(sx, sy) || 1;
      const align = gR[idx] > 0.04 ? Math.abs((sx * gDx[idx] + sy * gDy[idx]) / slen) : 0.55;
      const eff = gR[idx] * (0.20 + 0.80 * align * align);
      rv[k] = gRaw[idx];
      ev[k] = 0.30 * gRaw[idx] + 0.70 * eff;
    }

    const win = 2;
    const sm = new Float32Array(T);
    for (let k = 0; k < T; k++) {
      let a = 0, c = 0;
      for (let q = Math.max(0, k - win); q <= Math.min(T - 1, k + win); q++) {
        if (!inRoiArr[q]) continue;
        a += ev[q]; c++;
      }
      sm[k] = c ? a / c : 0;
    }

    // Kadane's Maximum-Subarray Extraction (ตัดปลายปลอมอัตโนมัติ แต่ข้ามรอยขาดจริงขนาดสั้นได้)
    const sensShift = (sensitivity - 3) * 0.015;
    const baseTh = Math.max(0.085, (tpl.required ? 0.115 : 0.22) - sensShift);
    let bestScore = -1, bestA = 0, bestB = -1;
    let curA = -1, curScore = 0;
    for (let k = 0; k < T; k++) {
      if (!inRoiArr[k]) { curA = -1; curScore = 0; continue; }
      const gain = sm[k] - baseTh;
      if (curA < 0) {
        if (gain > 0) { curA = k; curScore = gain; }
      } else {
        curScore += gain;
        if (curScore <= 0) { curA = -1; curScore = 0; }
      }
      if (curA >= 0 && curScore > bestScore) {
        bestScore = curScore;
        bestA = curA;
        bestB = k;
      }
    }
    if (bestB <= bestA) return emptyLine(key);

    let s0 = bestA, s1 = bestB;
    const tipTh = tpl.required ? Math.max(0.09, 0.12 - sensShift) : Math.max(0.14, 0.18 - sensShift);
    if (tpl.required) {
      // ต่อปลายเส้นหลักข้ามรอยแสงสะท้อนจางๆ ไปยังจุดขอบมือถ้ามีร่องชัดเจนต่อเนื่อง
      let extL = -1;
      for (let k = s0 - 1, gap = 0; k >= 0 && gap <= 11; k--, gap++) {
        if (!inRoiArr[k]) break;
        if (sm[k] >= 0.15 || ev[k] >= 0.22) extL = k;
      }
      if (extL >= 0) s0 = extL;
      let extR = -1;
      for (let k = s1 + 1, gap = 0; k < T && gap <= 11; k++, gap++) {
        if (!inRoiArr[k]) break;
        if (sm[k] >= 0.15 || ev[k] >= 0.22) extR = k;
      }
      if (extR >= 0) s1 = extR;
    }
    while (s0 < s1 && (!inRoiArr[s0] || Math.max(ev[s0], sm[s0]) < tipTh)) s0++;
    while (s1 > s0 && (!inRoiArr[s1] || Math.max(ev[s1], sm[s1]) < tipTh)) s1--;
    if (s1 <= s0) return emptyLine(key);

    // Extract coordinates + Subpixel Valley Centroid Snap along normal
    const ptsCrop = [];
    const trimmedR = [];
    const trimmedE = [];
    const trimmedSm = [];
    for (let k = s0; k <= s1; k++) {
      const idx = k * M + jPath[k];
      let cx = gCx[idx], cy = gCy[idx];
      if (gRaw[idx] >= 0.14) {
        const nx = normX[k], ny = normY[k];
        let num = 0, den = 0;
        for (let o = -2.0; o <= 2.001; o += 0.5) {
          const sx = cx + o * nx, sy = cy + o * ny;
          if (sx < 1 || sy < 1 || sx >= cw - 1 || sy >= ch - 1) continue;
          const v = bilerp(Rraw, sx, sy);
          const wt = v * v;
          num += o * wt;
          den += wt;
        }
        if (den > 1e-4) {
          const shift = Math.max(-1.6, Math.min(1.6, num / den));
          cx += shift * nx;
          cy += shift * ny;
        }
      }
      ptsCrop.push({ x: cx, y: cy });
      trimmedR.push(rv[k]);
      trimmedE.push(ev[k]);
      trimmedSm.push(sm[k]);
    }

    // Metrics
    let lenPx = 0;
    for (let i = 1; i < ptsCrop.length; i++) {
      lenPx += Math.hypot(ptsCrop[i].x - ptsCrop[i - 1].x, ptsCrop[i].y - ptsCrop[i - 1].y);
    }
    const lenPalm = (lenPx / scale) / frame.palmLength;
    const coverage = trimmedE.length ? trimmedE.filter(v => v > 0.14).length / trimmedE.length : 0;
    const meanR = trimmedR.length ? trimmedR.reduce((a, b) => a + b, 0) / trimmedR.length : 0;
    const meanE = trimmedE.length ? trimmedE.reduce((a, b) => a + b, 0) / trimmedE.length : 0;
    let gaps = 0, inGap = 0;
    for (const v of trimmedSm) {
      if (v < 0.13) { inGap++; if (inGap === 4) gaps++; } else inGap = 0;
    }
    const covThresh = tpl.required ? 0.50 : 0.66;
    const depthThresh = tpl.required ? 0.21 : 0.35;
    const minRawR = tpl.required ? 0.14 : 0.39;
    const detected = ptsCrop.length > 6 && coverage >= covThresh && meanE >= depthThresh && meanR >= minRawR && lenPalm >= tpl.minLen;

    // mark bitmask pixels as used เฉพาะเส้นที่ตรวจพบจริง
    if (detected) {
      for (let i = 0; i < ptsCrop.length; i++) {
        const ax = ptsCrop[i].x, ay = ptsCrop[i].y;
        for (let tSub = 0; tSub < (i < ptsCrop.length - 1 ? 3 : 1); tSub++) {
          const px = i < ptsCrop.length - 1 ? ax + (ptsCrop[i + 1].x - ax) * (tSub / 3) : ax;
          const py = i < ptsCrop.length - 1 ? ay + (ptsCrop[i + 1].y - ay) * (tSub / 3) : ay;
          const rx = Math.round(px), ry = Math.round(py);
          for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) {
            const xx = rx + dx, yy = ry + dy;
            if (xx >= 0 && yy >= 0 && xx < cw && yy < ch) usedMask[yy * cw + xx] |= bit;
          }
        }
      }
    }

    const ptsOrig = ptsCrop.map(p => toOrig(p.x, p.y));
    const simplified = simplify(ptsOrig, Math.max(0.9, 1.1 / scale));
    const smooth = smoothPoints(simplified, 1);
    const uvPts = smooth.map(p => frame.toUV(p.x, p.y));

    const rawConf = 100 * Math.min(1, 0.52 * coverage + 0.48 * Math.min(1, meanE / 0.50));
    const confidence = detected ? Math.round(rawConf) : Math.round(Math.min(48, rawConf * 0.55));

    return {
      id: key,
      detected,
      points: smooth,
      uv: uvPts,
      lengthRatio: Number(lenPalm.toFixed(3)),
      coverage: Number(coverage.toFixed(3)),
      depth: Number(meanR.toFixed(3)),
      gaps,
      confidence
    };
  }

  function emptyLine(key) {
    return { id: key, detected: false, points: [], uv: [], lengthRatio: 0, coverage: 0, depth: 0, gaps: 0, confidence: 0 };
  }

  // Ramer–Douglas–Peucker
  function simplify(pts, eps) {
    if (pts.length < 3) return pts.slice();
    const keep = new Uint8Array(pts.length);
    keep[0] = keep[pts.length - 1] = 1;
    const stack = [[0, pts.length - 1]];
    while (stack.length) {
      const [a, b] = stack.pop();
      let maxD = 0, idx = -1;
      const A = pts[a], B = pts[b];
      const dx = B.x - A.x, dy = B.y - A.y, L = Math.hypot(dx, dy) || 1;
      for (let i = a + 1; i < b; i++) {
        const d = Math.abs(dy * pts[i].x - dx * pts[i].y + B.x * A.y - B.y * A.x) / L;
        if (d > maxD) { maxD = d; idx = i; }
      }
      if (maxD > eps && idx > 0) { keep[idx] = 1; stack.push([a, idx], [idx, b]); }
    }
    return pts.filter((_, i) => keep[i]);
  }

  // Chaikin smoothing (คงจุดปลายไว้)
  function smoothPoints(pts, iterations) {
    let out = pts.slice();
    for (let it = 0; it < iterations && out.length > 2; it++) {
      const next = [out[0]];
      for (let i = 0; i < out.length - 1; i++) {
        const a = out[i], b = out[i + 1];
        next.push({ x: 0.75 * a.x + 0.25 * b.x, y: 0.75 * a.y + 0.25 * b.y });
        next.push({ x: 0.25 * a.x + 0.75 * b.x, y: 0.25 * a.y + 0.75 * b.y });
      }
      next.push(out[out.length - 1]);
      out = next;
    }
    return out;
  }

  // ---------------------------------------------------------------------------
  // Geometric traits used by the interpretation layer (วัดจากเส้นที่ตรวจพบจริง)
  // ---------------------------------------------------------------------------
  function lineTraits(key, line) {
    if (!line || !line.detected || line.uv.length < 2) return { detected: false };
    const a = line.uv[0], b = line.uv[line.uv.length - 1];
    const chord = Math.hypot(b.u - a.u, b.v - a.v) || 1e-6;
    let maxDev = 0;
    for (const p of line.uv) {
      const d = Math.abs((b.v - a.v) * p.u - (b.u - a.u) * p.v + b.u * a.v - b.v * a.u) / chord;
      if (d > maxDev) maxDev = d;
    }
    const t = { detected: true, start: a, end: b, curvature: Number((maxDev / chord).toFixed(3)) };
    if (key === "heart") {
      // จุดปลายฝั่งนิ้วชี้: u สูงสุด
      const tip = line.uv.reduce((m, p) => (p.u > m.u ? p : m), line.uv[0]);
      t.endTarget = tip.u >= 0.8 ? "jupiter" : (tip.u >= 0.7 ? "between" : "saturn");
      t.tip = tip;
    } else if (key === "head") {
      const thumbEnd = a.u > b.u ? a : b, outerEnd = a.u > b.u ? b : a;
      t.drop = Number((thumbEnd.v - outerEnd.v).toFixed(3));
      t.slope = t.drop > 0.16 ? "curved_moon" : "straight";
    } else if (key === "life") {
      const low = a.v < b.v ? a : b;
      t.reachesWrist = low.v < 0.22;
      t.arc = t.curvature > 0.12 ? "wide" : (t.curvature > 0.06 ? "moderate" : "narrow");
    } else if (key === "fate") {
      const low = a.v < b.v ? a : b;
      t.origin = low.v < 0.15 ? "wrist" : (low.u < 0.42 ? "moon" : "life");
    }
    return t;
  }

  return {
    analyzePalm,
    lineTraits,
    buildFrame,
    estimateLandmarksFromSkin,
    detectHandedness,
    skinMask,
    LINE_TEMPLATES,
    MOUNT_UV
  };
});
