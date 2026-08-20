import { createFileRoute } from "@tanstack/react-router";
import { db } from "@/db";
import { socialConnections } from "@/db/schema";
import { eq } from "drizzle-orm";

export const Route = createFileRoute("/api/admin/social/diagnostics")({
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

          // 2. Read Env Configurations
          const envChecks = {
            instagram: {
              META_APP_ID: !!process.env.META_APP_ID,
              META_APP_SECRET: !!process.env.META_APP_SECRET,
              INSTAGRAM_BUSINESS_ACCOUNT_ID: !!process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID,
              VITE_SITE_URL: !!process.env.VITE_SITE_URL,
            },
            linkedin: {
              LINKEDIN_CLIENT_ID: !!process.env.LINKEDIN_CLIENT_ID,
              LINKEDIN_CLIENT_SECRET: !!process.env.LINKEDIN_CLIENT_SECRET,
              VITE_SITE_URL: !!process.env.VITE_SITE_URL,
            }
          };

          // 3. Query DB Token Connections
          let dbConnectionsOk = false;
          let activeInstagramConnection = false;
          let activeLinkedInConnection = false;
          let instagramAccountName: string | null = null;
          let linkedInAccountName: string | null = null;

          try {
            const connections = await db.select().from(socialConnections);
            dbConnectionsOk = true;

            const now = new Date();
            const instagramConn = connections.find((c) => c.id === "instagram");
            const linkedinConn = connections.find((c) => c.id === "linkedin");

            if (instagramConn && instagramConn.accessToken) {
              const expired = instagramConn.expiresAt && instagramConn.expiresAt < now;
              activeInstagramConnection = !expired;
              instagramAccountName = instagramConn.connectedAs;
            }

            if (linkedinConn && linkedinConn.accessToken) {
              const expired = linkedinConn.expiresAt && linkedinConn.expiresAt < now;
              activeLinkedInConnection = !expired;
              linkedInAccountName = linkedinConn.connectedAs;
            }
          } catch (dbErr) {
            console.error("Diagnostics DB Query Error:", dbErr);
          }

          // 4. Synthesize Overall Status
          const isInstagramReady = 
            envChecks.instagram.META_APP_ID && 
            envChecks.instagram.META_APP_SECRET && 
            envChecks.instagram.INSTAGRAM_BUSINESS_ACCOUNT_ID &&
            envChecks.instagram.VITE_SITE_URL;

          const isLinkedInReady = 
            envChecks.linkedin.LINKEDIN_CLIENT_ID && 
            envChecks.linkedin.LINKEDIN_CLIENT_SECRET &&
            envChecks.linkedin.VITE_SITE_URL;

          return Response.json({
            success: true,
            database: {
              ok: dbConnectionsOk,
            },
            instagram: {
              ready: isInstagramReady,
              META_APP_ID: envChecks.instagram.META_APP_ID ? "configured" : "MISSING",
              META_APP_SECRET: envChecks.instagram.META_APP_SECRET ? "configured" : "MISSING",
              INSTAGRAM_BUSINESS_ACCOUNT_ID: envChecks.instagram.INSTAGRAM_BUSINESS_ACCOUNT_ID ? "configured" : "MISSING",
              VITE_SITE_URL: envChecks.instagram.VITE_SITE_URL ? "configured" : "MISSING",
              activeOAuthToken: activeInstagramConnection ? "ACTIVE" : "MISSING_OR_EXPIRED",
              connectedAs: instagramAccountName,
            },
            linkedin: {
              ready: isLinkedInReady,
              LINKEDIN_CLIENT_ID: envChecks.linkedin.LINKEDIN_CLIENT_ID ? "configured" : "MISSING",
              LINKEDIN_CLIENT_SECRET: envChecks.linkedin.LINKEDIN_CLIENT_SECRET ? "configured" : "MISSING",
              VITE_SITE_URL: envChecks.linkedin.VITE_SITE_URL ? "configured" : "MISSING",
              activeOAuthToken: activeLinkedInConnection ? "ACTIVE" : "MISSING_OR_EXPIRED",
              connectedAs: linkedInAccountName,
            }
          });
        } catch (error: any) {
          console.error("Diagnostics Endpoint Error:", error);
          return Response.json({ success: false, error: error.message }, { status: 500 });
        }
      },
    },
  },
});
