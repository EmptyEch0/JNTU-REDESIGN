import { createFileRoute } from "@tanstack/react-router";
import fs from "fs";
import path from "path";

export const Route = createFileRoute("/images/$")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const url = new URL(request.url);
          const pathname = decodeURIComponent(url.pathname);

          const prefix = "/images";
          if (!pathname.startsWith(prefix)) {
            return new Response("Not Found", { status: 404 });
          }

          let relativeFilePath = pathname.substring(prefix.length).replace(/^\/+/, "");

          // Legacy alias fix: If old link with 002-panchangam is requested, map to 001
          if (relativeFilePath.includes("JNTUGV-ED26-002-panchangam-sai-vamsi")) {
            relativeFilePath = relativeFilePath.replace(
              "JNTUGV-ED26-002-panchangam-sai-vamsi",
              "JNTUGV-ED26-001-panchangam-sai-vamsi"
            );
          }

          const possiblePaths = [
            path.join(process.cwd(), "public", "images", relativeFilePath),
            path.join(process.cwd(), "dist", "client", "images", relativeFilePath),
            path.join(process.cwd(), "dist", "public", "images", relativeFilePath),
            path.join(process.cwd(), "local-assets", "uploads", "images", relativeFilePath),
            path.join(process.cwd(), "local-assets", "uploads", "certifications", relativeFilePath),
            path.join("/var/www/JNTU-REDESIGN/public/images", relativeFilePath),
            path.join("/var/www/local-assets/uploads/images", relativeFilePath),
          ];

          let diskPath = "";
          for (const p of possiblePaths) {
            if (fs.existsSync(p) && fs.statSync(p).isFile()) {
              diskPath = p;
              break;
            }
          }

          if (!diskPath) {
            return new Response("Image Not Found", {
              status: 404,
              headers: { "Content-Type": "text/plain" },
            });
          }

          const fileBuffer = fs.readFileSync(diskPath);
          const extension = path.extname(diskPath).toLowerCase();

          let contentType = "application/octet-stream";
          if (extension === ".png") {
            contentType = "image/png";
          } else if (extension === ".jpg" || extension === ".jpeg") {
            contentType = "image/jpeg";
          } else if (extension === ".webp") {
            contentType = "image/webp";
          } else if (extension === ".svg") {
            contentType = "image/svg+xml";
          } else if (extension === ".pdf") {
            contentType = "application/pdf";
          }

          return new Response(fileBuffer, {
            headers: {
              "Content-Type": contentType,
              "Cache-Control": "public, max-age=31536000",
            },
          });
        } catch (error: any) {
          console.error("Image asset serve error:", error);
          return new Response("Internal Server Error", {
            status: 500,
            headers: { "Content-Type": "text/plain" },
          });
        }
      },
    },
  },
});

