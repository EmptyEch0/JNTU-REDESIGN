import { createFileRoute } from "@tanstack/react-router";
import fs from "fs";
import path from "path";
import crypto from "crypto";

export const Route = createFileRoute("/api/upload")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const formData = await request.formData();
          const file = formData.get("file") as File | null;
          const module = formData.get("module") as string | null;
          const category = formData.get("category") as string | null;

          // 1. Basic field existence checks
          if (!file) {
            return Response.json(
              { success: false, error: "No file was uploaded." },
              { status: 400 }
            );
          }
          if (!module || !category) {
            return Response.json(
              { success: false, error: "Module and category fields are required." },
              { status: 400 }
            );
          }

          // 2. Strict file type validation
          // Allowed: image/jpeg, image/jpg, image/png, image/webp
          // Rejected: SVG, GIF, PDF, EXE, etc.
          const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
          if (!allowedMimeTypes.includes(file.type.toLowerCase())) {
            return Response.json(
              { 
                success: false, 
                error: `Invalid file type. Allowed formats: JPEG, JPG, PNG, WEBP. Received: ${file.type}` 
              },
              { status: 400 }
            );
          }

          // 3. File size validation (Max 5 MB)
          const maxSizeBytes = 5 * 1024 * 1024;
          if (file.size > maxSizeBytes) {
            return Response.json(
              { success: false, error: "File size exceeds the maximum limit of 5MB." },
              { status: 400 }
            );
          }

          // 4. Filename sanitization & Generation
          // Format: timestamp-random-originalname.ext
          const timestamp = Math.floor(Date.now() / 1000);
          const randomHex = crypto.randomBytes(4).toString("hex");
          
          // Extract extension and clean base name
          const fileExtension = path.extname(file.name).toLowerCase();
          const baseName = path.basename(file.name, fileExtension);
          
          // Sanitize basename to alphanumeric and underscores
          const sanitizedBase = baseName
            .replace(/[^a-zA-Z0-9.-]/g, "_")
            .replace(/_{2,}/g, "_");

          const filename = `${timestamp}-${randomHex}-${sanitizedBase}${fileExtension}`;

          // 5. Storage path calculation & recursive directory creation
          // Base directory is <project-root>/local-assets/uploads
          // (d:\jntugv\JNTU-REDESIGN\local-assets\uploads on this machine)
          // Served at /local-assets/... via the Vite static middleware plugin.
          let finalModule = module;
          let finalCategory = category;
          if (module === "engineering") {
            finalModule = "facilities";
            finalCategory = `engineering-cell/${category}`;
          } else if (module === "clubs") {
            finalModule = "facilities";
            finalCategory = `clubs/${category}`;
          }
          else if(module=="amenities"){
            finalModule = "facilities";
            finalCategory = `amenities/${category}`;
          }

          const baseDir = path.join(process.cwd(), "local-assets", "uploads");
          const relativeFolder = path.join(finalModule, finalCategory).replace(/\\/g, "/");
          const targetDir = path.join(baseDir, relativeFolder);

          if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
          }

          const targetFilePath = path.join(targetDir, filename);

          // Write file content buffer to disk
          const arrayBuffer = await file.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          fs.writeFileSync(targetFilePath, buffer);

          // 6. DB format relative path: local-assets/uploads/module/category/filename
          const relativeDbPath = `local-assets/uploads/${relativeFolder}/${filename}`;

          return Response.json({
            success: true,
            path: relativeDbPath,
          });
        } catch (error: any) {
          console.error("API Upload error:", error);
          return Response.json(
            { success: false, error: error.message || "Internal Server Error" },
            { status: 500 }
          );
        }
      },
    },
  },
});
