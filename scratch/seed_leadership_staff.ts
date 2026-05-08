import "dotenv/config";
import { db } from "../src/db/index";
import { leadershipStaff } from "../src/db/schema";
import { eq } from "drizzle-orm";

async function main() {
  console.log("🚀 Seeding Principal's office staff...");

  const slug = "principal";
  
  // Clear existing staff for this slug to avoid duplicates
  await db.delete(leadershipStaff).where(eq(leadershipStaff.leadershipSlug, slug));

  const staff = [
    { name: "Sri. M. Umamaheswara Rao", role: "SUPERENDENT", section: "Principal's Office" },
    { name: "Mr. M. S. Raju", role: "PA to Principal", section: "Administration" },
    { name: "Mr. G. Narayana Rao", role: "JR.ASST (A1)", section: "Academic" },
    { name: "Mr. M. Pydi Raju", role: "Accounts section (A2)", section: "Accounts" },
    { name: "Mrs. K. Ramanamma", role: "Accounts section (A3)", section: "Accounts" },
    { name: "Mr. Ch. Srinivasa Rao", role: "Establishment (E1)", section: "Establishment" },
    { name: "Mr. V. Rama Krishna", role: "Establishment (E2)", section: "Establishment" },
    { name: "Mr. R. Sridhar Naidu", role: "Staff (S1)", section: "Support" },
    { name: "Mr. T. Prasad", role: "Store keeper", section: "Store" },
    { name: "Mr. P. Manohar", role: "Driver", section: "Transport" },
  ];

  for (const s of staff) {
    await db.insert(leadershipStaff).values({
      leadershipSlug: slug,
      name: s.name,
      role: s.role,
      section: s.section,
    });
  }

  console.log("✅ Principal's office staff seeded.");
  process.exit(0);
}

main().catch(console.error);
