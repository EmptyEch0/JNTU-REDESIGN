import postgres from 'postgres';

const connectionString = 'postgresql://neondb_owner:npg_VumPW7fSI0JO@ep-lingering-mountain-aom9cqy0-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const sql = postgres(connectionString);

async function run() {
  try {
    const tables = [
      'academic_fee_structure',
      'academic_calendars',
      'academic_regulations',
      'academic_syllabus',
      'academic_downloads',
      'academic_timetables',
      'academic_faculty'
    ];

    for (const t of tables) {
      console.log(`\n--- Records for ${t} ---`);
      const rows = await sql`SELECT * FROM ${sql(t)} LIMIT 5`;
      console.log(JSON.stringify(rows, null, 2));
    }
  } catch (err) {
    console.error(err);
  } finally {
    await sql.end();
  }
}

run();
