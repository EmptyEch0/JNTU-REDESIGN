import { createServerFn } from "@tanstack/react-start";
import { db } from "@/db";
import { serverCache } from "@/lib/server-cache";

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
    const cached = serverCache.get<any>("music_club_data");
    if (cached) return cached;

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

    const data = {
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

    serverCache.set("music_club_data", data);
    return data;

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