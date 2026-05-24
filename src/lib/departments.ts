import { createServerFn } from "@tanstack/react-start";
import { db } from "../db";
import { departments, faculty, achievements, courses, laboratories, departmentGallery } from "../db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import bcrypt from "bcryptjs";
// --- Department Core ---
export const getDepartments = createServerFn({ method: "GET" }).handler(async () => {
  return await db.select().from(departments);
});

export const updateDepartment = createServerFn({ method: "POST" })
  .inputValidator((d: any) => d)
  .handler(async ({ data }) => { 
    const { id, faculty: facultyData, ...updateData } = data;

    // Update core department details
    await db
      .update(departments)
      .set(updateData)
      .where(eq(departments.id, id));

    return { success: true };
  });

// --- Faculty Specific (Required for the Admin Page) ---
export const syncFaculty = createServerFn({ method: "POST" })
  .inputValidator((d: { deptId: string; facultyList: any[] }) => d)
  .handler(async ({ data }) => {
    const { deptId, facultyList } = data;

    // A simple sync strategy: delete existing and re-insert 
    // (Or use individual add/delete functions)
    await db.delete(faculty).where(eq(faculty.dept_id, deptId));
    
    if (facultyList.length > 0) {
      await db.insert(faculty).values(
        facultyList.map(f => ({
          name: f.name,
          designation: f.designation,
          photo_url: f.photo_url,
          dept_id: deptId
        }))
      );
    }
    return { success: true };
  });

  export const syncAchievements = createServerFn({ method: "POST" })
  .inputValidator((d: { deptId: string; achievementList: any[] }) => d)
  .handler(async ({ data }) => {
    const { deptId, achievementList } = data;

    // Wipe and replace strategy for the specific department
    await db.delete(achievements).where(eq(achievements.dept_id, deptId));

    if (achievementList.length > 0) {
      await db.insert(achievements).values(
        achievementList.map(a => ({
          dept_id: deptId,
          category: a.category || "General",
          subcategory: a.subcategory || "General Achievements",
          title: a.title,
          description: a.description,
          year: a.year,
          course: a.course
        }))
      );
    }
    return { success: true };
  });

  export const syncCourses = createServerFn({ method: "POST" })
  .inputValidator((d: { deptId: string; courseList: any[] }) => d)
  .handler(async ({ data }) => {
    const { deptId, courseList } = data;

    // Remove existing courses for this department
    await db.delete(courses).where(eq(courses.dept_id, deptId));

    if (courseList.length > 0) {
      await db.insert(courses).values(
        courseList.map(c => ({
          dept_id: deptId,
          level: c.level || "UG",
          name: c.name,
          syllabus_url: c.syllabus_url,
          regulation: c.regulation,
        }))
      );
    }
    return { success: true };
  });

  export const syncLaboratories = createServerFn({ method: "POST" })
  .inputValidator((d: { deptId: string; labList: any[] }) => d)
  .handler(async ({ data }) => {
    const { deptId, labList } = data;

    // Delete existing labs for this department
    await db.delete(laboratories).where(eq(laboratories.dept_id, deptId));

    if (labList.length > 0) {
      await db.insert(laboratories).values(
        labList.map(lab => ({
          dept_id: deptId,
          name: lab.name,
          description: lab.description,
          location: lab.location,
          photo_url: lab.photo_url,
          specs: lab.specs || [], // This is the JSONB field
        }))
      );
    }
    return { success: true };
  });

  export const syncGallery = createServerFn({ method: "POST" })
  .inputValidator((d: { deptId: string; galleryList: any[] }) => d)
  .handler(async ({ data }) => {
    const { deptId, galleryList } = data;

    // Wipe and replace strategy for the specific department gallery
    await db.delete(departmentGallery).where(eq(departmentGallery.dept_id, deptId));

    if (galleryList.length > 0) {
      await db.insert(departmentGallery).values(
        galleryList.map(img => ({
          dept_id: deptId,
          title: img.title || "Untitled",
          image_url: img.image_url,
          category: img.category || "General",
          description: img.description || "",
        }))
      );
    }
    return { success: true };
  });

// --- NEW CRUD FUNCTIONS REQUIRED BY admin.departments.tsx ---

export const getFacultyByDept = createServerFn({ method: "POST" })
  .inputValidator((deptId: string | { data?: string }) => deptId)
  .handler(async ({ data }) => {
    const id = typeof data === "string" ? data : (data as any)?.data || "";
    if (!id) return [];
    return await db.select().from(faculty).where(eq(faculty.dept_id, id));
  });

export const addFaculty = createServerFn({ method: "POST" })
  .inputValidator((d: any) => d)
  .handler(async ({ data }) => {
    await db.insert(faculty).values(data);
    return { success: true };
  });

export const deleteFaculty = createServerFn({ method: "POST" })
  .inputValidator((d: { id: number } | number) => d)
  .handler(async ({ data }) => {
    const id = typeof data === "number" ? data : (data as any)?.id;
    await db.delete(faculty).where(eq(faculty.id, id));
    return { success: true };
  });

export const getLabsByDept = createServerFn({ method: "POST" })
  .inputValidator((deptId: string | { data?: string }) => deptId)
  .handler(async ({ data }) => {
    const id = typeof data === "string" ? data : (data as any)?.data || "";
    if (!id) return [];
    return await db.select().from(laboratories).where(eq(laboratories.dept_id, id));
  });

export const addLaboratory = createServerFn({ method: "POST" })
  .inputValidator((d: any) => d)
  .handler(async ({ data }) => {
    await db.insert(laboratories).values(data);
    return { success: true };
  });

export const deleteLaboratory = createServerFn({ method: "POST" })
  .inputValidator((d: { id: number } | number) => d)
  .handler(async ({ data }) => {
    const id = typeof data === "number" ? data : (data as any)?.id;
    await db.delete(laboratories).where(eq(laboratories.id, id));
    return { success: true };
  });

export const getAchievementsByDept = createServerFn({ method: "POST" })
  .inputValidator((deptId: string | { data?: string }) => deptId)
  .handler(async ({ data }) => {
    const id = typeof data === "string" ? data : (data as any)?.data || "";
    if (!id) return [];
    return await db.select().from(achievements).where(eq(achievements.dept_id, id));
  });

export const addAchievement = createServerFn({ method: "POST" })
  .inputValidator((d: any) => d)
  .handler(async ({ data }) => {
    await db.insert(achievements).values(data);
    return { success: true };
  });

export const getCoursesByDept = createServerFn({ method: "POST" })
  .inputValidator((deptId: string | { data?: string }) => deptId)
  .handler(async ({ data }) => {
    const id = typeof data === "string" ? data : (data as any)?.data || "";
    if (!id) return [];
    return await db.select().from(courses).where(eq(courses.dept_id, id));
  });

export const addCourse = createServerFn({ method: "POST" })
  .inputValidator((d: any) => d)
  .handler(async ({ data }) => {
    const { name, level, regulation, syllabus_url, dept_id } = data;
    await db.insert(courses).values({
      dept_id,
      name,
      level: level || "UG",
      regulation,
      syllabus_url
    });
    return { success: true };
  });

export const deleteCourse = createServerFn({ method: "POST" })
  .inputValidator((d: { id: number } | number) => d)
  .handler(async ({ data }) => {
    const id = typeof data === "number" ? data : (data as any)?.id;
    await db.delete(courses).where(eq(courses.id, id));
    return { success: true };
  });

export const getGalleryByDept = createServerFn({ method: "POST" })
  .inputValidator((deptId: string | { data?: string }) => deptId)
  .handler(async ({ data }) => {
    const id = typeof data === "string" ? data : (data as any)?.data || "";
    if (!id) return [];
    return await db.select().from(departmentGallery).where(eq(departmentGallery.dept_id, id));
  });

export const addToGallery = createServerFn({ method: "POST" })
  .inputValidator((d: any) => d)
  .handler(async ({ data }) => {
    const { title, image_url, category, description, dept_id } = data;
    await db.insert(departmentGallery).values({
      dept_id,
      title,
      image_url,
      category: category || "General",
      description
    });
    return { success: true };
  });

export const deleteFromGallery = createServerFn({ method: "POST" })
  .inputValidator((d: { id: string } | string) => d)
  .handler(async ({ data }) => {
    const id = typeof data === "string" ? data : (data as any)?.id;
    await db.delete(departmentGallery).where(eq(departmentGallery.id, id));
    return { success: true };
  });

export const updateFacultyProfile = createServerFn({ method: "POST" })
  .inputValidator((d: { facultyId: string | number; profileData: any }) => d)
  .handler(async ({ data }) => {
    const { facultyId, profileData } = data;

    await db
      .update(faculty)
      .set({
        name: profileData.name,
        designation: profileData.designation,
        photo_url: profileData.photo_url,
        specialization: profileData.specialization,
        experience_years: parseInt(profileData.experience_years) || 0,
        qualifications: profileData.qualifications,
        awards: profileData.awards,
        fellowships: profileData.fellowships,
        professional_memberships: profileData.professional_memberships,
        international_exchanges: profileData.international_exchanges,
        sabbaticals: profileData.sabbaticals,
        consultancy_projects: profileData.consultancy_projects,
        fdps_attended: profileData.fdps_attended,
        conferences_attended: profileData.conferences_attended,
      })
      .where(eq(faculty.id, Number(facultyId)));

    return { success: true };
  });

export const verifyDepartmentAccess = createServerFn({ method: "POST" })
  .inputValidator((d: { deptId: string; password: string }) => d)
  .handler(async ({ data }) => {
    const { deptId, password } = data;

    // 1. Guard Rule: Explicitly reject the admin password here
    if (password === "jntu@2026") {
      return { valid: false, role: null };
    }

    // 2. Fetch the department record string directly by its UUID
    const [dept] = await db
      .select({ hod_password: departments.hod_password })
      .from(departments)
      .where(eq(departments.id, deptId))
      .limit(1);

    // If the department doesn't exist or doesn't have a password set, reject access
    if (!dept || !dept.hod_password) {
      return { valid: false, role: null };
    }

    // 3. CRYPTOGRAPHIC MATCH VALIDATION
    const isPasswordMatch = await bcrypt.compare(password, dept.hod_password);

    if (isPasswordMatch) {
      return { valid: true, role: "hod" };
    }

    // Fallback: Access Denied
    return { valid: false, role: null };
  });