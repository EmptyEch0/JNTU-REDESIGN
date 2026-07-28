import { db } from "../src/db/index";
import { sql } from "drizzle-orm";

async function main() {
  const r = await db.execute(sql`SELECT COUNT(*) as total FROM rag_chunks`);
  console.log("Total chunks:", r[0]?.total || (r as any).rows?.[0]?.total || r);
  process.exit(0);
}

main().catch(console.error);
