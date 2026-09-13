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
  // 23 to 38 CSE / Other
  { name: "B. Chakradhar" },
  { name: "D. Yaswanth" },
  { name: "G. Anil Kumar" },
  { name: "J. Sai Saketh" },
  { name: "S. Praveen" },
  { name: "T. Surya Prakash" },
  { name: "M. Uma Mahesh" },
  { name: "Ch. Siddartha" },
  { name: "K. Rama Swamy" },
  { name: "Y. Pavan Kumar" },
  { name: "M. Madhan Kumar" },
  { name: "M. Ajay" },
  { name: "N. Vishal" },
  { name: "T. Ananda Harsha" },
  { name: "K. Manogna Sasidhar" },
  { name: "R.V. Sriteja" },
  // 39 to 46 with Roll Numbers
  { name: "KOLATI SOWMYA SRI", rollNumber: "23VV1A0109" },
  { name: "KUNA CHANDRIIKA", rollNumber: "23VV1A0110" },
  { name: "Patarlapalli Meena", rollNumber: "23VV1A0122" },
  { name: "Pedapati Leela Sri Deepthi", rollNumber: "23VV1A0123" },
  { name: "Vanthala Dhanalakshmi", rollNumber: "23VV1A0130" },
  { name: "GURUBELLU SIRISHA", rollNumber: "24VV5A0135" },
  { name: "Madaka Pavitra", rollNumber: "24VV5A0136" },
  { name: "Panchada Pushpa", rollNumber: "24VV1A0137" },
  // 47 to 55 Additional Students
  { name: "JONNALAGADDA PREM SAGAR" },
  { name: "BADAM LEELA AVINASH" },
  { name: "SEELAM GOWRI CHARAN" },
  { name: "SIRINGI VINAY" },
  { name: "POLAVARAPU PHANI DURGA MANI SRINIVASA RAO" },
  { name: "KURA NARENDRA KUMAR" },
  { name: "RANGU SRAVYA" },
  { name: "PITHANI BHARGAVI SRI SATYA SRUJANA" },
  { name: "PINAKANA SNEHA SWAROOP" },
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
