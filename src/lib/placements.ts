import { createServerFn } from "@tanstack/react-start";
import { db } from "../db";
import {
  placementYears,
  placementHighlights,
  tpo,
  placementGoals,
  majorRecruiters,
  placementStaff,
  recruiters,
  placementGallery,
} from "../db/schema";
import { desc, eq } from "drizzle-orm";

export const getPlacementYears = createServerFn({ method: "GET" }).handler(async () => {
  return await db.select().from(placementYears).orderBy(desc(placementYears.year));
});

export const getPlacementHighlights = createServerFn({ method: "GET" }).handler(async () => {
  return await db.select().from(placementHighlights);
});

export const addPlacementYear = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: any }) => {
    return await db.insert(placementYears).values(data).returning();
  },
);

export const addPlacementHighlight = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: any }) => {
    return await db.insert(placementHighlights).values(data).returning();
  },
);

export const updatePlacementYear = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: any }) => {
    const { id, ...updateData } = data;
    return await db
      .update(placementYears)
      .set(updateData)
      .where(eq(placementYears.id, id))
      .returning();
  },
);

export const deletePlacementYear = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { id: number } }) => {
    return await db.delete(placementYears).where(eq(placementYears.id, data.id)).returning();
  },
);

export const updatePlacementHighlight = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: any }) => {
    const { id, ...updateData } = data;
    return await db
      .update(placementHighlights)
      .set(updateData)
      .where(eq(placementHighlights.id, id))
      .returning();
  },
);

export const deletePlacementHighlight = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { id: number } }) => {
    return await db
      .delete(placementHighlights)
      .where(eq(placementHighlights.id, data.id))
      .returning();
  },
);

// TPO Functions
export const getTPO = createServerFn({ method: "GET" }).handler(async () => {
  const results = await db.select().from(tpo).limit(1);
  return results[0] || null;
});

export const updateTPO = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: any }) => {
    const { id, ...updateData } = data;
    return await db.update(tpo).set(updateData).where(eq(tpo.id, id)).returning();
  },
);

// Goals Functions
export const getGoals = createServerFn({ method: "GET" }).handler(async () => {
  return await db.select().from(placementGoals).orderBy(placementGoals.id);
});

export const addGoal = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { text: string } }) => {
    return await db.insert(placementGoals).values(data).returning();
  },
);

export const updateGoal = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: any }) => {
    const { id, ...updateData } = data;
    return await db
      .update(placementGoals)
      .set(updateData)
      .where(eq(placementGoals.id, id))
      .returning();
  },
);

export const deleteGoal = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { id: number } }) => {
    return await db.delete(placementGoals).where(eq(placementGoals.id, data.id)).returning();
  },
);

// Recruiters Functions
export const getRecruiters = createServerFn({ method: "GET" }).handler(async () => {
  return await db.select().from(majorRecruiters).orderBy(majorRecruiters.name);
});

export const addRecruiter = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { name: string } }) => {
    return await db.insert(majorRecruiters).values(data).returning();
  },
);

export const deleteRecruiter = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { id: number } }) => {
    return await db.delete(majorRecruiters).where(eq(majorRecruiters.id, data.id)).returning();
  },
);

// Staff Functions
export const getStaff = createServerFn({ method: "GET" }).handler(async () => {
  return await db.select().from(placementStaff).orderBy(placementStaff.id);
});

export const addStaff = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { name: string; role: string } }) => {
    return await db.insert(placementStaff).values(data).returning();
  },
);

export const updateStaff = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: any }) => {
    const { id, ...updateData } = data;
    return await db
      .update(placementStaff)
      .set(updateData)
      .where(eq(placementStaff.id, id))
      .returning();
  },
);

export const deleteStaff = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { id: number } }) => {
    return await db.delete(placementStaff).where(eq(placementStaff.id, data.id)).returning();
  },
);

// Gallery Functions
export const getGallery = createServerFn({ method: "GET" }).handler(async () => {
  return await db.select().from(placementGallery).orderBy(placementGallery.id);
});

export const addGalleryItem = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { src: string; caption: string } }) => {
    return await db.insert(placementGallery).values(data).returning();
  },
);

export const updateGalleryItem = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: any }) => {
    const { id, ...updateData } = data;
    return await db
      .update(placementGallery)
      .set(updateData)
      .where(eq(placementGallery.id, id))
      .returning();
  },
);

export const deleteGalleryItem = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { id: number } }) => {
    return await db.delete(placementGallery).where(eq(placementGallery.id, data.id)).returning();
  },
);
