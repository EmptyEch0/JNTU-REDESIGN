import "dotenv/config";
import postgres from "postgres";

const defaultNotifications = [
  {
    source: "calendar",
    label: "Calendar",
    text: "Commencement of Class Work — B.Tech II, III & IV Year Odd Semester begins",
    date: "15 Jun, 2026",
    to: "/academics/academic-calendar",
    urgent: false,
  },
  {
    source: "calendar",
    label: "Calendar",
    text: "I Mid Examinations — First mid-term examinations commence across all branches",
    date: "12 Aug, 2026",
    to: "/academics/academic-calendar",
    urgent: false,
  },
  {
    source: "calendar",
    label: "Calendar",
    text: "II Mid Examinations — Second mid-term examinations commence",
    date: "05 Oct, 2026",
    to: "/academics/academic-calendar",
    urgent: false,
  },
  {
    source: "calendar",
    label: "Calendar",
    text: "Preparation & Practicals — Lab exams and preparation holidays begin",
    date: "20 Oct, 2026",
    to: "/academics/academic-calendar",
    urgent: false,
  },
  {
    source: "calendar",
    label: "Calendar",
    text: "End Semester Examinations — Final theory examinations commence",
    date: "02 Nov, 2026",
    to: "/academics/academic-calendar",
    urgent: false,
  },
  {
    source: "calendar",
    label: "Calendar",
    text: "Semester Break — Winter break for all students begins",
    date: "25 Nov, 2026",
    to: "/academics/academic-calendar",
    urgent: false,
  },
  {
    source: "results",
    label: "Results",
    text: "Results Declared — B.Tech II Year II Sem Regular Examinations (April 2026)",
    date: "April 2026",
    to: "/academics/examination",
    urgent: true,
  },
  {
    source: "results",
    label: "Results",
    text: "Evaluation in Progress — M.Tech I Year II Sem Regular Examinations (May 2026)",
    date: "May 2026",
    to: "/academics/examination",
    urgent: false,
  },
  {
    source: "hall-ticket",
    label: "Hall Ticket",
    text: "Hall Tickets Available — B.Tech End Semester Examinations (Nov 2026) — Download Now",
    date: "Available Now",
    to: "/academics/examination",
    urgent: true,
  },
  {
    source: "hall-ticket",
    label: "Hall Ticket",
    text: "Hall Tickets to be Released — B.Tech III Year I Sem Supply Examinations (June 2026)",
    date: "June 2026",
    to: "/academics/examination",
    urgent: false,
  },
  {
    source: "fee",
    label: "Fee",
    text: "Exam Fee Payment Without Late Fee — Last date for Supply Examinations",
    date: "15 Oct, 2026",
    to: "/academics/examination",
    urgent: false,
  },
  {
    source: "fee",
    label: "Fee",
    text: "Exam Fee With Late Fee ₹100 — Last date for Supply Examinations registration",
    date: "20 Oct, 2026",
    to: "/academics/examination",
    urgent: false,
  },
  {
    source: "fee",
    label: "Fee",
    text: "Final Exam Fee With Late Fee ₹1000 — Closing date for Supply Examinations",
    date: "25 Oct, 2026",
    to: "/academics/examination",
    urgent: false,
  },
];

async function main() {
  // Manual load of .env in case process.env.DATABASE_URL is not populated
  if (!process.env.DATABASE_URL) {
    try {
      const fs = await import("fs");
      const path = await import("path");
      const envPath = path.resolve(process.cwd(), ".env");
      if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, "utf-8");
        const match = envContent.match(/DATABASE_URL=['"]?([^'"\n\r]+)['"]?/);
        if (match && match[1]) {
          process.env.DATABASE_URL = match[1].trim();
          console.log("Loaded DATABASE_URL successfully from local .env");
        }
      }
    } catch (err) {
      console.error("Failed to parse .env file:", err);
    }
  }

  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set");
    return;
  }
  const sql = postgres(process.env.DATABASE_URL);


  try {
    console.log("🔨 Creating ticker_notifications table manually if it does not exist...");
    await sql`
      CREATE TABLE IF NOT EXISTS "ticker_notifications" (
        "id" serial PRIMARY KEY NOT NULL,
        "source" text NOT NULL,
        "label" text NOT NULL,
        "text" text NOT NULL,
        "date" text NOT NULL,
        "to" text NOT NULL,
        "urgent" boolean DEFAULT false NOT NULL,
        "created_at" timestamp DEFAULT now()
      );
    `;

    console.log("🧹 Clearing old ticker_notifications to avoid duplicates...");
    await sql`DELETE FROM "ticker_notifications"`;

    console.log("🌱 Seeding ticker_notifications...");
    for (const notif of defaultNotifications) {
      await sql`
        INSERT INTO "ticker_notifications" ("source", "label", "text", "date", "to", "urgent")
        VALUES (${notif.source}, ${notif.label}, ${notif.text}, ${notif.date}, ${notif.to}, ${notif.urgent})
      `;
    }

    console.log("✅ Seeding completed.");
  } catch (err) {
    console.error("❌ Seeding failed:", err);
  } finally {
    await sql.end();
  }
}

main();
