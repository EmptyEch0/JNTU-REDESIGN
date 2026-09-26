import { createServerFn } from "@tanstack/react-start";
import { serverCache } from "../lib/server-cache";

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
  // Set when the HOD is not on this department's own roster (additional charge)
  hod_member?: {
    id: number;
    name: string;
    designation: string;
    photo_url?: string | null;
    dept_slug: string;
  } | null;
  faculty: any[];
  gallery: any[];
  courses: any[];
  laboratories: any[];
  achievements: any[];
};

const HOD_DESIGNATION = /hod|head of (the )?department/i;

function nameWords(raw: string): string[] {
  return raw
    .toLowerCase()
    .replace(/\b(dr|prof|mr|mrs|ms|smt|sri)\b\.?/g, " ")
    .split(/[^a-z]+/)
    .filter(Boolean);
}

// Loose name match across rosters, e.g. "Dr. G. Appala Naidu" ~ "Gottapu Appala Naidu":
// every full word must appear (spacing ignored) and every initial must start some word.
function isSamePerson(a: string, b: string): boolean {
  const aWords = nameWords(a);
  const bWords = nameWords(b);
  const aFull = aWords.filter((w) => w.length > 1).join("");
  const bFull = bWords.filter((w) => w.length > 1).join("");
  if (!aFull || !bFull) return false;
  if (!aFull.includes(bFull) && !bFull.includes(aFull)) return false;
  const initialsMatch = (initials: string[], other: string[]) =>
    initials.every((i) => other.some((w) => w.startsWith(i)));
  return (
    initialsMatch(aWords.filter((w) => w.length === 1), bWords) &&
    initialsMatch(bWords.filter((w) => w.length === 1), aWords)
  );
}

export const getDepartmentDetails = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    try {
      const cacheKey = `dept_details_${slug}`;
      const cached = serverCache.get<any>(cacheKey);
      if (cached) return cached;

      const { sql } = await import("@/lib/db");

      // 1. Fetch the main department row (with fallback for legacy aliases)
      let result = await sql`SELECT * FROM departments WHERE slug = ${slug} LIMIT 1`;
      if ((!result || result.length === 0) && (slug === "sh" || slug === "bsh")) {
        result = await sql`SELECT * FROM departments WHERE slug = 'bshss' LIMIT 1`;
      }

      // 2. CHECK: If no row is returned, the array length is 0
      if (!result || result.length === 0) {
        return null;
      }

      // 3. Explicitly grab the first row object
      const dept = result[0];

      // 4. Fetch all other lists IN PARALLEL to eliminate sequential network latency
      const [faculty, gallery, courses, laboratories, achievements] = await Promise.all([
        sql`SELECT * FROM faculty WHERE dept_id = ${dept.id} ORDER BY ID ASC`,
        sql`SELECT * FROM department_gallery WHERE dept_id = ${dept.id} ORDER BY created_at DESC`,
        sql`SELECT * FROM courses WHERE dept_id = ${dept.id}`,
        sql`SELECT * FROM laboratories WHERE dept_id = ${dept.id}`,
        sql`SELECT * FROM achievements WHERE dept_id = ${dept.id} ORDER BY year DESC`,
      ]);

      // 5. Additional-charge HOD: if nobody on this roster is marked HOD, find the
      // department's HOD (dept.hod) on their home department's roster instead.
      let hodMember: DepartmentData["hod_member"] = null;
      const rosterHasHod = (faculty || []).some((f: any) => HOD_DESIGNATION.test(f.designation || ""));
      if (!rosterHasHod && dept.hod) {
        const others = await sql`
          SELECT f.id, f.name, f.designation, f.photo_url, d.slug AS dept_slug
          FROM faculty f
          JOIN departments d ON f.dept_id = d.id
          WHERE f.dept_id <> ${dept.id}
          ORDER BY f.id ASC
        `;
        const hodKey = nameWords(dept.hod).join("");
        const match =
          others.find((f: any) => nameWords(f.name).join("") === hodKey) ||
          others.find((f: any) => isSamePerson(dept.hod, f.name));
        if (match) {
          hodMember = {
            id: match.id,
            name: match.name,
            designation: match.designation,
            photo_url: match.photo_url || dept.hod_photo,
            dept_slug: match.dept_slug,
          };
        }
      }

      // 6. MERGE: Create a new object containing EVERYTHING
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
        hod_member: hodMember,
        faculty: (faculty || []).map((row) => ({ ...row })),
        gallery: (gallery || []).map((row) => ({ ...row })),
        laboratories: (laboratories || []).map((row) => ({ ...row })),
        achievements: (achievements || []).map((row) => ({ ...row })),
        courses: (courses || []).map((row) => ({ ...row })),
      };

      serverCache.set(cacheKey, completeData, 1000 * 60 * 30); // 30 mins cache
      return completeData;
    } catch (err) {
      console.error(`Error fetching department details for ${slug}:`, err);
      return null;
    }
  });

export const getAllDepartments = createServerFn({ method: "GET" })
  .handler(async () => {
    try {
      const cacheKey = "dept_all";
      const cached = serverCache.get<any[]>(cacheKey);
      if (cached) return cached;

      const { sql } = await import("@/lib/db");

      // Fetch all records sorted alphabetically by name
      const result = await sql`
      SELECT id, name, slug, description, image, hod 
      FROM departments 
      ORDER BY name ASC
    `;

      const data = result || [];
      serverCache.set(cacheKey, data);
      return data;
    } catch (err) {
      console.error("Error fetching all departments:", err);
      return [];
    }
  });

export const getAllFacultyList = createServerFn({ method: "GET" })
  .handler(async () => {
    try {
      const cacheKey = "faculty_all";
      const cached = serverCache.get<any[]>(cacheKey);
      if (cached) return cached;

      const { sql } = await import("@/lib/db");

      const result = await sql`
        SELECT f.*, d.name as department_name, d.slug as department_slug
        FROM faculty f
        LEFT JOIN departments d ON f.dept_id = d.id
        ORDER BY f.name ASC
      `;

      const data = result || [];
      serverCache.set(cacheKey, data);
      return data;
    } catch (err) {
      console.error("Error fetching all faculty:", err);
      return [];
    }
  });