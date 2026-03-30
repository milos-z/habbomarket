"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import type { CompareItem } from "@/lib/types";
import { showToast } from "@/components/common/Toast";

const STORAGE_KEY = "habbomarket-compare";

interface CompareContextValue {
  items: CompareItem[];
  addItem: (item: CompareItem) => void;
  removeItem: (classname: string) => void;
  clearItems: () => void;
  hasItem: (classname: string) => boolean;
}

const CompareContext = createContext<CompareContextValue | null>(null);

const MAX_COMPARE_ITEMS = 4;

function loadFromStorage(): CompareItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveToStorage(items: CompareItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* storage full */
  }
}

export function CompareProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CompareItem[]>([]);

  useEffect(() => {
    setItems(loadFromStorage());
  }, []);

  const addItem = useCallback((item: CompareItem) => {
    setItems((prev) => {
      if (prev.length >= MAX_COMPARE_ITEMS) {
        showToast("Compare list is full (max 4)", "warning");
        return prev;
      }
      if (prev.some((i) => i.classname === item.classname)) return prev;
      const next = [...prev, item];
      saveToStorage(next);
      showToast(`Added "${item.name}" to compare`, "success");
      return next;
    });
  }, []);

  const removeItem = useCallback((classname: string) => {
    setItems((prev) => {
      const next = prev.filter((i) => i.classname !== classname);
      saveToStorage(next);
      showToast("Removed from compare", "info");
      return next;
    });
  }, []);

  const clearItems = useCallback(() => {
    setItems([]);
    saveToStorage([]);
    showToast("Compare list cleared", "info");
  }, []);

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
