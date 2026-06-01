import "dotenv/config";
import postgres from "postgres";

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("DATABASE_URL is not set");
    return;
  }
  const sql = postgres(connectionString, { ssl: "require" });

  try {
    console.log("🔨 Altering academic_regulations table to add category, size, link, and date columns if missing...");
    await sql`
      ALTER TABLE "academic_regulations" 
      ADD COLUMN IF NOT EXISTS "category" text NOT NULL DEFAULT 'B.Tech',
      ADD COLUMN IF NOT EXISTS "size" text NOT NULL DEFAULT 'Document',
      ADD COLUMN IF NOT EXISTS "link" text DEFAULT '#',
      ADD COLUMN IF NOT EXISTS "date" text NOT NULL DEFAULT '2026-05-24';
    `;
    console.log("✅ Columns category, size, link, and date added successfully.");
  } catch (err) {
    console.error("❌ Error altering table:", err);
  } finally {
    await sql.end();
  }
}

main().then(() => process.exit(0));
