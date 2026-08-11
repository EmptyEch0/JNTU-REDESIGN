import dotenv from "dotenv";
dotenv.config();

async function main() {
  try {
    console.log("Connecting to database using URL:", process.env.DATABASE_URL?.substring(0, 45) + "...");
    const { db } = await import("../src/db/index");
    const { departments } = await import("../src/db/schema");
    const start = Date.now();
    const result = await db.select().from(departments).limit(1);
    console.log(`Successfully connected! Found departments:`, result);
  } catch (err) {
    console.error("Database connection failed:", err);
  }
}

main();
