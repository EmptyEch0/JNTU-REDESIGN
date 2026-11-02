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
  departments,
  tpo,
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



export interface LeadershipProfileItem {
  id: number;
  slug: string;
  name: string;
  image: string;
  email: string;
  designation: string;
  quote: string;
  message: string;
  profile: string;
  extras: {
    isInCharge?: boolean;
    category?: "university" | "administration" | "tpo" | "hod" | "custom";
    department?: string;
    deptSlug?: string;
    phone?: string;
    facultyId?: number | null;
    order?: number;
    [key: string]: any;
  } | null;
}

export const getAllLeadershipProfiles = createServerFn({ method: "GET" }).handler(async () => {
  const cacheKey = "all_leadership_profiles";
  const cached = serverCache.get<LeadershipProfileItem[]>(cacheKey);
  if (cached) return cached;

  let records: any[] = [];
  try {
    records = await db.select().from(leadership);
  } catch (e) {
    console.error("Error querying leadership profiles:", e);
    records = [];
  }

  const categoryOrder: Record<string, number> = {
    vc: 1,
    registrar: 2,
    principal: 3,
    "vice-principal": 4,
    tpo: 5,
  };

  const sorted = [...records].sort((a, b) => {
    const orderA = (a.extras as any)?.order ?? categoryOrder[a.slug] ?? (a.slug.startsWith("hod_") ? 10 : 99);
    const orderB = (b.extras as any)?.order ?? categoryOrder[b.slug] ?? (b.slug.startsWith("hod_") ? 10 : 99);
    if (orderA !== orderB) return orderA - orderB;
    return a.id - b.id;
  });

  serverCache.set(cacheKey, sorted as LeadershipProfileItem[]);
  return sorted as LeadershipProfileItem[];
});

export const getAllFacultyRoster = createServerFn({ method: "GET" }).handler(async () => {
  const cacheKey = "leadership_faculty_roster";
  const cached = serverCache.get<any[]>(cacheKey);
  if (cached) return cached;

  try {
    const { sql } = await import("@/lib/db");
    const result = await sql`
      SELECT f.id, f.name, f.designation, f.photo_url, f.faculty_email,
             d.name as department_name, d.slug as department_slug
      FROM faculty f
      LEFT JOIN departments d ON f.dept_id = d.id
      ORDER BY f.name ASC
    `;
    const list = result || [];
    serverCache.set(cacheKey, list);
    return list;
  } catch (err) {
    console.error("Error querying faculty roster:", err);
    return [];
  }
});

export interface SaveLeadershipInput {
  id?: number;
  slug: string;
  name: string;
  image: string;
  email: string;
  designation: string;
  quote?: string;
  message?: string;
  profile?: string;
  isInCharge?: boolean;
  phone?: string;
  category?: string;
  department?: string;
  deptSlug?: string;
  facultyId?: number | null;
}

export const saveLeadershipProfile = createServerFn({ method: "POST" })
  .validator((d: SaveLeadershipInput) => d)
  .handler(async ({ data }) => {
    const {
      id,
      slug,
      name,
      image,
      email,
      designation,
      quote = "",
      message = "",
      profile = "",
      isInCharge = false,
      phone = "",
      category,
      department,
      deptSlug,
      facultyId,
    } = data;

    const existing = await db.select().from(leadership).where(eq(leadership.slug, slug)).limit(1);
    let existingExtras = (existing[0]?.extras as any) || {};

    if (Array.isArray(existing[0]?.extras)) {
      existingExtras = { sections: existing[0]?.extras };
    } else if (existingExtras && typeof existingExtras === "object") {
      existingExtras = { ...existingExtras };
      const numericKeys = Object.keys(existingExtras).filter((k) => /^\d+$/.test(k));
      if (numericKeys.length > 0 && !existingExtras.sections) {
        existingExtras.sections = numericKeys
          .sort((a, b) => Number(a) - Number(b))
          .map((k) => existingExtras[k]);
        numericKeys.forEach((k) => delete existingExtras[k]);
      }
    }

    const cleanName = name.trim();
    const cleanImage = image.trim();
    const cleanEmail = email.trim();
    const cleanDesignation = designation.trim();

    const mergedExtras = {
      ...existingExtras,
      isInCharge: Boolean(isInCharge),
      phone: phone || existingExtras.phone || "",
      category: category || existingExtras.category || (slug.startsWith("hod_") ? "hod" : "administration"),
      department: department || existingExtras.department || "",
      deptSlug: deptSlug || existingExtras.deptSlug || (slug.startsWith("hod_") ? slug.replace("hod_", "") : ""),
      facultyId: facultyId !== undefined ? facultyId : existingExtras.facultyId,
    };

    let savedProfile;

    if (existing.length > 0) {
      const updated = await db
        .update(leadership)
        .set({
          name: cleanName,
          image: cleanImage,
          email: cleanEmail,
          designation: cleanDesignation,
          quote: quote.trim(),
          message: message.trim(),
          profile: profile.trim(),
          extras: mergedExtras,
        })
        .where(eq(leadership.slug, slug))
        .returning();
      savedProfile = updated[0];
    } else {
      const inserted = await db
        .insert(leadership)
        .values({
          slug: slug.trim(),
          name: cleanName,
          image: cleanImage,
          email: cleanEmail,
          designation: cleanDesignation,
          quote: quote.trim(),
          message: message.trim(),
          profile: profile.trim(),
          extras: mergedExtras,
        })
        .returning();
      savedProfile = inserted[0];
    }

    // Downstream synchronization:
    // 1. If HOD role -> sync with departments table
    if (slug.startsWith("hod_") || mergedExtras.category === "hod") {
      const targetDeptSlug = mergedExtras.deptSlug || slug.replace("hod_", "");
      try {
        const hodDisplayName = isInCharge && !cleanName.includes("(i/c)") ? `${cleanName} (i/c)` : cleanName;
        await db
          .update(departments)
          .set({
            hod: hodDisplayName,
            hod_photo: cleanImage,
            hod_contact: cleanEmail,
            hod_message: message.trim(),
          })
          .where(eq(departments.slug, targetDeptSlug));
        
        serverCache.invalidate(`department_${targetDeptSlug}`);
        serverCache.invalidate("all_departments");
      } catch (err) {
        console.error(`Failed to sync HOD downstream for ${targetDeptSlug}:`, err);
      }
    }

    // 2. If TPO role -> sync with tpo table
    if (slug === "tpo" || mergedExtras.category === "tpo") {
      try {
        const tpoRows = await db.select().from(tpo).limit(1);
        const tpoDisplayName = isInCharge && !cleanName.includes("(i/c)") ? `${cleanName} (i/c)` : cleanName;
        if (tpoRows.length > 0) {
          await db
            .update(tpo)
            .set({
              name: tpoDisplayName,
              image: cleanImage,
              email: cleanEmail,
              designation: cleanDesignation,
              message: message.trim(),
            })
            .where(eq(tpo.id, tpoRows[0].id));
        } else {
          await db.insert(tpo).values({
            name: tpoDisplayName,
            image: cleanImage,
            email: cleanEmail,
            designation: cleanDesignation,
            message: message.trim(),
          });
        }
        serverCache.invalidate("tpo", true);
      } catch (err) {
        console.error("Failed to sync TPO downstream:", err);
      }
    }

    // Invalidate caches
    serverCache.invalidate("leadership", true);
    serverCache.invalidate("all_leadership_profiles");
    serverCache.invalidate(`leadership_${slug}`);

    return { success: true, profile: savedProfile };
  });

export const deleteLeadershipProfile = createServerFn({ method: "POST" })
  .validator((d: { slug: string }) => d)
  .handler(async ({ data }) => {
    const protectedSlugs = [
      "vc",
      "registrar",
      "principal",
      "vice-principal",
      "tpo",
      "hod_cse",
      "hod_it",
      "hod_ece",
      "hod_eee",
      "hod_mech",
      "hod_met",
      "hod_civil",
      "hod_bshss",
      "hod_mba",
    ];
    if (protectedSlugs.includes(data.slug)) {
      throw new Error(`Cannot delete core institutional role '${data.slug}'.`);
    }

    await db.delete(leadership).where(eq(leadership.slug, data.slug));
    serverCache.invalidate("leadership", true);
    serverCache.invalidate("all_leadership_profiles");
    return { success: true };
  });
