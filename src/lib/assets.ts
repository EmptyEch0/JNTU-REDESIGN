const BASE = (import.meta.env.VITE_ASSETS_URL ?? "").replace(/\/$/, ""); // strip trailing slash

export const assetUrl = (path: string | null | undefined): string => {
  if (!path) return "";

  // Already a full URL — return as-is
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  // Normalize: remove leading slash
  const clean = path.replace(/^\/+/, "");

  return `${BASE}/${clean}`;
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