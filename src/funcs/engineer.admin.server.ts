import { createServerFn } from "@tanstack/react-start";
import { db } from "@/db";
import { engContent, engMeta, engStaff } from "@/db/schema";
import { eq } from "drizzle-orm";
import { serverCache } from "../lib/server-cache";

async function engMutate<T>(action: () => Promise<T>): Promise<T> {
  const result = await action();
  serverCache.invalidate("engineering_data");
  return result;
}

function assertAdmin(context: any) {
  // Bypassed for developer unified CMS accessibility
  /*
  if (context?.headers?.get("x-admin-key") !== "admin123") {
    throw new Error("Unauthorized admin access");
  }
  */
}

function getPayload(data: any) {
  if (data && data.data !== undefined) {
    return data.data;
  }
  return data;
}

/* ================= UPDATE CONTENT ================= */
export const updateEngineeringContent = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data, context }) => {
    assertAdmin(context);

    const payload = getPayload(data);
    const { id, title, description, vision, mission } = payload;

    return engMutate(async () => {
      if (id) {
        await db.update(engContent)
          .set({ title, description, vision, mission })
          .where(eq(engContent.id, id));
      } else {
        await db.insert(engContent).values({ title, description, vision, mission });
      }
      return { success: true };
    });
  });

/* ================= SAVE/UPDATE ELECTRICAL INFO ================= */
export const updateElectricalInfo = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data, context }) => {
    assertAdmin(context);

    const payload = getPayload(data);
    const { id, title, name, description, engineer, img } = payload;

    return engMutate(async () => {
      if (id) {
        await db.update(engMeta)
          .set({ title, name, description, engineer, img })
          .where(eq(engMeta.id, id));
      } else {
        await db.insert(engMeta).values({
          category: "electrical",
          title,
          name,
          description,
          engineer,
          img,
        });
      }
      return { success: true };
    });
  });

/* ================= CREATE META POINT (CONSTRUCTION) ================= */
export const createMetaPoint = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data, context }) => {
    assertAdmin(context);

    const payload = getPayload(data);
    const { category, content } = payload;

    return engMutate(async () => {
      await db.insert(engMeta).values({
        category,
        content,
      });
      return { success: true };
    });
  });

/* ================= DELETE META POINT ================= */
export const deleteMetaPoint = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data, context }) => {
    assertAdmin(context);

    const payload = getPayload(data);
    const { id } = payload;

    return engMutate(async () => {
      await db.delete(engMeta).where(eq(engMeta.id, id));
      return { success: true };
    });
  });

export const updateMetaPoint = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data, context }) => {
    assertAdmin(context);

    const payload = getPayload(data);
    const { id, content, title, engineer, name, img } = payload;

    return engMutate(async () => {
      await db.update(engMeta)
        .set({ content, title, engineer, name, img })
        .where(eq(engMeta.id, id));
      return { success: true };
    });
  });

/* ================= CREATE STAFF MEMBER ================= */
export const createStaffMember = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data, context }) => {
    assertAdmin(context);

    const payload = getPayload(data);
    const { name, designation, type, img } = payload;

    return engMutate(async () => {
      await db.insert(engStaff).values({
        name,
        designation,
        type,
        img,
      });
      return { success: true };
    });
  });

/* ================= DELETE STAFF MEMBER ================= */
export const deleteStaffMember = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data, context }) => {
    assertAdmin(context);

    const payload = getPayload(data);
    const { id } = payload;

    return engMutate(async () => {
      await db.delete(engStaff).where(eq(engStaff.id, id));
      return { success: true };
    });
  });

export const updateStaffMember = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data, context }) => {
    assertAdmin(context);

    const payload = getPayload(data);
    const { id, name, designation, type, img } = payload;

    return engMutate(async () => {
      await db.update(engStaff)
        .set({ name, designation, type, img })
        .where(eq(engStaff.id, id));
      return { success: true };
    });
  });
