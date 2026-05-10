import { createServerFn } from "@tanstack/react-start";
import { db } from "@/db";
import { engContent, engMeta, engStaff } from "@/db/schema";
import { eq } from "drizzle-orm";

function assertAdmin(context: any) {
  if (context?.headers?.get("x-admin-key") !== "admin123") {
    throw new Error("Unauthorized admin access");
  }
}

function getPayload(data: any) {
  if (data && data.data !== undefined) {
    return data.data;
  }
  return data;
}

/* ================= UPDATE CONTENT ================= */
export const updateEngineeringContent = createServerFn({ method: "POST" })
  .inputValidator((data: any) => data)
  .handler(async ({ data, context }) => {
    assertAdmin(context);

    const payload = getPayload(data);
    const { id, title, description, vision, mission } = payload;

    if (id) {
      await db.update(engContent)
        .set({ title, description, vision, mission })
        .where(eq(engContent.id, id));
    } else {
      await db.insert(engContent).values({ title, description, vision, mission });
    }

    return { success: true };
  });

/* ================= SAVE/UPDATE ELECTRICAL INFO ================= */
export const updateElectricalInfo = createServerFn({ method: "POST" })
  .inputValidator((data: any) => data)
  .handler(async ({ data, context }) => {
    assertAdmin(context);

    const payload = getPayload(data);
    const { id, title, name, description, engineer, img } = payload;

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

/* ================= CREATE META POINT (CONSTRUCTION) ================= */
export const createMetaPoint = createServerFn({ method: "POST" })
  .inputValidator((data: any) => data)
  .handler(async ({ data, context }) => {
    assertAdmin(context);

    const payload = getPayload(data);
    const { category, content } = payload;

    await db.insert(engMeta).values({
      category,
      content,
    });

    return { success: true };
  });

/* ================= DELETE META POINT ================= */
export const deleteMetaPoint = createServerFn({ method: "POST" })
  .inputValidator((data: any) => data)
  .handler(async ({ data, context }) => {
    assertAdmin(context);

    const payload = getPayload(data);
    const { id } = payload;

    await db.delete(engMeta).where(eq(engMeta.id, id));

    return { success: true };
  });

/* ================= CREATE STAFF MEMBER ================= */
export const createStaffMember = createServerFn({ method: "POST" })
  .inputValidator((data: any) => data)
  .handler(async ({ data, context }) => {
    assertAdmin(context);

    const payload = getPayload(data);
    const { name, designation, type, img } = payload;

    await db.insert(engStaff).values({
      name,
      designation,
      type,
      img,
    });

    return { success: true };
  });

/* ================= DELETE STAFF MEMBER ================= */
export const deleteStaffMember = createServerFn({ method: "POST" })
  .inputValidator((data: any) => data)
  .handler(async ({ data, context }) => {
    assertAdmin(context);

    const payload = getPayload(data);
    const { id } = payload;

    await db.delete(engStaff).where(eq(engStaff.id, id));

    return { success: true };
  });
