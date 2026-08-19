import { createFileRoute } from "@tanstack/react-router";
import { db } from "@/db";
import { socialConnections } from "@/db/schema";
import { eq } from "drizzle-orm";

export const Route = createFileRoute("/api/admin/social/disconnect")({
  server: {
    handlers: {
      POST: async ({ request }) => {
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

          // 2. Parse platform
          const { platform } = await request.json();
          if (platform !== "instagram" && platform !== "linkedin") {
            return Response.json({ success: false, error: "Invalid platform" }, { status: 400 });
          }

          // 3. Delete connection record
          await db.delete(socialConnections).where(eq(socialConnections.id, platform));

          return Response.json({ success: true });
        } catch (error: any) {
          console.error("Disconnect Error:", error);
          return Response.json({ success: false, error: error.message }, { status: 500 });
        }
      },
    },
  },
});
