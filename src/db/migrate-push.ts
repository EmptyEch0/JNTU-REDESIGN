import postgres from "postgres";
import fs from "fs";
import path from "path";

// Auto-load .env for local run scripting
if (!process.env.DATABASE_URL) {
  try {
    const envPath = path.resolve(process.cwd(), ".env");
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, "utf-8");
      const match = envContent.match(/DATABASE_URL=['"]?([^'"\n\r]+)['"]?/);
      if (match && match[1]) {
        process.env.DATABASE_URL = match[1].trim();
        console.log("Loaded DATABASE_URL successfully from local .env");
      }
    }
  } catch (err) {
    console.error("Failed to parse .env file:", err);
  }
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("Error: DATABASE_URL environment variable is not set.");
  process.exit(1);
}

async function run() {
  console.log("Connecting to database for push notifications schema migration...");
  const sql = postgres(connectionString!, { ssl: "require" });

  try {
    console.log("Creating table 'push_subscriptions' if it does not exist...");
    await sql`
      CREATE TABLE IF NOT EXISTS push_subscriptions (
        id SERIAL PRIMARY KEY,
        endpoint TEXT NOT NULL UNIQUE,
        p256dh TEXT NOT NULL,
        auth TEXT NOT NULL,
        user_agent TEXT,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );
    `;

    console.log("push_subscriptions table successfully verified/created.");
  } catch (error) {
    console.error("Database migration error:", error);
    process.exit(1);
  } finally {
    await sql.end();
    console.log("Database connection closed.");
  }
}

run();
