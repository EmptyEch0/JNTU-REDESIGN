import postgres from "postgres";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL;

async function main() {
  if (!connectionString) {
    console.error("DATABASE_URL is not set");
    return;
  }
  const sql = postgres(connectionString, { ssl: "require" });

  try {
    console.log("Creating table notices...");
    await sql`
      CREATE TABLE IF NOT EXISTS "notices" (
        "id" serial PRIMARY KEY NOT NULL,
        "date" text NOT NULL,
        "tag" text NOT NULL,
        "title" text NOT NULL,
        "created_at" timestamp DEFAULT now()
      );
    `;

    console.log("Creating table academic_regulations...");
    await sql`
      CREATE TABLE IF NOT EXISTS "academic_regulations" (
        "id" serial PRIMARY KEY NOT NULL,
        "title" text NOT NULL,
        "category" text NOT NULL,
        "size" text NOT NULL,
        "date" text NOT NULL,
        "link" text DEFAULT '#'
      );
    `;

    console.log("Success! Both tables created.");
  } catch (err) {
    console.error("Error executing SQL:", err);
  } finally {
    await sql.end();
  }
}

main();
