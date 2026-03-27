"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { FurniItem } from "@/lib/types";
import { HotelDomain } from "@/lib/types";
import { PixelCard } from "@/components/common/PixelCard";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { FurniImage } from "@/components/common/FurniImage";

const POPULAR_CLASSNAMES = [
  "throne",
  "rare_dragonlamp",
  "rare_colourable_pillar",
  "rare_fountain",
  "exe_floorlight",
  "rare_elephant_statue",
  "club_sofa",
  "hween_c15_sofa",
];

export function TrendingFurni() {
  const { t } = useLanguage();
  const [items, setItems] = useState<FurniItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(
          `/api/furnidata?hotel=${HotelDomain.COM}&tradeableOnly=true`
        );
        if (res.ok) {
          const all: FurniItem[] = await res.json();
          const popular = new Set(POPULAR_CLASSNAMES);
          const matched = all.filter((i) => popular.has(i.classname));
          const rares = all
            .filter((i) => i.rare && !popular.has(i.classname))
            .slice(0, 8);
          setItems([...matched, ...rares].slice(0, 8));
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <PixelCard className="p-4">
      <h2 className="font-[family-name:var(--font-pixel)] text-[10px] text-habbo-cyan uppercase tracking-wider mb-4">
        {t.dashboard.popularItems}
      </h2>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-10 bg-habbo-border/20 rounded animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-1">
          {items.map((item, idx) => (
            <Link
              key={item.classname}
              href={`/furni/${encodeURIComponent(item.classname)}`}
              className="flex items-center gap-3 px-2 py-1.5 rounded hover:bg-habbo-card-hover transition-colors group"
            >
              <span className="text-[10px] font-mono text-habbo-text-dim w-4 text-right">
                {idx + 1}
              </span>
              <FurniImage
                classname={item.classname}
                alt={item.name}
                size="sm"
                className="group-hover:scale-110 transition-transform"
              />
              <div className="flex-1 min-w-0">
                <div className="text-xs text-habbo-text truncate">
                  {item.name}
                </div>
              </div>
              {item.rare && (
                <span className="text-[7px] font-[family-name:var(--font-pixel)] text-habbo-gold">
                  RARE
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </PixelCard>
  );
}
