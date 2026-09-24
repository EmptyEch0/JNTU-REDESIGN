import { createFileRoute } from "@tanstack/react-router";
import fs from "fs";
import path from "path";

export const Route = createFileRoute("/docs/$")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const url = new URL(request.url);
          const pathname = decodeURIComponent(url.pathname);

          // Strip the "/docs" prefix to find the relative file path
          const prefix = "/docs";
          if (!pathname.startsWith(prefix)) {
            return new Response("Not Found", { status: 404 });
          }

          const relativeFilePath = pathname.substring(prefix.length).replace(/^\/+/, "");
          
          // Check various search locations for the file on disk
          const possiblePaths = [
            path.join(process.cwd(), "local-assets", "uploads", relativeFilePath),
            path.join(process.cwd(), "local-assets", relativeFilePath),
            path.join(process.cwd(), "public", relativeFilePath),
            path.join("/var/www/JNTU-REDESIGN/local-assets/uploads", relativeFilePath),
            path.join("/var/www/JNTU-REDESIGN/local-assets", relativeFilePath),
            path.join("/var/www/local-assets/uploads", relativeFilePath),
          ];

          let diskPath = "";
          for (const p of possiblePaths) {
            if (fs.existsSync(p) && fs.statSync(p).isFile()) {
              diskPath = p;
              break;
            }
          }

          if (!diskPath) {
            return new Response("Document Not Found", { status: 404 });
          }

          // Read file content
          const fileBuffer = fs.readFileSync(diskPath);
          const extension = path.extname(diskPath).toLowerCase();
          
          let contentType = "application/octet-stream";
          if (extension === ".pdf") {
            contentType = "application/pdf";
          } else if (extension === ".jpg" || extension === ".jpeg") {
            contentType = "image/jpeg";
          } else if (extension === ".png") {
            contentType = "image/png";
          } else if (extension === ".webp") {
            contentType = "image/webp";
          }

          return new Response(fileBuffer, {
            headers: {
              "Content-Type": contentType,
              "Content-Disposition": `inline; filename="${path.basename(diskPath)}"`,
              "Cache-Control": "public, max-age=31536000",
            },
          });
        } catch (error: any) {
          console.error("Document serve error:", error);
          return new Response("Internal Server Error", { status: 500 });
        }
      },
    },
  },
});
