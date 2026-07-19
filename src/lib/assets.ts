const BASE = (
  import.meta.env.VITE_ASSETS_URL ||
  "https://jntu-redesign.vercel.app/vps-assets"
).replace(/\/$/, "");

export const getAssetUrl = (
  path: string | null | undefined,
): string => {
  if (!path) return "";

  const trimmedPath = path.trim();

  // Global image overrides
  if (trimmedPath.includes("hero-campus.jpg")) {
    return `${BASE}/uploads/images/administration/JNTU%201.png`;
  }

  if (
    trimmedPath.includes("hero-2.jpg") ||
    trimmedPath.includes("hero-2.jpeg")
  ) {
    return `${BASE}/uploads/2022/03/Frame-1-1200x374.jpg`;
  }

  if (trimmedPath.includes("Dr.-G.-J.-Naga-Raju1.png")) {
    return `${BASE}/uploads/images/administration/Dr-G-J-NAGA-RAJU-latest.jpg`;
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



    return trimmedPath;
  }

  // Pass through special paths
  if (
    trimmedPath.startsWith("data:") ||
    trimmedPath.startsWith("/src/") ||
    trimmedPath.startsWith("/assets/") ||
    trimmedPath.startsWith("/@fs/")
  ) {
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

  // Map facilities to uploads
  if (cleanPath.startsWith("facilities/")) {
    cleanPath = `local-assets/uploads/${cleanPath}`;
  }

  // New upload system support
  if (cleanPath.startsWith("local-assets/")) {
    const subPath = cleanPath.substring(
      "local-assets/".length,
    );

    return `${BASE}/${subPath}`;
  }

  // Frontend assets
  if (cleanPath.startsWith("assets/")) {
    return `/${cleanPath}`;
  }

  return `/${cleanPath}`;
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