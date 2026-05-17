import { createServerFn } from "@tanstack/react-start";

export type DepartmentData = {
  id: string;
  name: string;
  hod: string;
  description: string;
  image: string;
  slug: string;
  vision?: string;
  mission?: string;
  about_details?: string;
  hod_photo?: string;
  hod_message?: string;
  hod_contact?: string;
  faculty: any[];
  gallery: any[];
  courses: any[];
  laboratories: any[];
  achievements: any[];
};

export const getDepartmentDetails = createServerFn({ method: "GET" })
  .inputValidator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const { sql } = await import("@/lib/db");

    // 1. Fetch the main department row
    const result = await sql`SELECT * FROM departments WHERE slug = ${slug}`;

    // 2. CHECK: If no row is returned, the array length is 0
    if (!result || result.length === 0) {
      return null;
    }

    // 3. Explicitly grab the first row object
    const dept = result[0];

    // 4. Fetch the other lists
    const faculty = await sql`SELECT * FROM faculty WHERE dept_id = ${dept.id} ORDER BY ID ASC`; 
    const gallery =
      await sql`SELECT * FROM department_gallery WHERE dept_id = ${dept.id} ORDER BY created_at DESC`;
    const courses = await sql`SELECT * FROM courses WHERE dept_id = ${dept.id}`;
    const laboratories = await sql`SELECT * FROM laboratories WHERE dept_id = ${dept.id}`;
    const achievements =
      await sql`SELECT * FROM achievements WHERE dept_id = ${dept.id} ORDER BY year DESC`;

    // 5. MERGE: Create a new object containing EVERYTHING
    const completeData = {
      id: dept.id,
      name: dept.name,
      hod: dept.hod,
      description: dept.description,
      image: dept.image,
      slug: dept.slug,
      vision: dept.vision,
      mission: dept.mission,
      about_details: dept.about_details,
      hod_photo: dept.hod_photo,
      hod_message: dept.hod_message,
      hod_contact: dept.hod_contact,
      faculty: faculty.map((row) => ({ ...row })),
      gallery: gallery.map((row) => ({ ...row })),
      laboratories: laboratories.map((row) => ({ ...row })),
      achievements: achievements.map((row) => ({ ...row })),
      courses: courses.map((row) => ({ ...row })),
    };

    return completeData;
  });

  // Add this server function to the bottom of src/functions/departments.ts

export const getAllDepartments = createServerFn({ method: "GET" })
.handler(async () => {
  const { sql } = await import("@/lib/db");
  
  // Fetch all records sorted alphabetically by name
  const result = await sql`
    SELECT id, name, slug, description, image 
    FROM departments 
    ORDER BY name ASC
  `;
  
  return result || [];
});