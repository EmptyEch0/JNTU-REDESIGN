/**
 * Resolves a stored relative path or external URL to a fully qualified asset URL.
 *
 * Storage convention (DB value):  "local-assets/uploads/module/category/filename.jpg"
 * Served URL (same origin):        "/local-assets/uploads/module/category/filename.jpg"
 *
 * Supports backward compatibility for:
 *  - http/https absolute URLs
 *  - data: URIs
 *  - Vite imported asset paths (/src/, /assets/, /@fs/)
 *  - Legacy "uploads/..." paths (no leading "local-assets/")
 */
export function getAssetUrl(path?: string): string {
  if (!path) return "";
  
  const trimmedPath = path.trim();

  // Pass through already-absolute or special paths
  if (
    trimmedPath.startsWith("http://") ||
    trimmedPath.startsWith("https://") ||
    trimmedPath.startsWith("data:") ||
    trimmedPath.startsWith("/src/") ||
    trimmedPath.startsWith("/assets/") ||
    trimmedPath.startsWith("/@fs/")
  ) {
    return trimmedPath;
  }

  // Normalize slashes
  let cleanPath = trimmedPath.replace(/\\/g, "/");

  // Remove any leading slash to avoid double-slash
  if (cleanPath.startsWith("/")) {
    cleanPath = cleanPath.substring(1);
  }

  // Legacy paths: "uploads/..." → prepend "local-assets/"
  if (cleanPath.startsWith("uploads/")) {
    cleanPath = `local-assets/${cleanPath}`;
  }

  // Redirect uploads to the VPS asset host or configured VITE_ASSETS_URL
  if (cleanPath.startsWith("local-assets/")) {
    const subPath = cleanPath.substring("local-assets/".length);
    const assetsUrl = import.meta.env.VITE_ASSETS_URL || "https://jntu-redesign.vercel.app/vps-assets";
    const base = assetsUrl.endsWith("/") ? assetsUrl.slice(0, -1) : assetsUrl;
    const sub = subPath.startsWith("/") ? subPath.substring(1) : subPath;
    return `${base}/${sub}`;
  }

  // All local paths are served from the same origin at /local-assets/...
  return `/${cleanPath}`;
}
