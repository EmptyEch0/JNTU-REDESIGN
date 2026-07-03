import { createServerFn } from "@tanstack/react-start";
import { db } from "../db";
import {
  hostelContent,
  hostelStructure,
  hostelPeople,
  hostelImages,
} from "../db/schema";
import { eq } from "drizzle-orm";

// =======================================
// ✅ GET HOSTEL DATA (NEW STRUCTURE)
// =======================================
export const getHostelData = createServerFn({ method: "GET" })
  .handler(async () => {
    try {
      const [
        content,
        structure,
        people,
        images,
      ] = await Promise.all([
        db.select().from(hostelContent),
        db.select().from(hostelStructure),
        db.select().from(hostelPeople),
        db.select().from(hostelImages),
      ]);

      const c = content[0];

      return {
        officer: {
          name: c?.officerName,
          role: c?.officerRole,
          image: c?.officerImage,
        },

        about: {
          description: c?.description,
        },

        health: {
          name: c?.healthName,
          timing: c?.healthTiming,
        },

        // 🔥 SPLIT LOGIC
        blocks: structure.filter(s => s.category === "block"),
        facilities: structure.filter(s => s.category === "facility"),

        wardens: people.filter(p => p.roleType === "warden"),
        staff: people.filter(p => p.roleType === "staff"),

        images,
      };

    } catch (err) {
      console.error("HOSTEL DB ERROR:", err);

      return {
        officer: null,
        about: null,
        health: null,
        blocks: [],
        facilities: [],
        wardens: [],
        staff: [],
        images: [],
      };
    }
  });
export const updateImage = createServerFn({
  method: "POST",
})
  .inputValidator((data: any) => data)
  .handler(async ({ data }) => {
    return db
      .update(hostelImages)
      .set({
        url: data.url,
      })
      .where(eq(hostelImages.id, data.id))
      .returning();
  });

// =======================================
// 📝 CONTENT
// =======================================
export const updateContent = createServerFn({ method: "POST" })
  .inputValidator((data: any) => data)
  .handler(async ({ data }) => {
    const { id, ...rest } = data;

    return db
      .update(hostelContent)
      .set(rest)
      .where(eq(hostelContent.id, id))
      .returning();
  });


// =======================================
// 🏢 STRUCTURE (BLOCK + FACILITY)
// =======================================
export const addStructure = createServerFn({ method: "POST" })
  .inputValidator((data: any) => data)
  .handler(async ({ data }) => {
    return db.insert(hostelStructure).values(data).returning();
  });

export const updateStructure = createServerFn({ method: "POST" })
  .inputValidator((data: any) => data)
  .handler(async ({ data }) => {
    return db
      .update(hostelStructure)
      .set(data)
      .where(eq(hostelStructure.id, data.id))
      .returning();
  });

export const deleteStructure = createServerFn({ method: "POST" })
  .inputValidator((data: any) => data)
  .handler(async ({ data }) => {
    return db
      .delete(hostelStructure)
      .where(eq(hostelStructure.id, data.id));
  });


// =======================================
// 👥 PEOPLE (WARDEN + STAFF)
// =======================================
export const addPerson = createServerFn({ method: "POST" })
  .inputValidator((data: any) => data)
  .handler(async ({ data }) => {
    return db.insert(hostelPeople).values(data).returning();
  });

export const updatePerson = createServerFn({ method: "POST" })
  .inputValidator((data: any) => data)
  .handler(async ({ data }) => {
    return db
      .update(hostelPeople)
      .set(data)
      .where(eq(hostelPeople.id, data.id))
      .returning();
  });

export const deletePerson = createServerFn({ method: "POST" })
  .inputValidator((data: any) => data)
  .handler(async ({ data }) => {
    return db
      .delete(hostelPeople)
      .where(eq(hostelPeople.id, data.id));
  });


// =======================================
// 🖼️ IMAGES
// =======================================
export const addImage = createServerFn({ method: "POST" })
  .inputValidator((data: any) => data)
  .handler(async ({ data }) => {
    return db.insert(hostelImages).values(data).returning();
  });

export const deleteImage = createServerFn({ method: "POST" })
  .inputValidator((data: any) => data)
  .handler(async ({ data }) => {
    return db
      .delete(hostelImages)
      .where(eq(hostelImages.id, data.id))
      .returning();
  });