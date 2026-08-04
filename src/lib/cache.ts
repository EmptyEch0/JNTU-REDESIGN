/**
 * Lightweight in-memory server cache for Database queries.
 * Speeds up response times from ~100-300ms (database roundtrip) to < 1ms.
 */

type CacheEntry<T> = {
  data: T;
  expiresAt: number;
};

class MemoryCache {
  private cache = new Map<string, CacheEntry<any>>();

  /**
   * Get cached data or execute fallback fetcher and cache result.
   */
  async getOrSet<T>(key: string, ttlMs: number, fetcher: () => Promise<T>): Promise<T> {
    const now = Date.now();
    const existing = this.cache.get(key);

    if (existing && existing.expiresAt > now) {
      return existing.data as T;
    }

    const data = await fetcher();
    this.cache.set(key, { data, expiresAt: now + ttlMs });
    return data;
  }

  /**
   * Invalidate specific key
   */
  invalidate(key: string) {
    this.cache.delete(key);
  }

  /**
   * Invalidate keys starting with a prefix (e.g. "academics:")
   */
  invalidatePrefix(prefix: string) {
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clear all cache
   */
  clear() {
    this.cache.clear();
  }
}

export const memoryCache = new MemoryCache();
