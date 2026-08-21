import { createFileRoute } from "@tanstack/react-router";
import { db } from "@/db";
import { pushSubscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";

export const Route = createFileRoute("/api/push/subscribe")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const endpoint = body.endpoint;
          const p256dh = body.keys?.p256dh || body.p256dh;
          const auth = body.keys?.auth || body.auth;
          const userAgent = request.headers.get("user-agent") || null;

          if (!endpoint || !p256dh || !auth) {
            return Response.json(
              { success: false, error: "Missing required subscription parameters (endpoint, keys.p256dh, keys.auth)." },
              { status: 400 }
            );
          }

          const existing = await db
            .select({ id: pushSubscriptions.id })
            .from(pushSubscriptions)
            .where(eq(pushSubscriptions.endpoint, endpoint));

          if (existing.length > 0) {
            await db
              .update(pushSubscriptions)
              .set({ p256dh, auth, userAgent })
              .where(eq(pushSubscriptions.endpoint, endpoint));
          } else {
            await db.insert(pushSubscriptions).values({
              endpoint,
              p256dh,
              auth,
              userAgent,
            });
          }

          return Response.json({ success: true, message: "Subscribed successfully" });
        } catch (error: any) {
          console.error("Subscription API error:", error);
          return Response.json({ success: false, error: error.message }, { status: 500 });
        }
      },
    },
  },
});
