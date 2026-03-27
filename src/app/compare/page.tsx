"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { HotelDomain } from "@/lib/types";
import type { MarketData } from "@/lib/types";
import { fetchMarketHistory } from "@/lib/api";
import { formatCredits, calculatePriceChange } from "@/lib/utils";
import { CHART_COLORS } from "@/lib/constants";
import { PixelCard } from "@/components/common/PixelCard";
import { PixelButton } from "@/components/common/PixelButton";
import { HotelSelector } from "@/components/common/HotelSelector";
import { SearchBar } from "@/components/common/SearchBar";
import { FurniImage } from "@/components/common/FurniImage";
import { CompareChart } from "@/components/charts/CompareChart";
import { useCompare } from "@/components/providers/CompareProvider";
import { useLanguage } from "@/components/providers/LanguageProvider";
import type { FurniItem } from "@/lib/types";

const PALETTE = [
  CHART_COLORS.primary,
  CHART_COLORS.secondary,
  CHART_COLORS.green,
  CHART_COLORS.purple,
];

interface MarketEntry {
  classname: string;
  name: string;
  data: MarketData | null;
  loading: boolean;
}

export default function ComparePage() {
  const { items, addItem, removeItem, clearItems } = useCompare();
  const { t } = useLanguage();

  const handleAddFromSearch = useCallback((item: FurniItem) => {
    addItem({ classname: item.classname, name: item.name });
  }, [addItem]);
  const [hotel, setHotel] = useState<HotelDomain>(HotelDomain.COM);
  const [entries, setEntries] = useState<MarketEntry[]>([]);

  const loadAllData = useCallback(async () => {
    if (items.length === 0) {
      setEntries([]);
      return;
    }

    setEntries(
      items.map((item) => ({
        classname: item.classname,
        name: item.name,
        data: null,
        loading: true,
      }))
    );

    const results = await Promise.allSettled(
      items.map((item) => fetchMarketHistory(item.classname, hotel, 90))
    );

    setEntries(
      items.map((item, idx) => {
        const result = results[idx];
        const data =
          result.status === "fulfilled" && result.value.length > 0
            ? result.value[0]
            : null;
        return { classname: item.classname, name: item.name, data, loading: false };
      })
    );
  }, [items, hotel]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const chartDatasets = entries
    .filter((e) => e.data)
    .map((e, idx) => ({
      label: e.name,
      history: e.data!.marketData.history,
      color: PALETTE[idx % PALETTE.length],
    }));

  const catalogLink = (
    <Link href="/catalog" className="text-habbo-cyan hover:underline">
      {t.nav.catalog}
    </Link>
  );

  const hintParts = t.compare.noItemsHint.split("{catalog}");

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-pixel)] text-lg text-habbo-gold pixel-text-shadow">
            {t.compare.title}
          </h1>
          <p className="text-sm text-habbo-text-dim mt-1">
            {t.compare.subtitle}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <HotelSelector value={hotel} onChange={setHotel} />
          {items.length > 0 && (
            <PixelButton variant="ghost" size="sm" onClick={clearItems}>
              {t.compare.clearAll}
            </PixelButton>
          )}
        </div>
      </div>

      {items.length === 0 && (
        <PixelCard className="p-8 text-center">
          <div className="text-4xl mb-4 opacity-40">📊</div>
          <h2 className="font-[family-name:var(--font-pixel)] text-xs text-habbo-text-dim mb-3">
            {t.compare.noItems}
          </h2>
          <p className="text-sm text-habbo-text-dim/70 mb-4 max-w-md mx-auto">
            {hintParts[0]}
            {catalogLink}
            {hintParts[1]}
          </p>
          <SearchBar
            placeholder={t.compare.searchToAdd}
            className="max-w-sm mx-auto"
            onSelect={handleAddFromSearch}
          />
        </PixelCard>
      )}

      {items.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {entries.map((entry, idx) => (
            <PixelCard
              key={entry.classname}
              className="flex items-center gap-3 px-3 py-2"
            >
              <div
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: PALETTE[idx % PALETTE.length] }}
              />
              <FurniImage classname={entry.classname} alt={entry.name} size="md" />
              <div className="min-w-0">
                <Link
                  href={`/furni/${encodeURIComponent(entry.classname)}`}
                  className="text-xs text-habbo-text hover:text-habbo-cyan transition-colors truncate block"
                >
                  {entry.name}
                </Link>
                {entry.data && (
                  <div className="text-[10px] font-mono text-habbo-text-dim">
                    {formatCredits(entry.data.marketData.averagePrice)}c {t.compare.avgLabel}
                  </div>
                )}
              </div>
              <button
                onClick={() => removeItem(entry.classname)}
                className="text-habbo-text-dim hover:text-habbo-red text-xs ml-1 transition-colors"
              >
                ×
              </button>
            </PixelCard>
          ))}
          {items.length < 4 && (
            <SearchBar
              placeholder={t.compare.addFurni}
              className="flex-1 min-w-[200px]"
              onSelect={handleAddFromSearch}
            />
          )}
        </div>
      )}

      {chartDatasets.length > 0 && (
        <PixelCard className="p-4">
          <h2 className="font-[family-name:var(--font-pixel)] text-[10px] text-habbo-text-dim uppercase tracking-wider mb-3">
            {t.compare.priceComparison}
          </h2>
          <CompareChart datasets={chartDatasets} height={400} />
        </PixelCard>
      )}

      {entries.some((e) => e.data) && (
        <PixelCard className="p-4 overflow-x-auto">
          <h2 className="font-[family-name:var(--font-pixel)] text-[10px] text-habbo-text-dim uppercase tracking-wider mb-3">
            {t.compare.metricsComparison}
          </h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-habbo-border">
                <th className="text-left py-2 text-xs text-habbo-text-dim font-normal">
                  {t.compare.item}
                </th>
                <th className="text-right py-2 text-xs text-habbo-text-dim font-normal">
                  {t.furniDetail.avgPrice}
                </th>
                <th className="text-right py-2 text-xs text-habbo-text-dim font-normal">
                  {t.furniDetail.change}
                </th>
                <th className="text-right py-2 text-xs text-habbo-text-dim font-normal">
                  {t.furniDetail.volume}
                </th>
                <th className="text-right py-2 text-xs text-habbo-text-dim font-normal">
                  {t.furniDetail.offers}
                </th>
                <th className="text-right py-2 text-xs text-habbo-text-dim font-normal">
                  {t.furniDetail.high}
                </th>
                <th className="text-right py-2 text-xs text-habbo-text-dim font-normal">
                  {t.furniDetail.low}
                </th>
              </tr>
            </thead>
            <tbody>
              {entries
                .filter((e) => e.data)
                .map((entry, idx) => {
                  const history = entry.data!.marketData.history;
                  const change = calculatePriceChange(history);
                  const volume = history.reduce((s, h) => s + h.soldItems, 0);
                  const offers =
                    history.length > 0
                      ? history[history.length - 1].openOffers
                      : 0;
                  const high = Math.max(...history.map((h) => h.avgPrice));
                  const low = Math.min(...history.map((h) => h.avgPrice));

                  return (
                    <tr
                      key={entry.classname}
                      className="border-b border-habbo-border/50"
                    >
                      <td className="py-2">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{
                              backgroundColor: PALETTE[idx % PALETTE.length],
                            }}
                          />
                          <FurniImage classname={entry.classname} alt={entry.name} size="sm" />
                          <span className="text-xs text-habbo-text truncate">
                            {entry.name}
                          </span>
                        </div>
                      </td>
                      <td className="text-right font-mono text-xs text-habbo-cyan">
                        {formatCredits(entry.data!.marketData.averagePrice)}
                      </td>
                      <td
                        className={`text-right font-mono text-xs ${
                          change && change.value >= 0
                            ? "text-habbo-green"
                            : "text-habbo-red"
                        }`}
                      >
                        {change
                          ? `${change.value >= 0 ? "+" : ""}${change.percentage.toFixed(1)}%`
                          : "—"}
                      </td>
                      <td className="text-right font-mono text-xs text-habbo-text-dim">
                        {formatCredits(volume)}
                      </td>
                      <td className="text-right font-mono text-xs text-habbo-text-dim">
                        {offers}
                      </td>
                      <td className="text-right font-mono text-xs text-habbo-green">
                        {formatCredits(high)}
                      </td>
                      <td className="text-right font-mono text-xs text-habbo-red">
                        {formatCredits(low)}
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
