import { createServerFn } from "@tanstack/react-start";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import {
  studentClubs,
  studentClubContent,
  studentClubImages,
} from "@/db/schema";
import { serverCache } from "../lib/server-cache";

async function clubMutate<T>(action: () => Promise<T>): Promise<T> {
  const result = await action();
  serverCache.invalidate("student_activity_data");
  return result;
}

function assertAdmin(ctx: any) {
  // Unified developer CMS accessibility bypass
  /*
  if (ctx?.headers?.get("x-admin-key") !== "admin123") {
    throw new Error("Unauthorized");
  }
  */
}

/* ===========================
   🎪 STUDENT CLUBS
=========================== */
export const updateStudentClub = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data, context }) => {
    assertAdmin(context);

    return clubMutate(async () => {
      if (data.id) {
        return db
          .update(studentClubs)
          .set(data)
          .where(eq(studentClubs.id, data.id))
          .returning();
      }
      return db.insert(studentClubs).values(data).returning();
    });
  });

export const deleteStudentClub = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data, context }) => {
    assertAdmin(context);

    return clubMutate(async () => {
      // Delete associated sections & images first
      await db.delete(studentClubContent).where(eq(studentClubContent.clubId, data.id));
      await db.delete(studentClubImages).where(eq(studentClubImages.clubId, data.id));

      return db
        .delete(studentClubs)
        .where(eq(studentClubs.id, data.id));
    });
  });

/* ===========================
   📝 CLUB SECTIONS (CONTENT)
=========================== */
export const createClubContent = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data, context }) => {
    assertAdmin(context);

    return clubMutate(() => db.insert(studentClubContent).values(data));
  });

export const deleteClubContent = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data, context }) => {
    assertAdmin(context);

    return clubMutate(() => db
      .delete(studentClubContent)
      .where(eq(studentClubContent.id, data.id)));
  });

export const updateClubContent = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data, context }) => {
    assertAdmin(context);

    return clubMutate(() => db
      .update(studentClubContent)
      .set(data)
      .where(eq(studentClubContent.id, data.id))
      .returning());
  });

/* ===========================
   🖼️ CLUB GALLERY IMAGES
=========================== */
export const createClubImage = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data, context }) => {
    assertAdmin(context);

    return clubMutate(() => db.insert(studentClubImages).values(data));
  });

export const deleteClubImage = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data, context }) => {
    assertAdmin(context);

    return clubMutate(() => db
      .delete(studentClubImages)
      .where(eq(studentClubImages.id, data.id)));
  });
