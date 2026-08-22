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
import { serverCache } from "../lib/server-cache";

async function weMutate<T>(action: () => Promise<T>): Promise<T> {
  const result = await action();
  serverCache.invalidate("we_", true);
  return result;
}

export const getWeProfile = createServerFn({ method: "GET" }).handler(async () => {
  const cached = serverCache.get<any>("we_profile");
  if (cached) return cached;

  const result = await db.select().from(weProfile).limit(1);
  const data = result[0] || null;
  serverCache.set("we_profile", data);
  return data;
});

export const updateWeProfile = createServerFn({ method: "POST" })
  .validator((d: any) => d)
  .handler(async ({ data }) => {
    const { id, ...updateData } = data;
    return weMutate(async () => {
      await db.update(weProfile).set(updateData).where(eq(weProfile.id, id));
      return { success: true };
    });
  });

export const getWeCommittee = createServerFn({ method: "GET" }).handler(async () => {
  const cached = serverCache.get<any[]>("we_committee");
  if (cached) return cached;

  const records = await db.select().from(weCommittee).orderBy(asc(weCommittee.id));
  serverCache.set("we_committee", records);
  return records;
});

export const addWeCommitteeMember = createServerFn({ method: "POST" })
  .validator((d: any) => d)
  .handler(async ({ data }) => {
    return weMutate(async () => {
      await db.insert(weCommittee).values(data);
      return { success: true };
    });
  });

export const updateWeCommitteeMember = createServerFn({ method: "POST" })
  .validator((d: any) => d)
  .handler(async ({ data }) => {
    const { id, ...updateData } = data;
    return weMutate(async () => {
      await db.update(weCommittee).set(updateData).where(eq(weCommittee.id, id));
      return { success: true };
    });
  });

export const deleteWeCommitteeMember = createServerFn({ method: "POST" })
  .validator((d: number) => d)
  .handler(async ({ data: id }) => {
    return weMutate(async () => {
      await db.delete(weCommittee).where(eq(weCommittee.id, id));
      return { success: true };
    });
  });

export const getWeActivities = createServerFn({ method: "GET" }).handler(async () => {
  const cached = serverCache.get<any[]>("we_activities");
  if (cached) return cached;

  const records = await db.select().from(weActivities).orderBy(asc(weActivities.sNo));
  serverCache.set("we_activities", records);
  return records;
});

export const addWeActivity = createServerFn({ method: "POST" })
  .validator((d: any) => d)
  .handler(async ({ data }) => {
    return weMutate(async () => {
      await db.insert(weActivities).values(data);
      return { success: true };
    });
  });

export const updateWeActivity = createServerFn({ method: "POST" })
  .validator((d: any) => d)
  .handler(async ({ data }) => {
    const { id, ...updateData } = data;
    return weMutate(async () => {
      await db.update(weActivities).set(updateData).where(eq(weActivities.id, id));
      return { success: true };
    });
  });

export const deleteWeActivity = createServerFn({ method: "POST" })
  .validator((d: number) => d)
  .handler(async ({ data: id }) => {
    return weMutate(async () => {
      await db.delete(weActivities).where(eq(weActivities.id, id));
      return { success: true };
    });
  });

export const getWeRecreation = createServerFn({ method: "GET" }).handler(async () => {
  const cached = serverCache.get<any>("we_recreation");
  if (cached) return cached;

  const result = await db.select().from(weRecreation).limit(1);
  const data = result[0] || null;
  serverCache.set("we_recreation", data);
  return data;
});

export const updateWeRecreation = createServerFn({ method: "POST" })
  .validator((d: any) => d)
  .handler(async ({ data }) => {
    const { id, ...updateData } = data;
    return weMutate(async () => {
      await db.update(weRecreation).set(updateData).where(eq(weRecreation.id, id));
      return { success: true };
    });
  });

export const getWeMagazines = createServerFn({ method: "GET" }).handler(async () => {
  const cached = serverCache.get<any[]>("we_magazines");
  if (cached) return cached;

  const records = await db.select().from(weMagazine).orderBy(asc(weMagazine.id));
  serverCache.set("we_magazines", records);
  return records;
});

export const addWeMagazine = createServerFn({ method: "POST" })
  .validator((d: any) => d)
  .handler(async ({ data }) => {
    return weMutate(async () => {
      await db.insert(weMagazine).values(data);
      return { success: true };
    });
  });

export const updateWeMagazine = createServerFn({ method: "POST" })
  .validator((d: any) => d)
  .handler(async ({ data }) => {
    const { id, ...updateData } = data;
    return weMutate(async () => {
      await db.update(weMagazine).set(updateData).where(eq(weMagazine.id, id));
      return { success: true };
    });
  });

export const deleteWeMagazine = createServerFn({ method: "POST" })
  .validator((d: number) => d)
  .handler(async ({ data: id }) => {
    return weMutate(async () => {
      await db.delete(weMagazine).where(eq(weMagazine.id, id));
      return { success: true };
    });
  });

const DEFAULT_WE_GALLERY = [
  { id: -1, title: "Women Empowerment Activity", imageUrl: "uploads/2020/08/IMG-20191216-WA0038.jpg" },
  { id: -2, title: "Campus Program", imageUrl: "uploads/2020/08/DSCN0609-scaled.jpg" },
  { id: -3, title: "Women Empowerment Awareness Session", imageUrl: "uploads/2020/08/WhatsApp-Image-2020-08-28-at-11.25.46-AM.jpeg" },
  { id: -4, title: "Empowerment Workshop", imageUrl: "uploads/2020/08/DSCN0825-scaled.jpg" },
  { id: -5, title: "Special Gathering", imageUrl: "uploads/2020/08/12.jpg" },
  { id: -6, title: "Community Interactive Session", imageUrl: "uploads/2020/08/DSCN0648-scaled.jpg" },
  { id: -7, title: "Campus Leadership Event", imageUrl: "uploads/2020/08/DSCN0649-scaled.jpg" },
  { id: -8, title: "Empowerment Cell Meeting", imageUrl: "uploads/2020/08/WhatsApp-Image-2020-08-28-at-11.09.16-AM-3.jpeg" },
  { id: -9, title: "Student Awareness Drive", imageUrl: "uploads/2020/08/WhatsApp-Image-2020-08-28-at-11.27.17-AM.jpeg" },
  { id: -10, title: "Annual WE&GC Meet", imageUrl: "uploads/2020/08/DSC02794-scaled.jpg" },
];

export const getWeGallery = createServerFn({ method: "GET" }).handler(async () => {
  const cached = serverCache.get<any[]>("we_gallery");
  if (cached && cached.length > 0) return cached;

  try {
    const records = await db.select().from(weGallery).orderBy(asc(weGallery.id));
    const result = records.length > 0 ? records : DEFAULT_WE_GALLERY;
    serverCache.set("we_gallery", result);
    return result;
  } catch {
    return DEFAULT_WE_GALLERY;
  }
});

export const addWeGalleryImage = createServerFn({ method: "POST" })
  .validator((data: { title: string; imageUrl: string }) => data)
  .handler(async ({ data }) => {
    return weMutate(async () => {
      await db.insert(weGallery).values(data);
      return { success: true };
    });
  });

export const deleteWeGalleryImage = createServerFn({ method: "POST" })
  .validator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    return weMutate(async () => {
      await db.delete(weGallery).where(eq(weGallery.id, data.id));
      return { success: true };
    });
  });
