"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { furniImageUrl, formatCredits } from "@/lib/utils";
import { PixelCard } from "@/components/common/PixelCard";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface MoverItem {
  classname: string;
  name: string;
  avgPrice: number;
  change: number;
}

const ITEMS_TO_CHECK = [
  "throne",
  "rare_dragonlamp",
  "rare_fountain",
  "rare_colourable_pillar",
  "exe_floorlight",
  "club_sofa",
  "rare_parasol",
  "rare_elephant_statue",
];

export function PriceMovers() {
  const { t } = useLanguage();
  const [movers, setMovers] = useState<MoverItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const results = await Promise.allSettled(
          ITEMS_TO_CHECK.map(async (classname) => {
            const res = await fetch(
              `/api/market/history?classname=${encodeURIComponent(classname)}&hotel=com&days=30`
            );
            if (!res.ok) return null;
            const data = await res.json();
            if (!Array.isArray(data) || data.length === 0) return null;
            const item = data[0];
            const history: [number, number, number, number, number][] =
              item.marketData?.history ?? [];
            if (history.length < 2) return null;
            const recent = history[history.length - 1][0];
            const previous = history[history.length - 2][0];
            if (previous === 0) return null;
            return {
              classname: item.ClassName as string,
              name: (item.FurniName as string) || classname,
              avgPrice: recent,
              change: ((recent - previous) / previous) * 100,
            };
          })
        );

        const valid = results
          .filter(
            (r): r is PromiseFulfilledResult<MoverItem | null> =>
              r.status === "fulfilled"
          )
          .map((r) => r.value)
          .filter((v): v is MoverItem => v !== null)
          .sort((a, b) => Math.abs(b.change) - Math.abs(a.change));

        setMovers(valid.slice(0, 6));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <PixelCard className="p-4">
      <h2 className="font-[family-name:var(--font-pixel)] text-[10px] text-habbo-gold uppercase tracking-wider mb-4">
        {t.dashboard.priceMovers}
      </h2>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-10 bg-habbo-border/20 rounded animate-pulse" />
          ))}
        </div>
      ) : movers.length === 0 ? (
        <p className="text-xs text-habbo-text-dim text-center py-4">
          {t.dashboard.loadingMarketData}
        </p>
      ) : (
        <div className="space-y-1">
          {movers.map((item) => (
            <Link
              key={item.classname}
              href={`/furni/${encodeURIComponent(item.classname)}`}
              className="flex items-center gap-3 px-2 py-1.5 rounded hover:bg-habbo-card-hover transition-colors group"
            >
              <img
                src={furniImageUrl(item.classname)}
                alt={item.name}
                className="w-7 h-7 object-contain group-hover:scale-110 transition-transform"
                loading="lazy"
              />
              <div className="flex-1 min-w-0">
                <div className="text-xs text-habbo-text truncate">
                  {item.name}
                </div>
                <div className="text-[10px] font-mono text-habbo-text-dim">
                  {formatCredits(item.avgPrice)}c
                </div>
              </div>
              <span
                className={`text-xs font-mono font-bold ${
                  item.change >= 0 ? "text-habbo-green" : "text-habbo-red"
                }`}
              >
                {item.change >= 0 ? "+" : ""}
                {item.change.toFixed(1)}%
              </span>
            </Link>
          ))}
        </div>
      )}
    </PixelCard>
  );
}
