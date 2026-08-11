type CacheEntry<T> = {
  data: T;
  expiry: number;
};

class ServerCache {
  private cache = new Map<string, CacheEntry<any>>();

  get<T>(key: string): T | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return undefined;
    }
    return entry.data;
  }

  set<T>(key: string, data: T, ttlMs: number = 300000): void { // default 5 minutes
    this.cache.set(key, {
      data,
      expiry: Date.now() + ttlMs,
    });
  }

  invalidate(keyOrPrefix: string, isPrefix = false): void {
    if (!isPrefix) {
      this.cache.delete(keyOrPrefix);
    } else {
      for (const key of this.cache.keys()) {
        if (key.startsWith(keyOrPrefix)) {
          this.cache.delete(key);
        }
      }
    }
  }

  clear(): void {
    this.cache.clear();
  }
}

export const serverCache = new ServerCache();
