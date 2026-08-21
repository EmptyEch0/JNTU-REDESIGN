import "dotenv/config";
import { db } from "./index";
import { faculty } from "./schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

// EDIT the email for each entry below before running.
// plainPassword can be the same shared default, or unique per person.
const FACULTY_CREDENTIALS: { facultyId: number; email: string; plainPassword: string }[] = [
  { facultyId: 1, email: "aruna.kumari@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 2, email: "rajya.lakshmi@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 3, email: "rajeswara.rao@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 4, email: "asn.chakravarthy@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 5, email: "venkatesh.n@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 6, email: "sivarama.krishna@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 7, email: "surekha.s@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 8, email: "radha.krishna@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 9, email: "sivaram.rolangi@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 10, email: "amardeep.yerra@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 11, email: "ashok.suragala@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 12, email: "narayanarao.v@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 13, email: "laxmi.prasad@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 14, email: "geetha.madhuri@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 28, email: "vs.vakula@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 29, email: "g.saraswathi@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 30, email: "siva.kumar.p@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 31, email: "ys.kishore.babu@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 32, email: "a.padmaja@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 33, email: "siva.sankar.naik@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 34, email: "sreenivasula.reddy@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 35, email: "t.sirisha@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 36, email: "y.chittemma@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 37, email: "ch.venkata.ramana@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 38, email: "p.pavan.kumar@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 39, email: "siva.kumar.p2@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 40, email: "vsd.manohar.sahu@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 41, email: "s.rajitha@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 42, email: "tsn.murthy@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 43, email: "k.babulu@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 44, email: "ch.srinivasa.rao@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 45, email: "n.balaji@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 46, email: "kv.satyanarayana@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 47, email: "ravva.gurunadha@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 48, email: "gottapu.appala.naidu@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 49, email: "nalini.bodasingi@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 50, email: "a.gangadhar@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 51, email: "m.hema@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 52, email: "m.china.raju@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 53, email: "k.veerraju@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 54, email: "j.sateesh@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 55, email: "g.ravi.kumar@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 56, email: "v.vijaya.santhi@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 57, email: "m.krishna.priya@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 58, email: "k.anusha.yadav@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 59, email: "kolli.venkata.naidu@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 60, email: "arnuri.srinivasulu@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 61, email: "shaik.karimulla@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 62, email: "bula.ratna.kumar@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 63, email: "shaik.naseema@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 64, email: "banothu.chenna.kesava@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 65, email: "k.srinivasa.prasad@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 66, email: "g.swami.naidu@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 67, email: "n.mohan.rao@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 68, email: "v.mani.kumar@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 69, email: "c.neelima.devi@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 70, email: "t.lakshmana.kishore@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 71, email: "i.sri.phani.sushma@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 72, email: "davala.rajesh@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 73, email: "mallela.komaleswara.rao@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 74, email: "abdul.khurshid@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 75, email: "l.krishna.chaitanya@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 76, email: "avs.gowtham@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 77, email: "shaik.kalesha.vali@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 78, email: "k.shobhan.babu@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 79, email: "av.papa.rao@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 80, email: "v.krishna.aneela@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 81, email: "v.santosh.kumar@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 82, email: "gj.naga.raju@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 83, email: "kotla.swathi@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 84, email: "swapna.dusi@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 85, email: "m.sowbhagya.lakshmi@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 86, email: "b.dharma.rao@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 87, email: "j.sucharitha@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 88, email: "r.santha.rao@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 89, email: "n.suresh.kumar@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 90, email: "bonthula.sridurga@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 91, email: "p.sree.devi@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 92, email: "potula.laxmana.sunand@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 179, email: "tirimula.rao.benala@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 180, email: "g.jaya.suma@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 181, email: "ch.bindu.madhuri@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 182, email: "g.madhavi@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 183, email: "w.anil@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 184, email: "rss.jyothi@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 185, email: "eswar.patnaala@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 186, email: "kolli.srikanth@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 187, email: "rajeti.roje.spandana@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 188, email: "pynam.venkateswarlu@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 189, email: "madhumita.chanda@jntugv.edu.in", plainPassword: "Faculty@2026" },
  { facultyId: 190, email: "bobbadi.manasa@jntugv.edu.in", plainPassword: "Faculty@2026" },
];

async function seed() {
  console.log("🌱 Checking and seeding faculty credentials (only updating rows with missing email or password)...");

  let updatedCount = 0;
  let skippedCount = 0;
  let notFoundCount = 0;

  for (const cred of FACULTY_CREDENTIALS) {
    const [existing] = await db
      .select({
        id: faculty.id,
        name: faculty.name,
        faculty_email: faculty.faculty_email,
        faculty_password_hash: faculty.faculty_password_hash,
      })
      .from(faculty)
      .where(eq(faculty.id, cred.facultyId))
      .limit(1);

    if (!existing) {
      console.log(`⚠️  [NOT FOUND] Faculty ID ${cred.facultyId} (${cred.email}) does not exist in the database.`);
      notFoundCount++;
      continue;
    }

    const emailMissing = !existing.faculty_email || existing.faculty_email.trim() === "";
    const passwordMissing = !existing.faculty_password_hash || existing.faculty_password_hash.trim() === "";

    // If both email and password are already set with data, skip updating this row
    if (!emailMissing && !passwordMissing) {
      console.log(
        `⏭️  [SKIPPED] Faculty ID ${cred.facultyId} (${existing.name}): already has email "${existing.faculty_email}" and password hash.`
      );
      skippedCount++;
      continue;
    }

    const updateFields: { faculty_email?: string; faculty_password_hash?: string } = {};

    if (emailMissing) {
      updateFields.faculty_email = cred.email.toLowerCase().trim();
    }

    if (passwordMissing) {
      updateFields.faculty_password_hash = await bcrypt.hash(cred.plainPassword, 10);
    }

    await db
      .update(faculty)
      .set(updateFields)
      .where(eq(faculty.id, cred.facultyId));

    console.log(
      `✅ [UPDATED] Faculty ID ${cred.facultyId} (${existing.name}): set ${Object.keys(updateFields).join(", ")}.`
    );
    updatedCount++;
  }

  console.log("\n📊 Seeding summary:");
  console.log(`   - Updated:   ${updatedCount}`);
  console.log(`   - Skipped:   ${skippedCount}`);
  console.log(`   - Not Found: ${notFoundCount}`);
  console.log(`   - Total:     ${FACULTY_CREDENTIALS.length}`);

  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Error running faculty password seed:", err);
  process.exit(1);
});