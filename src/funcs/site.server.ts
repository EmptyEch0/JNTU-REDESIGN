import { createServerFn } from "@tanstack/react-start";
import { db } from "../db";
import { siteContent } from "../db/schema";
import { eq, and } from "drizzle-orm";

export const getPageContent = createServerFn({
  method: "GET",
})
  .inputValidator((page: string) => page)
  .handler(async ({ data: page }) => {
    try {
      const records = await db
        .select()
        .from(siteContent)
        .where(eq(siteContent.page, page));
      return records;
    } catch {
      return [];
    }
  });

export const updatePageSection = createServerFn({
  method: "POST",
})
  .inputValidator(
    (d: {
      page: string;
      sectionKey: string;
      title?: string;
      content?: string;
      imageUrl?: string;
    }) => d
  )
  .handler(async ({ data }) => {
    try {
      const [existing] = await db
        .select()
        .from(siteContent)
        .where(
          and(
            eq(siteContent.page, data.page),
            eq(siteContent.sectionKey, data.sectionKey)
          )
        );

      if (existing) {
        await db
          .update(siteContent)
          .set({
            title: data.title !== undefined ? data.title : existing.title,
            content: data.content !== undefined ? data.content : existing.content,
            imageUrl: data.imageUrl !== undefined ? data.imageUrl : existing.imageUrl,
          })
          .where(eq(siteContent.id, existing.id));
      } else {
        await db.insert(siteContent).values({
          page: data.page,
          sectionKey: data.sectionKey,
          title: data.title || "",
          content: data.content || "",
          imageUrl: data.imageUrl || "",
        });
      }
      return { success: true };
    } catch (err) {
      console.error("Update site content failed:", err);
      throw new Error("Failed to save content");
    }
  });
