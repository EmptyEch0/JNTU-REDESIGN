import { createServerFn } from "@tanstack/react-start";
import { db } from "../db";
import { recruiters } from "../db/schema";
import { eq } from "drizzle-orm";
import { serverCache } from "../lib/server-cache";

async function recruiterMutate<T>(action: () => Promise<T>): Promise<T> {
  const result = await action();
  serverCache.invalidate("placements_", true);
  return result;
}

export const getRecruiters = createServerFn({ method: "GET" }).handler(async () => {
  const cached = serverCache.get<any[]>("placements_recruiters");
  if (cached) return cached;

  const records = await db.select().from(recruiters).orderBy(recruiters.name);
  serverCache.set("placements_recruiters", records);
  return records;
});

export const addRecruiter = createServerFn({ method: "POST" })
  .validator((d: any) => d)
  .handler(async ({ data }) => {
    return recruiterMutate(() => db.insert(recruiters).values(data).returning());
  });

export const updateRecruiter = createServerFn({ method: "POST" })
  .validator((d: any) => d)
  .handler(async ({ data }) => {
    const { id, ...updateData } = data;
    return recruiterMutate(() => db.update(recruiters).set(updateData).where(eq(recruiters.id, id)).returning());
  });

export const deleteRecruiter = createServerFn({ method: "POST" })
  .validator((d: { id: number }) => d)
  .handler(async ({ data }) => {
    return recruiterMutate(() => db.delete(recruiters).where(eq(recruiters.id, data.id)).returning());
  });
