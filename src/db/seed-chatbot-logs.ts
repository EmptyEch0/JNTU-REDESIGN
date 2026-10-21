import postgres from "postgres";
import fs from "fs";
import path from "path";

// Auto-load .env
if (!process.env.DATABASE_URL) {
  try {
    const envPath = path.resolve(process.cwd(), ".env");
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, "utf-8");
      const match = envContent.match(/DATABASE_URL=['"]?([^'"\n\r]+)['"]?/);
      if (match && match[1]) {
        process.env.DATABASE_URL = match[1].trim();
      }
    }
  } catch (err) {
    console.error("Failed to parse .env file:", err);
  }
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("Error: DATABASE_URL environment variable is not set.");
  process.exit(1);
}

const sampleQueries = [
  {
    question: "Show me the CSE R23 B.Tech syllabus",
    answer: "Here is the **CSE R23 B.Tech Syllabus** covering 1st to 4th Year. 📥 [Download Syllabus PDF](/uploads/2023/10/CSE-finalR23.pdf)",
    intent: "syllabus",
    language: "english",
    source: "dedicated_kb",
    confidence: "high",
    rating: "good",
    daysAgo: 0,
  },
  {
    question: "What are the hostel fees for boys and girls?",
    answer: "**Hostel & Mess Fees**: The refundable hostel caution deposit is ₹3,000. Mess bills run on monthly dividing system approx ₹2,800 - ₹3,500/month. 🏠 [Hostel Details](/hostels)",
    intent: "hostel",
    language: "english",
    source: "dedicated_kb",
    confidence: "high",
    rating: "good",
    daysAgo: 0,
  },
  {
    question: "Who is the principal of JNTU-GV CEV?",
    answer: "**Principal**: Prof. Dr. V. S. Vakula, Ph.D. Office: Ground Floor, Administrative Block. 📧 principal.cev@jntugv.edu.in",
    intent: "principal",
    language: "english",
    source: "dedicated_kb",
    confidence: "high",
    rating: "good",
    daysAgo: 1,
  },
  {
    question: "ECE department lo emi laboratories unnayi?",
    answer: "JNTU-GV CEV ECE Department has **7 advanced laboratories**: IC & HDL Lab, DSP Lab, Microwave & Optical Lab, IoT Lab. 🌐 [ECE Labs](/departments/ece/labs)",
    intent: "lab",
    language: "tenglish",
    source: "dedicated_kb",
    confidence: "high",
    rating: "good",
    daysAgo: 1,
  },
  {
    question: "What is the highest package in placements this year?",
    answer: "The **Highest Package** at JNTU-GV CEV is **42 LPA** (Microsoft/Amazon off-campus) and **14 LPA** on-campus. Average package: 5.5 LPA. 🏢 [Placements Portal](/placements/students)",
    intent: "placement",
    language: "english",
    source: "dedicated_kb",
    confidence: "high",
    rating: "good",
    daysAgo: 2,
  },
  {
    question: "When will mid-2 exams start for 3rd year?",
    answer: "Mid-term examinations (Mid-1 & Mid-2) follow the academic calendar published by the Controller of Examinations. 📂 [View Academic Calendar](/academics/academic-calendar)",
    intent: "exam",
    language: "english",
    source: "live_db",
    confidence: "high",
    rating: "needs_change",
    adminNotes: "Needs exact start date once COE issues circular for March 2026.",
    suggestedAnswer: "Mid-2 exams for 3rd year B.Tech are scheduled tentatively for the 3rd week of March 2026. Official circular will be posted on Notices.",
    daysAgo: 2,
  },
  {
    question: "How to apply for Jagananna Vidya Deevena scholarship?",
    answer: "Apply through the official **JnanaBhumi Portal** via your village/ward secretariats. Required documents: Rice card, Aadhaar, Income certificate. 🌐 [Scholarships](/academics/scholarships)",
    intent: "scholarship",
    language: "english",
    source: "dedicated_kb",
    confidence: "high",
    rating: "good",
    daysAgo: 3,
  },
  {
    question: "ప్రధానోపాధ్యాయులు ఎవరు?",
    answer: "జేఎన్‌టీయూ-జీవీ కాలేజ్ ఆఫ్ ఇంజనీరింగ్ విజయనగరం **ప్రిన్సిపాల్**: **డా. వి. ఎస్. వాకుల** (Dr. V. S. Vakula), ప్రొఫెసర్, ఈఈఈ విభాగం.",
    intent: "principal",
    language: "telugu",
    source: "dedicated_kb",
    confidence: "high",
    rating: "good",
    daysAgo: 3,
  },
  {
    question: "Where can I get bonafide certificate for passport?",
    answer: "Visit the **Principal's Office** (Admin Block, Ground Floor) with a written application countersigned by your HOD. Working hours: 10:00 AM - 5:00 PM.",
    intent: "principals_office",
    language: "english",
    source: "dedicated_kb",
    confidence: "high",
    rating: "good",
    daysAgo: 4,
  },
  {
    question: "Who built this AI chatbot?",
    answer: "This intelligent chatbot and portal redesign was architected and developed by the **Student Engineering Team**: Likhith, Charan Teja, Sai Rupini, Sai Vamsi, and Anitha, under the mentorship of **Mr. Anil Wurity** (Assistant Professor, IT).",
    intent: "contributors",
    language: "english",
    source: "instant_client",
    confidence: "high",
    rating: "good",
    daysAgo: 4,
  },
  {
    question: "Nearest airport to college and travel time?",
    answer: "The nearest upcoming airport is **Bhogapuram Greenfield International Airport (~36 km)**. The current operational airport is Visakhapatnam International Airport (VTZ) (~55 km).",
    intent: "airport",
    language: "english",
    source: "dedicated_kb",
    confidence: "high",
    rating: "good",
    daysAgo: 5,
  },
  {
    question: "Is there any swimming pool in college?",
    answer: "JNTU-GV CEV campus has sports facilities including cricket, football ground, basketball court, indoor badminton courts, and gymnasium. Currently there is no swimming pool.",
    intent: "sports",
    language: "english",
    source: "dedicated_kb",
    confidence: "high",
    rating: "good",
    daysAgo: 5,
  },
  {
    question: "What is EAMCET cutoff for CSE branch?",
    answer: "Approximate AP EAMCET Closing Ranks for CSE: OC Boys ~6,500, OC Girls ~7,200, BC ~12,000 - 18,000, SC/ST ~35,000 - 55,000. 🌐 [Admissions Info](/academics/admissions)",
    intent: "admission",
    language: "english",
    source: "dedicated_kb",
    confidence: "high",
    rating: "good",
    daysAgo: 6,
  },
  {
    question: "What is the WiFi password for library?",
    answer: "The Central Library provides high-speed campus Wi-Fi. Students can obtain credentials from the IT center or library circulation desk using their roll number.",
    intent: "library",
    language: "english",
    source: "rag_fallback",
    confidence: "fallback",
    rating: "needs_change",
    adminNotes: "Clarify that students must register their device MAC address with the Computer Center.",
    suggestedAnswer: "Campus Wi-Fi is accessed via student roll number portal. Register your MAC address with the System Administrator in the Central Computing Center.",
    daysAgo: 6,
  },
  {
    question: "College timings and working hours",
    answer: "Regular working hours: **9:30 AM to 4:30 PM**, Monday through Saturday (2nd Saturday and Sundays are holidays). Administrative office works 10:00 AM to 5:00 PM.",
    intent: "timings",
    language: "english",
    source: "dedicated_kb",
    confidence: "high",
    rating: "good",
    daysAgo: 7,
  },
  {
    question: "Can I get bus facility from Vizianagaram railway station?",
    answer: "Yes, university RTC and dedicated college buses run on scheduled routes connecting Vizianagaram RTC Complex, Railway Station, and Mayuri Junction directly to Dwarapudi campus.",
    intent: "transport",
    language: "english",
    source: "dedicated_kb",
    confidence: "high",
    rating: "good",
    daysAgo: 7,
  },
];

async function seed() {
  const sql = postgres(connectionString!, { ssl: "require" });

  try {
    console.log("Checking existing chatbot_logs...");
    const [{ count }] = await sql`SELECT count(*) FROM chatbot_logs;`;
    console.log(`Existing count: ${count}`);

    if (Number(count) === 0) {
      console.log(`Seeding ${sampleQueries.length} sample queries...`);
      for (const item of sampleQueries) {
        const d = new Date();
        d.setDate(d.getDate() - item.daysAgo);
        d.setHours(9 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 60));

        await sql`
          INSERT INTO chatbot_logs (
            question, answer, intent, language, source, confidence, rating, admin_notes, suggested_answer, created_at
          ) VALUES (
            ${item.question},
            ${item.answer},
            ${item.intent},
            ${item.language},
            ${item.source},
            ${item.confidence},
            ${item.rating},
            ${item.adminNotes || null},
            ${item.suggestedAnswer || null},
            ${d}
          );
        `;
      }
      console.log("Seeding completed successfully!");
    } else {
      console.log("chatbot_logs already contains records.");
    }
  } catch (err) {
    console.error("Seeding error:", err);
  } finally {
    await sql.end();
  }
}

seed();
