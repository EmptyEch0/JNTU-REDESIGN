import { db } from "./db";
import { sql } from "drizzle-orm";

async function run() {
  console.log("Starting Sports Table Sync...");
  try {
    // 1. Create Enums
    try {
      await db.execute(sql`CREATE TYPE "sports_role" AS ENUM('faculty', 'non_teaching')`);
      console.log("Created sports_role enum.");
    } catch (e: any) {
      console.log("sports_role enum might already exist:", e.message);
    }

    try {
      await db.execute(sql`CREATE TYPE "sports_infra" AS ENUM('field', 'gym')`);
      console.log("Created sports_infra enum.");
    } catch (e: any) {
      console.log("sports_infra enum might already exist:", e.message);
    }

    // 2. Create Table sports_content
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "sports_content" (
        "id" SERIAL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "designation" TEXT NOT NULL,
        "message" TEXT NOT NULL,
        "img" TEXT NOT NULL,
        "qualification" TEXT,
        "address" TEXT,
        "phone" TEXT,
        "email" TEXT,
        "extn" TEXT
      )
    `);
    console.log("Synced sports_content table.");

    // Check if extn column exists, if not add it
    try {
      await db.execute(sql`ALTER TABLE "sports_content" ADD COLUMN "extn" TEXT`);
      console.log("Added extn column to sports_content.");
    } catch (e: any) {
      console.log("extn column might already exist:", e.message);
    }

    // 3. Create Table sports_people
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "sports_people" (
        "id" SERIAL PRIMARY KEY,
        "role_type" "sports_role" NOT NULL,
        "name" TEXT NOT NULL,
        "designation" TEXT NOT NULL
      )
    `);
    console.log("Synced sports_people table.");

    // 4. Create Table sports_infra
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "sports_infra" (
        "id" SERIAL PRIMARY KEY,
        "category" "sports_infra" NOT NULL,
        "name" TEXT NOT NULL,
        "qty" INTEGER,
        "cost" TEXT
      )
    `);
    console.log("Synced sports_infra table.");

    // 5. Seed some initial data if sports_content is empty
    const contentCheck = await db.execute(sql`SELECT count(*) FROM "sports_content"`);
    const count = Number((contentCheck[0] as any).count);
    if (count === 0) {
      await db.execute(sql`
        INSERT INTO "sports_content" ("name", "designation", "message", "img", "qualification", "address", "phone", "email", "extn")
        VALUES (
          'Dr. G. P. Raju',
          'Assistant Professor & Secretary JNTUK Sports Council',
          'Healthy mind in a healthy body.',
          '/images/sports-head.jpg',
          'M.A., M.P.Ed., M.Phil., Ph.D.',
          'Department of Physical Education, JNTUK, University College Of Engineering, Dwarapudi (Post), Vizianagram – 535003, Andhra Pradesh, India.',
          '(o) 08922-277918 Mobile: 9849777784',
          'phyedu@jntukucev.ac.in, gogula.raju@yahoo.com, gogula.raju@gmail.com',
          '76'
        )
      `);
      console.log("Seeded initial sports content data.");
    }

    console.log("Sports Table Sync Completed Successfully!");
  } catch (err: any) {
    console.error("Failed to Sync Sports Tables programmatically:", err);
  }
  process.exit(0);
}

run();
