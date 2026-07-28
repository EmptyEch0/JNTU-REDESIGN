import { db } from "../src/db";
import { sql } from "drizzle-orm";

async function main() {
  console.log("Altering table...");
  await db.execute(sql`ALTER TABLE rag_chunks ALTER COLUMN embedding TYPE vector(384);`);
  console.log("Done.");
}

main().catch(console.error);
