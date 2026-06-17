import { createFileRoute, redirect } from "@tanstack/react-router";
import { handleGoogleCallback } from "../auth/auth.server";

interface CallbackSearch {
  code?: string;
  state?: string;
  error?: string;
  email?: string;
}

export const Route = createFileRoute("/auth/google/callback")({
  validateSearch: (search: Record<string, unknown>): CallbackSearch => {
    return {
      code: (search?.code as string) || undefined,
      state: (search?.state as string) || undefined,
      error: (search?.error as string) || undefined,
      email: (search?.email as string) || undefined,
    };
  },
  loader: async ({ search, location }) => {
    // 1. Defensively extract search params from validated search parameter or location searchStr fallback
    let code = search?.code;
    let state = search?.state;
    let error = search?.error;
    let email = search?.email;

    if (!code || !state) {
      try {
        const urlParams = new URLSearchParams(location.searchStr);
        code = urlParams.get("code") || undefined;
        state = urlParams.get("state") || undefined;
        error = urlParams.get("error") || undefined;
        email = urlParams.get("email") || undefined;
      } catch (err) {
        console.error("Error parsing location searchStr in callback loader:", err);
      }
    }

    // Print received callback parameters for diagnostics
    console.log("Google OAuth Callback - Received search string:", location.searchStr);
    console.log("Google OAuth Callback - Parsed parameters:", {
      code: code ? "PRESENT" : "MISSING",
      state: state ? "PRESENT" : "MISSING",
      error: error || "NONE",
      email: email || "NONE",
    });

    // 2. Defensive handling: If Google returned an error query parameter, redirect to login page with error details
    if (error) {
      throw redirect({
        to: "/admin/",
        search: {
          error,
          email,
        },
      });
    }

    // 3. Defensive handling: If code or state are missing, redirect to admin login page with missing parameter error
    if (!code || !state) {
      throw redirect({
        to: "/admin/",
        search: {
          error: "missing_oauth_params",
        },
      });
    }

    // 4. Proceed to process the code exchange securely
    await handleGoogleCallback({ data: { code, state } });
  },
  component: () => null,
});
