import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  cloudflare: false,
  ssr: false,   // <-- disable SSR, build as plain SPA
  vite: {
    build: {
      outDir: "dist"
    }
  }
});
