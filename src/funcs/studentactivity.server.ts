import { createServerFn } from "@tanstack/react-start";
import { db } from "@/db";
import { serverCache } from "@/lib/server-cache";

import {
  studentClubs,
  studentClubContent,
  studentClubImages,
} from "@/db/schema";

export const getStudentActivityData =
  createServerFn({
    method: "GET",
  }).handler(async () => {
    try {
      const cached = serverCache.get<any>("student_activity_data");
      if (cached) return cached;

      const [
        clubs,
        content,
        images,
      ] = await Promise.all([
        db.select().from(studentClubs),

        db.select().from(studentClubContent),

        db.select().from(studentClubImages),
      ]);

      const data = {
        clubs: clubs.map((club) => ({
          ...club,

          sections: content.filter(
            (c) => c.clubId === club.id
          ),

          images: images.filter(
            (img) => img.clubId === club.id
          ),
        })),
      };

      serverCache.set("student_activity_data", data);
      return data;

    } catch (err) {
      console.error(
        "Student Club DB Error:",
        err
      );

      return {
        clubs: [],
      };
    }
  });