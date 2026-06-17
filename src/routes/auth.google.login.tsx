import { createFileRoute } from "@tanstack/react-router";
import { initiateGoogleLogin } from "../auth/auth.server";

export const Route = createFileRoute("/auth/google/login")({
  loader: async () => {
    await initiateGoogleLogin();
  },
  component: () => null,
});
