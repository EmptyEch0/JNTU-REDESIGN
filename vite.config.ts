import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import fs from "fs";
import path from "path";
import type { Plugin } from "vite";
// imagemin is imported lazily — only used in production builds
let viteImagemin: typeof import("vite-plugin-imagemin").default | undefined;

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
            res.writeHead(302, { Location: `http://89.116.134.182/local-assets${safePath}` });
            res.end();
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

const isDev = process.env.NODE_ENV !== "production";

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
    // Fix: Use a stable port so Vite never wastes time scanning for a free one
    server: {
      port: 5173,
      strictPort: false,
      // Pre-warm the most expensive transforms on startup
      warmup: {
        clientFiles: [
          "./src/routes/__root.tsx",
          "./src/routes/index.tsx",
          "./src/components/MegaMenu.tsx",
          "./src/components/HeaderBanner.tsx",
        ],
      },
    },
    // Pre-bundle all heavy dependencies once → cached in node_modules/.vite
    // This is the single biggest win for startup time.
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "@tanstack/react-router",
        "@tanstack/react-query",
        "framer-motion",
        "lucide-react",
        "recharts",
        "@radix-ui/react-dialog",
        "@radix-ui/react-dropdown-menu",
        "@radix-ui/react-navigation-menu",
        "@radix-ui/react-tooltip",
        "@radix-ui/react-accordion",
        "@radix-ui/react-tabs",
        "@radix-ui/react-select",
        "clsx",
        "tailwind-merge",
        "sonner",
        "date-fns",
        "zod",
      ],
      // @tanstack/react-start contains server-only Node.js code (AsyncLocalStorage)
      // that must NOT be pre-bundled for the browser client.
      // @xenova/transformers and web-push are server/lazy modules — exclude from pre-bundler.
      exclude: ["@xenova/transformers", "@tanstack/react-start", "web-push"],
    },
    plugins: [
      serveLocalAssets(),
      // Skip imagemin in dev — it runs image compression on every file change
      // which is the main reason startup takes 11+ seconds. Build-only.
      ...(!isDev
        ? [
            (async () => {
              if (!viteImagemin) {
                viteImagemin = (await import("vite-plugin-imagemin")).default;
              }
              return viteImagemin({
                webp: { quality: 80 },
                pngquant: { quality: [0.65, 0.9] },
                mozjpeg: { quality: 80 },
              });
            })()
          ]
        : []),
    ],
    build: {
      // Increase chunk warning limit since we're intentionally splitting
      chunkSizeWarningLimit: 1000,
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
              if (id.includes("@lottiefiles")) {
                return "chunk-lottie";
              }
              if (id.includes("drizzle-orm") || id.includes("postgres")) {
                return "chunk-db";
              }
            }
          },
        },
      },
    },
  },
});