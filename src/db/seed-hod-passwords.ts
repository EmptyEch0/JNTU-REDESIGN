// Location: src/db/seed-hod-passwords.ts
import "dotenv/config";
import { db } from "./index";       
import { departments } from "./schema"; 
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

async function runSeeder() {
  console.log("🚀 Starting secure HOD password hashing and seeding process...");

  try {
    const allDepartments = await db.select().from(departments);

    if (allDepartments.length === 0) {
      console.log("⚠️ No departments found in the database.");
      return;
    }

    const saltRounds = 10;

    for (const dept of allDepartments) {
      // FIXED: Using exclusively 'slug' instead of 'code' since 'code' doesn't exist on your type
      const branchCode = (dept.slug || "branch").toLowerCase();
      const plainTextPassword = `${branchCode}@hod`;

      console.log(`Processing "${dept.name}" -> Generating: "${plainTextPassword}"`);

      // Hash the plain-text branch string pattern
      const hashedPassword = await bcrypt.hash(plainTextPassword, saltRounds);

      // Save the resulting hash sequence to the database row
      await db
        .update(departments)
        .set({ hod_password: hashedPassword })
        .where(eq(departments.id, dept.id));

      console.log(`✅ Secure hash written to DB for [${dept.name}].`);
    }

    console.log("\n✨ Database updated successfully with Bcrypt hashes!");
  } catch (error) {
    console.error("❌ Seeding process error:", error);
  }
}

runSeeder().catch(console.error);