import { createServerFn } from "@tanstack/react-start";
import { db } from "../db";
import { students } from "../db/schema";
import { eq } from "drizzle-orm";
import { serverCache } from "../lib/server-cache";

async function studentMutate<T>(action: () => Promise<T>): Promise<T> {
  const result = await action();
  serverCache.invalidate("placements_", true);
  return result;
}

export const getStudents = createServerFn({
  method: "GET",
}).handler(async () => {
  const cached = serverCache.get<any[]>("placements_students");

  if (cached) {
    return cached;
  }

  const records = await db
    .select()
    .from(students)
    .orderBy(students.year, students.name);

  serverCache.set("placements_students", records);

  return records;
});
export const addStudent = createServerFn({ method: "POST" })
  .validator((d: any) => d)
  .handler(async ({ data }) => {
    return studentMutate(() => db.insert(students).values(data).returning());
  });

export const updateStudent = createServerFn({ method: "POST" })
  .validator((d: any) => d)
  .handler(async ({ data }) => {
    const { id, ...updateData } = data;

    return studentMutate(() =>
      db
        .update(students)
        .set(updateData)
        .where(eq(students.id, id))
        .returning()
    );
  });

export const deleteStudent = createServerFn({ method: "POST" })
  .validator((d: { id: number }) => d)
  .handler(async ({ data: { id } }) => {
    return studentMutate(() =>
      db
        .delete(students)
        .where(eq(students.id, id))
        .returning()
    );
  });

export const getStudentsByYear = createServerFn({ method: "GET" })
  .validator((d: { year: string }) => d)
  .handler(async ({ data }) => {
    const cacheKey = `placements_students_year_${data.year}`;
    const cached = serverCache.get<any[]>(cacheKey);

    if (cached) {
      return cached;
    }

    const records = await db
      .select()
      .from(students)
      .where(eq(students.year, data.year))
      .orderBy(students.name);

    serverCache.set(cacheKey, records);

    return records;
  },
);
