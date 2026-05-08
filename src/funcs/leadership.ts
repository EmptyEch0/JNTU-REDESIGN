import { createServerFn } from "@tanstack/react-start";
import { db } from "../db/index";
import { leadership, leadershipStaff, iqacComposition, iqacReports, iqacEvents, iqacOutcomes, iqacMous } from "../db/schema";
import { eq } from "drizzle-orm";

export const getLeadershipData = createServerFn({ method: "GET" })
  .handler(async ({ data: slug }: { data: string }) => {
    const result = await db.select().from(leadership).where(eq(leadership.slug, slug)).limit(1);
    return result[0] || null;
  });

export const getLeadershipStaff = createServerFn({ method: "GET" })
  .handler(async ({ data: slug }: { data: string }) => {
    return await db.select().from(leadershipStaff).where(eq(leadershipStaff.leadershipSlug, slug));
  });

export const getIqacComposition = createServerFn({ method: "GET" })
  .handler(async () => {
    return await db.select().from(iqacComposition);
  });

export const getIqacReports = createServerFn({ method: "GET" })
  .handler(async ({ data: type }: { data: string }) => {
    return await db.select().from(iqacReports).where(eq(iqacReports.type, type));
  });

export const getIqacOutcomes = createServerFn({ method: "GET" })
  .handler(async () => {
    return await db.select().from(iqacOutcomes);
  });

export const getIqacEvents = createServerFn({ method: "GET" })
  .handler(async () => {
    return await db.select().from(iqacEvents);
  });

export const getIqacMous = createServerFn({ method: "GET" })
  .handler(async () => {
    return await db.select().from(iqacMous);
  });

export const updateLeadershipData = createServerFn({ method: "POST" })
  .handler(async ({ data }: { data: any }) => {
    const { id, ...updateData } = data;
    await db.update(leadership).set(updateData).where(eq(leadership.id, id));
    return { success: true };
  });
