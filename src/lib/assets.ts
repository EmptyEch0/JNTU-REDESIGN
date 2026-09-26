const rawBase = (
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_ASSETS_URL) ||
  (typeof process !== "undefined" && process.env?.VITE_ASSETS_URL) ||
  ""
).replace(/\/$/, "");
const BASE = rawBase
  .replace("89.116.134.182:8080", "jntugvcev.edu.in")
  .replace("http://89.116.134.182", "https://jntugvcev.edu.in")
  .replace("http://jntugvcev.edu.in", "https://jntugvcev.edu.in")
  .replace(/\/local-assets$/, "");

const assetUrlCache = new Map<string, string>();

export const getAssetUrl = (
  path: string | null | undefined,
): string => {
  if (!path) return undefined as unknown as string;

  const trimmedPath = path.trim();
  if (assetUrlCache.has(trimmedPath)) return assetUrlCache.get(trimmedPath)!;

  let resolvedUrl: string;

  if (
    trimmedPath.includes("Dr-G-J-NAGA-RAJU-latest.jpg") ||
    trimmedPath.includes("Dr.-G.-J.-Naga-Raju")
  ) {
    resolvedUrl = `/uploads/images/administration/Dr-G-J-NAGA-RAJU-latest.jpg`;
  } else if (
    trimmedPath.startsWith("data:") ||
    trimmedPath.startsWith("/src/") ||
    trimmedPath.startsWith("/assets/") ||
    trimmedPath.startsWith("/images/") ||
    trimmedPath.startsWith("/@fs/") ||
    trimmedPath.startsWith("blob:") ||
    trimmedPath === "/logo-circle.png" ||
    trimmedPath === "/logo.png" ||
    trimmedPath === "/favicon.png"
  ) {
    resolvedUrl = trimmedPath;
  } else {
    // legacy map check
    const filename = trimmedPath.split("/").pop() ?? "";
    const LEGACY_FILENAME_MAP: Record<string, string> = {
      "hero-campus.jpg": "/images/hero-carousal/hero-campus.webp",
      "hero-campus.webp": "/images/hero-carousal/hero-campus.webp",
      "hero-2.jpg": "/images/hero-carousal/hero-2.webp",
      "hero-2.jpeg": "/images/hero-carousal/hero-2.webp",
      "hero-2.webp": "/images/hero-carousal/hero-2.webp",
      "hero-3.jpg": "/images/hero-carousal/hero-3.webp",
      "hero-3.jpeg": "/images/hero-carousal/hero-3.webp",
      "hero-3.webp": "/images/hero-carousal/hero-3.webp",
      "hero-4.jpg": "/images/hero-carousal/hero-4.webp",
      "hero-4.jpeg": "/images/hero-carousal/hero-4.webp",
      "hero-4.webp": "/images/hero-carousal/hero-4.webp",
      "hero-5.jpg": "/images/hero-carousal/hero-5.webp",
      "hero-5.jpeg": "/images/hero-carousal/hero-5.webp",
      "hero-5.webp": "/images/hero-carousal/hero-5.webp",
      "independence_day.webp": "/images/independence_day.webp",
      "independence_day.jpeg": "/images/independence_day.webp",
      "independence-day-2026.jpg": "/images/independence_day.webp",
      "Dr.-G.-J.-Naga-Raju1.png": `/uploads/images/administration/Dr-G-J-NAGA-RAJU-latest.jpg`,
      "Dr-G-J-NAGA-RAJU-latest.jpg": `/uploads/images/administration/Dr-G-J-NAGA-RAJU-latest.jpg`,
      "logo.jpeg": "/logo-circle.png",
      // Department banner instant local fallbacks
      "cse-banner.jpg": `/uploads/departments/banners/cse-banner.jpg`,
      "ece-banner.jpg": `/uploads/departments/banners/ece-banner.jpg`,
      "eee-banner.jpg": `/uploads/departments/banners/eee-banner.jpg`,
      "it-banner.jpg": `/uploads/departments/banners/it-banner.jpg`,
      "mech-banner.jpg": `/uploads/departments/banners/mech-banner.jpg`,
      "met-banner.jpg": `/uploads/departments/banners/met-banner.jpg`,
      "sh-banner.jpg": `/uploads/departments/banners/sh-banner.jpg`,
      "bshss-banner.jpg": `/uploads/departments/banners/sh-banner.jpg`,
      "bsh-banner.jpg": `/uploads/departments/banners/sh-banner.jpg`,
      "mba-banner.jpg": `/uploads/departments/banners/mba-banner.jpg`,
      // Sankhya Technologies Placement Assets
      "sankhya-technologies-placement-notice.pdf": `/uploads/2026/09/sankhya-technologies-placement-notice.pdf`,
      "Sankhya Technologies.pdf": `/uploads/2026/09/sankhya-technologies-placement-notice.pdf`,
      "sankhya-placement-congrats.jpeg": `/uploads/2026/09/sankhya-placement-congrats.jpeg`,
      "congrats.jpeg": `/uploads/2026/09/sankhya-placement-congrats.jpeg`,
      "sankhya-placement-students-group.jpeg": `/uploads/2026/09/sankhya-placement-students-group.jpeg`,
      // Civil Department Faculty Assets
      "CIVIL-1-D.-Jagan-Mohan.jpg": "/images/faculty/civil/CIVIL-1-D.-Jagan-Mohan.jpg",
      "CIVIL-1-D.-Jagan-Mohan-150x150.jpg": "/images/faculty/civil/CIVIL-1-D.-Jagan-Mohan.jpg",
      "CIVIL-2-R.-Balamurali-krishna.jpg": "/images/faculty/civil/CIVIL-2-R.-Balamurali-krishna.jpg",
      "CIVIL-2-R.-Balamurali-krishna-150x150.jpg": "/images/faculty/civil/CIVIL-2-R.-Balamurali-krishna.jpg",
      "CIVIL-4-Ch.Giridhar-Kumar.jpg": "/images/faculty/civil/CIVIL-4-Ch.Giridhar-Kumar.jpg",
      "CIVIL-4-Ch.Giridhar-Kumar-150x150.jpg": "/images/faculty/civil/CIVIL-4-Ch.Giridhar-Kumar.jpg",
      "CIVIL-5-T.S.D.Phanindranath.jpg": "/images/faculty/civil/CIVIL-5-T.S.D.Phanindranath.jpg",
      "CIVIL-5-T.S.D.Phanindranath-140x150.jpg": "/images/faculty/civil/CIVIL-5-T.S.D.Phanindranath.jpg",
      // Shared / HOD Faculty Assets
      "dr-k-srinivasa-prasad.jpg": "/images/faculty/mech/dr-k-srinivasa-prasad.jpg",
      "dr--k--srinivasa-prasad.jpg": "/images/faculty/mech/dr-k-srinivasa-prasad.jpg",
      "6.Mr_.K.-Srinivasa-Prasad.jpg": "/images/faculty/mech/dr-k-srinivasa-prasad.jpg",
      "6.Mr_.K.-Srinivasa-Prasad-150x150.jpg": "/images/faculty/mech/dr-k-srinivasa-prasad.jpg",
      "dr-g-appala-naidu.jpg": "/images/faculty/ece/dr-g-appala-naidu.jpg",
      "ECE-6-G.Appalanaidu.jpg": "/images/faculty/ece/dr-g-appala-naidu.jpg",
      "ECE-6-G.Appalanaidu-60x60.jpg": "/images/faculty/ece/dr-g-appala-naidu.jpg",
      "gottapu-appala-naidu.jpeg": "/images/faculty/ece/dr-g-appala-naidu.jpg",
      "gottapu-appala-naidu.jpg": "/images/faculty/ece/dr-g-appala-naidu.jpg",
    };

    if (filename.startsWith("IMG_") && (filename.endsWith(".JPG") || filename.endsWith(".jpg") || filename.endsWith(".png") || filename.endsWith(".webp"))) {
      const baseName = filename.replace(/\.[^.]+$/, "");
      resolvedUrl = `/images/gallery/${baseName}.webp`;
    } else if (LEGACY_FILENAME_MAP[filename]) {
      resolvedUrl = LEGACY_FILENAME_MAP[filename];
    } else if (
      trimmedPath.startsWith("http://") ||
      trimmedPath.startsWith("https://")
    ) {
      const vpsMatch = trimmedPath.match(
        /^https?:\/\/89\.116\.134\.182(?::\d+)?\/*(?:local-assets\/*)?(.*)$/,
      );
      if (vpsMatch) {
        const relativePath = vpsMatch[1].replace(/\\/g, "/").replace(/^\/+/, "");
        resolvedUrl = `/${relativePath.startsWith("uploads/") ? relativePath : "uploads/" + relativePath}`;
      } else if (trimmedPath.includes("89.116.134.182:8080")) {
        resolvedUrl = trimmedPath.replace("http://89.116.134.182:8080", "https://jntugvcev.edu.in").replace("89.116.134.182:8080", "jntugvcev.edu.in").replace("/local-assets/", "/");
      } else if (trimmedPath.startsWith("http://localhost:8081/")) {
        const relativePath = trimmedPath.replace("http://localhost:8081/", "").replace(/^local-assets\//, "");
        resolvedUrl = `/${relativePath.replace(/\\/g, "/").replace(/^\/+/, "")}`;
      } else if (
        trimmedPath.startsWith("http://jntugvcev.edu.in/") ||
        trimmedPath.startsWith("https://jntugvcev.edu.in/")
      ) {
        try {
          const parsed = new URL(trimmedPath);
          let relativeAsset = parsed.pathname.replace(/^\/wp-content\//, "").replace(/^\/local-assets\//, "").replace(/^\/+/, "");
          resolvedUrl = `/${relativeAsset}`;
        } catch {
          resolvedUrl = trimmedPath;
        }
      } else {
        resolvedUrl = trimmedPath;
      }
    } else {
      let cleanPath = trimmedPath.replace(/\\/g, "/");
      if (cleanPath.startsWith("/")) cleanPath = cleanPath.substring(1);
      if (cleanPath.startsWith("wp-content/")) cleanPath = cleanPath.substring("wp-content/".length);
      if (cleanPath.startsWith("local-assets/")) cleanPath = cleanPath.substring("local-assets/".length);
      
      if (cleanPath.startsWith("uploads/")) {
        resolvedUrl = `/${cleanPath}`;
      } else if (cleanPath.startsWith("facilities/")) {
        resolvedUrl = `/uploads/${cleanPath}`;
      } else {
        resolvedUrl = `/${cleanPath}`;
      }
    }
  }

  // Prepend BASE only for remote uploads/media, NEVER for local static assets
  const isLocalStatic =
    resolvedUrl.startsWith("/images/") ||
    resolvedUrl.startsWith("/assets/") ||
    resolvedUrl.startsWith("/src/") ||
    resolvedUrl.startsWith("/@fs/") ||
    resolvedUrl === "/logo-circle.png" ||
    resolvedUrl === "/logo.png" ||
    resolvedUrl === "/favicon.png";

  if (BASE && !isLocalStatic && !resolvedUrl.startsWith("http") && !resolvedUrl.startsWith("data:")) {
    resolvedUrl = `${BASE}${resolvedUrl}`;
  }

  assetUrlCache.set(trimmedPath, resolvedUrl);
  return resolvedUrl;
};

export const assetUrl = (
  path: string | null | undefined,
): string => {
  return getAssetUrl(path);
};

export const uploadUrl = (path: string) =>
  assetUrl(`uploads/${path}`);

export const docUrl = (path: string) =>
  assetUrl(`docs/${path}`);

/**
 * Use ONLY for CMS/DB-driven image paths (e.g. department/leadership images
 * coming from Neon). Do NOT pass local Vite-imported assets (e.g.
 * `import heroImg from "@/assets/hero-campus.jpg"`) through this function —
 * those are already resolved by the bundler and should be used directly.
 */
export const imageUrl = (path: string) =>
  assetUrl(`images/${path}`);

export const wpUrl = (
  oldUrl: string | null | undefined,
): string => {
  if (!oldUrl) return undefined as unknown as string;
  return getAssetUrl(oldUrl);
};