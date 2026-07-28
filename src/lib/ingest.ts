import { db } from "../db";
import { sql } from "drizzle-orm";
import { createHash } from "crypto";

let embedder: any = null;

async function getEmbedder() {
  if (!embedder) {
    const { pipeline } = await import("@xenova/transformers");
    embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }
  return embedder;
}

async function embed(text: string): Promise<number[]> {
  const pipe = await getEmbedder();
  const result = await pipe(text, { pooling: "mean", normalize: true });
  return Array.from(result.data);
}

export async function ingestSingleChunk(content: string, source: string, sourceType: string, metadata: object = {}) {
  if (!content?.trim()) return;

  const hash = createHash("md5").update(content).digest("hex");

  const existing = await db.execute(
    sql`SELECT content_hash FROM rag_chunks WHERE source = ${source} LIMIT 1`
  );

  if (existing.length > 0 && (existing[0] as any).content_hash === hash) {
    return; // unchanged, skip
  }

  const vector = await embed(content);
  const vectorStr = `[${vector.join(",")}]`;

  await db.execute(sql`
    INSERT INTO rag_chunks (content, embedding, source, source_type, metadata, content_hash)
    VALUES (${content}, ${vectorStr}::vector, ${source}, ${sourceType}, ${JSON.stringify(metadata)}, ${hash})
    ON CONFLICT (source) DO UPDATE SET
      content = EXCLUDED.content,
      embedding = EXCLUDED.embedding,
      metadata = EXCLUDED.metadata,
      content_hash = EXCLUDED.content_hash,
      updated_at = now()
  `);

  console.log(`✓ Ingested chunk: ${source}`);
}

export async function deleteSingleChunk(source: string) {
  await db.execute(sql`
    DELETE FROM rag_chunks WHERE source = ${source}
  `);
  console.log(`✗ Deleted chunk: ${source}`);
}
