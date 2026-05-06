import { createServerFn } from "@tanstack/react-start";
import { db } from "../db";
import {
  libraryContent,
  librarySections,
  libraryStats,
  libraryMeta,
  libraryTeam,
  libraryImages,
} from "../db/schema";

export const getLibraryData = createServerFn({ method: "GET" })
  .handler(async () => {
    try {
      const [
        content,
        sections,
        stats,
        meta,
        team,
        images,
      ] = await Promise.all([
        db.select().from(libraryContent),
        db.select().from(librarySections),
        db.select().from(libraryStats),
        db.select().from(libraryMeta),
        db.select().from(libraryTeam),
        db.select().from(libraryImages),
      ]);

      const c = content[0];

      return {
        /* ================= INFO ================= */
        info: {
          officerName: c?.officerName,
          designation: c?.designation,
          message: c?.message,
          img: c?.img,
        },

        /* ================= ABOUT ================= */
        about: c?.about || null,

        /* ================= HOURS ================= */
        hours: {
          workingDays: c?.workingDays,
          workingTime: c?.workingTime,
          transactionTime: c?.transactionTime,
        },

        /* ================= SECTIONS ================= */
        sections,

        /* ================= STATS ================= */
        titles: stats.filter(s => s.category === "titles"),
        periodicals: stats.filter(s => s.category === "periodicals"),

        /* ================= DIGITAL ================= */
        digital: c?.digitalDescription || null,

        /* ================= META ================= */
        digitalItems: meta.filter(m => m.category === "digital"),
        magazines: meta.filter(m => m.category === "magazine"),
        newspapers: meta.filter(m => m.category === "newspaper"),

        /* ================= TEAM ================= */
        team,

        /* ================= IMAGES ================= */
        images,
      };

    } catch (err) {
      console.error("LIBRARY ERROR:", err);

      return {
        info: null,
        about: null,
        hours: null,
        sections: [],
        titles: [],
        periodicals: [],
        digital: null,
        digitalItems: [],
        magazines: [],
        newspapers: [],
        team: [],
        images: [],
      };
    }
  });