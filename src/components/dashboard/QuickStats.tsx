"use client";

import { useState, useEffect } from "react";
import { HotelDomain } from "@/lib/types";
import type { FurniItem } from "@/lib/types";
import { PixelCard } from "@/components/common/PixelCard";
import { useLanguage } from "@/components/providers/LanguageProvider";

export function QuickStats() {
  const { t } = useLanguage();
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
          `/api/furnidata?hotel=${HotelDomain.COM}&tradeableOnly=false`
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
      }
    }
    load();
  }, []);

  const cards = [
    { label: t.dashboard.totalFurni, value: stats.totalItems.toLocaleString(), color: "text-habbo-cyan" },
    { label: t.dashboard.tradeable, value: stats.tradeableItems.toLocaleString(), color: "text-habbo-green" },
    { label: t.dashboard.rares, value: stats.rareItems.toLocaleString(), color: "text-habbo-gold" },
    { label: t.dashboard.categories, value: stats.categories.toString(), color: "text-habbo-purple" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {cards.map((card) => (
        <PixelCard key={card.label} className="p-4 text-center">
          <div className="text-[9px] font-[family-name:var(--font-pixel)] text-habbo-text-dim uppercase tracking-wider">
            {card.label}
          </div>
          <div className={`text-lg font-mono font-bold mt-1 ${card.color}`}>
            {card.value}
          </div>
        </PixelCard>
      ))}
    </div>
  );
}
