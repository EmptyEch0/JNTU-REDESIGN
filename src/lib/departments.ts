import { createServerFn } from "@tanstack/react-start";
import { db } from "../db";
import { departments, faculty, achievements, courses, laboratories, departmentGallery } from "../db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

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