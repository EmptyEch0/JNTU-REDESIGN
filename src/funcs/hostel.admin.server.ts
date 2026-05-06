import { createServerFn } from "@tanstack/react-start";
import { db } from "../db";
import {
  hostelStructure,
  hostelPeople,
  hostelImages,
  hostelContent,
} from "../db/schema";
import { eq } from "drizzle-orm";

/* ===========================
   🔐 ADMIN GUARD
=========================== */
function assertAdmin(ctx: any) {
  if (ctx?.headers?.get("x-admin-key") !== "admin123") {
    throw new Error("Unauthorized");
  }
}

/* ===========================
   🏢 STRUCTURE (BLOCK + FACILITY)
=========================== */
export const createStructure = createServerFn({ method: "POST" })
  .inputValidator((data: any) => data)
  .handler(async ({ data, context }) => {
    assertAdmin(context);
    return db.insert(hostelStructure).values(data).returning();
  });

export const updateStructure = createServerFn({ method: "POST" })
  .inputValidator((data: any) => data)
  .handler(async ({ data, context }) => {
    assertAdmin(context);
    return db
      .update(hostelStructure)
      .set(data)
      .where(eq(hostelStructure.id, data.id))
      .returning();
  });

export const deleteStructure = createServerFn({ method: "POST" })
  .inputValidator((data: any) => data)
  .handler(async ({ data, context }) => {
    assertAdmin(context);
    return db
      .delete(hostelStructure)
      .where(eq(hostelStructure.id, data.id));
  });

/* ===========================
   👥 PEOPLE (WARDEN + STAFF)
=========================== */
export const createPerson = createServerFn({ method: "POST" })
  .inputValidator((data: any) => data)
  .handler(async ({ data, context }) => {
    assertAdmin(context);
    return db.insert(hostelPeople).values(data).returning();
  });

export const updatePerson = createServerFn({ method: "POST" })
  .inputValidator((data: any) => data)
  .handler(async ({ data, context }) => {
    assertAdmin(context);
    return db
      .update(hostelPeople)
      .set(data)
      .where(eq(hostelPeople.id, data.id))
      .returning();
  });

export const deletePerson = createServerFn({ method: "POST" })
  .inputValidator((data: any) => data)
  .handler(async ({ data, context }) => {
    assertAdmin(context);
    return db
      .delete(hostelPeople)
      .where(eq(hostelPeople.id, data.id));
  });

/* ===========================
   🏠 CONTENT (MERGED)
=========================== */
export const updateContent = createServerFn({ method: "POST" })
  .inputValidator((data: any) => data)
  .handler(async ({ data, context }) => {
    assertAdmin(context);

    await db.delete(hostelContent);

    return db.insert(hostelContent).values({
      description: data.description,
      officerName: data.officerName,
      officerRole: data.officerRole,
      officerImage: data.officerImage,
      healthName: data.healthName,
      healthTiming: data.healthTiming,
    }).returning();
  });

/* ===========================
   🖼️ IMAGES
=========================== */
export const createImage = createServerFn({ method: "POST" })
  .inputValidator((data: any) => data)
  .handler(async ({ data, context }) => {
    assertAdmin(context);
    return db.insert(hostelImages).values(data).returning();
  });

export const deleteImage = createServerFn({ method: "POST" })
  .inputValidator((data: any) => data)
  .handler(async ({ data, context }) => {
    assertAdmin(context);
    return db
      .delete(hostelImages)
      .where(eq(hostelImages.id, data.id));
  });