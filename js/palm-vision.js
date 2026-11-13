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
    jupiter: [0.80, 0.94],
    saturn:  [0.58, 0.96],
    sun:     [0.36, 0.94],
    mercury: [0.16, 0.86],
    venus:   [0.82, 0.36],
    moon:    [0.16, 0.28],
    mars:    [0.50, 0.56]
  };

  function computeMounts(frame, gray, ridge, roi, cw, ch, scale, minX, minY, meanLum) {
    const rad = Math.max(6, Math.round(frame.palmWidth * 0.065 * scale));
    const mounts = {};
    for (const [id, [u, v]] of Object.entries(MOUNT_UV)) {
      const pt = frame.toImg(u, v);
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
      mounts[id] = { id, x: Math.round(pt.x), y: Math.round(pt.y), u, v, fullness, status };
    }
    return mounts;
  }

  // ---------------------------------------------------------------------------
  // Line templates (ตำแหน่งตามกายวิภาคมาตรฐาน) — ใช้กำหนด corridor และทิศทางคาดหมายเท่านั้น
  // ตำแหน่งจริงมาจากร่องบนภาพ
  // ---------------------------------------------------------------------------
  const LINE_TEMPLATES = {
    life:    { poly: [[0.92, 0.74], [0.76, 0.64], [0.68, 0.44], [0.69, 0.10]], hw: 0.10, minLen: 0.30, required: true, sharedHeadLife: true },
    head:    { poly: [[0.92, 0.74], [0.66, 0.63], [0.43, 0.56], [0.10, 0.46]], hw: 0.11, minLen: 0.28, required: true, sharedHeadLife: true },
    heart:   { poly: [[0.02, 0.72], [0.34, 0.81], [0.60, 0.92], [0.78, 1.05]], hw: 0.10, minLen: 0.28, required: true },
    fate:    { poly: [[0.50, 0.06], [0.50, 0.42], [0.55, 0.80]], hw: 0.11, minLen: 0.18, required: false },
    sun:     { poly: [[0.34, 0.42], [0.34, 0.64], [0.36, 0.88]], hw: 0.075, minLen: 0.14, required: false },
    mercury: { poly: [[0.44, 0.14], [0.28, 0.44], [0.14, 0.74]], hw: 0.085, minLen: 0.16, required: false }
  };
  const TRACE_ORDER = ["heart", "head", "life", "fate", "sun", "mercury"];

  function polyInfo(poly, frame) {
    const segs = [];
    let total = 0;
    for (let i = 0; i < poly.length - 1; i++) {
      const [x1, y1] = poly[i], [x2, y2] = poly[i + 1];
      const len = Math.hypot(x2 - x1, y2 - y1);
      const p1 = frame.toImg(x1, y1), p2 = frame.toImg(x2, y2);
      const ilen = Math.hypot(p2.x - p1.x, p2.y - p1.y) || 1;
      segs.push({ x1, y1, dx: x2 - x1, dy: y2 - y1, len, start: total, tx: (p2.x - p1.x) / ilen, ty: (p2.y - p1.y) / ilen });
      total += len;
    }
    return { segs, total };
  }

  // ระยะจากจุดถึง polyline + ตำแหน่งตามแนวเส้น (0..1) + ทิศทางคาดหมายในพิกัดภาพ
  function distToPoly(info, u, v) {
    let best = Infinity, bestT = 0, bestSeg = info.segs[0];
    for (const s of info.segs) {
      let t = ((u - s.x1) * s.dx + (v - s.y1) * s.dy) / (s.len * s.len);
      t = Math.max(0, Math.min(1, t));
      const px = s.x1 + t * s.dx, py = s.y1 + t * s.dy;
      const d = Math.hypot(u - px, v - py);
      if (d < best) { best = d; bestT = (s.start + t * s.len) / info.total; bestSeg = s; }
    }
    return { d: best, t: bestT, tx: bestSeg.tx, ty: bestSeg.ty };
  }

  // ---------------------------------------------------------------------------
  // Min-heap for Dijkstra
  // ---------------------------------------------------------------------------
  class Heap {
    constructor(cap) { this.idx = new Int32Array(cap); this.key = new Float64Array(cap); this.n = 0; }
    push(i, k) {
      let p = this.n++;
      if (p >= this.idx.length) { this._grow(); }
      this.idx[p] = i; this.key[p] = k;
      while (p > 0) {
        const q = (p - 1) >> 1;
        if (this.key[q] <= this.key[p]) break;
        this._swap(p, q); p = q;
      }
    }
    pop() {
      const top = this.idx[0], topK = this.key[0];
      this.n--;
      if (this.n > 0) {
        this.idx[0] = this.idx[this.n]; this.key[0] = this.key[this.n];
        let p = 0;
        for (;;) {
          const l = 2 * p + 1, r = l + 1;
          let m = p;
          if (l < this.n && this.key[l] < this.key[m]) m = l;
          if (r < this.n && this.key[r] < this.key[m]) m = r;
          if (m === p) break;
          this._swap(p, m); p = m;
        }
      }
      this.lastKey = topK;
      return top;
    }
    _swap(a, b) {
      const ti = this.idx[a]; this.idx[a] = this.idx[b]; this.idx[b] = ti;
      const tk = this.key[a]; this.key[a] = this.key[b]; this.key[b] = tk;
    }
    _grow() {
      const ni = new Int32Array(this.idx.length * 2); ni.set(this.idx); this.idx = ni;
      const nk = new Float64Array(this.key.length * 2); nk.set(this.key); this.key = nk;
    }
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
    for (const [u, v] of [[-0.08, -0.06], [1.08, -0.06], [-0.08, 1.08], [1.08, 1.08], [1.12, 0.4], [-0.1, 0.5]]) {
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
          acc += wt * (0.22 * rgba[p] + 0.66 * rgba[p + 1] + 0.12 * rgba[p + 2]);
        }
        const i = y * cw + x;
        gray[i] = acc;
        skinC[i] = skin.mask[Math.round(oy) * w + Math.round(ox)] || 0;
        const uv = frame.toUV(ox, oy);
        U[i] = uv.u; V[i] = uv.v;
      }
    }

    // --- 3. ROI: ฝ่ามือ (ไม่รวมนิ้ว) และห่างจากขอบมือ ---
    const edgeSigma = 7;
    const skinB = blur(skinC, cw, ch, edgeSigma);
    const roi = new Uint8Array(cw * ch);
    let roiCount = 0;
    for (let i = 0; i < roi.length; i++) {
      const inPalm = U[i] > -0.02 && U[i] < 1.04 && V[i] > -0.02 && V[i] < 1.07;
      if (inPalm && skinB[i] > 0.94) { roi[i] = 1; roiCount++; }
    }
    if (roiCount < cw * ch * 0.15) {
      return { ok: false, reason: "roi_small", message: "พื้นที่ฝ่ามือที่ตรวจเจอน้อยเกินไป กรุณาหงายฝ่ามือเข้าหากล้องให้เต็มกรอบ" };
    }

    // --- 4. Illumination normalization (Weber) + directional multi-scale Hessian ridge ---
    const bg = blur(gray, cw, ch, 18);
    const norm = new Float32Array(cw * ch);
    for (let i = 0; i < norm.length; i++) {
      norm[i] = (gray[i] - bg[i]) / Math.max(8, 0.08 * bg[i]);
    }

    const ridge = new Float32Array(cw * ch);
    const dirX = new Float32Array(cw * ch);
    const dirY = new Float32Array(cw * ch);
    const sigmas = [2.0, 3.0, 4.4];
    for (const s of sigmas) {
      const L = blur(norm, cw, ch, s);
      const s2 = s * s;
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
          const resp = s2 * l1 * Math.exp(-(rb * rb) / 0.5);
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
    const pHigh = percentile(ridge, roi, 0.985 - (sensitivity - 3) * 0.007);
    const rSpan = Math.max(1e-4, pHigh - pLow);
    const R = new Float32Array(cw * ch);
    for (let i = 0; i < R.length; i++) R[i] = roi[i] ? Math.max(0, Math.min(1, (ridge[i] - pLow) / rSpan)) : 0;

    // --- 5. Trace each principal line inside its anatomical corridor ---
    const used = new Uint8Array(cw * ch);
    const lines = {};
    for (const key of TRACE_ORDER) {
      lines[key] = traceLine(key, LINE_TEMPLATES[key], R, dirX, dirY, roi, U, V, used, cw, ch, frame, scale, toOrig);
    }

    // --- 6. Quality metrics + mounts ---
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
    const mounts = computeMounts(frame, gray, R, roi, cw, ch, scale, minX, minY, meanLum);
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

  function traceLine(key, tpl, R, dirX, dirY, roi, U, V, used, cw, ch, frame, scale, toOrig) {
    const info = polyInfo(tpl.poly, frame);
    const n = cw * ch;
    const dist = new Float64Array(n).fill(Infinity);
    const prev = new Int32Array(n).fill(-1);
    const tAt = new Float32Array(n).fill(-1);
    const dAt = new Float32Array(n);
    const effAt = new Float32Array(n);
    const heap = new Heap(4096);

    // corridor + directional weight + start set
    for (let i = 0; i < n; i++) {
      if (!roi[i]) continue;
      const { d, t, tx, ty } = distToPoly(info, U[i], V[i]);
      if (d > tpl.hw) continue;
      tAt[i] = t;
      dAt[i] = d / tpl.hw;
      const align = R[i] > 0.05 ? Math.abs(tx * dirX[i] + ty * dirY[i]) : 0.6;
      effAt[i] = R[i] * (0.20 + 0.80 * align * align);
      if (t < 0.06) {
        dist[i] = 0;
        heap.push(i, 0);
      }
    }
    const nb = [[1, 0, 1], [-1, 0, 1], [0, 1, 1], [0, -1, 1], [1, 1, Math.SQRT2], [1, -1, Math.SQRT2], [-1, 1, Math.SQRT2], [-1, -1, Math.SQRT2]];
    let endIdx = -1;
    while (heap.n) {
      const p = heap.pop();
      const dp = heap.lastKey;
      if (dp > dist[p]) continue;
      if (tAt[p] > 0.94) { endIdx = p; break; }
      const x = p % cw, y = (p / cw) | 0;
      for (const [dx, dy, len] of nb) {
        const xx = x + dx, yy = y + dy;
        if (xx < 0 || yy < 0 || xx >= cw || yy >= ch) continue;
        const q = yy * cw + xx;
        if (tAt[q] < 0) continue;
        const dd = dAt[q];
        const allowShare = tpl.sharedHeadLife && tAt[q] < 0.28;
        const c = 1 / (0.04 + effAt[q]) + 2.5 * dd * dd + (used[q] && !allowShare ? 2.5 : 0);
        const nd = dp + c * len;
        if (nd < dist[q]) { dist[q] = nd; prev[q] = p; heap.push(q, nd); }
      }
    }
    if (endIdx < 0) return emptyLine(key, tpl);

    // backtrack path (crop coords)
    const path = [];
    for (let p = endIdx; p >= 0; p = prev[p]) path.push(p);
    path.reverse();

    // smoothed directional + scalar ridge evidence along path
    const rv = path.map(p => R[p]);
    const ev = path.map(p => 0.40 * R[p] + 0.60 * effAt[p]);
    const win = 5;
    const sm = ev.map((_, i) => {
      let a = 0, c = 0;
      for (let k = Math.max(0, i - win); k <= Math.min(ev.length - 1, i + win); k++) { a += ev[k]; c++; }
      return a / c;
    });

    const TH = 0.16;
    let s0 = 0, s1 = path.length - 1;
    if (tpl.required) {
      while (s0 < s1 && sm[s0] < TH) s0++;
      while (s1 > s0 && sm[s1] < TH) s1--;
    } else {
      // เส้นรองเลือกช่วงต่อเนื่องที่เด่นชัดที่สุด เพื่อไม่โยงเกาะจุดรบกวนไกลกัน
      let bestScore = -1, bestA = 0, bestB = -1;
      let curA = -1, curScore = 0, gapCount = 0;
      for (let i = 0; i < sm.length; i++) {
        if (sm[i] >= TH) {
          if (curA < 0) { curA = i; curScore = 0; }
          curScore += sm[i];
          gapCount = 0;
          if (curScore > bestScore) { bestScore = curScore; bestA = curA; bestB = i; }
        } else if (curA >= 0) {
          gapCount++;
          if (gapCount > 8) curA = -1;
        }
      }
      if (bestB <= bestA) return emptyLine(key, tpl);
      s0 = bestA; s1 = bestB;
      while (s1 > s0 && sm[s1] < TH) s1--;
    }

    const trimmed = path.slice(s0, s1 + 1);
    const trimmedR = rv.slice(s0, s1 + 1);
    const trimmedE = ev.slice(s0, s1 + 1);
    const trimmedSm = sm.slice(s0, s1 + 1);

    // metrics
    let lenPx = 0;
    for (let i = 1; i < trimmed.length; i++) {
      const a = trimmed[i - 1], b = trimmed[i];
      lenPx += Math.hypot((a % cw) - (b % cw), ((a / cw) | 0) - ((b / cw) | 0));
    }
    const lenPalm = (lenPx / scale) / frame.palmLength; // ความยาวเทียบความยาวฝ่ามือ
    const coverage = trimmedE.length ? trimmedE.filter(v => v > 0.15).length / trimmedE.length : 0;
    const meanR = trimmedR.length ? trimmedR.reduce((a, b) => a + b, 0) / trimmedR.length : 0;
    const meanE = trimmedE.length ? trimmedE.reduce((a, b) => a + b, 0) / trimmedE.length : 0;
    let gaps = 0, inGap = 0;
    for (const v of trimmedSm) {
      if (v < 0.13) { inGap++; if (inGap === 8) gaps++; } else inGap = 0;
    }
    const covThresh = tpl.required ? 0.50 : 0.62;
    const depthThresh = tpl.required ? 0.22 : 0.30;
    const detected = trimmed.length > 8 && coverage >= covThresh && meanE >= depthThresh && lenPalm >= tpl.minLen;

    // mark pixels as used เฉพาะเส้นที่ตรวจพบจริง (dilate 2px) เพื่อไม่ให้เส้นรองมาแย่งร่องเส้นหลัก
    if (detected) {
      for (const p of trimmed) {
        const x = p % cw, y = (p / cw) | 0;
        for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) {
          const xx = x + dx, yy = y + dy;
          if (xx >= 0 && yy >= 0 && xx < cw && yy < ch) used[yy * cw + xx] = 1;
        }
      }
    }

    // points (original image coords), simplified + uv
    const ptsOrig = trimmed.map(p => toOrig(p % cw, (p / cw) | 0));
    const simplified = simplify(ptsOrig, Math.max(1.2, 1.5 / scale));
    const uvPts = simplified.map(p => frame.toUV(p.x, p.y));

    const rawConf = 100 * Math.min(1, 0.52 * coverage + 0.48 * Math.min(1, meanE / 0.52));
    const confidence = detected ? Math.round(rawConf) : Math.round(Math.min(48, rawConf * 0.55));

    return {
      id: key,
      detected,
      points: smoothPoints(simplified, 2),
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
