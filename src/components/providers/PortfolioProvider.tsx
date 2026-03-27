"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";

const STORAGE_KEY = "habbomarket-portfolio";

export interface PortfolioEntry {
  classname: string;
  name: string;
  quantity: number;
}

interface PortfolioContextValue {
  entries: PortfolioEntry[];
  addEntry: (classname: string, name: string, quantity?: number) => void;
  removeEntry: (classname: string) => void;
  updateQuantity: (classname: string, quantity: number) => void;
  getEntry: (classname: string) => PortfolioEntry | undefined;
  totalItems: number;
}

const PortfolioContext = createContext<PortfolioContextValue | null>(null);

function loadFromStorage(): PortfolioEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveToStorage(items: PortfolioEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* storage full */
  }
}

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<PortfolioEntry[]>([]);

  useEffect(() => {
    setEntries(loadFromStorage());
  }, []);

  const addEntry = useCallback((classname: string, name: string, quantity = 1) => {
    setEntries((prev) => {
      const existing = prev.find((e) => e.classname === classname);
      let next: PortfolioEntry[];
      if (existing) {
        next = prev.map((e) =>
          e.classname === classname
            ? { ...e, quantity: e.quantity + quantity }
            : e
        );
      } else {
        next = [...prev, { classname, name, quantity }];
      }
      saveToStorage(next);
      return next;
    });
  }, []);

  const removeEntry = useCallback((classname: string) => {
    setEntries((prev) => {
      const next = prev.filter((e) => e.classname !== classname);
      saveToStorage(next);
      return next;
    });
  }, []);

  const updateQuantity = useCallback((classname: string, quantity: number) => {
    setEntries((prev) => {
      const next =
        quantity <= 0
          ? prev.filter((e) => e.classname !== classname)
          : prev.map((e) =>
              e.classname === classname ? { ...e, quantity } : e
            );
      saveToStorage(next);
      return next;
    });
  }, []);

  const getEntry = useCallback(
    (classname: string) => entries.find((e) => e.classname === classname),
    [entries]
  );

  const totalItems = entries.reduce((sum, e) => sum + e.quantity, 0);

  return (
    <PortfolioContext
      value={{ entries, addEntry, removeEntry, updateQuantity, getEntry, totalItems }}
    >
      {children}
    </PortfolioContext>
  );
}

export function usePortfolio(): PortfolioContextValue {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error("usePortfolio must be used within PortfolioProvider");
  return ctx;
}
