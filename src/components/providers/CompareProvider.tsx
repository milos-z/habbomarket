"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { CompareItem } from "@/lib/types";

interface CompareContextValue {
  items: CompareItem[];
  addItem: (item: CompareItem) => void;
  removeItem: (classname: string) => void;
  clearItems: () => void;
  hasItem: (classname: string) => boolean;
}

const CompareContext = createContext<CompareContextValue | null>(null);

const MAX_COMPARE_ITEMS = 4;

export function CompareProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CompareItem[]>([]);

  const addItem = useCallback((item: CompareItem) => {
    setItems((prev) => {
      if (prev.length >= MAX_COMPARE_ITEMS) return prev;
      if (prev.some((i) => i.classname === item.classname)) return prev;
      return [...prev, item];
    });
  }, []);

  const removeItem = useCallback((classname: string) => {
    setItems((prev) => prev.filter((i) => i.classname !== classname));
  }, []);

  const clearItems = useCallback(() => setItems([]), []);

  const hasItem = useCallback(
    (classname: string) => items.some((i) => i.classname === classname),
    [items]
  );

  return (
    <CompareContext value={{ items, addItem, removeItem, clearItems, hasItem }}>
      {children}
    </CompareContext>
  );
}

export function useCompare(): CompareContextValue {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used within CompareProvider");
  return ctx;
}
