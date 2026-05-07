import "dotenv/config";
import postgres from "postgres";

async function main() {
  const sql = postgres(process.env.DATABASE_URL!);
  
  console.log("🔨 Creating IQAC event tables manually...");
  
  await sql`
    CREATE TABLE IF NOT EXISTS iqac_events (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      date TEXT NOT NULL
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS iqac_outcomes (
      id SERIAL PRIMARY KEY,
      text TEXT NOT NULL
    );
  `;
  
  console.log("✅ Tables created.");
  process.exit(0);
}

main().catch(console.error);
