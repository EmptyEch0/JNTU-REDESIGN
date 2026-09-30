import "dotenv/config";
import "../src/lib/dns-setup";
import webpush from "web-push";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { notices, tickerNotifications, academicTimetables, academicsExamCell, pushSubscriptions } from "../src/db/schema";
import { eq } from "drizzle-orm";

async function main() {
  console.log("Starting M.Tech III Sem I Mid Timetable publication & push broadcast...");

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  // VAPID keys
  const publicKey = process.env.VAPID_PUBLIC_KEY || process.env.VITE_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT || "mailto:admin@jntugvcev.edu.in";

  if (publicKey && privateKey) {
    webpush.setVapidDetails(subject, publicKey, privateKey);
    console.log("✅ WebPush VAPID configured.");
  } else {
    console.warn("⚠️ VAPID keys missing in environment.");
  }

  // Connect to DB (trying ssl prefer/false/require with 15s timeout)
  const client = postgres(connectionString, {
    connect_timeout: 15,
    ssl: "prefer",
  });
  const db = drizzle(client);

  let subs: any[] = [];
  try {
    subs = await db.select().from(pushSubscriptions);
    console.log(`Found ${subs.length} push notification subscribers in database.`);
  } catch (err: any) {
    console.warn("Could not query push subscriptions from DB directly:", err.message);
  }

  // 1. Insert Notice into `notices`
  try {
    const existingNotices = await db.select().from(notices);
    const exists = existingNotices.some(
      (n) => (n.title || "").toLowerCase().includes("m.tech iii") || (n.url || "").includes("m-tech-iii-sem-i-mid")
    );
    if (!exists) {
      const inserted = await db.insert(notices).values({
        title: "Timetable for M.Tech III-Semester I-Mid Examinations, October-2026 (M.Tech 3rd Semester 1st Mid Timetable Released)",
        date: "30 Sep 2026",
        tag: "Exams",
        url: "/uploads/2026/10/m-tech-iii-sem-i-mid-time-table-oct-2026.pdf",
      }).returning({ id: notices.id });
      console.log("✅ Inserted notice into `notices` table. ID:", inserted[0]?.id);
    } else {
      console.log("Notice already exists in `notices` table.");
    }
  } catch (err: any) {
    console.warn("Notice DB insert skipped/failed:", err.message);
  }

  // 2. Insert into `tickerNotifications`
  try {
    const existingTickers = await db.select().from(tickerNotifications);
    const exists = existingTickers.some(
      (t) => (t.text || "").toLowerCase().includes("m.tech 3rd") || (t.to || "").includes("m-tech-iii-sem-i-mid")
    );
    if (!exists) {
      await db.insert(tickerNotifications).values({
        source: "timetable",
        label: "Timetable",
        text: "Timetable Released — M.Tech 3rd Semester 1st Mid Examinations (October 2026)",
        date: "Oct 2026",
        to: "/uploads/2026/10/m-tech-iii-sem-i-mid-time-table-oct-2026.pdf",
        urgent: true,
      });
      console.log("✅ Inserted ticker notification into `tickerNotifications` table.");
    } else {
      console.log("Ticker already exists in `tickerNotifications` table.");
    }
  } catch (err: any) {
    console.warn("Ticker DB insert skipped/failed:", err.message);
  }

  // 3. Insert into `academicTimetables`
  try {
    await db.insert(academicTimetables).values({
      level: "PG",
      program_name: "M.Tech",
      regulation: "R23",
      branch: "All Branches",
      academic_year: "2026-2027",
      semester: "Semester 3",
      subject_name: "M.Tech III-Semester I-Mid Examinations, October-2026",
      pdf_url: "/uploads/2026/10/m-tech-iii-sem-i-mid-time-table-oct-2026.pdf",
    });
    console.log("✅ Inserted timetable into `academicTimetables` table.");
  } catch (err: any) {
    console.warn("academicTimetables insert skipped/failed:", err.message);
  }

  // 4. Insert into `academicsExamCell`
  try {
    await db.insert(academicsExamCell).values({
      type: "notifications",
      title: "Timetable for M.Tech III-Semester I-Mid Examinations, October-2026 (M.Tech 3rd Semester 1st Mid Timetable Released)",
      description: "Official first mid-semester examination timetable for 3rd semester M.Tech candidates.",
      date: "Oct 2026",
      file_url: "/uploads/2026/10/m-tech-iii-sem-i-mid-time-table-oct-2026.pdf",
    });
    console.log("✅ Inserted into `academicsExamCell` table.");
  } catch (err: any) {
    console.warn("academicsExamCell insert skipped/failed:", err.message);
  }

  // 5. Broadcast Push Notification to all subscribers!
  if (publicKey && privateKey && subs.length > 0) {
    console.log(`📡 Sending push notification to ${subs.length} active subscribers...`);

    const jsonPayload = JSON.stringify({
      title: "📢 M.Tech 3rd Semester 1st Mid Timetable Released",
      body: "Timetable for M.Tech III-Semester I-Mid Examinations, October-2026 is now available. Tap to view schedule.",
      url: "/uploads/2026/10/m-tech-iii-sem-i-mid-time-table-oct-2026.pdf",
      tag: "mtech-3sem-1mid-oct2026",
      icon: "/logo-circle.png",
      badge: "/favicon.png",
    });

    let successCount = 0;
    let failCount = 0;
    const deadEndpoints: string[] = [];

    await Promise.all(
      subs.map(async (sub) => {
        try {
          await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: {
                p256dh: sub.p256dh,
                auth: sub.auth,
              },
            },
            jsonPayload,
            {
              TTL: 86400,
              urgency: "high",
            }
          );
          successCount++;
        } catch (err: any) {
          failCount++;
          if (err.statusCode === 410 || err.statusCode === 404) {
            deadEndpoints.push(sub.endpoint);
          }
        }
      })
    );

    console.log(`🎉 Broadcast finished! Sent: ${successCount}, Failed/Expired: ${failCount}`);

    // Clean up dead endpoints if any
    if (deadEndpoints.length > 0) {
      console.log(`Cleaning up ${deadEndpoints.length} expired endpoints...`);
      for (const ep of deadEndpoints) {
        try {
          await db.delete(pushSubscriptions).where(eq(pushSubscriptions.endpoint, ep));
        } catch {}
      }
    }
  }

  console.log("✨ All tasks completed successfully.");
  await client.end();
}

main().catch(console.error).then(() => process.exit(0));
