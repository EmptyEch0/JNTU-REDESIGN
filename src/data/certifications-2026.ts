export interface CertificationRecord {
  id: string; // e.g., 'JNTUGV-ED26-001'
  slug: string; // e.g., 'teki-chaitanya-lakshmi'
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

export const ENGINEERS_DAY_2026_CERTIFICATES: CertificationRecord[] = [
  {
    id: "JNTUGV-ED26-001",
    slug: "teki-chaitanya-lakshmi",
    name: "Teki Chaitanya Lakshmi",
    honorific: "Ms.",
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
      "Awarded in recognition of the valuable contribution as a member of a team of four towards the development of the JNTUGVCEV website, sincere dedication, and commendable efforts demonstrated during the Summer Internship. The internship was successfully undertaken in alignment with the vision of a developed and self-reliant India and India's ambitious vision of Viksit Bharat @2047. The commitment and professionalism demonstrated throughout the internship are highly appreciated and commendable.",
    status: "VERIFIED",
    verificationHash: "SHA256: 8c94a20b771e16bfa58d4a7c06c3912a7bf89d2c41804b7e923e7102e3b15ad6",
    securityCode: "JNTUGV-AUTH-2026-VB47",
    imageSrc: "/images/certifications/teki-chaitanya-lakshmi-engineers-day-2026.jpg",
    skills: [
      "Modern Web Architecture",
      "UI/UX Systems",
      "Full-Stack Development",
      "Viksit Bharat @2047 Initiative",
      "Performance Tuning",
      "Responsive Digital Ecosystems",
    ],
    signatories: [
      { title: "HOD", designation: "Head of the Department" },
      { title: "Principal", designation: "JNTU-GV CEV" },
      { title: "Registrar", designation: "JNTU-GV Vizianagaram" },
      { title: "Vice-Chancellor", designation: "JNTU-GV Vizianagaram" },
    ],
    highlights: [
      { label: "Initiative", value: "Summer Internship — Web Modernization Cell" },
      { label: "National Mission", value: "Viksit Bharat @2047 (Self-Reliant India)" },
      { label: "Occasion", value: "National Engineer's Day 2026" },
      { label: "Issuing Authority", value: "JNTU-GV Vizianagaram (CEV)" },
      { label: "Authenticity", value: "100% Officially Verified" },
    ],
  },
];

export function getCertificateById(idOrSlug?: string | null): CertificationRecord | undefined {
  if (!idOrSlug) return ENGINEERS_DAY_2026_CERTIFICATES[0];
  const clean = idOrSlug.trim().toLowerCase();
  return ENGINEERS_DAY_2026_CERTIFICATES.find(
    (c) =>
      c.id.toLowerCase() === clean ||
      c.slug.toLowerCase() === clean ||
      c.name.toLowerCase() === clean ||
      clean.includes(c.slug.toLowerCase()) ||
      c.id.toLowerCase().replace(/-/g, "") === clean.replace(/-/g, "")
  ) || ENGINEERS_DAY_2026_CERTIFICATES[0];
}

export function getDefaultCertificate(): CertificationRecord {
  return ENGINEERS_DAY_2026_CERTIFICATES[0];
}
