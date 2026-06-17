import "dotenv/config";
import { db } from "./src/db";
import { sql } from "drizzle-orm";

async function main() {
  await db.execute(sql`
    INSERT INTO "academic_regulations" (title, category, size, date, pdf_url, link)
    VALUES 
    ('B.Tech R23 Regulations', 'R23', '2.4 MB', '2023', 'https://jntugvcev.edu.in/wp-content/uploads/r23-regulations.pdf', 'https://jntugvcev.edu.in/wp-content/uploads/r23-regulations.pdf'),
    ('B.Tech R20 Regulations', 'R20', '1.8 MB', '2020', 'https://jntugvcev.edu.in/wp-content/uploads/r20-regulations.pdf', 'https://jntugvcev.edu.in/wp-content/uploads/r20-regulations.pdf'),
    ('M.Tech R25 Regulations', 'R25', '2.1 MB', '2025', 'https://jntugvcev.edu.in/wp-content/uploads/r25-regulations.pdf', 'https://jntugvcev.edu.in/wp-content/uploads/r25-regulations.pdf')
  `);
  console.log("Regulations inserted!");
  process.exit(0);
}
main();
