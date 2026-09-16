/**
 * High-performance client-side image preloader & persistent cache.
 * Combines in-memory HTMLImageElement caching with the browser's CacheStorage API
 * to ensure that carousel and gallery images load instantaneously with zero stutter.
 */

const inMemoryPreloaded = new Set<string>();
const CACHE_NAME = "jntugv-carousel-cache-v1";

/**
 * Preloads a single image into memory and browser cache.
 */
export async function preloadImage(url: string | null | undefined): Promise<void> {
  if (!url || typeof window === "undefined") return;
  const cleanUrl = url.trim();
  if (!cleanUrl || inMemoryPreloaded.has(cleanUrl)) return;

  inMemoryPreloaded.add(cleanUrl);

  // 1. High-priority in-memory DOM Image object preload
  try {
    const img = new Image();
    img.decoding = "async";
    img.src = cleanUrl;
  } catch (err) {
    // ignore
  }

  // 2. Cache API persistence for same-origin images only
  //    External URLs (e.g. api.jntugv.edu.in) don't allow CORS fetch,
  //    so we skip the Cache API for them — the browser's native img cache handles those.
  const isSameOrigin =
    cleanUrl.startsWith("/") ||
    cleanUrl.startsWith(window.location.origin);

  if (isSameOrigin && "caches" in window) {
    try {
      const cache = await window.caches.open(CACHE_NAME);
      const match = await cache.match(cleanUrl);
      if (!match) {
        fetch(cleanUrl, { credentials: "omit" })
          .then((res) => {
            if (res.ok) {
              cache.put(cleanUrl, res);
            }
          })
          .catch(() => {});
      }
    } catch {
      // Ignore cache storage permission/sandbox errors
    }
  }
}

/**
 * Batch preloads multiple image URLs in parallel.
 */
export function preloadImages(urls: (string | null | undefined)[]): void {
  if (typeof window === "undefined") return;
  urls.forEach((u) => {
    if (u) preloadImage(u);
  });
}
