"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { HotelDomain } from "@/lib/types";
import { PixelIcon } from "@/components/common/PixelIcon";
import { fetchMarketHistory } from "@/lib/api";
import { formatCredits, formatPrice, exportToCSV } from "@/lib/utils";
import { PixelCard } from "@/components/common/PixelCard";
import { PixelButton } from "@/components/common/PixelButton";
import { FurniImage } from "@/components/common/FurniImage";
import { HotelSelector } from "@/components/common/HotelSelector";
import { usePortfolio } from "@/components/providers/PortfolioProvider";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";

interface PriceInfo {
  avgPrice: number;
  loading: boolean;
}

export default function PortfolioPage() {
  const { entries, removeEntry, updateQuantity, updateBuyPrice, totalItems, exportData, importData } =
    usePortfolio();
  const { t } = useLanguage();
  const [hotel, setHotel] = useState<HotelDomain>(HotelDomain.DE);
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
          const data = await fetchMarketHistory(entry.classname, hotel, 30);
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
  }, [entries, hotel]);

  const totalValue = useMemo(() => {
    return entries.reduce((sum, e) => {
      const price = prices[e.classname]?.avgPrice ?? 0;
      return sum + price * e.quantity;
    }, 0);
  }, [entries, prices]);

  const totalProfit = useMemo(() => {
    return entries.reduce((sum, e) => {
      if (!e.buyPrice) return sum;
      const current = prices[e.classname]?.avgPrice ?? 0;
      return sum + (current - e.buyPrice) * e.quantity;
    }, 0);
  }, [entries, prices]);

  const hasBuyPrices = entries.some((e) => e.buyPrice && e.buyPrice > 0);

  function handleExportCSV() {
    const headers = [
      t.compare.item,
      t.portfolio.quantity,
      t.portfolio.buyPrice,
      t.furniDetail.avgPrice,
      t.portfolio.estimatedValue,
      t.portfolio.profitLoss,
    ];
    const rows = entries.map((e) => {
      const avg = prices[e.classname]?.avgPrice ?? 0;
      const value = avg * e.quantity;
      const pl = e.buyPrice ? (avg - e.buyPrice) * e.quantity : 0;
      return [e.name, e.quantity, e.buyPrice ?? 0, avg, value, pl];
    });
    exportToCSV(`portfolio-${hotel}`, headers, rows);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <Breadcrumbs segments={[{ label: t.nav.portfolio }]} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-pixel)] text-lg text-habbo-gold pixel-text-shadow">
            {t.portfolio.title}
          </h1>
          <p className="text-sm text-habbo-text-dim mt-1">
            {t.portfolio.subtitle}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <HotelSelector value={hotel} onChange={setHotel} />
          <PixelButton variant="ghost" size="sm" onClick={importData}>
            Import
          </PixelButton>
          {entries.length > 0 && (
            <>
              <PixelButton variant="ghost" size="sm" onClick={exportData}>
                Export JSON
              </PixelButton>
              <PixelButton variant="ghost" size="sm" onClick={handleExportCSV}>
                {t.furniDetail.exportCSV}
              </PixelButton>
            </>
          )}
        </div>
      </div>

      {entries.length > 0 && (
        <div className="flex flex-wrap gap-3">
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
          {hasBuyPrices && (
            <PixelCard className="px-4 py-2 text-center">
              <div className="text-[9px] font-[family-name:var(--font-pixel)] text-habbo-text-dim uppercase">
                {t.portfolio.totalProfit}
              </div>
              <div
                className={`text-sm font-mono font-bold mt-0.5 ${
                  totalProfit >= 0 ? "text-habbo-green" : "text-habbo-red"
                }`}
              >
                {totalProfit >= 0 ? "+" : ""}
                {formatCredits(totalProfit)}c
              </div>
            </PixelCard>
          )}
        </div>
      )}

      {entries.length === 0 ? (
        <PixelCard className="p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 pixel-grid-bg opacity-20" />
          <div className="relative z-10">
            <div className="w-16 h-16 mx-auto mb-5 rounded-xl bg-habbo-cyan/10 border border-habbo-cyan/20 flex items-center justify-center animate-float">
              <span className="text-habbo-cyan"><PixelIcon name="box" size="xl" /></span>
            </div>
            <h2 className="font-[family-name:var(--font-pixel)] text-xs text-habbo-text mb-2">
              {t.portfolio.empty}
            </h2>
            <p className="text-sm text-habbo-text-dim/70 max-w-md mx-auto">
              {t.portfolio.emptyHint}
            </p>
            <Link
              href="/catalog"
              className="inline-flex items-center gap-1.5 mt-5 text-sm text-habbo-cyan hover:text-habbo-gold transition-colors"
            >
              <PixelIcon name="search" size="xs" />
              {t.nav.catalog}
            </Link>
          </div>
        </PixelCard>
      ) : (
        <PixelCard className="p-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-habbo-border">
                <th className="text-left py-2 text-xs text-habbo-text-dim font-normal">
                  {t.compare.item}
                </th>
                <th className="text-center py-2 text-xs text-habbo-text-dim font-normal w-28">
                  {t.portfolio.quantity}
                </th>
                <th className="text-right py-2 text-xs text-habbo-text-dim font-normal">
                  {t.portfolio.buyPrice}
                </th>
                <th className="text-right py-2 text-xs text-habbo-text-dim font-normal">
                  {t.furniDetail.avgPrice}
                </th>
                <th className="text-right py-2 text-xs text-habbo-text-dim font-normal">
                  {t.portfolio.estimatedValue}
                </th>
                <th className="text-right py-2 text-xs text-habbo-text-dim font-normal">
                  {t.portfolio.profitLoss}
                </th>
                <th className="w-8" />
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => {
                const price = prices[entry.classname];
                const avg = price?.avgPrice ?? 0;
                const itemValue = avg * entry.quantity;
                const pl = entry.buyPrice
                  ? (avg - entry.buyPrice) * entry.quantity
                  : null;

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
                      <div className="flex items-center justify-center gap-1">
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
                          className="w-12 text-center bg-habbo-input border border-habbo-border rounded text-xs text-habbo-text py-1 focus:outline-none focus:border-habbo-cyan/50"
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
                    <td className="py-3">
                      <input
                        type="number"
                        value={entry.buyPrice ?? ""}
                        placeholder="—"
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0;
                          updateBuyPrice(entry.classname, val > 0 ? val : undefined);
                        }}
                        className="w-20 text-right bg-habbo-input border border-habbo-border rounded text-xs text-habbo-text py-1 px-2 focus:outline-none focus:border-habbo-cyan/50 ml-auto block"
                        min={0}
                      />
                    </td>
                    <td className="text-right font-mono text-xs text-habbo-cyan py-3">
                      {price?.loading ? (
                        <span className="inline-block w-4 h-4 border-2 border-habbo-cyan/20 border-t-habbo-cyan rounded-full animate-spin" />
                      ) : (
                        formatPrice(avg)
                      )}
                    </td>
                    <td className="text-right font-mono text-xs text-habbo-gold py-3">
                      {price?.loading ? "..." : formatPrice(itemValue)}
                    </td>
                    <td
                      className={`text-right font-mono text-xs py-3 ${
                        pl === null
                          ? "text-habbo-text-dim"
                          : pl >= 0
                            ? "text-habbo-green"
                            : "text-habbo-red"
                      }`}
                    >
                      {price?.loading
                        ? "..."
                        : pl === null
                          ? "—"
                          : `${pl >= 0 ? "+" : ""}${formatCredits(pl)}c`}
                    </td>
                    <td className="text-center py-3">
                      <button
                        onClick={() => removeEntry(entry.classname)}
                        className="text-habbo-text-dim hover:text-habbo-red text-xs transition-colors sm:opacity-0 sm:group-hover:opacity-100"
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
