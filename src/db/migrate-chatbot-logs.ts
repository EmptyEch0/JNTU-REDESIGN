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
  console.log("Connecting to database for chatbot_logs schema migration...");
  const sql = postgres(connectionString!, { ssl: "require" });

  try {
    console.log("Creating table 'chatbot_logs' if it does not exist...");
    await sql`
      CREATE TABLE IF NOT EXISTS chatbot_logs (
        id SERIAL PRIMARY KEY,
        session_id TEXT,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        intent TEXT NOT NULL DEFAULT 'unknown',
        language TEXT NOT NULL DEFAULT 'english',
        source TEXT NOT NULL DEFAULT 'server',
        confidence TEXT NOT NULL DEFAULT 'high',
        rating TEXT NOT NULL DEFAULT 'unreviewed',
        admin_notes TEXT,
        suggested_answer TEXT,
        user_agent TEXT,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );
    `;

    console.log("chatbot_logs table successfully verified/created.");

    // Create helpful indices for fast analytics queries
    await sql`CREATE INDEX IF NOT EXISTS idx_chatbot_logs_created_at ON chatbot_logs(created_at DESC);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_chatbot_logs_intent ON chatbot_logs(intent);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_chatbot_logs_rating ON chatbot_logs(rating);`;

    console.log("Indices successfully verified/created.");
  } catch (error) {
    console.error("Database migration error:", error);
    process.exit(1);
  } finally {
    await sql.end();
    console.log("Database connection closed.");
  }
}

run();
