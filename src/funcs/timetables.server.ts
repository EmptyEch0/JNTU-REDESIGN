import { createServerFn } from "@tanstack/react-start";
import { sql } from "@/lib/db";  // Change this line
import { departmentTimetables } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { z } from "zod";
import { drizzle } from "drizzle-orm/postgres-js";

const db = drizzle(sql);
export const getTimetables = createServerFn({ method: "GET" })
  .validator((data: { deptId: string }) => data)
  .handler(async ({ data }) => {
    return db
      .select()
      .from(departmentTimetables)
      .where(eq(departmentTimetables.dept_id, data.deptId))
      .orderBy(asc(departmentTimetables.level), asc(departmentTimetables.sort_order));
  });

const timetableSchema = z.object({
  id: z.number().optional(),
  dept_id: z.string(),
  level: z.enum(["UG", "PG"]),
  program_name: z.string(),
  year: z.string(),
  semester: z.string(),
  section: z.string().optional().nullable(),
  academic_year: z.string(),
  title: z.string(),
  image_url: z.string(),
  sort_order: z.number().optional(),
});

export const upsertTimetable = createServerFn({ method: "POST" })
  .validator((data: z.infer<typeof timetableSchema>) => timetableSchema.parse(data))
  .handler(async ({ data }) => {
    if (data.id) {
      const { id, ...rest } = data;
      return db
        .update(departmentTimetables)
        .set({ ...rest, updated_at: new Date() })
        .where(eq(departmentTimetables.id, id))
        .returning();
    }
    return db.insert(departmentTimetables).values(data).returning();
  });

export const deleteTimetable = createServerFn({ method: "POST" })
  .validator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    return db.delete(departmentTimetables).where(eq(departmentTimetables.id, data.id));
  });