import { db } from "../src/db/index";
import { sql } from "drizzle-orm";

async function main() {
  const result = await db.execute(sql`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
    ORDER BY table_name;
  `);
  console.log("Tables in database:");
  console.log((result as any[]).map(t => t.table_name).join(", "));
  process.exit(0);
}

main().catch(console.error);
