import "dotenv/config";
import { db } from "../src/db/index";
import { leadership } from "../src/db/schema";
import { eq } from "drizzle-orm";

async function main() {
  console.log("🚀 Seeding Vice Principal's data...");

  const data = {
    slug: "vice-principal",
    name: "Prof. G. J. Naga Raju",
    designation: "Professor of Physics & Vice Principal (i/c)",
    image: "https://via.placeholder.com/800x1000?text=Vice+Principal", // Placeholder for now
    email: "viceprincipal@jntugvcev.edu.in",
    quote: "Dedicated to fostering academic excellence and scientific inquiry at JNTU-GV.",
    message: "Prof. G. J. Naga Raju is presently working as Professor in the Department of Physics, JNTU-GV, CEV, Vizianagaram. He brings extensive experience in academic administration and scientific research to the office of the Vice Principal.",
    profile: `Prof. G. J. Naga Raju
Ph.D

Professor of Physics & Vice Principal (i/c)

JNTU-GV,CEV,Vizianagaram

Prof. G. J. Naga Raju is presently working as Professor in the Department of Physics, JNTU-GV, CEV, Vizianagaram.

Contact:
Official Email: viceprincipal@jntugvcev.edu.in`,
  };

  const existing = await db.select().from(leadership).where(eq(leadership.slug, data.slug)).limit(1);

  if (existing.length > 0) {
    await db.update(leadership).set(data).where(eq(leadership.slug, data.slug));
    console.log("✅ Vice Principal data updated.");
  } else {
    await db.insert(leadership).values(data);
    console.log("✅ Vice Principal data inserted.");
  }

  process.exit(0);
}

main().catch(console.error);
