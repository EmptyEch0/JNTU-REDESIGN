import { db } from "./src/db";
import { hostelContent, libraryContent, dispensaryContent, sportsContent } from "./src/db/schema";
import { like } from "drizzle-orm";

async function main() {
  await db.update(libraryContent).set({ img: null }).where(like(libraryContent.img, '%wp-content%'));
  console.log("Cleared library officer images with wp-content");
  
  await db.update(hostelContent).set({ officerImage: null }).where(like(hostelContent.officerImage, '%wp-content%'));
  console.log("Cleared hostel officer images with wp-content");
  
  await db.update(dispensaryContent).set({ img: null }).where(like(dispensaryContent.img, '%wp-content%'));
  console.log("Cleared dispensary officer images with wp-content");
  
  await db.update(sportsContent).set({ img: '' }).where(like(sportsContent.img, '%wp-content%'));
  console.log("Cleared sports officer images with wp-content");
}

main().catch(console.error).then(() => process.exit(0));
