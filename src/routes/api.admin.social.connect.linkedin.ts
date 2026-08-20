import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/admin/social/connect/linkedin")({
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
          
          const userAgent = request.headers.get("user-agent") || null;
          const ipAddress = request.headers.get("x-forwarded-for") || null;
          const admin = await authService.validateSession(token, ipAddress, userAgent);
          if (!admin) {
            return new Response("Unauthorized: Invalid session", { status: 401 });
          }

          // 2. Check credentials
          const clientId = process.env.LINKEDIN_CLIENT_ID;
          if (!clientId) {
            return new Response("LinkedIn Client ID is not configured on the server", { status: 500 });
          }

          // 3. Generate state and set secure cookie
          const state = crypto.randomUUID();
          setCookie("linkedin_oauth_state", state, {
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
          const redirectUri = `${siteUrl}/api/admin/social/callback/linkedin`;
          
          if (clientId.startsWith("mock")) {
            return new Response(null, {
              status: 302,
              headers: {
                Location: `/api/admin/social/callback/linkedin?code=mock_code&state=${state}`,
              },
            });
          }

          const scope = process.env.LINKEDIN_OAUTH_SCOPES || "openid profile email w_member_social w_organization_social";
          const linkedinUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
            redirectUri
          )}&state=${state}&scope=${encodeURIComponent(scope)}`;

          return new Response(null, {
            status: 302,
            headers: {
              Location: linkedinUrl,
            },
          });
        } catch (error: any) {
          console.error("LinkedIn Connect Error:", error);
          return new Response("Internal Server Error: " + error.message, { status: 500 });
        }
      },
    },
  },
});
