"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { PixelCard } from "@/components/common/PixelCard";
import { SectionHeader } from "@/components/common/SectionHeader";
import { PixelIcon } from "@/components/common/PixelIcon";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { FurniImage } from "@/components/common/FurniImage";

interface MoverItem {
  classname: string;
  name: string;
  avgPrice: number;
  change: number;
  sparkline: number[];
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
];

function MiniSparkline({ data, positive }: { data: number[]; positive: boolean }) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const h = 20;
  const w = 48;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="shrink-0">
      <polyline
        points={points}
        fill="none"
        stroke={positive ? "rgba(61, 214, 140, 0.7)" : "rgba(255, 71, 87, 0.7)"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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
              `/api/market/history?classname=${encodeURIComponent(classname)}&hotel=de&days=30`
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
            const sparkline = history.slice(-7).map((h) => h[0]);
            return {
              classname: item.ClassName as string,
              name: (item.FurniName as string) || classname,
              avgPrice: recent,
              change: ((recent - previous) / previous) * 100,
              sparkline,
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
      <SectionHeader title={t.dashboard.priceMovers} icon="arbitrage" color="gold" />

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-12 bg-habbo-border/20 rounded animate-pulse" />
          ))}
        </div>
      ) : movers.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-6 text-habbo-text-dim">
          <PixelIcon name="chart-down" size="xl" className="opacity-40" />
          <p className="text-xs">{t.dashboard.loadingMarketData}</p>
        </div>
      ) : (
        <div className="space-y-1.5">
          {movers.map((item, idx) => (
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
                className="group-hover:scale-110 transition-transform"
              />
              <div className="flex-1 min-w-0">
                <div className="text-xs text-habbo-text truncate group-hover:text-habbo-cyan transition-colors">
                  {item.name}
                </div>
                <div className="text-[10px] font-mono text-habbo-text-dim">
                  {formatPrice(item.avgPrice)}
                </div>
              </div>
              <MiniSparkline data={item.sparkline} positive={item.change >= 0} />
              <span
                className={`text-[11px] font-mono font-bold px-1.5 py-0.5 rounded ${
                  item.change >= 0
                    ? "text-habbo-green bg-habbo-green/10"
                    : "text-habbo-red bg-habbo-red/10"
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
