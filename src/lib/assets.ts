const BASE = (import.meta.env.VITE_ASSETS_URL ?? "").replace(/\/$/, ""); // strip trailing slash

export const getAssetUrl = (path: string | null | undefined): string => {
  if (!path) return "";

  // Global override for the main hero campus image
  if (path.includes("hero-campus.jpg")) {
    return "http://89.116.134.182:8080/local-assets/uploads/images/administration/JNTU%201.png";
  }
  
  // Global override for hero-2 image
  if (path.includes("hero-2.jpg") || path.includes("hero-2.jpeg")) {
    return "http://89.116.134.182:8080/local-assets/uploads/2022/03/Frame-1-1200x374.jpg";
  }

  // Global override for Dr. G. Naga Raju
  if (path.includes("Dr.-G.-J.-Naga-Raju1.png")) {
    return "http://89.116.134.182:8080/local-assets/uploads/images/administration/Dr-G-J-NAGA-RAJU-latest.jpg";
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    // Map old VPS IP to correct proxy config if needed, otherwise return as-is
    if (path.startsWith("http://89.116.134.182:8080/local-assets/")) {
      const relativePath = path.replace("http://89.116.134.182:8080/local-assets/", "");
      return `${BASE}/${relativePath.replace(/\\/g, "/").replace(/^\/+/, "")}`;
    }
    
    // Map localhost:8081 to the live VPS local-assets folder
    if (path.startsWith("http://localhost:8081/")) {
      const relativePath = path.replace("http://localhost:8081/", "");
      return `${BASE}/${relativePath.replace(/\\/g, "/").replace(/^\/+/, "")}`;
    }
    // Map old WordPress domain to VPS (wp-content folder exists on VPS)
    if (path.includes("jntugvcev.edu.in/wp-content/")) {
      const wpPath = path.match(/wp-content\/(.+)/);
      if (wpPath) {
        if (
          path.includes("EEE-3.Dr_.V.S.VAKULA-Asst-Prof.jpg") ||
          path.includes("V.-Mani-Kumar-Photo-Mech.jpg") ||
          path.includes("WhatsApp-Image-2020-08-26-at-10.23.09-AM.jpeg")
        ) {
          return `${BASE}/${wpPath[1]}`;
        }
        return `${BASE}/wp-content/${wpPath[1]}`;
      }
    }
    return path;
  }

  const cleanPath = path.replace(/\\/g, "/").replace(/^\/+/, "");
  
  // Strip "local-assets/" prefix if it exists in the relative path
  let finalPath = cleanPath;
  if (finalPath.startsWith("local-assets/")) {
    finalPath = finalPath.replace("local-assets/", "");
  }

  // If the path starts with "assets/", it's a frontend public asset, resolve directly from host
  if (finalPath.startsWith("assets/")) {
    return `/${finalPath}`;
  }

  // Prepend "uploads/" if it's a relative path and doesn't already start with "uploads/"
  if (!finalPath.startsWith("uploads/")) {
    finalPath = `uploads/${finalPath}`;
  }

  return `${BASE}/${finalPath}`;
};

export const assetUrl = (path: string | null | undefined): string => {
  return getAssetUrl(path);
};

// Shortcuts for common folders
export const uploadUrl = (path: string) => assetUrl(`uploads/${path}`);
export const docUrl    = (path: string) => assetUrl(`docs/${path}`);
export const imageUrl  = (path: string) => assetUrl(`images/${path}`);

export const wpUrl = (oldUrl: string | null | undefined): string => {
  if (!oldUrl) return "";

  const wpMatch = oldUrl.match(/wp-content\/(.+)/);
  if (wpMatch) return `${BASE}/wp-content/${wpMatch[1]}`;

  const localMatch = oldUrl.match(/localhost:\d+\/(.+)/);
  if (localMatch) return `${BASE}/${localMatch[1]}`;

  if (oldUrl.startsWith("/uploads/") || oldUrl.startsWith("/images/")) {
    return `${BASE}${oldUrl}`;
  }

  return assetUrl(oldUrl);
};