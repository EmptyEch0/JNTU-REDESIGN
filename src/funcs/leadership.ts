import { createServerFn } from "@tanstack/react-start";
import { db } from "../db/index";
import {
  leadership,
  leadershipStaff,
  iqacComposition,
  iqacReports,
  iqacEvents,
  iqacOutcomes,
  iqacMous,
} from "../db/schema";
import { eq } from "drizzle-orm";
import { serverCache } from "../lib/server-cache";

export const getLeadershipData = createServerFn({ method: "GET" })
  .validator((d: string) => d)
  .handler(async ({ data: slug }) => {
    const cacheKey = `leadership_${slug}`;
    const cached = serverCache.get<any>(cacheKey);
    if (cached) return cached;

    const result = await db.select().from(leadership).where(eq(leadership.slug, slug)).limit(1);
    const data = result[0] || null;
    serverCache.set(cacheKey, data);
    return data;
  },
);

export const getLeadershipStaff = createServerFn({ method: "GET" })
  .validator((d: string) => d)
  .handler(async ({ data: slug }) => {
    const cacheKey = `leadership_staff_${slug}`;
    const cached = serverCache.get<any[]>(cacheKey);
    if (cached) return cached;

    const records = await db.select().from(leadershipStaff).where(eq(leadershipStaff.leadershipSlug, slug));
    serverCache.set(cacheKey, records);
    return records;
  });

export const getIqacComposition = createServerFn({ method: "GET" }).handler(async () => {
  const cached = serverCache.get<any[]>("iqac_composition");
  if (cached) return cached;

  const records = await db.select().from(iqacComposition).orderBy(iqacComposition.id);
  serverCache.set("iqac_composition", records);
  return records;
});

export const addIqacComposition = createServerFn({ method: "POST" })
  .validator((d: { name: string; designation: string; role: string }) => d)
  .handler(async ({ data }) => {
    const inserted = await db.insert(iqacComposition).values(data).returning();
    serverCache.invalidate("iqac_", true);
    return inserted[0];
  });

export const updateIqacComposition = createServerFn({ method: "POST" })
  .validator((d: { id: number; name?: string; designation?: string; role?: string }) => d)
  .handler(async ({ data }) => {
    const { id, ...updateData } = data;
    const updated = await db
      .update(iqacComposition)
      .set(updateData)
      .where(eq(iqacComposition.id, id))
      .returning();
    serverCache.invalidate("iqac_", true);
    return updated[0];
  });

export const deleteIqacComposition = createServerFn({ method: "POST" })
  .validator((d: { id: number }) => d)
  .handler(async ({ data }) => {
    await db.delete(iqacComposition).where(eq(iqacComposition.id, data.id));
    serverCache.invalidate("iqac_", true);
    return { success: true };
  });

export const getIqacReports = createServerFn({ method: "GET" })
  .validator((d: string) => d)
  .handler(async ({ data: type }) => {
    const cacheKey = `iqac_reports_${type}`;
    const cached = serverCache.get<any[]>(cacheKey);
    if (cached) return cached;

    const records = await db.select().from(iqacReports).where(eq(iqacReports.type, type)).orderBy(iqacReports.id);
    serverCache.set(cacheKey, records);
    return records;
  });

export const addIqacReport = createServerFn({ method: "POST" })
  .validator((d: { title: string; year: string; type: string; link: string }) => d)
  .handler(async ({ data }) => {
    const inserted = await db.insert(iqacReports).values(data).returning();
    serverCache.invalidate("iqac_", true);
    return inserted[0];
  });

export const updateIqacReport = createServerFn({ method: "POST" })
  .validator((d: { id: number; title?: string; year?: string; type?: string; link?: string }) => d)
  .handler(async ({ data }) => {
    const { id, ...updateData } = data;
    const updated = await db.update(iqacReports).set(updateData).where(eq(iqacReports.id, id)).returning();
    serverCache.invalidate("iqac_", true);
    return updated[0];
  });

export const deleteIqacReport = createServerFn({ method: "POST" })
  .validator((d: { id: number }) => d)
  .handler(async ({ data }) => {
    await db.delete(iqacReports).where(eq(iqacReports.id, data.id));
    serverCache.invalidate("iqac_", true);
    return { success: true };
  });

export const getIqacOutcomes = createServerFn({ method: "GET" }).handler(async () => {
  const cached = serverCache.get<any[]>("iqac_outcomes");
  if (cached) return cached;

  const records = await db.select().from(iqacOutcomes).orderBy(iqacOutcomes.id);
  serverCache.set("iqac_outcomes", records);
  return records;
});

export const addIqacOutcome = createServerFn({ method: "POST" })
  .validator((d: { text: string }) => d)
  .handler(async ({ data }) => {
    const inserted = await db.insert(iqacOutcomes).values(data).returning();
    serverCache.invalidate("iqac_", true);
    return inserted[0];
  });

export const updateIqacOutcome = createServerFn({ method: "POST" })
  .validator((d: { id: number; text: string }) => d)
  .handler(async ({ data }) => {
    const { id, ...updateData } = data;
    const updated = await db.update(iqacOutcomes).set(updateData).where(eq(iqacOutcomes.id, id)).returning();
    serverCache.invalidate("iqac_", true);
    return updated[0];
  });

export const deleteIqacOutcome = createServerFn({ method: "POST" })
  .validator((d: { id: number }) => d)
  .handler(async ({ data }) => {
    await db.delete(iqacOutcomes).where(eq(iqacOutcomes.id, data.id));
    serverCache.invalidate("iqac_", true);
    return { success: true };
  });

export const getIqacEvents = createServerFn({ method: "GET" }).handler(async () => {
  const cached = serverCache.get<any[]>("iqac_events");
  if (cached) return cached;

  const records = await db.select().from(iqacEvents).orderBy(iqacEvents.id);
  serverCache.set("iqac_events", records);
  return records;
});

export const addIqacEvent = createServerFn({ method: "POST" })
  .validator((d: { title: string; date: string }) => d)
  .handler(async ({ data }) => {
    const inserted = await db.insert(iqacEvents).values(data).returning();
    serverCache.invalidate("iqac_", true);
    return inserted[0];
  });

export const updateIqacEvent = createServerFn({ method: "POST" })
  .validator((d: { id: number; title?: string; date?: string }) => d)
  .handler(async ({ data }) => {
    const { id, ...updateData } = data;
    const updated = await db.update(iqacEvents).set(updateData).where(eq(iqacEvents.id, id)).returning();
    serverCache.invalidate("iqac_", true);
    return updated[0];
  });

export const deleteIqacEvent = createServerFn({ method: "POST" })
  .validator((d: { id: number }) => d)
  .handler(async ({ data }) => {
    await db.delete(iqacEvents).where(eq(iqacEvents.id, data.id));
    serverCache.invalidate("iqac_", true);
    return { success: true };
  });

export const getIqacMous = createServerFn({ method: "GET" }).handler(async () => {
  const cached = serverCache.get<any[]>("iqac_mous");
  if (cached) return cached;

  const records = await db.select().from(iqacMous).orderBy(iqacMous.id);
  serverCache.set("iqac_mous", records);
  return records;
});

export const addIqacMou = createServerFn({ method: "POST" })
  .validator((d: { title: string; description?: string; image?: string }) => d)
  .handler(async ({ data }) => {
    const inserted = await db.insert(iqacMous).values({
      title: data.title,
      description: data.description || "",
      image: data.image || "hero-carousal/hero-campus.jpg",
    }).returning();
    serverCache.invalidate("iqac_", true);
    return inserted[0];
  });

export const updateIqacMou = createServerFn({ method: "POST" })
  .validator((d: { id: number; title?: string; description?: string; image?: string }) => d)
  .handler(async ({ data }) => {
    const { id, ...updateData } = data;
    const updated = await db.update(iqacMous).set(updateData).where(eq(iqacMous.id, id)).returning();
    serverCache.invalidate("iqac_", true);
    return updated[0];
  });

export const deleteIqacMou = createServerFn({ method: "POST" })
  .validator((d: { id: number }) => d)
  .handler(async ({ data }) => {
    await db.delete(iqacMous).where(eq(iqacMous.id, data.id));
    serverCache.invalidate("iqac_", true);
    return { success: true };
  });

export const updateLeadershipData = createServerFn({ method: "POST" })
  .validator((d: any) => d)
  .handler(async ({ data }) => {
    const { id, ...updateData } = data;
    await db.update(leadership).set(updateData).where(eq(leadership.id, id));
    serverCache.invalidate("leadership_", true);
    return { success: true };
  });

export const addLeadershipStaff = createServerFn({ method: "POST" })
  .validator((d: { leadershipSlug: string; name: string; role: string; section: string }) => d)
  .handler(async ({ data }) => {
    const inserted = await db.insert(leadershipStaff).values(data).returning();
    serverCache.invalidate("leadership_staff_", true);
    return inserted[0];
  });

export const updateLeadershipStaff = createServerFn({ method: "POST" })
  .validator((d: { id: number; name?: string; role?: string; section?: string }) => d)
  .handler(async ({ data }) => {
    const { id, ...updateData } = data;
    const updated = await db
      .update(leadershipStaff)
      .set(updateData)
      .where(eq(leadershipStaff.id, id))
      .returning();
    serverCache.invalidate("leadership_staff_", true);
    return updated[0];
  });

export const deleteLeadershipStaff = createServerFn({ method: "POST" })
  .validator((d: { id: number }) => d)
  .handler(async ({ data }) => {
    await db.delete(leadershipStaff).where(eq(leadershipStaff.id, data.id));
    serverCache.invalidate("leadership_staff_", true);
    return { success: true };
  });

