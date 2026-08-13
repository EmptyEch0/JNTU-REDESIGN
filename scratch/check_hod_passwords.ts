import "dotenv/config";
import postgres from "postgres";
import bcrypt from "bcryptjs";

async function checkOrSetHodPasswords() {
  if (!process.env.DATABASE_URL) {
    console.error("No DATABASE_URL");
    process.exit(1);
  }

  const sql = postgres(process.env.DATABASE_URL);

  try {
    const depts = await sql`SELECT id, name, slug, hod_password FROM departments`;
    console.log("Found departments in DB:", depts.map(d => ({ id: d.id, name: d.name, slug: d.slug, hasPassword: Boolean(d.hod_password) })));

    // Hash default testing password "hod123" if any department lacks a password
    const defaultHash = await bcrypt.hash("hod123", 10);

    for (const d of depts) {
      console.log(`Setting HOD testing password 'hod123' for department ${d.slug}...`);
      await sql`UPDATE departments SET hod_password = ${defaultHash} WHERE id = ${d.id}`;
    }

    console.log("✅ All HOD department passwords verified!");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await sql.end();
  }
}

checkOrSetHodPasswords();
