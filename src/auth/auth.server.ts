import { createServerFn } from "@tanstack/react-start";
import { redirect } from "@tanstack/react-router";
import { getCookie, setCookie, deleteCookie, getRequestHeader, getRequestIP } from "@tanstack/react-start/server";
import { authService } from "./auth.service";
import { authRepository } from "./auth.repository";

// Helper to extract request context for audit logs using framework-safe utilities
function getRequestContext() {
  const userAgent = getRequestHeader("user-agent") || null;
  const ipAddress = getRequestIP({ xForwardedFor: true }) || null;
  return { userAgent, ipAddress };
}

/**
 * Controller endpoint for Email/Password Authentication
 */
export const loginWithEmail = createServerFn({
  method: "POST",
})
  .inputValidator((data: any) => {
    if (!data.email || typeof data.email !== "string" || !data.email.includes("@")) {
      throw new Error("Invalid email format");
    }
    if (!data.password || typeof data.password !== "string" || data.password.trim() === "") {
      throw new Error("Password is required");
    }
    return data as { email: string; password: string };
  })
  .handler(async ({ data }) => {
    const { email, password } = data;
    const { userAgent, ipAddress } = getRequestContext();

    try {
      const admin = await authRepository.findAdminByEmail(email);

      if (!admin) {
        await authService.logAction({
          action: "LOGIN_FAILED",
          ipAddress,
          userAgent,
          details: `Non-existent email attempt: ${email}`,
        });
        throw new Error("Invalid email or password");
      }

      if (admin.authProvider !== "email" || !admin.passwordHash) {
        await authService.logAction({
          adminId: admin.adminId,
          action: "LOGIN_FAILED",
          ipAddress,
          userAgent,
          details: `Attempted password login on account registered with ${admin.authProvider}`,
        });
        throw new Error("Invalid email or password");
      }

      const isValid = await authService.verifyPassword(password, admin.passwordHash);
      if (!isValid) {
        await authService.logAction({
          adminId: admin.adminId,
          action: "LOGIN_FAILED",
          ipAddress,
          userAgent,
          details: "Incorrect password attempt",
        });
        throw new Error("Invalid email or password");
      }

      // Create session
      const { token, expiresAt } = await authService.createSession(admin.adminId, ipAddress, userAgent);

      // Set cookie securely
      setCookie("admin_session_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax",
        expires: expiresAt,
      });

      await authService.logAction({
        adminId: admin.adminId,
        action: "LOGIN_EMAIL",
        ipAddress,
        userAgent,
        details: `Successful password authentication for ${email}`,
      });

      return {
        adminId: admin.adminId,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        authorizedDepts: admin.authorizedDepts,
      };
    } catch (err: any) {
      console.error("Login Error:", err.message);
      throw new Error(err.message || "Authentication failed");
    }
  });

/**
 * Controller endpoint to retrieve the current active Admin session details
 */
export const getCurrentAdmin = createServerFn({
  method: "GET",
}).handler(async () => {
  const { userAgent, ipAddress } = getRequestContext();
  const token = getCookie("admin_session_token");

  if (!token) {
    return null;
  }

  try {
    const admin = await authService.validateSession(token, ipAddress, userAgent);
    if (!admin) {
      // Clean up invalid session cookie
      deleteCookie("admin_session_token", { path: "/" });
      return null;
    }

    return {
      adminId: admin.adminId,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      authorizedDepts: admin.authorizedDepts,
    };
  } catch (err) {
    console.error("Session verification failed:", err);
    deleteCookie("admin_session_token", { path: "/" });
    return null;
  }
});

/**
 * Controller endpoint to log out the active Admin
 */
export const logoutAdmin = createServerFn({
  method: "POST",
}).handler(async () => {
  const { userAgent, ipAddress } = getRequestContext();
  const token = getCookie("admin_session_token");

  if (token) {
    try {
      const admin = await authService.validateSession(token, ipAddress, userAgent);
      await authService.revokeSession(token, admin?.adminId || null, ipAddress, userAgent);
    } catch (err) {
      console.error("Error revoking session on logout:", err);
    }
  }

  // Clear cookie
  deleteCookie("admin_session_token", { path: "/" });
  return { success: true };
});

/**
 * Initiates the Google OAuth consent redirect
 */
export const initiateGoogleLogin = createServerFn({
  method: "GET",
}).handler(async () => {
  const state = crypto.randomUUID();
  const maxAge = 300; // 5 minutes
  const secure = process.env.NODE_ENV === "production";
  
  // Store state in an HTTP-only secure cookie
  setCookie("google_oauth_state", state, {
    httpOnly: true,
    secure,
    path: "/",
    maxAge,
    sameSite: "lax",
  });
  
  // Generate OAuth redirect URL
  const googleUrl = authService.getGoogleAuthUrl(state);
  
  throw redirect({
    href: googleUrl,
  });
});

/**
 * Handles the callback code exchange and session validation for Google OAuth
 */
export const handleGoogleCallback = createServerFn({
  method: "POST",
})
  .inputValidator((data: any) => {
    return data as { code: string; state: string };
  })
  .handler(async ({ data }) => {
    const { code, state } = data;
    const { userAgent, ipAddress } = getRequestContext();

    // Retrieve state cookie
    const stateCookie = getCookie("google_oauth_state");

    // Clear state cookie
    deleteCookie("google_oauth_state", { path: "/" });

    if (!code || !state) {
      throw redirect({
        to: "/admin/",
        search: {
          error: "missing_oauth_params",
        },
      });
    }

    // CSRF Protection validation
    if (!stateCookie || state !== stateCookie) {
      await authService.logAction({
        action: "LOGIN_FAILED",
        ipAddress,
        userAgent,
        details: "Google OAuth State mismatch (potential CSRF attempt)",
      });
      throw redirect({
        to: "/admin/",
        search: {
          error: "state_mismatch",
        },
      });
    }

    try {
      // Exchange code for Google user details and retrieve verified email
      const email = await authService.verifyGoogleCodeAndGetEmail(code, ipAddress, userAgent);

      // Verify email exists in admins table
      const admin = await authRepository.findAdminByEmail(email);

      if (!admin) {
        await authService.logAction({
          action: "LOGIN_FAILED",
          ipAddress,
          userAgent,
          details: `Unauthorized Google Sign-In attempt with email: ${email}`,
        });
        throw redirect({
          to: "/admin/",
          search: {
            error: "unauthorized_google_account",
            email: email,
          },
        });
      }

      // Create session
      const { token, expiresAt } = await authService.createSession(admin.adminId, ipAddress, userAgent);

      // Set cookie securely
      setCookie("admin_session_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax",
        expires: expiresAt,
      });

      await authService.logAction({
        adminId: admin.adminId,
        action: "LOGIN_GOOGLE",
        ipAddress,
        userAgent,
        details: `Successful Google Sign-In authentication for ${email}`,
      });

      throw redirect({
        to: "/admin/",
      });
    } catch (err: any) {
      if (err.status === 307 || err.status === 302 || err.headers) {
        throw err;
      }
      console.error("Google OAuth Callback Exception:", err.message);
      await authService.logAction({
        action: "LOGIN_FAILED",
        ipAddress,
        userAgent,
        details: `Google OAuth Callback Exception: ${err.message}`,
      });
      throw redirect({
        to: "/admin/",
        search: {
          error: "oauth_exchange_failed",
        },
      });
    }
  });
