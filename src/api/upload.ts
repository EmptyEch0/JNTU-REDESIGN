import { writeFile, mkdir } from "fs/promises";
import path from "path";

const UPLOAD_BASE = process.env.UPLOAD_BASE || "/var/www/local-assets/uploads";
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const module = formData.get("module") as string;
    const category = formData.get("category") as string;

    if (!file) {
      return new Response(
        JSON.stringify({ success: false, error: "No file provided" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!module || !category) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing module or category" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: `Invalid file type. Allowed: ${allowedTypes.join(', ')}` 
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB.` 
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const ext = path.extname(file.name);
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const filename = `${timestamp}-${random}${ext}`;

    const uploadDir = path.join(UPLOAD_BASE, module, category);
    await mkdir(uploadDir, { recursive: true });
    
    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    const pathUrl = `/uploads/${module}/${category}/${filename}`;
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        path: pathUrl
      }),
      { 
        status: 200, 
        headers: { "Content-Type": "application/json" } 
      }
    );
  } catch (error: any) {
    console.error("Upload error:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || "Upload failed"
      }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json" } 
      }
    );
  }
}