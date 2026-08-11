import { createServerFn } from "@tanstack/react-start";
import { db } from "../db/index";
import { nssProfile, nssActivities, nssSpecialCamp, nssGallery } from "../db/schema";
import { eq, asc } from "drizzle-orm";
import { serverCache } from "../lib/server-cache";

async function nssMutate<T>(action: () => Promise<T>): Promise<T> {
  const result = await action();
  serverCache.invalidate("nss_", true);
  return result;
}

export const getNssProfile = createServerFn({ method: "GET" }).handler(async () => {
  const cached = serverCache.get<any>("nss_profile");
  if (cached) return cached;

  const result = await db.select().from(nssProfile).limit(1);
  const data = result[0] || null;
  serverCache.set("nss_profile", data);
  return data;
});

export const updateNssProfile = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: any }) => {
    const { id, ...updateData } = data;
    return nssMutate(async () => {
      await db.update(nssProfile).set(updateData).where(eq(nssProfile.id, id));
      return { success: true };
    });
  },
);

export const getNssActivities = createServerFn({ method: "GET" }).handler(async () => {
  const cached = serverCache.get<any[]>("nss_activities");
  if (cached) return cached;

  const records = await db.select().from(nssActivities).orderBy(asc(nssActivities.sNo));
  serverCache.set("nss_activities", records);
  return records;
});

export const addNssActivity = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: any }) => {
    return nssMutate(async () => {
      await db.insert(nssActivities).values(data);
      return { success: true };
    });
  },
);

export const updateNssActivity = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: any }) => {
    const { id, ...updateData } = data;
    return nssMutate(async () => {
      await db.update(nssActivities).set(updateData).where(eq(nssActivities.id, id));
      return { success: true };
    });
  },
);

export const deleteNssActivity = createServerFn({ method: "POST" }).handler(
  async ({ data: id }: { data: number }) => {
    return nssMutate(async () => {
      await db.delete(nssActivities).where(eq(nssActivities.id, id));
      return { success: true };
    });
  },
);

export const getNssSpecialCamp = createServerFn({ method: "GET" }).handler(async () => {
  const cached = serverCache.get<any[]>("nss_special_camp");
  if (cached) return cached;

  const records = await db.select().from(nssSpecialCamp).orderBy(asc(nssSpecialCamp.id));
  serverCache.set("nss_special_camp", records);
  return records;
});

export const addNssSpecialCamp = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: any }) => {
    return nssMutate(async () => {
      await db.insert(nssSpecialCamp).values(data);
      return { success: true };
    });
  },
);

export const updateNssSpecialCamp = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: any }) => {
    const { id, ...updateData } = data;
    return nssMutate(async () => {
      await db.update(nssSpecialCamp).set(updateData).where(eq(nssSpecialCamp.id, id));
      return { success: true };
    });
  },
);

export const deleteNssSpecialCamp = createServerFn({ method: "POST" }).handler(
  async ({ data: id }: { data: number }) => {
    return nssMutate(async () => {
      await db.delete(nssSpecialCamp).where(eq(nssSpecialCamp.id, id));
      return { success: true };
    });
  },
);

export const getNssGallery = createServerFn({ method: "GET" }).handler(async () => {
  const cached = serverCache.get<any[]>("nss_gallery");
  if (cached) return cached;

  const records = await db.select().from(nssGallery).orderBy(asc(nssGallery.id));
  serverCache.set("nss_gallery", records);
  return records;
});

export const addNssGalleryImage = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: any }) => {
    return nssMutate(async () => {
      await db.insert(nssGallery).values(data);
      return { success: true };
    });
  },
);

export const deleteNssGalleryImage = createServerFn({ method: "POST" }).handler(
  async ({ data: id }: { data: number }) => {
    return nssMutate(async () => {
      await db.delete(nssGallery).where(eq(nssGallery.id, id));
      return { success: true };
    });
  },
);
