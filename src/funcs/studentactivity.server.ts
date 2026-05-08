import { createServerFn } from "@tanstack/react-start";
import { db } from "@/db";

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
      const [
        clubs,
        content,
        images,
      ] = await Promise.all([
        db.select().from(studentClubs),

        db.select().from(studentClubContent),

        db.select().from(studentClubImages),
      ]);

      return {
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