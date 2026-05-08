import { createServerFn } from "@tanstack/react-start";
import { db } from "../db/index";
import { nssProfile, nssActivities, nssSpecialCamp, nssGallery } from "../db/schema";
import { eq, asc } from "drizzle-orm";

export const getNssProfile = createServerFn({ method: "GET" }).handler(async () => {
  const result = await db.select().from(nssProfile).limit(1);
  return result[0] || null;
});

export const updateNssProfile = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: any }) => {
    const { id, ...updateData } = data;
    await db.update(nssProfile).set(updateData).where(eq(nssProfile.id, id));
    return { success: true };
  },
);

export const getNssActivities = createServerFn({ method: "GET" }).handler(async () => {
  return await db.select().from(nssActivities).orderBy(asc(nssActivities.sNo));
});

export const addNssActivity = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: any }) => {
    await db.insert(nssActivities).values(data);
    return { success: true };
  },
);

export const updateNssActivity = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: any }) => {
    const { id, ...updateData } = data;
    await db.update(nssActivities).set(updateData).where(eq(nssActivities.id, id));
    return { success: true };
  },
);

export const deleteNssActivity = createServerFn({ method: "POST" }).handler(
  async ({ data: id }: { data: number }) => {
    await db.delete(nssActivities).where(eq(nssActivities.id, id));
    return { success: true };
  },
);

export const getNssSpecialCamp = createServerFn({ method: "GET" }).handler(async () => {
  return await db.select().from(nssSpecialCamp).orderBy(asc(nssSpecialCamp.id));
});

export const addNssSpecialCamp = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: any }) => {
    await db.insert(nssSpecialCamp).values(data);
    return { success: true };
  },
);

export const updateNssSpecialCamp = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: any }) => {
    const { id, ...updateData } = data;
    await db.update(nssSpecialCamp).set(updateData).where(eq(nssSpecialCamp.id, id));
    return { success: true };
  },
);

export const deleteNssSpecialCamp = createServerFn({ method: "POST" }).handler(
  async ({ data: id }: { data: number }) => {
    await db.delete(nssSpecialCamp).where(eq(nssSpecialCamp.id, id));
    return { success: true };
  },
);

export const getNssGallery = createServerFn({ method: "GET" }).handler(async () => {
  return await db.select().from(nssGallery).orderBy(asc(nssGallery.id));
});

export const addNssGalleryImage = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: any }) => {
    await db.insert(nssGallery).values(data);
    return { success: true };
  },
);

export const deleteNssGalleryImage = createServerFn({ method: "POST" }).handler(
  async ({ data: id }: { data: number }) => {
    await db.delete(nssGallery).where(eq(nssGallery.id, id));
    return { success: true };
  },
);
