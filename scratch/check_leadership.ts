import { db } from '../src/db';
import { sql } from 'drizzle-orm';
import { pipeline } from '@xenova/transformers';

async function main() {
  const embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  const result = await embedder('who is the principal', { pooling: 'mean', normalize: true });
  const vec = `[${Array.from(result.data).join(',')}]`;
  
  console.log("Checking all chunks...");
  const allRows = await db.execute(sql`
    SELECT id, content, source_type, 1 - (embedding <=> ${vec}::vector) as score
    FROM rag_chunks
    ORDER BY score DESC
  `);
  
  console.log("\n--- Top 10 matches for 'who is the principal' ---");
  console.log(JSON.stringify(allRows.slice(0, 10), null, 2));

  console.log("\n--- Leadership chunks ---");
  const leadership = allRows.filter((r: any) => r.source_type === 'leadership');
  console.log(JSON.stringify(leadership, null, 2));
}

main().catch(console.error);
