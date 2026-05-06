import { db } from "./src/db";
import { sql } from "drizzle-orm";

async function main() {
  console.log("Creating hostel_staff table...");
  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "hostel_staff" (
        "id" serial PRIMARY KEY NOT NULL,
        "name" text NOT NULL,
        "role" text NOT NULL
      );
    `);
    console.log("Table created successfully!");
  } catch (e) {
    console.error(e);
  }
  process.exit(0);
}

main();
