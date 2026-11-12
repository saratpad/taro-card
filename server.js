/**
 * เซียมซีทาโรต์ (SiamSi Tarot) - Backend API & Static Web Server (Zero-Dependency Node.js)
 * รองรับ 3 แพ็กเกจสำหรับรับงาน Fastwork (ให้ลูกค้ากดดูเอง):
 * 1. แพ็กเกจ 1 (tarot)  : ดูดวงไพ่ทาโรต์ 3 ใบ (1 ครั้ง)
 * 2. แพ็กเกจ 2 (siamsi) : เสี่ยงเซียมซี (1 ครั้ง)
 * 3. แพ็กเกจ 3 (combo)  : ดูดวงไพ่ทาโรต์ + เสี่ยงเซียมซี (โค้ดพิเศษเลือกบริการตอนแรก ใช้ดูได้อย่างละ 1 ครั้ง)
 */

const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

const PORT = process.env.PORT || 3000;
const ROOT_DIR = __dirname;
const DATA_DIR = path.join(ROOT_DIR, "data");
const DB_FILE = path.join(DATA_DIR, "codes-db.json");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

function ensureDb() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;
    const initialData = {
      codes: [
        {
          code: "TAROT99",
          customerName: "",
          fastworkOrder: "FW-PACK1",
          mode: "tarot",
          lockedCategory: "",
          createdAt: now,
          expiresAt: now + oneDayMs,
          maxDraws: 1,
          drawCount: 0,
          tarotDrawCount: 0,
          siamsiDrawCount: 0,
          status: "unused",
          logs: {
            firstAccessedAt: null,
            lastAccessedAt: null,
            accessCount: 0,
            drawnAt: null,
            tarotDrawnAt: null,
            siamsiDrawnAt: null,
            sharedAt: null,
            shareCount: 0,
            pdfDownloadedAt: null,
            pdfDownloadCount: 0
          },
          readingResult: null,
          tarotResult: null,
          siamsiResult: null,
          events: [
            { time: now, type: "created", detail: "สร้างโค้ด แพ็กเกจ 1: ดูดวงไพ่ทาโรต์ 3 ใบ (1 ครั้ง / อายุ 24 ชม.)" }
          ]
        },
        {
          code: "SIAMSI99",
          customerName: "",
          fastworkOrder: "FW-PACK2",
          mode: "siamsi",
          lockedCategory: "",
          createdAt: now,
          expiresAt: now + oneDayMs,
          maxDraws: 1,
          drawCount: 0,
          tarotDrawCount: 0,
          siamsiDrawCount: 0,
          status: "unused",
          logs: {
            firstAccessedAt: null,
            lastAccessedAt: null,
            accessCount: 0,
            drawnAt: null,
            tarotDrawnAt: null,
            siamsiDrawnAt: null,
            sharedAt: null,
            shareCount: 0,
            pdfDownloadedAt: null,
            pdfDownloadCount: 0
          },
          readingResult: null,
          tarotResult: null,
          siamsiResult: null,
          events: [
            { time: now, type: "created", detail: "สร้างโค้ด แพ็กเกจ 2: เสี่ยงเซียมซี (1 ครั้ง / อายุ 24 ชม.)" }
          ]
        },
        {
          code: "COMBO99",
          customerName: "",
          fastworkOrder: "FW-PACK3",
          mode: "combo",
          lockedCategory: "",
          createdAt: now,
          expiresAt: now + oneDayMs,
          maxDraws: 2,
          drawCount: 0,
          tarotDrawCount: 0,
          siamsiDrawCount: 0,
          status: "unused",
          logs: {
            firstAccessedAt: null,
            lastAccessedAt: null,
            accessCount: 0,
            drawnAt: null,
            tarotDrawnAt: null,
            siamsiDrawnAt: null,
            sharedAt: null,
            shareCount: 0,
            pdfDownloadedAt: null,
            pdfDownloadCount: 0
          },
          readingResult: null,
          tarotResult: null,
          siamsiResult: null,
          events: [
            { time: now, type: "created", detail: "สร้างโค้ดพิเศษ แพ็กเกจ 3: ดูดวงไพ่ทาโรต์ + เสี่ยงเซียมซี (อย่างละ 1 ครั้ง / อายุ 24 ชม.)" }
          ]
        }
      ]
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), "utf8");
  }
}

function readDb() {
  ensureDb();
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
  } catch (e) {
    return { codes: [] };
  }
}

function writeDb(data) {
  ensureDb();
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  });
  res.end(JSON.stringify(payload));
}

function parseBody(req) {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", chunk => { body += chunk; });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        resolve({});
      }
    });
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    return sendJson(res, 200, { ok: true });
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const pathname = decodeURIComponent(parsedUrl.pathname);

  if (pathname === "/api/codes" && req.method === "GET") {
    const db = readDb();
    return sendJson(res, 200, { codes: db.codes });
  }

  // Admin Passcode Endpoints
  if (pathname === "/api/admin-passcode" && req.method === "GET") {
    const db = readDb();
    const pass = (db.adminPasscode && typeof db.adminPasscode === "string" && db.adminPasscode !== "undefined")
      ? db.adminPasscode.trim().toUpperCase()
      : "ADMIN99";
    return sendJson(res, 200, { passcode: pass });
  }

  if (pathname === "/api/admin-passcode" && req.method === "POST") {
    const body = await parseBody(req);
    const raw = (body && body.passcode !== undefined && body.passcode !== null)
      ? String(body.passcode).trim()
      : "";
    const clean = (raw && raw.toLowerCase() !== "undefined" && raw.toLowerCase() !== "null")
      ? raw.toUpperCase()
      : "ADMIN99";
    const db = readDb();
    db.adminPasscode = clean;
    writeDb(db);
    return sendJson(res, 200, { ok: true, passcode: clean });
  }

  // RAG Knowledge Base Endpoints (NotebookLM Summaries)
  if (pathname === "/api/rag-docs" && req.method === "GET") {
    const db = readDb();
    return sendJson(res, 200, { docs: db.ragDocs || [] });
  }

  if (pathname === "/api/rag-docs" && req.method === "POST") {
    const body = await parseBody(req);
    const db = readDb();
    db.ragDocs = Array.isArray(db.ragDocs) ? db.ragDocs : [];
    if (body && body.id) {
      db.ragDocs = db.ragDocs.filter(d => d.id !== body.id);
      db.ragDocs.unshift(body);
      writeDb(db);
    }
    return sendJson(res, 201, { doc: body });
  }

  const ragDelMatch = pathname.match(/^\/api\/rag-docs\/([^/]+)$/);
  if (ragDelMatch && req.method === "DELETE") {
    const docId = ragDelMatch[1];
    const db = readDb();
    db.ragDocs = (db.ragDocs || []).filter(d => d.id !== docId);
    writeDb(db);
    return sendJson(res, 200, { deleted: true });
  }

  // Social Auto-Post Endpoint
  if (pathname === "/api/social/post" && req.method === "POST") {
    const body = await parseBody(req);
    const db = readDb();
    db.socialPosts = Array.isArray(db.socialPosts) ? db.socialPosts : [];
    const postRecord = {
      postId: `sp_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      platform: String(body.platform || "facebook"),
      account: String(body.account || ""),
      privacy: String(body.privacy || "public"),
      code: String(body.code || ""),
      mode: String(body.mode || "tarot"),
      shareUrl: String(body.shareUrl || ""),
      postedAt: Date.now()
    };
    db.socialPosts.unshift(postRecord);
    if (db.socialPosts.length > 200) db.socialPosts.length = 200;
    writeDb(db);
    return sendJson(res, 200, { ok: true, post: postRecord });
  }

  if (pathname === "/api/codes" && req.method === "POST") {
    const body = await parseBody(req);
    if (!body || !body.code) {
      return sendJson(res, 400, { error: "กรุณาระบุรหัสโค้ด" });
    }
    const db = readDb();
    const cleanCode = String(body.code).trim().toUpperCase();
    if (db.codes.some(c => c.code.toUpperCase() === cleanCode)) {
      return sendJson(res, 409, { error: "รหัสโค้ดนี้มีอยู่ในระบบแล้ว กรุณาใช้รหัสอื่น" });
    }
    body.code = cleanCode;
    delete body.customerName;
    db.codes.unshift(body);
    writeDb(db);
    return sendJson(res, 201, { codeObj: body });
  }

  const codeMatch = pathname.match(/^\/api\/codes\/([^/]+)(?:\/(draw|log))?$/);
  if (codeMatch) {
    const targetCode = codeMatch[1].trim().toUpperCase();
    const subAction = codeMatch[2] || "";
    const db = readDb();
    const idx = db.codes.findIndex(c => c.code.toUpperCase() === targetCode);

    if (idx === -1) {
      return sendJson(res, 404, { error: "ไม่พบรหัสโค้ดนี้ในระบบ" });
    }

    const codeObj = db.codes[idx];
    const now = Date.now();

    if (req.method === "GET" && !subAction) {
      const recordAccess = parsedUrl.searchParams.get("access") !== "0";
      if (now > codeObj.expiresAt) {
        codeObj.status = "expired";
      } else if (recordAccess) {
        if (!codeObj.logs.firstAccessedAt) codeObj.logs.firstAccessedAt = now;
        codeObj.logs.lastAccessedAt = now;
        codeObj.logs.accessCount = (codeObj.logs.accessCount || 0) + 1;
        if (codeObj.status === "unused") codeObj.status = "accessed";
        codeObj.events = codeObj.events || [];
        codeObj.events.unshift({
          time: now,
          type: "accessed",
          detail: `ลูกค้าเข้าสู่ระบบด้วยโค้ด (ครั้งที่ ${codeObj.logs.accessCount})`
        });
      }
      writeDb(db);
      return sendJson(res, 200, { codeObj });
    }

    if (req.method === "POST" && subAction === "draw") {
      const body = await parseBody(req);
      const readingResult = body.readingResult;
      if (readingResult) {
        let detail = "";
        if (readingResult.mode === "tarot") {
          codeObj.tarotDrawCount = (codeObj.tarotDrawCount || 0) + 1;
          codeObj.tarotResult = readingResult;
          codeObj.logs.tarotDrawnAt = now;
          const cNames = (readingResult.cards || []).map(c => `${c.name_th}${c.isReversed ? " (กลับหัว)" : ""}`).join(", ");
          detail = `ลูกค้าเปิดไพ่ทาโรต์ 3 ใบ หมวด${readingResult.categoryName || readingResult.category}: ${cNames}`;
        } else {
          codeObj.siamsiDrawCount = (codeObj.siamsiDrawCount || 0) + 1;
          codeObj.siamsiResult = readingResult;
          codeObj.logs.siamsiDrawnAt = now;
          detail = `ลูกค้าเสี่ยงเซียมซี ได้เบอร์ ${readingResult.signNumber} (${readingResult.signTitle || ""})`;
        }

        codeObj.drawCount = (codeObj.tarotDrawCount || 0) + (codeObj.siamsiDrawCount || 0);
        codeObj.status = "drawn";
        codeObj.logs.drawnAt = now;
        codeObj.readingResult = readingResult;

        codeObj.events = codeObj.events || [];
        codeObj.events.unshift({ time: now, type: "drawn", detail });
        writeDb(db);
      }
      return sendJson(res, 200, { codeObj });
    }

    if (req.method === "POST" && subAction === "log") {
      const body = await parseBody(req);
      const actionType = body.actionType;
      const extraDetail = body.extraDetail || "";
      codeObj.events = codeObj.events || [];

      if (actionType === "share") {
        codeObj.logs.sharedAt = now;
        codeObj.logs.shareCount = (codeObj.logs.shareCount || 0) + 1;
        codeObj.events.unshift({
          time: now,
          type: "shared",
          detail: extraDetail || `แชร์ผลคำทำนายไปยังโซเชียล (ครั้งที่ ${codeObj.logs.shareCount})`
        });
      } else if (actionType === "pdf") {
        codeObj.logs.pdfDownloadedAt = now;
        codeObj.logs.pdfDownloadCount = (codeObj.logs.pdfDownloadCount || 0) + 1;
        codeObj.events.unshift({
          time: now,
          type: "pdf",
          detail: extraDetail || `ดาวน์โหลดไฟล์ PDF คำทำนาย (ครั้งที่ ${codeObj.logs.pdfDownloadCount})`
        });
      }
      writeDb(db);
      return sendJson(res, 200, { codeObj });
    }

    if (req.method === "PATCH" && !subAction) {
      const body = await parseBody(req);
      if (body.action === "reset_draw") {
        codeObj.drawCount = 0;
        codeObj.tarotDrawCount = 0;
        codeObj.siamsiDrawCount = 0;
        codeObj.status = codeObj.logs.accessCount > 0 ? "accessed" : "unused";
        codeObj.readingResult = null;
        codeObj.tarotResult = null;
        codeObj.siamsiResult = null;
        codeObj.logs.drawnAt = null;
        codeObj.logs.tarotDrawnAt = null;
        codeObj.logs.siamsiDrawnAt = null;
        codeObj.events.unshift({
          time: now,
          type: "admin_reset",
          detail: "แอดมินรีเซ็ตสิทธิ์การดูดวงใหม่ทั้งหมดของโค้ดนี้"
        });
      } else if (body.action === "extend_1day") {
        const baseTime = Math.max(now, codeObj.expiresAt || now);
        codeObj.expiresAt = baseTime + 24 * 60 * 60 * 1000;
        if (codeObj.status === "expired") {
          codeObj.status = codeObj.drawCount > 0 ? "drawn" : "unused";
        }
        codeObj.events.unshift({
          time: now,
          type: "admin_extend",
          detail: "แอดมินต่ออายุโค้ดเพิ่มอีก 1 วัน (24 ชั่วโมง)"
        });
      }
      writeDb(db);
      return sendJson(res, 200, { codeObj });
    }

    if (req.method === "DELETE" && !subAction) {
      db.codes.splice(idx, 1);
      writeDb(db);
      return sendJson(res, 200, { deleted: true });
    }
  }

  let safeRelPath = pathname === "/" ? "/index.html" : pathname;
  const filePath = path.normalize(path.join(ROOT_DIR, safeRelPath));

  if (!filePath.startsWith(ROOT_DIR)) {
    res.writeHead(403);
    return res.end("Forbidden");
  }

  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      return res.end("404 Not Found");
    }
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  ensureDb();
  console.log(`=============================================================`);
  console.log(`🔮 เซียมซีทาโรต์ (SiamSi Tarot) Server Running!`);
  console.log(`👉 หน้าดูดวงสำหรับลูกค้า : http://localhost:${PORT}`);
  console.log(`⚙️ หน้าจัดการหลังบ้าน Admin: http://localhost:${PORT}/admin.html`);
  console.log(`=============================================================`);
});
