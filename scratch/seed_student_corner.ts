import "dotenv/config";
import postgres from "postgres";

async function main() {
  const sql = postgres(process.env.DATABASE_URL!);

  console.log("🧹 Dropping tables manually to ensure recreation with updated columns...");
  await sql`DROP TABLE IF EXISTS edc_profile CASCADE`;
  await sql`DROP TABLE IF EXISTS edc_committee CASCADE`;
  await sql`DROP TABLE IF EXISTS edc_activities CASCADE`;
  await sql`DROP TABLE IF EXISTS prof_chapters CASCADE`;
  await sql`DROP TABLE IF EXISTS iipc_cell CASCADE`;

  console.log("🔨 Creating updated EDC and Student Corner tables manually...");

  await sql`
    CREATE TABLE edc_profile (
      id SERIAL PRIMARY KEY,
      about TEXT NOT NULL,
      vision JSONB NOT NULL,
      mission JSONB NOT NULL,
      coordinator_name TEXT NOT NULL,
      coordinator_role TEXT NOT NULL,
      coordinator_quote TEXT NOT NULL,
      coordinator_image TEXT NOT NULL
    );
  `;

  await sql`
    CREATE TABLE edc_committee (
      id SERIAL PRIMARY KEY,
      s_no INTEGER NOT NULL,
      name TEXT NOT NULL,
      designation TEXT NOT NULL,
      role TEXT NOT NULL
    );
  `;

  await sql`
    CREATE TABLE edc_activities (
      id SERIAL PRIMARY KEY,
      s_no INTEGER NOT NULL,
      activity_event TEXT NOT NULL,
      academic_year TEXT NOT NULL,
      date TEXT NOT NULL,
      theme TEXT NOT NULL,
      student_participant TEXT NOT NULL
    );
  `;

  await sql`
    CREATE TABLE prof_chapters (
      id SERIAL PRIMARY KEY,
      code TEXT NOT NULL,
      name TEXT NOT NULL,
      about TEXT NOT NULL,
      coordinator TEXT,
      faculty_members JSONB,
      events JSONB NOT NULL
    );
  `;

  await sql`
    CREATE TABLE iipc_cell (
      id SERIAL PRIMARY KEY,
      about TEXT NOT NULL,
      objectives JSONB NOT NULL,
      activities JSONB NOT NULL
    );
  `;

  console.log("🧹 Clearing old tables to avoid duplicates...");
  await sql`DELETE FROM edc_committee`;
  await sql`DELETE FROM edc_activities`;
  await sql`DELETE FROM prof_chapters`;
  await sql`DELETE FROM iipc_cell`;

  console.log("🌱 Seeding edc_profile...");
  const visionList = [
    "Entrepreneurship Development Cell JNTUK-UCEV, Vizianagaram, to find the fervent young minds brimming with innovative ideas and provides a platform to become budding entrepreneurs.",
    "Fostering and developing an environment where the students who have the passion of becoming an entrepreneur can enhance their Entrepreneur skills to turn Innovative Ideas into Start Ups and creating a better future.",
    "Creating awareness, and motivation among the students fraternity of JNTUK-UCEV, to become an entrepreneur by utilizing natural resources.",
  ];

  const missionList = [
    "The mission of the Entrepreneurship Development Cell JNTUK-UCEV, Vizianagaram is to develop a mechanism to create innovation and entrepreneurship amongst the students.",
    "Our main motto is to promote the entrepreneurial culture among the students to make their own paths for the future by conducting various entrepreneurship programs.",
  ];

  await sql`
    INSERT INTO edc_profile (about, vision, mission, coordinator_name, coordinator_role, coordinator_quote, coordinator_image)
    VALUES (
      'Centre for Entrepreneurship Development (CED) JNTUK-UCEV, Vizianagaram by the Direction, vision and mission of the University Authorities the CED has been established in Nov 2013',
      ${JSON.stringify(visionList)},
      ${JSON.stringify(missionList)},
      'Dr. Ch. Srinivasa Rao',
      'Professor of ECE & Coordinator, EDC',
      'Entrepreneurship development is the means of enhancing the knowledge and skill of entrepreneurs through several classroom coaching and programs, and training. The main point of the development process is to strengthen and increase the number of entrepreneurs.',
      'http://jntugvcev.edu.in/wp-content/uploads/2020/08/Dr.Ch_.Srinivasa-Rao-Professor-UCEV-JNTUK.jpg'
    )
  `;

  console.log("🌱 Seeding edc_committee...");
  const committeeMembers = [
    { sNo: 1, name: "Dr. Swami Naidu", designation: "Principal", role: "Chairman" },
    {
      sNo: 2,
      name: "Dr. Ch. Srinivasa Rao",
      designation: "Professor of ECE & Coordinator, EDC",
      role: "Convener",
    },
    { sNo: 3, name: "Dr. G. Sraswathi", designation: "Professor of EEE", role: "Member" },
    {
      sNo: 4,
      name: "Sri K. Srinivasa Prasad",
      designation: "Assistant Professor of ME",
      role: "Member",
    },
    {
      sNo: 5,
      name: "Dr. B.Tirimula Rao",
      designation: "Assistant Professor of IT",
      role: "Member",
    },
  ];

  for (const m of committeeMembers) {
    await sql`
      INSERT INTO edc_committee (s_no, name, designation, role)
      VALUES (${m.sNo}, ${m.name}, ${m.designation}, ${m.role})
    `;
  }

  console.log("🌱 Seeding edc_activities...");
  const activitiesList = [
    {
      sNo: 1,
      activity: "ENTREPRENEURSHIP AWARENESS PROGRAMMES",
      year: "2016-2017",
      date: "5,6 June 2016",
      theme: "ENTREPRENEURSHIP AWARENESS",
      participants: "600 students",
    },
    {
      sNo: 2,
      activity: "Start Reinvesting your own world",
      year: "2016-2017",
      date: "31st july,2016",
      theme: "Awareness",
      participants: "150 Students",
    },
    {
      sNo: 3,
      activity: "EXPLORING ENTREPRENEURSHIP OPPORTUNITIES IN AP",
      year: "2016-2017",
      date: "15,16 September, 2016",
      theme: "ENTREPRENEURSHIP OPPORTUNITIES",
      participants: "500 Students",
    },
    {
      sNo: 4,
      activity: "EXPLORING ENTREPRENEURSHIP OPPORTUNITIES IN AP",
      year: "2016-2017",
      date: "29,30 November 2016",
      theme: "ENTREPRENEURSHIP OPPORTUNITIES",
      participants: "350 Students",
    },
    {
      sNo: 5,
      activity: "Start Reinvesting your own world",
      year: "2016-2017",
      date: "3rd March 2017",
      theme: "Review Meeting",
      participants: "200 Students",
    },
    {
      sNo: 6,
      activity: "EXPLORING ENTREPRENEURSHIP OPPORTUNITIES IN AP",
      year: "2017-2018",
      date: "10,11 June 2017",
      theme: "ENTREPRENEURSHIP OPPORTUNITIES",
      participants: "400 Students",
    },
    {
      sNo: 7,
      activity: "Program on Sea Food Processing",
      year: "2017-2018",
      date: "23-26 November 2017",
      theme: "Awareness",
      participants: "350+ Students",
    },
    {
      sNo: 8,
      activity: "Start Reinvesting your own world",
      year: "2017-2018",
      date: "18th February 2018",
      theme: "Review Meeting",
      participants: "200 Students",
    },
    {
      sNo: 9,
      activity: "ENTREPRENEURSHIP AWARENESS PROGRAMMES",
      year: "2018-2019",
      date: "15,16 June 2018",
      theme: "ENTREPRENEURSHIP AWARENESS",
      participants: "600 Students",
    },
    {
      sNo: 10,
      activity: "EXPLORING ENTREPRENEURSHIP OPPORTUNITIES IN AP",
      year: "2018-2019",
      date: "26,27 December 2018",
      theme: "ENTREPRENEURSHIP OPPORTUNITIES",
      participants: "450 Students",
    },
  ];

  for (const act of activitiesList) {
    await sql`
      INSERT INTO edc_activities (s_no, activity_event, academic_year, date, theme, student_participant)
      VALUES (${act.sNo}, ${act.activity}, ${act.year}, ${act.date}, ${act.theme}, ${act.participants})
    `;
  }

  console.log("🌱 Seeding prof_chapters (CSI, IEEE, IE, IETE, IIM)...");

  // 1. CSI
  const csiEvents = [
    {
      sNo: 1,
      title: "PHP and MYSQL Workshop",
      date: "13th Dec. 2014",
      details: "150 Students from CSE and IT branches",
    },
    {
      sNo: 2,
      title: "State Level Student Technical Paper Contest",
      date: "23rd Sept. 2014",
      details: "120 Students from Various Colleges",
    },
    {
      sNo: 3,
      title: "One Week Faculty Development Programme on Cyber Security",
      date: "11th -16th, June 2020",
      details: "320 Faculty members from different parts of the Country",
    },
    {
      sNo: 4,
      title: "Global Webinar Series on Cyber Security",
      date: "20th-26th, June 2020",
      details: "329 Participants from 18 Countries",
    },
    {
      sNo: 5,
      title: "One Week Online Workshop on Blended Learning",
      date: "06th -10th, July 2020.",
      details: "241 Participants from different parts of the Country",
    },
  ];
  await sql`
    INSERT INTO prof_chapters (code, name, about, coordinator, faculty_members, events)
    VALUES (
      'CSI',
      'Computer Society of India (CSI)',
      'JNTUK UCEV, Vizianagaram is having CSI Institutional membership for 10 ½ years and CSI-JNTUKUCEV-Student Branch was established in the year 2014, with 247 student members. Dr. A S N Chakravarthy, of C S E has been nominated as Student Branch coordinator. The Aim of JNTUKUCEV-Student Branch is to facilitate research, knowledge sharing, learning and career enhancement for all categories of IT Professionals, while simultaneously inspiring and nurturing new entrants into the industry and helping them to integrate into the IT community. It is actively involved in conducting technical seminars, workshops, lectures and industrial visits. The invitees are eminent professors, IT executives, practicing professionals and other prominent visitors.',
      'Dr. A S N Chakravarthy',
      NULL,
      ${JSON.stringify(csiEvents)}
    )
  `;

  // 2. IEEE
  const ieeeEvents = [
    {
      sNo: 1,
      title: "Poster Presentation Event in EclEctiquE 2K20",
      date: "11 February 2020",
      details:
        "Conducted in the Department of Electrical and Electronics Engineering in drawing Hall-1. Sri. Prasanna Kumar, Ms. Ch. Sravani (Assistant Engineers, Electrical Power Transmission and Distribution Company) invited as judges.",
    },
  ];
  await sql`
    INSERT INTO prof_chapters (code, name, about, coordinator, faculty_members, events)
    VALUES (
      'IEEE',
      'IEEE Student Chapter',
      'IEEE is the world’s largest professional association dedicated to advancing technological innovation and excellence for the benefit of humanity. IEEE and its members inspire a global community through IEEE’s highly cited publications, conferences, technology standards, and professional and educational activities. IEEE, via its different bodies, organizes numerous conferences and meetings on a worldwide range of topics. Through the student activities committee, IEEE facilitates partnerships between students and other IEEE entities.',
      'Department Coordinator',
      NULL,
      ${JSON.stringify(ieeeEvents)}
    )
  `;

  // 3. IE
  const ieFaculty = [
    { name: "Dr. G. Swami Naidu", membershipNo: "Fellow Member, F-1201367" },
    { name: "Dr. N. Mohan Rao", membershipNo: "M-1409691" },
    { name: "Dr. C Neelima Devi", membershipNo: "M-1580757" },
    { name: "V. Mani Kumar", membershipNo: "M-1580773" },
    { name: "K. Srinivasa Prasad", membershipNo: "M-1580765" },
  ];
  const ieEvents = [
    {
      sNo: 1,
      title: "Guest lecture: Analysis of Mechanical structures using FEM",
      date: "29-12-2015",
      details: "Delivered by Dr. J. Suresh Kumar under IE chapter",
    },
    {
      sNo: 2,
      title: "Guest lecture: Advancements in Vibration analysis",
      date: "14-09 -2017",
      details: "Delivered by Professor K. Meera Saheb, JNTUK Kakinada",
    },
    {
      sNo: 3,
      title: "Guest lecture: Long Span Bridges",
      date: "30-12-2017",
      details: "Delivered by Sri. A. Sai baba, Chief engineer, Indian railways",
    },
    {
      sNo: 4,
      title: "Guest lecture: WIND TURBINES AND ADVANCEMENTS IN MECHANICAL ENGINEERING",
      date: "11-10-2019",
      details: "Delivered by Lead engineer Sri. S.Sambamurthy from GE, Bangalore",
    },
    {
      sNo: 5,
      title: "Guest lecture: CONCEPTS OF COMPUTATIONAL FLUID DYNAMICS",
      date: "Delivered by Dr. M. Siva Subrahmanyam, Associate Professor, Department of ME, MVGRCE, Vizianagaram.",
      details: "Total number of students: 67",
    },
  ];
  await sql`
    INSERT INTO prof_chapters (code, name, about, coordinator, faculty_members, events)
    VALUES (
      'IE',
      'Institution of Engineers (India)',
      'The student chapter of Institution of Engineers is attached to the department of Mechanical Engineering. The chapter is functioning actively from the past few years and with association of IE(I) Vizag Chapter the department is continuously organizing good number of useful programs in advanced areas of research. Many of the faculty members of the department are the life members and fellows of IE(I).',
      'Department Chair',
      ${JSON.stringify(ieFaculty)},
      ${JSON.stringify(ieEvents)}
    )
  `;

  // 4. IETE
  const ieteEvents = [
    {
      sNo: 1,
      title: "Symposia, Expo, Exhibitions & Workshops",
      date: "2019-2020",
      details:
        "JNTUK UCEV students (the department of ECE) conducted events like PROJECT EXPO, WORKSHOPS, EXHIBITIONS, and SEMINAR SYMPOSIA.",
    },
  ];
  await sql`
    INSERT INTO prof_chapters (code, name, about, coordinator, faculty_members, events)
    VALUES (
      'IETE',
      'Institution of Electronics and Telecommunication Engineers (IETE)',
      'The student chapter of IETE is dedicated to promoting academic, technical, and professional development in Electronics and Communication Engineering on campus. It hosts regular events to prepare students for core technical industries.',
      'Department Coordinator',
      NULL,
      ${JSON.stringify(ieteEvents)}
    )
  `;

  // 5. IIM
  const iimEvents = [
    {
      sNo: 1,
      title: "Hands on experience program (IIM Vizag Chapter)",
      date: "03rd August 2019",
      details:
        "Provides better practical knowledge for academically meritorious students studying B.Tech in Metallurgical Engineering at JNTUK-UCEV.",
    },
    {
      sNo: 2,
      title: "One day National Conference on Innovations in Material Science & Technology",
      date: "12th December 2019",
      details: "National research conference hosted on campus.",
    },
    {
      sNo: 3,
      title: "Opening of resource center in Metallurgical Engineering",
      date: "12th December 2019",
      details: "Inaugurated by Sri. K.K.Ghosh Director (Projects), RINL Visakhapatnam.",
    },
    {
      sNo: 4,
      title: "EISEN2K20 National level technical symposium",
      date: "18th & 19th February 2020",
      details: "Two day symposium.",
    },
    {
      sNo: 5,
      title: "EISEN2K19 National level technical symposium",
      date: "1st & 2nd March 2019",
      details: "Two day symposium.",
    },
    {
      sNo: 6,
      title: "ACFAT17 National Workshop",
      date: "22nd August 2017",
      details: "Workshop on Advances in Composites and Ferro Alloy Technology.",
    },
    {
      sNo: 7,
      title: "EISEN2K18 National level technical symposium",
      date: "20th & 21st February 2018",
      details: "Two day symposium.",
    },
    {
      sNo: 8,
      title: "ICAMMP-2018 International Conference",
      date: "30th & 31st March 2018",
      details: "International Conference on Advanced Materials and Manufacturing Processes.",
    },
    {
      sNo: 9,
      title: "National workshop on Fatigue, Fracture and Creep of Materials",
      date: "16th & 17th September 2016",
      details: "Fatigue, Fracture and Creep of Materials.",
    },
    {
      sNo: 10,
      title: "National Metallurgist Day",
      date: "14th November 2016",
      details: "National level event celebrating metallurgy excellence.",
    },
    {
      sNo: 11,
      title: "EISEN2K17 National level technical symposium",
      date: "09th & 10th March 2017",
      details: "Two day symposium.",
    },
    {
      sNo: 12,
      title: "National Metallurgist Day",
      date: "14th November 2015",
      details: "Metallurgy celebrations.",
    },
    {
      sNo: 13,
      title: "EISEN2K16 National level technical symposium",
      date: "01st & 2nd March 2016",
      details: "Two day symposium.",
    },
  ];
  await sql`
    INSERT INTO prof_chapters (code, name, about, coordinator, faculty_members, events)
    VALUES (
      'IIM',
      'Indian Institute of Metals (IIM)',
      'List of events Organized by Department of Metallurgical Engineering in association with Its Students Affiliated Chapter (Indian Institute of Metals, Visakhapatnam Chapter). Encourages research, metallurgy education, and dynamic corporate integrations.',
      'Department Coordinator',
      NULL,
      ${JSON.stringify(iimEvents)}
    )
  `;

  console.log("🌱 Seeding iipc_cell...");
  const iipcObjectives = [
    "To establish active MoUs with core engineering, IT, and manufacturing companies.",
    "To organize regular industrial visits for hands-on exposure to massive production lines and smart systems.",
    "To facilitate semester-long student internships and real-world industrial capstone projects.",
    "To promote collaborative research and technical consultancy between faculty and industry experts.",
  ];

  const iipcActivities = [
    {
      title: "Industrial Visits",
      details:
        "Regular visits organized to leading power plants, IT parks, and manufacturing facilities across the state.",
    },
    {
      title: "Expert Guest Lectures",
      details:
        "Industrial veterans and senior directors share deep insights on emerging technologies, agile processes, and corporate expectations.",
    },
    {
      title: "Joint MoUs & Training",
      details:
        "Active collaboration with top-tier companies to offer certified training programs, modern labs, and recruitment opportunities.",
    },
  ];

  await sql`
    INSERT INTO iipc_cell (about, objectives, activities)
    VALUES (
      'The Industry Institution Interaction Cell (IIPC) acts as a powerful conduit connecting JNTU-GV CEV with the corporate and industrial ecosystem. It works proactively to align engineering education with current industry expectations by facilitating student internships, industrial visits, guest lectures from top industry professionals, and joint consultancy projects. Through IIPC, we ensure that our graduates possess relevant practical skills and are ready to deliver immediate value.',
      ${JSON.stringify(iipcObjectives)},
      ${JSON.stringify(iipcActivities)}
    )
  `;

  console.log("✅ Student Corner Seeding completed.");
  process.exit(0);
}

main().catch(console.error);
