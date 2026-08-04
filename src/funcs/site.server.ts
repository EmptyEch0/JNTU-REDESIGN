import { createServerFn } from "@tanstack/react-start";
import { db } from "../db";
import { siteContent, notices, academicRegulations, campusGallery, leadership, academicSyllabus, academicDownloads, academicTimetables, academicsExamCell, academicFeeStructure, academicCalendars } from "../db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { ingestSingleChunk, deleteSingleChunk } from "../lib/ingest";
import { runChatbotEngine } from "../lib/chatbot-engine";

// ── Singleton embedder cache (avoids reloading the WASM model on every request) ──
let _embedder: any = null;
async function getCachedEmbedder() {
  if (!_embedder) {
    const { pipeline } = await import("@xenova/transformers");
    _embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }
  return _embedder;
}
async function embedQuery(text: string): Promise<number[]> {
  const pipe = await getCachedEmbedder();
  const result = await pipe(text, { pooling: "mean", normalize: true });
  return Array.from(result.data as number[]);
}


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

      let updated;
      if (existing) {
        const rows = await db
          .update(siteContent)
          .set({
            title: data.title !== undefined ? data.title : existing.title,
            content: data.content !== undefined ? data.content : existing.content,
            imageUrl: data.imageUrl !== undefined ? data.imageUrl : existing.imageUrl,
          })
          .where(eq(siteContent.id, existing.id))
          .returning();
        updated = rows[0];
      } else {
        const rows = await db.insert(siteContent).values({
          page: data.page,
          sectionKey: data.sectionKey,
          title: data.title || "",
          content: data.content || "",
          imageUrl: data.imageUrl || "",
        }).returning();
        updated = rows[0];
      }

      if (updated) {
        await ingestSingleChunk(
          `Page: ${updated.page}. ${updated.title}. ${updated.content}`,
          `sitecontent:${updated.id}`,
          "site_content"
        );
      }
      return { success: true };
    } catch (err) {
      console.error("Update site content failed:", err);
      throw new Error("Failed to save content");
    }
  });

export const getNotices = createServerFn({
  method: "GET",
}).handler(async () => {
  try {
    return await db.select().from(notices).orderBy(desc(notices.id));
  } catch {
    return [];
  }
});

export const addNotice = createServerFn({
  method: "POST",
})
  .inputValidator((data: { date: string; tag: string; title: string; url?: string | null }) => data)
  .handler(async ({ data }) => {
    try {
      const [inserted] = await db.insert(notices).values({
        date: data.date,
        tag: data.tag,
        title: data.title,
        url: data.url || null,
      }).returning();

      await ingestSingleChunk(
        `Notice: ${inserted.title}. Category: ${inserted.tag}. Date: ${inserted.date}`,
        `notice:${inserted.id}`,
        "notice"
      );
      return { success: true };
    } catch (err) {
      console.error("Add notice failed:", err);
      throw new Error("Failed to add notice");
    }
  });

export const deleteNotice = createServerFn({
  method: "POST",
})
  .inputValidator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    try {
      await db.delete(notices).where(eq(notices.id, data.id));
      await deleteSingleChunk(`notice:${data.id}`);
      return { success: true };
    } catch (err) {
      console.error("Delete notice failed:", err);
      throw new Error("Failed to delete notice");
    }
  });

export const getRegulations = createServerFn({
  method: "GET",
}).handler(async () => {
  try {
    return await db.select().from(academicRegulations).orderBy(desc(academicRegulations.id));
  } catch {
    return [];
  }
});

export const addRegulation = createServerFn({
  method: "POST",
})
  .inputValidator(
    (data: { title: string; category: string; size: string; date: string; link?: string }) => data
  )
  .handler(async ({ data }) => {
    try {
      const [inserted] = await db.insert(academicRegulations).values({
        title: data.title,
        category: data.category,
        size: data.size,
        date: data.date,
        link: data.link || "#",
      }).returning();

      await ingestSingleChunk(
        `Regulation: ${inserted.title}. Category: ${inserted.category}. Link: ${inserted.link}`,
        `regulation:${inserted.id}`,
        "regulation",
        { link: inserted.link }
      );
      return { success: true };
    } catch (err) {
      console.error("Add regulation failed:", err);
      throw new Error("Failed to add regulation");
    }
  });

export const deleteRegulation = createServerFn({
  method: "POST",
})
  .inputValidator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    try {
      await db.delete(academicRegulations).where(eq(academicRegulations.id, data.id));
      await deleteSingleChunk(`regulation:${data.id}`);
      return { success: true };
    } catch (err) {
      console.error("Delete regulation failed:", err);
      throw new Error("Failed to delete regulation");
    }
  });

export const getCampusGallery = createServerFn({
  method: "GET",
}).handler(async () => {
  try {
    return await db.select().from(campusGallery).orderBy(desc(campusGallery.id));
  } catch {
    return [];
  }
});

export const addCampusGalleryItem = createServerFn({
  method: "POST",
})
  .inputValidator((data: { src: string; caption?: string }) => data)
  .handler(async ({ data }) => {
    try {
      await db.insert(campusGallery).values({
        src: data.src,
        caption: data.caption || "",
      });
      return { success: true };
    } catch (err) {
      console.error("Add campus gallery item failed:", err);
      throw new Error("Failed to add campus gallery item");
    }
  });

export const deleteCampusGalleryItem = createServerFn({
  method: "POST",
})
  .inputValidator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    try {
      await db.delete(campusGallery).where(eq(campusGallery.id, data.id));
      return { success: true };
    } catch (err) {
      console.error("Delete campus gallery item failed:", err);
      throw new Error("Failed to delete campus gallery item");
    }
  });

export const queryChatbot = createServerFn({ method: "POST" })
  .inputValidator((data: {
    messages: Array<{ role: "system" | "user" | "assistant"; content: string }>;
  }) => data)
  .handler(async ({ data }) => {
    const query = data.messages[data.messages.length - 1]?.content?.trim() || "";
    if (!query) return { reply: "Please ask me something! 😊" };

    // 1. Embed query using the cached singleton embedder (fast after first load)
    const vector = await embedQuery(query);
    const vectorStr = `[${vector.join(",")}]`;

    // 2. Broad hybrid search — lower threshold for better recall, fetch more chunks
    const chunks = await db.execute(sql`
      SELECT content, source_type, metadata,
             1 - (embedding <=> ${vectorStr}::vector) AS similarity
      FROM rag_chunks
      WHERE 1 - (embedding <=> ${vectorStr}::vector) > 0.05
      ORDER BY embedding <=> ${vectorStr}::vector
      LIMIT 20
    `);

    // 3. Run the local intelligent engine — intent detection + BM25 rerank + template answer
    //    Zero network calls. Answers in < 50ms after embedder warmup.
    const reply = runChatbotEngine({ query, chunks: chunks as any[] });
    return { reply };

  });


