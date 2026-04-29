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
  { code: "CSE", name: "Computer Science & Engineering", desc: "AI, systems, software, data." },
  { code: "ECE", name: "Electronics & Communication", desc: "VLSI, signals, embedded." },
  { code: "EEE", name: "Electrical & Electronics", desc: "Power, control, energy." },
  { code: "MECH", name: "Mechanical Engineering", desc: "Design, manufacturing, thermal." },
  { code: "CIVIL", name: "Civil Engineering", desc: "Structures, geotech, transport." },
  { code: "IT", name: "Information Technology", desc: "Networks, cloud, security." },
  { code: "MBA", name: "Management Studies", desc: "Strategy, finance, marketing." },
];

export const RECRUITERS = [
  "TCS", "Infosys", "Wipro", "Cognizant", "Accenture", "Capgemini",
  "Tech Mahindra", "HCL", "L&T", "Hexaware", "Mindtree", "Mphasis",
  "Deloitte", "Amazon", "ZOHO",
];
