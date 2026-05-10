import { createServerFn } from "@tanstack/react-start";
import { db } from "@/db";

import {
  musicContent,
  musicPeople,
  musicEquipment,
  musicMembers,
  musicImages,
} from "@/db/schema";

export const getMusicClubData = createServerFn({
  method: "GET",
}).handler(async () => {
  try {
    const [
      content,
      people,
      equipment,
      members,
      images,
    ] = await Promise.all([
      db.select().from(musicContent),

      db.select().from(musicPeople),

      db.select().from(musicEquipment),

      db.select().from(musicMembers),

      db.select().from(musicImages),
    ]);

    return {
      /* ================= CONTENT ================= */
      content: content[0] || null,

      /* ================= FACULTY ================= */
      facultyCoordinator:
        people.find(
          (p) => p.roleType === "faculty"
        ) || null,

      /* ================= STUDENTS ================= */
      studentCoordinators:
        people.filter(
          (p) => p.roleType === "student"
        ),

      /* ================= EQUIPMENT ================= */
      equipment,

      /* ================= MEMBERS ================= */
      members,

      /* ================= IMAGES ================= */
      images,
    };

  } catch (err) {
    console.error(
      "Music Club DB Error:",
      err
    );

    return {
      content: null,

      facultyCoordinator: null,

      studentCoordinators: [],

      equipment: [],

      members: [],

      images: [],
    };
  }
});