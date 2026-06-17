import postgres from "postgres";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
let databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  try {
    const envPath = path.resolve(__dirname, "../.env");
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, "utf-8");
      const match = envContent.match(/DATABASE_URL=['"]?([^'"\n\r]+)['"]?/);
      if (match && match[1]) {
        databaseUrl = match[1].trim();
      }
    }
  } catch (err) {
    console.error("Failed to parse .env file:", err);
  }
}

if (!databaseUrl) {
  console.error("DATABASE_URL not found.");
  process.exit(1);
}

async function run() {
  const sql = postgres(databaseUrl, { ssl: "require" });
  try {
    const admins = await sql`SELECT * FROM admins`;
    console.log(`Found ${admins.length} admins:`);
    for (const admin of admins) {
      console.log(`- ID: ${admin.admin_id}`);
      console.log(`  Name: ${admin.name}`);
      console.log(`  Email: ${admin.email}`);
      console.log(`  Role: ${admin.role}`);
      console.log(`  authorizedDepts type: ${typeof admin.authorized_depts}`);
      console.log(`  authorizedDepts value:`, admin.authorized_depts);
      console.log(`  IsArray: ${Array.isArray(admin.authorized_depts)}`);
    }
  } catch (err) {
    console.error("Error querying database:", err);
  } finally {
    await sql.end();
  }
}

run();
