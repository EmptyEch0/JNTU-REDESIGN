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

  const records = await db.select().from(iqacComposition);
  serverCache.set("iqac_composition", records);
  return records;
});

export const getIqacReports = createServerFn({ method: "GET" })
  .validator((d: string) => d)
  .handler(async ({ data: type }) => {
    const cacheKey = `iqac_reports_${type}`;
    const cached = serverCache.get<any[]>(cacheKey);
    if (cached) return cached;

    const records = await db.select().from(iqacReports).where(eq(iqacReports.type, type));
    serverCache.set(cacheKey, records);
    return records;
  });

export const getIqacOutcomes = createServerFn({ method: "GET" }).handler(async () => {
  const cached = serverCache.get<any[]>("iqac_outcomes");
  if (cached) return cached;

  const records = await db.select().from(iqacOutcomes);
  serverCache.set("iqac_outcomes", records);
  return records;
});

export const getIqacEvents = createServerFn({ method: "GET" }).handler(async () => {
  const cached = serverCache.get<any[]>("iqac_events");
  if (cached) return cached;

  const records = await db.select().from(iqacEvents);
  serverCache.set("iqac_events", records);
  return records;
});

export const getIqacMous = createServerFn({ method: "GET" }).handler(async () => {
  const cached = serverCache.get<any[]>("iqac_mous");
  if (cached) return cached;

  const records = await db.select().from(iqacMous);
  serverCache.set("iqac_mous", records);
  return records;
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

