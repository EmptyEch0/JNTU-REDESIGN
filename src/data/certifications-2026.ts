export interface CertificationRecord {
  id: string; // e.g., 'JNTUGV-ED26-001'
  slug: string;
  name: string;
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

const MEMBER_NAMES = [
  "M Likhith Kumar",
  "P Sai Vamsi",
  "P Anitha",
  "Ch Sai Rupini",
  "B Akhil",
  "P Jaya Kumar",
  "Y Tejaswini",
  "Lavanya D",
  "Sk Asma",
  "K Pravallika",
  "D Gnaneswar",
  "G Nandini",
  "Y Naveen",
  "Lavanya Y",
  "Shabira Begum",
  "Sailaja S",
  "T Chaitanya Lakshmi",
  "Mounika D",
  "Y Ghana Satya Karthik",
  "V Charu Brunda Hasini",
  "Yuva Teja",
  "Sahithya",
  "B. Chakradhar",
  "D. Yaswanth",
  "G. Anil Kumar",
  "J. Sai Saketh",
  "S. Praveen",
  "T. Surya Prakash",
  "M. Uma Mahesh",
  "Ch. Siddartha",
  "K. Rama Swamy",
  "Y. Pavan Kumar",
  "M. Madhan Kumar",
  "M. Ajay",
  "N. Vishal",
  "T. Ananda Harsha",
  "K. Manogna Sasidhar",
  "R.V. Sriteja",
];

export const ENGINEERS_DAY_2026_CERTIFICATES: CertificationRecord[] = MEMBER_NAMES.map((name, index) => {
  const num = index + 1;
  const id = `JNTUGV-ED26-${String(num).padStart(3, "0")}`;
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return {
    id,
    slug,
    name: name.trim(),
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
    highlights: COMMON_HIGHLIGHTS,
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
