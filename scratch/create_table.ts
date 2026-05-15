import postgres from 'postgres';

const connectionString = "postgresql://neondb_owner:npg_VumPW7fSI0JO@ep-lingering-mountain-aom9cqy0-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

async function main() {
  const sql = postgres(connectionString);
  
  try {
    console.log("Executing CREATE TABLE site_content...");
    await sql`
      CREATE TABLE IF NOT EXISTS "site_content" (
        "id" serial PRIMARY KEY NOT NULL,
        "page" text NOT NULL,
        "section_key" text NOT NULL,
        "title" text,
        "content" text,
        "image_url" text
      );
    `;
    console.log("Success! Table created.");
  } catch (err) {
    console.error("Error executing SQL:", err);
  } finally {
    await sql.end();
  }
}

main();
