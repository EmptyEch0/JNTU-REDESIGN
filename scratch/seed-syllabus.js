import postgres from 'postgres';

const connectionString = 'postgresql://neondb_owner:npg_VumPW7fSI0JO@ep-lingering-mountain-aom9cqy0-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const sql = postgres(connectionString);

const extraSyllabus = [
  {
    level: 'UG',
    program_name: 'B.Tech',
    regulation: 'R23',
    branch: 'CSE',
    academic_year: '1st Year to 4th Year',
    semester: 'All Semesters',
    subject_name: 'Computer Science & Engineering R23 Syllabus',
    pdf_url: '/uploads/2023/10/CSE-finalR23.pdf'
  },
  {
    level: 'UG',
    program_name: 'B.Tech',
    regulation: 'R23',
    branch: 'MECH',
    academic_year: '1st Year to 4th Year',
    semester: 'All Semesters',
    subject_name: 'Mechanical Engineering R23 Syllabus',
    pdf_url: '/uploads/2023/10/ME-finalR23.pdf'
  },
  {
    level: 'UG',
    program_name: 'B.Tech',
    regulation: 'R20',
    branch: 'CSE',
    academic_year: '1st Year to 4th Year',
    semester: 'All Semesters',
    subject_name: 'Computer Science & Engineering R20 Syllabus',
    pdf_url: '/uploads/2021/04/R20-B.TECH-CSE-SYLLABUS.pdf'
  },
  {
    level: 'UG',
    program_name: 'B.Tech',
    regulation: 'R20',
    branch: 'ECE',
    academic_year: '1st Year to 4th Year',
    semester: 'All Semesters',
    subject_name: 'Electronics & Communication Engineering R20 Syllabus',
    pdf_url: '/uploads/2021/04/R20-B.TECH-ECE-SYLLABUS.pdf'
  },
  {
    level: 'UG',
    program_name: 'B.Tech',
    regulation: 'R20',
    branch: 'EEE',
    academic_year: '1st Year to 4th Year',
    semester: 'All Semesters',
    subject_name: 'Electrical & Electronics Engineering R20 Syllabus',
    pdf_url: '/uploads/2021/04/R20-B.TECH-EEE-SYLLABUS.pdf'
  },
  {
    level: 'UG',
    program_name: 'B.Tech',
    regulation: 'R20',
    branch: 'MECH',
    academic_year: '1st Year to 4th Year',
    semester: 'All Semesters',
    subject_name: 'Mechanical Engineering R20 Syllabus',
    pdf_url: '/uploads/2021/04/R20-B.TECH-ME-SYLLABUS.pdf'
  },
  {
    level: 'UG',
    program_name: 'B.Tech',
    regulation: 'R20',
    branch: 'MET',
    academic_year: '1st Year to 4th Year',
    semester: 'All Semesters',
    subject_name: 'Metallurgical Engineering R20 Syllabus',
    pdf_url: '/uploads/2021/04/R20-B.TECH-MET-SYLLABUS.pdf'
  },
  {
    level: 'UG',
    program_name: 'B.Tech',
    regulation: 'R20',
    branch: 'IT',
    academic_year: '1st Year to 4th Year',
    semester: 'All Semesters',
    subject_name: 'Information Technology R20 Syllabus',
    pdf_url: '/uploads/2021/04/R20-B.TECH-IT-SYLLABUS.pdf'
  },
  {
    level: 'PG',
    program_name: 'MBA',
    regulation: 'R25',
    branch: 'MBA',
    academic_year: '1st & 2nd Year',
    semester: 'All Semesters',
    subject_name: 'MBA R25 Course Structure & Syllabus',
    pdf_url: '/uploads/2025/12/MBA-R25-Syllabus.pdf'
  }
];

async function run() {
  try {
    for (const item of extraSyllabus) {
      const existing = await sql`
        SELECT id FROM academic_syllabus 
        WHERE branch = ${item.branch} AND regulation = ${item.regulation} AND subject_name = ${item.subject_name}
      `;
      if (existing.length === 0) {
        await sql`
          INSERT INTO academic_syllabus (level, program_name, regulation, branch, academic_year, semester, subject_name, pdf_url)
          VALUES (${item.level}, ${item.program_name}, ${item.regulation}, ${item.branch}, ${item.academic_year}, ${item.semester}, ${item.subject_name}, ${item.pdf_url})
        `;
        console.log(`Inserted: ${item.regulation} ${item.branch} - ${item.subject_name}`);
      } else {
        console.log(`Already exists: ${item.regulation} ${item.branch}`);
      }
    }
    console.log("Done seeding syllabus!");
  } catch (err) {
    console.error("Error seeding syllabus:", err);
  } finally {
    await sql.end();
  }
}

run();
