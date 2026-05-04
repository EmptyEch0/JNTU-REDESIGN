import { db } from './index';
import { placementYears, placementHighlights, tpo, placementGoals, majorRecruiters, placementStaff, recruiters } from './schema';
import { eq } from 'drizzle-orm';

const YEARS = [
  { year: "2023-24", offers: 432, top: "42 LPA", recruiters: 92 },
  { year: "2022-23", offers: 398, top: "38 LPA", recruiters: 84 },
  { year: "2021-22", offers: 360, top: "32 LPA", recruiters: 78 },
  { year: "2020-21", offers: 312, top: "24 LPA", recruiters: 71 },
];

const HIGHLIGHTS = [
  { name: "P. Harsha Vardhan", branch: "CSE", company: "Amazon", package: "42 LPA" },
  { name: "K. Anjali", branch: "ECE", company: "Cyient", package: "12 LPA" },
  { name: "B. Surya Teja", branch: "IT", company: "Deloitte", package: "11 LPA" },
  { name: "M. Lakshmi", branch: "EEE", company: "L&T", package: "9 LPA" },
  { name: "R. Karthik", branch: "MECH", company: "Hyundai", package: "8.5 LPA" },
  { name: "S. Divya", branch: "CSE", company: "Accenture", package: "8 LPA" },
];

const TPO_DATA = {
  name: "Dr. V. S. Vakula",
  image: "https://jntugvcev.edu.in/wp-content/uploads/2020/07/EEE-3.Dr_.V.S.VAKULA-Asst-Prof.jpg",
  email: "tpo@jntugvcev.edu.in",
  designation: "Training & Placement Officer",
  message: "The vision of Training and Placement cell is to train and develop technically competent professionals to serve as valuable resource for industry and society."
};

const GOALS = [
  { text: "To build domain knowledge based human resource by imparting contemporary technical skills and social ethics in order to initiate excellent industry institute collaboration for well-being of society." },
  { text: "To assist students to develop/clarify their academic and career interests, and their short and long-term goals through individual counselling and group sessions." },
  { text: "To assist students for industrial training at the end of the sixth semester." },
  { text: "To act as a link between students, alumni, and the employment community to assist students in obtaining placement in reputed companies." }
];

const MAJOR_RECRUITERS = [
  { name: "Amazon" }, { name: "TCS" }, { name: "Infosys" }, { name: "Wipro" }, 
  { name: "Accenture" }, { name: "Cognizant" }, { name: "Capgemini" }, { name: "Deloitte" }
];

const STAFF = [
  { name: "Mr. Mahesh", role: "Helper" }
];

const R = "https://jntugvcev.edu.in/wp-content/gallery/our-recruiters";
const RECRUITER_LOGOS = [
  { name: "Agilitx", url: `${R}/Agilitx.png` },
  { name: "Airtel", url: `${R}/airtel.png` },
  { name: "Amazon", url: `${R}/amazon.png` },
  { name: "Anjaney Alloyes Pvt Ltd", url: `${R}/Anjaney-Alloyes-PVt-Ltd.jpg` },
  { name: "AppsAssociates", url: `${R}/AppsAssociates.png` },
  { name: "Bhanu Special Costing", url: `${R}/bhanu-special-costing-PVT.LTD_.jpg` },
  { name: "BMM Ispat Limited", url: `${R}/bmm-ispat-limited.jpg` },
  { name: "Broadcom", url: `${R}/Broadcom.png` },
  { name: "Capgemini", url: `${R}/cap-gemini.png` },
  { name: "Cerium Systems", url: `${R}/Cerium-systems.png` },
  { name: "Chegg India", url: `${R}/Cheggindia-Pvt.Ltd_.png` },
  { name: "CMC", url: `${R}/CMC.jpg` },
  { name: "Cognizant", url: `${R}/Cognizant.jpg` },
  { name: "Computer Science Corporation", url: `${R}/Computer-Science-Corporation.png` },
  { name: "Ctrls", url: `${R}/Ctrls.png` },
  { name: "Cyient", url: `${R}/cyient.png` },
  { name: "Dankuni Steels", url: `${R}/Dankuni-Steels.png` },
  { name: "Data India", url: `${R}/data-india-PVT.LTD_.png` },
  { name: "DST Worldwide Technologies", url: `${R}/DST-Worldwide-Technologies.jpg` },
  { name: "Effetronics", url: `${R}/Effetronics.png` },
  { name: "Everglades Technologies", url: `${R}/Everglades-Technologies.png` },
  { name: "Genpact", url: `${R}/genpact.png` },
  { name: "Glenwood", url: `${R}/Glenwood.jpg` },
  { name: "GlobalLogic", url: `${R}/Global-Logic.png` },
  { name: "GreyCampus", url: `${R}/GreyCampus.jpg` },
  { name: "Honeywell Technology", url: `${R}/Honeywell-Technology.png` },
  { name: "Hyundai", url: `${R}/hyundai.png` },
  { name: "IBM", url: `${R}/IBM.png` },
  { name: "Infosys", url: `${R}/Infosys.png` },
  { name: "Infotech", url: `${R}/Infotech.png` },
  { name: "Inspectorate Griffith India", url: `${R}/Inspectorate-Griffith-India-PVT.LTD_.jpg` },
  { name: "J.K. Papers", url: `${R}/J.K.Papers.jpg` },
  { name: "L&T InfoTech", url: `${R}/LT-InfoTech.png` },
  { name: "Medha Servo", url: `${R}/Medha-Servo.jpg` },
  { name: "Mindtree", url: `${R}/Mindtree.png` },
  { name: "Miracle Software Systems", url: `${R}/Miracle-Soft-ware-Systems.png` },
  { name: "MPHASIS", url: `${R}/MPHAS.png` },
  { name: "NCR", url: `${R}/NCR.jpg` },
  { name: "NeeLsys", url: `${R}/NeeLsys.jpg` },
  { name: "Pratian Technologies", url: `${R}/Pratian-Technologies.png` },
  { name: "Sails Software Solutions", url: `${R}/Sails-software-solutions.png` },
  { name: "SoCtronics", url: `${R}/SoCtronics.png` },
  { name: "Suneratech", url: `${R}/suneratech.png` },
  { name: "Syntel", url: `${R}/Syntel.png` },
  { name: "Tavisca", url: `${R}/Tavisca.jpg` },
  { name: "TCS", url: `${R}/TCS.jpg` },
  { name: "Tech Mahindra", url: `${R}/Tech-mahindra.jpg` },
  { name: "Teradata", url: `${R}/teradata.png` },
  { name: "Transcend Solutions", url: `${R}/transcend-solutions.png` },
  { name: "Uurmi", url: `${R}/uurmi.png` },
  { name: "Virtusa", url: `${R}/Virtusa.png` },
  { name: "Wipro", url: `${R}/wipro.jpg` },
  { name: "Zebi", url: `${R}/Zebi.png` },
];

async function seed() {
  console.log('Clearing existing data...');
  
  console.log('Seeding placement years...');
  await db.insert(placementYears).values(YEARS).onConflictDoNothing();
  
  console.log('Seeding placement highlights...');
  await db.insert(placementHighlights).values(HIGHLIGHTS).onConflictDoNothing();

  console.log('Seeding TPO...');
  const existingTPO = await db.select().from(tpo).limit(1);
  if (existingTPO.length > 0) {
    await db.update(tpo).set(TPO_DATA).where(eq(tpo.id, existingTPO[0].id));
  } else {
    await db.insert(tpo).values(TPO_DATA);
  }

  console.log('Seeding Goals...');
  await db.delete(placementGoals);
  await db.insert(placementGoals).values(GOALS);

  console.log('Seeding Major Recruiters...');
  await db.delete(majorRecruiters);
  await db.insert(majorRecruiters).values(MAJOR_RECRUITERS);

  console.log('Seeding Staff...');
  await db.delete(placementStaff);
  await db.insert(placementStaff).values(STAFF);

  console.log('Seeding Recruiter Logos...');
  await db.delete(recruiters);
  await db.insert(recruiters).values(RECRUITER_LOGOS);
  
  console.log('Seeding completed!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
