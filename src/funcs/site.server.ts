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


import { memoryCache } from "../lib/cache";

export const getPageContent = createServerFn({
  method: "GET",
})
  .inputValidator((page: string) => page)
  .handler(async ({ data: page }) => {
    return memoryCache.getOrSet(`siteContent:${page}`, 10 * 60 * 1000, async () => {
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
        const inserted = await db
          .insert(siteContent)
          .values({
            page: data.page,
            sectionKey: data.sectionKey,
            title: data.title,
            content: data.content,
          })
          .returning({ id: siteContent.id });
        recordId = inserted[0].id;
      }

      memoryCache.invalidate(`siteContent:${data.page}`);

      // Auto-ingest chunk for RAG chatbot!
      const chunkSource = `sitecontent:${recordId}`;
      const chunkText = `Page: ${data.page}, Section: ${data.sectionKey}. ${data.title}. ${data.content}`;
      ingestSingleChunk(chunkText, chunkSource, "site_content", { page: data.page }).catch(
        (err) => console.error("RAG auto-ingest error:", err)
      );

      return { success: true };
    } catch (err) {
      console.error("Update page section failed:", err);
      throw new Error("Failed to update section");
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
  .inputValidator(
    (data: { title: string; date: string; tag: string; link?: string }) => data
  )
  .handler(async ({ data }) => {
    try {
      const inserted = await db
        .insert(notices)
        .values({
          title: data.title,
          date: data.date,
          tag: data.tag,
          link: data.link || null,
        })
        .returning({ id: notices.id });

      const noticeId = inserted[0].id;
      const chunkSource = `notice:${noticeId}`;
      const chunkText = `Notice: ${data.title}. Category: ${data.tag}. Date: ${data.date}`;
      ingestSingleChunk(chunkText, chunkSource, "notice", { date: data.date, tag: data.tag }).catch(
        (err) => console.error("RAG auto-ingest notice error:", err)
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

export const getAcademicRegulations = createServerFn({
  method: "GET",
}).handler(async () => {
  try {
    return await db.select().from(academicRegulations).orderBy(desc(academicRegulations.id));
  } catch {
    return [];
  }
});

export const addAcademicRegulation = createServerFn({
  method: "POST",
})
  .inputValidator(
    (data: { title: string; category: string; link: string }) => data
  )
  .handler(async ({ data }) => {
    try {
      const inserted = await db
        .insert(academicRegulations)
        .values({
          title: data.title,
          category: data.category,
          link: data.link,
        })
        .returning({ id: academicRegulations.id });

      const regId = inserted[0].id;
      const chunkSource = `regulation:${regId}`;
      const chunkText = `Academic Regulation: ${data.title}. Category: ${data.category}. Download: ${data.link}`;
      ingestSingleChunk(chunkText, chunkSource, "regulation", { link: data.link, category: data.category }).catch(
        (err) => console.error("RAG auto-ingest regulation error:", err)
      );

      return { success: true };
    } catch (err) {
      console.error("Add regulation failed:", err);
      throw new Error("Failed to add regulation");
    }
  });

export const deleteAcademicRegulation = createServerFn({
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

    // 1. Embed query using cached singleton embedder + query vector cache (0ms for repeat queries)
    const vector = await embedQuery(query);
    const vectorStr = `[${vector.join(",")}]`;

    // 2. Elastic Hybrid Search: Postgres Vector Cosine Distance + WebSearch Text Search Rank
    const cleanQuery = query.replace(/[^a-zA-Z0-9\s]/g, " ").trim();
    let chunks: any[] = [];
    try {
      const queryResult = await db.execute(sql`
        SELECT content, source_type, metadata,
               (1 - (embedding <=> ${vectorStr}::vector)) AS similarity,
               ts_rank_cd(to_tsvector('english', content), websearch_to_tsquery('english', ${cleanQuery})) AS text_rank,
               (0.65 * (1 - (embedding <=> ${vectorStr}::vector)) +
                0.35 * COALESCE(ts_rank_cd(to_tsvector('english', content), websearch_to_tsquery('english', ${cleanQuery})), 0)) AS combined_score
        FROM rag_chunks
        WHERE (1 - (embedding <=> ${vectorStr}::vector)) > 0.05
           OR (to_tsvector('english', content) @@ websearch_to_tsquery('english', ${cleanQuery}))
        ORDER BY combined_score DESC, similarity DESC
        LIMIT 25
      `);
      chunks = Array.from(queryResult);
    } catch (err) {
      // Fallback to pure vector search if fulltext query syntax throws
      const fallbackResult = await db.execute(sql`
        SELECT content, source_type, metadata,
               1 - (embedding <=> ${vectorStr}::vector) AS similarity
        FROM rag_chunks
        WHERE 1 - (embedding <=> ${vectorStr}::vector) > 0.05
        ORDER BY embedding <=> ${vectorStr}::vector
        LIMIT 25
      `);
      chunks = Array.from(fallbackResult);
    }

    // 3. Local Intelligent Engine: Intent detection + BM25 Rerank + Template Summarizer
    const reply = runChatbotEngine({ query, chunks });
    return { reply };
  });
