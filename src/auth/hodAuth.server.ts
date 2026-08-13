// Location: src/auth/hodAuth.server.ts
import { createServerFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";
import { db } from "../db";
import { departments } from "../db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

// Matches the cookie set by loginHod() in auth.server.ts -- stores the slug.
const HOD_COOKIE_NAME = "hod_session_dept";
const MIN_LENGTH = 12;

function assertStrongPassword(password: string) {
  if (password.length < MIN_LENGTH) {
    throw new Error(`New password must be at least ${MIN_LENGTH} characters`);
  }
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);
  if (!hasUpper || !hasLower || !hasDigit || !hasSymbol) {
    throw new Error(
      "New password must include an uppercase letter, a lowercase letter, a digit, and a symbol"
    );
  }
}

export const changeHodCredentials = createServerFn({ method: "POST" })
  .inputValidator((d: { currentPassword: string; newPassword: string }) => d)
  .handler(async ({ data }) => {
    const { currentPassword, newPassword } = data;

    const deptSlug = getCookie(HOD_COOKIE_NAME);
    if (!deptSlug) {
      throw new Error("Not authenticated");
    }

    if (!currentPassword) {
      throw new Error("Current password is required");
    }
    assertStrongPassword(newPassword);

    const [dept] = await db
      .select({ id: departments.id, hod_password: departments.hod_password })
      .from(departments)
      .where(eq(departments.slug, deptSlug))
      .limit(1);

    if (!dept || !dept.hod_password) {
      throw new Error("Department record not found");
    }

    const isValid = await bcrypt.compare(currentPassword, dept.hod_password);
    if (!isValid) {
      throw new Error("Current password is incorrect");
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await db
      .update(departments)
      .set({ hod_password: newHash })
      .where(eq(departments.slug, deptSlug));

    return { success: true };
  });