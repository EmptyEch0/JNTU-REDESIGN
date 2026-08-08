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

export const updateWeProfile = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: any }) => {
    const { id, ...updateData } = data;
    return weMutate(async () => {
      await db.update(weProfile).set(updateData).where(eq(weProfile.id, id));
      return { success: true };
    });
  },
);

export const getWeCommittee = createServerFn({ method: "GET" }).handler(async () => {
  const cached = serverCache.get<any[]>("we_committee");
  if (cached) return cached;

  const records = await db.select().from(weCommittee).orderBy(asc(weCommittee.id));
  serverCache.set("we_committee", records);
  return records;
});

export const addWeCommitteeMember = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: any }) => {
    return weMutate(async () => {
      await db.insert(weCommittee).values(data);
      return { success: true };
    });
  },
);

export const updateWeCommitteeMember = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: any }) => {
    const { id, ...updateData } = data;
    return weMutate(async () => {
      await db.update(weCommittee).set(updateData).where(eq(weCommittee.id, id));
      return { success: true };
    });
  },
);

export const deleteWeCommitteeMember = createServerFn({ method: "POST" }).handler(
  async ({ data: id }: { data: number }) => {
    return weMutate(async () => {
      await db.delete(weCommittee).where(eq(weCommittee.id, id));
      return { success: true };
    });
  },
);

export const getWeActivities = createServerFn({ method: "GET" }).handler(async () => {
  const cached = serverCache.get<any[]>("we_activities");
  if (cached) return cached;

  const records = await db.select().from(weActivities).orderBy(asc(weActivities.sNo));
  serverCache.set("we_activities", records);
  return records;
});

export const addWeActivity = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: any }) => {
    return weMutate(async () => {
      await db.insert(weActivities).values(data);
      return { success: true };
    });
  },
);

export const updateWeActivity = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: any }) => {
    const { id, ...updateData } = data;
    return weMutate(async () => {
      await db.update(weActivities).set(updateData).where(eq(weActivities.id, id));
      return { success: true };
    });
  },
);

export const deleteWeActivity = createServerFn({ method: "POST" }).handler(
  async ({ data: id }: { data: number }) => {
    return weMutate(async () => {
      await db.delete(weActivities).where(eq(weActivities.id, id));
      return { success: true };
    });
  },
);

export const getWeRecreation = createServerFn({ method: "GET" }).handler(async () => {
  const cached = serverCache.get<any>("we_recreation");
  if (cached) return cached;

  const result = await db.select().from(weRecreation).limit(1);
  const data = result[0] || null;
  serverCache.set("we_recreation", data);
  return data;
});

export const updateWeRecreation = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: any }) => {
    const { id, ...updateData } = data;
    return weMutate(async () => {
      await db.update(weRecreation).set(updateData).where(eq(weRecreation.id, id));
      return { success: true };
    });
  },
);

export const getWeMagazines = createServerFn({ method: "GET" }).handler(async () => {
  const cached = serverCache.get<any[]>("we_magazines");
  if (cached) return cached;

  const records = await db.select().from(weMagazine).orderBy(asc(weMagazine.id));
  serverCache.set("we_magazines", records);
  return records;
});

export const addWeMagazine = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: any }) => {
    return weMutate(async () => {
      await db.insert(weMagazine).values(data);
      return { success: true };
    });
  },
);

export const updateWeMagazine = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: any }) => {
    const { id, ...updateData } = data;
    return weMutate(async () => {
      await db.update(weMagazine).set(updateData).where(eq(weMagazine.id, id));
      return { success: true };
    });
  },
);

export const deleteWeMagazine = createServerFn({ method: "POST" }).handler(
  async ({ data: id }: { data: number }) => {
    return weMutate(async () => {
      await db.delete(weMagazine).where(eq(weMagazine.id, id));
      return { success: true };
    });
  },
);

export const getWeGallery = createServerFn({ method: "GET" }).handler(async () => {
  const cached = serverCache.get<any[]>("we_gallery");
  if (cached) return cached;

  const records = await db.select().from(weGallery).orderBy(asc(weGallery.id));
  serverCache.set("we_gallery", records);
  return records;
});

export const addWeGalleryImage = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: any }) => {
    return weMutate(async () => {
      await db.insert(weGallery).values(data);
      return { success: true };
    });
  },
);

export const deleteWeGalleryImage = createServerFn({ method: "POST" }).handler(
  async ({ data: id }: { data: number }) => {
    return weMutate(async () => {
      await db.delete(weGallery).where(eq(weGallery.id, id));
      return { success: true };
    });
  },
);
