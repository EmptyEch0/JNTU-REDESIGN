import { createFileRoute } from "@tanstack/react-router";
import { db } from "@/db";
import { socialConnections } from "@/db/schema";
import { eq } from "drizzle-orm";

export const Route = createFileRoute("/api/admin/social/status")({
  server: {
    handlers: {
      GET: async ({ request }) => {
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

          // 2. Fetch connections
          const connections = await db.select().from(socialConnections);
          
          const instagramConn = connections.find((c) => c.id === "instagram");
          const linkedinConn = connections.find((c) => c.id === "linkedin");

          const now = new Date();

          const isInstagramConnected = !!(
            instagramConn && 
            instagramConn.accessToken && 
            (!instagramConn.expiresAt || instagramConn.expiresAt > now)
          );

          const isLinkedinConnected = !!(
            linkedinConn && 
            linkedinConn.accessToken && 
            (!linkedinConn.expiresAt || linkedinConn.expiresAt > now)
          );

          return Response.json({
            success: true,
            instagram: {
              connected: isInstagramConnected,
              connectedAs: isInstagramConnected ? instagramConn?.connectedAs || "_glitch_48" : null,
            },
            linkedin: {
              connected: isLinkedinConnected,
              connectedAs: isLinkedinConnected ? linkedinConn?.connectedAs || "LinkedIn Member" : null,
            },
          });
        } catch (error: any) {
          console.error("Fetch Social Status Error:", error);
          return Response.json({ success: false, error: error.message }, { status: 500 });
        }
      },
    },
  },
});
