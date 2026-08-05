import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie, deleteCookie } from "@tanstack/react-start/server";
import { db } from "../db";
import { faculty } from "../db/schema";
import { departments } from "../db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

const COOKIE_NAME = "faculty_session_id";
const COOKIE_MAX_AGE = 60 * 60 * 8; // 8 hours, same as HOD

/**
 * Faculty login via email + password.
 * Sets a cookie containing ONLY that faculty's numeric id.
 */
export const loginFaculty = createServerFn({ method: "POST" })
  .inputValidator((d: { email: string; password: string }) => d)
  .handler(async ({ data }) => {
    const { email, password } = data;

    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    const [record] = await db
  .select({
    id: faculty.id,
    dept_id: faculty.dept_id,
    faculty_password_hash: faculty.faculty_password_hash,
    deptSlug: departments.slug,
  })
  .from(faculty)
  .innerJoin(departments, eq(faculty.dept_id, departments.id))
  .where(eq(faculty.faculty_email, email.toLowerCase().trim()))
  .limit(1);
  console.log("DEBUG email received:", JSON.stringify(email));
  console.log("DEBUG password received:", JSON.stringify(password));
  console.log("DEBUG record found:", !!record, record?.faculty_password_hash);
    if (!record || !record.faculty_password_hash) {
      throw new Error("Invalid email or password");
    }

    const isValid = await bcrypt.compare(password, record.faculty_password_hash);
    console.log("DEBUG bcrypt result:", isValid);
    console.log("DEBUG hash prefix:", record.faculty_password_hash.substring(0, 7));
    if (!isValid) {
      throw new Error("Invalid email or password");
    }

    setCookie(COOKIE_NAME, String(record.id), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      maxAge: COOKIE_MAX_AGE,
    });

    return { success: true, facultyId: record.id, deptId: record.dept_id, deptSlug: record.deptSlug };
  });


/**
 * Returns the currently logged-in faculty's id (or null).
 */
export const getCurrentFacultyId = createServerFn({ method: "GET" }).handler(async () => {
  const id = getCookie(COOKIE_NAME);
  return id ? Number(id) : null;
});

export const logoutFaculty = createServerFn({ method: "POST" }).handler(async () => {
  deleteCookie(COOKIE_NAME, { path: "/" });
  return { success: true };
});

/**
 * Admin/HOD-only: set or reset a faculty member's login credentials.
 */
export const setFacultyCredentials = createServerFn({ method: "POST" })
  .inputValidator((d: { facultyId: number; email: string; newPassword: string }) => d)
  .handler(async ({ data }) => {
    const { facultyId, email, newPassword } = data;
    const hash = await bcrypt.hash(newPassword, 10);

    await db
      .update(faculty)
      .set({
        faculty_email: email.toLowerCase().trim(),
        faculty_password_hash: hash,
      })
      .where(eq(faculty.id, facultyId));

    return { success: true };
  });