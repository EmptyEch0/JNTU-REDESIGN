import { createFileRoute } from "@tanstack/react-router";
import { db } from "@/db";
import { socialPosts } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import dotenv from "dotenv";
dotenv.config({ override: true });

export const Route = createFileRoute("/api/posts")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const { getCookie } = await import("@tanstack/react-start/server");
          const { authService } = await import("@/auth/auth.service");

          // Validate admin session
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

          const url = new URL(request.url);
          const platform = url.searchParams.get("platform");

          let query = db.select().from(socialPosts).orderBy(desc(socialPosts.id));
          if (platform) {
            query = db
              .select()
              .from(socialPosts)
              .where(eq(socialPosts.platform, platform))
              .orderBy(desc(socialPosts.id)) as any;
          }

          const posts = await query;
          return Response.json({ success: true, posts });
        } catch (error: any) {
          console.error("Failed to query posts:", error);
          return Response.json({ success: false, error: error.message }, { status: 500 });
        }
      },
    },
  },
});
