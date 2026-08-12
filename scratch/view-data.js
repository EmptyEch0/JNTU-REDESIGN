import postgres from 'postgres';

const connectionString = 'postgresql://neondb_owner:npg_VumPW7fSI0JO@ep-lingering-mountain-aom9cqy0-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const sql = postgres(connectionString);

async function run() {
  try {
    const depts = await sql`SELECT id, name, slug, image FROM departments`;
    console.log("=== DEPARTMENTS IMAGES ===");
    console.log(JSON.stringify(depts, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await sql.end();
  }
}

run();
