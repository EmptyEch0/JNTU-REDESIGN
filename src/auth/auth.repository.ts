import { db } from "../db";
import { admins, adminSessions, adminAuditLogs } from "../db/schema";
import { asc, eq } from "drizzle-orm";

export interface NewAdmin {
  name: string;
  email: string;
  passwordHash?: string | null;
  role?: string;
  authProvider?: string;
  authorizedDepts?: string[];
}

export interface NewSession {
  id: string;
  adminId: string;
  expiresAt: Date;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export interface NewAuditLog {
  adminId?: string | null;
  action: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  details?: string | null;
}

export class AuthRepository {
  async findAdminByEmail(email: string) {
    const [admin] = await db
      .select()
      .from(admins)
      .where(eq(admins.email, email.toLowerCase().trim()));
    return admin || null;
  }

  async createAdmin(data: NewAdmin) {
    const [admin] = await db
      .insert(admins)
      .values({
        name: data.name,
        email: data.email.toLowerCase().trim(),
        passwordHash: data.passwordHash || null,
        role: data.role || "department_admin",
        authProvider: data.authProvider || "email",
        authorizedDepts: data.authorizedDepts || [],
      })
      .returning();
    return admin;
  }

  async createSession(data: NewSession) {
    const [session] = await db
      .insert(adminSessions)
      .values({
        id: data.id,
        adminId: data.adminId,
        expiresAt: data.expiresAt,
        ipAddress: data.ipAddress || null,
        userAgent: data.userAgent || null,
      })
      .returning();
    return session;
  }

  async findSessionWithAdmin(sessionId: string) {
    const result = await db
      .select({
        session: adminSessions,
        admin: admins,
      })
      .from(adminSessions)
      .innerJoin(admins, eq(adminSessions.adminId, admins.adminId))
      .where(eq(adminSessions.id, sessionId));
    return result[0] || null;
  }

  async deleteSession(sessionId: string) {
    await db.delete(adminSessions).where(eq(adminSessions.id, sessionId));
  }

  async createAuditLog(data: NewAuditLog) {
    await db.insert(adminAuditLogs).values({
      adminId: data.adminId || null,
      action: data.action,
      ipAddress: data.ipAddress || null,
      userAgent: data.userAgent || null,
      details: data.details || null,
    });
  }

  async updateAdminPassword(adminId: string, passwordHash: string) {
    const [admin] = await db
      .update(admins)
      .set({ passwordHash })
      .where(eq(admins.adminId, adminId))
      .returning();
    return admin || null;
  }

  async listAdmins() {
    return db
      .select({
        adminId: admins.adminId,
        name: admins.name,
        email: admins.email,
        role: admins.role,
        authProvider: admins.authProvider,
        authorizedDepts: admins.authorizedDepts,
        createdAt: admins.createdAt,
      })
      .from(admins)
      .orderBy(asc(admins.name));
  }
}

export const authRepository = new AuthRepository();
