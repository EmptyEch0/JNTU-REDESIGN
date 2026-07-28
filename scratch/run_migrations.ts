import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db } from "../src/db/index";

async function main() {
  console.log("Running migrations...");
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("Migrations applied successfully!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Migrations failed:", err);
  process.exit(1);
});
