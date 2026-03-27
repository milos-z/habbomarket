"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { HotelDomain } from "@/lib/types";
import { fetchMarketHistory } from "@/lib/api";
import { formatCredits } from "@/lib/utils";
import { PixelCard } from "@/components/common/PixelCard";
import { FurniImage } from "@/components/common/FurniImage";
import { usePortfolio } from "@/components/providers/PortfolioProvider";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface PriceInfo {
  avgPrice: number;
  loading: boolean;
}

export default function PortfolioPage() {
  const { entries, removeEntry, updateQuantity, totalItems } = usePortfolio();
  const { t } = useLanguage();
  const [prices, setPrices] = useState<Record<string, PriceInfo>>({});

  useEffect(() => {
    if (entries.length === 0) return;

    const initial: Record<string, PriceInfo> = {};
    for (const e of entries) {
      initial[e.classname] = { avgPrice: 0, loading: true };
    }
    setPrices(initial);

    async function loadPrices() {
      const results = await Promise.allSettled(
        entries.map(async (entry) => {
          const data = await fetchMarketHistory(
            entry.classname,
            HotelDomain.COM,
            30
          );
          const avg =
            data.length > 0 ? data[0].marketData.averagePrice : 0;
          return { classname: entry.classname, avgPrice: avg };
        })
      );

      const updated: Record<string, PriceInfo> = {};
      for (const r of results) {
        if (r.status === "fulfilled") {
          updated[r.value.classname] = {
            avgPrice: r.value.avgPrice,
            loading: false,
          };
        }
      }
      setPrices((prev) => ({ ...prev, ...updated }));
    }

    loadPrices();
  }, [entries]);

  const totalValue = useMemo(() => {
    return entries.reduce((sum, e) => {
      const price = prices[e.classname]?.avgPrice ?? 0;
      return sum + price * e.quantity;
    }, 0);
  }, [entries, prices]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-pixel)] text-lg text-habbo-gold pixel-text-shadow">
            {t.portfolio.title}
          </h1>
          <p className="text-sm text-habbo-text-dim mt-1">
            {t.portfolio.subtitle}
          </p>
        </div>
        {entries.length > 0 && (
          <div className="flex gap-4">
            <PixelCard className="px-4 py-2 text-center">
              <div className="text-[9px] font-[family-name:var(--font-pixel)] text-habbo-text-dim uppercase">
                {t.portfolio.totalItems}
              </div>
              <div className="text-sm font-mono font-bold text-habbo-cyan mt-0.5">
                {totalItems}
              </div>
            </PixelCard>
            <PixelCard className="px-4 py-2 text-center">
              <div className="text-[9px] font-[family-name:var(--font-pixel)] text-habbo-text-dim uppercase">
                {t.portfolio.estimatedValue}
              </div>
              <div className="text-sm font-mono font-bold text-habbo-gold mt-0.5">
                {formatCredits(totalValue)}c
              </div>
            </PixelCard>
          </div>
        )}
      </div>

      {entries.length === 0 ? (
        <PixelCard className="p-8 text-center">
          <div className="text-4xl mb-4 opacity-40">📦</div>
          <h2 className="font-[family-name:var(--font-pixel)] text-xs text-habbo-text-dim mb-2">
            {t.portfolio.empty}
          </h2>
          <p className="text-sm text-habbo-text-dim/70 max-w-md mx-auto">
            {t.portfolio.emptyHint}
          </p>
          <Link
            href="/catalog"
            className="inline-block mt-4 text-sm text-habbo-cyan hover:underline"
          >
            {t.nav.catalog} →
          </Link>
        </PixelCard>
      ) : (
        <PixelCard className="p-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-habbo-border">
                <th className="text-left py-2 text-xs text-habbo-text-dim font-normal">
                  {t.compare.item}
                </th>
                <th className="text-center py-2 text-xs text-habbo-text-dim font-normal w-32">
                  {t.portfolio.quantity}
                </th>
                <th className="text-right py-2 text-xs text-habbo-text-dim font-normal">
                  {t.furniDetail.avgPrice}
                </th>
                <th className="text-right py-2 text-xs text-habbo-text-dim font-normal">
                  {t.portfolio.estimatedValue}
                </th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => {
                const price = prices[entry.classname];
                const itemValue = (price?.avgPrice ?? 0) * entry.quantity;

                return (
                  <tr
                    key={entry.classname}
                    className="border-b border-habbo-border/50 group"
                  >
                    <td className="py-3">
                      <Link
                        href={`/furni/${encodeURIComponent(entry.classname)}`}
                        className="flex items-center gap-3 hover:text-habbo-cyan transition-colors"
                      >
                        <FurniImage
                          classname={entry.classname}
                          alt={entry.name}
                          size="md"
                        />
                        <span className="text-xs text-habbo-text truncate">
                          {entry.name}
                        </span>
                      </Link>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(entry.classname, entry.quantity - 1)
                          }
                          className="w-6 h-6 rounded bg-habbo-card hover:bg-habbo-card-hover border border-habbo-border text-xs text-habbo-text flex items-center justify-center transition-colors"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          value={entry.quantity}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            if (val > 0) updateQuantity(entry.classname, val);
                          }}
                          className="w-14 text-center bg-habbo-input border border-habbo-border rounded text-xs text-habbo-text py-1 focus:outline-none focus:border-habbo-cyan/50"
                          min={1}
                        />
                        <button
                          onClick={() =>
                            updateQuantity(entry.classname, entry.quantity + 1)
                          }
                          className="w-6 h-6 rounded bg-habbo-card hover:bg-habbo-card-hover border border-habbo-border text-xs text-habbo-text flex items-center justify-center transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="text-right font-mono text-xs text-habbo-cyan py-3">
                      {price?.loading ? (
                        <span className="inline-block w-4 h-4 border-2 border-habbo-cyan/20 border-t-habbo-cyan rounded-full animate-spin" />
                      ) : (
                        `${formatCredits(price?.avgPrice ?? 0)}c`
                      )}
                    </td>
                    <td className="text-right font-mono text-xs text-habbo-gold py-3">
                      {price?.loading ? "..." : `${formatCredits(itemValue)}c`}
                    </td>
                    <td className="text-center py-3">
                      <button
                        onClick={() => removeEntry(entry.classname)}
                        className="text-habbo-text-dim hover:text-habbo-red text-xs transition-colors opacity-0 group-hover:opacity-100"
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </PixelCard>
      )}
    </div>
  );
}
