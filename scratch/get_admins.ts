import { db } from "../src/db";
import { admins } from "../src/db/schema";

async function main() {
  const allAdmins = await db.select().from(admins);
  console.log("Admins:", JSON.stringify(allAdmins, null, 2));
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
