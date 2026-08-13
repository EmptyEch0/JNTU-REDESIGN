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

          const mod = (module || "notices").toLowerCase();
          const cat = (category || "date").toLowerCase();

          // 2. File type validation
          // Allowed: JPEG, JPG, PNG, WEBP, PDF
          const allowedMimeTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
            "application/pdf",
          ];
          
          if (!allowedMimeTypes.includes(file.type.toLowerCase()) && !file.name.toLowerCase().endsWith(".pdf")) {
            return Response.json(
              { 
                success: false, 
                error: `Invalid file type. Allowed formats: JPEG, PNG, WEBP, PDF. Received: ${file.type}` 
              },
              { status: 400 }
            );
          }

          // 3. File size validation (Max 15 MB)
          const maxSizeBytes = 15 * 1024 * 1024;
          if (file.size > maxSizeBytes) {
            return Response.json(
              { success: false, error: "File size exceeds the maximum limit of 15MB." },
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
          
          // Sanitize basename to alphanumeric, dashes and underscores
          const sanitizedBase = baseName
            .replace(/[^a-zA-Z0-9.-]/g, "_")
            .replace(/_{2,}/g, "_");

          const filename = `${timestamp}-${randomHex}-${sanitizedBase}${fileExtension}`;

          // 5. Dynamic Year/Month folder calculation for notices/documents
          // e.g. 2026/07, 2026/08, 2027/01
          const now = new Date();
          const year = now.getFullYear().toString();
          const month = String(now.getMonth() + 1).padStart(2, "0");

          let relativeFolder = "";
          if (
            mod === "notices" ||
            mod === "documents" ||
            mod === "date" ||
            mod === "uploads" ||
            mod === "general" ||
            cat === "date" ||
            fileExtension === ".pdf" ||
            !mod
          ) {
            relativeFolder = `${year}/${month}`;
          } else if (mod === "engineering") {
            relativeFolder = `facilities/engineering-cell/${year}/${month}`;
          } else if (mod === "clubs") {
            relativeFolder = `facilities/clubs/${year}/${month}`;
          } else if (mod === "amenities") {
            relativeFolder = `facilities/amenities/${year}/${month}`;
          } else {
            relativeFolder = `${mod}/${year}/${month}`;
          }

          const baseDir = path.join(process.cwd(), "local-assets", "uploads");
          const targetDir = path.join(baseDir, relativeFolder);

          if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
          }

          const targetFilePath = path.join(targetDir, filename);

          // Write file content buffer to disk
          const arrayBuffer = await file.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          fs.writeFileSync(targetFilePath, buffer);

          // 6. Return relative DB path: local-assets/uploads/YYYY/MM/filename.ext
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
