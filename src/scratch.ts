import { db } from "./db";
import { engContent, engMeta, engStaff } from "./db/schema";

async function run() {
  try {
    const content = await db.select().from(engContent);
    const meta = await db.select().from(engMeta);
    const staff = await db.select().from(engStaff);
    console.log("ENGINEERING CELL DATA:", JSON.stringify({ content, meta, staff }, null, 2));
  } catch (err) {
    console.error("CRASH ERROR:", err);
  }
  process.exit(0);
}
run();
