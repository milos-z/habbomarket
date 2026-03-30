"use client";

import { useState, useEffect } from "react";
import { HotelDomain } from "@/lib/types";
import type { FurniItem } from "@/lib/types";
import { PixelCard } from "@/components/common/PixelCard";
import { PixelIcon } from "@/components/common/PixelIcon";
import { SectionHeader } from "@/components/common/SectionHeader";
import type { PixelIconName } from "@/components/common/PixelIcon";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { AnimatedNumber } from "@/components/common/AnimatedNumber";

export function QuickStats() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalItems: 0,
    tradeableItems: 0,
    rareItems: 0,
    categories: 0,
  });

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(
          `/api/furnidata?hotel=${HotelDomain.DE}&tradeableOnly=false`
        );
        if (res.ok) {
          const items: FurniItem[] = await res.json();
          const cats = new Set(items.map((i) => i.category));
          setStats({
            totalItems: items.length,
            tradeableItems: items.filter((i) => i.tradeable).length,
            rareItems: items.filter((i) => i.rare).length,
            categories: cats.size,
          });
        }
      } catch {
        /* silent */
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const cards: Array<{
    label: string;
    numValue: number;
    color: string;
    icon: PixelIconName;
    iconColor: string;
  }> = [
    { label: t.dashboard.totalFurni, numValue: stats.totalItems, color: "text-habbo-cyan", icon: "box", iconColor: "text-habbo-cyan/50" },
    { label: t.dashboard.tradeable, numValue: stats.tradeableItems, color: "text-habbo-green", icon: "trade", iconColor: "text-habbo-green/50" },
    { label: t.dashboard.rares, numValue: stats.rareItems, color: "text-habbo-gold", icon: "star", iconColor: "text-habbo-gold/50" },
    { label: t.dashboard.categories, numValue: stats.categories, color: "text-habbo-purple", icon: "shelf", iconColor: "text-habbo-purple/50" },
  ];

  return (
    <PixelCard className="p-4">
      <SectionHeader title="Habbo.de Stats" icon="arbitrage" color="cyan" />
      <div className="grid grid-cols-2 gap-3">
        {cards.map((card) => (
          <div key={card.label} className="flex items-center gap-3 p-2.5 rounded-lg bg-habbo-bg/40">
            <span className={card.iconColor}>
              <PixelIcon name={card.icon} size="lg" />
            </span>
            <div className="min-w-0">
              <div className="text-[9px] text-habbo-text-dim uppercase tracking-wider truncate">
                {card.label}
              </div>
              <div className={`text-base font-mono font-bold ${card.color}`}>
                {loading ? (
                  <div className="h-5 w-12 rounded bg-habbo-border/30 animate-pulse" />
                ) : (
                  <AnimatedNumber value={card.numValue} />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </PixelCard>
  );
}
