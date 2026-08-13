import "dotenv/config";
import postgres from "postgres";

async function seedWeAndNssGalleries() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL missing");
    process.exit(1);
  }
  const sql = postgres(process.env.DATABASE_URL);

  const WE_IMAGES = [
    { title: "Women Empowerment Activity 1", imageUrl: "uploads/2020/08/IMG-20191216-WA0038.jpg" },
    { title: "Campus Program", imageUrl: "uploads/2020/08/DSCN0609-scaled.jpg" },
    { title: "Women Empowerment Awareness Session", imageUrl: "uploads/2020/08/WhatsApp-Image-2020-08-28-at-11.25.46-AM.jpeg" },
    { title: "Empowerment Workshop", imageUrl: "uploads/2020/08/DSCN0825-scaled.jpg" },
    { title: "Special Gathering", imageUrl: "uploads/2020/08/12.jpg" },
    { title: "Community Interactive Session", imageUrl: "uploads/2020/08/DSCN0648-scaled.jpg" },
    { title: "Campus Leadership Event", imageUrl: "uploads/2020/08/DSCN0649-scaled.jpg" },
    { title: "Empowerment Cell Meeting", imageUrl: "uploads/2020/08/WhatsApp-Image-2020-08-28-at-11.09.16-AM-3.jpeg" },
    { title: "Student Awareness Drive", imageUrl: "uploads/2020/08/WhatsApp-Image-2020-08-28-at-11.27.17-AM.jpeg" },
    { title: "Annual WE&GC Meet", imageUrl: "uploads/2020/08/DSC02794-scaled.jpg" },
  ];

  const NSS_IMAGES = [
    { title: "NSS Youth Camp Activity", imageUrl: "uploads/2021/01/WhatsApp-Image-2021-01-11-at-15.48.17-1.jpeg" },
    { title: "NSS Community Service Drive", imageUrl: "uploads/2021/01/WhatsApp-Image-2021-01-11-at-16.42.54-1.jpeg" },
    { title: "3-Day Special Camp Activity", imageUrl: "uploads/2020/08/3-day-10-scaled.jpg" },
    { title: "Volunteers Community Program", imageUrl: "uploads/2020/08/3-day-17-scaled.jpg" },
    { title: "Cancer Awareness Day Drive 1", imageUrl: "uploads/2020/08/cancer-day1-scaled.jpg" },
    { title: "Cancer Awareness Rally", imageUrl: "uploads/2020/08/cancerday-2.jpg" },
    { title: "Cancer Awareness Session", imageUrl: "uploads/2020/08/cancer-day-3-scaled.jpg" },
    { title: "Cancer Day Health Camp", imageUrl: "uploads/2020/08/cancer-day4.jpg" },
    { title: "3-Day Special Service Event", imageUrl: "uploads/2020/08/3-day-9-scaled.jpg" },
  ];

  try {
    // Clean and insert WE gallery
    await sql`DELETE FROM we_gallery`;
    for (const img of WE_IMAGES) {
      await sql`INSERT INTO we_gallery (title, image_url) VALUES (${img.title}, ${img.imageUrl})`;
    }
    console.log("✅ Seeded WE Gallery with 10 images");

    // Clean and insert NSS gallery
    await sql`DELETE FROM nss_gallery`;
    for (const img of NSS_IMAGES) {
      await sql`INSERT INTO nss_gallery (title, image_url) VALUES (${img.title}, ${img.imageUrl})`;
    }
    console.log("✅ Seeded NSS Gallery with 9 images");

  } catch (err) {
    console.error("Error seeding galleries:", err);
  } finally {
    await sql.end();
  }
}

seedWeAndNssGalleries();
