import postgres from "postgres";

const connectionString = "postgresql://neondb_owner:npg_VumPW7fSI0JO@ep-lingering-mountain-aom9cqy0-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

async function main() {
  const sql = postgres(connectionString);

  try {
    const rows = await sql`SELECT * FROM dispensary_content`;
    console.log("dispensary_content rows:");
    console.log(rows);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await sql.end();
  }
}

main();
