/**
 * Mini ISO/IEC 18004 QR Code Matrix Encoder (Zero-Dependency, Offline Canvas Safe)
 * Supports Byte mode at Error Correction Level M (Versions 1-10, up to 213 UTF-8 bytes).
 */
(function (global) {
  "use strict";

  const GF_EXP = new Uint8Array(512);
  const GF_LOG = new Uint8Array(256);
  (function initGalois() {
    let x = 1;
    for (let i = 0; i < 255; i++) {
      GF_EXP[i] = x;
      GF_LOG[x] = i;
      x <<= 1;
      if (x & 0x100) x ^= 0x11d;
    }
    for (let i = 255; i < 512; i++) GF_EXP[i] = GF_EXP[i - 255];
  })();

  function gfMul(a, b) {
    if (a === 0 || b === 0) return 0;
    return GF_EXP[GF_LOG[a] + GF_LOG[b]];
  }

  function rsGeneratorPoly(ecLen) {
    let poly = [1];
    for (let i = 0; i < ecLen; i++) {
      const factor = [1, GF_EXP[i]];
      const next = new Array(poly.length + 1).fill(0);
      for (let j = 0; j < poly.length; j++) {
        next[j] ^= gfMul(poly[j], factor[0]);
        next[j + 1] ^= gfMul(poly[j], factor[1]);
      }
      poly = next;
    }
    return poly;
  }

  function rsComputeRemainder(data, ecLen) {
    const gen = rsGeneratorPoly(ecLen);
    const res = new Array(ecLen).fill(0);
    for (let i = 0; i < data.length; i++) {
      const factor = data[i] ^ res[0];
      res.shift();
      res.push(0);
      if (factor !== 0) {
        for (let j = 0; j < ecLen; j++) {
          res[j] ^= gfMul(gen[j + 1], factor);
        }
      }
    }
    return res;
  }

  // ISO-18004 Level M (Format indicator 00) Versions 1..10
  const VERSION_SPECS_M = [
    null,
    { size: 21, totalBytes: 26, dataBytes: 16, ecPerBlock: 10, g1Count: 1, g1Data: 16, g2Count: 0, g2Data: 0, align: [] },
    { size: 25, totalBytes: 44, dataBytes: 28, ecPerBlock: 16, g1Count: 1, g1Data: 28, g2Count: 0, g2Data: 0, align: [6, 18] },
    { size: 29, totalBytes: 70, dataBytes: 44, ecPerBlock: 26, g1Count: 1, g1Data: 44, g2Count: 0, g2Data: 0, align: [6, 22] },
    { size: 33, totalBytes: 100, dataBytes: 64, ecPerBlock: 18, g1Count: 2, g1Data: 32, g2Count: 0, g2Data: 0, align: [6, 26] },
    { size: 37, totalBytes: 134, dataBytes: 86, ecPerBlock: 24, g1Count: 2, g1Data: 43, g2Count: 0, g2Data: 0, align: [6, 30] },
    { size: 41, totalBytes: 172, dataBytes: 108, ecPerBlock: 16, g1Count: 4, g1Data: 27, g2Count: 0, g2Data: 0, align: [6, 34] },
    { size: 45, totalBytes: 196, dataBytes: 124, ecPerBlock: 18, g1Count: 4, g1Data: 31, g2Count: 0, g2Data: 0, align: [6, 22, 38] },
    { size: 49, totalBytes: 242, dataBytes: 154, ecPerBlock: 22, g1Count: 2, g1Data: 38, g2Count: 2, g2Data: 39, align: [6, 24, 42] },
    { size: 53, totalBytes: 292, dataBytes: 182, ecPerBlock: 22, g1Count: 3, g1Data: 36, g2Count: 2, g2Data: 37, align: [6, 26, 46] },
    { size: 57, totalBytes: 346, dataBytes: 216, ecPerBlock: 26, g1Count: 4, g1Data: 43, g2Count: 1, g2Data: 44, align: [6, 28, 50] }
  ];

  function encodeUtf8Bytes(str) {
    if (typeof TextEncoder !== "undefined") {
      return Array.from(new TextEncoder().encode(String(str)));
    }
    const raw = unescape(encodeURIComponent(String(str)));
    const arr = [];
    for (let i = 0; i < raw.length; i++) arr.push(raw.charCodeAt(i));
    return arr;
  }

  function pickVersionM(byteLen) {
    for (let v = 1; v < VERSION_SPECS_M.length; v++) {
      const spec = VERSION_SPECS_M[v];
      const charCountBits = v >= 10 ? 16 : 8;
      const cap = Math.floor((spec.dataBytes * 8 - 4 - charCountBits) / 8);
      if (byteLen <= cap) return v;
    }
    return 10;
  }

  function buildCodewords(bytes, version) {
    const spec = VERSION_SPECS_M[version];
    const bits = [];
    const pushBits = (val, len) => {
      for (let i = len - 1; i >= 0; i--) bits.push((val >>> i) & 1);
    };

    const charCountBits = version >= 10 ? 16 : 8;
    const maxDataBytes = Math.floor((spec.dataBytes * 8 - 4 - charCountBits) / 8);
    const trimmed = bytes.slice(0, maxDataBytes);

    pushBits(0b0100, 4); // Byte mode
    pushBits(trimmed.length, charCountBits);
    for (const b of trimmed) pushBits(b, 8);

    const targetBits = spec.dataBytes * 8;
    const termLen = Math.min(4, targetBits - bits.length);
    for (let i = 0; i < termLen; i++) bits.push(0);
    while (bits.length % 8 !== 0) bits.push(0);

    const padBytes = [0xec, 0x11];
    let padIdx = 0;
    while (bits.length < targetBits) {
      pushBits(padBytes[padIdx % 2], 8);
      padIdx++;
    }

    const dataCodewords = [];
    for (let i = 0; i < bits.length; i += 8) {
      let byteVal = 0;
      for (let j = 0; j < 8; j++) byteVal = (byteVal << 1) | bits[i + j];
      dataCodewords.push(byteVal);
    }

    const dataBlocks = [];
    const ecBlocks = [];
    let offset = 0;
    for (let i = 0; i < spec.g1Count; i++) {
      const blk = dataCodewords.slice(offset, offset + spec.g1Data);
      offset += spec.g1Data;
      dataBlocks.push(blk);
      ecBlocks.push(rsComputeRemainder(blk, spec.ecPerBlock));
    }
    for (let i = 0; i < spec.g2Count; i++) {
      const blk = dataCodewords.slice(offset, offset + spec.g2Data);
      offset += spec.g2Data;
      dataBlocks.push(blk);
      ecBlocks.push(rsComputeRemainder(blk, spec.ecPerBlock));
    }

    const interleaved = [];
    const maxDataLen = Math.max(spec.g1Data, spec.g2Data);
    for (let i = 0; i < maxDataLen; i++) {
      for (const blk of dataBlocks) {
        if (i < blk.length) interleaved.push(blk[i]);
      }
    }
    for (let i = 0; i < spec.ecPerBlock; i++) {
      for (const ec of ecBlocks) interleaved.push(ec[i]);
    }
    return interleaved;
  }

  function calcBch(val, poly, shiftBits, mask) {
    let d = val << shiftBits;
    const polyBits = Math.floor(Math.log2(poly)) + 1;
    while (d !== 0 && Math.floor(Math.log2(d)) + 1 >= polyBits) {
      d ^= poly << (Math.floor(Math.log2(d)) + 1 - polyBits);
    }
    return ((val << shiftBits) | d) ^ mask;
  }

  function createEmptyMatrix(size) {
    const modules = Array.from({ length: size }, () => new Array(size).fill(null));
    const reserved = Array.from({ length: size }, () => new Array(size).fill(false));
    return { modules, reserved, size };
  }

  function placeFinder(mat, r0, c0) {
    const { modules, reserved, size } = mat;
    for (let dr = -1; dr <= 7; dr++) {
      for (let dc = -1; dc <= 7; dc++) {
        const r = r0 + dr;
        const c = c0 + dc;
        if (r < 0 || r >= size || c < 0 || c >= size) continue;
        const isDark =
          dr >= 0 && dr <= 6 && dc >= 0 && dc <= 6 &&
          (dr === 0 || dr === 6 || dc === 0 || dc === 6 || (dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4));
        modules[r][c] = isDark ? 1 : 0;
        reserved[r][c] = true;
      }
    }
  }

  function placeAlignment(mat, rCenter, cCenter) {
    const { modules, reserved } = mat;
    for (let dr = -2; dr <= 2; dr++) {
      for (let dc = -2; dc <= 2; dc++) {
        if (reserved[rCenter + dr][cCenter + dc]) return;
      }
    }
    for (let dr = -2; dr <= 2; dr++) {
      for (let dc = -2; dc <= 2; dc++) {
        const isDark = Math.abs(dr) === 2 || Math.abs(dc) === 2 || (dr === 0 && dc === 0);
        modules[rCenter + dr][cCenter + dc] = isDark ? 1 : 0;
        reserved[rCenter + dr][cCenter + dc] = true;
      }
    }
  }

  function reserveFormatAndVersion(mat, version) {
    const { modules, reserved, size } = mat;
    for (let i = 0; i <= 8; i++) {
      if (i !== 6) {
        reserved[8][i] = true;
        reserved[i][8] = true;
      }
    }
    for (let i = size - 8; i < size; i++) {
      reserved[8][i] = true;
      reserved[i][8] = true;
    }
    modules[size - 8][8] = 1; // Dark module
    reserved[size - 8][8] = true;

    if (version >= 7) {
      const verBits = calcBch(version, 0x1f25, 12, 0);
      for (let i = 0; i < 18; i++) {
        const bit = (verBits >>> i) & 1;
        const a = Math.floor(i / 3);
        const b = size - 11 + (i % 3);
        modules[a][b] = bit;
        reserved[a][b] = true;
        modules[b][a] = bit;
        reserved[b][a] = true;
      }
    }
  }

  function writeFormatBits(mat, maskPattern) {
    const { modules, size } = mat;
    const fmt = calcBch((0b00 << 3) | maskPattern, 0x537, 10, 0x5412); // M = 00
    // Bit 14 (MSB) .. Bit 0 (LSB) per ISO/IEC 18004 Section 7.9
    for (let i = 0; i <= 5; i++) {
      modules[8][i] = (fmt >>> (14 - i)) & 1;
      modules[i][8] = (fmt >>> i) & 1;
    }
    modules[8][7] = (fmt >>> 8) & 1;
    modules[8][8] = (fmt >>> 7) & 1;
    modules[7][8] = (fmt >>> 6) & 1;

    for (let k = 0; k <= 6; k++) {
      modules[size - 1 - k][8] = (fmt >>> (14 - k)) & 1;
    }
    for (let k = 0; k <= 7; k++) {
      modules[8][size - 8 + k] = (fmt >>> (7 - k)) & 1;
    }
  }

  function applyMaskCondition(maskIdx, r, c) {
    switch (maskIdx) {
      case 0: return (r + c) % 2 === 0;
      case 1: return r % 2 === 0;
      case 2: return c % 3 === 0;
      case 3: return (r + c) % 3 === 0;
      case 4: return (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0;
      case 5: return ((r * c) % 2 + (r * c) % 3) === 0;
      case 6: return (((r * c) % 2) + ((r * c) % 3)) % 2 === 0;
      case 7: return (((r + c) % 2) + ((r * c) % 3)) % 2 === 0;
      default: return false;
    }
  }

  function penaltyScore(modules, size) {
    let score = 0;
    for (let r = 0; r < size; r++) {
      let runLen = 1;
      for (let c = 1; c < size; c++) {
        if (modules[r][c] === modules[r][c - 1]) runLen++;
        else {
          if (runLen >= 5) score += 3 + (runLen - 5);
          runLen = 1;
        }
      }
      if (runLen >= 5) score += 3 + (runLen - 5);
    }
    for (let c = 0; c < size; c++) {
      let runLen = 1;
      for (let r = 1; r < size; r++) {
        if (modules[r][c] === modules[r - 1][c]) runLen++;
        else {
          if (runLen >= 5) score += 3 + (runLen - 5);
          runLen = 1;
        }
      }
      if (runLen >= 5) score += 3 + (runLen - 5);
    }
    for (let r = 0; r < size - 1; r++) {
      for (let c = 0; c < size - 1; c++) {
        const v = modules[r][c];
        if (v === modules[r][c + 1] && v === modules[r + 1][c] && v === modules[r + 1][c + 1]) {
          score += 3;
        }
      }
    }
    let dark = 0;
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (modules[r][c]) dark++;
      }
    }
    const pct = (dark * 100) / (size * size);
    score += Math.floor(Math.abs(pct - 50) / 5) * 10;
    return score;
  }

  function encodeQRMatrix(text) {
    const bytes = encodeUtf8Bytes(text || "https://taro-card-smoky.vercel.app/");
    const version = pickVersionM(bytes.length);
    const spec = VERSION_SPECS_M[version];
    const codewords = buildCodewords(bytes, version);

    const base = createEmptyMatrix(spec.size);
    placeFinder(base, 0, 0);
    placeFinder(base, 0, spec.size - 7);
    placeFinder(base, spec.size - 7, 0);

    for (let i = 8; i < spec.size - 8; i++) {
      const bit = i % 2 === 0 ? 1 : 0;
      base.modules[6][i] = bit;
      base.reserved[6][i] = true;
      base.modules[i][6] = bit;
      base.reserved[i][6] = true;
    }

    for (const r of spec.align) {
      for (const c of spec.align) {
        placeAlignment(base, r, c);
      }
    }

    reserveFormatAndVersion(base, version);

    // Place codeword bits in zigzag order
    let bitIndex = 0;
    const totalBits = codewords.length * 8;
    let upward = true;
    for (let rightCol = spec.size - 1; rightCol >= 1; rightCol -= 2) {
      if (rightCol === 6) rightCol--;
      for (let step = 0; step < spec.size; step++) {
        const r = upward ? (spec.size - 1 - step) : step;
        for (let dx = 0; dx < 2; dx++) {
          const c = rightCol - dx;
          if (base.reserved[r][c]) continue;
          let bit = 0;
          if (bitIndex < totalBits) {
            const byteVal = codewords[bitIndex >> 3];
            bit = (byteVal >>> (7 - (bitIndex & 7))) & 1;
            bitIndex++;
          }
          base.modules[r][c] = bit;
        }
      }
      upward = !upward;
    }

    let bestMask = 0;
    let bestScore = Infinity;
    let bestModules = null;
    for (let m = 0; m < 8; m++) {
      const trial = {
        size: spec.size,
        reserved: base.reserved,
        modules: base.modules.map((row) => row.slice())
      };
      for (let r = 0; r < spec.size; r++) {
        for (let c = 0; c < spec.size; c++) {
          if (!trial.reserved[r][c] && applyMaskCondition(m, r, c)) {
            trial.modules[r][c] ^= 1;
          }
        }
      }
      writeFormatBits(trial, m);
      const s = penaltyScore(trial.modules, spec.size);
      if (s < bestScore) {
        bestScore = s;
        bestMask = m;
        bestModules = trial.modules;
      }
    }

    return {
      version,
      mask: bestMask,
      size: spec.size,
      modules: bestModules
    };
  }

  function drawQRToCanvas(ctx, text, x, y, drawSize, options = {}) {
    const qr = encodeQRMatrix(text);
    const quietModules = typeof options.quiet === "number" ? options.quiet : 4;
    const totalModules = qr.size + quietModules * 2;
    const cell = Math.max(2, Math.floor(drawSize / totalModules));
    const gridPx = cell * qr.size;
    const offset = Math.floor((drawSize - gridPx) / 2);
    const bg = options.background || "#ffffff";
    const fg = options.foreground || "#0a1026";
    const radius = typeof options.radius === "number" ? options.radius : 12;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + drawSize - radius, y);
    ctx.quadraticCurveTo(x + drawSize, y, x + drawSize, y + radius);
    ctx.lineTo(x + drawSize, y + drawSize - radius);
    ctx.quadraticCurveTo(x + drawSize, y + drawSize, x + drawSize - radius, y + drawSize);
    ctx.lineTo(x + radius, y + drawSize);
    ctx.quadraticCurveTo(x, y + drawSize, x, y + drawSize - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fillStyle = bg;
    ctx.fill();

    ctx.fillStyle = fg;
    for (let r = 0; r < qr.size; r++) {
      for (let c = 0; c < qr.size; c++) {
        if (qr.modules[r][c]) {
          ctx.fillRect(x + offset + c * cell, y + offset + r * cell, cell, cell);
        }
      }
    }
    ctx.restore();
    return qr;
  }

  global.MiniQR = {
    encode: encodeQRMatrix,
    drawToCanvas: drawQRToCanvas
  };
})(typeof window !== "undefined" ? window : globalThis);
