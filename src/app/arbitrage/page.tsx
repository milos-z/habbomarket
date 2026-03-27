"use client";

import { useState, useRef, useCallback } from "react";
import { HotelDomain } from "@/lib/types";
import type { ArbitrageResult, FurniItem } from "@/lib/types";
import { ArbitrageDirection } from "@/lib/types";
import { fetchMarketHistory } from "@/lib/api";
import { CATEGORY_LABELS } from "@/lib/constants";
import { PixelCard } from "@/components/common/PixelCard";
import { PixelButton } from "@/components/common/PixelButton";
import { ArbitrageTable } from "@/components/arbitrage/ArbitrageTable";
import { ScanProgress } from "@/components/arbitrage/ScanProgress";
import { useLanguage } from "@/components/providers/LanguageProvider";

type SortKey = "name" | "difference" | "differencePercent" | "comVolume" | "deVolume";

const BATCH_SIZE = 6;
const BATCH_DELAY_MS = 4000;

export default function ArbitragePage() {
  const { t } = useLanguage();
  const [category, setCategory] = useState("");
  const [results, setResults] = useState<ArbitrageResult[]>([]);
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(0);
  const [total, setTotal] = useState(0);
  const [minVolume, setMinVolume] = useState(5);
  const [minDiffPercent, setMinDiffPercent] = useState(10);
  const [sortKey, setSortKey] = useState<SortKey>("differencePercent");
  const [sortAsc, setSortAsc] = useState(false);
  const abortRef = useRef(false);

  const handleSort = useCallback((key: SortKey) => {
    setSortKey((prev) => {
      if (prev === key) {
        setSortAsc((a) => !a);
        return key;
      }
      setSortAsc(key === "name");
      return key;
    });
  }, []);

  async function scanCategory() {
    if (!category) return;

    abortRef.current = false;
    setScanning(true);
    setResults([]);
    setScanned(0);

    try {
      const res = await fetch(
        `/api/furnidata?hotel=${HotelDomain.COM}&category=${encodeURIComponent(category)}&tradeableOnly=true`
      );
      if (!res.ok) return;
      const items: FurniItem[] = await res.json();
      const tradeableItems = items.filter((i) => i.tradeable);
      setTotal(tradeableItems.length);

      for (let i = 0; i < tradeableItems.length; i += BATCH_SIZE) {
        if (abortRef.current) break;

        const batch = tradeableItems.slice(i, i + BATCH_SIZE);
        const batchResults = await Promise.allSettled(
          batch.map(async (item) => {
            const [comData, deData] = await Promise.all([
              fetchMarketHistory(item.classname, HotelDomain.COM, 30).catch(() => []),
              fetchMarketHistory(item.classname, HotelDomain.DE, 30).catch(() => []),
            ]);

            const comPrice = comData.length > 0 ? comData[0].marketData.averagePrice : 0;
            const dePrice = deData.length > 0 ? deData[0].marketData.averagePrice : 0;
            const comVolume =
              comData.length > 0
                ? comData[0].marketData.history.reduce((s, h) => s + h.soldItems, 0)
                : 0;
            const deVolume =
              deData.length > 0
                ? deData[0].marketData.history.reduce((s, h) => s + h.soldItems, 0)
                : 0;

            if (comPrice === 0 || dePrice === 0) return null;

            const difference = Math.abs(comPrice - dePrice);
            const maxPrice = Math.max(comPrice, dePrice);
            const differencePercent = (difference / maxPrice) * 100;
            const direction =
              comPrice < dePrice
                ? ArbitrageDirection.BUY_COM_SELL_DE
                : ArbitrageDirection.BUY_DE_SELL_COM;

            return {
              classname: item.classname,
              name: item.name,
              comPrice,
              dePrice,
              comVolume,
              deVolume,
              difference,
              differencePercent,
              direction,
            } satisfies ArbitrageResult;
          })
        );

        const newResults = batchResults
          .filter(
            (r): r is PromiseFulfilledResult<ArbitrageResult | null> => r.status === "fulfilled"
          )
          .map((r) => r.value)
          .filter((r): r is ArbitrageResult => r !== null);

        setResults((prev) => [...prev, ...newResults]);
        setScanned((prev) => prev + batch.length);

        if (i + BATCH_SIZE < tradeableItems.length && !abortRef.current) {
          await new Promise((resolve) => setTimeout(resolve, BATCH_DELAY_MS));
        }
      }
    } finally {
      setScanning(false);
    }
  }

  function stopScan() {
    abortRef.current = true;
  }

  const filteredResults = results.filter((r) => {
    const totalVolume = r.comVolume + r.deVolume;
    return totalVolume >= minVolume && r.differencePercent >= minDiffPercent;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-pixel)] text-lg text-habbo-gold pixel-text-shadow">
          {t.arbitrage.title}
        </h1>
        <p className="text-sm text-habbo-text-dim mt-1">{t.arbitrage.subtitle}</p>
      </div>

      <PixelCard className="p-4 space-y-4">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-[10px] font-[family-name:var(--font-pixel)] text-habbo-text-dim uppercase mb-1.5">
              {t.arbitrage.selectCategory}
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-habbo-input border border-habbo-border rounded text-sm text-habbo-text py-2 px-3 focus:outline-none focus:border-habbo-cyan/50"
            >
              <option value="">{t.filters.allCategories}</option>
              {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {t.categories[key] ?? label}
                </option>
              ))}
            </select>
          </div>

          <div className="w-28">
            <label className="block text-[10px] font-[family-name:var(--font-pixel)] text-habbo-text-dim uppercase mb-1.5">
              {t.arbitrage.minVolume}
            </label>
            <input
              type="number"
              value={minVolume}
              onChange={(e) => setMinVolume(parseInt(e.target.value) || 0)}
              className="w-full bg-habbo-input border border-habbo-border rounded text-sm text-habbo-text py-2 px-3 focus:outline-none focus:border-habbo-cyan/50"
              min={0}
            />
          </div>

          <div className="w-28">
            <label className="block text-[10px] font-[family-name:var(--font-pixel)] text-habbo-text-dim uppercase mb-1.5">
              {t.arbitrage.minDifference}
            </label>
            <input
              type="number"
              value={minDiffPercent}
              onChange={(e) => setMinDiffPercent(parseInt(e.target.value) || 0)}
              className="w-full bg-habbo-input border border-habbo-border rounded text-sm text-habbo-text py-2 px-3 focus:outline-none focus:border-habbo-cyan/50"
              min={0}
            />
          </div>

          <div>
            {scanning ? (
              <PixelButton variant="secondary" onClick={stopScan}>
                {t.arbitrage.stopScan}
              </PixelButton>
            ) : (
              <PixelButton
                variant="primary"
                onClick={scanCategory}
                disabled={!category}
              >
                {t.arbitrage.scan}
              </PixelButton>
            )}
          </div>
        </div>

        {(scanning || scanned > 0) && (
          <ScanProgress
            scanned={scanned}
            total={total}
            found={filteredResults.length}
            scanning={scanning}
            scannedLabel={t.arbitrage.scanned}
            opportunitiesLabel={t.arbitrage.opportunities}
          />
        )}
      </PixelCard>

      {filteredResults.length > 0 ? (
        <PixelCard className="p-4">
          <ArbitrageTable
            results={filteredResults}
            sortKey={sortKey}
            sortAsc={sortAsc}
            onSort={handleSort}
            comPriceLabel={t.arbitrage.comPrice}
            dePriceLabel={t.arbitrage.dePrice}
            diffLabel={t.arbitrage.diff}
            directionLabel={t.arbitrage.direction}
            buyOnComLabel={t.arbitrage.buyOnCom}
            buyOnDeLabel={t.arbitrage.buyOnDe}
          />
        </PixelCard>
      ) : scanned > 0 && !scanning ? (
        <PixelCard className="p-8 text-center">
          <div className="text-4xl mb-4 opacity-40">🔍</div>
          <h2 className="font-[family-name:var(--font-pixel)] text-xs text-habbo-text-dim mb-2">
            {t.arbitrage.noResults}
          </h2>
          <p className="text-sm text-habbo-text-dim/70 max-w-md mx-auto">
            {t.arbitrage.noResultsHint}
          </p>
        </PixelCard>
      ) : !scanning && scanned === 0 ? (
        <PixelCard className="p-8 text-center">
          <div className="text-4xl mb-4 opacity-40">📊</div>
          <h2 className="font-[family-name:var(--font-pixel)] text-xs text-habbo-text-dim mb-2">
            {t.arbitrage.noResults}
          </h2>
          <p className="text-sm text-habbo-text-dim/70 max-w-md mx-auto">
            {t.arbitrage.noResultsHint}
          </p>
        </PixelCard>
      ) : null}
    </div>
  );
}
