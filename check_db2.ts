import { db } from "./src/db";
import { hostelContent, libraryContent, dispensaryContent, sportsContent } from "./src/db/schema";

async function main() {
  const hContent = await db.select().from(hostelContent);
  console.log("Hostel Officer Image:", hContent.map(c => c.officerImage));
  const lContent = await db.select().from(libraryContent);
  console.log("Library Officer Image:", lContent.map(c => c.img));
  const dContent = await db.select().from(dispensaryContent);
  console.log("Dispensary Officer Image:", dContent.map(c => c.img));
  const sContent = await db.select().from(sportsContent);
  console.log("Sports Officer Image:", sContent.map(c => c.img));
}

main().catch(console.error).then(() => process.exit(0));
