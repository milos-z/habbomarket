"use client";

import { useState, useEffect } from "react";
import { PixelCard } from "@/components/common/PixelCard";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface MarketItem {
  classname: string;
  name: string;
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
  "hween_c15_sofa",
  "val11_rare",
];

export function MarketSummary() {
  const { t } = useLanguage();
  const [items, setItems] = useState<MarketItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const results = await Promise.allSettled(
          ITEMS_TO_CHECK.map(async (classname) => {
            const res = await fetch(
              `/api/market/history?classname=${encodeURIComponent(classname)}&hotel=com&days=7`
            );
            if (!res.ok) return null;
            const data = await res.json();
            if (!Array.isArray(data) || data.length === 0) return null;
            const item = data[0];
            const history: [number, number, number, number, number][] =
              item.marketData?.history ?? [];
            if (history.length < 2) return null;
            const recent = history[history.length - 1][0];
            const first = history[0][0];
            if (first === 0) return null;
            return {
              classname: item.ClassName as string,
              name: (item.FurniName as string) || classname,
              change: ((recent - first) / first) * 100,
            };
          })
        );

        const valid = results
          .filter(
            (r): r is PromiseFulfilledResult<MarketItem | null> =>
              r.status === "fulfilled"
          )
          .map((r) => r.value)
          .filter((v): v is MarketItem => v !== null);

        setItems(valid);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const avgChange =
    items.length > 0
      ? items.reduce((sum, i) => sum + i.change, 0) / items.length
      : 0;
  const upCount = items.filter((i) => i.change > 0).length;
  const downCount = items.filter((i) => i.change < 0).length;
  const trendLabel =
    avgChange > 1
      ? t.dashboard.marketUp
      : avgChange < -1
        ? t.dashboard.marketDown
        : t.dashboard.marketStable;
  const trendColor =
    avgChange > 1
      ? "text-habbo-green"
      : avgChange < -1
        ? "text-habbo-red"
        : "text-habbo-gold";

  if (loading) {
    return (
      <PixelCard className="p-4">
        <div className="h-16 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-habbo-cyan/30 border-t-habbo-cyan rounded-full animate-spin" />
        </div>
      </PixelCard>
    );
  }

  if (items.length === 0) return null;

  return (
    <PixelCard className="p-4">
      <h2 className="font-[family-name:var(--font-pixel)] text-[10px] text-habbo-purple uppercase tracking-wider mb-3">
        {t.dashboard.marketSummary}
      </h2>
      <div className="flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-3">
          <div
            className={`text-2xl font-mono font-bold ${trendColor}`}
          >
            {avgChange >= 0 ? "+" : ""}
            {avgChange.toFixed(1)}%
          </div>
          <div className="text-xs text-habbo-text-dim">
            <div className={`font-medium ${trendColor}`}>{trendLabel}</div>
            <div>
              {t.dashboard.avgChange} (7d)
            </div>
          </div>
        </div>
        <div className="flex gap-4 text-xs">
          <div className="text-center">
            <div className="font-mono font-bold text-habbo-green text-sm">
              {upCount}
            </div>
            <div className="text-habbo-text-dim">↑</div>
          </div>
          <div className="text-center">
            <div className="font-mono font-bold text-habbo-red text-sm">
              {downCount}
            </div>
            <div className="text-habbo-text-dim">↓</div>
          </div>
          <div className="text-center">
            <div className="font-mono font-bold text-habbo-text text-sm">
              {items.length}
            </div>
            <div className="text-habbo-text-dim">{t.dashboard.itemsTracked}</div>
          </div>
        </div>
        <div className="flex-1 min-w-[120px] flex gap-0.5 items-end h-8">
          {items
            .sort((a, b) => a.change - b.change)
            .map((item) => (
              <div
                key={item.classname}
                className="flex-1 rounded-t-sm transition-all"
                style={{
                  height: `${Math.min(100, Math.max(15, Math.abs(item.change) * 3 + 15))}%`,
                  backgroundColor:
                    item.change >= 0
                      ? "rgba(61, 214, 140, 0.6)"
                      : "rgba(255, 71, 87, 0.6)",
                }}
                title={`${item.name}: ${item.change >= 0 ? "+" : ""}${item.change.toFixed(1)}%`}
              />
            ))}
        </div>
      </div>
    </PixelCard>
  );
}
