import { createFileRoute } from '@tanstack/react-router'
import dotenv from "dotenv";
dotenv.config({ override: true });

export const Route = createFileRoute("/api/admin/social/connect/instagram")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const { getCookie, setCookie } = await import("@tanstack/react-start/server");
          const { authService } = await import("@/auth/auth.service");
          
          // 1. Validate admin authentication
          const token = getCookie("admin_session_token");
          if (!token) {
            return new Response("Unauthorized: Session token missing", { status: 401 });
          }
          
          // Construct request context details for validation
          const userAgent = request.headers.get("user-agent") || null;
          const ipAddress = request.headers.get("x-forwarded-for") || null;
          const admin = await authService.validateSession(token, ipAddress, userAgent);
          if (!admin) {
            return new Response("Unauthorized: Invalid session", { status: 401 });
          }

          // 2. Check credentials
          const appId = process.env.META_APP_ID;
          if (!appId) {
            return new Response("Meta App ID is not configured on the server", { status: 500 });
          }

          // 3. Generate state and set secure cookie
          const state = crypto.randomUUID();
          setCookie("instagram_oauth_state", state, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 300, // 5 minutes
            sameSite: "lax",
          });

          const requestUrl = new URL(request.url);
          const redirectTo = requestUrl.searchParams.get("redirect_to") || "/notices";
          setCookie("social_redirect_to", redirectTo, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 300,
            sameSite: "lax",
          });

          // 4. Construct redirect URL
          const siteUrl = (process.env.VITE_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
          const redirectUri = `${siteUrl}/api/admin/social/callback/instagram`;
          
          if (appId.startsWith("mock")) {
            return new Response(null, {
              status: 302,
              headers: {
                Location: `/api/admin/social/callback/instagram?code=mock_code&state=${state}`,
              },
            });
          }
          
          const metaUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(
            redirectUri
          )}&scope=instagram_basic,instagram_content_publish,pages_show_list,pages_read_engagement&state=${state}`;

          return new Response(null, {
            status: 302,
            headers: {
              Location: metaUrl,
            },
          });
        } catch (error: any) {
          console.error("Meta Connect Error:", error);
          return new Response("Internal Server Error: " + error.message, { status: 500 });
        }
      },
    },
  },
});
