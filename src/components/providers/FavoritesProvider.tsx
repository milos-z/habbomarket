"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";

import { showToast } from "@/components/common/Toast";

const STORAGE_KEY = "habbomarket-favorites";

interface FavoritesContextValue {
  favorites: string[];
  addFavorite: (classname: string) => void;
  removeFavorite: (classname: string) => void;
  toggleFavorite: (classname: string) => void;
  isFavorite: (classname: string) => boolean;
  exportData: () => void;
  importData: () => void;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

function loadFromStorage(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveToStorage(items: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* storage full */
  }
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    setFavorites(loadFromStorage());
  }, []);

  const addFavorite = useCallback((classname: string) => {
    setFavorites((prev) => {
      if (prev.includes(classname)) return prev;
      const next = [...prev, classname];
      saveToStorage(next);
      return next;
    });
  }, []);

  const removeFavorite = useCallback((classname: string) => {
    setFavorites((prev) => {
      const next = prev.filter((c) => c !== classname);
      saveToStorage(next);
      return next;
    });
  }, []);

  const toggleFavorite = useCallback((classname: string) => {
    setFavorites((prev) => {
      const wasFaved = prev.includes(classname);
      const next = wasFaved
        ? prev.filter((c) => c !== classname)
        : [...prev, classname];
      saveToStorage(next);
      showToast(
        wasFaved ? "Removed from favorites" : "Added to favorites",
        wasFaved ? "info" : "success"
      );
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (classname: string) => favorites.includes(classname),
    [favorites]
  );

  const exportData = useCallback(() => {
    import("@/lib/utils").then(({ exportToJSON }) => {
      exportToJSON("habbomarket-favorites", favorites);
    });
  }, [favorites]);

  const importData = useCallback(() => {
    import("@/lib/utils").then(({ importFromJSON }) => {
      importFromJSON<string[]>().then((data) => {
        if (Array.isArray(data) && data.every((item) => typeof item === "string")) {
          setFavorites(data);
          saveToStorage(data);
          showToast(`Imported ${data.length} favorites`, "success");
        } else {
          showToast("Invalid favorites data format", "warning");
        }
      }).catch(() => {
        showToast("Import failed", "warning");
      });
    });
  }, []);

  return (
    <FavoritesContext value={{ favorites, addFavorite, removeFavorite, toggleFavorite, isFavorite, exportData, importData }}>
      {children}
    </FavoritesContext>
  );
}

export function useFavorites(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}
