// Location: src/db/seed-hod-passwords.ts
import "dotenv/config";
import { db } from "./index";
import { departments } from "./schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

/**
 * Generates a cryptographically random password containing at least one
 * uppercase letter, one lowercase letter, one digit, and one symbol.
 * Uses crypto.randomInt (CSPRNG) instead of Math.random().
 * Ambiguous characters (I, l, O, 0, 1) are excluded to avoid transcription
 * errors when an HOD types the password in by hand.
 */
function generateStrongPassword(length = 16): string {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghijkmnopqrstuvwxyz";
  const digits = "23456789";
  const symbols = "!@#$%^&*()-_=+";
  const all = upper + lower + digits + symbols;

  const pick = (chars: string) => chars[crypto.randomInt(chars.length)];

  // Guarantee at least one of each required character class.
  const required = [pick(upper), pick(lower), pick(digits), pick(symbols)];
  const rest = Array.from({ length: Math.max(length - required.length, 0) }, () =>
    pick(all)
  );

  const passwordChars = [...required, ...rest];

  // Fisher-Yates shuffle using the CSPRNG so the required chars aren't
  // always in the same first-four positions.
  for (let i = passwordChars.length - 1; i > 0; i--) {
    const j = crypto.randomInt(i + 1);
    [passwordChars[i], passwordChars[j]] = [passwordChars[j], passwordChars[i]];
  }

  return passwordChars.join("");
}

async function runSeeder() {
  console.log("🚀 Starting secure HOD password generation and seeding process...");

  try {
    const allDepartments = await db.select().from(departments);

    if (allDepartments.length === 0) {
      console.log("⚠️ No departments found in the database.");
      return;
    }

    const saltRounds = 10;
    const outputLines: string[] = [
      "HOD CREDENTIALS — generated " + new Date().toISOString(),
      "DO NOT COMMIT THIS FILE. Distribute securely, then delete it.",
      "=".repeat(60),
      "",
    ];

    for (const dept of allDepartments) {
      const plainTextPassword = generateStrongPassword(16);

      console.log(`Processing "${dept.name}" (${dept.slug}) -> generated a new strong password`);

      const hashedPassword = await bcrypt.hash(plainTextPassword, saltRounds);

      await db
        .update(departments)
        .set({ hod_password: hashedPassword })
        .where(eq(departments.id, dept.id));

      outputLines.push(`${dept.name} (${dept.slug})`);
      outputLines.push(`  URL:      /departments/${dept.slug}`);
      outputLines.push(`  Password: ${plainTextPassword}`);
      outputLines.push("");

      console.log(`✅ Secure hash written to DB for [${dept.name}].`);
    }

    const outputPath = path.join(process.cwd(), "hod-credentials-OUTPUT-DO-NOT-COMMIT.txt");
    fs.writeFileSync(outputPath, outputLines.join("\n"), "utf-8");

    console.log("\n✨ Database updated successfully with bcrypt hashes!");
    console.log(`📄 Plaintext credentials written once to: ${outputPath}`);
    console.log("   -> Copy these into your password manager or send them securely to each HOD.");
    console.log("   -> Then DELETE that file. Make sure it's in .gitignore before you forget.");
  } catch (error) {
    console.error("❌ Seeding process error:", error);
  }
}

runSeeder().catch(console.error);