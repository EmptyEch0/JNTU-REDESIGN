import "dotenv/config";
import { db } from "../src/db";
import { sportsContent, sportsImages } from "../src/db/schema";

async function run() {
  const content = await db.select().from(sportsContent);
  const imgs = await db.select().from(sportsImages);
  console.log("SPORTS CONTENT:", JSON.stringify(content, null, 2));
  console.log("SPORTS IMAGES:", JSON.stringify(imgs, null, 2));
}

run().catch(console.error);
