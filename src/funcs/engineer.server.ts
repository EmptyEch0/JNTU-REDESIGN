import { createServerFn } from "@tanstack/react-start";
import { db } from "@/db";
import { serverCache } from "@/lib/server-cache";
import {
  engContent,
  engMeta,
  engStaff,
} from "@/db/schema";

export const getEngineeringData = createServerFn({ method: "GET" })
  .handler(async () => {
    try {
      const cached = serverCache.get<any>("engineering_data");
      if (cached) return cached;

      const [content, meta, staff] = await Promise.all([
        db.select().from(engContent),
        db.select().from(engMeta),
        db.select().from(engStaff),
      ]);

      const data = {
        /* ================= CONTENT ================= */
        content: content[0] || null,

        /* ================= CONSTRUCTION ================= */
        construction: meta
          .filter((m) => m.category === "construction")
          .map((m) => m.content),

        constructionPoints: meta
          .filter((m) => m.category === "construction"),

        /* ================= ELECTRICAL ================= */
        electrical:
          meta.find((m) => m.category === "electrical") || null,

        /* ================= CIVIL STAFF ================= */
        civilStaff: staff.filter(
          (s) => s.type === "civil"
        ),

        /* ================= ELECTRICAL STAFF ================= */
        electricalStaff: staff.filter(
          (s) => s.type === "electrical"
        ),
      };

      serverCache.set("engineering_data", data);
      return data;

    } catch (err) {
      console.error("Engineering DB Error:", err);

      return {
        content: null,
        construction: [],
        constructionPoints: [],
        electrical: null,
        civilStaff: [],
        electricalStaff: [],
      };
    }
  });