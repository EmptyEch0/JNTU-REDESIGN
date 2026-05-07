import { createServerFn } from "@tanstack/react-start";
import { db } from "../db/index";
import { edcProfile, edcCommittee, edcActivities, profBodies, iipcCell } from "../db/schema";
import { eq } from "drizzle-orm";

// EDC Profile
export const getEdcProfile = createServerFn({ method: "GET" })
  .handler(async () => {
    const result = await db.select().from(edcProfile).limit(1);
    return result[0] || null;
  });

export const updateEdcProfile = createServerFn({ method: "POST" })
  .handler(async ({ data }: { data: any }) => {
    const { id, ...updateData } = data;
    await db.update(edcProfile).set(updateData).where(eq(edcProfile.id, id));
    return { success: true };
  });

// EDC Committee
export const getEdcCommittee = createServerFn({ method: "GET" })
  .handler(async () => {
    return await db.select().from(edcCommittee).orderBy(edcCommittee.sNo);
  });

export const addEdcCommittee = createServerFn({ method: "POST" })
  .handler(async ({ data }: { data: any }) => {
    await db.insert(edcCommittee).values(data);
    return { success: true };
  });

export const updateEdcCommittee = createServerFn({ method: "POST" })
  .handler(async ({ data }: { data: any }) => {
    const { id, ...updateData } = data;
    await db.update(edcCommittee).set(updateData).where(eq(edcCommittee.id, id));
    return { success: true };
  });

export const deleteEdcCommittee = createServerFn({ method: "POST" })
  .handler(async ({ data: id }: { data: number }) => {
    await db.delete(edcCommittee).where(eq(edcCommittee.id, id));
    return { success: true };
  });

// EDC Activities
export const getEdcActivities = createServerFn({ method: "GET" })
  .handler(async () => {
    return await db.select().from(edcActivities).orderBy(edcActivities.sNo);
  });

export const addEdcActivity = createServerFn({ method: "POST" })
  .handler(async ({ data }: { data: any }) => {
    await db.insert(edcActivities).values(data);
    return { success: true };
  });

export const updateEdcActivity = createServerFn({ method: "POST" })
  .handler(async ({ data }: { data: any }) => {
    const { id, ...updateData } = data;
    await db.update(edcActivities).set(updateData).where(eq(edcActivities.id, id));
    return { success: true };
  });

export const deleteEdcActivity = createServerFn({ method: "POST" })
  .handler(async ({ data: id }: { data: number }) => {
    await db.delete(edcActivities).where(eq(edcActivities.id, id));
    return { success: true };
  });

import { profChapters } from "../db/schema";

// Professional Chapters
export const getProfChapters = createServerFn({ method: "GET" })
  .handler(async () => {
    return await db.select().from(profChapters);
  });

export const addProfChapter = createServerFn({ method: "POST" })
  .handler(async ({ data }: { data: any }) => {
    await db.insert(profChapters).values(data);
    return { success: true };
  });

export const updateProfChapter = createServerFn({ method: "POST" })
  .handler(async ({ data }: { data: any }) => {
    const { id, ...updateData } = data;
    await db.update(profChapters).set(updateData).where(eq(profChapters.id, id));
    return { success: true };
  });

export const deleteProfChapter = createServerFn({ method: "POST" })
  .handler(async ({ data: id }: { data: number }) => {
    await db.delete(profChapters).where(eq(profChapters.id, id));
    return { success: true };
  });

// IIPC
export const getIipcData = createServerFn({ method: "GET" })
  .handler(async () => {
    const result = await db.select().from(iipcCell).limit(1);
    return result[0] || null;
  });

export const updateIipcData = createServerFn({ method: "POST" })
  .handler(async ({ data }: { data: any }) => {
    const { id, ...updateData } = data;
    await db.update(iipcCell).set(updateData).where(eq(iipcCell.id, id));
    return { success: true };
  });
