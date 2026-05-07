import "dotenv/config";
import postgres from "postgres";

async function main() {
  const sql = postgres(process.env.DATABASE_URL!);

  console.log("🔨 Creating WE&GC tables manually if they do not exist...");

  await sql`
    CREATE TABLE IF NOT EXISTS we_profile (
      id SERIAL PRIMARY KEY,
      about_text TEXT NOT NULL,
      quote TEXT NOT NULL,
      convener_name TEXT NOT NULL,
      convener_image TEXT NOT NULL,
      convener_message TEXT NOT NULL,
      vision TEXT NOT NULL,
      mission TEXT NOT NULL,
      objectives JSONB NOT NULL
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS we_committee (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      email TEXT NOT NULL,
      sub_role TEXT
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS we_activities (
      id SERIAL PRIMARY KEY,
      s_no INTEGER NOT NULL,
      title TEXT NOT NULL,
      date TEXT NOT NULL
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS we_recreation (
      id SERIAL PRIMARY KEY,
      description TEXT NOT NULL,
      images JSONB NOT NULL
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS we_magazine (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      url TEXT NOT NULL
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS we_gallery (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      image_url TEXT NOT NULL
    );
  `;

  console.log("🧹 Clearing old WE&GC tables to avoid duplicates...");
  await sql`DELETE FROM we_profile`;
  await sql`DELETE FROM we_committee`;
  await sql`DELETE FROM we_activities`;
  await sql`DELETE FROM we_recreation`;
  await sql`DELETE FROM we_magazine`;
  await sql`DELETE FROM we_gallery`;

  console.log("🌱 Seeding we_profile...");
  const objectives = [
    "To develop critical thinking ability of female fraternity to enhance decision making.",
    "To enable women to make informed choices in areas like technical education, employment and health especially reproductive health.",
    "To enhance their active participation in an equal footing in all areas.",
    "Identification of strong leadership and change-makers among female fraternity to build their capacity.",
    "To organize awareness programs on gender sensitization.",
    "The provision of opportunities for female fraternity to be financially, mentally and emotionally empowered to promote their growth as individuals.",
    "Conducting various competitions to encourage their artistic talents for creative thinking.",
    "To highlight the importance of spirituality, health, hygiene and safety.",
    "To inculcate entrepreneurial attitude among young girls at the earliest so that they can be “job providers” rather than “job seekers”.",
    "To promote intellectual & cultural activities for overall personality development of students."
  ];

  await sql`
    INSERT INTO we_profile (about_text, quote, convener_name, convener_image, convener_message, vision, mission, objectives)
    VALUES (
      'The Women Empowerment and Grievance Cell (WE& GC) @ JNTUK-UCEV has been constituted to empower and safeguard the rights of female fraternity of this College. It was started to empower female fraternity to recognize their true potentials to attain their own stand in a competing world. The WE& GC works to promote gender sensitivity in the college and conduct diverse programmes to educate, sensitize both male and female members, and produce harmonious atmosphere on the campus. It works for the welfare of the students and faculty towards preparing them into competent professionals to take up greater challenges in the academic sphere.\n\nIts aim is to create awareness about important issues related to female fraternity to provide a forum for discussion and deliberation on a range of issues from empowerment to environment.\n\nIt seeks to empower young women to attain emotional, physical and mental freedom to withstand the changing phases which thrives mile stones of success in their life.\n\nWE & GC functions with the added aim to enhance self-esteem and dignity of female fraternity and empower them in taking pertinent decisions.',
      'Empowered women transforms Society ',
      'Dr. G. Jaya Suma',
      'https://jntugvcev.edu.in/wp-content/uploads/2020/08/WhatsApp-Image-2020-08-26-at-10.23.09-AM.jpeg',
      'A woman with a creative voice is by definition an innovative strong woman',
      'To enrich female fraternity to become professionally competent and socially sensitive engineers with equality and dignity in congenial working environment to explore their imminent potential in all aspects.',
      'To train female fraternity to acquire extensive range of skills and knowledge and to develop and increase their social, economic and intellectual capacities for peace, security and prosperity of mankind.',
      ${JSON.stringify(objectives)}
    )
  `;

  console.log("🌱 Seeding we_committee (11 members)...");
  const committee = [
    { name: "Dr. G. Swami Naidu", role: "Principal & Chairman WE&GC", email: "" },
    { name: "Dr. G. Jaya Suma", role: "Professor & HOD of IT, Convener WE&GC", email: "wegcell_convener@jntugvcev.edu.in" },
    { name: "Smt. M. Hema", role: "Asst.Prof of ECE, Secretary WE&GC", email: "secretary.wegc@jntugvcev.edu.in" },
    { name: "Dr. V. S. Vakula", role: "Asst.Prof. & HOD of EEE, Joint-Secretary WE&GC", email: "" },
    { name: "Dr. P. Aruna Kumari", role: "Asst. Prof. of CSE, Treasurer WE&GC", email: "" },
    { name: "Smt. A. Padmaja", role: "Asst. Prof. of EEE, Member WE&GC", email: "" },
    { name: "Dr. Ch. Neelima Devi", role: "Asst. Prof. of ME, Member WE&GC", email: "" },
    { name: "Smt. B. Nalini", role: "Asst. Prof. of ECE, Member WE&GC", email: "" },
    { name: "Dr. Ch. Bindu Madhuri", role: "Asst. Prof. of IT, Member WE&GC", email: "" },
    { name: "Smt. M. Sowbhagya Lakshmi", role: "Asst. Prof. of Chemistry, Member WE&GC", email: "" },
    { name: "Smt. S. Ganga Mani", role: "Sr. Asst. , Member(Non-Teaching) WE&GC", email: "" }
  ];

  for (const member of committee) {
    await sql`
      INSERT INTO we_committee (name, role, email)
      VALUES (${member.name}, ${member.role}, ${member.email})
    `;
  }

  console.log("🌱 Seeding we_activities (20 items)...");
  const activities = [
    { sNo: 1, title: "Women Empowerment And Grievance Cell Inauguration", date: "06-03-2014" },
    { sNo: 2, title: "One Day Workshop On “Awakening Women”", date: "06-03-2014" },
    { sNo: 3, title: "One Day Workshop On “Soft Skills”", date: "29-07-2014" },
    { sNo: 4, title: "One Day Workshop On “Self-Empowerment”& Women’s day celebrations", date: "05-03-2015" },
    { sNo: 5, title: "Conducted Medical Camp", date: "20-02-2016" },
    { sNo: 6, title: "One Day Workshop on Women Empowerment -2016", date: "05-03-2016" },
    { sNo: 7, title: "International Women’s Day -2016", date: "08-03-2016" },
    { sNo: 8, title: "A-One Day” Workshop On Women In Everything – 2017” Organized.", date: "18-02-2017" },
    { sNo: 9, title: "International Women’s Day -2017", date: "08-03-2017" },
    { sNo: 10, title: "women empowerment sessions (like orientation towards Technology, goal setting, people skills by WEGC members", date: "Sept--2017" },
    { sNo: 11, title: "Legal awareness program to girl students", date: "23-10-2017" },
    { sNo: 12, title: "Quiz competition on women rights by the direction of the National Women Commission", date: "23-10-2017" },
    { sNo: 13, title: "Poster presentation on empowerment in rural areas”", date: "29-11-2017" },
    { sNo: 14, title: "Medical camp for girl students and women fraternity", date: "21-12-2017" },
    { sNo: 15, title: "International Women’s Day-2018", date: "08-03-2018" },
    { sNo: 16, title: "International Women’s Day-2019", date: "08-03-2019" },
    { sNo: 17, title: "Support to DISHA ACT-2019", date: "16-12-2019" },
    { sNo: 18, title: "Medical camp for girl students and women fraternity", date: "29-01-2020" },
    { sNo: 19, title: "International Women’s Day-2020", date: "07-03-2020" },
    { sNo: 20, title: "KNACK Explore your Talent contest", date: "15-08-2020 to 20-08-2020" }
  ];

  for (const act of activities) {
    await sql`
      INSERT INTO we_activities (s_no, title, date)
      VALUES (${act.sNo}, ${act.title}, ${act.date})
    `;
  }

  console.log("🌱 Seeding we_recreation (zigzag club images)...");
  const recImages = [
    "https://jntugvcev.edu.in/wp-content/uploads/2020/08/Untitled-1.jpg",
    "https://jntugvcev.edu.in/wp-content/uploads/2020/08/1212.jpg",
    "https://jntugvcev.edu.in/wp-content/uploads/2020/08/21356.jpg",
    "https://jntugvcev.edu.in/wp-content/uploads/2020/08/2115.jpg"
  ];
  const recDesc = "“All Work and no Play make Jack a dull boy” goes a popular saying.\n\nRecreation consists of activities or experiences carried on within leisure, usually chosen voluntarily by the participant — either because of satisfaction, pleasure, or creative enrichment derived, or because certain personal or social values are gained from them. It may also be perceived as the process of participation or as the emotional state derived from involvement.\n\nDue to the intricacies in present-day society and the way of living, students nowadays are weaker than older generations, both physically and emotionally. This is reflected in their physical, emotional, and mental health, behavior, and development, which makes recreation more important than ever.\n\nHaving a recreational area is one of the best ways of managing employees and improving team morale in the workplace.\n\nIt makes work fun and breaks the ice between employees, eventually building a strong workforce that performs better in customer service, client servicing, sales, and teamwork.\n\n“There are clear neurological links between feelings, thoughts, and actions” — Annie McKee\n\n“When we are in the grip of strong negative emotions, it’s like having blinders on. We don’t process information as well, think creatively, or make good decisions. Frustration, anger, and stress cause an important part of us to shut down — the thinking, engaged part.”\n\nA happy environment and satisfied employees are essential for the growth of any organization. Qualities such as dedication, motivation, and retention are results of inner satisfaction and contentment among the workforce.\n\nThe success of a company lies in the success of every individual employee.";

  await sql`
    INSERT INTO we_recreation (description, images)
    VALUES (${recDesc}, ${JSON.stringify(recImages)})
  `;

  console.log("🌱 Seeding we_magazine (2 issues)...");
  const mags = [
    { title: "Yuthika - Issue 1", url: "https://jntugvcev.edu.in/wp-content/uploads/2020/12/Womens-Day-Magazine-March-2020-compressed-compressed.pdf" },
    { title: "Yuthika - Issue 2", url: "https://drive.google.com/file/d/1SfNTP9sXclVKgGJTqeNItDE0a3qP7IWG/view?usp=sharing" }
  ];

  for (const mag of mags) {
    await sql`
      INSERT INTO we_magazine (title, url)
      VALUES (${mag.title}, ${mag.url})
    `;
  }

  console.log("🌱 Seeding we_gallery (carousel slides)...");
  const slides = [
    { title: "IMG-20191216-WA0038", imageUrl: "https://jntugvcev.edu.in/wp-content/uploads/2020/08/IMG-20191216-WA0038.jpg" },
    { title: "DSCN0609", imageUrl: "https://jntugvcev.edu.in/wp-content/uploads/2020/08/DSCN0609-scaled.jpg" },
    { title: "WhatsApp Image 2020-08-28 at 11.25.46 AM", imageUrl: "https://jntugvcev.edu.in/wp-content/uploads/2020/08/WhatsApp-Image-2020-08-28-at-11.25.46-AM.jpeg" },
    { title: "DSCN0825", imageUrl: "https://jntugvcev.edu.in/wp-content/uploads/2020/08/DSCN0825-scaled.jpg" },
    { title: "12", imageUrl: "https://jntugvcev.edu.in/wp-content/uploads/2020/08/12.jpg" },
    { title: "DSCN0648", imageUrl: "https://jntugvcev.edu.in/wp-content/uploads/2020/08/DSCN0648-scaled.jpg" },
    { title: "DSCN0649", imageUrl: "https://jntugvcev.edu.in/wp-content/uploads/2020/08/DSCN0649-scaled.jpg" },
    { title: "WhatsApp Image 2020-08-28 at 11.09.16 AM (3)", imageUrl: "https://jntugvcev.edu.in/wp-content/uploads/2020/08/WhatsApp-Image-2020-08-28-at-11.09.16-AM-3.jpeg" },
    { title: "WhatsApp Image 2020-08-28 at 11.27.17 AM", imageUrl: "https://jntugvcev.edu.in/wp-content/uploads/2020/08/WhatsApp-Image-2020-08-28-at-11.27.17-AM.jpeg" },
    { title: "DSC02794", imageUrl: "https://jntugvcev.edu.in/wp-content/uploads/2020/08/DSC02794-scaled.jpg" }
  ];

  for (const s of slides) {
    await sql`
      INSERT INTO we_gallery (title, image_url)
      VALUES (${s.title}, ${s.imageUrl})
    `;
  }

  console.log("✅ WE&GC Seeding completed.");
  process.exit(0);
}

main().catch(console.error);
