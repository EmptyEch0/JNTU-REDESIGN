import postgres from 'postgres';

const connectionString = 'postgresql://neondb_owner:npg_VumPW7fSI0JO@ep-lingering-mountain-aom9cqy0-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const sql = postgres(connectionString);

async function run() {
  try {
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log("All Tables:", tables.map(t => t.table_name).sort());

    const targetTables = [
      'academic_courses_offered',
      'academic_fee_structure',
      'academic_calendars',
      'academic_calender',
      'academic_regulations',
      'academic_syllabus',
      'academic_downloads',
      'academic_timetables',
      'academic_faculty',
      'acadamics_dowloads',
      'acadamics_timetables',
      'acadamic_regulations',
      'acadamic_syllabus',
      'acadamic_faculty',
      'academic_scholarships',
      'academics_scholarships_new',
      'scholarships'
    ];

    for (const tableName of targetTables) {
      const exists = tables.some(t => t.table_name === tableName);
      if (exists) {
        const columns = await sql`
          SELECT column_name, data_type, is_nullable
          FROM information_schema.columns
          WHERE table_schema = 'public' AND table_name = ${tableName}
        `;
        console.log(`\nTable ${tableName} exists with columns:`);
        columns.forEach(c => {
          console.log(`  - ${c.column_name} (${c.data_type}, nullable: ${c.is_nullable})`);
        });
        
        const rowCount = await sql`SELECT COUNT(*)::int as count FROM ${sql(tableName)}`;
        console.log(`  Row count: ${rowCount[0].count}`);
      } else {
        console.log(`\nTable ${tableName} does NOT exist.`);
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    await sql.end();
  }
}

run();
