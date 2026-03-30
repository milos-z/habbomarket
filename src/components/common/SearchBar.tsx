"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { FurniItem } from "@/lib/types";
import { HotelDomain } from "@/lib/types";
import { debounce } from "@/lib/utils";
import { FurniImage } from "@/components/common/FurniImage";
import { useLanguage } from "@/components/providers/LanguageProvider";

const RECENT_KEY = "habbomarket-recent-searches";
const MAX_RECENT = 6;

interface RecentSearchEntry {
  classname: string;
  name: string;
}

function loadRecent(): RecentSearchEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveRecent(entry: RecentSearchEntry) {
  try {
    const prev = loadRecent().filter((r) => r.classname !== entry.classname);
    const next = [entry, ...prev].slice(0, MAX_RECENT);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    /* storage full */
  }
}

function clearRecentStorage() {
  try {
    localStorage.removeItem(RECENT_KEY);
  } catch {
    /* noop */
  }
}

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  onSelect?: (item: FurniItem) => void;
}

export function SearchBar({
  placeholder = "Search furni...",
  className = "",
  onSelect,
}: SearchBarProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FurniItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recent, setRecent] = useState<RecentSearchEntry[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setRecent(loadRecent());
  }, []);

  const search = useCallback(
    debounce(async (term: string) => {
      if (term.length < 2) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(
          `/api/furnidata?hotel=${HotelDomain.DE}&search=${encodeURIComponent(term)}&limit=8`
        );
        if (res.ok) {
          const data: FurniItem[] = await res.json();
          setResults(data);
        }
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    search(query);
  }, [query, search]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(item: FurniItem) {
    saveRecent({ classname: item.classname, name: item.name });
    setRecent(loadRecent());
    setIsOpen(false);
    setQuery("");
    if (onSelect) {
      onSelect(item);
    } else {
      router.push(`/furni/${encodeURIComponent(item.classname)}`);
    }
  }

  function handleRecentClick(entry: RecentSearchEntry) {
    setIsOpen(false);
    setQuery("");
    router.push(`/furni/${encodeURIComponent(entry.classname)}`);
  }

  function handleClearRecent() {
    clearRecentStorage();
    setRecent([]);
  }

  const showRecent = isOpen && query.length < 2 && recent.length > 0 && !onSelect;

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-habbo-text-dim"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2.5 bg-habbo-input border border-habbo-border rounded-lg text-sm text-habbo-text placeholder:text-habbo-text-dim/50 focus:outline-none focus:border-habbo-cyan/50 focus:ring-1 focus:ring-habbo-cyan/20 transition-colors"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-habbo-cyan/30 border-t-habbo-cyan rounded-full animate-spin" />
        )}
      </div>

      {showRecent && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-habbo-nav border border-habbo-border rounded-lg shadow-2xl overflow-hidden z-50 animate-slide-up">
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-habbo-border/50">
            <span className="text-[10px] font-[family-name:var(--font-pixel)] text-habbo-text-dim uppercase tracking-wider">
              {t.common.recentSearches}
            </span>
            <button
              onClick={handleClearRecent}
              className="text-[10px] text-habbo-text-dim hover:text-habbo-red transition-colors"
            >
              {t.common.clearHistory}
            </button>
          </div>
          {recent.map((entry) => (
            <button
              key={entry.classname}
              onClick={() => handleRecentClick(entry)}
              className="w-full flex items-center gap-3 px-3 py-2 hover:bg-habbo-card transition-colors text-left"
            >
              <FurniImage classname={entry.classname} alt={entry.name} size="md" />
              <div className="flex-1 min-w-0">
                <div className="text-sm text-habbo-text truncate">{entry.name}</div>
                <div className="text-xs text-habbo-text-dim truncate">{entry.classname}</div>
              </div>
              <span className="text-habbo-text-dim/40 text-xs">↗</span>
            </button>
          ))}
        </div>
      )}

      {isOpen && results.length > 0 && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-habbo-nav border border-habbo-border rounded-lg shadow-2xl overflow-hidden z-50 animate-slide-up">
          {results.map((item) => (
            <button
              key={item.classname}
              onClick={() => handleSelect(item)}
              className="w-full flex items-center gap-3 px-3 py-2 hover:bg-habbo-card transition-colors text-left"
            >
              <FurniImage classname={item.classname} alt={item.name} size="md" revision={item.revision} />
              <div className="flex-1 min-w-0">
                <div className="text-sm text-habbo-text truncate">
                  {item.name}
                </div>
                <div className="text-xs text-habbo-text-dim truncate">
                  {item.classname}
                </div>
              </div>
              {item.rare && (
                <span className="text-[9px] px-1.5 py-0.5 bg-habbo-gold/20 text-habbo-gold rounded">
                  RARE
                </span>
              )}
              {onSelect && (
                <span className="text-[9px] px-1.5 py-0.5 bg-habbo-cyan/20 text-habbo-cyan rounded">
                  +
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
