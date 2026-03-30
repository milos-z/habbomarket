"use client";

import { useState, useEffect } from "react";
import { PixelCard } from "@/components/common/PixelCard";
import { SectionHeader } from "@/components/common/SectionHeader";
import { PixelIcon } from "@/components/common/PixelIcon";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface MarketItem {
  classname: string;
  name: string;
  change: number;
}

const ITEMS_TO_CHECK = [
  "throne",
  "rare_dragonlamp*1",
  "rare_fountain",
  "rare_colourable_pillar*1",
  "exe_floorlight",
  "club_sofa",
  "rare_parasol*1",
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
              `/api/market/history?classname=${encodeURIComponent(classname)}&hotel=de&days=7`
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
        <SectionHeader title={t.dashboard.marketSummary} icon="credits" color="purple" />
        <div className="h-24 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-habbo-cyan/30 border-t-habbo-cyan rounded-full animate-spin" />
        </div>
      </PixelCard>
    );
  }

  if (items.length === 0) return <PixelCard className="p-4"><SectionHeader title={t.dashboard.marketSummary} icon="credits" color="purple" /><p className="text-xs text-habbo-text-dim text-center py-4">{t.dashboard.loadingMarketData}</p></PixelCard>;

  return (
    <PixelCard className="p-4">
      <SectionHeader title={t.dashboard.marketSummary} icon="credits" color="purple" />

      <div className="flex items-center gap-4 mb-4">
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${avgChange > 1 ? "bg-habbo-green/10 border border-habbo-green/20" : avgChange < -1 ? "bg-habbo-red/10 border border-habbo-red/20" : "bg-habbo-gold/10 border border-habbo-gold/20"}`}>
          <span className={`${trendColor} text-xl font-mono font-bold`}>
            {avgChange >= 0 ? "+" : ""}{avgChange.toFixed(0)}%
          </span>
        </div>
        <div>
          <div className={`text-sm font-medium ${trendColor}`}>{trendLabel}</div>
          <div className="text-[10px] text-habbo-text-dim">{t.dashboard.avgChange} (7d)</div>
        </div>
        <div className="flex gap-3 ml-auto">
          <div className="text-center px-2.5 py-1.5 rounded-lg bg-habbo-green/5">
            <div className="font-mono font-bold text-habbo-green text-sm">{upCount}</div>
            <div className="text-[9px] text-habbo-text-dim flex items-center gap-0.5 justify-center">
              <PixelIcon name="arbitrage" size="xs" className="text-habbo-green" /> up
            </div>
          </div>
          <div className="text-center px-2.5 py-1.5 rounded-lg bg-habbo-red/5">
            <div className="font-mono font-bold text-habbo-red text-sm">{downCount}</div>
            <div className="text-[9px] text-habbo-text-dim flex items-center gap-0.5 justify-center">
              <PixelIcon name="chart-down" size="xs" className="text-habbo-red" /> down
            </div>
          </div>
        </div>
      </div>

      {/* Mini bar chart */}
      <div className="flex gap-1 items-end h-10 p-2 rounded-lg bg-habbo-bg/40">
        {items
          .sort((a, b) => a.change - b.change)
          .map((item) => {
            const h = Math.min(100, Math.max(20, Math.abs(item.change) * 4 + 20));
            return (
              <div
                key={item.classname}
                className="flex-1 rounded-t-sm transition-all hover:opacity-80 cursor-help"
                style={{
                  height: `${h}%`,
                  backgroundColor:
                    item.change >= 0
                      ? "rgba(61, 214, 140, 0.5)"
                      : "rgba(255, 71, 87, 0.5)",
                }}
                title={`${item.name}: ${item.change >= 0 ? "+" : ""}${item.change.toFixed(1)}%`}
              />
            );
          })}
      </div>
    </PixelCard>
  );
}
