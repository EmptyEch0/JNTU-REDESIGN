import { db } from "../src/db/index";
import { sql } from "drizzle-orm";

async function runCheck1() {
  console.log("\n--- Check 1: Is Ingestion Complete with all Source Types? ---");
  const r = await db.execute(sql`
    SELECT source_type, COUNT(*) as count 
    FROM rag_chunks 
    GROUP BY source_type 
    ORDER BY count DESC
  `);
  console.table(r);
}

async function runCheck2() {
  console.log("\n--- Check 2: Are Embeddings Stored Correctly (no nulls)? ---");
  const r = await db.execute(sql`
    SELECT 
      COUNT(*) as total,
      COUNT(embedding) as with_embedding,
      COUNT(*) FILTER (WHERE embedding IS NULL) as null_embeddings,
      COUNT(*) FILTER (WHERE content_hash IS NULL) as null_hashes,
      vector_dims(embedding) as dims
    FROM rag_chunks
    GROUP BY embedding
    LIMIT 1
  `);
  // Note: grouped by embedding to get vector_dims or just raw select
  // Let's run a simpler select to avoid pg error on vector_dims with group by:
  const r2 = await db.execute(sql`
    SELECT 
      COUNT(*) as total,
      COUNT(embedding) as with_embedding,
      COUNT(*) FILTER (WHERE embedding IS NULL) as null_embeddings,
      COUNT(*) FILTER (WHERE content_hash IS NULL) as null_hashes
    FROM rag_chunks
  `);
  
  const dimsResult = await db.execute(sql`
    SELECT vector_dims(embedding) as dims 
    FROM rag_chunks 
    WHERE embedding IS NOT NULL 
    LIMIT 1
  `);
  
  console.log("Stats:");
  console.table(r2);
  console.log("Vector Dimensions:", dimsResult[0]?.dims);
}

async function runCheck3() {
  console.log("\n--- Check 3: Is Vector Search Returning Relevant Results? ---");
  const { pipeline } = await import("@xenova/transformers");
  const embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  const result = await embedder("who is the principal", { pooling: "mean", normalize: true });
  const vec = `[${Array.from(result.data).join(",")}]`;
  const rows = await db.execute(sql`
    SELECT source_type, LEFT(content, 80) as preview, 
           ROUND((1 - (embedding <=> ${vec}::vector))::numeric, 3) as score
    FROM rag_chunks
    WHERE 1 - (embedding <=> ${vec}::vector) > 0.15
    ORDER BY embedding <=> ${vec}::vector
    LIMIT 5
  `);
  console.table(rows);
}

async function runCheck4() {
  console.log("\n--- Check 4: Is Dedup Working? ---");
  const r = await db.execute(sql`
    SELECT 
      COUNT(*) as total,
      COUNT(DISTINCT source) as unique_sources,
      COUNT(*) - COUNT(DISTINCT source) as duplicates
    FROM rag_chunks
  `);
  console.table(r);
}

async function main() {
  await runCheck1();
  await runCheck2();
  await runCheck3();
  await runCheck4();
  process.exit(0);
}

main().catch(console.error);
