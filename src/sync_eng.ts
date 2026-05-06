import "dotenv/config";
import { db } from "./db";
import { sql } from "drizzle-orm";

async function run() {
  console.log("Starting Engineering Cell Table Sync...");
  try {
    // 1. Create Enum
    try {
      await db.execute(sql`CREATE TYPE "eng_meta_type" AS ENUM('construction', 'electrical')`);
      console.log("Created eng_meta_type enum.");
    } catch (e: any) {
      console.log("eng_meta_type enum might already exist:", e.message);
    }

    // 2. Create Table eng_content
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "eng_content" (
        "id" SERIAL PRIMARY KEY,
        "title" TEXT,
        "description" TEXT,
        "vision" TEXT,
        "mission" TEXT
      )
    `);
    console.log("Synced eng_content table.");

    // 3. Create Table eng_meta
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "eng_meta" (
        "id" SERIAL PRIMARY KEY,
        "category" "eng_meta_type" NOT NULL,
        "title" TEXT,
        "content" TEXT,
        "name" TEXT,
        "description" TEXT,
        "engineer" TEXT,
        "img" TEXT
      )
    `);
    console.log("Synced eng_meta table.");

    // 4. Create Table eng_staff
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "eng_staff" (
        "id" SERIAL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "designation" TEXT NOT NULL,
        "type" TEXT NOT NULL,
        "img" TEXT
      )
    `);
    try {
      await db.execute(sql`ALTER TABLE "eng_staff" ADD COLUMN IF NOT EXISTS "img" TEXT`);
      console.log("Added img column to eng_staff.");
    } catch (e: any) {
      console.log("Adding img column skipped:", e.message);
    }
    try {
      await db.execute(sql`ALTER TABLE "eng_staff" ADD COLUMN IF NOT EXISTS "type" TEXT DEFAULT 'civil'`);
      console.log("Added type column to eng_staff.");
    } catch (e: any) {
      console.log("Adding type column skipped:", e.message);
    }

    console.log("Synced eng_staff table.");

    // 5. Seed some initial data if empty
    const contentCheck = await db.execute(sql`SELECT count(*) FROM "eng_content"`);
    if (Number((contentCheck[0] as any).count) === 0) {
      await db.execute(sql`
        INSERT INTO "eng_content" ("title", "description", "vision", "mission")
        VALUES (
          'Engineering Cell',
          'The Engineering Cell oversees campus construction activities, maintenance services, and technical infrastructure support to ensure safe, efficient, and well-maintained facilities.',
          'To develop and maintain high-quality, sustainable, and safe infrastructure that supports academic growth and institutional excellence.',
          'To ensure efficient construction, maintenance, and technical services through proper planning, quality execution, and timely support for all campus facilities.'
        )
      `);
      console.log("Seeded eng_content.");
    }

    const metaCheck = await db.execute(sql`SELECT count(*) FROM "eng_meta"`);
    if (Number((metaCheck[0] as any).count) === 0) {
      // Seed construction points
      await db.execute(sql`
        INSERT INTO "eng_meta" ("category", "content")
        VALUES 
          ('construction', 'Construction of Academic Block-III (G+2) at an estimated cost of Rs. 17.99 crores.'),
          ('construction', 'Construction of steps with CC paver path from Boys Hostel to AB-II at a cost of Rs. 18 lakhs.'),
          ('construction', 'Construction of water tank and pipeline connections at an estimated cost of Rs. 1.20 lakhs.')
      `);

      // Seed electrical section
      await db.execute(sql`
        INSERT INTO "eng_meta" ("category", "name", "description", "engineer", "img")
        VALUES (
          'electrical',
          'PE (Elec) Section',
          'The Electrical Section handles electrical maintenance, power-related works, and technical support services across the campus.',
          'Dr. V. S. Vakula',
          '/fallback.jpg'
        )
      `);
      console.log("Seeded eng_meta.");
    }

    // Force seed a fresh staff list to guarantee Dr. A. Padmaja is present with her image
    await db.execute(sql`TRUNCATE TABLE "eng_staff" RESTART IDENTITY CASCADE`);
    await db.execute(sql`
      INSERT INTO "eng_staff" ("name", "designation", "img", "type")
      VALUES 
        ('Dr. A. Padmaja', 'Project Engineer', '/images/padmaja.jpg', 'civil'),
        ('Er. L. Hari Prakash', 'Assistant Executive Engineer', NULL, 'civil'),
        ('M.S.R.Ch.S Raju', 'Work Inspector (Civil)', NULL, 'civil'),
        ('A. Lakshmana Rao', 'Work Inspector (Civil)', NULL, 'civil'),
        ('P. Suneetha', 'Work Inspector (Civil)', NULL, 'civil'),
        ('M. Ramana', 'Work Inspector (Non-Technical)', NULL, 'civil'),
        ('Sri. N.Appa Rao', 'Technician', NULL, 'electrical'),
        ('Sri. B.Rama Krishna', 'Helper', NULL, 'electrical')
    `);
    console.log("Clean seeded eng_staff with Project Engineer (Dr. A. Padmaja) and Technicians.");

    console.log("Engineering Cell Table Sync Completed Successfully!");
  } catch (err: any) {
    console.error("Failed to Sync Engineering Cell Tables:", err);
  }
  process.exit(0);
}

run();
