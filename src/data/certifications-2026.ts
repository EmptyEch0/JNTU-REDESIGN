export interface CertificationRecord {
  id: string; // e.g., 'JNTUGV-ED26-001'
  slug: string;
  name: string;
  rollNumber?: string;
  honorific?: string;
  department: string;
  college: string;
  university: string;
  title: string;
  role: string;
  project: string;
  event: string;
  eventDate: string;
  formattedDate: string;
  certificateType: "Appreciation" | "Excellence" | "Participation" | "Merit";
  citation: string;
  status: "VERIFIED" | "PENDING" | "REVOKED";
  verificationHash: string;
  securityCode: string;
  imageSrc: string;
  studentPhoto?: string;
  skills: string[];
  signatories: {
    title: string;
    designation: string;
    institution?: string;
  }[];
  highlights: {
    label: string;
    value: string;
  }[];
  verificationUrl?: string;
  redirectUrl?: string;
  isExternalRedirect?: boolean;
}

const COMMON_SIGNATORIES = [
  { title: "HOD", designation: "Head of the Department" },
  { title: "Principal", designation: "JNTU-GV CEV" },
  { title: "Registrar", designation: "JNTU-GV Vizianagaram" },
  { title: "Vice-Chancellor", designation: "JNTU-GV Vizianagaram" },
];

const COMMON_HIGHLIGHTS = [
  { label: "Initiative", value: "Summer Internship — Web Modernization Cell" },
  { label: "National Mission", value: "Viksit Bharat @2047 (Self-Reliant India)" },
  { label: "Occasion", value: "National Engineer's Day 2026" },
  { label: "Issuing Authority", value: "JNTU-GV Vizianagaram (CEV)" },
  { label: "Authenticity", value: "100% Officially Verified" },
];

const COMMON_SKILLS = [
  "Modern Web Architecture",
  "UI/UX Systems",
  "Full-Stack Development",
  "Viksit Bharat @2047 Initiative",
  "Performance Tuning",
  "Responsive Digital Ecosystems",
];

export interface MemberRosterEntry {
  name: string;
  fullName?: string;
  rollNumber?: string;
  department?: string;
  project?: string;
  imageSrc?: string;
}

export const MEMBERS_ROSTER: MemberRosterEntry[] = [
  // 1 to 22 Information Technology Students with Uploaded Official Certificates
  {
    name: "M Likhith Kumar",
    fullName: "Mankala Likhith Kumar",
    department: "Information Technology",
    project: "Development & Modernization of JNTUGVCEV Official Web Portal",
    imageSrc: "/images/certifications/JNTUGV-ED26-001-mankala-likhith-kumar.png",
  },
  {
    name: "P Sai Vamsi",
    fullName: "Panchangam Sai Vamsi",
    department: "Information Technology",
    project: "Development & Modernization of JNTUGVCEV Official Web Portal",
    imageSrc: "/images/certifications/JNTUGV-ED26-002-panchangam-sai-vamsi.png",
  },
  {
    name: "P Anitha",
    fullName: "Anitha Palavalasa",
    department: "Information Technology",
    project: "Development & Modernization of JNTUGVCEV Official Web Portal",
    imageSrc: "/images/certifications/JNTUGV-ED26-003-anitha-palavalasa.png",
  },
  {
    name: "Ch Sai Rupini",
    fullName: "Chitikesi Sai Rupini",
    department: "Information Technology",
    project: "Development & Modernization of JNTUGVCEV Official Web Portal",
    imageSrc: "/images/certifications/JNTUGV-ED26-004-chitikesi-sai-rupini.png",
  },
  {
    name: "B Akhil",
    fullName: "Botcha Akhil Babu",
    department: "Information Technology",
    project: "Portal for Affiliated Colleges Database",
    imageSrc: "/images/certifications/JNTUGV-ED26-005-botcha-akhil-babu.png",
  },
  {
    name: "P Jaya Kumar",
    fullName: "Patchigulla Jaya Kumar",
    department: "Information Technology",
    project: "Database Management System for Student Admissions",
    imageSrc: "/images/certifications/JNTUGV-ED26-006-patchigulla-jaya-kumar.png",
  },
  {
    name: "Y Tejaswini",
    fullName: "Yerra Tejaswini",
    department: "Information Technology",
    project: "Database Management System for Student Admissions",
    imageSrc: "/images/certifications/JNTUGV-ED26-007-yerra-tejaswini.png",
  },
  {
    name: "Lavanya D",
    fullName: "Datti Lavanya",
    department: "Information Technology",
    project: "Database Management System for Student Admissions",
    imageSrc: "/images/certifications/JNTUGV-ED26-008-datti-lavanya.png",
  },
  {
    name: "Sk Asma",
    fullName: "Shaik Asma",
    department: "Information Technology",
    project: "Academic Ledger Portal",
    imageSrc: "/images/certifications/JNTUGV-ED26-009-shaik-asma.png",
  },
  {
    name: "K Pravallika",
    fullName: "Kundum Pravallika",
    department: "Information Technology",
    project: "Academic Ledger Portal",
    imageSrc: "/images/certifications/JNTUGV-ED26-010-kundum-pravallika.png",
  },
  {
    name: "D Gnaneswar",
    fullName: "Gnaneswar Dowluri",
    department: "Information Technology",
    project: "Faculty & Staff Leave Management System",
    imageSrc: "/images/certifications/JNTUGV-ED26-011-gnaneswar-dowluri.png",
  },
  {
    name: "G Nandini",
    fullName: "Nandini Gara",
    department: "Information Technology",
    project: "Faculty & Staff Leave Management System",
    imageSrc: "/images/certifications/JNTUGV-ED26-012-nandini-gara.png",
  },
  {
    name: "Y Naveen",
    fullName: "Yelamanchili Naveen",
    department: "Information Technology",
    project: "Event Management and Report Generation",
    imageSrc: "/images/certifications/JNTUGV-ED26-013-yelamanchili-naveen.png",
  },
  {
    name: "Lavanya Y",
    fullName: "Yaindum Lavanya",
    department: "Information Technology",
    project: "Event Management and Report Generation",
    imageSrc: "/images/certifications/JNTUGV-ED26-014-yaindum-lavanya.png",
  },
  {
    name: "Shabira Begum",
    fullName: "Shabira Begum",
    department: "Information Technology",
    project: "Emerging Technologies Learning Platform",
    imageSrc: "/images/certifications/JNTUGV-ED26-015-shabira-begam.png",
  },
  {
    name: "Sailaja S",
    fullName: "Surla Sailaja",
    department: "Information Technology",
    project: "Emerging Technologies Learning Platform",
    imageSrc: "/images/certifications/JNTUGV-ED26-016-surla-sailaja.png",
  },
  {
    name: "T Chaitanya Lakshmi",
    fullName: "Teki Chaitanya Lakshmi",
    department: "Information Technology",
    project: "Convocation Management System",
    imageSrc: "/images/certifications/JNTUGV-ED26-017-teki-chaitanya-lakshmi.png",
  },
  {
    name: "Mounika D",
    fullName: "Datti Mounika",
    department: "Information Technology",
    project: "Convocation Management System",
    imageSrc: "/images/certifications/JNTUGV-ED26-018-datti-mounika.png",
  },
  {
    name: "Y Ghana Satya Karthik",
    fullName: "Yendluri Ghana Sathya Karthik",
    department: "Information Technology",
    project: "Smart Digital Library and Barcode Management System",
    imageSrc: "/images/certifications/JNTUGV-ED26-019-yendluri-ghana-sathya-karthik.png",
  },
  {
    name: "V Charu Brunda Hasini",
    fullName: "Vallabhuni Charu Brunda Hasini",
    department: "Information Technology",
    project: "Smart Digital Library and Barcode Management System",
    imageSrc: "/images/certifications/JNTUGV-ED26-020-vallabhuni-charu-brunda-hasini.png",
  },
  {
    name: "Yuva Teja",
    fullName: "Yuva Teja Gaduthuri",
    department: "Information Technology",
    project: "JNTUGVCEV Records Digital System",
    imageSrc: "/images/certifications/JNTUGV-ED26-021-yuva-teja-gaduthuri.png",
  },
  {
    name: "Sahithya",
    fullName: "Sahithya Behara",
    department: "Information Technology",
    project: "JNTUGVCEV Records Digital System",
    imageSrc: "/images/certifications/JNTUGV-ED26-022-sahithya-behara.png",
  },
  // 23 to 46 Civil Engineering / Hostel Repair & Maintenance Certificates
  {
    name: "B. Chakradhar",
    fullName: "Buddala Chakradhar",
    department: "Civil Engineering",
    project: "Repair & Maintenance of Hostel Buildings",
    imageSrc: "/images/certifications/JNTUGV-ED26-023-buddala-chakradhar.jpg",
  },
  {
    name: "D. Yaswanth",
    fullName: "Duppalapudi Yaswanth",
    department: "Civil Engineering",
    project: "Repair & Maintenance of Hostel Buildings",
    imageSrc: "/images/certifications/JNTUGV-ED26-024-duppalapudi-yaswanth.jpg",
  },
  {
    name: "G. Anil Kumar",
    fullName: "Guntamukkala Anil Kumar",
    department: "Civil Engineering",
    project: "Repair & Maintenance of Hostel Buildings",
    imageSrc: "/images/certifications/JNTUGV-ED26-025-guntamukkala-anil-kumar.jpg",
  },
  {
    name: "J. Sai Saketh",
    fullName: "Jampana Sai Saketh",
    department: "Civil Engineering",
    project: "Repair & Maintenance of Hostel Buildings",
    imageSrc: "/images/certifications/JNTUGV-ED26-026-jampana-sai-saketh.jpg",
  },
  {
    name: "S. Praveen",
    fullName: "Seekolu Praveen",
    department: "Civil Engineering",
    project: "Repair & Maintenance of Hostel Buildings",
    imageSrc: "/images/certifications/JNTUGV-ED26-027-seekolu-praveen.jpg",
  },
  {
    name: "T. Surya Prakash",
    fullName: "Thirumalasetti Surya Prakash",
    department: "Civil Engineering",
    project: "Repair & Maintenance of Hostel Buildings",
    imageSrc: "/images/certifications/JNTUGV-ED26-028-thirumalasetti-surya-prakash.jpg",
  },
  {
    name: "M. Uma Mahesh",
    fullName: "Mutchi Uma Mahesh",
    department: "Civil Engineering",
    project: "Repair & Maintenance of Hostel Buildings",
    imageSrc: "/images/certifications/JNTUGV-ED26-029-mutchi-uma-mahesh.jpg",
  },
  {
    name: "Ch. Siddartha",
    fullName: "Chollangi Nuthana Siddardha",
    department: "Civil Engineering",
    project: "Repair & Maintenance of Hostel Buildings",
    imageSrc: "/images/certifications/JNTUGV-ED26-030-chollangi-nuthana-siddardha.jpg",
  },
  {
    name: "K. Rama Swamy",
    fullName: "Kunchanapalli Janaki Rama Swamy",
    department: "Civil Engineering",
    project: "Repair & Maintenance of Hostel Buildings",
    imageSrc: "/images/certifications/JNTUGV-ED26-031-kunchanapalli-janaki-rama-swamy.jpg",
  },
  {
    name: "Y. Pavan Kumar",
    fullName: "Yalla Pavan Kumar",
    department: "Civil Engineering",
    project: "Repair & Maintenance of Hostel Buildings",
    imageSrc: "/images/certifications/JNTUGV-ED26-032-yalla-pavan-kumar.jpg",
  },
  {
    name: "M. Madhan Kumar",
    fullName: "Maradana Madhan Kumar",
    department: "Civil Engineering",
    project: "Repair & Maintenance of Hostel Buildings",
    imageSrc: "/images/certifications/JNTUGV-ED26-033-maradana-madhan-kumar.jpg",
  },
  {
    name: "M. Ajay",
    fullName: "Mamuduri Ajay",
    department: "Civil Engineering",
    project: "Repair & Maintenance of Hostel Buildings",
    imageSrc: "/images/certifications/JNTUGV-ED26-034-mamuduri-ajay.jpg",
  },
  {
    name: "N. Vishal",
    fullName: "Nagavamsapu Vishal",
    department: "Civil Engineering",
    project: "Repair & Maintenance of Hostel Buildings",
    imageSrc: "/images/certifications/JNTUGV-ED26-035-nagavamsapu-vishal.jpg",
  },
  {
    name: "T. Ananda Harsha",
    fullName: "Turram Anand Harsha Dora",
    department: "Civil Engineering",
    project: "Repair & Maintenance of Hostel Buildings",
    imageSrc: "/images/certifications/JNTUGV-ED26-036-turram-anand-harsha-dora.jpg",
  },
  {
    name: "K. Manogna Sasidhar",
    fullName: "Kuppili Manogna Sesidhar",
    department: "Civil Engineering",
    project: "Repair & Maintenance of Hostel Buildings",
    imageSrc: "/images/certifications/JNTUGV-ED26-037-kuppili-manogna-sesidhar.jpg",
  },
  {
    name: "R.V. Sriteja",
    fullName: "Rayudu Venkata Sri Teja",
    department: "Civil Engineering",
    project: "Repair & Maintenance of Hostel Buildings",
    imageSrc: "/images/certifications/JNTUGV-ED26-038-rayudu-venkata-sri-teja.jpg",
  },
  // 39 to 46 with Roll Numbers
  {
    name: "KOLATI SOWMYA SRI",
    fullName: "Kollati Swomya Sri",
    rollNumber: "23VV1A0109",
    department: "Civil Engineering",
    project: "Repair & Maintenance of Hostel Buildings",
    imageSrc: "/images/certifications/JNTUGV-ED26-039-kollati-swomya-sri.jpg",
  },
  {
    name: "KUNA CHANDRIIKA",
    fullName: "Kuna Chandrika",
    rollNumber: "23VV1A0110",
    department: "Civil Engineering",
    project: "Repair & Maintenance of Hostel Buildings",
    imageSrc: "/images/certifications/JNTUGV-ED26-040-kuna-chandrika.jpg",
  },
  {
    name: "Patarlapalli Meena",
    fullName: "Patarlapalli Meena",
    rollNumber: "23VV1A0122",
    department: "Civil Engineering",
    project: "Repair & Maintenance of Hostel Buildings",
    imageSrc: "/images/certifications/JNTUGV-ED26-041-patarlapalli-meena.jpg",
  },
  {
    name: "Pedapati Leela Sri Deepthi",
    fullName: "Pedapati Leela Sri Deepthi",
    rollNumber: "23VV1A0123",
    department: "Civil Engineering",
    project: "Repair & Maintenance of Hostel Buildings",
    imageSrc: "/images/certifications/JNTUGV-ED26-042-pedapati-leela-sri-deepthi.jpg",
  },
  {
    name: "Vanthala Dhanalakshmi",
    fullName: "Vanthala Dhanalaxmi",
    rollNumber: "23VV1A0130",
    department: "Civil Engineering",
    project: "Repair & Maintenance of Hostel Buildings",
    imageSrc: "/images/certifications/JNTUGV-ED26-043-vanthala-dhanalaxmi.jpg",
  },
  {
    name: "GURUBELLU SIRISHA",
    fullName: "Gurubelli Sirisha",
    rollNumber: "24VV5A0135",
    department: "Civil Engineering",
    project: "Repair & Maintenance of Hostel Buildings",
    imageSrc: "/images/certifications/JNTUGV-ED26-044-gurubelli-sirisha.jpg",
  },
  {
    name: "Madaka Pavitra",
    fullName: "Madaka Pavitra",
    rollNumber: "24VV5A0136",
    department: "Civil Engineering",
    project: "Repair & Maintenance of Hostel Buildings",
    imageSrc: "/images/certifications/JNTUGV-ED26-045-madaka-pavitra.jpg",
  },
  {
    name: "Panchada Pushpa",
    fullName: "Panchada Pushpa",
    rollNumber: "24VV1A0137",
    department: "Civil Engineering",
    project: "Repair & Maintenance of Hostel Buildings",
    imageSrc: "/images/certifications/JNTUGV-ED26-046-panchada-pushpa.jpg",
  },
  // 47 to 49: Team Members (Redirect to https://cap.jntugv.edu.in/about/team)
  {
    name: "Jonnalagadda Prem Sagar",
    fullName: "Jonnalagadda Prem Sagar",
    department: "Computer Science & Engineering",
    project: "Development & Modernization of JNTUGV Official Web Systems",
  },
  {
    name: "Badam Leela Avinash",
    fullName: "Badam Leela Avinash",
    department: "Computer Science & Engineering",
    project: "Development & Modernization of JNTUGV Official Web Systems",
  },
  {
    name: "Seelam Gowri Charan",
    fullName: "Seelam Gowri Charan",
    department: "Computer Science & Engineering",
    project: "Development & Modernization of JNTUGV Official Web Systems",
  },
  // 50 to 55: Contributors (Redirect to https://cap.jntugv.edu.in/contributors)
  {
    name: "Siringi Vinay",
    fullName: "Siringi Vinay",
    department: "Computer Science & Engineering",
    project: "Development & Modernization of JNTUGV Official Web Systems",
  },
  {
    name: "Polavarapu Phani Durga Mani Srinivasa Rao",
    fullName: "Polavarapu Phani Durga Mani Srinivasa Rao",
    department: "Computer Science & Engineering",
    project: "Development & Modernization of JNTUGV Official Web Systems",
  },
  {
    name: "Kura Narendra Kumar",
    fullName: "Kura Narendra Kumar",
    department: "Computer Science & Engineering",
    project: "Development & Modernization of JNTUGV Official Web Systems",
  },
  {
    name: "Rangu Sravya",
    fullName: "Rangu Sravya",
    department: "Computer Science & Engineering",
    project: "Development & Modernization of JNTUGV Official Web Systems",
  },
  {
    name: "Pithani Bhargavi Sri Satya Srujana",
    fullName: "Pithani Bhargavi Sri Satya Srujana",
    department: "Computer Science & Engineering",
    project: "Development & Modernization of JNTUGV Official Web Systems",
  },
  {
    name: "Pinakana Sneha Swaroop",
    fullName: "Pinakana Sneha Swaroop",
    department: "Computer Science & Engineering",
    project: "Development & Modernization of JNTUGV Official Web Systems",
  },
];

export const ENGINEERS_DAY_2026_CERTIFICATES: CertificationRecord[] = MEMBERS_ROSTER.map((member, index) => {
  const num = index + 1;
  const id = `JNTUGV-ED26-${String(num).padStart(3, "0")}`;
  const displayName = member.fullName || member.name.trim();
  const slug = displayName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const department = member.department || (num <= 22 ? "Information Technology" : "Computer Science & Engineering");
  const project = member.project || "Development & Modernization of JNTUGVCEV Official Web Portal";
  const imageSrc = member.imageSrc || "";

  const isTeam = num >= 47 && num <= 49;
  const isContributor = num >= 50 && num <= 55;
  const redirectUrl = isTeam
    ? "https://cap.jntugv.edu.in/about/team"
    : isContributor
    ? "https://cap.jntugv.edu.in/contributors"
    : undefined;
  const verificationUrl = redirectUrl || `https://jntugvcev.edu.in/engineersday2026/certifications?id=${id}`;

  const highlights = [
    ...(member.rollNumber ? [{ label: "Roll / Reg No", value: member.rollNumber }] : []),
    { label: "Department", value: department },
    { label: "Project Title", value: project },
    ...COMMON_HIGHLIGHTS,
  ];

  return {
    id,
    slug,
    name: displayName,
    rollNumber: member.rollNumber,
    honorific: "Mr./Ms.",
    department,
    college: "JNTU-GV College of Engineering Vizianagaram",
    university: "Jawaharlal Nehru Technological University Gurajada Vizianagaram",
    title: "Certificate of Appreciation",
    role: "Web Development Intern",
    project,
    event: "Engineer's Day - 2026",
    eventDate: "2026-09-15",
    formattedDate: "September 15, 2026",
    certificateType: "Appreciation",
    citation: `Awarded in recognition of the valuable contribution towards the development of the ${project}, sincere dedication, and commendable efforts demonstrated during the Summer Internship. The internship was successfully undertaken in alignment with the vision of a developed and self-reliant India and India's ambitious vision of Viksit Bharat @2047. The commitment and professionalism demonstrated throughout the internship are highly appreciated and commendable.`,
    status: "VERIFIED",
    verificationHash: `SHA256: ed2026-${String(num).padStart(3, "0")}-jntugv-${slug}-auth`,
    securityCode: `JNTUGV-AUTH-2026-ED${String(num).padStart(2, "0")}`,
    imageSrc,
    skills: COMMON_SKILLS,
    signatories: COMMON_SIGNATORIES,
    highlights,
    verificationUrl,
    redirectUrl,
    isExternalRedirect: isTeam || isContributor,
  };
});

export function getCertificateById(idOrSlug?: string | null): CertificationRecord | undefined {
  if (!idOrSlug) return ENGINEERS_DAY_2026_CERTIFICATES[0];
  const clean = idOrSlug.trim().toLowerCase();
  return (
    ENGINEERS_DAY_2026_CERTIFICATES.find(
      (c) =>
        c.id.toLowerCase() === clean ||
        c.slug.toLowerCase() === clean ||
        c.name.toLowerCase() === clean ||
        clean.includes(c.slug.toLowerCase()) ||
        c.id.toLowerCase().replace(/-/g, "") === clean.replace(/-/g, "")
    ) || ENGINEERS_DAY_2026_CERTIFICATES[0]
  );
}

export function getDefaultCertificate(): CertificationRecord {
  return ENGINEERS_DAY_2026_CERTIFICATES[0];
}
