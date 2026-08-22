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
import { memoryCache } from "./cache";
import { serverCache } from "./server-cache";

export const getPlacementYears = createServerFn({ method: "GET" }).handler(async () => {
  return memoryCache.getOrSet("placements:years", 10 * 60 * 1000, async () => {
    return await db.select().from(placementYears).orderBy(desc(placementYears.year));
  });
});

export const getPlacementHighlights = createServerFn({ method: "GET" }).handler(async () => {
  return memoryCache.getOrSet("placements:highlights", 10 * 60 * 1000, async () => {
    return await db.select().from(placementHighlights);
  });
});

export const addPlacementYear = createServerFn({ method: "POST" })
  .validator((d: any) => d)
  .handler(async ({ data }) => {
    const res = await db.insert(placementYears).values(data).returning();
    memoryCache.invalidatePrefix("placements:");
    return res;
  });

export const addPlacementHighlight = createServerFn({ method: "POST" })
  .validator((d: any) => d)
  .handler(async ({ data }) => {
    return await db.insert(placementHighlights).values(data).returning();
  });

export const updatePlacementYear = createServerFn({ method: "POST" })
  .validator((d: any) => d)
  .handler(async ({ data }) => {
    const { id, ...updateData } = data;
    return await db
      .update(placementYears)
      .set(updateData)
      .where(eq(placementYears.id, id))
      .returning();
  });

export const deletePlacementYear = createServerFn({ method: "POST" })
  .validator((d: { id: number }) => d)
  .handler(async ({ data }) => {
    return await db.delete(placementYears).where(eq(placementYears.id, data.id)).returning();
  });

export const updatePlacementHighlight = createServerFn({ method: "POST" })
  .validator((d: any) => d)
  .handler(async ({ data }) => {
    const { id, ...updateData } = data;
    return await db
      .update(placementHighlights)
      .set(updateData)
      .where(eq(placementHighlights.id, id))
      .returning();
  });

export const deletePlacementHighlight = createServerFn({ method: "POST" })
  .validator((d: { id: number }) => d)
  .handler(async ({ data }) => {
    return await db
      .delete(placementHighlights)
      .where(eq(placementHighlights.id, data.id))
      .returning();
  });

// TPO Functions
export const getTPO = createServerFn({ method: "GET" }).handler(async () => {
  const results = await db.select().from(tpo).limit(1);
  return results[0] || null;
});

export const updateTPO = createServerFn({ method: "POST" })
  .validator((d: any) => d)
  .handler(async ({ data }) => {
    const { id, ...updateData } = data;
    return await db.update(tpo).set(updateData).where(eq(tpo.id, id)).returning();
  });

// Goals Functions
export const getGoals = createServerFn({ method: "GET" }).handler(async () => {
  return await db.select().from(placementGoals).orderBy(placementGoals.id);
});

export const addGoal = createServerFn({ method: "POST" })
  .validator((d: { text: string }) => d)
  .handler(async ({ data }) => {
    return await db.insert(placementGoals).values(data).returning();
  });

export const updateGoal = createServerFn({ method: "POST" })
  .validator((d: any) => d)
  .handler(async ({ data }) => {
    const { id, ...updateData } = data;
    return await db
      .update(placementGoals)
      .set(updateData)
      .where(eq(placementGoals.id, id))
      .returning();
  });

export const deleteGoal = createServerFn({ method: "POST" })
  .validator((d: { id: number }) => d)
  .handler(async ({ data }) => {
    return await db.delete(placementGoals).where(eq(placementGoals.id, data.id)).returning();
  });

// Recruiters Functions
export const getMajorRecruiters = createServerFn({ method: "GET" }).handler(async () => {
  return await db.select().from(majorRecruiters).orderBy(majorRecruiters.name);
});

export const addRecruiter = createServerFn({ method: "POST" })
  .validator((d: { name: string }) => d)
  .handler(async ({ data }) => {
    return await db.insert(majorRecruiters).values(data).returning();
  });

export const deleteRecruiter = createServerFn({ method: "POST" })
  .validator((d: { id: number }) => d)
  .handler(async ({ data }) => {
    return await db.delete(majorRecruiters).where(eq(majorRecruiters.id, data.id)).returning();
  });

// Staff Functions
export const getStaff = createServerFn({ method: "GET" }).handler(async () => {
  return await db.select().from(placementStaff).orderBy(placementStaff.id);
});

export const addStaff = createServerFn({ method: "POST" })
  .validator((d: { name: string; role: string }) => d)
  .handler(async ({ data }) => {
    return await db.insert(placementStaff).values(data).returning();
  });

export const updateStaff = createServerFn({ method: "POST" })
  .validator((d: any) => d)
  .handler(async ({ data }) => {
    const { id, ...updateData } = data;
    return await db
      .update(placementStaff)
      .set(updateData)
      .where(eq(placementStaff.id, id))
      .returning();
  });

export const deleteStaff = createServerFn({ method: "POST" })
  .validator((d: { id: number }) => d)
  .handler(async ({ data }) => {
    return await db.delete(placementStaff).where(eq(placementStaff.id, data.id)).returning();
  });

const DEFAULT_PLACEMENT_GALLERY = [
  { id: -1, src: "uploads/photo-gallery/IMG_6920.JPG", caption: "Campus Placement Interactive Session & Pre-Placement Talk" },
  { id: -2, src: "uploads/photo-gallery/IMG_6926.JPG", caption: "Auditorium Briefing for MNC Recruitment Drives" },
  { id: -3, src: "uploads/photo-gallery/IMG_6927.JPG", caption: "Recruitment Drive & Technical Interview Panel" },
  { id: -4, src: "uploads/photo-gallery/IMG_6943.JPG", caption: "Aptitude and Soft Skills Finishing School Training" },
  { id: -5, src: "uploads/photo-gallery/IMG_6946.JPG", caption: "Offer Letter Felicitation & Student Success Celebrations" },
  { id: -6, src: "uploads/photo-gallery/IMG_6950.JPG", caption: "Corporate HR Delegation Campus Visit & Interaction" },
  { id: -7, src: "uploads/photo-gallery/IMG_6868.JPG", caption: "Industry Expert Career Guidance Keynote Session" },
  { id: -8, src: "uploads/photo-gallery/IMG_6872.JPG", caption: "Industry-Academia Collaborative Training Symposium" },
  { id: -9, src: "uploads/photo-gallery/IMG_6875.JPG", caption: "Annual Training & Placement Orientation Program" },
];

// Gallery Functions
export const getGallery = createServerFn({ method: "GET" }).handler(async () => {
  const cached = serverCache.get<any[]>("placement_gallery");
  if (cached && cached.length > 0) return cached;

  try {
    const items = await db.select().from(placementGallery).orderBy(placementGallery.id);
    const result = items.length > 0 ? items : DEFAULT_PLACEMENT_GALLERY;
    serverCache.set("placement_gallery", result, 15 * 60 * 1000);
    return result;
  } catch {
    return DEFAULT_PLACEMENT_GALLERY;
  }
});

export const addGalleryItem = createServerFn({ method: "POST" })
  .validator((d: { src: string; caption: string }) => d)
  .handler(async ({ data }) => {
    const res = await db.insert(placementGallery).values(data).returning();
    serverCache.invalidate("placement_gallery");
    return res;
  });

export const updateGalleryItem = createServerFn({ method: "POST" })
  .validator((d: any) => d)
  .handler(async ({ data }) => {
    const { id, ...updateData } = data;
    const res = await db
      .update(placementGallery)
      .set(updateData)
      .where(eq(placementGallery.id, id))
      .returning();
    serverCache.invalidate("placement_gallery");
    return res;
  });

export const deleteGalleryItem = createServerFn({ method: "POST" })
  .validator((d: { id: number }) => d)
  .handler(async ({ data }) => {
    const res = await db.delete(placementGallery).where(eq(placementGallery.id, data.id)).returning();
    serverCache.invalidate("placement_gallery");
    return res;
  });
