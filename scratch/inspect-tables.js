import postgres from 'postgres';

const sql = postgres('postgresql://neondb_owner:npg_VumPW7fSI0JO@ep-lingering-mountain-aom9cqy0-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require');

async function main() {
  try {
    const tables = [
      'academic_courses_offered',
      'academic_fee_structure',
      'academic_calendars',
      'academic_downloads',
      'academic_faculty',
      'academic_regulations',
      'academic_syllabus',
      'academic_timetables'
    ];

    for (const table of tables) {
      const [{ count }] = await sql`SELECT count(*)::integer FROM ${sql(table)}`;
      console.log(`Table: ${table} - Count: ${count} rows`);
      if (count > 0) {
        const rows = await sql`SELECT * FROM ${sql(table)} LIMIT 2`;
        console.log("Sample rows:", JSON.stringify(rows, null, 2));
      }
    }
  } catch (err) {
    console.error("Error connecting to database:", err);
  } finally {
    await sql.end();
  }
}

main();
