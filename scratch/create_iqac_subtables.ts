import "dotenv/config";
import postgres from "postgres";

async function main() {
  const sql = postgres(process.env.DATABASE_URL!);

  console.log("🔨 Creating IQAC tables manually...");

  await sql`
    CREATE TABLE IF NOT EXISTS iqac_composition (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      designation TEXT NOT NULL,
      role TEXT NOT NULL
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS iqac_reports (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      year TEXT NOT NULL,
      type TEXT NOT NULL,
      link TEXT NOT NULL
    );
  `;

  console.log("✅ Tables created.");
  process.exit(0);
}

main().catch(console.error);
