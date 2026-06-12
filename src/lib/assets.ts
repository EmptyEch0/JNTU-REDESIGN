const BASE = import.meta.env.VITE_ASSETS_URL ?? "";

export const assetUrl = (path: string) => `${BASE}/${path}`;

// Shortcuts for common folders
export const uploadUrl  = (path: string) => assetUrl(`uploads/${path}`);
export const docUrl     = (path: string) => assetUrl(`docs/${path}`);
export const imageUrl   = (path: string) => assetUrl(`images/${path}`);

export const wpUrl = (oldUrl: string | null | undefined): string | null => {
  if (!oldUrl) return null;
  const match = oldUrl.match(/wp-content\/(.+)/);
  if (match) return `${BASE}/${match[1]}`;
  // handle localhost:9999 URLs already in DB or absolute paths
  const local = oldUrl.match(/localhost:\d+\/(.+)/);
  if (local) return `${BASE}/${local[1]}`;
  
  // If the DB has a clean relative path like /uploads/...
  if (oldUrl.startsWith('/uploads/') || oldUrl.startsWith('/images/')) {
    return `${BASE}${oldUrl}`;
  }
  
  return oldUrl;
};
