import { createServerFn } from "@tanstack/react-start";
import { db } from "../db";
import { students } from "../db/schema";
import { eq } from "drizzle-orm";
import { memoryCache } from "../lib/cache";

export const getStudents = createServerFn({ method: "GET" }).handler(async () => {
  return memoryCache.getOrSet("students:all", 10 * 60 * 1000, async () => {
    return await db.select().from(students).orderBy(students.year, students.name);
  });
});

export const addStudent = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: any }) => {
    const res = await db.insert(students).values(data).returning();
    memoryCache.invalidatePrefix("students:");
    return res;
  },
);

export const updateStudent = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: any }) => {
    const { id, ...updateData } = data;
    const res = await db.update(students).set(updateData).where(eq(students.id, id)).returning();
    memoryCache.invalidatePrefix("students:");
    return res;
  },
);

export const deleteStudent = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { id: number } }) => {
    const res = await db.delete(students).where(eq(students.id, data.id)).returning();
    memoryCache.invalidatePrefix("students:");
    return res;
  },
);

export const getStudentsByYear = createServerFn({ method: "GET" }).handler(
  async ({ data }: { data: { year: string } }) => {
    return memoryCache.getOrSet(`students:year:${data.year}`, 10 * 60 * 1000, async () => {
      return await db
        .select()
        .from(students)
        .where(eq(students.year, data.year))
        .orderBy(students.name);
    });
  },
);
