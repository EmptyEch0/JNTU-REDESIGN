import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL not set');

const sql = postgres(connectionString);

async function main() {
  try {
    const data = await sql`SELECT * FROM departments LIMIT 5`;
    console.log(data);
  } catch (e) {
    console.error('Table might not have data or other error:', e);
  }
  process.exit(0);
}

main();
