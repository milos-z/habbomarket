"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { FurniItem } from "@/lib/types";
import { HotelDomain } from "@/lib/types";
import { FurniImage } from "./FurniImage";
import { PixelIcon } from "./PixelIcon";
import { useLanguage } from "@/components/providers/LanguageProvider";

const RECENT_KEY = "habbomarket-recent-searches";
const MAX_RECENT = 5;

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

function loadRecent(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveRecent(items: string[]) {
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(items.slice(0, MAX_RECENT)));
  } catch {
    /* noop */
  }
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FurniItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const navItems: NavItem[] = [
    { label: t.nav.dashboard, href: "/", icon: "star" },
    { label: t.nav.catalog, href: "/catalog", icon: "search" },
    { label: t.nav.trade, href: "/trade", icon: "trade" },
    { label: t.nav.arbitrage, href: "/arbitrage", icon: "arbitrage" },
    { label: t.nav.compare, href: "/compare", icon: "compare" },
    { label: t.nav.favorites, href: "/favorites", icon: "heart" },
    { label: t.nav.portfolio, href: "/portfolio", icon: "box" },
    { label: t.nav.alerts, href: "/alerts", icon: "alerts" },
  ];

  useEffect(() => {
    if (open) {
      setQuery("");
      setResults([]);
      setSelectedIndex(0);
      setRecentSearches(loadRecent());
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const searchFurni = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `/api/furnidata?hotel=${HotelDomain.DE}&search=${encodeURIComponent(q)}&limit=8`
      );
      if (res.ok) {
        const data: FurniItem[] = await res.json();
        setResults(data);
      }
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchFurni(query), 250);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, searchFurni]);

  const filteredNav = query
    ? navItems.filter((item) =>
        item.label.toLowerCase().includes(query.toLowerCase())
      )
    : navItems;

  const allItems = [
    ...filteredNav.map((n) => ({ type: "nav" as const, ...n })),
    ...results.map((f) => ({
      type: "furni" as const,
      label: f.name,
      href: `/furni/${encodeURIComponent(f.classname)}`,
      classname: f.classname,
      category: f.category,
      rare: f.rare,
    })),
  ];

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  function navigate(href: string, searchTerm?: string) {
    if (searchTerm) {
      const recent = loadRecent();
      const updated = [searchTerm, ...recent.filter((r) => r !== searchTerm)].slice(0, MAX_RECENT);
      saveRecent(updated);
    }
    onClose();
    router.push(href);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, allItems.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selected = allItems[selectedIndex];
      if (selected) {
        navigate(selected.href, selected.type === "furni" ? selected.label : undefined);
      }
    } else if (e.key === "Escape") {
      onClose();
    }
  }

  useEffect(() => {
    function handleGlobalKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
      }
    }
    if (open) {
      document.addEventListener("keydown", handleGlobalKeyDown);
      return () => document.removeEventListener("keydown", handleGlobalKeyDown);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg mx-4 bg-habbo-nav border border-habbo-border rounded-xl shadow-2xl overflow-hidden animate-slide-up">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-habbo-border">
          <svg className="w-4 h-4 text-habbo-text-dim shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search furni or navigate..."
            className="flex-1 bg-transparent text-sm text-habbo-text placeholder:text-habbo-text-dim/50 outline-none"
          />
          <kbd className="hidden sm:inline-flex px-1.5 py-0.5 text-[9px] text-habbo-text-dim bg-habbo-card border border-habbo-border rounded">
            ESC
          </kbd>
        </div>

        <div className="max-h-[50vh] overflow-y-auto py-2">
          {!query && recentSearches.length > 0 && (
            <div className="px-3 pb-2">
              <div className="text-[9px] font-[family-name:var(--font-pixel)] text-habbo-text-dim uppercase tracking-wider px-1 mb-1.5">
                Recent
              </div>
              {recentSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="w-full text-left px-3 py-1.5 text-xs text-habbo-text-dim hover:text-habbo-text hover:bg-habbo-card/50 rounded transition-colors flex items-center gap-2"
                >
                  <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {term}
                </button>
              ))}
            </div>
          )}

          {filteredNav.length > 0 && (
            <div className="px-3 pb-1">
              <div className="text-[9px] font-[family-name:var(--font-pixel)] text-habbo-text-dim uppercase tracking-wider px-1 mb-1.5">
                Pages
              </div>
              {filteredNav.map((item, idx) => (
                <button
                  key={item.href}
                  onClick={() => navigate(item.href)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full text-left px-3 py-2 text-sm rounded transition-colors flex items-center gap-2.5 ${
                    selectedIndex === idx
                      ? "bg-habbo-card text-habbo-cyan"
                      : "text-habbo-text-dim hover:text-habbo-text hover:bg-habbo-card/50"
                  }`}
                >
                  <PixelIcon name={item.icon as Parameters<typeof PixelIcon>[0]["name"]} size="sm" />
                  {item.label}
                </button>
              ))}
            </div>
          )}

          {loading && (
            <div className="px-4 py-3 flex items-center gap-2 text-xs text-habbo-text-dim">
              <div className="w-3 h-3 border border-habbo-cyan/30 border-t-habbo-cyan rounded-full animate-spin" />
              Searching...
            </div>
          )}

          {results.length > 0 && (
            <div className="px-3 pt-1">
              <div className="text-[9px] font-[family-name:var(--font-pixel)] text-habbo-text-dim uppercase tracking-wider px-1 mb-1.5">
                Furni
              </div>
              {results.map((item, i) => {
                const globalIdx = filteredNav.length + i;
                return (
                  <button
                    key={item.classname}
                    onClick={() => navigate(`/furni/${encodeURIComponent(item.classname)}`, item.name)}
                    onMouseEnter={() => setSelectedIndex(globalIdx)}
                    className={`w-full text-left px-3 py-2 text-sm rounded transition-colors flex items-center gap-3 ${
                      selectedIndex === globalIdx
                        ? "bg-habbo-card text-habbo-cyan"
                        : "text-habbo-text-dim hover:text-habbo-text hover:bg-habbo-card/50"
                    }`}
                  >
                    <FurniImage classname={item.classname} alt={item.name} size="sm" revision={item.revision} />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs truncate">{item.name}</div>
                      <div className="text-[10px] text-habbo-text-dim/60 truncate">
                        {item.category}
                        {item.rare && (
                          <span className="ml-1.5 text-habbo-gold">RARE</span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {query.length >= 2 && !loading && results.length === 0 && filteredNav.length === 0 && (
            <div className="px-4 py-6 text-center text-xs text-habbo-text-dim">
              No results found for &ldquo;{query}&rdquo;
            </div>
          )}
        </div>

        <div className="px-4 py-2 border-t border-habbo-border/50 flex items-center justify-between text-[10px] text-habbo-text-dim/50">
          <span>Navigate with ↑↓ · Select with Enter</span>
          <span>
            <kbd className="px-1 py-0.5 bg-habbo-card border border-habbo-border rounded text-[9px]">⌘</kbd>
            {" + "}
            <kbd className="px-1 py-0.5 bg-habbo-card border border-habbo-border rounded text-[9px]">K</kbd>
          </span>
        </div>
      </div>
    </div>
  );
}

export function useCommandPalette() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return { open, setOpen };
}
