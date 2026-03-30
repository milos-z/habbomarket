"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { HotelDomain } from "@/lib/types";
import { fetchMarketHistory } from "@/lib/api";
import { formatCredits } from "@/lib/utils";
import { usePortfolio } from "@/components/providers/PortfolioProvider";
import { PixelCard } from "@/components/common/PixelCard";
import { FurniImage } from "@/components/common/FurniImage";
import { PixelIcon } from "@/components/common/PixelIcon";

interface PriceEntry {
  avgPrice: number;
  loading: boolean;
}

export function PortfolioWidget() {
  const { entries, totalItems } = usePortfolio();
  const [prices, setPrices] = useState<Record<string, PriceEntry>>({});

  useEffect(() => {
    if (entries.length === 0) return;

    async function loadPrices() {
      const results = await Promise.allSettled(
        entries.slice(0, 5).map(async (entry) => {
          const data = await fetchMarketHistory(entry.classname, HotelDomain.DE, 30);
          return {
            classname: entry.classname,
            avgPrice: data.length > 0 ? data[0].marketData.averagePrice : 0,
          };
        })
      );

      const updated: Record<string, PriceEntry> = {};
      for (const r of results) {
        if (r.status === "fulfilled") {
          updated[r.value.classname] = { avgPrice: r.value.avgPrice, loading: false };
        }
      }
      setPrices(updated);
    }

    loadPrices();
  }, [entries]);

  const totalValue = useMemo(() => {
    return entries.reduce((sum, e) => {
      const price = prices[e.classname]?.avgPrice ?? 0;
      return sum + price * e.quantity;
    }, 0);
  }, [entries, prices]);

  if (entries.length === 0) return null;

  const topEntries = entries
    .map((e) => ({
      ...e,
      value: (prices[e.classname]?.avgPrice ?? 0) * e.quantity,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 3);

  return (
    <PixelCard className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <PixelIcon name="box" size="sm" className="text-habbo-cyan" />
          <span className="text-[9px] font-[family-name:var(--font-pixel)] text-habbo-text-dim uppercase tracking-wider">
            Portfolio
          </span>
        </div>
        <Link href="/portfolio" className="text-[10px] text-habbo-cyan hover:text-habbo-gold transition-colors">
          View All →
        </Link>
      </div>

      <div className="flex items-center gap-4 mb-3">
        <div>
          <div className="text-[9px] text-habbo-text-dim uppercase">Value</div>
          <div className="text-sm font-mono font-bold text-habbo-gold">
            {formatCredits(totalValue)}c
          </div>
        </div>
        <div>
          <div className="text-[9px] text-habbo-text-dim uppercase">Items</div>
          <div className="text-sm font-mono font-bold text-habbo-cyan">
            {totalItems}
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        {topEntries.map((entry) => (
          <Link
            key={entry.classname}
            href={`/furni/${encodeURIComponent(entry.classname)}`}
            className="flex items-center gap-2 py-1 hover:bg-habbo-card-hover/50 rounded transition-colors px-1"
          >
            <FurniImage classname={entry.classname} alt={entry.name} size="sm" />
            <span className="text-[10px] text-habbo-text truncate flex-1">{entry.name}</span>
            <span className="text-[10px] font-mono text-habbo-gold shrink-0">
              {formatCredits(entry.value)}c
            </span>
          </Link>
        ))}
      </div>
    </PixelCard>
  );
}
