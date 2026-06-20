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

  // Pass through already-absolute or special paths
  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("data:") ||
    path.startsWith("/src/") ||
    path.startsWith("/assets/") ||
    path.startsWith("/@fs/")
  ) {
    return path;
  }

  // Normalize slashes
  let cleanPath = path.replace(/\\/g, "/");

  // Remove any leading slash to avoid double-slash
  if (cleanPath.startsWith("/")) {
    cleanPath = cleanPath.substring(1);
  }

  // Legacy paths: "uploads/..." → prepend "local-assets/"
  if (cleanPath.startsWith("uploads/")) {
    cleanPath = `local-assets/${cleanPath}`;
  }

  // All local paths are served from the same origin at /local-assets/...
  return `/${cleanPath}`;
}
