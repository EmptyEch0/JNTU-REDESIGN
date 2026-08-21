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
          const module = (formData.get("module") as string | null)?.toLowerCase().trim();
          const category = (formData.get("category") as string | null)?.toLowerCase().trim();
          const dept = (formData.get("dept") as string | null)?.toLowerCase().trim();
          const name = (formData.get("name") as string | null)?.trim();
          const subfolder = (formData.get("subfolder") as string | null)?.trim();

          // 1. Basic field existence checks
          if (!file) {
            return Response.json(
              { success: false, error: "No file was uploaded." },
              { status: 400 }
            );
          }

          // 2. File type validation
          // Allowed: JPEG, JPG, PNG, WEBP, SVG, PDF
          const allowedMimeTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
            "image/svg+xml",
            "application/pdf",
          ];
          
          const fileExtension = path.extname(file.name).toLowerCase();
          const isPdf = fileExtension === ".pdf" || file.type === "application/pdf";
          
          if (!allowedMimeTypes.includes(file.type.toLowerCase()) && !isPdf) {
            return Response.json(
              { 
                success: false, 
                error: `Invalid file type. Allowed formats: JPEG, PNG, WEBP, SVG, PDF. Received: ${file.type}` 
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
          // Format: {sanitized-name}-{timestamp}-{random}.ext
          const timestamp = Math.floor(Date.now() / 1000);
          const randomHex = crypto.randomBytes(3).toString("hex");
          
          let sanitizedName = "";
          if (name) {
            sanitizedName = name
              .toLowerCase()
              .replace(/[^a-zA-Z0-9]+/g, "-")
              .replace(/^-+|-+$/g, "");
          }

          if (!sanitizedName) {
            const baseName = path.basename(file.name, fileExtension);
            sanitizedName = baseName
              .toLowerCase()
              .replace(/[^a-zA-Z0-9]+/g, "-")
              .replace(/^-+|-+$/g, "");
          }

          // Ensure sanitizedName is not empty
          if (!sanitizedName) {
            sanitizedName = "file";
          }

          const filename = `${sanitizedName}-${timestamp}-${randomHex}${fileExtension}`;

          // 5. Organized Folder Structure Calculation
          const now = new Date();
          const year = now.getFullYear().toString();
          const month = String(now.getMonth() + 1).padStart(2, "0");

          let relativeFolder = "";
          const mod = module || "general";
          const cat = category || "general";

          // Department-scoped uploads (Faculty, HOD, Timetables, Labs, Gallery, Banners)
          if (dept || mod === "departments") {
            const targetDept = dept || (mod === "departments" && cat !== "general" && cat !== "date" ? cat : "general");
            
            if (cat === "faculty" || mod === "faculty") {
              relativeFolder = `departments/${targetDept}/faculty`;
            } else if (cat === "timetables" || cat === "timetable" || mod === "timetables") {
              relativeFolder = `departments/${targetDept}/timetables`;
            } else if (cat === "hod") {
              relativeFolder = `departments/${targetDept}/hod`;
            } else if (cat === "labs" || cat === "lab") {
              relativeFolder = `departments/${targetDept}/labs`;
            } else if (cat === "gallery") {
              relativeFolder = `departments/${targetDept}/gallery`;
            } else if (cat === "banners" || cat === "banner") {
              relativeFolder = `departments/${targetDept}/banners`;
            } else if (cat && cat !== "general" && cat !== "date") {
              relativeFolder = `departments/${targetDept}/${cat}`;
            } else {
              relativeFolder = `departments/${targetDept}`;
            }
          }
          // Global Faculty uploads
          else if (mod === "faculty" || cat === "faculty") {
            relativeFolder = `faculty`;
          }
          // Global / Institutional Timetables
          else if (mod === "timetables" || cat === "timetables" || cat === "timetable") {
            relativeFolder = `timetables/${year}`;
          }
          // Notices and Circulars
          else if (mod === "notices" || mod === "circulars" || cat === "notices" || cat === "circulars") {
            relativeFolder = `notices/${year}/${month}`;
          }
          // University / Campus Gallery
          else if (mod === "gallery") {
            relativeFolder = `gallery/${cat || "campus"}`;
          }
          // Logos & Institutional Branding
          else if (mod === "branding" || mod === "logo" || mod === "settings" || cat === "logo" || cat === "branding") {
            relativeFolder = `branding`;
          }
          // Campus Facilities & Units (Dispensary, Hostels, Sports, Library, Bank, Amenities, Clubs, Engineering Cell)
          else if (mod === "facilities" || mod === "amenities" || mod === "clubs" || mod === "engineering" || mod === "dispensary" || mod === "hostels" || mod === "sports" || mod === "library") {
            const facilityName = cat !== "general" && cat !== "date" ? cat : mod;
            relativeFolder = `facilities/${facilityName}`;
          }
          // Custom subfolder if explicitly provided
          else if (subfolder) {
            relativeFolder = subfolder.replace(/^\/+|\/+$/g, "");
          }
          // Default fallback organized by module and date
          else {
            relativeFolder = `${mod}/${cat !== "general" && cat !== "date" ? `${cat}/` : ""}${year}/${month}`;
          }

          // Clean up any double slashes
          relativeFolder = relativeFolder.replace(/\/{2,}/g, "/");

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

          // 6. Return relative DB path: local-assets/uploads/...
          const relativeDbPath = `local-assets/uploads/${relativeFolder}/${filename}`;

          return Response.json({
            success: true,
            path: relativeDbPath,
            url: `/${relativeDbPath}`,
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
