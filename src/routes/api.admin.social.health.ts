import { createFileRoute } from "@tanstack/react-router";
import { db } from "@/db";
import { sql } from "drizzle-orm";

export const Route = createFileRoute("/api/admin/social/health")({
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

          // Test database connectivity
          let dbStatus = "connected";
          try {
            await db.execute(sql`SELECT 1`);
          } catch (err: any) {
            dbStatus = `disconnected: ${err.message || "Unknown database error"}`;
          }

          const linkedinConfigured = !!(
            process.env.LINKEDIN_CLIENT_ID && 
            process.env.LINKEDIN_CLIENT_SECRET
          );

          const postingMode = process.env.LINKEDIN_POSTING_MODE || "personal";

          return Response.json({
            database: dbStatus,
            linkedinConfigured,
            postingMode,
          });
        } catch (error: any) {
          console.error("Health check failure:", error);
          return Response.json({ success: false, error: error.message }, { status: 500 });
        }
      },
    },
  },
});
