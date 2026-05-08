import "dotenv/config";
import postgres from "postgres";

async function main() {
  const sql = postgres(process.env.DATABASE_URL!);

  console.log("🔨 Creating NSS tables manually if they do not exist...");

  await sql`
    CREATE TABLE IF NOT EXISTS nss_profile (
      id SERIAL PRIMARY KEY,
      about_text TEXT NOT NULL,
      officer_name TEXT NOT NULL,
      officer_image TEXT NOT NULL,
      officer_message TEXT NOT NULL,
      officer_quote TEXT NOT NULL
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS nss_activities (
      id SERIAL PRIMARY KEY,
      s_no INTEGER NOT NULL,
      activity TEXT NOT NULL,
      date_conducted TEXT NOT NULL,
      venue TEXT NOT NULL,
      description TEXT NOT NULL
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS nss_special_camp (
      id SERIAL PRIMARY KEY,
      day TEXT NOT NULL,
      description TEXT NOT NULL
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS nss_gallery (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      image_url TEXT NOT NULL
    );
  `;

  console.log("🧹 Clearing old NSS tables to avoid duplicates...");
  await sql`DELETE FROM nss_profile`;
  await sql`DELETE FROM nss_activities`;
  await sql`DELETE FROM nss_special_camp`;
  await sql`DELETE FROM nss_gallery`;

  console.log("🌱 Seeding nss_profile...");
  await sql`
    INSERT INTO nss_profile (about_text, officer_name, officer_image, officer_message, officer_quote)
    VALUES (
      'The National Service Scheme (NSS) is a Central Sector Scheme of Government of India, Ministry of Youth Affairs & Sports initiated in 1969, the birth centenary year of Mahatma Gandhi, provides the platform to the students to build their personality in participating social service related programmes of various government led communities. The graduate, Post graduate and 11th & 12th Class schools students can involve in the NSS activities which helps them to develop a democratic attitude and leadership qualities, civic and social responsibilities and also helps the students to take their roles in the community, gain skills for organizing participation to the community, practice towards national integration and social harmony.\n\nThe symbol for the NSS has been based on the giant Rath Wheel of the world-famous Konark Sun Temple (The Black Pagoda) situated in Odisha, India. The wheel signifies the NSS volunteers serving the human kind continuously for the social change in the society. The eight bars in the wheel represents 24 hours of a day. The red colour indicates that the volunteer with full of young blood who serve with high spirit. The navy blue colour indicates the cosmos of which the NSS is tiny part, ready to contribute its share for the welfare of the mankind. It stands for continuity as well as change and implies the continuous striving of NSS for social transformation and uplift.\n\nThe motto of National Service Scheme is NOT ME BUT YOU\n\nNSS Unit of JNTUK University College of Engineering is providing services to the society almost from the inception of the institution under the JNTUK NSS cell. All these years, various activities are conducted in the vizianagaram district by our young, committed and social responsible volunteers. Our NSS unit always strive hard to promote the social change in people of vizianagaram district by identifying the problems in the current society and finds the solutions and promote them in the society by conducting programmes.',
      'V. Mani Kumar',
      'http://jntugvcev.edu.in/wp-content/uploads/2020/08/V.-Mani-Kumar-Photo-Mech.jpg',
      'Helping hands are better than praying lips.The best way to find you is to lose yourself in the service of others.',
      'Helping hands are better than praying lips.The best way to find you is to lose yourself in the service of others.'
    )
  `;

  console.log("🌱 Seeding nss_gallery (carousel slides)...");
  const slides = [
    {
      title: "PULSE POLIO",
      imageUrl:
        "https://jntugvcev.edu.in/wp-content/uploads/2021/01/WhatsApp-Image-2021-01-11-at-15.48.17-1.jpeg",
    },
    {
      title: "PULSE POLIO",
      imageUrl:
        "https://jntugvcev.edu.in/wp-content/uploads/2021/01/WhatsApp-Image-2021-01-11-at-16.42.54-1.jpeg",
    },
    {
      title: "3 day-10",
      imageUrl: "https://jntugvcev.edu.in/wp-content/uploads/2020/08/3-day-10-scaled.jpg",
    },
    {
      title: "3 day 17",
      imageUrl: "https://jntugvcev.edu.in/wp-content/uploads/2020/08/3-day-17-scaled.jpg",
    },
    {
      title: "cancer day1",
      imageUrl: "https://jntugvcev.edu.in/wp-content/uploads/2020/08/cancer-day1-scaled.jpg",
    },
    {
      title: "cancerday 2",
      imageUrl: "https://jntugvcev.edu.in/wp-content/uploads/2020/08/cancerday-2.jpg",
    },
    {
      title: "cancer day 3",
      imageUrl: "https://jntugvcev.edu.in/wp-content/uploads/2020/08/cancer-day-3-scaled.jpg",
    },
    {
      title: "cancer day4",
      imageUrl: "https://jntugvcev.edu.in/wp-content/uploads/2020/08/cancer-day4.jpg",
    },
    {
      title: "3 day-9",
      imageUrl: "https://jntugvcev.edu.in/wp-content/uploads/2020/08/3-day-9-scaled.jpg",
    },
  ];

  for (const s of slides) {
    await sql`
      INSERT INTO nss_gallery (title, image_url)
      VALUES (${s.title}, ${s.imageUrl})
    `;
  }

  console.log("🌱 Seeding nss_special_camp (7 days)...");
  const camp = [
    {
      day: "Day 1 (06-03-2020)",
      description: "Survey was conducted to know the exiting problems in the villages",
    },
    {
      day: "Day 2 (07-03-2020)",
      description:
        "Sanitation programmed was conducted at Anganvadi schools to improve the cleanliness of in and around the school",
    },
    {
      day: "Day 3 (08-03-2020)",
      description:
        "Rally was conducted against the open defecation and volunteers canvassed the problems of open defecation by distributing the pamphlets to individual house in the village",
    },
    {
      day: "Day 4 (09-03-2020)",
      description:
        "Rally was conducted against the consumption of alcohol and volunteers canvassed the problems of consumption of alcohol by distributing the pamphlets to individual house in the village",
    },
    {
      day: "Day 5 (10-03-2020)",
      description:
        "Blood donation camp was organized, and free dental check up was conducted to villagers and school children",
    },
    {
      day: "Day 6 (11-03-2020)",
      description:
        "Motivation classes was conducted to the primary school children by NSS volunteers",
    },
    {
      day: "Day 7 (12-03-2020)",
      description:
        "Awareness program on corona virus was conducted to the villagers by distributing the pamphlets.",
    },
  ];

  for (const c of camp) {
    await sql`
      INSERT INTO nss_special_camp (day, description)
      VALUES (${c.day}, ${c.description})
    `;
  }

  console.log("🌱 Seeding nss_activities (40 activities)...");
  const activities = [
    {
      sNo: 1,
      activity: "Army Day -Fund Raising to Army",
      date: "12-05-2013",
      venue: "JUTUK UCEV",
      desc: "NSS Volunteers of JNTUK UCEV cell were actively participated to collect the fund for army from students, staff and citizens of Vizianagaram",
    },
    {
      sNo: 2,
      activity: "Clean and Green",
      date: "13-12-2013 & 14-12-13",
      venue: "JNTUK UCEV",
      desc: "NSS Volunteers of JNTUK UCEV cell were actively participated in clean and green programme along with the support of students and staff of vizianagaram",
    },
    {
      sNo: 3,
      activity: "Voter Enrollment drive",
      date: "18-12-2013",
      venue: "JNTUK UCEV",
      desc: "Awareness programme on importance of casting of vote and student enrollment of EPIC CARD conducted to the students of JNTUK UCEV by inviting Sri. Venkata Rao , RDO, Vizianagaram district as Chief guest to this programme. All NSS volunteers, students and Staff participated in this event.",
    },
    {
      sNo: 4,
      activity: "Adhar card drive",
      date: "08-02-2014",
      venue: "JNTUK UCEV",
      desc: "A programme of enrollment of adhar card conducted for the students of JNTUK UCEV .Nearly 50 students were applied for new adhar cards",
    },
    {
      sNo: 5,
      activity: "Voter Enrollment drive",
      date: "04-03-2014",
      venue: "JNTUK UCEV",
      desc: "Programme for enrollment of voter card to the students and staff of JNTUK UCEV for casting of their vote in the elections.",
    },
    {
      sNo: 6,
      activity: "Ignite the youth",
      date: "23-06-2014",
      venue: "JNTUK UCEV",
      desc: "A programme of “ Ignite the youth “ conducted to the students of JNTUK UCEV for inspiring the students about their strengths and their role in the development of country . Principal Prof.G. Yesu Ratnam. Bramakumaris university representative B.K Geetha was participated in this event and motivated the students. Students of JNTUK UCEV, NSS Volunteers and faculty were actively participated in this event",
    },
    {
      sNo: 7,
      activity: "Blood donation camp",
      date: "22-07-2014",
      venue: "Maha Raja PG college",
      desc: "Eenadu News and Media conducted blood donation camp in the vizianagaram district to enhance the blood collection units in the district.NSS volunteers of JNTUK UCEV participated in this event and donate the 30 units of blood",
    },
    {
      sNo: 8,
      activity: "NSS day",
      date: "24-09-2014",
      venue: "JNTUK UCEV",
      desc: "National NSS day celebrated in JNTUK UCEV campus by conducting plantation in the campus",
    },
    {
      sNo: 9,
      activity: "Plantation Programme",
      date: "26-09-2014 and 27-09-2014",
      venue: "JNTUK UCEV",
      desc: "Plantation programme conducted by adopting the plant by staff and students of JNTUK UCEV",
    },
    {
      sNo: 10,
      activity: "Swacch Bharat",
      date: "02-10-2014",
      venue: "JNTUK UCEV",
      desc: "Swacch Bharat programme was conducted in JNTUK UCEV campus to promote the theme of Swacch Bharat proposed by Prime Minister Narendra Modi.",
    },
    {
      sNo: 11,
      activity: "Repositioning trees in JNTUK UCEV due to effect of HUD-HUD cyclone",
      date: "19-10-2014",
      venue: "JNTUK UCEV",
      desc: "Trees were repositioned after the effect of HUDHUD cyclone by JNTU UCEV NSS unit for maintenance of green cover in the campus",
    },
    {
      sNo: 12,
      activity: "National Education day",
      date: "11-11-2014",
      venue: "JNTUK UCEV",
      desc: "National Education day celebrated in view of birthday of Moulana Abdul kalam by conducting competitions among the students",
    },
    {
      sNo: 13,
      activity: "Old clothes distribution",
      date: "23-01-2015",
      venue: "Vizianagaram",
      desc: "Old clothes were distributed to poor people by collecting the clothes from the students of JNTUK UCEV",
    },
    {
      sNo: 14,
      activity: "2K run on eve National voters day",
      date: "24-01-2015",
      venue: "1.5 Km JNTUK Junction",
      desc: "2k run was conducted to promote the theme of National voters day",
    },
    {
      sNo: 15,
      activity: "Distribution of buttermilk and cool water at chalivendram",
      date: "01-05-17 to 31-05-2017",
      venue: "1.5 km JNTUK Junction",
      desc: "Cooling water was supplied to by passers at JNTUK junction to overcome the severe heat of hot summer",
    },
    {
      sNo: 16,
      activity: "International Yoga Day-2017",
      date: "21-06-2017",
      venue: "JNTUK UCEV",
      desc: "NSS unit of JNTUK UCEV, Vizianagaram has organized the International Yoga Day event on 21st June 2017 successfully with the participation of staff and students of the institute to create the awareness of importance of yoga.",
    },
    {
      sNo: 17,
      activity: "Plantation Programme",
      date: "14-07-2017",
      venue: "JNTUK UCEV",
      desc: "To improve the green cover and to have the best natural defense system against air pollution in the University college campus, Plantation program was conducted in the campus. All the staff and students of JNTUK-UCEV, Vizianagaram participated in the plantation programme.",
    },
    {
      sNo: 18,
      activity: "Dental campaign",
      date: "09-11-2017",
      venue: "JNTUK UCEV",
      desc: "Free medical dental campaign was arranged at JNTUK UCEV. All the staff members and students of JNTUK-UCEV utilized this facility.",
    },
    {
      sNo: 19,
      activity: "LLR mela",
      date: "29-11-2017",
      venue: "JNTUK UCEV",
      desc: "In the interest of road safety, the state transport department has conducted an awareness programme and also issued LLRs to the eligible age group students at the door steps of the college. Online test was conducted in the computer lab of the college.",
    },
    {
      sNo: 20,
      activity: "Awareness Programme on Road Safety",
      date: "06-01-2018",
      venue: "JNTUK UCEV",
      desc: "As a part of creating awareness on Road safety, Life style disorders for students in Engineering colleges, NSS Unit of JNTUK UCEV, Vizianagaram organised an Awareness programme on Road safety, Life skills and Indian Traditional Medical System for improving their quality of life.",
    },
    {
      sNo: 21,
      activity: "International day of Yoga-2018",
      date: "21-06-2018",
      venue: "JNTUK UCEV",
      desc: "NSS unit of JNTUK UCEV, Vizianagaram has organized the International Yoga Day event on 21st June 2018 with the participation of staff and students of the institute to create the awareness of importance of doing yoga",
    },
    {
      sNo: 22,
      activity: "Plantation programme",
      date: "20-07-2018",
      venue: "JNTUK UCEV",
      desc: "Plantation programme was conducted in the campus to improve the green cover of the institution",
    },
    {
      sNo: 23,
      activity: "Swachhta Pakhwada",
      date: "02-10-2018",
      venue: "JNTUK UCEV",
      desc: "Swachhta Pakhwada is observed in befitting manner by the NSS unit of JNTUK UCEV and conducted various Swachh Bharat activities from 01-10-2018 to 15-10-2018. All the faculty and students of JNTUK UCEV,Vizianagaram voluntarily participated in the Swachhta Pakhwada activities in the campus of JNTUK UCEV 02nd Oct 2018.",
    },
    {
      sNo: 24,
      activity: "Service camp to tithli cyclone affected Zone in Srikakulam.",
      date: "16-10-2018",
      venue: "Srikakulam Affected Zone",
      desc: "JNTUK UCEV, NSS volunteering students and staff members served the cyclone affected zone in Srikakulam district on 16-10-2018 in the village Sahalalaputtika near to Sompeta in Srikakulam district.",
    },
    {
      sNo: 25,
      activity: "Awareness programme on digital products",
      date: "01-12-2018",
      venue: "JNTUK UCEV",
      desc: "An awareness programme on digital products by SBI, Vizianagaram is conducted to the faculty, non teaching staff and students of JNTUK UCEV as part of anniversary celebrations of SBI unique mobile application product.",
    },
    {
      sNo: 26,
      activity: "District Youth Parliament",
      date: "17-01-19 to 19-01-2019",
      venue: "JNTUK UCEV",
      desc: "JNTUK UCEV NSS unit is selected as nodal centre for District Youth Parliament (DYP) programme at Vizianagaram district level. Preliminary rounds of screening were conducted to select youth for participation in the DYP. NSS volunteers contributed their services for the screening and mock youth parliament programme.",
    },
    {
      sNo: 27,
      activity: "Mock Youth Parliament Programme",
      date: "25-01-2019",
      venue: "JNTUK UCEV",
      desc: "The selected candidates in the screening procedure were finally adjudged by a five (5) member Jury for participation in the State Level Youth Parliament",
    },
    {
      sNo: 28,
      activity: "Candle light march",
      date: "20-02-2019",
      venue: "JNTUK UCEV",
      desc: "In order to pay tribute to the Indian army soldiers who sacrificed their lives in the Pulwama terrorist attack, a candlelight march was conducted on 20-02-2019.",
    },
    {
      sNo: 29,
      activity: "Blood donation camp",
      date: "12-03-2019",
      venue: "JNTUK UCEV",
      desc: "In order to reduce the scarcity of blood and ensure availability of safe and quality blood in the Govt. Hospitals of Vizianagaram District, Voluntary blood donation camps was conducted by Govt. Institutions in the District. Around 80 members donated blood in the blood donation camp is organized at Dispensary, JNTUK UCEV.",
    },
    {
      sNo: 30,
      activity: "Plantation programme",
      date: "12-07-2019",
      venue: "JNTUK UCEV",
      desc: "Plantation programme was conducted in the campus for improving the green cover and to have the best natural defense system against air pollution in the University college campus.",
    },
    {
      sNo: 31,
      activity: "FIT INDIA programme",
      date: "29-08-2019",
      venue: "JNTUK UCEV",
      desc: "Fit India programme was organised to create the awareness on importance of health by conducting march/rally with relevant banners and slogans on fitness from JNTU UCEV campus to highway junction .All the staff and students were participated in this event",
    },
    {
      sNo: 32,
      activity: "Blood donation camp",
      date: "30-11-2019",
      venue: "JNTUK UCEV",
      desc: "In order to reduce the scarcity of blood and ensure availability of safe and quality blood in the Govt. Hospitals of Vizianagaram District, Voluntary blood donation camps were conducted by Govt. Institutions in the District. 80 members donated blood in the blood donation camp is organized at Dispensary, JNTUK UCEV.",
    },
    {
      sNo: 33,
      activity: "Blood donation camp",
      date: "06-12-2019",
      venue: "Collectorate Office, Vizianagaram",
      desc: "In order to reduce the scarcity of blood and ensure availability of safe and quality blood in the Govt. Hospitals of Vizianagaram District, Voluntary blood donation camps were conducted at district collectrate",
    },
    {
      sNo: 34,
      activity: "National Girl Child Day",
      date: "24-01-2019",
      venue: "JNTUK UCEV",
      desc: "NSS unit cell JNTUK UCEV Vizianagaram has celebrated National Girl Child Day 2020 with the theme of Bate Bachao Bate Padhao on 24-01-2020 by conducting WALKATHON from AB-I Block to High way junction. The faculty and students were participated in the programme.",
    },
    {
      sNo: 35,
      activity: "World cancer day",
      date: "04-02-2020",
      venue: "JNTUK UCEV",
      desc: "Awareness programme on Cancer prevention was conducted on 04-02-2020 to all the staff members and I Year B.Tech students of JNTUK UCEV by arranging talks with Dr. Sowjanya and Dr.Swarna Latha",
    },
    {
      sNo: 36,
      activity: "Special Camp in Dwarapudi Village",
      date: "06-03-2020 to 12-03-2020",
      venue: "Dwarapudi Village",
      desc: "Special camp was conducted from 06-03-2020 to 12-03-2020 at Dwarapudi village in Vizianagaram district to conduct the awareness programs to the villagers.",
    },
    {
      sNo: 37,
      activity: "Awareness of corona virus in campus",
      date: "18-03-2020",
      venue: "JNTUK UCEV",
      desc: "Awareness program on corona virus is conducted in the campus by displaying the posters in the campus",
    },
    {
      sNo: 38,
      activity: "International Yoga Day",
      date: "21-06-2020",
      venue: "JNTUK UCEV",
      desc: "International Yoga day 2021 was celebrated in the campus by conducting programs from 18-06-2020 to 20-06-2020 through online and live sessions. On the international yoga day 21-06-2020, celebrated at home with the theme of Yoga@home and yoga with family members",
    },
    {
      sNo: 39,
      activity: "Plastic free day",
      date: "03-07-2020",
      venue: "JNTUK UCEV",
      desc: "Online quiz was conducted to spread the plastic free day on 03-07-2020 to the faculty and students of India.705 members are participated throughout the country and E- certificate was provided to all the participants",
    },
    {
      sNo: 40,
      activity: "PULSE POLIO",
      date: "11-01-2020",
      venue: "JNTUK UCEV",
      desc: "To ensure population immunity in the country by observing quality pulse polio rounds and thereby helping the country to remain polio-free, by the direction NSS unit of JNTUK UCEV organized pulse polio campaign by doing the rally and distributed pamphlets to the people of Gotlam village in Vizianagaram district. NSS volunteers actively participated and make the event fruitful.",
    },
  ];

  for (const a of activities) {
    await sql`
      INSERT INTO nss_activities (s_no, activity, date_conducted, venue, description)
      VALUES (${a.sNo}, ${a.activity}, ${a.date}, ${a.venue}, ${a.desc})
    `;
  }

  console.log("✅ Seeding completed.");
  process.exit(0);
}

main().catch(console.error);
