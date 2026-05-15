import { createServerFn } from "@tanstack/react-start";

import { db } from "@/db";

import {
  libraryContent,
  libraryImages,
  libraryMeta,
  librarySections,
  libraryStats,
  libraryTeam,
} from "@/db/schema";

export const getLibraryData = createServerFn({
  method: "GET",
}).handler(async () => {
  try {
    const [content] = await db
      .select()
      .from(libraryContent)
      .orderBy(libraryContent.id);

    const images = await db
      .select()
      .from(libraryImages);

    const sections = await db
      .select()
      .from(librarySections);

    const stats = await db
      .select()
      .from(libraryStats);

    const meta = await db
      .select()
      .from(libraryMeta);

    const team = await db
      .select()
      .from(libraryTeam);

    return {
      content,
      images,
      sections,
      stats,
      meta,
      team,
    };
  } catch (error) {
    console.error(
      "LIBRARY SERVER ERROR:",
      error
    );

    return {
      content: {},
      images: [],
      sections: [],
      stats: [],
      meta: [],
      team: [],
    };
  }
});