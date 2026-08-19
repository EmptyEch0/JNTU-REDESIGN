import { createFileRoute } from "@tanstack/react-router";
import { db } from "@/db";
import { socialConnections } from "@/db/schema";
import { eq } from "drizzle-orm";
import dotenv from "dotenv";
dotenv.config({ override: true });

export const Route = createFileRoute("/api/admin/social/callback/linkedin")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { getCookie, deleteCookie } = await import("@tanstack/react-start/server");
        
        try {
          const url = new URL(request.url);
          const code = url.searchParams.get("code");
          const state = url.searchParams.get("state");
          
          const errorParam = url.searchParams.get("error");
          const errorDesc = url.searchParams.get("error_description");
          if (errorParam) {
            return new Response(`LinkedIn OAuth error: ${errorDesc || errorParam}`, { status: 400 });
          }
          
          const savedState = getCookie("linkedin_oauth_state");
          deleteCookie("linkedin_oauth_state", { path: "/" });

          if (!savedState || savedState !== state) {
            return new Response("Security validation failed (State mismatch). Please reconnect.", { status: 400 });
          }

          const redirectTo = getCookie("social_redirect_to") || "/notices";
          deleteCookie("social_redirect_to", { path: "/" });

          if (!code) {
            return new Response("Authorization code is missing from LinkedIn callback", { status: 400 });
          }

          const clientId = process.env.LINKEDIN_CLIENT_ID;
          const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
          
          if (!clientId || !clientSecret) {
            return new Response("Server configuration error: LinkedIn credentials missing", { status: 500 });
          }

          const siteUrl = (process.env.VITE_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
          const redirectUri = `${siteUrl}/api/admin/social/callback/linkedin`;

          if (code === "mock_code" || clientId.startsWith("mock")) {
            const expiresAt = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);
            const name = "Personal Profile";
            const memberId = "mock_member_id";
            
            const [existing] = await db
              .select()
              .from(socialConnections)
              .where(eq(socialConnections.id, "linkedin"));

            if (existing) {
              await db
                .update(socialConnections)
                .set({
                  accessToken: "mock_linkedin_token",
                  expiresAt,
                  connectedAs: name,
                  metadata: { memberId },
                  updatedAt: new Date(),
                })
                .where(eq(socialConnections.id, "linkedin"));
            } else {
              await db.insert(socialConnections).values({
                id: "linkedin",
                accessToken: "mock_linkedin_token",
                expiresAt,
                connectedAs: name,
                metadata: { memberId },
              });
            }

            return new Response(null, {
              status: 302,
              headers: {
                Location: redirectTo,
              },
            });
          }

          // 1. Exchange authorization code for User Access Token
          const tokenExchangeBody = new URLSearchParams({
            grant_type: "authorization_code",
            code,
            redirect_uri: redirectUri,
            client_id: clientId,
            client_secret: clientSecret,
          });

          const tokenRes = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: tokenExchangeBody.toString(),
          });

          const tokenData = await tokenRes.json();

          if (!tokenRes.ok || tokenData.error) {
            console.error("LinkedIn Token Exchange Error:", tokenData);
            return new Response(`LinkedIn OAuth exchange failed: ${tokenData.error_description || tokenData.error || "Unknown error"}`, { status: 400 });
          }

          const accessToken = tokenData.access_token;
          const expiresInSeconds = tokenData.expires_in || (60 * 24 * 60 * 60); // Default to 60 days
          const expiresAt = new Date(Date.now() + expiresInSeconds * 1000);
          const refreshToken = tokenData.refresh_token || null;

          // 2. Fetch the connected LinkedIn Member Profile details using OpenID Connect (OIDC) userinfo endpoint
          const userinfoRes = await fetch("https://api.linkedin.com/v2/userinfo", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (!userinfoRes.ok) {
            const errBody = await userinfoRes.text();
            console.error("LinkedIn User Info Fetch Error:", errBody);
            return new Response(`Failed to retrieve LinkedIn member info: ${errBody}`, { status: 400 });
          }

          const userinfo = await userinfoRes.json();
          const memberId = userinfo.sub; // This is the person's unique member ID/URN component
          const name = userinfo.name || `${userinfo.given_name} ${userinfo.family_name}`.trim() || "LinkedIn Profile";

          if (!memberId) {
            return new Response("Could not resolve LinkedIn member identifier", { status: 400 });
          }

          // 3. Save/update connection details in DB
          const [existing] = await db
            .select()
            .from(socialConnections)
            .where(eq(socialConnections.id, "linkedin"));

          if (existing) {
            await db
              .update(socialConnections)
              .set({
                accessToken,
                refreshToken,
                expiresAt,
                connectedAs: name,
                metadata: { memberId },
                updatedAt: new Date(),
              })
              .where(eq(socialConnections.id, "linkedin"));
          } else {
            await db.insert(socialConnections).values({
              id: "linkedin",
              accessToken,
              refreshToken,
              expiresAt,
              connectedAs: name,
              metadata: { memberId },
            });
          }

          // 4. Redirect back to notices administration panel
          return new Response(null, {
            status: 302,
            headers: {
              Location: redirectTo,
            },
          });
        } catch (error: any) {
          console.error("LinkedIn Callback Handler Error:", error);
          return new Response("Internal Server Error: " + error.message, { status: 500 });
        }
      },
    },
  },
});
