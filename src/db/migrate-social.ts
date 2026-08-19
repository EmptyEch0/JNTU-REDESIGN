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

const connStr = connectionString as string;

async function run() {
  console.log("Connecting to database for social publishing schema migration...");
  
  // Use SSL if it is a Neon DB (standard connection indicator)
  const useSsl = connStr.includes("neon.tech") || connStr.includes("sslmode=require");
  const sql = postgres(connStr, useSsl ? { ssl: "require" } : {});

  try {
    // 1. Create social_connections table
    console.log("Creating table 'social_connections' if it does not exist...");
    await sql`
      CREATE TABLE IF NOT EXISTS social_connections (
        id TEXT PRIMARY KEY,
        access_token TEXT NOT NULL,
        refresh_token TEXT,
        expires_at TIMESTAMP WITH TIME ZONE,
        connected_as TEXT,
        metadata JSONB,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // 2. Add columns to notices table
    console.log("Checking and altering 'social_connections' table...");
    await sql`
      ALTER TABLE social_connections
      ADD COLUMN IF NOT EXISTS metadata JSONB;
    `;

    // 3. Add columns to notices table
    console.log("Checking and altering 'notices' table...");
    await sql`
      ALTER TABLE notices 
      ADD COLUMN IF NOT EXISTS url TEXT,
      ADD COLUMN IF NOT EXISTS instagram_posted BOOLEAN NOT NULL DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS instagram_post_id TEXT,
      ADD COLUMN IF NOT EXISTS instagram_posted_at TIMESTAMP WITH TIME ZONE,
      ADD COLUMN IF NOT EXISTS instagram_error TEXT,
      ADD COLUMN IF NOT EXISTS linkedin_posted BOOLEAN NOT NULL DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS linkedin_post_id TEXT,
      ADD COLUMN IF NOT EXISTS linkedin_posted_at TIMESTAMP WITH TIME ZONE,
      ADD COLUMN IF NOT EXISTS linkedin_error TEXT;
    `;

    // 3. Add columns to campus_gallery table
    console.log("Checking and altering 'campus_gallery' table...");
    await sql`
      ALTER TABLE campus_gallery 
      ADD COLUMN IF NOT EXISTS instagram_posted BOOLEAN NOT NULL DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS instagram_post_id TEXT,
      ADD COLUMN IF NOT EXISTS instagram_posted_at TIMESTAMP WITH TIME ZONE,
      ADD COLUMN IF NOT EXISTS instagram_error TEXT,
      ADD COLUMN IF NOT EXISTS linkedin_posted BOOLEAN NOT NULL DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS linkedin_post_id TEXT,
      ADD COLUMN IF NOT EXISTS linkedin_posted_at TIMESTAMP WITH TIME ZONE,
      ADD COLUMN IF NOT EXISTS linkedin_error TEXT;
    `;

    // 4. Create social_posts table
    console.log("Creating table 'social_posts' if it does not exist...");
    await sql`
      CREATE TABLE IF NOT EXISTS social_posts (
        id SERIAL PRIMARY KEY,
        user_id TEXT,
        content TEXT NOT NULL,
        platform TEXT NOT NULL,
        post_id TEXT NOT NULL,
        post_url TEXT,
        status TEXT NOT NULL,
        published_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    console.log("Social publishing database schema successfully updated!");
    process.exit(0);
  } catch (error) {
    console.error("Database migration error:", error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

run();
