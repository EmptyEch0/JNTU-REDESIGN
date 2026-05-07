import "dotenv/config";
import postgres from "postgres";

async function main() {
  const sql = postgres(process.env.DATABASE_URL!);
  
  console.log("🔨 Creating IQAC MOUs table manually...");
  
  await sql`
    CREATE TABLE IF NOT EXISTS iqac_mous (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      image TEXT NOT NULL
    );
  `;
  
  console.log("✅ Table created.");
  process.exit(0);
}

main().catch(console.error);
