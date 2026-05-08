import { createServerFn } from "@tanstack/react-start";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import {
  studentClubs,
  studentClubContent,
  studentClubImages,
} from "@/db/schema";

/* ===========================
   🔐 ADMIN GUARD
=========================== */
function assertAdmin(ctx: any) {
  if (ctx?.headers?.get("x-admin-key") !== "admin123") {
    throw new Error("Unauthorized");
  }
}

/* ===========================
   🎪 STUDENT CLUBS
=========================== */
export const updateStudentClub = createServerFn({ method: "POST" })
  .inputValidator((data: any) => data)
  .handler(async ({ data, context }) => {
    assertAdmin(context);

    if (data.id) {
      return db
        .update(studentClubs)
        .set(data)
        .where(eq(studentClubs.id, data.id))
        .returning();
    }

    return db.insert(studentClubs).values(data).returning();
  });

export const deleteStudentClub = createServerFn({ method: "POST" })
  .inputValidator((data: any) => data)
  .handler(async ({ data, context }) => {
    assertAdmin(context);

    // Delete associated sections & images first
    await db.delete(studentClubContent).where(eq(studentClubContent.clubId, data.id));
    await db.delete(studentClubImages).where(eq(studentClubImages.clubId, data.id));

    return db
      .delete(studentClubs)
      .where(eq(studentClubs.id, data.id));
  });

/* ===========================
   📝 CLUB SECTIONS (CONTENT)
=========================== */
export const createClubContent = createServerFn({ method: "POST" })
  .inputValidator((data: any) => data)
  .handler(async ({ data, context }) => {
    assertAdmin(context);

    return db.insert(studentClubContent).values(data);
  });

export const deleteClubContent = createServerFn({ method: "POST" })
  .inputValidator((data: any) => data)
  .handler(async ({ data, context }) => {
    assertAdmin(context);

    return db
      .delete(studentClubContent)
      .where(eq(studentClubContent.id, data.id));
  });

/* ===========================
   🖼️ CLUB GALLERY IMAGES
=========================== */
export const createClubImage = createServerFn({ method: "POST" })
  .inputValidator((data: any) => data)
  .handler(async ({ data, context }) => {
    assertAdmin(context);

    return db.insert(studentClubImages).values(data);
  });

export const deleteClubImage = createServerFn({ method: "POST" })
  .inputValidator((data: any) => data)
  .handler(async ({ data, context }) => {
    assertAdmin(context);

    return db
      .delete(studentClubImages)
      .where(eq(studentClubImages.id, data.id));
  });
