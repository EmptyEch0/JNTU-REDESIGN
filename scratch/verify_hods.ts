import { db } from "../src/db/index";
import { sql } from "drizzle-orm";

async function main() {
  const result = await db.execute(sql`
    SELECT source, content 
    FROM rag_chunks 
    WHERE source_type = 'hod'
    ORDER BY source;
  `);
  console.log("HOD chunks inside RAG database:");
  (result as any[]).forEach((row, i) => {
    console.log(`\n${i+1}. [${row.source}]\nContent: "${row.content}"`);
  });
  process.exit(0);
}

main().catch(console.error);
