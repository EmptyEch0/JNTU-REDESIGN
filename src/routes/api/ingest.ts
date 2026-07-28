import { createAPIFileRoute } from "@tanstack/react-start/api";
import { db } from "../../db";
import { 
  notices, leadership, siteContent, academicRegulations,
  academicSyllabus, academicTimetables, academicCalendars,
  academicDownloads, academicFeeStructure, faculty,
  departments, achievements, hostelContent, libraryContent,
  placementHighlights, majorRecruiters, rdProjects,
  studentClubs, tickerNotifications
} from "../../db/schema";
import { ingestSingleChunk } from "../../lib/ingest";

export const APIRoute = createAPIFileRoute("/api/ingest")({
  GET: async ({ request }) => {
    // Protect with a secret so random people can't trigger it
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.INGEST_SECRET}`) {
      return new Response("Unauthorized", { status: 401 });
    }

    try {
      let count = 0;

      const allNotices = await db.select().from(notices);
      for (const n of allNotices) {
        await ingestSingleChunk(`Notice: ${n.title}. Category: ${n.tag}. Date: ${n.date}`, `notice:${n.id}`, "notice", {});
        count++;
      }

      const allLeaders = await db.select().from(leadership);
      for (const l of allLeaders) {
        await ingestSingleChunk(`${l.designation}: ${l.name}. Email: ${l.email}. Message: ${l.message}`, `leadership:${l.id}`, "leadership", {});
        count++;
      }

      const allFaculty = await db.select().from(faculty);
      for (const f of allFaculty) {
        await ingestSingleChunk(`Faculty: ${f.name}, ${f.designation}, Department: ${f.department}`, `faculty:${f.id}`, "faculty", {});
        count++;
      }

      const allRegs = await db.select().from(academicRegulations);
      for (const r of allRegs) {
        await ingestSingleChunk(`Regulation: ${r.title}. Category: ${r.category}. Link: ${r.link}`, `regulation:${r.id}`, "regulation", { link: r.link });
        count++;
      }

      const allSyllabus = await db.select().from(academicSyllabus);
      for (const s of allSyllabus) {
        await ingestSingleChunk(`Syllabus: ${s.subject_name}. Regulation: ${s.regulation}. Branch: ${s.branch}. Sem: ${s.semester}. PDF: ${s.pdf_url}`, `syllabus:${s.id}`, "syllabus", { pdf_url: s.pdf_url });
        count++;
      }

      const allContent = await db.select().from(siteContent);
      for (const c of allContent) {
        await ingestSingleChunk(`Page: ${c.page}. ${c.title}. ${c.content}`, `sitecontent:${c.id}`, "site_content", {});
        count++;
      }

      const allTickers = await db.select().from(tickerNotifications);
      for (const t of allTickers) {
        await ingestSingleChunk(`Notification: ${(t as any).text ?? ""} Link: ${(t as any).link ?? ""}`, `ticker:${(t as any).id}`, "notification", {});
        count++;
      }

      return Response.json({ success: true, processed: count });
    } catch (err) {
      console.error("Ingest failed:", err);
      return Response.json({ success: false, error: String(err) }, { status: 500 });
    }
  },
});
