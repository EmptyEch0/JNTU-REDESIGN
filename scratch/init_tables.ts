import "dotenv/config";
import postgres from "postgres";

async function initTables() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL missing");
    process.exit(1);
  }
  const sql = postgres(process.env.DATABASE_URL);

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS department_nav_items (
        id SERIAL PRIMARY KEY,
        dept_slug TEXT NOT NULL,
        title TEXT NOT NULL,
        slug TEXT NOT NULL,
        icon TEXT DEFAULT 'BookOpen',
        position INT DEFAULT 0,
        parent_id INT REFERENCES department_nav_items(id) ON DELETE SET NULL,
        show_in_sidebar BOOLEAN DEFAULT true,
        status TEXT DEFAULT 'published',
        page_type TEXT DEFAULT 'standard',
        external_url TEXT,
        custom_page_id INT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
    console.log("✅ Table department_nav_items ready");

    await sql`
      CREATE TABLE IF NOT EXISTS department_pages (
        id SERIAL PRIMARY KEY,
        dept_slug TEXT NOT NULL,
        title TEXT NOT NULL,
        slug TEXT NOT NULL,
        page_type TEXT DEFAULT 'standard',
        status TEXT DEFAULT 'draft',
        draft_blocks JSONB DEFAULT '[]'::jsonb,
        published_blocks JSONB DEFAULT '[]'::jsonb,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        CONSTRAINT dept_page_unique UNIQUE (dept_slug, slug)
      );
    `;
    console.log("✅ Table department_pages ready");

    await sql`
      CREATE TABLE IF NOT EXISTS department_page_versions (
        id SERIAL PRIMARY KEY,
        page_id INT REFERENCES department_pages(id) ON DELETE CASCADE,
        version_number INT NOT NULL,
        blocks JSONB NOT NULL,
        created_by TEXT DEFAULT 'HOD',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
    console.log("✅ Table department_page_versions ready");

  } catch (err) {
    console.error("Error creating tables:", err);
  } finally {
    await sql.end();
  }
}

initTables();
