import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL not set');

const sql = postgres(connectionString);

async function main() {
  console.log('🚀 Creating new R&D tables...');
  
  await sql`
    CREATE TABLE IF NOT EXISTS rd_focus_areas (
      id SERIAL PRIMARY KEY,
      title TEXT,
      description TEXT,
      icon TEXT
    );
  `;
  
  await sql`
    CREATE TABLE IF NOT EXISTS rd_funders (
      id SERIAL PRIMARY KEY,
      name TEXT
    );
  `;
  
  await sql`
    CREATE TABLE IF NOT EXISTS rd_consultancy (
      id SERIAL PRIMARY KEY,
      name TEXT,
      description TEXT
    );
  `;
  
  await sql`
    CREATE TABLE IF NOT EXISTS rd_committee (
      id SERIAL PRIMARY KEY,
      name TEXT,
      role TEXT,
      detail TEXT
    );
  `;
  
  await sql`
    CREATE TABLE IF NOT EXISTS rd_projects (
      id SERIAL PRIMARY KEY,
      dept_id INTEGER REFERENCES rd_departments(id) ON DELETE CASCADE,
      title TEXT,
      pi TEXT,
      agency TEXT,
      amount TEXT,
      period TEXT,
      status TEXT
    );
  `;
  
  console.log('✅ All R&D Tables created successfully!');
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
