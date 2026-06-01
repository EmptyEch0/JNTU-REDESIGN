import postgres from "postgres";
import fs from "fs";
import path from "path";

// Auto-load .env for local run scripting
if (!process.env.DATABASE_URL) {
  try {
    const envPath = path.resolve(process.cwd(), ".env");
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, "utf-8");
      const match = envContent.match(/DATABASE_URL=['"]?([^'"\n\r]+)['"]?/);
      if (match && match[1]) {
        process.env.DATABASE_URL = match[1].trim();
        console.log("Loaded DATABASE_URL successfully from local .env");
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

async function run() {
  console.log("Connecting to database for academic_courses_offered migration...");
  const sql = postgres(connectionString!, { ssl: "require" });

  try {
    // 1. Drop and recreate table using raw SQL to handle potential schema mismatches from previous runs
    console.log("Dropping table 'academic_courses_offered' if exists to refresh schema...");
    await sql`DROP TABLE IF EXISTS academic_courses_offered;`;
    
    console.log("Creating table 'academic_courses_offered'...");
    await sql`
      CREATE TABLE academic_courses_offered (
        id SERIAL PRIMARY KEY,
        program_name TEXT NOT NULL,
        duration TEXT NOT NULL,
        year_started INTEGER NOT NULL,
        intake INTEGER NOT NULL,
        program_type TEXT NOT NULL,
        program_subtype TEXT NOT NULL
      );
    `;
    console.log("Table successfully verified/created.");

    // 2. Truncate existing data to avoid duplicates on re-run
    console.log("Clearing existing courses data...");
    await sql`TRUNCATE TABLE academic_courses_offered RESTART IDENTITY;`;

    // 3. Seed curriculum data
    console.log("Seeding university courses data...");
    const courses = [
      // --- UG - B.Tech (Undergraduate Engineering) ---
      {
        program_name: "B.Tech in Computer Science and Engineering (CSE)",
        duration: "4 Years",
        year_started: 2007,
        intake: 180,
        program_type: "UG",
        program_subtype: "B.Tech",
      },
      {
        program_name: "B.Tech in Electronics and Communication Engineering (ECE)",
        duration: "4 Years",
        year_started: 2007,
        intake: 120,
        program_type: "UG",
        program_subtype: "B.Tech",
      },
      {
        program_name: "B.Tech in Electrical and Electronics Engineering (EEE)",
        duration: "4 Years",
        year_started: 2007,
        intake: 60,
        program_type: "UG",
        program_subtype: "B.Tech",
      },
      {
        program_name: "B.Tech in Mechanical Engineering (ME)",
        duration: "4 Years",
        year_started: 2007,
        intake: 60,
        program_type: "UG",
        program_subtype: "B.Tech",
      },
      {
        program_name: "B.Tech in Civil Engineering (CE)",
        duration: "4 Years",
        year_started: 2007,
        intake: 60,
        program_type: "UG",
        program_subtype: "B.Tech",
      },
      {
        program_name: "B.Tech in Information Technology (IT)",
        duration: "4 Years",
        year_started: 2007,
        intake: 60,
        program_type: "UG",
        program_subtype: "B.Tech",
      },
      {
        program_name: "B.Tech in Metallurgical Engineering (MET)",
        duration: "4 Years",
        year_started: 2009,
        intake: 30,
        program_type: "UG",
        program_subtype: "B.Tech",
      },

      // --- UG - B.Pharm (Undergraduate Pharmacy) ---
      {
        program_name: "Bachelor of Pharmacy (B.Pharm)",
        duration: "4 Years",
        year_started: 2020,
        intake: 60,
        program_type: "UG",
        program_subtype: "B.Pharm",
      },

      // --- PG - M.Tech (Postgraduate Engineering) ---
      {
        program_name: "M.Tech in Computer Science and Engineering (CSE)",
        duration: "2 Years",
        year_started: 2012,
        intake: 18,
        program_type: "PG",
        program_subtype: "M.Tech",
      },
      {
        program_name: "M.Tech in VLSI & Embedded Systems (ECE)",
        duration: "2 Years",
        year_started: 2012,
        intake: 18,
        program_type: "PG",
        program_subtype: "M.Tech",
      },
      {
        program_name: "M.Tech in Power Electronics (EEE)",
        duration: "2 Years",
        year_started: 2012,
        intake: 18,
        program_type: "PG",
        program_subtype: "M.Tech",
      },
      {
        program_name: "M.Tech in CAD/CAM (Mechanical)",
        duration: "2 Years",
        year_started: 2014,
        intake: 18,
        program_type: "PG",
        program_subtype: "M.Tech",
      },

      // --- PG - MBA (Postgraduate Management) ---
      {
        program_name: "Master of Business Administration (MBA)",
        duration: "2 Years",
        year_started: 2009,
        intake: 60,
        program_type: "PG",
        program_subtype: "MBA",
      },

      // --- PG - MCA (Postgraduate Applications) ---
      {
        program_name: "Master of Computer Applications (MCA)",
        duration: "2 Years",
        year_started: 2009,
        intake: 60,
        program_type: "PG",
        program_subtype: "MCA",
      },

      // --- PhD (Research Programs) ---
      {
        program_name: "Ph.D. in Computer Science and Engineering",
        duration: "3 to 5 Years",
        year_started: 2015,
        intake: 12,
        program_type: "PhD",
        program_subtype: "PhD",
      },
      {
        program_name: "Ph.D. in Electronics and Communication Engineering",
        duration: "3 to 5 Years",
        year_started: 2015,
        intake: 10,
        program_type: "PhD",
        program_subtype: "PhD",
      },
      {
        program_name: "Ph.D. in Mechanical Engineering",
        duration: "3 to 5 Years",
        year_started: 2015,
        intake: 8,
        program_type: "PhD",
        program_subtype: "PhD",
      },
      {
        program_name: "Ph.D. in Mathematics & Basic Sciences",
        duration: "3 to 5 Years",
        year_started: 2016,
        intake: 6,
        program_type: "PhD",
        program_subtype: "PhD",
      },
    ];

    for (const course of courses) {
      await sql`
        INSERT INTO academic_courses_offered 
          (program_name, duration, year_started, intake, program_type, program_subtype)
        VALUES 
          (${course.program_name}, ${course.duration}, ${course.year_started}, ${course.intake}, ${course.program_type}, ${course.program_subtype});
      `;
    }

    console.log(`Seeding completed successfully. Seeded ${courses.length} courses.`);
  } catch (error) {
    console.error("Database migration error:", error);
    process.exit(1);
  } finally {
    await sql.end();
    console.log("Database connection closed.");
  }
}

run();
