import { createFileRoute } from "@tanstack/react-router";
import { db } from "@/db";
import { pushSubscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";

export const Route = createFileRoute("/api/push/unsubscribe")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const endpoint = body.endpoint;

          if (!endpoint) {
            return Response.json({ success: false, error: "Endpoint is required" }, { status: 400 });
          }

          await db.delete(pushSubscriptions).where(eq(pushSubscriptions.endpoint, endpoint));
          return Response.json({ success: true, message: "Unsubscribed successfully" });
        } catch (error: any) {
          console.error("Unsubscribe API error:", error);
          return Response.json({ success: false, error: error.message }, { status: 500 });
        }
      },
    },
  },
});
