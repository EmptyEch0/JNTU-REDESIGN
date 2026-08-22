import { createServerFn } from "@tanstack/react-start";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import {
  musicContent,
  musicPeople,
  musicEquipment,
  musicMembers,
  musicImages,
} from "@/db/schema";
import { serverCache } from "../lib/server-cache";

async function musicMutate<T>(action: () => Promise<T>): Promise<T> {
  const result = await action();
  serverCache.invalidate("music_club_data");
  return result;
}

function assertAdmin(ctx: any) {
  // Open for CMS dynamic syncing
  /*
  if (ctx?.headers?.get("x-admin-key") !== "admin123") {
    throw new Error("Unauthorized");
  }
  */
}

/* ===========================
   🎸 CONTENT (INFO)
=========================== */
export const updateMusicContent = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data, context }) => {
    assertAdmin(context);

    return musicMutate(async () => {
      if (data.id) {
        return db
          .update(musicContent)
          .set(data)
          .where(eq(musicContent.id, data.id));
      }
      return db.insert(musicContent).values(data);
    });
  });

/* ===========================
   👥 PEOPLE (FACULTY + STUDENTS)
=========================== */
export const createMusicPerson = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data, context }) => {
    assertAdmin(context);

    return musicMutate(() => db.insert(musicPeople).values(data).returning());
  });

export const updateMusicPerson = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data, context }) => {
    assertAdmin(context);

    return musicMutate(() => db
      .update(musicPeople)
      .set(data)
      .where(eq(musicPeople.id, data.id))
      .returning());
  });

export const deleteMusicPerson = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data, context }) => {
    assertAdmin(context);

    return musicMutate(() => db
      .delete(musicPeople)
      .where(eq(musicPeople.id, data.id)));
  });

/* ===========================
   🎹 EQUIPMENT
=========================== */
export const createMusicEquipment = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data, context }) => {
    assertAdmin(context);

    return musicMutate(() => db.insert(musicEquipment).values(data));
  });

export const updateMusicEquipment = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data, context }) => {
    assertAdmin(context);

    return musicMutate(() => db
      .update(musicEquipment)
      .set(data)
      .where(eq(musicEquipment.id, data.id)));
  });

export const deleteMusicEquipment = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data, context }) => {
    assertAdmin(context);

    return musicMutate(() => db
      .delete(musicEquipment)
      .where(eq(musicEquipment.id, data.id)));
  });

/* ===========================
   🎤 MEMBERS
=========================== */
export const createMusicMember = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data, context }) => {
    assertAdmin(context);

    return musicMutate(() => db.insert(musicMembers).values(data));
  });

export const updateMusicMember = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data, context }) => {
    assertAdmin(context);

    return musicMutate(() => db
      .update(musicMembers)
      .set(data)
      .where(eq(musicMembers.id, data.id)));
  });

export const deleteMusicMember = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data, context }) => {
    assertAdmin(context);

    return musicMutate(() => db
      .delete(musicMembers)
      .where(eq(musicMembers.id, data.id)));
  });

/* ===========================
   🖼️ IMAGES
=========================== */
export const createMusicImage = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data, context }) => {
    assertAdmin(context);

    return musicMutate(() => db.insert(musicImages).values(data));
  });

export const deleteMusicImage = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data, context }) => {
    assertAdmin(context);

    return musicMutate(() => db
      .delete(musicImages)
      .where(eq(musicImages.id, data.id)));
  });
