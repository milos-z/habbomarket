"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import type { FurniItem } from "@/lib/types";
import { HotelDomain } from "@/lib/types";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { FurniImage } from "@/components/common/FurniImage";
import { PixelCard } from "@/components/common/PixelCard";
import { SectionHeader } from "@/components/common/SectionHeader";

const SPOTLIGHT_ITEMS = [
  "throne",
  "rare_dragonlamp*1",
  "rare_fountain",
  "rare_elephant_statue",
  "rare_colourable_pillar*1",
  "hween_c15_sofa",
  "val11_rare",
  "club_sofa",
  "rare_parasol*1",
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
          `/api/furnidata?hotel=${HotelDomain.DE}&tradeableOnly=true`
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

  const prev = useCallback(() => {
    setActiveIndex((p) => (p - 1 + Math.max(items.length, 1)) % Math.max(items.length, 1));
  }, [items.length]);

  useEffect(() => {
    if (items.length <= 1) return;
    const interval = setInterval(next, 4000);
    return () => clearInterval(interval);
  }, [items.length, next]);

  const touchStartX = useRef(0);
  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function handleTouchEnd(e: React.TouchEvent) {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) next();
      else prev();
    }
  }

  if (items.length === 0) {
    return (
      <PixelCard className="p-5 h-full">
        <div className="h-32 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-habbo-gold/30 border-t-habbo-gold rounded-full animate-spin" />
        </div>
      </PixelCard>
    );
  }

  const current = items[activeIndex];

  return (
    <PixelCard
      className="p-5 relative overflow-hidden h-full"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-habbo-gold/5 to-transparent pointer-events-none" />

      <div className="relative">
        <SectionHeader title={t.dashboard.spotlight} icon="star" color="gold" />

        <div className="flex items-center gap-5">
          <Link
            href={`/furni/${encodeURIComponent(current.classname)}`}
            className="shrink-0 w-20 h-20 flex items-center justify-center group rounded-xl bg-habbo-bg/40 p-2"
          >
            <FurniImage
              classname={current.classname}
              alt={current.name}
              size="lg"
              className="drop-shadow-xl group-hover:scale-110 transition-transform"
            />
          </Link>

          <div className="flex-1 min-w-0">
            <Link
              href={`/furni/${encodeURIComponent(current.classname)}`}
              className="block font-[family-name:var(--font-pixel)] text-sm text-habbo-text pixel-text-shadow hover:text-habbo-cyan transition-colors truncate"
            >
              {current.name}
            </Link>
            <p className="text-[11px] text-habbo-text-dim mt-1 line-clamp-2 leading-relaxed">
              {current.description}
            </p>
            <div className="flex items-center gap-2 mt-2">
              {current.rare && (
                <span className="text-[8px] font-[family-name:var(--font-pixel)] px-2 py-0.5 bg-habbo-gold/20 text-habbo-gold rounded border border-habbo-gold/20">
                  RARE
                </span>
              )}
              <span className="text-[10px] text-habbo-text-dim/70">
                {current.category}
              </span>
            </div>
          </div>
        </div>

        {/* Dot indicators */}
        <div className="flex items-center justify-center gap-1.5 mt-4">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`transition-all rounded-full ${
                idx === activeIndex
                  ? "w-5 h-1.5 bg-habbo-gold"
                  : "w-1.5 h-1.5 bg-habbo-border hover:bg-habbo-text-dim"
              }`}
            />
          ))}
        </div>
      </div>
    </PixelCard>
  );
}
