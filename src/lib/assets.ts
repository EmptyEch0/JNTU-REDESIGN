const BASE = import.meta.env.VITE_ASSETS_URL || "http://localhost:9999";

export const assetUrl = (path: string) => `${BASE}/${path}`;

// Shortcuts for common folders
export const uploadUrl  = (path: string) => assetUrl(`uploads/${path}`);
export const docUrl     = (path: string) => assetUrl(`docs/${path}`);
export const imageUrl   = (path: string) => assetUrl(`images/${path}`);
