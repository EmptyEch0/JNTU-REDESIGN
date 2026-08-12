import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import fs from "fs";
import path from "path";
import type { Plugin } from "vite";
import viteImagemin from "vite-plugin-imagemin";

function serveLocalAssets(): Plugin {
  return {
    name: "serve-local-assets",
    configureServer(server) {
      server.middlewares.use(
        "/local-assets",
        (req, res, next) => {
          const safePath = (req.url || "").split("?")[0];
          const filePath = path.join(process.cwd(), "local-assets", safePath);
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
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
            ".png": "image/png",
            ".webp": "image/webp",
            ".gif": "image/gif",
            ".svg": "image/svg+xml",
            ".pdf": "application/pdf",
          };

          res.setHeader("Content-Type", mimeMap[ext] || "application/octet-stream");
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
          fs.createReadStream(resolved).pipe(res);
        },
      );
    },
  };
}

export default defineConfig({
  nitro: {
    preset: "vercel",
    output: {
      dir: ".vercel/output",
      serverDir: ".vercel/output/functions/__server.func",
      publicDir: ".vercel/output/static",
    },
  },
  vite: {
    plugins: [
      serveLocalAssets(),
      viteImagemin({
        webp: { quality: 80 },
        pngquant: { quality: [0.65, 0.9] },
        mozjpeg: { quality: 80 },
      }),
    ],
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              if (id.includes("react-dom") || /[\\/]react[\\/]/.test(id)) {
                return "vendor-react";
              }
              if (id.includes("@tanstack")) {
                return "vendor-tanstack";
              }
              if (id.includes("framer-motion")) {
                return "chunk-motion";
              }
              if (id.includes("recharts") || id.includes("d3-")) {
                return "chunk-charts";
              }
              if (id.includes("@xenova/transformers")) {
                return "chunk-ai";
              }
              if (id.includes("lucide-react")) {
                return "chunk-icons";
              }
              if (id.includes("@radix-ui")) {
                return "chunk-radix";
              }
            }
          },
        },
      },
    },
  },
});