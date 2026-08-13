import "dotenv/config";
import postgres from "postgres";

async function seedPlacementGallery() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL missing");
    process.exit(1);
  }
  const sql = postgres(process.env.DATABASE_URL);

  const PLACEMENT_IMAGES = [
    { src: "uploads/photo-gallery/IMG_6920.JPG", caption: "Campus Placement Interactive Session & Pre-Placement Talk" },
    { src: "uploads/photo-gallery/IMG_6926.JPG", caption: "Auditorium Briefing for MNC Recruitment Drives" },
    { src: "uploads/photo-gallery/IMG_6927.JPG", caption: "Recruitment Drive & Technical Interview Panel" },
    { src: "uploads/photo-gallery/IMG_6943.JPG", caption: "Aptitude and Soft Skills Finishing School Training" },
    { src: "uploads/photo-gallery/IMG_6946.JPG", caption: "Offer Letter Felicitation & Student Success Celebrations" },
    { src: "uploads/photo-gallery/IMG_6950.JPG", caption: "Corporate HR Delegation Campus Visit & Interaction" },
    { src: "uploads/photo-gallery/IMG_6868.JPG", caption: "Industry Expert Career Guidance Keynote Session" },
    { src: "uploads/photo-gallery/IMG_6872.JPG", caption: "Industry-Academia Collaborative Training Symposium" },
    { src: "uploads/photo-gallery/IMG_6875.JPG", caption: "Annual Training & Placement Orientation Program" },
  ];

  try {
    const existing = await sql`SELECT count(*) FROM placement_gallery`;
    if (parseInt(existing[0].count) === 0) {
      for (const item of PLACEMENT_IMAGES) {
        await sql`INSERT INTO placement_gallery (src, caption) VALUES (${item.src}, ${item.caption})`;
      }
      console.log("✅ Seeded placement_gallery with 9 records");
    } else {
      console.log(`ℹ️ placement_gallery already has ${existing[0].count} records`);
    }
  } catch (err) {
    console.error("Error seeding placement gallery:", err);
  } finally {
    await sql.end();
  }
}

seedPlacementGallery();
