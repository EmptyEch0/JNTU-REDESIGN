import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL not set');

const sql = postgres(connectionString);

async function main() {
  console.log('🚀 Creating tables...');
  
  await sql`
    CREATE TABLE IF NOT EXISTS departments (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL
    );
  `;
  
  await sql`
    CREATE TABLE IF NOT EXISTS research_areas (
      id SERIAL PRIMARY KEY,
      dept_id INTEGER REFERENCES departments(id) ON DELETE CASCADE,
      area TEXT NOT NULL
    );
  `;
  
  console.log('✅ Tables created successfully!');
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
