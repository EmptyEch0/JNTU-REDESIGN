import { createFileRoute } from "@tanstack/react-router";
import fs from "fs";
import path from "path";

export const Route = createFileRoute("/local-assets/uploads/$")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const url = new URL(request.url);
          const pathname = decodeURIComponent(url.pathname);

          // Strip the "/local-assets/uploads" prefix to find the relative file path on disk
          const prefix = "/local-assets/uploads";
          if (!pathname.startsWith(prefix)) {
            return new Response("Not Found", { status: 404 });
          }

          const relativeFilePath = pathname.substring(prefix.length);
          const baseDir = "/local-assets/uploads";
          const diskPath = path.join(baseDir, relativeFilePath);

          // Check if file exists and is not a directory
          if (!fs.existsSync(diskPath) || fs.statSync(diskPath).isDirectory()) {
            return new Response("Asset Not Found", { status: 404 });
          }

          // Read file content
          const fileBuffer = fs.readFileSync(diskPath);
          
          // Determine Content-Type header based on extension
          const extension = path.extname(diskPath).toLowerCase();
          let contentType = "application/octet-stream";
          
          if (extension === ".jpg" || extension === ".jpeg") {
            contentType = "image/jpeg";
          } else if (extension === ".png") {
            contentType = "image/png";
          } else if (extension === ".webp") {
            contentType = "image/webp";
          }

          return new Response(fileBuffer, {
            headers: {
              "Content-Type": contentType,
              "Cache-Control": "public, max-age=31536000",
            },
          });
        } catch (error: any) {
          console.error("Local asset serve error:", error);
          return new Response("Internal Server Error", { status: 500 });
        }
      },
    },
  },
});
