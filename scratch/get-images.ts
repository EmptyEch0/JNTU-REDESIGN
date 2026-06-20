import { config } from "dotenv";
config({ path: ".env" });
import { db } from "../src/db/index";
import { tpo, placementGallery } from "../src/db/schema";

async function main() {
  const tpoData = await db.select().from(tpo);
  const gallery = await db.select().from(placementGallery);
  
  console.log("=== TPO IMAGES ===");
  tpoData.forEach(t => console.log(t.name, "-", t.image));
  
  console.log("=== GALLERY IMAGES ===");
  gallery.forEach(g => console.log(g.src));
  
  process.exit(0);
}

main().catch(console.error);
