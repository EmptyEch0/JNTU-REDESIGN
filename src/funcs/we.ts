import { createServerFn } from "@tanstack/react-start";
import { db } from "../db/index";
import {
  weProfile,
  weCommittee,
  weActivities,
  weRecreation,
  weMagazine,
  weGallery,
} from "../db/schema";
import { eq, asc } from "drizzle-orm";

export const getWeProfile = createServerFn({ method: "GET" }).handler(async () => {
  const result = await db.select().from(weProfile).limit(1);
  return result[0] || null;
});

export const updateWeProfile = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: any }) => {
    const { id, ...updateData } = data;
    await db.update(weProfile).set(updateData).where(eq(weProfile.id, id));
    return { success: true };
  },
);

export const getWeCommittee = createServerFn({ method: "GET" }).handler(async () => {
  return await db.select().from(weCommittee).orderBy(asc(weCommittee.id));
});

export const addWeCommitteeMember = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: any }) => {
    await db.insert(weCommittee).values(data);
    return { success: true };
  },
);

export const updateWeCommitteeMember = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: any }) => {
    const { id, ...updateData } = data;
    await db.update(weCommittee).set(updateData).where(eq(weCommittee.id, id));
    return { success: true };
  },
);

export const deleteWeCommitteeMember = createServerFn({ method: "POST" }).handler(
  async ({ data: id }: { data: number }) => {
    await db.delete(weCommittee).where(eq(weCommittee.id, id));
    return { success: true };
  },
);

export const getWeActivities = createServerFn({ method: "GET" }).handler(async () => {
  return await db.select().from(weActivities).orderBy(asc(weActivities.sNo));
});

export const addWeActivity = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: any }) => {
    await db.insert(weActivities).values(data);
    return { success: true };
  },
);

export const updateWeActivity = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: any }) => {
    const { id, ...updateData } = data;
    await db.update(weActivities).set(updateData).where(eq(weActivities.id, id));
    return { success: true };
  },
);

export const deleteWeActivity = createServerFn({ method: "POST" }).handler(
  async ({ data: id }: { data: number }) => {
    await db.delete(weActivities).where(eq(weActivities.id, id));
    return { success: true };
  },
);

export const getWeRecreation = createServerFn({ method: "GET" }).handler(async () => {
  const result = await db.select().from(weRecreation).limit(1);
  return result[0] || null;
});

export const updateWeRecreation = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: any }) => {
    const { id, ...updateData } = data;
    await db.update(weRecreation).set(updateData).where(eq(weRecreation.id, id));
    return { success: true };
  },
);

export const getWeMagazines = createServerFn({ method: "GET" }).handler(async () => {
  return await db.select().from(weMagazine).orderBy(asc(weMagazine.id));
});

export const addWeMagazine = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: any }) => {
    await db.insert(weMagazine).values(data);
    return { success: true };
  },
);

export const updateWeMagazine = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: any }) => {
    const { id, ...updateData } = data;
    await db.update(weMagazine).set(updateData).where(eq(weMagazine.id, id));
    return { success: true };
  },
);

export const deleteWeMagazine = createServerFn({ method: "POST" }).handler(
  async ({ data: id }: { data: number }) => {
    await db.delete(weMagazine).where(eq(weMagazine.id, id));
    return { success: true };
  },
);

export const getWeGallery = createServerFn({ method: "GET" }).handler(async () => {
  return await db.select().from(weGallery).orderBy(asc(weGallery.id));
});

export const addWeGalleryImage = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: any }) => {
    await db.insert(weGallery).values(data);
    return { success: true };
  },
);

export const deleteWeGalleryImage = createServerFn({ method: "POST" }).handler(
  async ({ data: id }: { data: number }) => {
    await db.delete(weGallery).where(eq(weGallery.id, id));
    return { success: true };
  },
);
