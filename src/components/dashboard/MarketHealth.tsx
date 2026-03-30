"use client";

import { useState, useEffect } from "react";
import { HotelDomain } from "@/lib/types";
import { fetchMarketHistory } from "@/lib/api";
import { PixelIcon } from "@/components/common/PixelIcon";

const TRACKED_ITEMS = [
  "throne",
  "rare_dragonlamp*1",
  "rare_fountain",
  "rare_elephant_statue",
  "club_sofa",
  "exe_floorlight",
  "rare_parasol*1",
  "hween_c15_sofa",
];

type Trend = "bullish" | "bearish" | "neutral";

export function MarketHealth() {
  const [trend, setTrend] = useState<Trend | null>(null);
  const [avgChange, setAvgChange] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function analyze() {
      try {
        const results = await Promise.allSettled(
          TRACKED_ITEMS.map((cn) => fetchMarketHistory(cn, HotelDomain.DE, 30))
        );

        const changes: number[] = [];
        for (const r of results) {
          if (r.status !== "fulfilled" || r.value.length === 0) continue;
          const history = r.value[0].marketData.history;
          if (history.length < 7) continue;
          const recent = history.slice(-7);
          const older = history.slice(-14, -7);
          if (older.length === 0) continue;
          const recentAvg = recent.reduce((s, h) => s + h.avgPrice, 0) / recent.length;
          const olderAvg = older.reduce((s, h) => s + h.avgPrice, 0) / older.length;
          if (olderAvg > 0) {
            changes.push(((recentAvg - olderAvg) / olderAvg) * 100);
          }
        }

        if (changes.length === 0) {
          setTrend("neutral");
          setAvgChange(0);
        } else {
          const avg = changes.reduce((s, c) => s + c, 0) / changes.length;
          setAvgChange(avg);
          if (avg > 2) setTrend("bullish");
          else if (avg < -2) setTrend("bearish");
          else setTrend("neutral");
        }
      } catch {
        setTrend("neutral");
      } finally {
        setLoading(false);
      }
    }
    analyze();
  }, []);

  if (loading) {
    return (
      <div className="h-10 bg-habbo-card/50 rounded-lg animate-pulse" />
    );
  }

  if (!trend) return null;

  const config = {
    bullish: {
      label: "Market Bullish",
      color: "text-habbo-green",
      bg: "bg-habbo-green/10 border-habbo-green/20",
      icon: "chart-up" as const,
    },
    bearish: {
      label: "Market Bearish",
      color: "text-habbo-red",
      bg: "bg-habbo-red/10 border-habbo-red/20",
      icon: "chart-down" as const,
    },
    neutral: {
      label: "Market Stable",
      color: "text-habbo-gold",
      bg: "bg-habbo-gold/10 border-habbo-gold/20",
      icon: "star" as const,
    },
  };

  const c = config[trend];

  return (
    <div className={`flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg border ${c.bg} animate-fade-in`}>
      <PixelIcon name={c.icon} size="sm" className={c.color} />
      <span className={`text-xs font-[family-name:var(--font-pixel)] uppercase tracking-wider ${c.color}`}>
        {c.label}
      </span>
      <span className={`text-xs font-mono font-bold ${c.color}`}>
        {avgChange >= 0 ? "+" : ""}{avgChange.toFixed(1)}%
      </span>
      <span className="text-[10px] text-habbo-text-dim">
        7d avg across tracked rares
      </span>
    </div>
  );
}
