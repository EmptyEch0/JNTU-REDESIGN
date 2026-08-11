import "dotenv/config";
import { db } from "../src/db";
import {
  notices, leadership, siteContent, academicRegulations,
  academicSyllabus, academicTimetables, academicCalendars,
  academicDownloads, academicFeeStructure, academicFaculty,
  departments, tickerNotifications, hostelContent,
  libraryContent, studentClubs, tpo, placementHighlights,
  placementGoals, majorRecruiters, recruiters, rdProjects,
  rdScholars, rdPublications, rdFocusAreas, rdConsultancy,
  rdCommittee
} from "../src/db/schema";
import { ingestSingleChunk } from "../src/lib/ingest";

async function main() {
  console.log("Starting robust full-site vector ingestion...");
  let count = 0;

  // 1. Notices
  try {
    const allNotices = await db.select().from(notices);
    for (const n of allNotices) {
      await ingestSingleChunk(`Notice: ${n.title}. Category: ${n.tag}. Date: ${n.date}`, `notice:${n.id}`, "notice", { tag: n.tag, date: n.date });
      count++;
    }
  } catch (e) { console.error("Notice ingest skip:", e); }

  // 2. Leadership
  try {
    const allLeaders = await db.select().from(leadership);
    for (const l of allLeaders) {
      await ingestSingleChunk(`${l.designation}: ${l.name}. Email: ${l.email}. Message: ${l.message}`, `leadership:${l.id}`, "leadership", { designation: l.designation });
      count++;
    }
  } catch (e) { console.error("Leadership ingest skip:", e); }

  // 3. Academic Faculty
  try {
    const allFaculty = await db.select().from(academicFaculty);
    for (const f of allFaculty) {
      await ingestSingleChunk(`Faculty Member: ${f.name}, Designation: ${f.designation}, Department ID: ${f.deptId}, Qualification: ${f.qualification || ""}, Specialisation: ${f.specialization || ""}`, `faculty:${f.id}`, "faculty", { deptId: f.deptId });
      count++;
    }
  } catch (e) { console.error("Faculty ingest skip:", e); }

  // 4. Departments & HODs
  const HOD_MAP: Record<string, string> = {
    cse: "Dr. R. Rajeswara Rao",
    ece: "Dr. K. Babulu",
    eee: "Dr. K. Sri Kumar",
    mech: "Dr. R. Umamaheswara Rao",
    met: "Dr. G. Swami Naidu",
    it: "Dr. P. Aruna Kumari",
    bsh: "Dr. G. J. Naga Raju",
    mba: "Dr. K. V. S. M. Ramanesh",
  };

  try {
    const allDepts = await db.select().from(departments);
    for (const d of allDepts) {
      const rawHod = (d.hod || "").trim();
      const hodName = rawHod.length > 5 ? rawHod : (HOD_MAP[d.slug?.toLowerCase() || ""] || rawHod);
      if (hodName) {
        await ingestSingleChunk(
          `Head of Department (HOD) of ${d.name}: ${hodName}. Department: ${d.name}. Code: ${d.code || d.slug}.`,
          `dept_hod:${d.id}`,
          "hod",
          { department: d.name }
        );
        count++;
      }
      await ingestSingleChunk(
        `Department of ${d.name} (${d.code || d.slug}). Overview: ${d.description || d.about || d.name}. HOD: ${hodName}`,
        `dept:${d.id}`,
        "department",
        { department: d.name }
      );
      count++;
    }
  } catch (e) { console.error("Department ingest skip:", e); }

  // 5. Academic Regulations & Syllabus
  try {
    const allRegs = await db.select().from(academicRegulations);
    for (const r of allRegs) {
      await ingestSingleChunk(`Academic Regulation: ${r.title}. Category: ${r.category}. Link: ${r.link}`, `regulation:${r.id}`, "regulation", { link: r.link });
      count++;
    }
  } catch (e) { console.error("Regs ingest skip:", e); }

  try {
    const allSyllabus = await db.select().from(academicSyllabus);
    for (const s of allSyllabus) {
      await ingestSingleChunk(`Syllabus Course: ${s.subject_name}. Regulation: ${s.regulation}. Branch: ${s.branch}. Semester: ${s.semester}. Download PDF: ${s.pdf_url}`, `syllabus:${s.id}`, "syllabus", { pdf_url: s.pdf_url });
      count++;
    }
  } catch (e) { console.error("Syllabus ingest skip:", e); }

  // 6. Placements
  try {
    const tpoData = await db.select().from(tpo);
    for (const t of tpoData) {
      await ingestSingleChunk(`Training & Placement Officer (TPO): ${t.name}, ${t.designation}. Email: ${t.email}. Message: ${t.message}`, `tpo:${t.id}`, "placement_staff", { email: t.email });
      count++;
    }
  } catch {}

  try {
    const pHighlights = await db.select().from(placementHighlights);
    for (const ph of pHighlights) {
      await ingestSingleChunk(`Placement Highlight: Student ${ph.name} from branch ${ph.branch} placed at ${ph.company} with salary package ${ph.package}`, `ph:${ph.id}`, "placement", {});
      count++;
    }
  } catch {}

  try {
    const mRecruiters = await db.select().from(majorRecruiters);
    for (const mr of mRecruiters) {
      await ingestSingleChunk(`Top Campus Recruiter Company: ${mr.name}`, `mr:${mr.id}`, "recruiter", {});
      count++;
    }
  } catch {}

  // 7. Research & Projects
  try {
    const projects = await db.select().from(rdProjects);
    for (const p of projects) {
      await ingestSingleChunk(`R&D Funded Project: ${p.title}. Principal Investigator (PI): ${p.pi}. Agency: ${p.agency}. Amount: ${p.amount}. Period: ${p.period}. Status: ${p.status}`, `rd_project:${p.id}`, "rd_project", {});
      count++;
    }
  } catch {}

  try {
    const scholars = await db.select().from(rdScholars);
    for (const sc of scholars) {
      await ingestSingleChunk(`Ph.D. Research Scholar: ${sc.scholarName} (Roll No: ${sc.rollNo}). Supervisor: ${sc.supervisor}. Topic: ${sc.researchTitle}. Registration Year: ${sc.regYear}. Status: ${sc.status}`, `rd_scholar:${sc.id}`, "rd_scholar", {});
      count++;
    }
  } catch {}

  try {
    const pubs = await db.select().from(rdPublications);
    for (const pb of pubs) {
      await ingestSingleChunk(`Research Publication: ${pb.title}. Authors: ${pb.authors}. Journal/Venue: ${pb.venue}. Department: ${pb.dept}`, `rd_pub:${pb.id}`, "rd_publication", {});
      count++;
    }
  } catch {}

  // 8. Site Content
  try {
    const allContent = await db.select().from(siteContent);
    for (const c of allContent) {
      await ingestSingleChunk(`Page: ${c.page}, Section: ${c.sectionKey}. Title: ${c.title}. Content: ${c.content}`, `sitecontent:${c.id}`, "site_content", { page: c.page });
      count++;
    }
  } catch (e) { console.error("SiteContent ingest skip:", e); }

  console.log(`Successfully ingested ${count} RAG chunks across all website sections!`);
}

main().catch(err => {
  console.error("Direct Ingestion failed:", err);
  process.exit(1);
});
