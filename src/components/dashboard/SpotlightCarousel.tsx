"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import type { FurniItem } from "@/lib/types";
import { HotelDomain } from "@/lib/types";
import { furniImageUrl } from "@/lib/utils";
import { useLanguage } from "@/components/providers/LanguageProvider";

const SPOTLIGHT_ITEMS = [
  "throne",
  "rare_dragonlamp",
  "rare_fountain",
  "rare_elephant_statue",
  "rare_colourable_pillar",
  "hween_c15_sofa",
  "val11_rare",
  "club_sofa",
  "rare_parasol",
  "exe_floorlight",
];

export function SpotlightCarousel() {
  const { t } = useLanguage();
  const [items, setItems] = useState<FurniItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(
          `/api/furnidata?hotel=${HotelDomain.COM}&tradeableOnly=true`
        );
        if (res.ok) {
          const all: FurniItem[] = await res.json();
          const spotlightSet = new Set(SPOTLIGHT_ITEMS);
          const matched = all.filter((i) => spotlightSet.has(i.classname));
          const rares = all.filter((i) => i.rare && !spotlightSet.has(i.classname));
          const combined = [
            ...matched,
            ...rares.slice(0, Math.max(0, 10 - matched.length)),
          ];
          setItems(combined.slice(0, 10));
        }
      } catch {
        /* silent */
      }
    }
    load();
  }, []);

  const next = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % Math.max(items.length, 1));
  }, [items.length]);

  useEffect(() => {
    if (items.length <= 1) return;
    const interval = setInterval(next, 4000);
    return () => clearInterval(interval);
  }, [items.length, next]);

  if (items.length === 0) {
    return (
      <div className="bg-habbo-card pixel-border-gold rounded-lg p-8 h-48 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-habbo-gold/30 border-t-habbo-gold rounded-full animate-spin" />
      </div>
    );
  }

  const current = items[activeIndex];

  return (
    <div className="bg-habbo-card pixel-border-gold rounded-lg p-5 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-habbo-gold/5 to-transparent pointer-events-none" />

      <div className="relative flex items-center gap-6">
        <Link
          href={`/furni/${encodeURIComponent(current.classname)}`}
          className="shrink-0 w-24 h-24 flex items-center justify-center group"
        >
          <img
            src={furniImageUrl(current.classname)}
            alt={current.name}
            className="max-h-full max-w-full object-contain drop-shadow-xl group-hover:scale-110 transition-transform"
          />
        </Link>

        <div className="flex-1 min-w-0">
          <div className="text-[9px] font-[family-name:var(--font-pixel)] text-habbo-gold uppercase tracking-wider mb-1">
            {t.dashboard.spotlight}
          </div>
          <Link
            href={`/furni/${encodeURIComponent(current.classname)}`}
            className="block font-[family-name:var(--font-pixel)] text-sm text-habbo-text pixel-text-shadow hover:text-habbo-cyan transition-colors truncate"
          >
            {current.name}
          </Link>
          <p className="text-xs text-habbo-text-dim mt-1 line-clamp-2">
            {current.description}
          </p>
          <div className="flex items-center gap-3 mt-2">
            {current.rare && (
              <span className="text-[8px] font-[family-name:var(--font-pixel)] px-2 py-0.5 bg-habbo-gold/20 text-habbo-gold rounded">
                RARE
              </span>
            )}
            <span className="text-[10px] text-habbo-text-dim">
              {current.category} · {current.furniline}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === activeIndex
                  ? "bg-habbo-gold scale-125"
                  : "bg-habbo-border hover:bg-habbo-text-dim"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
