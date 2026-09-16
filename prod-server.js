import "dotenv/config";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";

const PORT = parseInt(process.env.PORT || process.env.NITRO_PORT || "8081", 10);
const HOST = process.env.HOST || "0.0.0.0";
const CLIENT_DIR = path.resolve("dist/client");
const PUBLIC_DIR = path.resolve("public");
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
};

async function main() {
  let fetchHandler = null;
  const candidatePaths = [
    "./dist/server/server.js",
    "./dist/server/_ssr/index.mjs",
    "./dist/server/index.mjs",
    "./dist/server/index.js",
  ];

  for (const p of candidatePaths) {
    const resolvedPath = path.resolve(p);
    if (!fs.existsSync(resolvedPath)) continue;

    try {
      const mod = await import(p);

      if (typeof mod?.default?.fetch === "function") {
        fetchHandler = mod.default.fetch.bind(mod.default);
        break;
      } else if (typeof mod?.fetch === "function") {
        fetchHandler = mod.fetch.bind(mod);
        break;
      } else if (typeof mod?.default === "function") {
        fetchHandler = mod.default.bind(mod);
        break;
      } else if (typeof mod?.server?.fetch === "function") {
        fetchHandler = mod.server.fetch.bind(mod.server);
        break;
      } else if (typeof mod?.createServerEntry === "function") {
        const entry = mod.createServerEntry();
        if (typeof entry?.fetch === "function") {
          fetchHandler = entry.fetch.bind(entry);
          break;
        }
      } else if (mod?.s?.createStartHandler && mod?.s?.defaultStreamHandler) {
        const handler = mod.s.createStartHandler(mod.s.defaultStreamHandler);
        fetchHandler = typeof handler?.fetch === "function" ? handler.fetch.bind(handler) : handler;
        break;
      }
    } catch (err) {
      console.warn(`Could not load candidate ${p}:`, err.message);
    }
  }

  if (!fetchHandler) {
    throw new Error("Could not find a valid fetch handler in dist/server/");
  }

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

  const server = http.createServer(async (req, res) => {
    try {
      const parsedUrl = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
      const pathname = decodeURIComponent(parsedUrl.pathname);

      // 1. Check dist/client
      if (pathname.startsWith("/assets/")) {
        const clientAssetPath = path.join(CLIENT_DIR, pathname);
        if (tryServeStatic(req, res, clientAssetPath, true)) return;
      }

      // 2. Check general static file in dist/client
      const directClientPath = path.join(CLIENT_DIR, pathname);
      if (pathname !== "/" && tryServeStatic(req, res, directClientPath)) return;

      // 3. Check public folder
      const publicPath = path.join(PUBLIC_DIR, pathname);
      if (pathname !== "/" && tryServeStatic(req, res, publicPath)) return;

      // 4. Check local-assets folder
      if (pathname.startsWith("/local-assets/")) {
        const localAssetPath = path.join(LOCAL_ASSETS_DIR, pathname.replace(/^\/local-assets\//, ""));
        if (tryServeStatic(req, res, localAssetPath)) return;
      }

      // 5. Build standard Web Request for TanStack Start SSR
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

      // 6. Handle with TanStack Start
      const webResponse = await fetchHandler(webRequest);

      // 7. Write headers and status to Node response
      res.statusCode = webResponse.status;
      webResponse.headers.forEach((val, key) => {
        if (key.toLowerCase() === "set-cookie") {
          const cookies = webResponse.headers.getSetCookie?.() || [val];
          res.setHeader("set-cookie", cookies);
        } else {
          res.setHeader(key, val);
        }
      });

      // 8. Stream response body
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
