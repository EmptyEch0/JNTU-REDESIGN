import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL not set');

const sql = postgres(connectionString);

async function main() {
  console.log('🚀 Creating rd_scholars table...');
  
  await sql`
    CREATE TABLE IF NOT EXISTS rd_scholars (
      id SERIAL PRIMARY KEY,
      dept_id INTEGER REFERENCES rd_departments(id) ON DELETE CASCADE,
      scholar_name TEXT,
      roll_no TEXT,
      supervisor TEXT,
      research_title TEXT,
      reg_year TEXT,
      status TEXT
    );
  `;
  
  console.log('✅ rd_scholars Table created successfully!');
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
