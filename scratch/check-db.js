import postgres from "postgres";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
let databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  try {
    const envPath = path.resolve(__dirname, "../.env");
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, "utf-8");
      const match = envContent.match(/DATABASE_URL=['"]?([^'"\n\r]+)['"]?/);
      if (match && match[1]) {
        databaseUrl = match[1].trim();
      }
    }
  } catch (err) {
    console.error("Failed to parse .env file:", err);
  }
}

if (!databaseUrl) {
  console.error("DATABASE_URL not found.");
  process.exit(1);
}

const missingR25Syllabus = [
  {
    level: "PG",
    program_name: "MBA",
    regulation: "R25",
    branch: "MBA",
    academic_year: "1st & 2nd Year",
    semester: "All Semesters",
    subject_name: "MBA R25 Course Structure & Syllabus",
    pdf_url: "/uploads/2025/11/MBA-R25-Course-Structure-Syllabus.pdf"
  },
  {
    level: "PG",
    program_name: "M.Tech",
    regulation: "R25",
    branch: "MECH",
    academic_year: "1st & 2nd Year",
    semester: "All Semesters",
    subject_name: "M.Tech Thermal Engineering (MECH) R25 Course Structure & Syllabus",
    pdf_url: "/uploads/2025/11/R25-MTech-Thermal-Engg_JNTU-GV-CEV-CS-Syllabus-1.pdf"
  },
  {
    level: "PG",
    program_name: "M.Tech",
    regulation: "R25",
    branch: "EEE",
    academic_year: "1st & 2nd Year",
    semester: "All Semesters",
    subject_name: "M.Tech Power Systems & Allied Courses (EEE) R25 Course Structure & Syllabus",
    pdf_url: "/uploads/2025/12/JNTUGV-R25-M.tech-Power-systems-Allied-courses-Course-structure-Syllabus-3-1.pdf"
  },
  {
    level: "PG",
    program_name: "M.Tech",
    regulation: "R25",
    branch: "ECE",
    academic_year: "1st & 2nd Year",
    semester: "All Semesters",
    subject_name: "M.Tech VLSI Design & Embedded Systems (ECE) R25 Syllabus",
    pdf_url: "/uploads/2025/12/R-25-M.-Tech-VLSID-ES-Syllabus.pdf"
  },
  {
    level: "PG",
    program_name: "M.Tech",
    regulation: "R25",
    branch: "M.Tech",
    academic_year: "1st & 2nd Year",
    semester: "All Semesters",
    subject_name: "M.Tech R25 Final Course Structure & Syllabus (General)",
    pdf_url: "/uploads/2025/10/M.Tech-R25-Final-Course-Structure-Syllabus.pdf"
  },
  // Also ensure R23 CSE and MECH are present
  {
    level: "UG",
    program_name: "B.Tech",
    regulation: "R23",
    branch: "CSE",
    academic_year: "1st to 4th Year",
    semester: "All Semesters",
    subject_name: "Computer Science & Engineering R23 Syllabus",
    pdf_url: "/uploads/2023/10/CSE-finalR23.pdf"
  },
  {
    level: "UG",
    program_name: "B.Tech",
    regulation: "R23",
    branch: "MECH",
    academic_year: "1st to 4th Year",
    semester: "All Semesters",
    subject_name: "Mechanical Engineering R23 Syllabus",
    pdf_url: "/uploads/2023/10/ME-finalR23.pdf"
  },
  // Also ensure R20 entries are present
  {
    level: "UG",
    program_name: "B.Tech",
    regulation: "R20",
    branch: "CSE",
    academic_year: "1st to 4th Year",
    semester: "All Semesters",
    subject_name: "Computer Science & Engineering R20 Syllabus",
    pdf_url: "/uploads/2021/04/R20-B.TECH-CSE-SYLLABUS.pdf"
  },
  {
    level: "UG",
    program_name: "B.Tech",
    regulation: "R20",
    branch: "ECE",
    academic_year: "1st to 4th Year",
    semester: "All Semesters",
    subject_name: "Electronics & Communication Engineering R20 Syllabus",
    pdf_url: "/uploads/2021/04/R20-B.TECH-ECE-SYLLABUS.pdf"
  },
  {
    level: "UG",
    program_name: "B.Tech",
    regulation: "R20",
    branch: "EEE",
    academic_year: "1st to 4th Year",
    semester: "All Semesters",
    subject_name: "Electrical & Electronics Engineering R20 Syllabus",
    pdf_url: "/uploads/2021/04/R20-B.TECH-EEE-SYLLABUS.pdf"
  },
  {
    level: "UG",
    program_name: "B.Tech",
    regulation: "R20",
    branch: "MECH",
    academic_year: "1st to 4th Year",
    semester: "All Semesters",
    subject_name: "Mechanical Engineering R20 Syllabus",
    pdf_url: "/uploads/2021/04/R20-B.TECH-ME-SYLLABUS.pdf"
  },
  {
    level: "UG",
    program_name: "B.Tech",
    regulation: "R20",
    branch: "MET",
    academic_year: "1st to 4th Year",
    semester: "All Semesters",
    subject_name: "Metallurgical Engineering R20 Syllabus",
    pdf_url: "/uploads/2021/04/R20-B.TECH-MET-SYLLABUS.pdf"
  },
  {
    level: "UG",
    program_name: "B.Tech",
    regulation: "R20",
    branch: "IT",
    academic_year: "1st to 4th Year",
    semester: "All Semesters",
    subject_name: "Information Technology R20 Syllabus",
    pdf_url: "/uploads/2021/04/R20-B.TECH-IT-SYLLABUS.pdf"
  }
];

async function run() {
  const sql = postgres(databaseUrl, { ssl: "require" });
  try {
    for (const item of missingR25Syllabus) {
      const existing = await sql`
        SELECT id FROM academic_syllabus 
        WHERE regulation = ${item.regulation} AND subject_name = ${item.subject_name}
      `;
      if (existing.length === 0) {
        await sql`
          INSERT INTO academic_syllabus (level, program_name, regulation, branch, academic_year, semester, subject_name, pdf_url)
          VALUES (${item.level}, ${item.program_name}, ${item.regulation}, ${item.branch}, ${item.academic_year}, ${item.semester}, ${item.subject_name}, ${item.pdf_url})
        `;
        console.log(`✅ Inserted: [${item.regulation}] ${item.program_name} ${item.branch} - ${item.subject_name}`);
      } else {
        console.log(`ℹ️ Already exists: [${item.regulation}] ${item.branch} - ${item.subject_name}`);
      }
    }

    const allSyllabus = await sql`SELECT * FROM academic_syllabus WHERE regulation = 'R25' ORDER BY id`;
    console.log(`\n--- ALL R25 SYLLABUS NOW IN DB (${allSyllabus.length} entries) ---`);
    for (const s of allSyllabus) {
      console.log(`- [${s.regulation}] ${s.level} | ${s.program_name} | ${s.branch} | ${s.subject_name} -> ${s.pdf_url}`);
    }
  } catch (err) {
    console.error("Error updating database:", err);
  } finally {
    await sql.end();
  }
}

run();
