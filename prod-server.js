import "dotenv/config";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";

const PORT = parseInt(process.env.PORT || process.env.NITRO_PORT || "8081", 10);
const HOST = process.env.HOST || "0.0.0.0";
const CLIENT_DIR = path.resolve("dist/client");
const PUBLIC_DIR = path.resolve("dist/public");
const LOCAL_ASSETS_DIR = path.resolve("local-assets");

const MIME_TYPES = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".pdf": "application/pdf",
  ".mp4": "video/mp4",
  ".avif": "image/avif",
};

async function main() {
  // ── 1. Load the TanStack Start server entry ────────────────────────
  const serverJsPath = path.resolve("dist/server/server.js");
  if (!fs.existsSync(serverJsPath)) {
    throw new Error(
      `Build output not found at ${serverJsPath}.\n` +
        `Run "npm run build" (or "bun run build") first.`
    );
  }

  console.log("Loading server entry from dist/server/server.js …");
  let mod;
  try {
    mod = await import("./dist/server/server.js");
  } catch (err) {
    throw new Error(
      `Failed to import dist/server/server.js:\n${err.stack || err.message}\n\n` +
        `Make sure you ran "npm run build" on this machine after pulling changes.`
    );
  }

  // The build exports: default → { fetch(request) → Response }
  const fetchHandler =
    mod?.default?.fetch?.bind(mod.default) ??
    mod?.fetch?.bind(mod) ??
    null;

  if (typeof fetchHandler !== "function") {
    // Debug: print what we actually got so the deploy log is helpful
    console.error("Module exports:", Object.keys(mod));
    console.error("mod.default type:", typeof mod.default);
    if (mod.default) console.error("mod.default keys:", Object.keys(mod.default));
    throw new Error(
      "dist/server/server.js did not export a valid fetch handler.\n" +
        "Expected mod.default.fetch to be a function.\n" +
        'Try deleting the dist/ folder and rebuilding: rm -rf dist && npm run build'
    );
  }

  console.log("✓ Fetch handler loaded successfully");

  // ── 2. Static file server ──────────────────────────────────────────
  function tryServeStatic(req, res, filePath, isImmutable = false) {
    try {
      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || "application/octet-stream";
        res.setHeader("Content-Type", contentType);
        if (isImmutable) {
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        } else {
          res.setHeader("Cache-Control", "public, max-age=3600");
        }
        fs.createReadStream(filePath).pipe(res);
        return true;
      }
    } catch {
      // Pass
    }
    return false;
  }

  // ── 3. HTTP server ─────────────────────────────────────────────────
  const server = http.createServer(async (req, res) => {
    try {
      const parsedUrl = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
      const pathname = decodeURIComponent(parsedUrl.pathname);

      // Static: dist/client/assets (hashed, immutable)
      if (pathname.startsWith("/assets/")) {
        const clientAssetPath = path.join(CLIENT_DIR, pathname);
        if (tryServeStatic(req, res, clientAssetPath, true)) return;
      }

      // Static: other files in dist/client
      const directClientPath = path.join(CLIENT_DIR, pathname);
      if (pathname !== "/" && tryServeStatic(req, res, directClientPath)) return;

      // Static: dist/public
      const publicDistPath = path.join(PUBLIC_DIR, pathname);
      if (pathname !== "/" && tryServeStatic(req, res, publicDistPath)) return;

      // Static: project root public/
      const publicPath = path.join(path.resolve("public"), pathname);
      if (pathname !== "/" && tryServeStatic(req, res, publicPath)) return;

      // Static: local-assets/
      if (pathname.startsWith("/local-assets/")) {
        const localAssetPath = path.join(LOCAL_ASSETS_DIR, pathname.replace(/^\/local-assets\//, ""));
        if (tryServeStatic(req, res, localAssetPath)) return;
      }

      // ── SSR via TanStack Start fetch handler ──
      const headers = new Headers();
      for (const [key, value] of Object.entries(req.headers)) {
        if (value) {
          if (Array.isArray(value)) {
            for (const v of value) headers.append(key, v);
          } else {
            headers.set(key, value);
          }
        }
      }

      const method = req.method || "GET";
      const hasBody = method !== "GET" && method !== "HEAD";
      const requestBody = hasBody ? req : undefined;

      const webRequest = new Request(parsedUrl.href, {
        method,
        headers,
        body: requestBody,
        duplex: hasBody ? "half" : undefined,
      });

      const webResponse = await fetchHandler(webRequest);

      // Write response
      res.statusCode = webResponse.status;
      webResponse.headers.forEach((val, key) => {
        if (key.toLowerCase() === "set-cookie") {
          const cookies = webResponse.headers.getSetCookie?.() || [val];
          res.setHeader("set-cookie", cookies);
        } else {
          res.setHeader(key, val);
        }
      });

      if (webResponse.body) {
        const nodeStream = Readable.fromWeb(webResponse.body);
        nodeStream.pipe(res);
      } else {
        res.end();
      }
    } catch (err) {
      console.error("[Server Error]", err);
      if (!res.headersSent) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "text/plain");
        res.end("Internal Server Error");
      }
    }
  });

  server.listen(PORT, HOST, () => {
    console.log(`➜ Server listening on http://${HOST === "0.0.0.0" ? "localhost" : HOST}:${PORT}/`);
  });
}

main().catch((err) => {
  console.error("Fatal startup error:", err);
  process.exit(1);
});
