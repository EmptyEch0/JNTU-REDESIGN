import { createServerFn } from "@tanstack/react-start";
import { db } from "@/db";
import {
  rdDepartments,
  rdResearchAreas,
  rdFocusAreas,
  rdFunders,
  rdConsultancy,
  rdCommittee,
  rdProjects,
  rdScholars,
  rdCoordinatorMessage,
  rdMotto,
  rdPublications,
  rdPublicationStats,
  rdMous,
} from "@/db/schema";
import { eq, and, asc } from "drizzle-orm";
import { serverCache } from "../lib/server-cache";

async function rdMutate<T>(action: () => Promise<T>): Promise<T> {
  const result = await action();
  serverCache.invalidate("rd_", true);
  return result;
}

// Fetch all departments with their research areas
export const getDepartmentsWithAreas = createServerFn({ method: "GET" }).handler(async () => {
  const cached = serverCache.get<any[]>("rd_departments_with_areas");
  if (cached) return cached;

  const depts = await db.query.rdDepartments.findMany({
    with: {
      researchAreas: true,
    },
  });
  serverCache.set("rd_departments_with_areas", depts);
  return depts;
});

// Add Department
export const addDepartment = createServerFn({ method: "POST" })
  .validator((d: { name: string }) => d)
  .handler(async ({ data }) => {
    return rdMutate(() => db.insert(rdDepartments).values(data).returning());
  });

// Update Department
export const updateDepartment = createServerFn({ method: "POST" })
  .validator((d: { id: number; name: string }) => d)
  .handler(async ({ data }) => {
    const { id, ...update } = data;
    return rdMutate(() => db.update(rdDepartments).set(update).where(eq(rdDepartments.id, id)).returning());
  });

// Delete Department
export const deleteDepartment = createServerFn({ method: "POST" })
  .validator((d: { id: number }) => d)
  .handler(async ({ data }) => {
    return rdMutate(() => db.delete(rdDepartments).where(eq(rdDepartments.id, data.id)).returning());
  });

// Add Research Area
export const addArea = createServerFn({ method: "POST" })
  .validator((d: { deptId: number; area: string }) => d)
  .handler(async ({ data }) => {
    return rdMutate(() => db.insert(rdResearchAreas).values(data).returning());
  });

// Update Research Area
export const updateArea = createServerFn({ method: "POST" })
  .validator((d: { id: number; area: string }) => d)
  .handler(async ({ data }) => {
    const { id, ...update } = data;
    return rdMutate(() => db.update(rdResearchAreas).set(update).where(eq(rdResearchAreas.id, id)).returning());
  });

// Delete Research Area
export const deleteArea = createServerFn({ method: "POST" })
  .validator((d: { id: number }) => d)
  .handler(async ({ data }) => {
    return rdMutate(() => db.delete(rdResearchAreas).where(eq(rdResearchAreas.id, data.id)).returning());
  });

// Focus Areas
export const getFocusAreas = createServerFn({ method: "GET" }).handler(async () => {
  const cached = serverCache.get<any[]>("rd_focus_areas");
  if (cached) return cached;

  const records = await db.select().from(rdFocusAreas).orderBy(rdFocusAreas.id);
  serverCache.set("rd_focus_areas", records);
  return records;
});

export const addFocusArea = createServerFn({ method: "POST" })
  .validator((d: { title: string; description: string; icon: string }) => d)
  .handler(async ({ data }) => {
    return rdMutate(() => db.insert(rdFocusAreas).values(data).returning());
  });

export const updateFocusArea = createServerFn({ method: "POST" })
  .validator((d: { id: number; title?: string; description?: string; icon?: string }) => d)
  .handler(async ({ data }) => {
    const { id, ...update } = data;
    return rdMutate(() => db.update(rdFocusAreas).set(update).where(eq(rdFocusAreas.id, id)).returning());
  });

export const deleteFocusArea = createServerFn({ method: "POST" })
  .validator((d: { id: number }) => d)
  .handler(async ({ data }) => {
    return rdMutate(() => db.delete(rdFocusAreas).where(eq(rdFocusAreas.id, data.id)).returning());
  });

// Funders
export const getFunders = createServerFn({ method: "GET" }).handler(async () => {
  const cached = serverCache.get<any[]>("rd_funders");
  if (cached) return cached;

  const records = await db.select().from(rdFunders).orderBy(rdFunders.id);
  serverCache.set("rd_funders", records);
  return records;
});

export const addFunder = createServerFn({ method: "POST" })
  .validator((d: { name: string }) => d)
  .handler(async ({ data }) => {
    return rdMutate(() => db.insert(rdFunders).values(data).returning());
  });

export const deleteFunder = createServerFn({ method: "POST" })
  .validator((d: { id: number }) => d)
  .handler(async ({ data }) => {
    return rdMutate(() => db.delete(rdFunders).where(eq(rdFunders.id, data.id)).returning());
  });

// Consultancy
export const getConsultancy = createServerFn({ method: "GET" }).handler(async () => {
  const cached = serverCache.get<any[]>("rd_consultancy");
  if (cached) return cached;

  const records = await db.select().from(rdConsultancy).orderBy(rdConsultancy.id);
  serverCache.set("rd_consultancy", records);
  return records;
});

export const addConsultancy = createServerFn({ method: "POST" })
  .validator((d: { name: string; description: string }) => d)
  .handler(async ({ data }) => {
    return rdMutate(() => db.insert(rdConsultancy).values(data).returning());
  });

export const updateConsultancy = createServerFn({ method: "POST" })
  .validator((d: { id: number; name?: string; description?: string }) => d)
  .handler(async ({ data }) => {
    const { id, ...update } = data;
    return rdMutate(() => db.update(rdConsultancy).set(update).where(eq(rdConsultancy.id, id)).returning());
  });

export const deleteConsultancy = createServerFn({ method: "POST" })
  .validator((d: { id: number }) => d)
  .handler(async ({ data }) => {
    return rdMutate(() => db.delete(rdConsultancy).where(eq(rdConsultancy.id, data.id)).returning());
  });

// Committee
export const getCommittee = createServerFn({ method: "GET" }).handler(async () => {
  const cached = serverCache.get<any[]>("rd_committee");
  if (cached) return cached;

  const records = await db.select().from(rdCommittee).orderBy(rdCommittee.id);
  serverCache.set("rd_committee", records);
  return records;
});

export const addMember = createServerFn({ method: "POST" })
  .validator((d: { name: string; role: string; detail: string }) => d)
  .handler(async ({ data }) => {
    return rdMutate(() => db.insert(rdCommittee).values(data).returning());
  });

export const updateMember = createServerFn({ method: "POST" })
  .validator((d: { id: number; name?: string; role?: string; detail?: string }) => d)
  .handler(async ({ data }) => {
    const { id, ...update } = data;
    return rdMutate(() => db.update(rdCommittee).set(update).where(eq(rdCommittee.id, id)).returning());
  });

export const deleteMember = createServerFn({ method: "POST" })
  .validator((d: { id: number }) => d)
  .handler(async ({ data }) => {
    return rdMutate(() => db.delete(rdCommittee).where(eq(rdCommittee.id, data.id)).returning());
  });

// Projects
export const getProjects = createServerFn({ method: "GET" }).handler(async () => {
  const cached = serverCache.get<any[]>("rd_projects");
  if (cached) return cached;

  const records = await db.query.rdDepartments.findMany({
    with: {
      projects: true,
    },
  });
  serverCache.set("rd_projects", records);
  return records;
});

export const addProject = createServerFn({ method: "POST" })
  .validator((d: any) => d)
  .handler(async ({ data }) => {
    return rdMutate(() => db.insert(rdProjects).values(data).returning());
  });

export const updateProject = createServerFn({ method: "POST" })
  .validator((d: { id: number; [key: string]: any }) => d)
  .handler(async ({ data }) => {
    const { id, ...update } = data;
    return rdMutate(() => db.update(rdProjects).set(update).where(eq(rdProjects.id, id)).returning());
  });

export const deleteProject = createServerFn({ method: "POST" })
  .validator((d: { id: number }) => d)
  .handler(async ({ data }) => {
    return rdMutate(() => db.delete(rdProjects).where(eq(rdProjects.id, data.id)).returning());
  });

// Scholars
export const getScholarsGroupedByDept = createServerFn({ method: "GET" }).handler(async () => {
  const cached = serverCache.get<any[]>("rd_scholars");
  if (cached) return cached;

  const records = await db.query.rdDepartments.findMany({
    with: {
      scholars: true,
    },
  });
  serverCache.set("rd_scholars", records);
  return records;
});

export const addScholar = createServerFn({ method: "POST" })
  .validator((d: any) => d)
  .handler(async ({ data }) => {
    return rdMutate(() => db.insert(rdScholars).values(data).returning());
  });

export const updateScholar = createServerFn({ method: "POST" })
  .validator((d: { id: number; [key: string]: any }) => d)
  .handler(async ({ data }) => {
    const { id, ...update } = data;
    return rdMutate(() => db.update(rdScholars).set(update).where(eq(rdScholars.id, id)).returning());
  });

export const deleteScholar = createServerFn({ method: "POST" })
  .validator((d: { id: number }) => d)
  .handler(async ({ data }) => {
    return rdMutate(() => db.delete(rdScholars).where(eq(rdScholars.id, data.id)).returning());
  });

// Coordinator Message
export const getCoordinatorMessage = createServerFn({ method: "GET" }).handler(async () => {
  const cached = serverCache.get<any>("rd_coordinator_message");
  if (cached) return cached;

  const result = await db.select().from(rdCoordinatorMessage).limit(1);
  const data = result[0];
  serverCache.set("rd_coordinator_message", data);
  return data;
});

export const updateCoordinatorMessage = createServerFn({ method: "POST" })
  .validator((d: any) => d)
  .handler(async ({ data }) => {
    const { id, ...update } = data;
    return rdMutate(async () => {
      await db
        .update(rdCoordinatorMessage)
        .set(update)
        .where(eq(rdCoordinatorMessage.id, id));
      return { success: true };
    });
  });

// Motto
export const getMottos = createServerFn({ method: "GET" }).handler(async () => {
  const cached = serverCache.get<any[]>("rd_mottos");
  if (cached) return cached;

  const records = await db.select().from(rdMotto).orderBy(asc(rdMotto.order));
  serverCache.set("rd_mottos", records);
  return records;
});

export const updateMotto = createServerFn({ method: "POST" })
  .validator((d: { id: number; text: string }) => d)
  .handler(async ({ data }) => {
    return rdMutate(() => db
      .update(rdMotto)
      .set({ text: data.text })
      .where(eq(rdMotto.id, data.id))
      .returning());
  });

// Publications
export const getPublications = createServerFn({ method: "GET" }).handler(async () => {
  const cached = serverCache.get<any[]>("rd_publications");
  if (cached) return cached;

  const records = await db.select().from(rdPublications);
  serverCache.set("rd_publications", records);
  return records;
});

export const addPublication = createServerFn({ method: "POST" })
  .validator((d: any) => d)
  .handler(async ({ data }) => {
    return rdMutate(() => db.insert(rdPublications).values(data).returning());
  });

export const updatePublication = createServerFn({ method: "POST" })
  .validator((d: { id: number; [key: string]: any }) => d)
  .handler(async ({ data }) => {
    const { id, ...update } = data;
    return rdMutate(() => db.update(rdPublications).set(update).where(eq(rdPublications.id, id)).returning());
  });

export const deletePublication = createServerFn({ method: "POST" })
  .validator((d: { id: number }) => d)
  .handler(async ({ data }) => {
    return rdMutate(() => db.delete(rdPublications).where(eq(rdPublications.id, data.id)).returning());
  });

// Publication Stats
export const getPublicationStats = createServerFn({ method: "GET" }).handler(async () => {
  const cached = serverCache.get<any[]>("rd_publication_stats");
  if (cached) return cached;

  const records = await db.select().from(rdPublicationStats);
  serverCache.set("rd_publication_stats", records);
  return records;
});

export const updatePublicationStat = createServerFn({ method: "POST" })
  .validator((d: { id: number; value: number }) => d)
  .handler(async ({ data }) => {
    return rdMutate(() => db
      .update(rdPublicationStats)
      .set({ value: data.value })
      .where(eq(rdPublicationStats.id, data.id))
      .returning());
  });

// MOUs
export const getMous = createServerFn({ method: "GET" }).handler(async () => {
  const cached = serverCache.get<any[]>("rd_mous");
  if (cached) return cached;

  const records = await db.select().from(rdMous);
  serverCache.set("rd_mous", records);
  return records;
});

export const addMou = createServerFn({ method: "POST" })
  .validator((d: any) => d)
  .handler(async ({ data }) => {
    return rdMutate(() => db.insert(rdMous).values(data).returning());
  });

export const updateMou = createServerFn({ method: "POST" })
  .validator((d: { id: number; [key: string]: any }) => d)
  .handler(async ({ data }) => {
    const { id, ...update } = data;
    return rdMutate(() => db.update(rdMous).set(update).where(eq(rdMous.id, id)).returning());
  });

export const deleteMou = createServerFn({ method: "POST" })
  .validator((d: { id: number }) => d)
  .handler(async ({ data }) => {
    return rdMutate(() => db.delete(rdMous).where(eq(rdMous.id, data.id)).returning());
  });
