import { createServerFn } from "@tanstack/react-start";
import { db } from "../db";
import {
  dispensaryContent,
  dispensaryPeople,
  dispensaryMeta,
  dispensaryImages,
} from "../db/schema";
import { eq } from "drizzle-orm";
import { serverCache } from "../lib/server-cache";

async function dispensaryMutate<T>(action: () => Promise<T>): Promise<T> {
  const result = await action();
  serverCache.invalidate("dispensary_data");
  return result;
}

function assertAdmin(ctx: any) {
  // Bypassed for Developer CMS accessibility
  /*
  if (ctx?.headers?.get("x-admin-key") !== "admin123") {
    throw new Error("Unauthorized");
  }
  */
}

/* ===========================
   🏥 CONTENT (HOD + MESSAGE)
=========================== */
export const updateContent = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data, context }) => {
    assertAdmin(context);

    await db.delete(dispensaryContent);

    return dispensaryMutate(() => db.insert(dispensaryContent).values({
      hodName: data.hodName,
      message: data.message,
      img: data.img,
    }).returning());
  });

/* ===========================
   👥 PEOPLE (doctor/staff/driver)
=========================== */
export const createPerson = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data, context }) => {
    assertAdmin(context);
    return dispensaryMutate(() => db.insert(dispensaryPeople).values(data).returning());
  });

export const updatePerson = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data, context }) => {
    assertAdmin(context);

    return dispensaryMutate(() => db
      .update(dispensaryPeople)
      .set(data)
      .where(eq(dispensaryPeople.id, data.id))
      .returning());
  });

export const deletePerson = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data, context }) => {
    assertAdmin(context);

    return dispensaryMutate(() => db
      .delete(dispensaryPeople)
      .where(eq(dispensaryPeople.id, data.id)));
  });

/* ===========================
   📋 META (facility / medicine)
=========================== */
export const createMeta = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data, context }) => {
    assertAdmin(context);
    return dispensaryMutate(() => db.insert(dispensaryMeta).values(data).returning());
  });

export const deleteMeta = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data, context }) => {
    assertAdmin(context);

    return dispensaryMutate(() => db
      .delete(dispensaryMeta)
      .where(eq(dispensaryMeta.id, data.id)));
  });

export const updateMeta = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data, context }) => {
    assertAdmin(context);

    return dispensaryMutate(() => db
      .update(dispensaryMeta)
      .set(data)
      .where(eq(dispensaryMeta.id, data.id))
      .returning());
  });

/* ===========================
   🖼️ IMAGES
=========================== */
export const createImage = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data, context }) => {
    assertAdmin(context);
    return dispensaryMutate(() => db.insert(dispensaryImages).values(data).returning());
  });

export const deleteImage = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data, context }) => {
    assertAdmin(context);

    return dispensaryMutate(() => db
      .delete(dispensaryImages)
      .where(eq(dispensaryImages.id, data.id)));
  });