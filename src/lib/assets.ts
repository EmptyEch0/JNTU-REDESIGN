const BASE = (import.meta.env.VITE_ASSETS_URL ?? "").replace(/\/$/, ""); // strip trailing slash

export const getAssetUrl = (path: string | null | undefined): string => {
  if (!path) return "";

  if (path.startsWith("http://") || path.startsWith("https://")) {
    // Map old VPS IP to correct proxy config if needed, otherwise return as-is
    if (path.startsWith("http://89.116.134.182:8080/local-assets/")) {
      const relativePath = path.replace("http://89.116.134.182:8080/local-assets/", "");
      return `${BASE}/${relativePath.replace(/\\/g, "/").replace(/^\/+/, "")}`;
    }
    return path;
  }

  const cleanPath = path.replace(/\\/g, "/").replace(/^\/+/, "");
  
  // Strip "local-assets/" prefix if it exists in the relative path
  let finalPath = cleanPath;
  if (finalPath.startsWith("local-assets/")) {
    finalPath = finalPath.replace("local-assets/", "");
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
  if (wpMatch) return `${BASE}/${wpMatch[1]}`;

  const localMatch = oldUrl.match(/localhost:\d+\/(.+)/);
  if (localMatch) return `${BASE}/${localMatch[1]}`;

  if (oldUrl.startsWith("/uploads/") || oldUrl.startsWith("/images/")) {
    return `${BASE}${oldUrl}`;
  }

  return assetUrl(oldUrl);
};