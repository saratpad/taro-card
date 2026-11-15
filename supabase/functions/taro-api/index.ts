import { createClient } from "npm:@supabase/supabase-js@2.49.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
};

const DEMO_CODES = new Set(["TAROT99", "SIAMSI99", "COMBO99", "PALM99"]);
const VALID_MODES = new Set(["tarot", "siamsi", "combo", "palm"]);
const VALID_DISCIPLINES = new Set(["tarot", "palm", "siamsi"]);
const ALLOWED_DISPLAY_FONTS = new Set(["prompt", "sarabun", "kanit", "noto", "ibm", "pridi"]);
const DEFAULT_ACTIVE_RAG_BOOKS = {
  tarot: "tarot_classic_rw",
  palm: "palm_thai_classical",
  siamsi: "viewer_choice",
};
const DEFAULT_DISPLAY_SETTINGS = {
  fontFamilyKey: "prompt",
  desktopFontScale: 100,
  mobileFontScale: 100,
  updatedAt: 0,
};

function getAdminClient() {
  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  let secretKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  if (!secretKey) {
    try {
      const secretKeys = JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS") ?? "{}");
      secretKey = secretKeys.default ?? (Object.values(secretKeys)[0] as string) ?? "";
    } catch (_) {
      secretKey = "";
    }
  }
  if (!supabaseUrl || !secretKey) {
    throw new Error("Missing SUPABASE_URL or service key in Edge Function environment");
  }
  return createClient(supabaseUrl, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function sendJson(status: number, payload: unknown) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

async function parseJsonBody(req: Request): Promise<Record<string, unknown>> {
  try {
    const text = await req.text();
    if (!text) return {};
    const parsed = JSON.parse(text);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (_) {
    return {};
  }
}

function normalizeLogs(raw: unknown) {
  const src = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  return {
    firstAccessedAt: src.firstAccessedAt ?? null,
    lastAccessedAt: src.lastAccessedAt ?? null,
    accessCount: Number(src.accessCount) || 0,
    drawnAt: src.drawnAt ?? null,
    tarotDrawnAt: src.tarotDrawnAt ?? null,
    siamsiDrawnAt: src.siamsiDrawnAt ?? null,
    palmDrawnAt: src.palmDrawnAt ?? null,
    palmAnalyzedAt: src.palmAnalyzedAt ?? null,
    sharedAt: src.sharedAt ?? null,
    shareCount: Number(src.shareCount) || 0,
    pdfDownloadedAt: src.pdfDownloadedAt ?? null,
    pdfDownloadCount: Number(src.pdfDownloadCount) || 0,
  };
}

function rowToCodeObj(row: Record<string, unknown>) {
  const mode = VALID_MODES.has(String(row.mode || "")) ? String(row.mode) : "tarot";
  const obj: Record<string, unknown> = {
    code: String(row.code || "").trim().toUpperCase(),
    customerName: "",
    fastworkOrder: String(row.fastwork_order || "-"),
    mode,
    lockedCategory: String(row.locked_category || ""),
    createdAt: Number(row.created_at) || Date.now(),
    expiresAt: Number(row.expires_at) || Date.now(),
    maxDraws: Number(row.max_draws) || (mode === "combo" ? 3 : 1),
    drawCount: Number(row.draw_count) || 0,
    tarotDrawCount: Number(row.tarot_draw_count) || 0,
    siamsiDrawCount: Number(row.siamsi_draw_count) || 0,
    palmDrawCount: Number(row.palm_draw_count) || 0,
    status: String(row.status || "unused"),
    logs: normalizeLogs(row.logs),
    readingResult: row.reading_result ?? null,
    tarotResult: row.tarot_result ?? null,
    siamsiResult: row.siamsi_result ?? null,
    palmResult: row.palm_result ?? null,
    events: Array.isArray(row.events) ? row.events : [],
  };
  return obj;
}

function codeObjToRow(input: Record<string, unknown>) {
  const now = Date.now();
  const mode = VALID_MODES.has(String(input.mode || "")) ? String(input.mode) : "tarot";
  const statusRaw = String(input.status || "unused");
  const status = ["unused", "accessed", "drawn", "expired"].includes(statusRaw) ? statusRaw : "unused";
  const tarotDrawCount = Math.max(0, Number(input.tarotDrawCount) || 0);
  const siamsiDrawCount = Math.max(0, Number(input.siamsiDrawCount) || 0);
  const palmDrawCount = Math.max(0, Number(input.palmDrawCount) || 0);
  const drawCount = Math.max(
    0,
    Number(input.drawCount) || (tarotDrawCount + siamsiDrawCount + palmDrawCount),
  );
  const createdAt = Number(input.createdAt) || now;
  const expiresAt = Number(input.expiresAt) || (createdAt + 24 * 60 * 60 * 1000);

  return {
    code: String(input.code || "").trim().toUpperCase(),
    fastwork_order: String(input.fastworkOrder || "-").slice(0, 120),
    mode,
    locked_category: String(input.lockedCategory || "").slice(0, 64),
    created_at: createdAt,
    expires_at: expiresAt,
    max_draws: Math.max(1, Number(input.maxDraws) || (mode === "combo" ? 3 : 1)),
    draw_count: drawCount,
    tarot_draw_count: tarotDrawCount,
    siamsi_draw_count: siamsiDrawCount,
    palm_draw_count: palmDrawCount,
    status,
    logs: normalizeLogs(input.logs),
    reading_result: input.readingResult ?? null,
    tarot_result: input.tarotResult ?? null,
    siamsi_result: input.siamsiResult ?? null,
    palm_result: input.palmResult ?? null,
    events: Array.isArray(input.events) ? input.events.slice(0, 200) : [],
    updated_at: new Date().toISOString(),
  };
}

function rowToRagDoc(row: Record<string, unknown>) {
  return {
    id: String(row.id || ""),
    title: String(row.title || ""),
    source: String(row.source || "NotebookLM Upload"),
    sourceType: String(row.source_type || row.source || "NotebookLM Upload"),
    styleTag: String(row.style_tag || ""),
    description: String(row.description || ""),
    discipline: String(row.discipline || "tarot"),
    targetScope: String(row.target_scope || row.discipline || "tarot"),
    enabledForViewer: row.enabled_for_viewer !== false,
    uploadedAt: Number(row.uploaded_at) || Date.now(),
    createdAt: Number(row.created_at) || Date.now(),
    chunks: Array.isArray(row.chunks) ? row.chunks : [],
    chunksCount: Number(row.chunks_count) || 0,
    content: String(row.content || ""),
  };
}

function normalizeActiveRagBooks(raw: unknown) {
  const src = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  return {
    tarot: typeof src.tarot === "string" && src.tarot.trim()
      ? src.tarot.trim()
      : DEFAULT_ACTIVE_RAG_BOOKS.tarot,
    palm: typeof src.palm === "string" && src.palm.trim()
      ? src.palm.trim()
      : DEFAULT_ACTIVE_RAG_BOOKS.palm,
    siamsi: "viewer_choice",
  };
}

function clampScale(val: unknown, min: number, max: number, fallback: number) {
  const n = Number(val);
  if (!Number.isFinite(n)) return fallback;
  return Math.round(Math.max(min, Math.min(max, n)));
}

function normalizeDisplaySettings(raw: unknown) {
  const src = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const fKey = String(src.fontFamilyKey || "").trim().toLowerCase();
  return {
    fontFamilyKey: ALLOWED_DISPLAY_FONTS.has(fKey) ? fKey : DEFAULT_DISPLAY_SETTINGS.fontFamilyKey,
    desktopFontScale: clampScale(src.desktopFontScale, 85, 150, DEFAULT_DISPLAY_SETTINGS.desktopFontScale),
    mobileFontScale: clampScale(src.mobileFontScale, 90, 160, DEFAULT_DISPLAY_SETTINGS.mobileFontScale),
    updatedAt: Number(src.updatedAt) || 0,
  };
}

async function getSetting(supabase: ReturnType<typeof getAdminClient>, key: string) {
  const { data } = await supabase
    .from("taro_app_settings")
    .select("value")
    .eq("setting_key", key)
    .maybeSingle();
  return data ? data.value : null;
}

async function setSetting(supabase: ReturnType<typeof getAdminClient>, key: string, value: unknown) {
  const { error } = await supabase
    .from("taro_app_settings")
    .upsert({
      setting_key: key,
      value,
      updated_at: new Date().toISOString(),
    }, { onConflict: "setting_key" });
  if (error) throw error;
}

function normalizeRoutePath(rawUrl: string) {
  const url = new URL(rawUrl);
  let rawPath = url.pathname;
  rawPath = rawPath
    .replace(/^\/functions\/v1\/taro-api/, "")
    .replace(/^\/taro-api/, "")
    .replace(/^\/api/, "");
  try {
    rawPath = decodeURIComponent(rawPath);
  } catch (_) {}
  if (!rawPath.startsWith("/")) rawPath = "/" + rawPath;
  if (rawPath.length > 1 && rawPath.endsWith("/")) rawPath = rawPath.slice(0, -1);
  return { pathname: rawPath || "/", searchParams: url.searchParams };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = getAdminClient();
    const { pathname, searchParams } = normalizeRoutePath(req.url);

    // Health check
    if (pathname === "/health" && req.method === "GET") {
      return sendJson(200, { ok: true, backend: "supabase", timestamp: Date.now() });
    }

    // -----------------------------------------------------------------------
    // 1. Admin Passcode
    // -----------------------------------------------------------------------
    if (pathname === "/admin-passcode" && req.method === "GET") {
      const val = await getSetting(supabase, "admin_passcode") as Record<string, unknown> | null;
      const raw = val && typeof val.passcode === "string" ? val.passcode.trim().toUpperCase() : "ADMIN99";
      const pass = raw && raw !== "UNDEFINED" && raw !== "NULL" ? raw : "ADMIN99";
      return sendJson(200, { passcode: pass });
    }

    if (pathname === "/admin-passcode" && req.method === "POST") {
      const body = await parseJsonBody(req);
      const raw = body.passcode !== undefined && body.passcode !== null
        ? String(body.passcode).trim()
        : "";
      const clean = raw && raw.toLowerCase() !== "undefined" && raw.toLowerCase() !== "null"
        ? raw.toUpperCase().slice(0, 64)
        : "ADMIN99";
      await setSetting(supabase, "admin_passcode", { passcode: clean });
      return sendJson(200, { ok: true, passcode: clean });
    }

    // -----------------------------------------------------------------------
    // 2. Display Typography Settings
    // -----------------------------------------------------------------------
    if (pathname === "/display-settings" && req.method === "GET") {
      const stored = await getSetting(supabase, "display_settings");
      return sendJson(200, { settings: normalizeDisplaySettings(stored) });
    }

    if (pathname === "/display-settings" && req.method === "POST") {
      const body = await parseJsonBody(req);
      const current = (await getSetting(supabase, "display_settings")) as Record<string, unknown> | null;
      const merged = normalizeDisplaySettings({
        ...(current || {}),
        ...body,
        updatedAt: Date.now(),
      });
      await setSetting(supabase, "display_settings", merged);
      return sendJson(200, { ok: true, settings: merged });
    }

    // -----------------------------------------------------------------------
    // 3. RAG Knowledge Base Docs & Active Selection
    // -----------------------------------------------------------------------
    if (pathname === "/rag-active" && req.method === "GET") {
      const stored = await getSetting(supabase, "rag_active_books");
      return sendJson(200, { activeBooks: normalizeActiveRagBooks(stored) });
    }

    if (pathname === "/rag-active" && req.method === "POST") {
      const body = await parseJsonBody(req);
      const stored = await getSetting(supabase, "rag_active_books");
      const current = normalizeActiveRagBooks(stored);

      if (body.discipline === "siamsi") {
        return sendJson(400, {
          error: "ศาสตร์เซียมซีเปิดให้ผู้ดูเลือกตำราเองได้หน้าเว็บ ไม่สามารถล็อกตำราจากหลังบ้าน",
          activeBooks: current,
        });
      }

      if ((body.discipline === "tarot" || body.discipline === "palm") && body.bookId) {
        current[body.discipline] = String(body.bookId).trim();
      } else if (body.activeBooks && typeof body.activeBooks === "object") {
        const ab = body.activeBooks as Record<string, unknown>;
        if (ab.tarot) current.tarot = String(ab.tarot).trim();
        if (ab.palm) current.palm = String(ab.palm).trim();
      }

      const normalized = normalizeActiveRagBooks(current);
      await setSetting(supabase, "rag_active_books", normalized);
      return sendJson(200, { ok: true, activeBooks: normalized });
    }

    if (pathname === "/rag-docs" && req.method === "GET") {
      const [docsRes, activeStored] = await Promise.all([
        supabase.from("taro_rag_docs").select("*").order("created_at", { ascending: false }),
        getSetting(supabase, "rag_active_books"),
      ]);
      if (docsRes.error) throw docsRes.error;
      const docs = (docsRes.data || []).map(rowToRagDoc);
      return sendJson(200, {
        docs,
        activeBooks: normalizeActiveRagBooks(activeStored),
      });
    }

    if (pathname === "/rag-docs" && req.method === "POST") {
      const body = await parseJsonBody(req);
      if (!body.id) {
        return sendJson(400, { error: "Missing document id" });
      }
      const disc = VALID_DISCIPLINES.has(String(body.discipline || ""))
        ? String(body.discipline)
        : "tarot";
      const docId = String(body.id).trim();
      const now = Date.now();
      const chunks = Array.isArray(body.chunks) ? body.chunks : [];
      const row = {
        id: docId,
        title: String(body.title || "NotebookLM Document").slice(0, 300),
        source: String(body.source || "NotebookLM Upload").slice(0, 200),
        source_type: String(body.sourceType || body.source || "NotebookLM Upload").slice(0, 200),
        style_tag: String(body.styleTag || "").slice(0, 200),
        description: String(body.description || "").slice(0, 500),
        discipline: disc,
        target_scope: disc,
        enabled_for_viewer: body.enabledForViewer !== false,
        uploaded_at: Number(body.uploadedAt) || now,
        created_at: Number(body.createdAt) || now,
        chunks,
        chunks_count: Number(body.chunksCount) || chunks.length,
        content: String(body.content || ""),
        updated_at: new Date().toISOString(),
      };

      const { error: upsertErr } = await supabase
        .from("taro_rag_docs")
        .upsert(row, { onConflict: "id" });
      if (upsertErr) throw upsertErr;

      const activeStored = await getSetting(supabase, "rag_active_books");
      const activeBooks = normalizeActiveRagBooks(activeStored);
      if (body.activateAfterUpload === true && (disc === "tarot" || disc === "palm")) {
        activeBooks[disc] = docId;
        await setSetting(supabase, "rag_active_books", activeBooks);
      }

      return sendJson(201, { doc: rowToRagDoc(row), activeBooks });
    }

    const ragDocMatch = pathname.match(/^\/rag-docs\/([^/]+)$/);
    if (ragDocMatch && req.method === "PATCH") {
      const docId = ragDocMatch[1];
      const body = await parseJsonBody(req);
      const { data: existing, error: fetchErr } = await supabase
        .from("taro_rag_docs")
        .select("*")
        .eq("id", docId)
        .maybeSingle();
      if (fetchErr) throw fetchErr;
      if (!existing) {
        return sendJson(404, { error: "Document not found" });
      }
      const nextEnabled = typeof body.enabledForViewer === "boolean"
        ? body.enabledForViewer
        : existing.enabled_for_viewer !== false;
      const { data: updated, error: updErr } = await supabase
        .from("taro_rag_docs")
        .update({ enabled_for_viewer: nextEnabled, updated_at: new Date().toISOString() })
        .eq("id", docId)
        .select("*")
        .single();
      if (updErr) throw updErr;
      return sendJson(200, { doc: rowToRagDoc(updated) });
    }

    if (ragDocMatch && req.method === "DELETE") {
      const docId = ragDocMatch[1];
      const { error: delErr } = await supabase.from("taro_rag_docs").delete().eq("id", docId);
      if (delErr) throw delErr;

      const stored = await getSetting(supabase, "rag_active_books");
      const activeBooks = normalizeActiveRagBooks(stored);
      let changed = false;
      if (activeBooks.tarot === docId) {
        activeBooks.tarot = DEFAULT_ACTIVE_RAG_BOOKS.tarot;
        changed = true;
      }
      if (activeBooks.palm === docId) {
        activeBooks.palm = DEFAULT_ACTIVE_RAG_BOOKS.palm;
        changed = true;
      }
      if (changed) {
        await setSetting(supabase, "rag_active_books", activeBooks);
      }
      return sendJson(200, { deleted: true, activeBooks });
    }

    // -----------------------------------------------------------------------
    // 4. Social Posts
    // -----------------------------------------------------------------------
    if (pathname === "/social/posts" && req.method === "GET") {
      const codeParam = searchParams.get("code");
      let query = supabase
        .from("taro_social_posts")
        .select("*")
        .order("posted_at", { ascending: false })
        .limit(200);
      if (codeParam) {
        query = query.eq("code", codeParam.trim().toUpperCase());
      }
      const { data, error } = await query;
      if (error) throw error;
      const posts = (data || []).map((r) => ({
        postId: r.post_id,
        platform: r.platform,
        account: r.account,
        privacy: r.privacy,
        code: r.code,
        mode: r.mode,
        shareUrl: r.share_url,
        caption: r.caption,
        hasInfoImage: r.has_info_image !== false,
        verified: r.verified !== false,
        device: r.device,
        postedAt: Number(r.posted_at),
      }));
      return sendJson(200, { posts });
    }

    if (pathname === "/social/post" && req.method === "POST") {
      const body = await parseJsonBody(req);
      const now = Date.now();
      const row = {
        post_id: `sp_${now}_${Math.random().toString(36).slice(2, 7)}`,
        platform: String(body.platform || "facebook").slice(0, 64),
        account: String(body.account || "").slice(0, 120),
        privacy: String(body.privacy || "public").slice(0, 32),
        code: String(body.code || "").trim().toUpperCase().slice(0, 64),
        mode: String(body.mode || "tarot").slice(0, 32),
        share_url: String(body.shareUrl || "").slice(0, 1000),
        caption: String(body.caption || "").slice(0, 5000),
        has_info_image: body.hasInfoImage !== false,
        verified: body.verified !== false,
        device: String(body.device || "desktop").slice(0, 32),
        posted_at: now,
      };
      const { error } = await supabase.from("taro_social_posts").insert(row);
      if (error) throw error;
      return sendJson(200, {
        ok: true,
        post: {
          postId: row.post_id,
          platform: row.platform,
          account: row.account,
          privacy: row.privacy,
          code: row.code,
          mode: row.mode,
          shareUrl: row.share_url,
          caption: row.caption,
          hasInfoImage: row.has_info_image,
          verified: row.verified,
          device: row.device,
          postedAt: row.posted_at,
        },
      });
    }

    // -----------------------------------------------------------------------
    // 5. Access Codes (List, Legacy Migration, Create, Access, Draw, Log, Admin PATCH, Delete)
    // -----------------------------------------------------------------------
    if (pathname === "/codes" && req.method === "GET") {
      const { data, error } = await supabase
        .from("taro_codes")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return sendJson(200, { codes: (data || []).map(rowToCodeObj) });
    }

    if (pathname === "/codes/sync-legacy" && req.method === "POST") {
      const body = await parseJsonBody(req);
      const incomingRaw = Array.isArray(body.codes) ? body.codes : [];
      const candidates = incomingRaw
        .map((c) => codeObjToRow(c && typeof c === "object" ? (c as Record<string, unknown>) : {}))
        .filter((r) => r.code && !DEMO_CODES.has(r.code));

      let importedCodes: string[] = [];
      if (candidates.length > 0) {
        const [existingRes, deletedRes] = await Promise.all([
          supabase.from("taro_codes").select("code"),
          supabase.from("taro_deleted_codes").select("code"),
        ]);
        if (existingRes.error) throw existingRes.error;
        if (deletedRes.error) throw deletedRes.error;

        const existingSet = new Set((existingRes.data || []).map((r) => String(r.code).toUpperCase()));
        const deletedSet = new Set((deletedRes.data || []).map((r) => String(r.code).toUpperCase()));
        const toInsert = candidates.filter((r) => !existingSet.has(r.code) && !deletedSet.has(r.code));

        if (toInsert.length > 0) {
          const { error: insErr } = await supabase
            .from("taro_codes")
            .upsert(toInsert, { onConflict: "code", ignoreDuplicates: true });
          if (insErr) throw insErr;
          importedCodes = toInsert.map((r) => r.code);
        }
      }

      const { data: allRows, error: allErr } = await supabase
        .from("taro_codes")
        .select("*")
        .order("created_at", { ascending: false });
      if (allErr) throw allErr;
      return sendJson(200, {
        ok: true,
        importedCount: importedCodes.length,
        importedCodes,
        codes: (allRows || []).map(rowToCodeObj),
      });
    }

    if (pathname === "/codes" && req.method === "POST") {
      const body = await parseJsonBody(req);
      if (!body.code) {
        return sendJson(400, { error: "กรุณาระบุรหัสโค้ด" });
      }
      const cleanCode = String(body.code).trim().toUpperCase();
      const { data: dup } = await supabase
        .from("taro_codes")
        .select("code")
        .eq("code", cleanCode)
        .maybeSingle();
      if (dup) {
        return sendJson(409, { error: "รหัสโค้ดนี้มีอยู่ในระบบแล้ว กรุณาใช้รหัสอื่น" });
      }

      await supabase.from("taro_deleted_codes").delete().eq("code", cleanCode);

      const row = codeObjToRow({ ...body, code: cleanCode });
      const { data: inserted, error: insErr } = await supabase
        .from("taro_codes")
        .insert(row)
        .select("*")
        .single();
      if (insErr) {
        if (insErr.code === "23505") {
          return sendJson(409, { error: "รหัสโค้ดนี้มีอยู่ในระบบแล้ว กรุณาใช้รหัสอื่น" });
        }
        throw insErr;
      }
      return sendJson(201, { codeObj: rowToCodeObj(inserted) });
    }

    const codeMatch = pathname.match(/^\/codes\/([^/]+)(?:\/(draw|log))?$/);
    if (codeMatch) {
      const targetCode = codeMatch[1].trim().toUpperCase();
      const subAction = codeMatch[2] || "";

      const { data: foundRow, error: findErr } = await supabase
        .from("taro_codes")
        .select("*")
        .eq("code", targetCode)
        .maybeSingle();
      if (findErr) throw findErr;
      if (!foundRow) {
        return sendJson(404, { error: "ไม่พบรหัสโค้ดนี้ในระบบ" });
      }

      const codeObj = rowToCodeObj(foundRow);
      const logs = codeObj.logs as Record<string, unknown>;
      const events = codeObj.events as Array<Record<string, unknown>>;
      const now = Date.now();

      if (req.method === "GET" && !subAction) {
        const recordAccess = searchParams.get("access") !== "0";
        let dirty = false;
        if (now > Number(codeObj.expiresAt)) {
          if (codeObj.status !== "expired") {
            codeObj.status = "expired";
            dirty = true;
          }
        } else if (recordAccess) {
          if (!logs.firstAccessedAt) logs.firstAccessedAt = now;
          logs.lastAccessedAt = now;
          logs.accessCount = (Number(logs.accessCount) || 0) + 1;
          if (codeObj.status === "unused") codeObj.status = "accessed";
          events.unshift({
            time: now,
            type: "accessed",
            detail: `ลูกค้าเข้าสู่ระบบด้วยโค้ด (ครั้งที่ ${logs.accessCount})`,
          });
          dirty = true;
        }
        if (dirty) {
          const updatedRow = codeObjToRow(codeObj);
          const { error: updErr } = await supabase
            .from("taro_codes")
            .update(updatedRow)
            .eq("code", targetCode);
          if (updErr) throw updErr;
        }
        return sendJson(200, { codeObj });
      }

      if (req.method === "POST" && subAction === "draw") {
        const body = await parseJsonBody(req);
        const readingResult = body.readingResult as Record<string, unknown> | undefined;
        if (readingResult && typeof readingResult === "object") {
          let detail = "";
          if (readingResult.mode === "tarot") {
            codeObj.tarotDrawCount = (Number(codeObj.tarotDrawCount) || 0) + 1;
            codeObj.tarotResult = readingResult;
            logs.tarotDrawnAt = now;
            const cards = Array.isArray(readingResult.cards) ? readingResult.cards : [];
            const cNames = cards
              .map((c: Record<string, unknown>) => `${c.name_th}${c.isReversed ? " (กลับหัว)" : ""}`)
              .join(", ");
            detail = `ลูกค้าเปิดไพ่ทาโรต์ 3 ใบ หมวด${readingResult.categoryName || readingResult.category}: ${cNames}`;
          } else if (readingResult.mode === "palm") {
            if ((Number(codeObj.palmDrawCount) || 0) >= 1 && codeObj.palmResult) {
              return sendJson(200, { ok: true, alreadyAnalyzed: true, code: codeObj, codeObj });
            }
            codeObj.palmDrawCount = 1;
            codeObj.palmResult = readingResult;
            logs.palmDrawnAt = now;
            logs.palmAnalyzedAt = now;
            const handDesc = readingResult.hand === "both"
              ? "ครบ 2 มือ (ซ้าย+ขวา)"
              : (readingResult.hand === "left" ? "มือซ้าย" : "มือขวา");
            detail = `ลูกค้าวิเคราะห์ลายมือ (${handDesc}) ความแม่นยำ ${Number(readingResult.confidence || 92).toFixed(1)}%`;
          } else {
            codeObj.siamsiDrawCount = (Number(codeObj.siamsiDrawCount) || 0) + 1;
            codeObj.siamsiResult = readingResult;
            logs.siamsiDrawnAt = now;
            detail = `ลูกค้าเสี่ยงเซียมซี ได้เบอร์ ${readingResult.signNumber} (${readingResult.signTitle || ""})`;
          }

          codeObj.drawCount =
            (Number(codeObj.tarotDrawCount) || 0) +
            (Number(codeObj.siamsiDrawCount) || 0) +
            (Number(codeObj.palmDrawCount) || 0);
          codeObj.status = "drawn";
          logs.drawnAt = now;
          codeObj.readingResult = readingResult;
          events.unshift({ time: now, type: "drawn", detail });

          const { error: updErr } = await supabase
            .from("taro_codes")
            .update(codeObjToRow(codeObj))
            .eq("code", targetCode);
          if (updErr) throw updErr;
        }
        return sendJson(200, { codeObj });
      }

      if (req.method === "POST" && subAction === "log") {
        const body = await parseJsonBody(req);
        const actionType = String(body.actionType || "");
        const extraDetail = String(body.extraDetail || "");

        if (actionType === "share") {
          logs.sharedAt = now;
          logs.shareCount = (Number(logs.shareCount) || 0) + 1;
          events.unshift({
            time: now,
            type: "shared",
            detail: extraDetail || `แชร์ผลคำทำนายไปยังโซเชียล (ครั้งที่ ${logs.shareCount})`,
          });
        } else if (actionType === "pdf") {
          logs.pdfDownloadedAt = now;
          logs.pdfDownloadCount = (Number(logs.pdfDownloadCount) || 0) + 1;
          events.unshift({
            time: now,
            type: "pdf",
            detail: extraDetail || `ดาวน์โหลดไฟล์ PDF คำทำนาย (ครั้งที่ ${logs.pdfDownloadCount})`,
          });
        }

        const { error: updErr } = await supabase
          .from("taro_codes")
          .update(codeObjToRow(codeObj))
          .eq("code", targetCode);
        if (updErr) throw updErr;
        return sendJson(200, { codeObj });
      }

      if (req.method === "PATCH" && !subAction) {
        const body = await parseJsonBody(req);
        if (body.action === "reset_draw") {
          codeObj.drawCount = 0;
          codeObj.tarotDrawCount = 0;
          codeObj.siamsiDrawCount = 0;
          codeObj.palmDrawCount = 0;
          codeObj.palmResult = null;
          logs.palmDrawnAt = null;
          logs.palmAnalyzedAt = null;
          codeObj.status = (Number(logs.accessCount) || 0) > 0 ? "accessed" : "unused";
          codeObj.readingResult = null;
          codeObj.tarotResult = null;
          codeObj.siamsiResult = null;
          logs.drawnAt = null;
          logs.tarotDrawnAt = null;
          logs.siamsiDrawnAt = null;
          events.unshift({
            time: now,
            type: "admin_reset",
            detail: "แอดมินรีเซ็ตสิทธิ์การดูดวงใหม่ทั้งหมดของโค้ดนี้",
          });
        } else if (body.action === "extend_1day") {
          const baseTime = Math.max(now, Number(codeObj.expiresAt) || now);
          codeObj.expiresAt = baseTime + 24 * 60 * 60 * 1000;
          if (codeObj.status === "expired") {
            codeObj.status = (Number(codeObj.drawCount) || 0) > 0 ? "drawn" : "unused";
          }
          events.unshift({
            time: now,
            type: "admin_extend",
            detail: "แอดมินต่ออายุโค้ดเพิ่มอีก 1 วัน (24 ชั่วโมง)",
          });
        }

        const { error: updErr } = await supabase
          .from("taro_codes")
          .update(codeObjToRow(codeObj))
          .eq("code", targetCode);
        if (updErr) throw updErr;
        return sendJson(200, { codeObj });
      }

      if (req.method === "DELETE" && !subAction) {
        await supabase
          .from("taro_deleted_codes")
          .upsert({ code: targetCode, deleted_at: new Date().toISOString() }, { onConflict: "code" });
        const { error: delErr } = await supabase.from("taro_codes").delete().eq("code", targetCode);
        if (delErr) throw delErr;
        return sendJson(200, { deleted: true });
      }
    }

    return sendJson(404, { error: "Not found", pathname });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("taro-api error:", message);
    return sendJson(500, { error: "Internal server error", detail: message });
  }
});
