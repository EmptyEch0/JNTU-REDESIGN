import "dotenv/config";
import { db } from "../src/db/index";
import { leadership } from "../src/db/schema";
import { eq } from "drizzle-orm";

async function main() {
  console.log("🚀 Seeding IQAC Coordinator's data...");

  const data = {
    slug: "iqac-coordinator",
    name: "Dr. T. S. N. Murthy",
    designation: "IQAC Coordinator",
    image:
      "https://jntugvcev.edu.in/wp-content/uploads/2024/01/WhatsApp-Image-2024-01-30-at-10.56.26-1.jpeg",
    email: "iqac@jntugvcev.edu.in",
    quote:
      "To ensure quality culture as the prime concern for the Higher Education Institutions through institutionalizing and internalizing all the initiatives taken with internal and external support.",
    message:
      "The IQAC is meant for planning, guiding, and monitoring Quality Assurance (QA) and Quality Enhancement (QE) activities of the University. It channelizes and systematizes institutional efforts towards academic excellence.",
    profile: `### About IQACELL
The IQAC is meant for planning, guiding, and monitoring Quality Assurance (QA) and Quality Enhancement (QE) activities of the University. It channelizes and systematizes institutional efforts towards academic excellence. It is not a hierarchical or record-keeping body, but a facilitative and participative organ.

### 🎯 Vision
"To create a benchmark in defining the quality of JNTUK-UCEV as a professional higher education institution in Engineering and Technology through excellence in teaching, learning, research & development, and by fostering a culture of quality with transparent and reliable evaluation methods to meet global standards."

### 🚀 Mission
- To channelize and systematize efforts towards academic excellence.
- To encourage departments to adopt student-centric learning environments using ICT tools.
- To promote value-based education.
- To organize seminars, workshops, and faculty development programs.
- To ensure transparent academic, administrative, and financial operations.
- To develop an Institutional MIS for quality information.
- To ensure proper maintenance of institutional infrastructure.
- To build stakeholder relationships and promote social responsibility.

### 📌 Strategies & Objectives
- Development and application of quality benchmarks for academic and administrative activities.
- Creating a learner-centric environment.
- Collecting feedback from students, parents, and stakeholders.
- Dissemination of quality-related information in higher education.
- Organizing workshops and seminars on quality themes.
- Documentation of activities for continuous improvement.

### ⚙️ Functions
- Developing ethical work culture.
- Establishing quality benchmarks.
- Coordinating quality-related institutional activities.
- Organizing workshops, seminars, and research events.
- Ensuring a learner-centric environment.
- Preparation of Annual Quality Assurance Reports (AQAR).

### 📊 Monitoring Mechanism
IQAC submits the Annual Quality Assurance Report (AQAR) to NAAC annually. AQAR is prepared based on quality benchmarks, and interaction with quality assurance bodies is maintained.`,
  };

  const existing = await db
    .select()
    .from(leadership)
    .where(eq(leadership.slug, data.slug))
    .limit(1);

  if (existing.length > 0) {
    await db.update(leadership).set(data).where(eq(leadership.slug, data.slug));
    console.log("✅ IQAC data updated.");
  } else {
    await db.insert(leadership).values(data);
    console.log("✅ IQAC data inserted.");
  }

  process.exit(0);
}

main().catch(console.error);
