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

// Fetch all departments with their research areas
export const getDepartmentsWithAreas = createServerFn({ method: "GET" }).handler(async () => {
  const depts = await db.query.rdDepartments.findMany({
    with: {
      researchAreas: true,
    },
  });
  return depts;
});

// Add Department
export const addDepartment = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { name: string } }) => {
    return await db.insert(rdDepartments).values(data).returning();
  },
);

// Update Department
export const updateDepartment = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { id: number; name: string } }) => {
    const { id, ...update } = data;
    return await db.update(rdDepartments).set(update).where(eq(rdDepartments.id, id)).returning();
  },
);

// Delete Department
export const deleteDepartment = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { id: number } }) => {
    return await db.delete(rdDepartments).where(eq(rdDepartments.id, data.id)).returning();
  },
);

// Add Research Area
export const addArea = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { deptId: number; area: string } }) => {
    return await db.insert(rdResearchAreas).values(data).returning();
  },
);

// Update Research Area
export const updateArea = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { id: number; area: string } }) => {
    const { id, ...update } = data;
    return await db
      .update(rdResearchAreas)
      .set(update)
      .where(eq(rdResearchAreas.id, id))
      .returning();
  },
);

// Delete Research Area
export const deleteArea = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { id: number } }) => {
    return await db.delete(rdResearchAreas).where(eq(rdResearchAreas.id, data.id)).returning();
  },
);

// Focus Areas
export const getFocusAreas = createServerFn({ method: "GET" }).handler(async () => {
  return await db.select().from(rdFocusAreas).orderBy(rdFocusAreas.id);
});

export const addFocusArea = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { title: string; description: string; icon: string } }) => {
    return await db.insert(rdFocusAreas).values(data).returning();
  },
);

export const updateFocusArea = createServerFn({ method: "POST" }).handler(
  async ({
    data,
  }: {
    data: { id: number; title?: string; description?: string; icon?: string };
  }) => {
    const { id, ...update } = data;
    return await db.update(rdFocusAreas).set(update).where(eq(rdFocusAreas.id, id)).returning();
  },
);

export const deleteFocusArea = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { id: number } }) => {
    return await db.delete(rdFocusAreas).where(eq(rdFocusAreas.id, data.id)).returning();
  },
);

// Funders
export const getFunders = createServerFn({ method: "GET" }).handler(async () => {
  return await db.select().from(rdFunders).orderBy(rdFunders.id);
});

export const addFunder = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { name: string } }) => {
    return await db.insert(rdFunders).values(data).returning();
  },
);

export const deleteFunder = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { id: number } }) => {
    return await db.delete(rdFunders).where(eq(rdFunders.id, data.id)).returning();
  },
);

// Consultancy
export const getConsultancy = createServerFn({ method: "GET" }).handler(async () => {
  return await db.select().from(rdConsultancy).orderBy(rdConsultancy.id);
});

export const addConsultancy = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { name: string; description: string } }) => {
    return await db.insert(rdConsultancy).values(data).returning();
  },
);

export const updateConsultancy = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { id: number; name?: string; description?: string } }) => {
    const { id, ...update } = data;
    return await db.update(rdConsultancy).set(update).where(eq(rdConsultancy.id, id)).returning();
  },
);

export const deleteConsultancy = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { id: number } }) => {
    return await db.delete(rdConsultancy).where(eq(rdConsultancy.id, data.id)).returning();
  },
);

// Committee
export const getCommittee = createServerFn({ method: "GET" }).handler(async () => {
  return await db.select().from(rdCommittee).orderBy(rdCommittee.id);
});

export const addMember = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { name: string; role: string; detail: string } }) => {
    return await db.insert(rdCommittee).values(data).returning();
  },
);

export const updateMember = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { id: number; name?: string; role?: string; detail?: string } }) => {
    const { id, ...update } = data;
    return await db.update(rdCommittee).set(update).where(eq(rdCommittee.id, id)).returning();
  },
);

export const deleteMember = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { id: number } }) => {
    return await db.delete(rdCommittee).where(eq(rdCommittee.id, data.id)).returning();
  },
);

// Projects
export const getProjects = createServerFn({ method: "GET" }).handler(async () => {
  return await db.query.rdDepartments.findMany({
    with: {
      projects: true,
    },
  });
});

export const addProject = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: any }) => {
    return await db.insert(rdProjects).values(data).returning();
  },
);

export const updateProject = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { id: number; [key: string]: any } }) => {
    const { id, ...update } = data;
    return await db.update(rdProjects).set(update).where(eq(rdProjects.id, id)).returning();
  },
);

export const deleteProject = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { id: number } }) => {
    return await db.delete(rdProjects).where(eq(rdProjects.id, data.id)).returning();
  },
);

// Scholars
export const getScholarsGroupedByDept = createServerFn({ method: "GET" }).handler(async () => {
  return await db.query.rdDepartments.findMany({
    with: {
      scholars: true,
    },
  });
});

export const addScholar = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: any }) => {
    return await db.insert(rdScholars).values(data).returning();
  },
);

export const updateScholar = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { id: number; [key: string]: any } }) => {
    const { id, ...update } = data;
    return await db.update(rdScholars).set(update).where(eq(rdScholars.id, id)).returning();
  },
);

export const deleteScholar = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { id: number } }) => {
    return await db.delete(rdScholars).where(eq(rdScholars.id, data.id)).returning();
  },
);

// Coordinator Message
export const getCoordinatorMessage = createServerFn({ method: "GET" }).handler(async () => {
  const result = await db.select().from(rdCoordinatorMessage).limit(1);
  return result[0];
});

export const updateCoordinatorMessage = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: any }) => {
    const { id, ...update } = data;
    return await db
      .update(rdCoordinatorMessage)
      .set(update)
      .where(eq(rdCoordinatorMessage.id, id))
      .returning();
  },
);

// Motto
export const getMottos = createServerFn({ method: "GET" }).handler(async () => {
  return await db.select().from(rdMotto).orderBy(asc(rdMotto.order));
});

export const updateMotto = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { id: number; text: string } }) => {
    return await db
      .update(rdMotto)
      .set({ text: data.text })
      .where(eq(rdMotto.id, data.id))
      .returning();
  },
);

// Publications
export const getPublications = createServerFn({ method: "GET" }).handler(async () => {
  return await db.select().from(rdPublications);
});

export const addPublication = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: any }) => {
    return await db.insert(rdPublications).values(data).returning();
  },
);

export const updatePublication = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { id: number; [key: string]: any } }) => {
    const { id, ...update } = data;
    return await db.update(rdPublications).set(update).where(eq(rdPublications.id, id)).returning();
  },
);

export const deletePublication = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { id: number } }) => {
    return await db.delete(rdPublications).where(eq(rdPublications.id, data.id)).returning();
  },
);

// Publication Stats
export const getPublicationStats = createServerFn({ method: "GET" }).handler(async () => {
  return await db.select().from(rdPublicationStats);
});

export const updatePublicationStat = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { id: number; value: number } }) => {
    return await db
      .update(rdPublicationStats)
      .set({ value: data.value })
      .where(eq(rdPublicationStats.id, data.id))
      .returning();
  },
);

// MOUs
export const getMous = createServerFn({ method: "GET" }).handler(async () => {
  return await db.select().from(rdMous);
});

export const addMou = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: any }) => {
    return await db.insert(rdMous).values(data).returning();
  },
);

export const updateMou = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { id: number; [key: string]: any } }) => {
    const { id, ...update } = data;
    return await db.update(rdMous).set(update).where(eq(rdMous.id, id)).returning();
  },
);

export const deleteMou = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { id: number } }) => {
    return await db.delete(rdMous).where(eq(rdMous.id, data.id)).returning();
  },
);
