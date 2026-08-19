import { createFileRoute } from "@tanstack/react-router";
import { db } from "@/db";
import { campusGallery, socialConnections, socialPosts } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import dotenv from "dotenv";
dotenv.config({ override: true });
import fs from "fs";
import path from "path";

function getPublicUrl(pathStr: string): string {
  if (!pathStr) return "";
  const siteUrl = (process.env.VITE_SITE_URL || "https://jntugvcev.edu.in").replace(/\/$/, "");
  
  if (pathStr.startsWith("http://") || pathStr.startsWith("https://")) {
    return pathStr.replace(/https?:\/\/(localhost(:\d+)?|89\.116\.134\.182(:\d+)?)/, siteUrl);
  }
  
  let cleanPath = pathStr.trim().replace(/\\/g, "/");
  if (cleanPath.startsWith("/")) cleanPath = cleanPath.substring(1);
  if (cleanPath.startsWith("local-assets/")) {
    cleanPath = cleanPath.substring("local-assets/".length);
  }
  return `${siteUrl}/local-assets/${cleanPath}`;
}

async function getImageBuffer(urlOrPath: string): Promise<{ buffer: Buffer; mimeType: string }> {
  const ext = urlOrPath.split("?")[0].split(".").pop()?.toLowerCase();
  let mimeType = "image/jpeg";
  if (ext === "png") mimeType = "image/png";
  else if (ext === "webp") mimeType = "image/webp";

  if (!urlOrPath.startsWith("http://") && !urlOrPath.startsWith("https://")) {
    let cleanPath = urlOrPath.trim().replace(/\\/g, "/");
    if (cleanPath.startsWith("/")) cleanPath = cleanPath.substring(1);
    
    // Check if the path is relative to the project root (e.g. starts with src/)
    if (cleanPath.startsWith("src/")) {
      const diskPath = path.join(process.cwd(), cleanPath);
      if (fs.existsSync(diskPath)) {
        return { buffer: fs.readFileSync(diskPath), mimeType };
      }
    }
    
    const baseDir = path.join(process.cwd(), "local-assets");
    const relativePath = cleanPath.startsWith("local-assets/") 
      ? cleanPath.substring("local-assets/".length) 
      : cleanPath;
      
    const diskPath = path.join(baseDir, relativePath);
    if (fs.existsSync(diskPath)) {
      return { buffer: fs.readFileSync(diskPath), mimeType };
    }
  }

  const publicUrl = getPublicUrl(urlOrPath);
  const res = await fetch(publicUrl);
  if (!res.ok) {
    throw new Error(`Failed to fetch image from URL: ${publicUrl}`);
  }
  const arrayBuffer = await res.arrayBuffer();
  return { buffer: Buffer.from(arrayBuffer), mimeType };
}

async function getLinkedinAuthorUrn(accessToken: string, memberId: string): Promise<string> {
  const postingMode = process.env.LINKEDIN_POSTING_MODE || "personal";
  
  if (postingMode === "organization") {
    const envOrgId = process.env.LINKEDIN_ORGANIZATION_ID;
    if (envOrgId) {
      return `urn:li:organization:${envOrgId}`;
    }

    const vanityName = process.env.LINKEDIN_ORGANIZATION_VANITY_NAME || "jntugv";
    console.log("LinkedIn organization lookup started for vanityName:", vanityName);
    
    const res = await fetch(`https://api.linkedin.com/rest/organizations?vanityName=${vanityName}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "LinkedIn-Version": "202603",
        "X-Restli-Protocol-Version": "2.0.0",
      },
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`LinkedIn organization lookup failed: Status ${res.status} - ${errText}`);
      throw new Error(`LinkedIn organization was not found or the authenticated account does not have permission to post for this organization.`);
    }

    const data = await res.json();
    if (data.elements && data.elements.length > 0) {
      const orgId = data.elements[0].id;
      return `urn:li:organization:${orgId}`;
    }

    throw new Error("LinkedIn organization was not found or the authenticated account does not have permission to post for this organization.");
  }

  // Personal mode
  return `urn:li:person:${memberId}`;
}

async function fetchWithTimeout(url: string, options: any, timeoutMs = 15000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error: any) {
    clearTimeout(id);
    if (error.name === "AbortError") {
      throw new Error("Request to LinkedIn timed out after 15 seconds.");
    }
    throw error;
  }
}

export const Route = createFileRoute("/api/admin/gallery/$id/linkedin")({
  server: {
    handlers: {
      POST: async ({ request, params }) => {
        const id = Number(params.id);
        if (isNaN(id)) {
          return Response.json({ success: false, error: "Invalid Gallery ID" }, { status: 400 });
        }

        console.log("Publish request received for gallery item:", id);

        try {
          const { getCookie } = await import("@tanstack/react-start/server");
          const { authService } = await import("@/auth/auth.service");

          // 1. Validate admin authentication
          const token = getCookie("admin_session_token");
          if (!token) {
            return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
          }

          const userAgent = request.headers.get("user-agent") || null;
          const ipAddress = request.headers.get("x-forwarded-for") || null;
          const admin = await authService.validateSession(token, ipAddress, userAgent);
          if (!admin) {
            return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
          }

          // 2. Validate database availability
          try {
            await db.execute(sql`SELECT 1`);
          } catch (dbErr: any) {
            console.error("Database availability check failed:", dbErr);
            return Response.json({
              success: false,
              error: "The database is currently unavailable due to DNS or network timeouts.",
              code: "DATABASE_UNAVAILABLE"
            }, { status: 503 });
          }

          // 3. Fetch gallery item
          const [gallery] = await db.select().from(campusGallery).where(eq(campusGallery.id, id));
          if (!gallery) {
            return Response.json({ success: false, error: "Gallery item not found" }, { status: 404 });
          }

          // 4. Parse customized commentary
          const body = await request.json();
          const commentary = body.caption?.trim() || gallery.caption || "Campus Moment";

          // 5. Validate credentials
          const [conn] = await db
            .select()
            .from(socialConnections)
            .where(eq(socialConnections.id, "linkedin"));

          if (!conn || !conn.accessToken || (conn.expiresAt && conn.expiresAt < new Date())) {
            return Response.json({
              success: false,
              error: "LinkedIn account not connected or access token has expired.",
              code: "LINKEDIN_NOT_CONNECTED"
            }, { status: 400 });
          }

          const memberId = conn.metadata?.memberId;
          if (!memberId) {
            return Response.json({
              success: false,
              error: "LinkedIn connection is missing member profile identifier",
              code: "LINKEDIN_NOT_CONNECTED"
            }, { status: 400 });
          }

          // Mock simulation mode check
          if (conn.accessToken.startsWith("mock") || memberId.startsWith("mock")) {
            const postId = "mock_linkedin_post_id_" + Math.random().toString(36).substring(7);
            const postUrl = `https://www.linkedin.com/feed/update/${postId}`;
            
            await db
              .update(campusGallery)
              .set({
                linkedinPosted: true,
                linkedinPostId: postId,
                linkedinPostedAt: new Date(),
                linkedinError: null,
              })
              .where(eq(campusGallery.id, id));

            await db.insert(socialPosts).values({
              content: commentary,
              platform: "linkedin",
              postId: postId,
              postUrl: postUrl,
              status: "published",
              publishedAt: new Date(),
            });

            console.log("Post saved to database (mock).");

            return Response.json({
              success: true,
              postId: postId,
              postUrl: postUrl,
              status: "published"
            });
          }

          // 6. Identify posting mode & author
          let authorUrn: string;
          try {
            authorUrn = await getLinkedinAuthorUrn(conn.accessToken, memberId);
          } catch (err: any) {
            console.error("LinkedIn Author Detection Error:", err);
            return Response.json({
              success: false,
              error: err.message || "Failed to identify the LinkedIn author profile.",
              code: "LINKEDIN_ORGANIZATION_NOT_ACCESSIBLE"
            }, { status: 400 });
          }

          console.log("LinkedIn account identified:", authorUrn);

          // 7. LinkedIn Image Upload Flow
          // Step A: Register the image upload
          console.log("Calling LinkedIn API: Registering image...");
          const registerRes = await fetchWithTimeout("https://api.linkedin.com/rest/images?action=initializeUpload", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${conn.accessToken}`,
              "LinkedIn-Version": "202603",
              "X-Restli-Protocol-Version": "2.0.0",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              initializeUploadRequest: {
                owner: authorUrn,
              },
            }),
          });

          const registerData = await registerRes.json();
          console.log("LinkedIn API response received for image registration. Status:", registerRes.status);
          if (!registerRes.ok || registerData.error) {
            const errMsg = registerData.message || registerData.error?.message || JSON.stringify(registerData);
            throw new Error(`Failed to initialize image upload on LinkedIn: (${registerRes.status}) ${errMsg}`);
          }

          const uploadUrl = registerData.value.uploadUrl;
          const imageUrn = registerData.value.image;

          // Step B: Upload image binary
          console.log("Calling LinkedIn API: Uploading image binary...");
          const { buffer, mimeType } = await getImageBuffer(gallery.src);
          
          const uploadRes = await fetchWithTimeout(uploadUrl, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${conn.accessToken}`,
              "Content-Type": mimeType,
            },
            body: buffer,
          });

          if (!uploadRes.ok) {
            const errText = await uploadRes.text();
            throw new Error(`Failed to upload image binary to LinkedIn: ${errText}`);
          }

          // Step C: Create the Post on LinkedIn
          console.log("Calling LinkedIn API: Creating post...");
          const postPayload = {
            author: authorUrn,
            commentary: commentary,
            visibility: "PUBLIC",
            distribution: {
              feedDistribution: "MAIN_FEED",
            },
            content: {
              media: {
                id: imageUrn,
              },
            },
            lifecycleState: "PUBLISHED",
          };

          const postRes = await fetchWithTimeout("https://api.linkedin.com/rest/posts", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${conn.accessToken}`,
              "LinkedIn-Version": "202603",
              "X-Restli-Protocol-Version": "2.0.0",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(postPayload),
          });

          console.log("LinkedIn API response received for post creation. Status:", postRes.status);
          let postId = postRes.headers.get("x-restli-id");
          
          if (!postRes.ok) {
            const errBody = await postRes.text();
            throw new Error(`LinkedIn post creation failed: ${errBody}`);
          }

          if (!postId) {
            try {
              const body = await postRes.json();
              postId = body.id || "urn:li:share:success";
            } catch {
              postId = "urn:li:share:success";
            }
          }

          const postUrl = `https://www.linkedin.com/feed/update/${postId}`;

          // 8. Update database tables
          await db
            .update(campusGallery)
            .set({
              linkedinPosted: true,
              linkedinPostId: postId,
              linkedinPostedAt: new Date(),
              linkedinError: null,
            })
            .where(eq(campusGallery.id, id));

          await db.insert(socialPosts).values({
            content: commentary,
            platform: "linkedin",
            postId: postId || "urn:li:share:success",
            postUrl: postUrl,
            status: "published",
            publishedAt: new Date(),
          });

          console.log("Post saved to database.");

          return Response.json({
            success: true,
            postId: postId,
            postUrl: postUrl,
            status: "published"
          });
        } catch (error: any) {
          console.error("LinkedIn gallery publish error:", {
            name: error?.name,
            message: error?.message,
            code: error?.code,
            cause: error?.cause,
          });
          
          let errMsg = error.message || "Unknown error occurred";
          let errCode = "LINKEDIN_PUBLISH_FAILED";

          if (error.code === "ECONNRESET" || error.message?.includes("ECONNRESET") || error.cause?.code === "ECONNRESET") {
            errMsg = "The connection to LinkedIn was unexpectedly reset. Please try again.";
            errCode = "LINKEDIN_NETWORK_ERROR";
          } else if (error.name === "AbortError" || error.message?.includes("timed out")) {
            errMsg = "The request to LinkedIn timed out. Please try again.";
            errCode = "LINKEDIN_TIMEOUT";
          } else if (error.message?.includes("organization was not found")) {
            errCode = "LINKEDIN_ORGANIZATION_NOT_ACCESSIBLE";
          }

          // Try to update gallery status in DB (wrap in catch so db issues do not swallow original error)
          try {
            await db
              .update(campusGallery)
              .set({
                linkedinError: errMsg,
              })
              .where(eq(campusGallery.id, id));
          } catch (dbErr) {
            console.error("Secondary database update failed:", dbErr);
          }

          return Response.json({
            success: false,
            error: errMsg,
            code: errCode
          }, { status: 500 });
        }
      },
    },
  },
});
