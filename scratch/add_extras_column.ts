import "dotenv/config";
import postgres from "postgres";

async function main() {
  const sql = postgres(process.env.DATABASE_URL!);
  
  console.log("🔨 Adding extras column to leadership table...");
  
  await sql`
    ALTER TABLE leadership ADD COLUMN IF NOT EXISTS extras JSONB;
  `;
  
  console.log("✅ Column added.");
  process.exit(0);
}

main().catch(console.error);
