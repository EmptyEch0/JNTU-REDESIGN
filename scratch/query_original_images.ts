import { db } from "../src/db";
import { 
  hostelImages, 
  dispensaryImages, 
  libraryImages, 
  sportsImages, 
  placementGallery,
  rdMous
} from "../src/db/schema";

async function main() {
  try {
    const hImg = await db.select().from(hostelImages);
    const dImg = await db.select().from(dispensaryImages);
    const lImg = await db.select().from(libraryImages);
    const sImg = await db.select().from(sportsImages);
    const pImg = await db.select().from(placementGallery);
    const rMous = await db.select().from(rdMous);
    
    console.log("=== ORIGINAL IMAGES IN DB ===");
    console.log("Hostel Images:", hImg.map(i => i.url));
    console.log("Dispensary Images:", dImg.map(i => i.url));
    console.log("Library Images:", lImg.map(i => i.url));
    console.log("Sports Images:", sImg.map(i => i.url));
    console.log("Placement Gallery Images:", pImg.map(i => i.src));
    console.log("RD Mous Images:", rMous.map(i => i.img));
  } catch (err) {
    console.error("DB Query failed:", err);
  }
}

main().catch(console.error).then(() => process.exit(0));
