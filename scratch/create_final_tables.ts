import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL not set');

const sql = postgres(connectionString);

async function main() {
  console.log('🚀 Creating final tables...');
  
  await sql`
    CREATE TABLE IF NOT EXISTS rd_coordinator_message (
      id SERIAL PRIMARY KEY,
      name TEXT,
      role TEXT,
      quote TEXT,
      message TEXT,
      image TEXT
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS rd_motto (
      id SERIAL PRIMARY KEY,
      text TEXT,
      "order" INTEGER
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS rd_publications (
      id SERIAL PRIMARY KEY,
      dept TEXT,
      title TEXT,
      venue TEXT,
      authors TEXT
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS rd_publication_stats (
      id SERIAL PRIMARY KEY,
      label TEXT,
      value INTEGER,
      suffix TEXT
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS rd_mous (
      id SERIAL PRIMARY KEY,
      title TEXT,
      body TEXT,
      img TEXT,
      badge TEXT,
      type TEXT
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS placement_gallery (
      id SERIAL PRIMARY KEY,
      src TEXT,
      caption TEXT
    );
  `;
  
  console.log('✅ All tables created successfully!');
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
