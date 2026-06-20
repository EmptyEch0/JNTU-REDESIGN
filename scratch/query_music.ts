import postgres from "postgres";

const connectionString = "postgresql://neondb_owner:npg_VumPW7fSI0JO@ep-lingering-mountain-aom9cqy0-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

async function main() {
  const sql = postgres(connectionString);

  try {
    const musicRows = await sql`SELECT * FROM music_images ORDER BY id DESC LIMIT 5`;
    console.log("Latest music_images rows:");
    console.log(musicRows);

    const engRows = await sql`SELECT * FROM eng_meta WHERE category = 'electrical'`;
    console.log("Electrical engineering cell info:");
    console.log(engRows);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await sql.end();
  }
}

main();
