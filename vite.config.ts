// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import fs from "fs";
import path from "path";
import type { Plugin } from "vite";

/**
 * Serves the project-local `local-assets/` directory at the `/local-assets/` URL path.
 * Files are stored at:  <project-root>/local-assets/uploads/{module}/{category}/{file}
 * Accessible at:        http://localhost:{port}/local-assets/uploads/{module}/{category}/{file}
 * No external file server or public/ folder needed.
 */
function serveLocalAssets(): Plugin {
  return {
    name: "serve-local-assets",
    configureServer(server) {
      server.middlewares.use(
        "/local-assets",
        (req: import("http").IncomingMessage, res: import("http").ServerResponse, next: () => void) => {
          const safePath = (req.url || "").split("?")[0];
          const filePath = path.join(process.cwd(), "local-assets", safePath);

          // Security: prevent directory traversal
          const resolved = path.resolve(filePath);
          const allowed = path.resolve(path.join(process.cwd(), "local-assets"));
          if (!resolved.startsWith(allowed)) {
            res.statusCode = 403;
            res.end("Forbidden");
            return;
          }

          if (!fs.existsSync(resolved) || !fs.statSync(resolved).isFile()) {
            next();
            return;
          }

          const ext = path.extname(resolved).toLowerCase();
          const mimeMap: Record<string, string> = {
            ".jpg":  "image/jpeg",
            ".jpeg": "image/jpeg",
            ".png":  "image/png",
            ".webp": "image/webp",
            ".gif":  "image/gif",
            ".svg":  "image/svg+xml",
            ".pdf":  "application/pdf",
          };

          res.setHeader("Content-Type", mimeMap[ext] || "application/octet-stream");
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
          fs.createReadStream(resolved).pipe(res);
        }
      );
    },
  };
}

export default defineConfig({
  vite: {
    plugins: [serveLocalAssets()],
  },
});
