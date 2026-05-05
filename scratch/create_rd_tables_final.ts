import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL not set');

const sql = postgres(connectionString);

async function main() {
  console.log('🚀 Creating R&D tables...');
  
  await sql`
    CREATE TABLE IF NOT EXISTS rd_departments (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL
    );
  `;
  
  await sql`
    CREATE TABLE IF NOT EXISTS rd_research_areas (
      id SERIAL PRIMARY KEY,
      dept_id INTEGER REFERENCES rd_departments(id) ON DELETE CASCADE,
      area TEXT NOT NULL
    );
  `;
  
  console.log('✅ R&D Tables created successfully!');
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
