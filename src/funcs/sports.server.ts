import { createServerFn } from "@tanstack/react-start";
import { db } from "@/db";

import {
  sportsContent,
  sportsPeople,
  sportsInfra,
  sportsAchievements,
  sportsImages,
} from "@/db/schema";

export const getSportsData =
  createServerFn({
    method: "GET",
  }).handler(async () => {
    try {
      const [
        content,
        people,
        infra,
        achievements,
        images,
      ] = await Promise.all([
        db.select().from(sportsContent).orderBy(sportsContent.id),

        db.select().from(
          sportsPeople
        ),

        db.select().from(
          sportsInfra
        ),

        db.select().from(
          sportsAchievements
        ),

        db.select().from(
          sportsImages
        ),
      ]);

      const c = content[0];

      return {
        /* ================= INFO ================= */

        info: c || null,

        /* ================= PEOPLE ================= */

        faculty: people.filter(
          (p) =>
            p.roleType ===
            "faculty"
        ),

        nonTeaching:
          people.filter(
            (p) =>
              p.roleType ===
              "non_teaching"
          ),

        /* ================= INFRA ================= */

        fields: infra.filter(
          (i) =>
            i.category ===
            "field"
        ),

        gym: infra.filter(
          (i) =>
            i.category ===
            "gym"
        ),

        /* ================= ACHIEVEMENTS ================= */

        achievements:
          achievements.sort(
            (a: any, b: any) => {
              if (
                a.yearLabel >
                b.yearLabel
              )
                return -1;

              if (
                a.yearLabel <
                b.yearLabel
              )
                return 1;

              return (
                (a.sno || 0) -
                (b.sno || 0)
              );
            }
          ),

        /* ================= IMAGES ================= */

        images,
      };
    } catch (err) {
      console.error(
        "Sports DB Error:",
        err
      );

      return {
        info: null,

        faculty: [],

        nonTeaching: [],

        achievements: [],

        fields: [],

        gym: [],

        images: [],
      };
    }
  });