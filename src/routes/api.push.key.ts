import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/push/key")({
  server: {
    handlers: {
      GET: async () => {
        const publicKey = process.env.VAPID_PUBLIC_KEY || process.env.VITE_VAPID_PUBLIC_KEY || "";
        return Response.json({ publicKey });
      },
    },
  },
});
