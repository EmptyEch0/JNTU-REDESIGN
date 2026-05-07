import { createServerFn } from "@tanstack/react-start";
import { db } from "../db";
import { recruiters } from "../db/schema";
import { eq } from "drizzle-orm";

export const getRecruiters = createServerFn({ method: 'GET' }).handler(async () => {
  return await db.select().from(recruiters).orderBy(recruiters.name);
});

export const addRecruiter = createServerFn({ method: "POST" }).handler(async ({ data }: { data: any }) => {
  return await db.insert(recruiters).values(data).returning();
});

export const updateRecruiter = createServerFn({ method: "POST" }).handler(async ({ data }: { data: any }) => {
  const { id, ...updateData } = data;
  return await db
    .update(recruiters)
    .set(updateData)
    .where(eq(recruiters.id, id))
    .returning();
});

export const deleteRecruiter = createServerFn({ method: "POST" }).handler(async ({ data }: { data: { id: number } }) => {
  return await db.delete(recruiters).where(eq(recruiters.id, data.id)).returning();
});
