import { createFileRoute } from "@tanstack/react-router";
import { db } from "@/db";
import { campusGallery, socialConnections } from "@/db/schema";
import { eq } from "drizzle-orm";
import dotenv from "dotenv";
dotenv.config({ override: true });

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

export const Route = createFileRoute("/api/admin/gallery/$id/instagram")({
  server: {
    handlers: {
      POST: async ({ request, params }) => {
        const id = Number(params.id);
        if (isNaN(id)) {
          return Response.json({ success: false, error: "Invalid Gallery ID" }, { status: 400 });
        }

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

          // 2. Fetch gallery item
          const [gallery] = await db.select().from(campusGallery).where(eq(campusGallery.id, id));
          if (!gallery) {
            return Response.json({ success: false, error: "Gallery item not found" }, { status: 404 });
          }

          // 3. Parse customized caption
          const body = await request.json();
          const caption = body.caption?.trim() || gallery.caption || "Campus Moment";

          // 4. Validate credentials
          const [conn] = await db
            .select()
            .from(socialConnections)
            .where(eq(socialConnections.id, "instagram"));

          if (!conn || !conn.accessToken || (conn.expiresAt && conn.expiresAt < new Date())) {
            return Response.json({ success: false, error: "Instagram account is not connected or token expired" }, { status: 400 });
          }

          const businessAccountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
          if (!businessAccountId) {
            return Response.json({ success: false, error: "Instagram Business Account ID is not configured on the server" }, { status: 500 });
          }

          if (conn.accessToken.startsWith("mock") || businessAccountId.startsWith("mock")) {
            const mediaId = "mock_instagram_media_id_" + Math.random().toString(36).substring(7);
            await db
              .update(campusGallery)
              .set({
                instagramPosted: true,
                instagramPostId: mediaId,
                instagramPostedAt: new Date(),
                instagramError: null,
              })
              .where(eq(campusGallery.id, id));

            return Response.json({
              success: true,
              postId: mediaId,
            });
          }

          const imageUrl = getPublicUrl(gallery.src);

          // 5. Step A: Create media container
          const containerUrl = `https://graph.facebook.com/v19.0/${businessAccountId}/media`;
          const containerRes = await fetch(containerUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              image_url: imageUrl,
              caption: caption,
              access_token: conn.accessToken,
            }),
          });

          const containerData = await containerRes.json();
          if (!containerRes.ok || containerData.error) {
            throw new Error(containerData.error?.message || "Failed to create Instagram media container");
          }

          const containerId = containerData.id;

          // 6. Step B: Poll container status
          let finished = false;
          let attempts = 0;
          const maxAttempts = 15;
          
          while (!finished && attempts < maxAttempts) {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            attempts++;

            const statusRes = await fetch(
              `https://graph.facebook.com/v19.0/${containerId}?fields=status_code&access_token=${conn.accessToken}`
            );

            if (statusRes.ok) {
              const statusData = await statusRes.json();
              if (statusData.status_code === "FINISHED") {
                finished = true;
              } else if (statusData.status_code === "ERROR") {
                throw new Error("Meta image processing failed on the container.");
              }
            }
          }

          if (!finished) {
            throw new Error("Instagram image processing timed out on Meta's server. Try again.");
          }

          // 7. Step C: Publish the media container
          const publishUrl = `https://graph.facebook.com/v19.0/${businessAccountId}/media_publish`;
          const publishRes = await fetch(publishUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              creation_id: containerId,
              access_token: conn.accessToken,
            }),
          });

          const publishData = await publishRes.json();
          if (!publishRes.ok || publishData.error) {
            throw new Error(publishData.error?.message || "Failed to publish Instagram media container");
          }

          const mediaId = publishData.id;

          // 8. Update gallery item in DB
          await db
            .update(campusGallery)
            .set({
              instagramPosted: true,
              instagramPostId: mediaId,
              instagramPostedAt: new Date(),
              instagramError: null,
            })
            .where(eq(campusGallery.id, id));

          return Response.json({
            success: true,
            postId: mediaId,
          });
        } catch (error: any) {
          console.error("Instagram gallery publish error:", error);
          
          // Log error to DB
          await db
            .update(campusGallery)
            .set({
              instagramError: error.message || "Unknown error occurred",
            })
            .where(eq(campusGallery.id, id));

          return Response.json({ success: false, error: error.message || "Internal Server Error" }, { status: 500 });
        }
      },
    },
  },
});
