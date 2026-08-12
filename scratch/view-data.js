import postgres from 'postgres';

const connectionString = 'postgresql://neondb_owner:npg_VumPW7fSI0JO@ep-lingering-mountain-aom9cqy0-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const sql = postgres(connectionString);

async function run() {
  try {
    const syllabus = await sql`SELECT * FROM academic_syllabus`;
    console.log("=== ALL ACADEMIC SYLLABUS RECORDS ===");
    console.log(JSON.stringify(syllabus, null, 2));

    const regs = await sql`SELECT * FROM academic_regulations`;
    console.log("=== ALL ACADEMIC REGULATIONS RECORDS ===");
    console.log(JSON.stringify(regs, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await sql.end();
  }
}

run();
