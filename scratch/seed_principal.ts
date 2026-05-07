import "dotenv/config";
import { db } from "../src/db/index";
import { leadership } from "../src/db/schema";
import { eq } from "drizzle-orm";

async function main() {
  console.log("🚀 Seeding Principal's data...");

  const principalData = {
    slug: "principal",
    name: "Prof. Kota Chandra Bhushana Rao",
    designation: "Professor & Principal i/c",
    image: "/Principal.png",
    email: "principal@jntugvcev.edu.in",
    quote: "JNTU-GV University College of Engineering, Vizianagaram is laureled as one of the best Engineering Colleges in the state of Andhra Pradesh.",
    message: "JNTU-GV University College of Engineering, Vizianagaram is laureled as one of the best Engineering Colleges in the state of Andhra Pradesh. Established in 2007 and its commitment to excellence is not restricted to the high calibre of its faculty but ensures that the students admitted are exposed to strong graduate employability skills in addition to conceptual skills in Engineering and technology. In recent times, the institution is entering into collaborations with technology giants to share the expertize and find solutions to technological problems. In the coming years, the institution aims to be counted among the best institutions in India. The institution will continue to build its strength by developing world class teaching programmes at postgraduate and undergraduate levels in addition to pursuing research in cutting edge technologies. Further, we are conscious of our social responsibility and will continue to carry out activities with direct social impact, such as school and undergraduate teachers training, development and dissemination of sustainable technologies, and research with direct relevance to society such as climate change, healthcare, water resources management, and renewable energy.",
    profile: `Dr. K. Chandra Bhushana Rao
Principal, JNTU-GV College of Engineering Vizianagaram
Professor, Department of Computer Science and Engineering

Dr. Kota Chandra Bhushana Rao completed his B.E, M.E, and Ph.D. in Electronics and Communication Engineering from Andhra University, Visakhapatnam, in 1992, 1995, and 2005 respectively, under the supervision of Prof. G.S.N. Raju (Former Vice-Chancellor, AU). He has over 29 years of teaching, research, and administrative experience in engineering education.

He served as Assistant Professor, Associate Professor, Professor, HOD, Dean, and Principal in reputed institutions like GITAM and MVGR (1992-2012). Since 2013, he has been with JNTU Vizianagaram (UCEV), where he served as Head, ECE, and Director of IQAC. He is currently serving as Principal of JNTU-GV College of Engineering Vizianagaram.

### Achievements:
– Senior Member, IEEE since 2016.
– Professor since January 2016.
– Served as Head of ECE, UCEV.
– Two Indian patents and two copyrights published.
– 72+ research publications in reputed journals and conferences.
– Four Ph.D.s awarded; eight scholars currently under supervision.
– International visits to UK and Thailand for paper presentations and technical sessions.
– Chaired technical sessions in international conferences in India and abroad.
– Fellow of IETE; Life Member of ISTE, SEMC(I), ISSS (IISc); Member IAENG.
– Member, Research Boards: Anna University, Vignan University, Integral University.
– Chairman, BoS-ECE, UCEV-JNTUK since 2017.

### Recognitions:
– NBA Evaluator since 2009.
– Member, EVC and Expert, AICTE.
– CMI-UK Level 5 Certificate through UKIERI-AICTE (2015-16).
– Recognized by AICTE for UKIERI-India initiative; one among 200 across India.
– Invited to Dudley College, UK, Birmingham.
– GB and BoS Member in several autonomous colleges via JNTUK.
– NAAC and NBA Coordinator at UCEV (2013-2019).
– Consultant and trainer for 15+ institutions in NBA/NAAC.
– Resource Person for ESCI, Hyderabad.
– Chairman, Core Project Review Committee (CPRC), SAMEER Visakhapatnam (since 2019).

### Involvement in Accreditations:
– NBA Expert since 2011; participated in WA Mock Evaluation (2012).
– Visited 20+ institutions as NBA Expert.
– Conducted OBE-OBA workshops at UCEV and across India (Jammu, Tamil Nadu, MP, UP, Rajasthan, etc.).

### Guidance for Institutions:
– Guided NBA/NAAC processes for SRKR, Jayam COE, Sona COE, Anna Univ COE, KJ Somaiya COE, GVP Women, VVIT, VIIT, Swarnandhra, Vignan Univ, and others.

### Other Achievements:
– Guided students to placements in ISRO, SAMEER, BSNL, and other PSUs.
– Excellent feedback from students across institutes.
– Trained contract faculty in NBA/NAAC at UCEV.
– Established RUSA project labs in ECE.
– SC/ST Book Bank established (2013-15).
– Initiated MoU with TCS under TAAP as TPO (2015).
– Executed 3 MoUs for ECE Department (2020-21).
– Pioneered mobile-based Virtual Labs training.
– Delivered 23 webinars during 2020-21 lockdown as a resource person.`
  };

  // Upsert principal data
  const existing = await db.select().from(leadership).where(eq(leadership.slug, "principal")).limit(1);
  if (existing.length > 0) {
    await db.update(leadership).set(principalData).where(eq(leadership.slug, "principal"));
    console.log("✅ Principal data updated.");
  } else {
    await db.insert(leadership).values(principalData);
    console.log("✅ Principal data inserted.");
  }
}

main().catch(console.error);
