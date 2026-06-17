import postgres from "postgres";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

// Auto-load .env for local run scripting
if (!process.env.DATABASE_URL) {
  try {
    const envPath = path.resolve(process.cwd(), ".env");
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, "utf-8");
      const match = envContent.match(/DATABASE_URL=['"]?([^'"\n\r]+)['"]?/);
      if (match && match[1]) {
        process.env.DATABASE_URL = match[1].trim();
        console.log("Loaded DATABASE_URL successfully from local .env");
      }
    }
  } catch (err) {
    console.error("Failed to parse .env file:", err);
  }
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("Error: DATABASE_URL environment variable is not set.");
  process.exit(1);
}

async function run() {
  console.log("Connecting to database for admin authentication schema migration...");
  const sql = postgres(connectionString!, { ssl: "require" });

  try {
    // 1. Create admins table
    console.log("Creating table 'admins' if it does not exist...");
    await sql`
      CREATE TABLE IF NOT EXISTS admins (
        admin_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT,
        role TEXT NOT NULL DEFAULT 'department_admin',
        auth_provider TEXT NOT NULL DEFAULT 'email',
        authorized_depts JSONB NOT NULL DEFAULT '[]'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );
    `;

    // 2. Create admin_sessions table
    console.log("Creating table 'admin_sessions' if it does not exist...");
    await sql`
      CREATE TABLE IF NOT EXISTS admin_sessions (
        id TEXT PRIMARY KEY,
        admin_id UUID NOT NULL REFERENCES admins(admin_id) ON DELETE CASCADE,
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        ip_address TEXT,
        user_agent TEXT
      );
    `;

    // 3. Create admin_audit_logs table
    console.log("Creating table 'admin_audit_logs' if it does not exist...");
    await sql`
      CREATE TABLE IF NOT EXISTS admin_audit_logs (
        id SERIAL PRIMARY KEY,
        admin_id UUID REFERENCES admins(admin_id) ON DELETE CASCADE,
        action TEXT NOT NULL,
        ip_address TEXT,
        user_agent TEXT,
        details TEXT,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );
    `;

    console.log("Authentication tables successfully verified/created.");

    // 4. Seed default super admin
    const adminEmail = "admin@jntugv.edu.in";
    console.log(`Checking if default super admin (${adminEmail}) exists...`);
    
    const existing = await sql`
      SELECT * FROM admins WHERE email = ${adminEmail};
    `;

    if (existing.length === 0) {
      console.log("Hashing default super admin password...");
      const passwordHash = await bcrypt.hash("jntu@2026", 10);
      
      console.log("Seeding default super admin user...");
      await sql`
        INSERT INTO admins (name, email, password_hash, role, auth_provider, authorized_depts)
        VALUES (
          'Super Admin',
          ${adminEmail},
          ${passwordHash},
          'super_admin',
          'email',
          '[]'::jsonb
        );
      `;
      console.log("Default super admin successfully seeded.");
    } else {
      console.log("Default super admin already exists. Skipping seed.");
    }

    console.log("Migration completed successfully.");
  } catch (error) {
    console.error("Database migration error:", error);
    process.exit(1);
  } finally {
    await sql.end();
    console.log("Database connection closed.");
  }
}

run();
