import { createFileRoute } from "@tanstack/react-router";
import { db } from "@/db";
import { socialConnections } from "@/db/schema";
import { eq } from "drizzle-orm";

export const Route = createFileRoute("/api/admin/social/callback/instagram")({
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
            return new Response(`Meta OAuth error: ${errorDesc || errorParam}`, { status: 400 });
          }
          
          const savedState = getCookie("instagram_oauth_state");
          deleteCookie("instagram_oauth_state", { path: "/" });

          if (!savedState || savedState !== state) {
            return new Response("Security validation failed (State mismatch). Please reconnect.", { status: 400 });
          }

          const redirectTo = getCookie("social_redirect_to") || "/notices";
          deleteCookie("social_redirect_to", { path: "/" });

          if (!code) {
            return new Response("Authorization code is missing from Meta callback", { status: 400 });
          }

          const appId = process.env.META_APP_ID;
          const appSecret = process.env.META_APP_SECRET;
          
          if (!appId || !appSecret) {
            return new Response("Server configuration error: Meta credentials missing", { status: 500 });
          }

          const siteUrl = (process.env.VITE_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
          const redirectUri = `${siteUrl}/api/admin/social/callback/instagram`;

          if (code === "mock_code" || appId.startsWith("mock")) {
            const expiresAt = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);
            const connectedAs = "_glitch_48";
            
            const [existing] = await db
              .select()
              .from(socialConnections)
              .where(eq(socialConnections.id, "instagram"));

            if (existing) {
              await db
                .update(socialConnections)
                .set({
                  accessToken: "mock_long_lived_token",
                  expiresAt,
                  connectedAs,
                  updatedAt: new Date(),
                })
                .where(eq(socialConnections.id, "instagram"));
            } else {
              await db.insert(socialConnections).values({
                id: "instagram",
                accessToken: "mock_long_lived_token",
                expiresAt,
                connectedAs,
              });
            }

            return new Response(null, {
              status: 302,
              headers: {
                Location: redirectTo,
              },
            });
          }

          // 1. Exchange authorization code for short-lived User Access Token
          const tokenExchangeUrl = `https://graph.facebook.com/v19.0/oauth/access_token?client_id=${appId}&redirect_uri=${encodeURIComponent(
            redirectUri
          )}&client_secret=${appSecret}&code=${code}`;

          const tokenRes = await fetch(tokenExchangeUrl);
          const tokenData = await tokenRes.json();

          if (tokenData.error) {
            console.error("Meta Token Exchange Error:", tokenData.error);
            return new Response(`Meta OAuth exchange failed: ${tokenData.error.message}`, { status: 400 });
          }

          const shortLivedToken = tokenData.access_token;

          // 2. Exchange short-lived token for long-lived User Access Token (valid for 60 days)
          const longLivedExchangeUrl = `https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${shortLivedToken}`;
          
          const longLivedRes = await fetch(longLivedExchangeUrl);
          const longLivedData = await longLivedRes.json();

          if (longLivedData.error) {
            console.error("Meta Long-Lived Token Exchange Error:", longLivedData.error);
            return new Response(`Meta long-lived token exchange failed: ${longLivedData.error.message}`, { status: 400 });
          }

          const longLivedToken = longLivedData.access_token;
          const expiresInSeconds = longLivedData.expires_in || (60 * 24 * 60 * 60); // Default to 60 days
          const expiresAt = new Date(Date.now() + expiresInSeconds * 1000);

          // 3. Optional: Retrieve Instagram profile username using INSTAGRAM_BUSINESS_ACCOUNT_ID
          let connectedAs = "_glitch_48"; // Default fallback
          const instagramBusinessAccountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
          if (instagramBusinessAccountId) {
            try {
              const accountDetailsUrl = `https://graph.facebook.com/v19.0/${instagramBusinessAccountId}?fields=username&access_token=${longLivedToken}`;
              const detailsRes = await fetch(accountDetailsUrl);
              if (detailsRes.ok) {
                const detailsData = await detailsRes.json();
                if (detailsData.username) {
                  connectedAs = detailsData.username;
                }
              }
            } catch (err) {
              console.warn("Could not retrieve Instagram Business Account username:", err);
            }
          }

          // 4. Save/update connection details in DB
          const [existing] = await db
            .select()
            .from(socialConnections)
            .where(eq(socialConnections.id, "instagram"));

          if (existing) {
            await db
              .update(socialConnections)
              .set({
                accessToken: longLivedToken,
                expiresAt,
                connectedAs,
                updatedAt: new Date(),
              })
              .where(eq(socialConnections.id, "instagram"));
          } else {
            await db.insert(socialConnections).values({
              id: "instagram",
              accessToken: longLivedToken,
              expiresAt,
              connectedAs,
            });
          }

          // 5. Redirect back to notices administration panel
          return new Response(null, {
            status: 302,
            headers: {
              Location: redirectTo,
            },
          });
        } catch (error: any) {
          console.error("Meta Callback Handler Error:", error);
          return new Response("Internal Server Error: " + error.message, { status: 500 });
        }
      },
    },
  },
});
