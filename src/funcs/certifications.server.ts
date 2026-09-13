import { createServerFn } from "@tanstack/react-start";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import {
  ENGINEERS_DAY_2026_CERTIFICATES,
  type CertificationRecord,
} from "../data/certifications-2026";

// Path to persistent data storage
const DATA_DIR = path.join(process.cwd(), "local-assets", "uploads", "certifications");
const DATA_FILE = path.join(DATA_DIR, "certifications.json");

function ensureStorage(): CertificationRecord[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    // Always ensure the file exists with the 46 official certificates
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(ENGINEERS_DAY_2026_CERTIFICATES, null, 2), "utf-8");
      return ENGINEERS_DAY_2026_CERTIFICATES;
    }

    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    const parsed: CertificationRecord[] = JSON.parse(raw);

    if (Array.isArray(parsed) && parsed.length > 0) {
      // Map existing custom uploaded images by certificate ID
      const imageMap = new Map<string, string>();
      const customRecords: CertificationRecord[] = [];

      parsed.forEach((item) => {
        if (item && item.id) {
          if (item.imageSrc && item.imageSrc.trim() !== "" && !item.imageSrc.includes("teki-chaitanya-lakshmi")) {
            imageMap.set(item.id.toLowerCase(), item.imageSrc);
          }
          // If it's a completely custom certificate beyond the standard 46
          const isStandard = ENGINEERS_DAY_2026_CERTIFICATES.some(
            (std) => std.id.toLowerCase() === item.id.toLowerCase()
          );
          if (!isStandard) {
            customRecords.push(item);
          }
        }
      });

      // Synchronize with the 55 official roster entries, preserving official and custom uploaded images
      const synchronized: CertificationRecord[] = ENGINEERS_DAY_2026_CERTIFICATES.map((official) => {
        const customImage = imageMap.get(official.id.toLowerCase());
        return {
          ...official,
          imageSrc: customImage || official.imageSrc || "",
        };
      });

      const fullList = [...synchronized, ...customRecords];
      
      // Update disk storage with the clean synchronized list
      try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(fullList, null, 2), "utf-8");
      } catch {
        // ignore write errors
      }

      return fullList;
    }

    return ENGINEERS_DAY_2026_CERTIFICATES;
  } catch (err) {
    console.error("Error reading certifications storage:", err);
    return ENGINEERS_DAY_2026_CERTIFICATES;
  }
}

function saveStorage(data: CertificationRecord[]): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving certifications storage:", err);
  }
}

export const getAdminCertificates = createServerFn({
  method: "GET",
}).handler(async () => {
  return ensureStorage();
});

export const createAdminCertificate = createServerFn({
  method: "POST",
})
  .validator(
    (d: {
      name: string;
      honorific?: string;
      department: string;
      role: string;
      project: string;
      event?: string;
      formattedDate?: string;
      citation: string;
      fileUrl: string;
      skills?: string[];
    }) => d
  )
  .handler(async ({ data }) => {
    const list = ensureStorage();
    const nextIndex = list.length + 1;
    const certId = `JNTUGV-ED26-${String(nextIndex).padStart(3, "0")}`;

    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const randomHash = crypto
      .createHash("sha256")
      .update(`${certId}-${data.name}-${Date.now()}`)
      .digest("hex");

    const newRecord: CertificationRecord = {
      id: certId,
      slug,
      name: data.name,
      honorific: data.honorific || "Mr./Ms.",
      department: data.department || "Computer Science & Engineering",
      college: "JNTU-GV College of Engineering Vizianagaram",
      university: "Jawaharlal Nehru Technological University Gurajada Vizianagaram",
      title: "Certificate of Appreciation",
      role: data.role || "Web Development Intern",
      project: data.project || "Development & Modernization of JNTUGVCEV Official Web Portal",
      event: data.event || "Engineer's Day - 2026",
      eventDate: "2026-09-15",
      formattedDate: data.formattedDate || "September 15, 2026",
      certificateType: "Appreciation",
      citation:
        data.citation ||
        "Awarded in recognition of the valuable contributions towards Developing JNTUGVCEV website, sincere dedication, and commendable efforts demonstrated during the Summer Internship. The internship was successfully undertaken towards the vision of a developed and self-reliant India, in alignment with India's ambitious vision of Viksit Bharat @2047.",
      status: "VERIFIED",
      verificationHash: `SHA256: ${randomHash}`,
      securityCode: `JNTUGV-AUTH-2026-ED${String(nextIndex).padStart(2, "0")}`,
      imageSrc: data.fileUrl || "",
      skills: data.skills && data.skills.length > 0 ? data.skills : [
        "Web Modernization",
        "Frontend & UI Engineering",
        "Viksit Bharat @2047 Initiative",
      ],
      signatories: [
        { title: "HOD", designation: "Head of the Department" },
        { title: "Principal", designation: "JNTU-GV CEV" },
        { title: "Registrar", designation: "JNTU-GV Vizianagaram" },
        { title: "Vice-Chancellor", designation: "JNTU-GV Vizianagaram" },
      ],
      highlights: [
        { label: "Initiative", value: "Summer Internship — Web Modernization Cell" },
        { label: "National Mission", value: "Viksit Bharat @2047" },
        { label: "Occasion", value: "National Engineer's Day 2026" },
        { label: "Issuing Authority", value: "JNTU-GV Vizianagaram (CEV)" },
        { label: "Authenticity", value: "100% Officially Verified" },
      ],
    };

    list.unshift(newRecord);
    saveStorage(list);
    return { success: true, certificate: newRecord };
  });

export const deleteAdminCertificate = createServerFn({
  method: "POST",
})
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    let list = ensureStorage();
    list = list.filter((item) => item.id !== id);
    saveStorage(list);
    return { success: true };
  });
