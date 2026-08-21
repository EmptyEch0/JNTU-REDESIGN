import { createFileRoute } from "@tanstack/react-router";
import { sendPushToAllSubscribers } from "@/funcs/push.server";

export const Route = createFileRoute("/api/push/send")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { getCookie } = await import("@tanstack/react-start/server");
          const { authService } = await import("@/auth/auth.service");

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

          const body = await request.json();
          if (!body.title || !body.body) {
            return Response.json(
              { success: false, error: "Title and body are required." },
              { status: 400 }
            );
          }

          const result = await sendPushToAllSubscribers({
            title: body.title,
            body: body.body,
            url: body.url || "/notices",
            tag: body.tag,
          });

          return Response.json(result);
        } catch (error: any) {
          console.error("Push send API error:", error);
          return Response.json({ success: false, error: error.message }, { status: 500 });
        }
      },
    },
  },
});
