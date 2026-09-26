import "dotenv/config";
import { db } from "../src/db";
import { departments, faculty } from "../src/db/schema";
import { eq, sql } from "drizzle-orm";

async function main() {
  console.log("🔄 Starting HOD and Faculty Database Sync...");

  // 1. Fetch all departments
  const allDepts = await db.select().from(departments);
  const deptMap: Record<string, typeof allDepts[0]> = {};
  for (const d of allDepts) {
    deptMap[d.slug.toLowerCase()] = d;
  }

  // 2. Update Department HODs
  const hodUpdates: Record<string, { hod: string; hod_photo: string }> = {
    mech: {
      hod: "Dr. K. Srinivasa Prasad",
      hod_photo: "/images/faculty/mech/dr-k-srinivasa-prasad.jpg",
    },
    met: {
      hod: "Dr. K. Srinivasa Prasad",
      hod_photo: "/images/faculty/mech/dr-k-srinivasa-prasad.jpg",
    },
    ece: {
      hod: "Dr. G. Appala Naidu",
      hod_photo: "/images/faculty/ece/dr-g-appala-naidu.jpg",
    },
    civil: {
      hod: "Dr. G. Appala Naidu",
      hod_photo: "/images/faculty/ece/dr-g-appala-naidu.jpg",
    },
  };

  for (const [slug, data] of Object.entries(hodUpdates)) {
    const dept = deptMap[slug];
    if (dept) {
      await db
        .update(departments)
        .set({
          hod: data.hod,
          hod_photo: data.hod_photo,
        })
        .where(eq(departments.id, dept.id));
      console.log(`✓ Updated department ${slug.toUpperCase()} HOD to "${data.hod}"`);
    } else {
      console.log(`⚠️ Department ${slug} not found in DB`);
    }
  }

  // 3. Update / Insert Faculty in MECH
  if (deptMap.mech) {
    const mechFaculty = await db.select().from(faculty).where(eq(faculty.dept_id, deptMap.mech.id));
    const kSrinivas = mechFaculty.find(f => /srinivasa prasad/i.test(f.name));
    if (kSrinivas) {
      await db
        .update(faculty)
        .set({
          name: "Dr. K. Srinivasa Prasad",
          designation: "Assistant Professor & HOD",
          photo_url: "/images/faculty/mech/dr-k-srinivasa-prasad.jpg",
        })
        .where(eq(faculty.id, kSrinivas.id));
      console.log(`✓ Updated Dr. K. Srinivasa Prasad as HOD in MECH`);
    } else {
      await db.insert(faculty).values({
        dept_id: deptMap.mech.id,
        name: "Dr. K. Srinivasa Prasad",
        designation: "Assistant Professor & HOD",
        photo_url: "/images/faculty/mech/dr-k-srinivasa-prasad.jpg",
      });
      console.log(`✓ Inserted Dr. K. Srinivasa Prasad into MECH`);
    }

    const swamiNaidu = mechFaculty.find(f => /swami naidu/i.test(f.name));
    if (swamiNaidu) {
      await db
        .update(faculty)
        .set({
          designation: "Professor",
        })
        .where(eq(faculty.id, swamiNaidu.id));
      console.log(`✓ Updated Dr. G. Swami Naidu as Professor in MECH`);
    }
  }

  // 4. Update / Insert Faculty in MET (Dr. K. Srinivasa Prasad as HOD)
  if (deptMap.met) {
    const metFaculty = await db.select().from(faculty).where(eq(faculty.dept_id, deptMap.met.id));
    const kSrinivasMet = metFaculty.find(f => /srinivasa prasad/i.test(f.name));
    if (kSrinivasMet) {
      await db
        .update(faculty)
        .set({
          name: "Dr. K. Srinivasa Prasad",
          designation: "Assistant Professor & HOD",
          photo_url: "/images/faculty/mech/dr-k-srinivasa-prasad.jpg",
        })
        .where(eq(faculty.id, kSrinivasMet.id));
      console.log(`✓ Updated Dr. K. Srinivasa Prasad in MET`);
    } else {
      await db.insert(faculty).values({
        dept_id: deptMap.met.id,
        name: "Dr. K. Srinivasa Prasad",
        designation: "Assistant Professor & HOD",
        photo_url: "/images/faculty/mech/dr-k-srinivasa-prasad.jpg",
      });
      console.log(`✓ Inserted Dr. K. Srinivasa Prasad as HOD into MET`);
    }

    // Remove any accidental HOD designation from others in MET
    const otherHods = metFaculty.filter(f => /hod|head/i.test(f.designation || "") && !/srinivasa prasad/i.test(f.name));
    for (const f of otherHods) {
      await db
        .update(faculty)
        .set({
          designation: "Professor",
        })
        .where(eq(faculty.id, f.id));
      console.log(`✓ Cleaned previous HOD designation for ${f.name} in MET`);
    }
  }

  // 5. Update / Insert Faculty in ECE (Dr. G. Appala Naidu as HOD)
  if (deptMap.ece) {
    const eceFaculty = await db.select().from(faculty).where(eq(faculty.dept_id, deptMap.ece.id));
    const appalaNaidu = eceFaculty.find(f => /appala\s*naidu/i.test(f.name));
    if (appalaNaidu) {
      await db
        .update(faculty)
        .set({
          name: "Dr. G. Appala Naidu",
          designation: "Assistant Professor & HOD",
          photo_url: "/images/faculty/ece/dr-g-appala-naidu.jpg",
        })
        .where(eq(faculty.id, appalaNaidu.id));
      console.log(`✓ Updated Dr. G. Appala Naidu in ECE`);
    } else {
      await db.insert(faculty).values({
        dept_id: deptMap.ece.id,
        name: "Dr. G. Appala Naidu",
        designation: "Assistant Professor & HOD",
        photo_url: "/images/faculty/ece/dr-g-appala-naidu.jpg",
      });
      console.log(`✓ Inserted Dr. G. Appala Naidu into ECE`);
    }
  }

  // 6. Update / Insert Faculty in CIVIL (Dr. G. Appala Naidu as HOD and update photos)
  if (deptMap.civil) {
    const civilFaculty = await db.select().from(faculty).where(eq(faculty.dept_id, deptMap.civil.id));
    const appalaNaiduCivil = civilFaculty.find(f => /appala\s*naidu/i.test(f.name));
    if (appalaNaiduCivil) {
      await db
        .update(faculty)
        .set({
          name: "Dr. G. Appala Naidu",
          designation: "Assistant Professor & HOD",
          photo_url: "/images/faculty/ece/dr-g-appala-naidu.jpg",
        })
        .where(eq(faculty.id, appalaNaiduCivil.id));
      console.log(`✓ Updated Dr. G. Appala Naidu in CIVIL`);
    } else {
      await db.insert(faculty).values({
        dept_id: deptMap.civil.id,
        name: "Dr. G. Appala Naidu",
        designation: "Assistant Professor & HOD",
        photo_url: "/images/faculty/ece/dr-g-appala-naidu.jpg",
      });
      console.log(`✓ Inserted Dr. G. Appala Naidu as HOD into CIVIL`);
    }

    // Update civil contract faculty photos
    const civilPhotoMap: Record<string, string> = {
      "jagan mohan": "/images/faculty/civil/CIVIL-1-D.-Jagan-Mohan.jpg",
      "balamurali": "/images/faculty/civil/CIVIL-2-R.-Balamurali-krishna.jpg",
      "giridhar": "/images/faculty/civil/CIVIL-4-Ch.Giridhar-Kumar.jpg",
      "phanindra": "/images/faculty/civil/CIVIL-5-T.S.D.Phanindranath.jpg",
    };

    for (const f of civilFaculty) {
      for (const [key, photo] of Object.entries(civilPhotoMap)) {
        if (new RegExp(key, "i").test(f.name)) {
          await db.update(faculty).set({ photo_url: photo }).where(eq(faculty.id, f.id));
          console.log(`✓ Updated photo for Civil faculty: ${f.name} -> ${photo}`);
        }
      }
    }
  }

  console.log("✨ All HOD and Faculty updates synced successfully!");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Error syncing HODs and faculty:", err);
  process.exit(1);
});
