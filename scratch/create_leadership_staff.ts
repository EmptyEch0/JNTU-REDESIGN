import "dotenv/config";
import postgres from "postgres";

async function main() {
  const sql = postgres(process.env.DATABASE_URL!);

  console.log("🔨 Creating leadership_staff table manually...");

  await sql`
    CREATE TABLE IF NOT EXISTS leadership_staff (
      id SERIAL PRIMARY KEY,
      leadership_slug TEXT NOT NULL REFERENCES leadership(slug),
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      section TEXT NOT NULL
    );
  `;

  console.log("✅ Table created.");
  process.exit(0);
}

main().catch(console.error);
