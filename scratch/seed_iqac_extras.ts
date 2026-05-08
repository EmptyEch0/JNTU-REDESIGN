import "dotenv/config";
import { db } from "../src/db/index";
import { leadership } from "../src/db/schema";
import { eq } from "drizzle-orm";

async function main() {
  console.log("🚀 Seeding structured IQAC data...");

  const extras = [
    {
      title: "About IQACELL",
      content:
        "The IQAC is meant for planning, guiding, and monitoring Quality Assurance (QA) and Quality Enhancement (QE) activities of the University. It channelizes and systematizes institutional efforts towards academic excellence. It is not a hierarchical or record-keeping body, but a facilitative and participative organ. The IQAC acts as a driving force to improve quality by identifying deficiencies and implementing strategies for enhancement.",
    },
    {
      title: "🎯 Vision",
      content:
        '"To create a benchmark in defining the quality of JNTUK-UCEV as a professional higher education institution in Engineering and Technology through excellence in teaching, learning, research & development, and by fostering a culture of quality with transparent and reliable evaluation methods to meet global standards."',
    },
    {
      title: "🚀 Mission",
      content:
        "• To channelize and systematize efforts towards academic excellence.\n• To encourage departments to adopt student-centric learning environments using ICT tools.\n• To promote value-based education.\n• To organize seminars, workshops, and faculty development programs.\n• To ensure transparent academic, administrative, and financial operations.\n• To develop an Institutional MIS for quality information.\n• To ensure proper maintenance of institutional infrastructure.\n• To build stakeholder relationships and promote social responsibility.",
    },
    {
      title: "📌 Strategies & Objectives",
      content:
        "• Development and application of quality benchmarks for academic and administrative activities.\n• Creating a learner-centric environment.\n• Collecting feedback from students, parents, and stakeholders.\n• Dissemination of quality-related information in higher education.\n• Organizing workshops and seminars on quality themes.\n• Documentation of activities for continuous improvement.\n• Acting as a nodal agency for quality-related initiatives.\n• Maintaining institutional databases through MIS.\n• Improving academic and administrative performance systematically.\n• Promoting institutional best practices and quality culture.",
    },
    {
      title: "⚙️ Functions",
      content:
        "• Developing ethical work culture.\n• Establishing quality benchmarks.\n• Coordinating quality-related institutional activities.\n• Organizing workshops, seminars, and research events.\n• Ensuring a learner-centric environment.\n• Encouraging faculty innovation and technological adoption.\n• Conducting periodic audits.\n• Collecting and analyzing stakeholder feedback.\n• Preparing Annual Quality Assurance Reports (AQAR).\n• Acting as a dynamic system for institutional improvement.",
    },
    {
      title: "🌟 Benefits",
      content:
        "• Enhances clarity and focus in institutional functioning.\n• Promotes international quality standards.\n• Improves integration across institutional activities.\n• Supports better decision-making.\n• Acts as a dynamic quality improvement system.\n• Strengthens documentation and internal communication.",
    },
    {
      title: "📊 Monitoring Mechanism",
      content:
        "IQAC submits the Annual Quality Assurance Report (AQAR) to NAAC annually. AQAR is prepared based on quality benchmarks. Quality Radars (QRs) are developed bi-annually. Interaction with quality assurance bodies is maintained. Reports are approved by governing bodies.",
    },
  ];

  await db
    .update(leadership)
    .set({ extras: extras })
    .where(eq(leadership.slug, "iqac-coordinator"));

  console.log("✅ IQAC structured extras seeded.");
  process.exit(0);
}

main().catch(console.error);
