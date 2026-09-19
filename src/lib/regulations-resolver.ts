/**
 * Academic Regulations Document Fallback Resolver
 * Maps regulation titles and categories to verified local/production PDF asset paths
 * to ensure that preview and download buttons never fail with "document unavailable".
 */

export interface RegulationFallbackItem {
  match: (t: string, c?: string) => boolean;
  path: string;
}

const REGULATION_FALLBACK_MAP: RegulationFallbackItem[] = [
  // ── UG Regulations (B.Tech) ──
  {
    match: (t, c) =>
      (t.includes("r23") || t.includes("r-23")) &&
      (c?.toLowerCase().includes("b.tech") || t.includes("b.tech") || (!t.includes("m.tech") && !t.includes("mba") && !t.includes("mca"))),
    path: "/uploads/2024/07/JNTUGVCEV-UG-B.Tech_.-R23-Regulations.pdf",
  },
  {
    match: (t) => t.includes("honor") || t.includes("minor"),
    path: "/uploads/2021/05/UCEV-HONORS-MINORS-GUIDELINES23-5-21.pdf",
  },
  {
    match: (t, c) =>
      (t.includes("r20") || t.includes("r-20")) &&
      (c?.toLowerCase().includes("b.tech") || t.includes("b.tech") || (!t.includes("m.tech") && !t.includes("mba") && !t.includes("mca"))),
    path: "/uploads/2021/04/R20-B.TECH-UCEV-REGULATIONS-FINAL.pdf",
  },
  {
    match: (t, c) =>
      (t.includes("r19") || t.includes("r-19")) &&
      (c?.toLowerCase().includes("b.tech") || t.includes("b.tech") || (!t.includes("m.tech") && !t.includes("mba") && !t.includes("mca"))),
    path: "/uploads/2019/12/R19_UCEV-JNTUK-B.Tech-R19-Regulations-FINAL.pdf",
  },
  {
    match: (t, c) =>
      (t.includes("r16") || t.includes("r-16")) &&
      (c?.toLowerCase().includes("b.tech") || t.includes("b.tech") || (!t.includes("m.tech") && !t.includes("mba") && !t.includes("mca"))),
    path: "/uploads/2020/08/B.Tech-R16-Regulations.pdf",
  },
  {
    match: (t, c) =>
      (t.includes("r13") || t.includes("r-13")) &&
      (c?.toLowerCase().includes("b.tech") || t.includes("b.tech") || (!t.includes("m.tech") && !t.includes("mba") && !t.includes("mca"))),
    path: "/uploads/2020/08/BTechR13-Regulation.pdf",
  },

  // ── PG Regulations — M.Tech ──
  {
    match: (t, c) =>
      (t.includes("r25") || t.includes("r-25")) &&
      (c?.toLowerCase().includes("m.tech") || t.includes("m.tech")),
    path: "/uploads/2026/01/JNTU-GV-R25-M.Tech-Revised-Regulations-08-01-26.pdf",
  },
  {
    match: (t, c) =>
      (t.includes("r23") || t.includes("r-23")) &&
      (c?.toLowerCase().includes("m.tech") || t.includes("m.tech")),
    path: "/uploads/2024/11/R23-Regulations-regular.pdf",
  },
  {
    match: (t, c) =>
      (t.includes("r19") || t.includes("r-19") || t.includes("r20") || t.includes("r-20")) &&
      (c?.toLowerCase().includes("m.tech") || t.includes("m.tech")),
    path: "/uploads/2019/12/M.Tech-R19-revised-regulations.pdf",
  },
  {
    match: (t, c) =>
      (t.includes("r16") || t.includes("r-16")) &&
      (c?.toLowerCase().includes("m.tech") || t.includes("m.tech")),
    path: "/uploads/2020/08/M.Tech-Regulation-modification-R16.pdf",
  },
  {
    match: (t, c) =>
      (t.includes("r13") || t.includes("r-13")) &&
      (c?.toLowerCase().includes("m.tech") || t.includes("m.tech")),
    path: "/uploads/2020/08/M.Tech-R13-Regulation.pdf",
  },

  // ── PG Regulations — MCA ──
  {
    match: (t, c) =>
      (t.includes("r25") || t.includes("r-25")) &&
      (c?.toLowerCase().includes("mca") || t.includes("mca")),
    path: "/uploads/2025/12/JNTUGV-R-25-MCA-regulations.pdf",
  },
  {
    match: (t, c) =>
      (t.includes("r20") || t.includes("r21") || t.includes("r-20") || t.includes("r-21")) &&
      (c?.toLowerCase().includes("mca") || t.includes("mca")),
    path: "/uploads/2021/04/MCA-R20-Regulations-16-04-21.pdf",
  },
  {
    match: (t, c) =>
      (t.includes("r19") || t.includes("r-19")) &&
      (c?.toLowerCase().includes("mca") || t.includes("mca")),
    path: "/uploads/2019/12/MCA-R19-Regulations-revised.pdf",
  },
  {
    match: (t, c) =>
      (t.includes("r13") || t.includes("r-13")) &&
      (c?.toLowerCase().includes("mca") || t.includes("mca")),
    path: "/uploads/2020/08/MCA-R13-Regulation.pdf",
  },

  // ── PG Regulations — MBA ──
  {
    match: (t, c) =>
      (t.includes("r25") || t.includes("r-25")) &&
      (c?.toLowerCase().includes("mba") || t.includes("mba")),
    path: "/uploads/2025/12/MBA-R25-Regulations-2.pdf",
  },
  {
    match: (t, c) =>
      (t.includes("r24") || t.includes("r21") || t.includes("r-24") || t.includes("r-21")) &&
      (c?.toLowerCase().includes("mba") || t.includes("mba")),
    path: "/uploads/2025/03/MBA-R24-REGULATIONS-2.pdf",
  },
  {
    match: (t, c) =>
      (t.includes("r19") || t.includes("r-19")) &&
      (c?.toLowerCase().includes("mba") || t.includes("mba")),
    path: "/uploads/2025/07/MBA-R19-REGULATIONS-1.pdf",
  },
];

/**
 * Resolves a regulation document link by validating existing link or falling back to mapped PDF.
 */
export function resolveRegulationPdf(
  link?: string | null,
  title?: string | null,
  category?: string | null
): string {
  const trimmedLink = (link || "").trim();

  // If a valid local or direct link is provided, return it
  if (
    trimmedLink &&
    trimmedLink !== "#" &&
    trimmedLink !== "/" &&
    !trimmedLink.endsWith("#")
  ) {
    return trimmedLink;
  }

  const cleanTitle = (title || "").toLowerCase();
  const cleanCat = (category || "").toLowerCase();

  for (const entry of REGULATION_FALLBACK_MAP) {
    if (entry.match(cleanTitle, cleanCat)) {
      return entry.path;
    }
  }

  // General program fallbacks
  if (cleanCat.includes("m.tech") || cleanTitle.includes("m.tech")) {
    return "/uploads/2026/01/JNTU-GV-R25-M.Tech-Revised-Regulations-08-01-26.pdf";
  }
  if (cleanCat.includes("mba") || cleanTitle.includes("mba")) {
    return "/uploads/2025/12/MBA-R25-Regulations-2.pdf";
  }
  if (cleanCat.includes("mca") || cleanTitle.includes("mca")) {
    return "/uploads/2025/12/JNTUGV-R-25-MCA-regulations.pdf";
  }

  // Default UG B.Tech R23
  return "/uploads/2024/07/JNTUGVCEV-UG-B.Tech_.-R23-Regulations.pdf";
}
