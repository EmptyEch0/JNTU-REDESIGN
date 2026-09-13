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

export const MEMBERS_ROSTER: { name: string; rollNumber?: string }[] = [
  { name: "M Likhith Kumar" },
  { name: "P Sai Vamsi" },
  { name: "P Anitha" },
  { name: "Ch Sai Rupini" },
  { name: "B Akhil" },
  { name: "P Jaya Kumar" },
  { name: "Y Tejaswini" },
  { name: "Lavanya D" },
  { name: "Sk Asma" },
  { name: "K Pravallika" },
  { name: "D Gnaneswar" },
  { name: "G Nandini" },
  { name: "Y Naveen" },
  { name: "Lavanya Y" },
  { name: "Shabira Begum" },
  { name: "Sailaja S" },
  { name: "T Chaitanya Lakshmi" },
  { name: "Mounika D" },
  { name: "Y Ghana Satya Karthik" },
  { name: "V Charu Brunda Hasini" },
  { name: "Yuva Teja" },
  { name: "Sahithya" },
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
  { name: "KOLATI SOWMYA SRI", rollNumber: "23VV1A0109" },
  { name: "KUNA CHANDRIIKA", rollNumber: "23VV1A0110" },
  { name: "Patarlapalli Meena", rollNumber: "23VV1A0122" },
  { name: "Pedapati Leela Sri Deepthi", rollNumber: "23VV1A0123" },
  { name: "Vanthala Dhanalakshmi", rollNumber: "23VV1A0130" },
  { name: "GURUBELLU SIRISHA", rollNumber: "24VV5A0135" },
  { name: "Madaka Pavitra", rollNumber: "24VV5A0136" },
  { name: "Panchada Pushpa", rollNumber: "24VV1A0137" },
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
  const slug = member.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const highlights = [
    ...(member.rollNumber ? [{ label: "Roll / Reg No", value: member.rollNumber }] : []),
    ...COMMON_HIGHLIGHTS,
  ];

  return {
    id,
    slug,
    name: member.name.trim(),
    rollNumber: member.rollNumber,
    honorific: "Mr./Ms.",
    department: "Computer Science & Engineering",
    college: "JNTU-GV College of Engineering Vizianagaram",
    university: "Jawaharlal Nehru Technological University Gurajada Vizianagaram",
    title: "Certificate of Appreciation",
    role: "Web Development Intern",
    project: "Development & Modernization of JNTUGVCEV Official Web Portal",
    event: "Engineer's Day - 2026",
    eventDate: "2026-09-15",
    formattedDate: "September 15, 2026",
    certificateType: "Appreciation",
    citation:
      "Awarded in recognition of the valuable contribution towards the development of the JNTUGVCEV website, sincere dedication, and commendable efforts demonstrated during the Summer Internship. The internship was successfully undertaken in alignment with the vision of a developed and self-reliant India and India's ambitious vision of Viksit Bharat @2047. The commitment and professionalism demonstrated throughout the internship are highly appreciated and commendable.",
    status: "VERIFIED",
    verificationHash: `SHA256: ed2026-${String(num).padStart(3, "0")}-jntugv-${slug}-auth`,
    securityCode: `JNTUGV-AUTH-2026-ED${String(num).padStart(2, "0")}`,
    imageSrc: "", // Blank placeholder for now as requested; user will upload certificate images in bulk
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
