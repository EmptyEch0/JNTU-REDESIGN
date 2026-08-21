import { createServerFn } from "@tanstack/react-start";

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
    const { setCookie } = await import("@tanstack/react-start/server");
    const { db } = await import("../db");
    const { faculty, departments } = await import("../db/schema");
    const { eq } = await import("drizzle-orm");
    const bcrypt = (await import("bcryptjs")).default;

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

    if (!record || !record.faculty_password_hash) {
      throw new Error("Invalid email or password");
    }

    const isValid = await bcrypt.compare(password, record.faculty_password_hash);
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

export const changeFacultyCredentials = createServerFn({ method: "POST" })
  .inputValidator((d: { currentPassword: string; newEmail?: string; newPassword?: string }) => d)
  .handler(async ({ data }) => {
    const { currentPassword, newEmail, newPassword } = data;
    const { getCookie } = await import("@tanstack/react-start/server");
    const { db } = await import("../db");
    const { faculty } = await import("../db/schema");
    const { eq } = await import("drizzle-orm");
    const bcrypt = (await import("bcryptjs")).default;

    const sessionFacultyId = getCookie(COOKIE_NAME);
    if (!sessionFacultyId) {
      throw new Error("Not authenticated");
    }
    const facultyId = Number(sessionFacultyId);

    if (!currentPassword) {
      throw new Error("Current password is required");
    }
    if (!newEmail && !newPassword) {
      throw new Error("Provide a new email or new password to update");
    }

    const [record] = await db
      .select({ id: faculty.id, faculty_password_hash: faculty.faculty_password_hash })
      .from(faculty)
      .where(eq(faculty.id, facultyId))
      .limit(1);

    if (!record || !record.faculty_password_hash) {
      throw new Error("Faculty record not found");
    }

    const isValid = await bcrypt.compare(currentPassword, record.faculty_password_hash);
    if (!isValid) {
      throw new Error("Current password is incorrect");
    }

    const updateData: { faculty_email?: string; faculty_password_hash?: string } = {};
    if (newEmail) updateData.faculty_email = newEmail.toLowerCase().trim();
    if (newPassword) {
      if (newPassword.length < 8) throw new Error("New password must be at least 8 characters");
      updateData.faculty_password_hash = await bcrypt.hash(newPassword, 10);
    }

    await db.update(faculty).set(updateData).where(eq(faculty.id, facultyId));
    return { success: true };
  });

/**
 * Returns the currently logged-in faculty's id (or null).
 */
export const getCurrentFacultyId = createServerFn({ method: "GET" }).handler(async () => {
  const { getCookie } = await import("@tanstack/react-start/server");
  const id = getCookie(COOKIE_NAME);
  return id ? Number(id) : null;
});

export const logoutFaculty = createServerFn({ method: "POST" }).handler(async () => {
  const { deleteCookie } = await import("@tanstack/react-start/server");
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
    const { getCookie } = await import("@tanstack/react-start/server");
    const { db } = await import("../db");
    const { faculty, departments, admins, adminSessions } = await import("../db/schema");
    const { eq } = await import("drizzle-orm");
    const bcrypt = (await import("bcryptjs")).default;

    if (!email?.includes("@")) throw new Error("A valid email is required");
    if (!newPassword || newPassword.length < 8) {
      throw new Error("Password must be at least 8 characters");
    }

    const [target] = await db
      .select({
        id: faculty.id,
        dept_id: faculty.dept_id,
        deptSlug: departments.slug,
      })
      .from(faculty)
      .leftJoin(departments, eq(faculty.dept_id, departments.id))
      .where(eq(faculty.id, facultyId))
      .limit(1);

    if (!target) throw new Error("Faculty member not found");

    const adminToken = getCookie("admin_session_token");
    const hodSlug = getCookie("hod_session_dept");
    let allowed = false;

    if (adminToken) {
      const [session] = await db
        .select({ role: admins.role, authorizedDepts: admins.authorizedDepts })
        .from(adminSessions)
        .innerJoin(admins, eq(adminSessions.adminId, admins.adminId))
        .where(eq(adminSessions.id, adminToken))
        .limit(1);

      if (session) {
        if (session.role === "super_admin") allowed = true;
        else if (
          target.deptSlug &&
          Array.isArray(session.authorizedDepts) &&
          (session.authorizedDepts.includes(target.deptSlug) ||
            (target.dept_id && session.authorizedDepts.includes(target.dept_id)))
        ) {
          allowed = true;
        }
      }
    }

    if (!allowed && hodSlug && target.deptSlug && hodSlug === target.deptSlug) {
      allowed = true;
    }

    if (!allowed) throw new Error("Unauthorized");

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

export const listFacultyLoginsByDept = createServerFn({ method: "POST" })
  .inputValidator((d: { deptId: string }) => d)
  .handler(async ({ data }) => {
    const { getCookie } = await import("@tanstack/react-start/server");
    const { db } = await import("../db");
    const { faculty, departments, admins, adminSessions } = await import("../db/schema");
    const { eq } = await import("drizzle-orm");

    const [dept] = await db
      .select({ id: departments.id, slug: departments.slug, name: departments.name })
      .from(departments)
      .where(eq(departments.id, data.deptId))
      .limit(1);

    if (!dept) throw new Error("Department not found");

    const adminToken = getCookie("admin_session_token");
    const hodSlug = getCookie("hod_session_dept");
    let allowed = false;

    if (adminToken) {
      const [session] = await db
        .select({ role: admins.role, authorizedDepts: admins.authorizedDepts })
        .from(adminSessions)
        .innerJoin(admins, eq(adminSessions.adminId, admins.adminId))
        .where(eq(adminSessions.id, adminToken))
        .limit(1);

      if (session?.role === "super_admin") allowed = true;
      else if (
        session &&
        Array.isArray(session.authorizedDepts) &&
        (session.authorizedDepts.includes(dept.slug) ||
          session.authorizedDepts.includes(dept.id))
      ) {
        allowed = true;
      }
    }

    if (!allowed && hodSlug === dept.slug) allowed = true;
    if (!allowed) throw new Error("Unauthorized");

    const rows = await db
      .select({
        id: faculty.id,
        name: faculty.name,
        designation: faculty.designation,
        email: faculty.faculty_email,
        hasPassword: faculty.faculty_password_hash,
        photo_url: faculty.photo_url,
      })
      .from(faculty)
      .where(eq(faculty.dept_id, dept.id));

    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      designation: r.designation,
      email: r.email,
      hasLogin: Boolean(r.hasPassword && r.email),
      photo_url: r.photo_url,
    }));
  });
