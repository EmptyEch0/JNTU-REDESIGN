export const SITE = {
  name: "JNTU-GV CEV",
  fullName: "JNTU-GV College of Engineering Vizianagaram",
  tagline: "Engineering Tomorrow, Together",
  shortDesc:
    "A constituent college of Jawaharlal Nehru Technological University Gurajada Vizianagaram — shaping engineers, scholars and changemakers since inception.",
  contact: {
    address: "Dwarapudi, Vizianagaram – 535003, Andhra Pradesh, India",
    phone: "+91 8922 244 100",
    email: "principal@jntugv.edu.in",
  },
};

export const NAV: {
  label: string;
  to?: string;
  groups?: { title: string; items: { label: string; to: string; desc?: string }[] }[];
}[] = [
  { label: "Home", to: "/" },
  {
    label: "About",
    groups: [
      {
        title: "Institution",
        items: [
          { label: "About Institution", to: "/about/institution", desc: "History & administration of JNTU-GV CEV" },
          { label: "Vision & Mission", to: "/about/vision-mission", desc: "Our purpose and guiding principles" },
        ],
      },
      {
        title: "Region",
        items: [
          { label: "About JNTUK", to: "/about/jntuk", desc: "The parent university" },
          { label: "About Vizianagaram", to: "/about/vizianagaram", desc: "The city of victory" },
          { label: "How to Reach", to: "/about/how-to-reach", desc: "Directions & transport" },
        ],
      },
    ],
  },
  {
    label: "Academics",
    groups: [
      {
        title: "Programs",
        items: [
          { label: "Undergraduate", to: "/academics", desc: "B.Tech across 7 disciplines" },
          { label: "Postgraduate", to: "/academics", desc: "M.Tech & MBA programs" },
          { label: "Doctoral", to: "/academics", desc: "Ph.D research streams" },
        ],
      },
      {
        title: "Resources",
        items: [
          { label: "Curriculum", to: "/academics", desc: "Outcome-based learning" },
          { label: "Calendar", to: "/academics", desc: "Academic schedule" },
          { label: "Examinations", to: "/academics", desc: "Evaluation framework" },
        ],
      },
    ],
  },
  {
    label: "Departments",
    groups: [
      {
        title: "Engineering",
        items: [
          { label: "Computer Science (CSE)", to: "/departments" },
          { label: "Electronics (ECE)", to: "/departments" },
          { label: "Electrical (EEE)", to: "/departments" },
          { label: "Mechanical", to: "/departments" },
        ],
      },
      {
        title: "Allied",
        items: [
          { label: "Civil", to: "/departments" },
          { label: "Information Technology", to: "/departments" },
          { label: "MBA", to: "/departments" },
          { label: "Sciences & Humanities", to: "/departments" },
        ],
      },
    ],
  },
  {
    label: "Facilities",
    groups: [
      {
        title: "Living",
        items: [
          { label: "Hostels", to: "/hostels", desc: "UG & PG residences" },
          { label: "Dispensary", to: "/dispensary", desc: "On-campus health" },
          { label: "Transport", to: "/campus-life", desc: "Bus & shuttle network" },
        ],
      },
      {
        title: "Learning",
        items: [
          { label: "Library", to: "/library", desc: "Knowledge commons" },
          { label: "Sports Complex", to: "/sports", desc: "Indoor & outdoor" },
          { label: "Campus Life", to: "/campus-life", desc: "Clubs & events" },
        ],
      },
    ],
  },
  {
    label: "Student Corner",
    groups: [
      {
        title: "Initiatives",
        items: [
          { label: "NSS", to: "/nss", desc: "Service & community" },
          { label: "Women Empowerment Cell", to: "/women-empowerment" },
          { label: "Gallery", to: "/gallery", desc: "Moments on campus" },
        ],
      },
      {
        title: "Information",
        items: [
          { label: "Notices", to: "/notices", desc: "Latest announcements" },
          { label: "Admissions", to: "/admissions" },
          { label: "Contact", to: "/contact" },
        ],
      },
    ],
  },
  {
    label: "Placements",
    to: "/placements",
  },
  {
    label: "R&D",
    to: "/rd-cell",
  },
];

export const STATS = [
  { value: 1450, label: "Students" },
  { value: 109, label: "UG Boys Rooms" },
  { value: 96, label: "PG Boys Rooms" },
  { value: 113, label: "UG Girls Rooms" },
];

export const DEPARTMENTS = [
  { code: "CSE", name: "Computer Science & Engineering", desc: "AI, systems, software, data.", accent: "from-[oklch(0.45_0.20_265)] to-[oklch(0.35_0.18_285)]" },
  { code: "ECE", name: "Electronics & Communication", desc: "VLSI, signals, embedded.", accent: "from-[oklch(0.50_0.18_220)] to-[oklch(0.35_0.16_260)]" },
  { code: "EEE", name: "Electrical & Electronics", desc: "Power, control, energy.", accent: "from-[oklch(0.55_0.18_60)] to-[oklch(0.40_0.18_30)]" },
  { code: "MECH", name: "Mechanical Engineering", desc: "Design, manufacturing, thermal.", accent: "from-[oklch(0.45_0.10_30)] to-[oklch(0.30_0.05_250)]" },
  { code: "CIVIL", name: "Civil Engineering", desc: "Structures, geotech, transport.", accent: "from-[oklch(0.50_0.12_140)] to-[oklch(0.32_0.10_180)]" },
  { code: "IT", name: "Information Technology", desc: "Networks, cloud, security.", accent: "from-[oklch(0.50_0.18_300)] to-[oklch(0.35_0.16_270)]" },
  { code: "MBA", name: "Management Studies", desc: "Strategy, finance, marketing.", accent: "from-[oklch(0.55_0.15_40)] to-[oklch(0.40_0.18_15)]" },
];

export const RECRUITERS = [
  "TCS", "Infosys", "Wipro", "Cognizant", "Accenture", "Capgemini",
  "Tech Mahindra", "HCL", "L&T", "Hexaware", "Mindtree", "Mphasis",
  "Deloitte", "Amazon", "ZOHO",
];

// Flat search index for the Dynamic Island quick-search
export const SEARCH_INDEX: { label: string; to: string; group: string; keywords?: string }[] = [
  { label: "Home", to: "/", group: "Pages" },
  { label: "About", to: "/about", group: "Pages" },
  { label: "Academics", to: "/academics", group: "Pages", keywords: "programs curriculum ug pg phd" },
  { label: "Departments", to: "/departments", group: "Pages" },
  { label: "Admissions", to: "/admissions", group: "Pages", keywords: "apply enroll" },
  { label: "Contact", to: "/contact", group: "Pages" },
  { label: "Notices", to: "/notices", group: "Pages", keywords: "announcements circulars" },
  { label: "Gallery", to: "/gallery", group: "Pages" },
  { label: "Placements", to: "/placements", group: "Pages", keywords: "jobs recruiters offers" },
  { label: "R&D Cell", to: "/rd-cell", group: "Pages", keywords: "research development funding" },

  { label: "Computer Science (CSE)", to: "/departments", group: "Departments", keywords: "cse software ai" },
  { label: "Electronics (ECE)", to: "/departments", group: "Departments", keywords: "vlsi signals" },
  { label: "Electrical (EEE)", to: "/departments", group: "Departments", keywords: "power energy" },
  { label: "Mechanical", to: "/departments", group: "Departments", keywords: "design thermal" },
  { label: "Civil", to: "/departments", group: "Departments", keywords: "structures geotech" },
  { label: "Information Technology", to: "/departments", group: "Departments", keywords: "it networks cloud" },
  { label: "MBA", to: "/departments", group: "Departments", keywords: "management business" },

  { label: "Hostels", to: "/hostels", group: "Facilities", keywords: "rooms accommodation" },
  { label: "Library", to: "/library", group: "Facilities", keywords: "books reading" },
  { label: "Sports Complex", to: "/sports", group: "Facilities", keywords: "cricket gym fitness" },
  { label: "Dispensary", to: "/dispensary", group: "Facilities", keywords: "health medical clinic" },
  { label: "Campus Life", to: "/campus-life", group: "Facilities", keywords: "clubs events" },

  { label: "NSS", to: "/nss", group: "Student Corner", keywords: "service community" },
  { label: "Women Empowerment Cell", to: "/women-empowerment", group: "Student Corner" },
];
