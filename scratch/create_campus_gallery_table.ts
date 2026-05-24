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
    console.log("Creating table campus_gallery...");
    await sql`
      CREATE TABLE IF NOT EXISTS "campus_gallery" (
        "id" serial PRIMARY KEY NOT NULL,
        "src" text NOT NULL,
        "caption" text,
        "created_at" timestamp DEFAULT now()
      );
    `;

    console.log("Success! campus_gallery table created.");
  } catch (err) {
    console.error("Error executing SQL:", err);
  } finally {
    await sql.end();
  }
}

main();
