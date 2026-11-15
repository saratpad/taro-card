/**
 * supabase-client.js
 * Central API transport layer that routes /api/* calls either to the local
 * Node development server (when running on localhost with server.js active)
 * or directly to the Supabase Edge Function (`taro-api`).
 *
 * Only uses the public Supabase publishable key (`apikey` header) so no
 * secret/service-role credentials ever exist in browser code.
 */
(function initTarotApiClient(globalScope) {
  "use strict";

  const SUPABASE_CONFIG = Object.freeze({
    supabaseUrl: "https://dnzqvnwxgqtrvavaypth.supabase.co",
    publishableKey: "sb_publishable_bvDuNkH-VsmJaUs6hQcSGQ_70Mo-Isk",
    edgeFunctionBase: "https://dnzqvnwxgqtrvavaypth.supabase.co/functions/v1/taro-api"
  });

  const LOCAL_HOSTNAMES = new Set(["localhost", "127.0.0.1", "[::1]"]);
  const DEFAULT_LOCAL_TIMEOUT_MS = 3000;
  const DEFAULT_SUPABASE_TIMEOUT_MS = 8000;

  function toBackendType(mode) {
    if (mode === "supabase") return "supabase";
    if (mode === "local_server") return "local";
    return "offline";
  }

  function buildTargetUrl(apiPath, mode) {
    const normalized = String(apiPath || "/");
    if (mode === "local_server") {
      if (normalized.startsWith("/api/") || normalized === "/api") {
        return normalized;
      }
      return "/api" + (normalized.startsWith("/") ? normalized : "/" + normalized);
    }
    const stripped = normalized.replace(/^\/api(?=\/|$)/, "") || "/";
    const suffix = stripped.startsWith("/") ? stripped : "/" + stripped;
    return SUPABASE_CONFIG.edgeFunctionBase + suffix;
  }

  function buildHeaders(mode, extraHeaders) {
    const headers = {
      "Content-Type": "application/json",
      ...(extraHeaders || {})
    };
    if (mode === "supabase") {
      // Send publishable key via `apikey` only (taro-api uses verify_jwt = false).
      headers.apikey = SUPABASE_CONFIG.publishableKey;
    }
    return headers;
  }

  async function probeLocalServer() {
    if (typeof fetch !== "function") return false;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);
    try {
      const res = await fetch("/api/codes", {
        method: "GET",
        headers: { Accept: "application/json" },
        signal: controller.signal
      });
      if (!res.ok) return false;
      const contentType = (res.headers.get("content-type") || "").toLowerCase();
      return contentType.includes("application/json");
    } catch (_) {
      return false;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  class TarotApiClient {
    constructor() {
      this.config = SUPABASE_CONFIG;
      this._resolvedMode = null;
      this._resolvePromise = null;
      this.isConnected = false;
      this.backendType = "offline";
    }

    /**
     * Reads URL query overrides (?backend=supabase|local) or global test hook.
     */
    _getExplicitOverride() {
      try {
        if (globalScope.__TAROT_BACKEND_MODE__) {
          const raw = String(globalScope.__TAROT_BACKEND_MODE__).trim().toLowerCase();
          if (raw === "supabase" || raw === "local_server") return raw;
          if (raw === "local") return "local_server";
        }
        const search = globalScope.location && globalScope.location.search;
        if (search) {
          const params = new URLSearchParams(search);
          const param = (params.get("backend") || "").trim().toLowerCase();
          if (param === "supabase") return "supabase";
          if (param === "local" || param === "local_server") return "local_server";
        }
      } catch (_) {
        // Ignore malformed URLSearchParams errors
      }
      return null;
    }

    _isLocalHostname() {
      try {
        const host = String((globalScope.location && globalScope.location.hostname) || "").toLowerCase();
        return LOCAL_HOSTNAMES.has(host);
      } catch (_) {
        return false;
      }
    }

    /**
     * Resolves whether requests target Supabase Edge Function or local server.js.
     */
    async resolveBackend(force = false) {
      if (!force && this._resolvedMode) {
        return this._resolvedMode;
      }
      if (!force && this._resolvePromise) {
        return this._resolvePromise;
      }

      this._resolvePromise = (async () => {
        const override = this._getExplicitOverride();
        let mode = "supabase";

        if (override === "supabase") {
          mode = "supabase";
        } else if (override === "local_server") {
          const localAlive = await probeLocalServer();
          mode = localAlive ? "local_server" : "supabase";
        } else if (this._isLocalHostname()) {
          const localAlive = await probeLocalServer();
          mode = localAlive ? "local_server" : "supabase";
        } else {
          // Deployed hosts (Vercel / custom domains) route straight to Supabase.
          mode = "supabase";
        }

        this._resolvedMode = mode;
        this.backendType = toBackendType(mode);
        return mode;
      })();

      try {
        return await this._resolvePromise;
      } finally {
        this._resolvePromise = null;
      }
    }

    getBackendMode() {
      return this._resolvedMode || "supabase";
    }

    /**
     * Executes an HTTP JSON request against the resolved backend and returns
     * structured response metadata distinguishing HTTP errors from offline failures.
     */
    async requestRaw(apiPath, options = {}) {
      if (typeof fetch !== "function") {
        this.isConnected = false;
        this.backendType = "offline";
        return {
          ok: false,
          status: 0,
          data: null,
          error: "fetch is not available",
          networkError: true,
          backendMode: this.getBackendMode(),
          backendType: "offline"
        };
      }

      const mode = await this.resolveBackend();
      const targetUrl = buildTargetUrl(apiPath, mode);
      const timeoutMs = Number(options.timeoutMs) || (
        mode === "local_server" ? DEFAULT_LOCAL_TIMEOUT_MS : DEFAULT_SUPABASE_TIMEOUT_MS
      );

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      try {
        const fetchOptions = { ...options };
        delete fetchOptions.timeoutMs;

        const res = await fetch(targetUrl, {
          ...fetchOptions,
          headers: buildHeaders(mode, options.headers),
          signal: controller.signal
        });

        let data = null;
        try {
          data = await res.json();
        } catch (_) {
          data = null;
        }

        // Any valid HTTP response proves the backend is reachable even on 404/409.
        this.isConnected = true;
        this.backendType = toBackendType(mode);

        if (!res.ok) {
          const message = (data && data.error) ? String(data.error) : `HTTP ${res.status}`;
          return {
            ok: false,
            status: res.status,
            data,
            error: message,
            networkError: false,
            backendMode: mode,
            backendType: this.backendType
          };
        }

        return {
          ok: true,
          status: res.status,
          data,
          error: null,
          networkError: false,
          backendMode: mode,
          backendType: this.backendType
        };
      } catch (err) {
        this.isConnected = false;
        this.backendType = "offline";
        return {
          ok: false,
          status: 0,
          data: null,
          error: err && err.message ? err.message : "Network error",
          networkError: true,
          backendMode: mode,
          backendType: "offline"
        };
      } finally {
        clearTimeout(timeoutId);
      }
    }

    /**
     * Convenience wrapper returning parsed JSON on 2xx or null otherwise.
     */
    async request(apiPath, options = {}) {
      const result = await this.requestRaw(apiPath, options);
      return result.ok ? result.data : null;
    }
  }

  globalScope.TarotApiClient = TarotApiClient;
  globalScope.tarotApiClient = new TarotApiClient();
})(typeof window !== "undefined" ? window : globalThis);
