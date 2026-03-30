"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { FurniItem } from "@/lib/types";
import { HotelDomain } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { PixelCard } from "@/components/common/PixelCard";
import { SectionHeader } from "@/components/common/SectionHeader";
import { PixelIcon } from "@/components/common/PixelIcon";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { FurniImage } from "@/components/common/FurniImage";

interface TrendItem extends FurniItem {
  avgPrice?: number;
}

const POPULAR_CLASSNAMES = [
  "throne",
  "rare_dragonlamp*1",
  "rare_colourable_pillar*1",
  "rare_fountain",
  "exe_floorlight",
  "rare_elephant_statue",
  "club_sofa",
  "hween_c15_sofa",
];

export function TrendingFurni() {
  const { t } = useLanguage();
  const [items, setItems] = useState<TrendItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(
          `/api/furnidata?hotel=${HotelDomain.DE}&tradeableOnly=true`
        );
        if (!res.ok) return;
        const all: FurniItem[] = await res.json();
        const popular = new Set(POPULAR_CLASSNAMES);
        const matched = all.filter((i) => popular.has(i.classname));
        const rares = all
          .filter((i) => i.rare && !popular.has(i.classname))
          .slice(0, 8);
        const combined = [...matched, ...rares].slice(0, 8) as TrendItem[];

        const priceResults = await Promise.allSettled(
          combined.map(async (item) => {
            try {
              const r = await fetch(
                `/api/market/history?classname=${encodeURIComponent(item.classname)}&hotel=de&days=7`
              );
              if (!r.ok) return 0;
              const d = await r.json();
              if (!Array.isArray(d) || d.length === 0) return 0;
              const history = d[0]?.marketData?.history ?? [];
              if (history.length === 0) return 0;
              return history[history.length - 1][0] as number;
            } catch {
              return 0;
            }
          })
        );

        combined.forEach((item, idx) => {
          const result = priceResults[idx];
          item.avgPrice = result.status === "fulfilled" ? result.value : 0;
        });

        setItems(combined);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <PixelCard className="p-4">
      <SectionHeader title={t.dashboard.popularItems} icon="star" color="cyan" />

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-12 bg-habbo-border/20 rounded animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-6 text-habbo-text-dim">
          <PixelIcon name="star" size="xl" className="opacity-40" />
          <p className="text-xs">{t.dashboard.loadingMarketData}</p>
        </div>
      ) : (
        <div className="space-y-1.5">
          {items.map((item, idx) => (
            <Link
              key={item.classname}
              href={`/furni/${encodeURIComponent(item.classname)}`}
              className="flex items-center gap-3 px-2.5 py-2 rounded-lg hover:bg-habbo-card-hover transition-colors group"
            >
              <span className="text-[10px] font-mono text-habbo-text-dim/50 w-3 text-right">
                {idx + 1}
              </span>
              <FurniImage
                classname={item.classname}
                alt={item.name}
                size="sm"
                revision={item.revision}
                className="group-hover:scale-110 transition-transform"
              />
              <div className="flex-1 min-w-0">
                <div className="text-xs text-habbo-text truncate group-hover:text-habbo-cyan transition-colors">
                  {item.name}
                </div>
                <div className="text-[10px] text-habbo-text-dim truncate">
                  {item.category} · {item.furniline}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-[11px] font-mono font-bold text-habbo-cyan">
                  {formatPrice(item.avgPrice ?? 0)}
                </div>
                {item.rare && (
                  <span className="text-[7px] font-pixel text-habbo-gold">
                    RARE
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </PixelCard>
  );
}
