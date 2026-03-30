import type { TradeItem } from "./types";

const STORAGE_KEY = "habbomarket-trade-history";

export interface SavedTrade {
  id: string;
  timestamp: number;
  giveItems: TradeItem[];
  receiveItems: TradeItem[];
  giveCredits: number;
  receiveCredits: number;
  giveTotal: number;
  receiveTotal: number;
}

export function loadTradeHistory(): SavedTrade[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveTradeToHistory(trade: Omit<SavedTrade, "id" | "timestamp">): SavedTrade {
  const saved: SavedTrade = {
    ...trade,
    id: `trade_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    timestamp: Date.now(),
  };
  const history = loadTradeHistory();
  history.unshift(saved);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, 100)));
  } catch {
    /* storage full */
  }
  return saved;
}

export function removeTradeFromHistory(id: string): void {
  const history = loadTradeHistory().filter((t) => t.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch {
    /* noop */
  }
}

export function clearTradeHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* noop */
  }
}
