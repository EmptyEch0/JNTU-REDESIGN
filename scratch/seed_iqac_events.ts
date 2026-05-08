import "dotenv/config";
import { db } from "../src/db/index";
import { iqacEvents, iqacOutcomes } from "../src/db/schema";

async function main() {
  console.log("🚀 Seeding IQAC Outcomes and Events...");

  const outcomes = [
    "Accredited by AICTE, New Delhi",
    "Improved student intake and admission",
    "Enhancement in faculty qualification & knowledge up gradation towards recent technology",
    "Improvement in academic results and placement",
    "Improvement in research facilities and projects",
    "Improvement in entrepreneurship development",
    "More linkages with industries",
    "Improved participation of students in various national and international level competitions like Smart India Hackathon, Code Vita, Tata Crucible Campus Hackathon, etc…..",
    "Involvement in reducing curricular gap and thus upgrading of UG, PG regulations",
    "Improved infrastructure facilities",
    "Improvement in number of titles and volumes in the library",
    "Improvement in research, extension & consultancy activities",
  ];

  await db.delete(iqacOutcomes);
  for (const o of outcomes) {
    await db.insert(iqacOutcomes).values({ text: o });
  }
  console.log("✅ IQAC Outcomes seeded.");

  const events = [
    { title: "5 Day FDP on “MOODLE Learning Management System”", date: "22-07-2020 to 26-07-2020" },
    {
      title: "A 15 day online FDP on “Data Science and it's Applications in STEM “",
      date: "07-09-2020 to 21-09-2020",
    },
    {
      title: "Workshop on “Systems office Administration and Fundamentals”",
      date: "16-09-2020 to 30-09-2020(3PM to 5 PM)",
    },
  ];

  await db.delete(iqacEvents);
  for (const e of events) {
    await db.insert(iqacEvents).values(e);
  }
  console.log("✅ IQAC Events seeded.");

  process.exit(0);
}

main().catch(console.error);
