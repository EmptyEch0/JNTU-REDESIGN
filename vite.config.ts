import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import viteImagemin from 'vite-plugin-imagemin';

export default defineConfig({
  nitro: {
    preset: 'vercel',
    output: {
      dir: '.vercel/output',
      serverDir: '.vercel/output/functions/__server.func',
      publicDir: '.vercel/output/static'
    }
  },
  plugins: [
    viteImagemin({
      webp: { quality: 80 },
      pngquant: { quality: [0.65, 0.9] },
      mozjpeg: { quality: 80 },
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],
          'router': ['@tanstack/react-router'],
        }
      }
    }
  }
});
