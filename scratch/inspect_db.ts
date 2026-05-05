import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL not set');

const sql = postgres(connectionString);

async function main() {
  const tables = await sql`
    SELECT table_name, column_name, data_type 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND column_name = 'id'
  `;
  console.log(tables);
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
