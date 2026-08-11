import { db } from "../src/db/index";
import { sql } from "drizzle-orm";

async function main() {
  console.log("Creating table academics_exam_cell manually...");
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS academics_exam_cell (
      id SERIAL PRIMARY KEY,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      date TEXT NOT NULL,
      file_url TEXT
    );
  `);
  console.log("Table academics_exam_cell successfully created!");
  process.exit(0);
}

main().catch(console.error);
