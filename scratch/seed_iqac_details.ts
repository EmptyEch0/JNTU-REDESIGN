import "dotenv/config";
import { db } from "../src/db/index";
import { iqacComposition, iqacReports } from "../src/db/schema";

async function main() {
  console.log("🚀 Seeding IQAC Composition and Reports...");

  const members = [
    { name: "Prof. K. Srikumar", designation: "Principal, JNTU-GV", role: "Chairperson" },
    { name: "Dr. P. Sree Devi", designation: "IQAC Coordinator & Asst. Prof. of Commerce, BS&HSS Dept", role: "Member Secretary" },
    { name: "Prof. G. Jaya Suma", designation: "Registrar, JNTU-GV", role: "Member (university nominee)" },
    { name: "Dr. Bijay Kumar Sahu", designation: "Head of IFPC, NRDC, Govt of India", role: "Member" },
    { name: "Abraham varghees", designation: "NSTL, Scientist (F)", role: "Member" },
    { name: "Dr. K. Babulu", designation: "Professor of ECE, Director of R&D, Admissions", role: "Member" },
    { name: "Dr. K. Chandra Bhushana Rao", designation: "Professor of ECE, Director DAP", role: "Member" },
    { name: "Dr. P. Aruna Kumari", designation: "Assistant Professor & Head of CSE", role: "Member" },
    { name: "Dr. K. Srinivasa Prasad", designation: "Assistant Professor of ME Dept. & I/c Head of CE", role: "Member" },
    { name: "Dr. M. Hema", designation: "Assistant Professor of ECE & OIE", role: "Member" },
    { name: "Dr. G. J. Naga Raju", designation: "Associate Professor of Physics & Head of BS&HSS", role: "Member" },
    { name: "Smt. B. Prabha", designation: "Senior Assistant", role: "Member" },
    { name: "Mr. Dandu Sai Ram (Roll No:13VV1A0422)", designation: "Alumni", role: "Member" },
    { name: "Mr. A. Siva Krishna (Roll No:21VV1A0305)", designation: "Student", role: "Member" },
  ];

  await db.delete(iqacComposition);
  for (const m of members) {
    await db.insert(iqacComposition).values(m);
  }
  console.log("✅ IQAC Composition seeded.");

  const reports = [
    // AQAR
    { title: "Report 2019-20", year: "2019-20", type: "AQAR", link: "https://jntugvcev.edu.in/wp-content/uploads/2021/02/18-2-2021-2019-2020-ANUAL-REPORT-up-1-24-merged.pdf" },
    { title: "Report 2018-19", year: "2018-19", type: "AQAR", link: "https://jntugvcev.edu.in/wp-content/uploads/2021/03/AQAR-2018-19-IQAC_20210302_0001_compressed-1.pdf" },
    { title: "Report 2017-18", year: "2017-18", type: "AQAR", link: "https://jntugvcev.edu.in/wp-content/uploads/2021/03/AQAR-2017-18_compressed.pdf" },
    // Academic Audit
    { title: "Report 2023-24", year: "2023-24", type: "Academic Audit", link: "https://jntugvcev.edu.in/wp-content/uploads/2025/03/Academic-Audit-Report-23-24.pdf" },
    { title: "Report 2022-23", year: "2022-23", type: "Academic Audit", link: "https://jntugvcev.edu.in/wp-content/uploads/2024/07/Audit-2022-23.pdf" },
    { title: "Report 2021-22", year: "2021-22", type: "Academic Audit", link: "https://jntugvcev.edu.in/wp-content/uploads/2024/07/Audit-2021-22.pdf" },
    { title: "Report 2020-21", year: "2020-21", type: "Academic Audit", link: "https://jntugvcev.edu.in/wp-content/uploads/2024/07/Audit-2020-21.pdf" },
    { title: "Report 2019-20", year: "2019-20", type: "Academic Audit", link: "https://jntugvcev.edu.in/wp-content/uploads/2021/12/DocScanner-14-Dec-2021-3.47-pm-pages-5-6.pdf" },
    { title: "Report 2018-19", year: "2018-19", type: "Academic Audit", link: "https://jntugvcev.edu.in/wp-content/uploads/2021/12/DocScanner-14-Dec-2021-3.47-pm-pages-3-4.pdf" },
    { title: "Report 2017-18", year: "2017-18", type: "Academic Audit", link: "https://jntugvcev.edu.in/wp-content/uploads/2021/12/DocScanner-14-Dec-2021-3.47-pm-pages-1-2.pdf" },
  ];

  await db.delete(iqacReports);
  for (const r of reports) {
    await db.insert(iqacReports).values(r);
  }
  console.log("✅ IQAC Reports seeded.");

  process.exit(0);
}

main().catch(console.error);
