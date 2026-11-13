/**
 * PalmMediaPipe — ตัวช่วยโหลดและรัน MediaPipe HandLandmarker บนเบราว์เซอร์แบบ Lazy-load
 * หากออฟไลน์หรือโหลดโมเดลไม่ทัน ระบบจะ fallback ไปใช้ PalmVision (skin-geometry) โดยอัตโนมัติ
 */
(function (root) {
  "use strict";

  const MP_VER = "0.10.18";
  const BUNDLE_URL = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MP_VER}/vision_bundle.mjs`;
  const WASM_URL = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MP_VER}/wasm`;
  const MODEL_URL = "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task";

  let landmarker = null;
  let loadPromise = null;
  let status = "idle"; // idle | loading | ready | unavailable

  async function initLandmarker() {
    if (landmarker) return landmarker;
    if (loadPromise) return loadPromise;

    status = "loading";
    loadPromise = (async () => {
      try {
        const visionMod = await import(BUNDLE_URL);
        const { FilesetResolver, HandLandmarker } = visionMod;
        const fileset = await FilesetResolver.forVisionTasks(WASM_URL);

        const baseOpts = { modelAssetPath: MODEL_URL };
        const opts = {
          runningMode: "IMAGE",
          numHands: 1,
          minHandDetectionConfidence: 0.45,
          minHandPresenceConfidence: 0.45,
          minTrackingConfidence: 0.45
        };

        try {
          landmarker = await HandLandmarker.createFromOptions(fileset, {
            ...opts,
            baseOptions: { ...baseOpts, delegate: "GPU" }
          });
        } catch (_) {
          // อุปกรณ์บางรุ่นไม่รองรับ WebGL delegate ให้ถอยไปใช้ CPU โดยอัตโนมัติ
          landmarker = await HandLandmarker.createFromOptions(fileset, {
            ...opts,
            baseOptions: { ...baseOpts, delegate: "CPU" }
          });
        }
        status = "ready";
        return landmarker;
      } catch (err) {
        console.warn("[PalmMediaPipe] fallback to offline vision:", err && err.message ? err.message : err);
        status = "unavailable";
        loadPromise = null;
        return null;
      }
    })();

    return loadPromise;
  }

  function withTimeout(promise, ms) {
    let timer;
    return Promise.race([
      promise,
      new Promise((resolve) => {
        timer = setTimeout(() => resolve(null), ms);
      })
    ]).finally(() => clearTimeout(timer));
  }

  /**
   * ตรวจจับจุดกระดูกฝ่ามือ 21 จุดจาก canvas/image/video ในพิกัด pixel (w x h)
   * @param {HTMLCanvasElement|HTMLImageElement} source
   * @param {number} w
   * @param {number} h
   * @param {number} timeoutMs
   */
  async function detectFromCanvas(source, w, h, timeoutMs = 5500) {
    if (status === "unavailable") return null;
    const lmModel = landmarker || await withTimeout(initLandmarker(), timeoutMs);
    if (!lmModel) return null;

    try {
      const res = lmModel.detect(source);
      if (!res || !res.landmarks || !res.landmarks.length) return null;

      const pts = res.landmarks[0].map((p) => ({
        x: p.x * w,
        y: p.y * h,
        z: p.z || 0
      }));
      const rawHand = res.handednesses && res.handednesses[0] && res.handednesses[0][0];
      return {
        landmarks: pts,
        worldLandmarks: (res.worldLandmarks && res.worldLandmarks[0]) || null,
        rawHandedness: rawHand ? String(rawHand.categoryName || "").toLowerCase() : null,
        score: rawHand && typeof rawHand.score === "number" ? rawHand.score : 0.9
      };
    } catch (err) {
      console.warn("[PalmMediaPipe] detect error:", err && err.message ? err.message : err);
      return null;
    }
  }

  root.PalmMediaPipe = {
    warmup() {
      if (status === "idle") initLandmarker();
    },
    detectFromCanvas,
    isReady() {
      return status === "ready" && Boolean(landmarker);
    },
    getStatus() {
      return status;
    }
  };
})(typeof window !== "undefined" ? window : globalThis);
