import { db } from "../src/db";
import { hostelContent, libraryContent, dispensaryContent, sportsContent } from "../src/db/schema";

async function main() {
  try {
    const h = await db.select().from(hostelContent);
    const l = await db.select().from(libraryContent);
    const d = await db.select().from(dispensaryContent);
    const s = await db.select().from(sportsContent);
    
    console.log("=== DB FACILITIES IMAGES ===");
    console.log("Hostel content:", JSON.stringify(h, null, 2));
    console.log("Library content:", JSON.stringify(l, null, 2));
    console.log("Dispensary content:", JSON.stringify(d, null, 2));
    console.log("Sports content:", JSON.stringify(s, null, 2));
  } catch (err) {
    console.error("DB Query failed:", err);
  }
}

main().catch(console.error).then(() => process.exit(0));
