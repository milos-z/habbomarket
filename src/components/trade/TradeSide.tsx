"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { TradeItem, FurniItem } from "@/lib/types";
import { HotelDomain } from "@/lib/types";
import { debounce, formatCredits, formatPrice } from "@/lib/utils";
import { FurniImage } from "@/components/common/FurniImage";
import { PixelCard } from "@/components/common/PixelCard";
import { PixelIcon } from "@/components/common/PixelIcon";

interface TradeSideProps {
  label: string;
  items: TradeItem[];
  total: number;
  credits: number;
  onCreditsChange: (value: number) => void;
  onAdd: (classname: string, name: string) => void;
  onRemove: (classname: string) => void;
  onUpdateQuantity: (classname: string, quantity: number) => void;
  searchPlaceholder: string;
  perItemLabel: string;
  creditsLabel: string;
  creditsPlaceholder: string;
}

export function TradeSide({
  label,
  items,
  total,
  credits,
  onCreditsChange,
  onAdd,
  onRemove,
  onUpdateQuantity,
  searchPlaceholder,
  perItemLabel,
  creditsLabel,
  creditsPlaceholder,
}: TradeSideProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FurniItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const search = useCallback(
    debounce(async (term: string) => {
      if (term.length < 2) {
        setResults([]);
        return;
      }
      setSearchLoading(true);
      try {
        const res = await fetch(
          `/api/furnidata?hotel=${HotelDomain.DE}&search=${encodeURIComponent(term)}&limit=8`
        );
        if (res.ok) {
          const data: FurniItem[] = await res.json();
          setResults(data);
        }
      } finally {
        setSearchLoading(false);
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
    onAdd(item.classname, item.name);
    setQuery("");
    setIsOpen(false);
    setResults([]);
  }

  return (
    <PixelCard className="p-4 flex flex-col gap-3 flex-1 min-w-0">
      <div className="flex items-center justify-between">
        <h2 className="font-[family-name:var(--font-pixel)] text-[10px] text-habbo-text uppercase tracking-wider">
          {label}
        </h2>
        <div className="text-xs font-mono text-habbo-gold font-bold">
          {formatCredits(total + credits)}c
        </div>
      </div>

      {/* Credits input */}
      <div className="flex items-center gap-2 px-2 py-2 rounded-lg bg-habbo-gold/5 border border-habbo-gold/20">
        <span className="text-habbo-gold shrink-0">
          <PixelIcon name="credits" size="md" />
        </span>
        <div className="flex-1 min-w-0">
          <label className="text-[9px] font-[family-name:var(--font-pixel)] text-habbo-gold/70 uppercase tracking-wider block mb-0.5">
            {creditsLabel}
          </label>
          <input
            type="number"
            value={credits || ""}
            onChange={(e) => onCreditsChange(Math.max(0, parseInt(e.target.value) || 0))}
            placeholder={creditsPlaceholder}
            min={0}
            className="w-full bg-transparent border-none text-sm font-mono text-habbo-gold placeholder:text-habbo-gold/30 focus:outline-none p-0"
          />
        </div>
        {credits > 0 && (
          <div className="text-xs font-mono font-bold text-habbo-gold shrink-0">
            {formatCredits(credits)}c
          </div>
        )}
      </div>

      {/* Search */}
      <div ref={wrapperRef} className="relative">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-habbo-text-dim"
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
            placeholder={searchPlaceholder}
            className="w-full pl-9 pr-4 py-2 bg-habbo-input border border-habbo-border rounded text-xs text-habbo-text placeholder:text-habbo-text-dim/50 focus:outline-none focus:border-habbo-cyan/50 transition-colors"
          />
          {searchLoading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 border-2 border-habbo-cyan/30 border-t-habbo-cyan rounded-full animate-spin" />
          )}
        </div>

        {isOpen && results.length > 0 && query.length >= 2 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-habbo-nav border border-habbo-border rounded-lg shadow-2xl overflow-hidden z-50 max-h-48 overflow-y-auto animate-slide-up">
            {results.map((item) => (
              <button
                key={item.classname}
                onClick={() => handleSelect(item)}
                className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-habbo-card transition-colors text-left"
              >
                <FurniImage classname={item.classname} alt={item.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-habbo-text truncate">{item.name}</div>
                </div>
                <span className="text-[9px] px-1.5 py-0.5 bg-habbo-cyan/20 text-habbo-cyan rounded">+</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Items list */}
      <div className="flex-1 min-h-0 space-y-1 overflow-y-auto max-h-[280px]">
        {items.length === 0 ? (
          <div className="text-center py-4 text-habbo-text-dim/50 text-xs">
            {searchPlaceholder}
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.classname}
              className="flex items-center gap-2 px-2 py-1.5 rounded bg-habbo-bg/50 group"
            >
              <FurniImage classname={item.classname} alt={item.name} size="sm" />
              <div className="flex-1 min-w-0">
                <div className="text-xs text-habbo-text truncate">{item.name}</div>
                <div className="text-[10px] text-habbo-text-dim font-mono">
                  {item.loading ? (
                    <span className="inline-block w-3 h-3 border border-habbo-cyan/30 border-t-habbo-cyan rounded-full animate-spin" />
                  ) : (
                    item.avgPrice > 0
                      ? `${formatCredits(item.avgPrice)}c ${perItemLabel}`
                      : "N/A"
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onUpdateQuantity(item.classname, item.quantity - 1)}
                  className="w-7 h-7 sm:w-5 sm:h-5 rounded bg-habbo-card hover:bg-habbo-card-hover border border-habbo-border text-[10px] text-habbo-text flex items-center justify-center transition-colors"
                >
                  −
                </button>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    if (val > 0) onUpdateQuantity(item.classname, val);
                  }}
                  className="w-10 text-center bg-habbo-input border border-habbo-border rounded text-[10px] text-habbo-text py-1 sm:py-0.5 focus:outline-none focus:border-habbo-cyan/50"
                  min={1}
                />
                <button
                  onClick={() => onUpdateQuantity(item.classname, item.quantity + 1)}
                  className="w-7 h-7 sm:w-5 sm:h-5 rounded bg-habbo-card hover:bg-habbo-card-hover border border-habbo-border text-[10px] text-habbo-text flex items-center justify-center transition-colors"
                >
                  +
                </button>
              </div>
              <div className="text-right text-xs font-mono text-habbo-gold min-w-[60px]">
                {item.loading ? "..." : item.avgPrice > 0 ? `${formatCredits(item.avgPrice * item.quantity)}c` : "N/A"}
              </div>
              <button
                onClick={() => onRemove(item.classname)}
                className="text-habbo-text-dim hover:text-habbo-red text-xs sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </PixelCard>
  );
}
