import "dotenv/config";
import postgres from "postgres";

async function main() {
  const sql = postgres(process.env.DATABASE_URL!);

  console.log("🔨 Creating leadership table manually...");

  await sql`
    CREATE TABLE IF NOT EXISTS leadership (
      id SERIAL PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      image TEXT NOT NULL,
      email TEXT NOT NULL,
      designation TEXT NOT NULL,
      quote TEXT NOT NULL,
      message TEXT NOT NULL,
      profile TEXT NOT NULL
    );
  `;

  console.log("✅ Table created.");
  process.exit(0);
}

main().catch(console.error);
