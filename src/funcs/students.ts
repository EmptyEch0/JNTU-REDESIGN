import { createServerFn } from "@tanstack/react-start";
import { db } from "../db";
import { students } from "../db/schema";
import { eq } from "drizzle-orm";

export const getStudents = createServerFn({ method: 'GET' }).handler(async () => {
  return await db.select().from(students).orderBy(students.year, students.name);
});

export const addStudent = createServerFn({ method: "POST" }).handler(async ({ data }: { data: any }) => {
  return await db.insert(students).values(data).returning();
});

export const updateStudent = createServerFn({ method: "POST" }).handler(async ({ data }: { data: any }) => {
  const { id, ...updateData } = data;
  return await db
    .update(students)
    .set(updateData)
    .where(eq(students.id, id))
    .returning();
});

export const deleteStudent = createServerFn({ method: "POST" }).handler(async ({ data }: { data: { id: number } }) => {
  return await db.delete(students).where(eq(students.id, data.id)).returning();
});

export const getStudentsByYear = createServerFn({ method: 'GET' }).handler(async ({ data }: { data: { year: string } }) => {
  return await db.select().from(students).where(eq(students.year, data.year)).orderBy(students.name);
});
