// Publishes the II-Semester (2026-27) academic calendars for II/III/IV B.Tech:
// calendar rows + notices + ticker, then a web-push broadcast.
// Usage: npx tsx scripts/publish-ii-sem-calendars.ts [--push]
import "dotenv/config";
import "../src/lib/dns-setup";
import webpush from "web-push";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import { academicCalendars, notices, tickerNotifications, pushSubscriptions } from "../src/db/schema";

const CALENDARS = [
  { year: "II", file: "ii-b-tech-ii-sem-academic-calendar-2026-27.pdf" },
  { year: "III", file: "iii-b-tech-ii-sem-academic-calendar-2026-27.pdf" },
  { year: "IV", file: "iv-b-tech-ii-sem-academic-calendar-2026-27.pdf" },
].map((c) => ({ ...c, url: `/uploads/2026/11/${c.file}` }));

const PAGE = "/academics/academic-calendar";

async function main() {
  const client = postgres(process.env.DATABASE_URL!, { connect_timeout: 15, ssl: "prefer" });
  const db = drizzle(client);

  for (const c of CALENDARS) {
    const [existing] = await db.select().from(academicCalendars).where(eq(academicCalendars.pdf_url, c.url));
    if (existing) {
      console.log(`skip (exists): ${c.year} B.Tech`);
      continue;
    }
    await db.insert(academicCalendars).values({
      level: "UG",
      program_name: `${c.year} B.Tech (II Sem Revised)`,
      regulation: "R23",
      academic_year: "2026-2027",
      calendar_type: "Academic Schedule",
      pdf_url: c.url,
    });
    await db.insert(notices).values({
      title: `Revised Academic Calendar for ${c.year} B.Tech II Semester (A.Y. 2026-27) Released.`,
      date: "November 21, 2026",
      tag: "Academic",
      url: c.url,
    });
    console.log(`inserted: ${c.year} B.Tech`);
  }

  const tickerText = "Academic Calendars Released — II, III & IV B.Tech II Semester (2026-27)";
  const [tick] = await db.select().from(tickerNotifications).where(eq(tickerNotifications.text, tickerText));
  if (!tick) {
    await db.insert(tickerNotifications).values({
      source: "academic", label: "Academics", text: tickerText, date: "November 21, 2026", to: PAGE, urgent: true,
    });
    console.log("inserted ticker");
  }

  if (process.argv.includes("--push")) {
    webpush.setVapidDetails(
      process.env.VAPID_SUBJECT || "mailto:admin@jntugvcev.edu.in",
      (process.env.VAPID_PUBLIC_KEY || process.env.VITE_VAPID_PUBLIC_KEY)!,
      process.env.VAPID_PRIVATE_KEY!,
    );
    const payload = JSON.stringify({
      title: "📅 II Semester Academic Calendars Released",
      body: "Revised academic calendars for II, III & IV B.Tech II Semester (2026-27) are now available. Tap to view.",
      url: PAGE,
      tag: "btech-ii-sem-calendar-2026-27",
      icon: "/logo-circle.png",
      badge: "/favicon.png",
    });
    const subs = await db.select().from(pushSubscriptions);
    let ok = 0, dead = 0, fail = 0;
    await Promise.all(subs.map(async (s) => {
      try {
        await webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, payload, { TTL: 86400, urgency: "high" });
        ok++;
      } catch (err: any) {
        if (err.statusCode === 410 || err.statusCode === 404) {
          dead++;
          await db.delete(pushSubscriptions).where(eq(pushSubscriptions.endpoint, s.endpoint));
        } else fail++;
      }
    }));
    console.log(`push: sent ${ok}/${subs.length}, expired removed ${dead}, failed ${fail}`);
  }

  await client.end();
}

main().catch((e) => { console.error(e); process.exit(1); });
