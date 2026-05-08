import "dotenv/config";
import { db } from "../src/db/index";
import { leadership } from "../src/db/schema";
import { eq } from "drizzle-orm";

async function main() {
  console.log("🖼️ Updating official leadership images...");

  // Principal Update
  await db.update(leadership)
    .set({ image: "https://jntugvcev.edu.in/wp-content/uploads/2026/03/Prof.-K-C-B-Rao-Principal-1-1006x1024.jpeg" })
    .where(eq(leadership.slug, "principal"));
  console.log("✅ Principal image updated.");

  // Vice Principal Update
  await db.update(leadership)
    .set({ image: "https://jntugvcev.edu.in/wp-content/uploads/2016/12/Dr-G-J-NAGA-RAJU-latest.jpg" })
    .where(eq(leadership.slug, "vice-principal"));
  console.log("✅ Vice Principal image updated.");

  process.exit(0);
}

main().catch(console.error);
