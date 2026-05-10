import { createServerFn } from "@tanstack/react-start";
import { db } from "../db";
import {
  dispensaryContent,
  dispensaryPeople,
  dispensaryMeta,
  dispensaryImages,
} from "../db/schema";

export const getDispensaryData = createServerFn({ method: "GET" })
  .handler(async () => {
    try {
      const [content, people, meta, images] = await Promise.all([
        db.select().from(dispensaryContent),
        db.select().from(dispensaryPeople),
        db.select().from(dispensaryMeta),
        db.select().from(dispensaryImages),
      ]);

      const c = content[0];

      return {
        info: {
          hodName: c?.hodName,
          message: c?.message,
          img: c?.img,
        },

        // 👥 SPLIT FROM ONE TABLE
        doctors: people.filter((p) => p.roleType === "doctor"),
        staff: people.filter((p) => p.roleType === "staff"),
        drivers: people.filter((p) => p.roleType === "driver"),

        // 📋 SPLIT FROM META
        facilities: meta.filter((m) => m.category === "facility"),
        medicines: meta.filter((m) => m.category === "medicine"),

        images,
      };
    } catch (err) {
      console.error("Dispensary DB error:", err);

      return {
        info: null,
        doctors: [],
        facilities: [],
        medicines: [],
        staff: [],
        drivers: [],
        images: [],
      };
    }
  });