const BASE = (
  import.meta.env.VITE_ASSETS_URL ||
  "https://jntu-redesign.vercel.app/vps-assets"
).replace(/\/$/, "");

export const getAssetUrl = (
  path: string | null | undefined,
): string => {
  if (!path) return "";

  const trimmedPath = path.trim();

  // If this is already a bundler-resolved local asset (Vite import, e.g.
  // "/assets/hero-5.abc123.webp" or a dev-server path), pass it through
  // untouched. These should never be re-derived from a filename guess.
  if (
    trimmedPath.startsWith("data:") ||
    trimmedPath.startsWith("/src/") ||
    trimmedPath.startsWith("/assets/") ||
    trimmedPath.startsWith("/@fs/") ||
    trimmedPath.startsWith("blob:")
  ) {
    return trimmedPath;
  }

  // Known legacy filename → current asset mappings.
  // Match on the filename only (not a substring anywhere in the path) to
  // avoid accidentally hijacking unrelated files that happen to share a
  // fragment of the name (e.g. "hero-2.jpg" inside a hero-carousel path).
  const filename = trimmedPath.split("/").pop() ?? "";

  const LEGACY_FILENAME_MAP: Record<string, string> = {
    "hero-campus.jpg": `${BASE}/uploads/images/administration/JNTU%201.png`,
    "hero-2.jpg": `${BASE}/uploads/2022/03/Frame-1-1200x374.jpg`,
    "hero-2.jpeg": `${BASE}/uploads/2022/03/Frame-1-1200x374.jpg`,
    "Dr.-G.-J.-Naga-Raju1.png": `${BASE}/uploads/images/administration/Dr-G-J-NAGA-RAJU-latest.jpg`,
  };

  if (LEGACY_FILENAME_MAP[filename]) {
    return LEGACY_FILENAME_MAP[filename];
  }

  // External URLs
  if (
    trimmedPath.startsWith("http://") ||
    trimmedPath.startsWith("https://")
  ) {
    // Old VPS URL mapping
    if (
      trimmedPath.startsWith(
        "http://89.116.134.182:8080/local-assets/",
      )
    ) {
      const relativePath = trimmedPath.replace(
        "http://89.116.134.182:8080/local-assets/",
        "",
      );

      return `${BASE}/${relativePath
        .replace(/\\/g, "/")
        .replace(/^\/+/, "")}`;
    }

    // Localhost URL mapping
    if (trimmedPath.startsWith("http://localhost:8081/")) {
      const relativePath = trimmedPath.replace(
        "http://localhost:8081/",
        "",
      );

      return `${BASE}/${relativePath
        .replace(/\\/g, "/")
        .replace(/^\/+/, "")}`;
    }

    // WordPress media mapping
    if (trimmedPath.includes("jntugvcev.edu.in/wp-content/")) {
      const wpPath = trimmedPath.match(/wp-content\/(.+)/);

      if (wpPath) {
        const SPECIAL_WP_FILES = [
          "EEE-3.Dr_.V.S.VAKULA-Asst-Prof.jpg",
          "V.-Mani-Kumar-Photo-Mech.jpg",
          "WhatsApp-Image-2020-08-26-at-10.23.09-AM.jpeg",
        ];

        if (SPECIAL_WP_FILES.some((f) => trimmedPath.includes(f))) {
          return `${BASE}/${wpPath[1]}`;
        }

        return `${BASE}/wp-content/${wpPath[1]}`;
      }
    }

    return trimmedPath;
  }

  let cleanPath = trimmedPath.replace(/\\/g, "/");

  if (cleanPath.startsWith("/")) {
    cleanPath = cleanPath.substring(1);
  }

  // Legacy support
  if (cleanPath.startsWith("uploads/")) {
    cleanPath = `local-assets/${cleanPath}`;
  }

  // New upload system support
  if (cleanPath.startsWith("local-assets/")) {
    const subPath = cleanPath.substring("local-assets/".length);

    return `${BASE}/${subPath}`;
  }
  return `${BASE}/${cleanPath}`;
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
  if (!oldUrl) return "";

  const wpMatch = oldUrl.match(/wp-content\/(.+)/);

  if (wpMatch) {
    return `${BASE}/wp-content/${wpMatch[1]}`;
  }

  const localMatch = oldUrl.match(/localhost:\d+\/(.+)/);

  if (localMatch) {
    return `${BASE}/${localMatch[1]}`;
  }

  if (
    oldUrl.startsWith("/uploads/") ||
    oldUrl.startsWith("/images/")
  ) {
    return `${BASE}${oldUrl}`;
  }

  return assetUrl(oldUrl);
};