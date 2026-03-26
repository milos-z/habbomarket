interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const store = new Map<string, CacheEntry<unknown>>();

export function getCached<T>(key: string): T | null {
  const entry = store.get(key) as CacheEntry<T> | undefined;
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return null;
  }
  return entry.data;
}

export function setCache<T>(key: string, data: T, ttlMs: number): void {
  store.set(key, { data, expiresAt: Date.now() + ttlMs });
}

const ONE_HOUR = 60 * 60 * 1000;
const FIVE_MINUTES = 5 * 60 * 1000;

export const TTL = {
  FURNIDATA: ONE_HOUR,
  MARKET_HISTORY: FIVE_MINUTES,
} as const;
