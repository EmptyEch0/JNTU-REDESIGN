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

export const updateNssProfile = createServerFn({ method: "POST" })
  .inputValidator((d: any) => d)
  .handler(async ({ data }) => {
    const { id, ...updateData } = data;
    return nssMutate(async () => {
      await db.update(nssProfile).set(updateData).where(eq(nssProfile.id, id));
      return { success: true };
    });
  });

export const getNssActivities = createServerFn({ method: "GET" }).handler(async () => {
  const cached = serverCache.get<any[]>("nss_activities");
  if (cached) return cached;

  const records = await db.select().from(nssActivities).orderBy(asc(nssActivities.sNo));
  serverCache.set("nss_activities", records);
  return records;
});

export const addNssActivity = createServerFn({ method: "POST" })
  .inputValidator((d: any) => d)
  .handler(async ({ data }) => {
    return nssMutate(async () => {
      await db.insert(nssActivities).values(data);
      return { success: true };
    });
  });

export const updateNssActivity = createServerFn({ method: "POST" })
  .inputValidator((d: any) => d)
  .handler(async ({ data }) => {
    const { id, ...updateData } = data;
    return nssMutate(async () => {
      await db.update(nssActivities).set(updateData).where(eq(nssActivities.id, id));
      return { success: true };
    });
  });

export const deleteNssActivity = createServerFn({ method: "POST" })
  .inputValidator((d: number) => d)
  .handler(async ({ data: id }) => {
    return nssMutate(async () => {
      await db.delete(nssActivities).where(eq(nssActivities.id, id));
      return { success: true };
    });
  });

export const getNssSpecialCamp = createServerFn({ method: "GET" }).handler(async () => {
  const cached = serverCache.get<any[]>("nss_special_camp");
  if (cached) return cached;

  const records = await db.select().from(nssSpecialCamp).orderBy(asc(nssSpecialCamp.id));
  serverCache.set("nss_special_camp", records);
  return records;
});

export const addNssSpecialCamp = createServerFn({ method: "POST" })
  .inputValidator((d: any) => d)
  .handler(async ({ data }) => {
    return nssMutate(async () => {
      await db.insert(nssSpecialCamp).values(data);
      return { success: true };
    });
  });

export const updateNssSpecialCamp = createServerFn({ method: "POST" })
  .inputValidator((d: any) => d)
  .handler(async ({ data }) => {
    const { id, ...updateData } = data;
    return nssMutate(async () => {
      await db.update(nssSpecialCamp).set(updateData).where(eq(nssSpecialCamp.id, id));
      return { success: true };
    });
  });

export const deleteNssSpecialCamp = createServerFn({ method: "POST" })
  .inputValidator((d: number) => d)
  .handler(async ({ data: id }) => {
    return nssMutate(async () => {
      await db.delete(nssSpecialCamp).where(eq(nssSpecialCamp.id, id));
      return { success: true };
    });
  });

const DEFAULT_NSS_GALLERY = [
  { id: -1, title: "NSS Youth Camp Activity", imageUrl: "uploads/2021/01/WhatsApp-Image-2021-01-11-at-15.48.17-1.jpeg" },
  { id: -2, title: "NSS Community Service Drive", imageUrl: "uploads/2021/01/WhatsApp-Image-2021-01-11-at-16.42.54-1.jpeg" },
  { id: -3, title: "3-Day Special Camp Activity", imageUrl: "uploads/2020/08/3-day-10-scaled.jpg" },
  { id: -4, title: "Volunteers Community Program", imageUrl: "uploads/2020/08/3-day-17-scaled.jpg" },
  { id: -5, title: "Cancer Awareness Day Drive 1", imageUrl: "uploads/2020/08/cancer-day1-scaled.jpg" },
  { id: -6, title: "Cancer Awareness Rally", imageUrl: "uploads/2020/08/cancerday-2.jpg" },
  { id: -7, title: "Cancer Awareness Session", imageUrl: "uploads/2020/08/cancer-day-3-scaled.jpg" },
  { id: -8, title: "Cancer Day Health Camp", imageUrl: "uploads/2020/08/cancer-day4.jpg" },
  { id: -9, title: "3-Day Special Service Event", imageUrl: "uploads/2020/08/3-day-9-scaled.jpg" },
];

export const getNssGallery = createServerFn({ method: "GET" }).handler(async () => {
  const cached = serverCache.get<any[]>("nss_gallery");
  if (cached && cached.length > 0) return cached;

  try {
    const records = await db.select().from(nssGallery).orderBy(asc(nssGallery.id));
    const result = records.length > 0 ? records : DEFAULT_NSS_GALLERY;
    serverCache.set("nss_gallery", result);
    return result;
  } catch {
    return DEFAULT_NSS_GALLERY;
  }
});

export const addNssGalleryImage = createServerFn({ method: "POST" })
  .inputValidator((data: { title: string; imageUrl: string }) => data)
  .handler(async ({ data }) => {
    return nssMutate(async () => {
      await db.insert(nssGallery).values(data);
      return { success: true };
    });
  });

export const deleteNssGalleryImage = createServerFn({ method: "POST" })
  .inputValidator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    return nssMutate(async () => {
      await db.delete(nssGallery).where(eq(nssGallery.id, data.id));
      return { success: true };
    });
  });
