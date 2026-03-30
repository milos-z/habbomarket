"use client";

import { useState, useEffect, useMemo } from "react";
import { HotelDomain } from "@/lib/types";
import type { MarketData } from "@/lib/types";
import { fetchMarketHistory } from "@/lib/api";
import { formatCredits, formatPrice } from "@/lib/utils";
import { PixelCard } from "@/components/common/PixelCard";
import { PixelButton } from "@/components/common/PixelButton";
import { HotelSelector } from "@/components/common/HotelSelector";
import { FurniImage } from "@/components/common/FurniImage";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { SectionHeader } from "@/components/common/SectionHeader";
import { PixelIcon } from "@/components/common/PixelIcon";
import { AnimatedNumber } from "@/components/common/AnimatedNumber";
import Link from "next/link";

const TRACKED_ITEMS = [
  "throne", "rare_dragonlamp*1", "rare_fountain", "rare_elephant_statue",
  "rare_colourable_pillar*1", "hween_c15_sofa", "val11_rare", "club_sofa",
  "rare_parasol*1", "exe_floorlight", "rare_ice_cream_machine", "rare_icecream*3",
  "hween12_wall_pumpkin", "xmas_icer", "rare_trex", "rare_colourable_dragonlamp*7",
  "sf_couch", "rare_icecream*5", "exe_sofa", "rare_globe",
];

type DayRange = "7" | "30";

interface ItemStats {
  classname: string;
  name: string;
  avgPrice: number;
  totalVolume: number;
  priceChange: number;
}

export default function StatsPage() {
  const [hotel, setHotel] = useState<HotelDomain>(HotelDomain.DE);
  const [days, setDays] = useState<DayRange>("7");
  const [items, setItems] = useState<ItemStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const results = await Promise.allSettled(
        TRACKED_ITEMS.map((cn) => fetchMarketHistory(cn, hotel, parseInt(days)))
      );

      const stats: ItemStats[] = [];
      for (const r of results) {
        if (r.status !== "fulfilled" || r.value.length === 0) continue;
        const data: MarketData = r.value[0];
        const history = data.marketData.history;
        if (history.length < 2) continue;

        const totalVolume = history.reduce((s, h) => s + h.soldItems, 0);
        const recent = history[history.length - 1].avgPrice;
        const first = history[0].avgPrice;
        const change = first > 0 ? ((recent - first) / first) * 100 : 0;

        stats.push({
          classname: data.className,
          name: data.furniName,
          avgPrice: data.marketData.averagePrice,
          totalVolume,
          priceChange: change,
        });
      }
      setItems(stats);
      setLoading(false);
    }
    load();
  }, [hotel, days]);

  const totalMarketVolume = useMemo(() => items.reduce((s, i) => s + i.totalVolume, 0), [items]);
  const avgMarketPrice = useMemo(() => {
    if (items.length === 0) return 0;
    return items.reduce((s, i) => s + i.avgPrice, 0) / items.length;
  }, [items]);

  const gainers = useMemo(() =>
    [...items].sort((a, b) => b.priceChange - a.priceChange).slice(0, 5),
    [items]
  );
  const losers = useMemo(() =>
    [...items].sort((a, b) => a.priceChange - b.priceChange).slice(0, 5),
    [items]
  );
  const topVolume = useMemo(() =>
    [...items].sort((a, b) => b.totalVolume - a.totalVolume).slice(0, 5),
    [items]
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <Breadcrumbs segments={[{ label: "Stats" }]} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-pixel)] text-lg text-habbo-gold pixel-text-shadow">
            Market Statistics
          </h1>
          <p className="text-sm text-habbo-text-dim mt-1">
            Price trends, volume, and top movers across tracked rares
          </p>
        </div>
        <div className="flex items-center gap-3">
          <HotelSelector value={hotel} onChange={setHotel} />
          <div className="flex gap-1">
            {(["7", "30"] as DayRange[]).map((d) => (
              <PixelButton
                key={d}
                variant={days === d ? "primary" : "ghost"}
                size="sm"
                onClick={() => setDays(d)}
              >
                {d}d
              </PixelButton>
            ))}
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <PixelCard className="p-4 text-center">
          <div className="text-[9px] font-[family-name:var(--font-pixel)] text-habbo-text-dim uppercase">
            Items Tracked
          </div>
          <div className="text-lg font-mono font-bold text-habbo-cyan mt-1">
            {loading ? "..." : <AnimatedNumber value={items.length} />}
          </div>
        </PixelCard>
        <PixelCard className="p-4 text-center">
          <div className="text-[9px] font-[family-name:var(--font-pixel)] text-habbo-text-dim uppercase">
            Total Volume
          </div>
          <div className="text-lg font-mono font-bold text-habbo-gold mt-1">
            {loading ? "..." : formatCredits(totalMarketVolume)}
          </div>
        </PixelCard>
        <PixelCard className="p-4 text-center">
          <div className="text-[9px] font-[family-name:var(--font-pixel)] text-habbo-text-dim uppercase">
            Avg Price
          </div>
          <div className="text-lg font-mono font-bold text-habbo-green mt-1">
            {loading ? "..." : formatPrice(Math.round(avgMarketPrice))}
          </div>
        </PixelCard>
        <PixelCard className="p-4 text-center">
          <div className="text-[9px] font-[family-name:var(--font-pixel)] text-habbo-text-dim uppercase">
            Gainers / Losers
          </div>
          <div className="text-lg font-mono font-bold mt-1">
            {loading ? "..." : (
              <>
                <span className="text-habbo-green">{items.filter((i) => i.priceChange > 0).length}</span>
                <span className="text-habbo-text-dim mx-1">/</span>
                <span className="text-habbo-red">{items.filter((i) => i.priceChange < 0).length}</span>
              </>
            )}
          </div>
        </PixelCard>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-64 bg-habbo-card pixel-border rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Top Gainers */}
          <PixelCard className="p-4">
            <SectionHeader title="Top Gainers" icon="chart-up" color="green" />
            <div className="space-y-2">
              {gainers.map((item, i) => (
                <Link
                  key={item.classname}
                  href={`/furni/${encodeURIComponent(item.classname)}`}
                  className="flex items-center gap-2 py-1.5 hover:bg-habbo-card-hover/50 rounded px-1 transition-colors"
                >
                  <span className="text-[10px] font-mono text-habbo-text-dim w-4">{i + 1}</span>
                  <FurniImage classname={item.classname} alt={item.name} size="sm" />
                  <span className="text-xs text-habbo-text truncate flex-1">{item.name}</span>
                  <span className="text-xs font-mono font-bold text-habbo-green shrink-0">
                    +{item.priceChange.toFixed(1)}%
                  </span>
                </Link>
              ))}
            </div>
          </PixelCard>

          {/* Top Losers */}
          <PixelCard className="p-4">
            <SectionHeader title="Top Losers" icon="chart-down" color="red" />
            <div className="space-y-2">
              {losers.map((item, i) => (
                <Link
                  key={item.classname}
                  href={`/furni/${encodeURIComponent(item.classname)}`}
                  className="flex items-center gap-2 py-1.5 hover:bg-habbo-card-hover/50 rounded px-1 transition-colors"
                >
                  <span className="text-[10px] font-mono text-habbo-text-dim w-4">{i + 1}</span>
                  <FurniImage classname={item.classname} alt={item.name} size="sm" />
                  <span className="text-xs text-habbo-text truncate flex-1">{item.name}</span>
                  <span className="text-xs font-mono font-bold text-habbo-red shrink-0">
                    {item.priceChange.toFixed(1)}%
                  </span>
                </Link>
              ))}
            </div>
          </PixelCard>

          {/* Most Traded */}
          <PixelCard className="p-4">
            <SectionHeader title="Most Traded" icon="trade" color="gold" />
            <div className="space-y-2">
              {topVolume.map((item, i) => (
                <Link
                  key={item.classname}
                  href={`/furni/${encodeURIComponent(item.classname)}`}
                  className="flex items-center gap-2 py-1.5 hover:bg-habbo-card-hover/50 rounded px-1 transition-colors"
                >
                  <span className="text-[10px] font-mono text-habbo-text-dim w-4">{i + 1}</span>
                  <FurniImage classname={item.classname} alt={item.name} size="sm" />
                  <span className="text-xs text-habbo-text truncate flex-1">{item.name}</span>
                  <span className="text-xs font-mono font-bold text-habbo-gold shrink-0">
                    {formatCredits(item.totalVolume)}
                  </span>
                </Link>
              ))}
            </div>
          </PixelCard>
        </div>
      )}

      {/* Price distribution */}
      {!loading && items.length > 0 && (
        <PixelCard className="p-4">
          <SectionHeader title="Price Distribution" icon="star" color="cyan" />
          <div className="flex items-end gap-1 h-32">
            {(() => {
              const maxPrice = Math.max(...items.map((i) => i.avgPrice));
              const buckets = [0, 0, 0, 0, 0, 0, 0, 0];
              const labels = ["0-50", "50-200", "200-500", "500-1K", "1K-5K", "5K-10K", "10K-50K", "50K+"];
              const thresholds = [50, 200, 500, 1000, 5000, 10000, 50000, Infinity];
              for (const item of items) {
                const idx = thresholds.findIndex((t) => item.avgPrice < t);
                if (idx >= 0) buckets[idx]++;
              }
              const maxBucket = Math.max(...buckets, 1);
              return buckets.map((count, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-habbo-cyan/30 rounded-t border border-habbo-cyan/20 transition-all"
                    style={{ height: `${(count / maxBucket) * 100}%`, minHeight: count > 0 ? 4 : 0 }}
                  />
                  <span className="text-[8px] text-habbo-text-dim leading-tight">{labels[i]}</span>
                  <span className="text-[9px] font-mono text-habbo-cyan">{count}</span>
                </div>
              ));
            })()}
          </div>
        </PixelCard>
      )}
    </div>
  );
}
