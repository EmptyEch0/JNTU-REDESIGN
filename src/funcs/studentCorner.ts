import { createServerFn } from "@tanstack/react-start";
import { db } from "../db/index";
import { edcProfile, edcCommittee, edcActivities, iipcCell, profChapters } from "../db/schema";
import { eq } from "drizzle-orm";
import { serverCache } from "../lib/server-cache";

async function scMutate<T>(action: () => Promise<T>): Promise<T> {
  const result = await action();
  serverCache.invalidate("sc_", true);
  return result;
}

// EDC Profile
export const getEdcProfile = createServerFn({ method: "GET" }).handler(async () => {
  const cached = serverCache.get<any>("sc_edc_profile");
  if (cached) return cached;

  const result = await db.select().from(edcProfile).limit(1);
  const data = result[0] || null;
  serverCache.set("sc_edc_profile", data);
  return data;
});

export const updateEdcProfile = createServerFn({ method: "POST" })
  .validator((d: any) => d)
  .handler(async ({ data }) => {
    const { id, ...updateData } = data;
    return scMutate(async () => {
      await db.update(edcProfile).set(updateData).where(eq(edcProfile.id, id));
      return { success: true };
    });
  });

// EDC Committee
export const getEdcCommittee = createServerFn({ method: "GET" }).handler(async () => {
  const cached = serverCache.get<any[]>("sc_edc_committee");
  if (cached) return cached;

  const records = await db.select().from(edcCommittee).orderBy(edcCommittee.sNo);
  serverCache.set("sc_edc_committee", records);
  return records;
});

export const addEdcCommittee = createServerFn({ method: "POST" })
  .validator((d: any) => d)
  .handler(async ({ data }) => {
    return scMutate(async () => {
      await db.insert(edcCommittee).values(data);
      return { success: true };
    });
  });

export const updateEdcCommittee = createServerFn({ method: "POST" })
  .validator((d: any) => d)
  .handler(async ({ data }) => {
    const { id, ...updateData } = data;
    return scMutate(async () => {
      await db.update(edcCommittee).set(updateData).where(eq(edcCommittee.id, id));
      return { success: true };
    });
  });

export const deleteEdcCommittee = createServerFn({ method: "POST" })
  .validator((d: any) => d)
  .handler(async ({ data }) => {
    const id = typeof data === "number" ? data : data.id;
    return scMutate(async () => {
      await db.delete(edcCommittee).where(eq(edcCommittee.id, id));
      return { success: true };
    });
  });

// EDC Activities
export const getEdcActivities = createServerFn({ method: "GET" }).handler(async () => {
  const cached = serverCache.get<any[]>("sc_edc_activities");
  if (cached) return cached;

  const records = await db.select().from(edcActivities).orderBy(edcActivities.sNo);
  serverCache.set("sc_edc_activities", records);
  return records;
});

export const addEdcActivity = createServerFn({ method: "POST" })
  .validator((d: any) => d)
  .handler(async ({ data }) => {
    return scMutate(async () => {
      await db.insert(edcActivities).values(data);
      return { success: true };
    });
  });

export const updateEdcActivity = createServerFn({ method: "POST" })
  .validator((d: any) => d)
  .handler(async ({ data }) => {
    const { id, ...updateData } = data;
    return scMutate(async () => {
      await db.update(edcActivities).set(updateData).where(eq(edcActivities.id, id));
      return { success: true };
    });
  });

export const deleteEdcActivity = createServerFn({ method: "POST" })
  .validator((d: any) => d)
  .handler(async ({ data }) => {
    const id = typeof data === "number" ? data : data.id;
    return scMutate(async () => {
      await db.delete(edcActivities).where(eq(edcActivities.id, id));
      return { success: true };
    });
  });

// Professional Chapters
export const getProfChapters = createServerFn({ method: "GET" }).handler(async () => {
  const cached = serverCache.get<any[]>("sc_prof_chapters");
  if (cached) return cached;

  const records = await db.select().from(profChapters);
  serverCache.set("sc_prof_chapters", records);
  return records;
});

export const addProfChapter = createServerFn({ method: "POST" })
  .validator((d: any) => d)
  .handler(async ({ data }) => {
    return scMutate(async () => {
      await db.insert(profChapters).values(data);
      return { success: true };
    });
  });

export const updateProfChapter = createServerFn({ method: "POST" })
  .validator((d: any) => d)
  .handler(async ({ data }) => {
    const { id, ...updateData } = data;
    return scMutate(async () => {
      await db.update(profChapters).set(updateData).where(eq(profChapters.id, id));
      return { success: true };
    });
  });

export const deleteProfChapter = createServerFn({ method: "POST" })
  .validator((d: any) => d)
  .handler(async ({ data }) => {
    const id = typeof data === "number" ? data : data.id;
    return scMutate(async () => {
      await db.delete(profChapters).where(eq(profChapters.id, id));
      return { success: true };
    });
  });

// IIPC
export const getIipcData = createServerFn({ method: "GET" }).handler(async () => {
  const cached = serverCache.get<any>("sc_iipc_data");
  if (cached) return cached;

  const result = await db.select().from(iipcCell).limit(1);
  const data = result[0] || null;
  serverCache.set("sc_iipc_data", data);
  return data;
});

export const updateIipcData = createServerFn({ method: "POST" })
  .validator((d: any) => d)
  .handler(async ({ data }) => {
    const { id, ...updateData } = data;
    return scMutate(async () => {
      await db.update(iipcCell).set(updateData).where(eq(iipcCell.id, id));
      return { success: true };
    });
  });
