import { createServerFn } from "@tanstack/react-start";
import { db } from "../db";
import {
  libraryContent,
  librarySections,
  libraryStats,
  libraryMeta,
  libraryTeam,
  libraryImages,
} from "../db/schema";
import { eq } from "drizzle-orm";
import { serverCache } from "../lib/server-cache";

async function libraryMutate<T>(action: () => Promise<T>): Promise<T> {
  const result = await action();
  serverCache.invalidate("library_data");
  return result;
}

/* ===========================
   🔐 ADMIN GUARD
=========================== */
function assertAdmin(ctx: any) {
  // Fully disabled for developer CMS accessibility
  /*
  if (ctx?.headers?.get("x-admin-key") !== "admin123") {
    throw new Error("Unauthorized");
  }
  */
}

/* ===========================
   📚 CONTENT (MERGED)
=========================== */
export const updateLibraryContent = createServerFn({ method: "POST" })
  .inputValidator((data: any) => data)
  .handler(async ({ data, context }) => {
    assertAdmin(context);

    await db.delete(libraryContent);

    return libraryMutate(() => db.insert(libraryContent).values({
      officerName: data.officerName,
      designation: data.designation,
      message: data.message,
      img: data.img,

      about: data.about,
      digitalDescription: data.digitalDescription,

      workingDays: data.workingDays,
      workingTime: data.workingTime,
      transactionTime: data.transactionTime,
    }).returning());
  });

/* ===========================
   🏢 SECTIONS
=========================== */
export const createSection = createServerFn({ method: "POST" })
  .inputValidator((data: any) => data)
  .handler(async ({ data, context }) => {
    assertAdmin(context);

    return libraryMutate(() => db.insert(librarySections).values(data).returning());
  });

export const deleteSection = createServerFn({ method: "POST" })
  .inputValidator((data: any) => data)
  .handler(async ({ data, context }) => {
    assertAdmin(context);

    return libraryMutate(() => db.delete(librarySections).where(eq(librarySections.id, data.id)));
  });

export const updateSection = createServerFn({ method: "POST" })
  .inputValidator((data: any) => data)
  .handler(async ({ data, context }) => {
    assertAdmin(context);

    return libraryMutate(() => db.update(librarySections).set(data).where(eq(librarySections.id, data.id)).returning());
  });

/* ===========================
   📊 STATS (TITLES + PERIODICALS)
=========================== */
export const createStat = createServerFn({ method: "POST" })
  .inputValidator((data: any) => data)
  .handler(async ({ data, context }) => {
    assertAdmin(context);

    return libraryMutate(() => db.insert(libraryStats).values(data).returning());
  });

export const deleteStat = createServerFn({ method: "POST" })
  .inputValidator((data: any) => data)
  .handler(async ({ data, context }) => {
    assertAdmin(context);

    return libraryMutate(() => db.delete(libraryStats).where(eq(libraryStats.id, data.id)));
  });

export const updateStat = createServerFn({ method: "POST" })
  .inputValidator((data: any) => data)
  .handler(async ({ data, context }) => {
    assertAdmin(context);

    return libraryMutate(() => db.update(libraryStats).set(data).where(eq(libraryStats.id, data.id)).returning());
  });

/* ===========================
   📋 META (DIGITAL / MAGAZINE / NEWSPAPER)
=========================== */
export const createMeta = createServerFn({ method: "POST" })
  .inputValidator((data: any) => data)
  .handler(async ({ data, context }) => {
    assertAdmin(context);

    return libraryMutate(() => db.insert(libraryMeta).values(data).returning());
  });

export const deleteMeta = createServerFn({ method: "POST" })
  .inputValidator((data: any) => data)
  .handler(async ({ data, context }) => {
    assertAdmin(context);

    return libraryMutate(() => db.delete(libraryMeta).where(eq(libraryMeta.id, data.id)));
  });

export const updateMeta = createServerFn({ method: "POST" })
  .inputValidator((data: any) => data)
  .handler(async ({ data, context }) => {
    assertAdmin(context);

    return libraryMutate(() => db.update(libraryMeta).set(data).where(eq(libraryMeta.id, data.id)).returning());
  });

/* ===========================
   👥 TEAM
=========================== */
export const createTeam = createServerFn({ method: "POST" })
  .inputValidator((data: any) => data)
  .handler(async ({ data, context }) => {
    assertAdmin(context);

    return libraryMutate(() => db.insert(libraryTeam).values(data).returning());
  });

export const deleteTeam = createServerFn({ method: "POST" })
  .inputValidator((data: any) => data)
  .handler(async ({ data, context }) => {
    assertAdmin(context);

    return libraryMutate(() => db.delete(libraryTeam).where(eq(libraryTeam.id, data.id)));
  });

export const updateTeam = createServerFn({ method: "POST" })
  .inputValidator((data: any) => data)
  .handler(async ({ data, context }) => {
    assertAdmin(context);

    return libraryMutate(() => db.update(libraryTeam).set(data).where(eq(libraryTeam.id, data.id)).returning());
  });

/* ===========================
   🖼️ IMAGES
=========================== */
export const createImage = createServerFn({ method: "POST" })
  .inputValidator((data: any) => data)
  .handler(async ({ data, context }) => {
    assertAdmin(context);

    return libraryMutate(() => db.insert(libraryImages).values(data).returning());
  });

export const deleteImage = createServerFn({ method: "POST" })
  .inputValidator((data: any) => data)
  .handler(async ({ data, context }) => {
    assertAdmin(context);

    return libraryMutate(() => db.delete(libraryImages).where(eq(libraryImages.id, data.id)));
  });