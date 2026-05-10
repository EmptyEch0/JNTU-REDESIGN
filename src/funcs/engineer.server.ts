import { createServerFn } from "@tanstack/react-start";
import { db } from "@/db";
import {
  engContent,
  engMeta,
  engStaff,
} from "@/db/schema";

export const getEngineeringData = createServerFn({ method: "GET" })
  .handler(async () => {
    try {
      const [content, meta, staff] = await Promise.all([
        db.select().from(engContent),
        db.select().from(engMeta),
        db.select().from(engStaff),
      ]);

      return {
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