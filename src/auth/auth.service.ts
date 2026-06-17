import bcrypt from "bcryptjs";
import { authRepository, NewAuditLog } from "./auth.repository";

export class AuthService {
  // Session duration: 2 hours (in milliseconds)
  private readonly SESSION_DURATION_MS = 2 * 60 * 60 * 1000;

  /**
   * Password Operations
   */
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Session Operations
   */
  async generateSessionToken(): Promise<string> {
    return crypto.randomUUID();
  }

  async createSession(adminId: string, ipAddress?: string | null, userAgent?: string | null) {
    const token = await this.generateSessionToken();
    const expiresAt = new Date(Date.now() + this.SESSION_DURATION_MS);
    
    await authRepository.createSession({
      id: token,
      adminId,
      expiresAt,
      ipAddress,
      userAgent,
    });

    return { token, expiresAt };
  }

  async validateSession(token: string, ipAddress?: string | null, userAgent?: string | null) {
    const sessionWithAdmin = await authRepository.findSessionWithAdmin(token);
    if (!sessionWithAdmin) {
      return null;
    }

    const { session, admin } = sessionWithAdmin;

    // Check expiration
    if (new Date() > session.expiresAt) {
      await authRepository.deleteSession(token);
      await authRepository.createAuditLog({
        adminId: admin.adminId,
        action: "SESSION_EXPIRED",
        ipAddress,
        userAgent,
        details: `Session token ${token.substring(0, 8)}... expired`,
      });
      return null;
    }

    return admin;
  }

  async revokeSession(token: string, adminId?: string | null, ipAddress?: string | null, userAgent?: string | null) {
    await authRepository.deleteSession(token);
    await authRepository.createAuditLog({
      adminId,
      action: "LOGOUT",
      ipAddress,
      userAgent,
      details: `Session token ${token.substring(0, 8)}... logged out`,
    });
  }

  /**
   * Google OAuth 2.0 Operations
   */
  getGoogleAuthUrl(state: string): string {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;

    if (!clientId || !redirectUri) {
      throw new Error("Google OAuth environment variables GOOGLE_CLIENT_ID or GOOGLE_REDIRECT_URI are not set.");
    }

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "openid email profile",
      state: state,
      prompt: "select_account",
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  async verifyGoogleCodeAndGetEmail(
    code: string,
    ipAddress?: string | null,
    userAgent?: string | null
  ): Promise<string> {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
      throw new Error("Google OAuth configuration is missing in the server environment.");
    }

    // Exchange authorization code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }).toString(),
    });

    if (!tokenResponse.ok) {
      const errText = await tokenResponse.text();
      console.error("Google Token Exchange failed:", errText);
      throw new Error(`Failed to exchange Google OAuth code: ${tokenResponse.statusText}`);
    }

    const tokens = await tokenResponse.json() as { access_token: string; id_token: string };

    // Fetch user profile info
    const profileResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    if (!profileResponse.ok) {
      throw new Error("Failed to fetch userinfo from Google API");
    }

    const profile = await profileResponse.json() as { email: string; verified_email?: boolean };
    
    if (!profile.email) {
      throw new Error("Google account profile did not return an email address.");
    }

    if (profile.verified_email === false) {
      throw new Error("Google account email is not verified.");
    }

    return profile.email;
  }

  /**
   * Audit Logging
   */
  async logAction(data: NewAuditLog) {
    await authRepository.createAuditLog(data);
  }
}

export const authService = new AuthService();
