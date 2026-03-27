"use client";

import { useState, useEffect, useCallback, use } from "react";
import Link from "next/link";
import { HotelDomain } from "@/lib/types";
import type { MarketData } from "@/lib/types";
import { fetchMarketHistory } from "@/lib/api";
import { formatCredits, calculatePriceChange } from "@/lib/utils";
import { CHART_COLORS } from "@/lib/constants";
import { PixelCard } from "@/components/common/PixelCard";
import { PixelButton } from "@/components/common/PixelButton";
import { HotelSelector } from "@/components/common/HotelSelector";
import { FurniImage } from "@/components/common/FurniImage";
import { PriceChart } from "@/components/charts/PriceChart";
import { VolumeChart } from "@/components/charts/VolumeChart";
import { CompareChart } from "@/components/charts/CompareChart";
import { useCompare } from "@/components/providers/CompareProvider";
import { useFavorites } from "@/components/providers/FavoritesProvider";
import { usePortfolio } from "@/components/providers/PortfolioProvider";
import { useLanguage } from "@/components/providers/LanguageProvider";

type DayRange = "7" | "30" | "90" | "all";

export default function FurniDetailPage({
  params,
}: {
  params: Promise<{ classname: string }>;
}) {
  const { classname } = use(params);
  const decoded = decodeURIComponent(classname);
  const { t } = useLanguage();

  const [hotel, setHotel] = useState<HotelDomain>(HotelDomain.COM);
  const [days, setDays] = useState<DayRange>("90");
  const [data, setData] = useState<MarketData | null>(null);
  const [comData, setComData] = useState<MarketData | null>(null);
  const [deData, setDeData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { addItem, removeItem, hasItem } = useCompare();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addEntry: addToPortfolio } = usePortfolio();
  const inCompare = hasItem(decoded);
  const faved = isFavorite(decoded);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await fetchMarketHistory(
        decoded,
        hotel,
        days === "all" ? undefined : parseInt(days)
      );
      if (results.length > 0) {
        setData(results[0]);
      } else {
        setError(t.furniDetail.noDataFound);
      }
    } catch {
      setError(t.furniDetail.loadFailed);
    } finally {
      setLoading(false);
    }
  }, [decoded, hotel, days, t]);

  const loadComparison = useCallback(async () => {
    try {
      const [comResults, deResults] = await Promise.allSettled([
        fetchMarketHistory(decoded, HotelDomain.COM, days === "all" ? undefined : parseInt(days)),
        fetchMarketHistory(decoded, HotelDomain.DE, days === "all" ? undefined : parseInt(days)),
      ]);
      if (comResults.status === "fulfilled" && comResults.value.length > 0) {
        setComData(comResults.value[0]);
      }
      if (deResults.status === "fulfilled" && deResults.value.length > 0) {
        setDeData(deResults.value[0]);
      }
    } catch {
      /* comparison is optional */
    }
  }, [decoded, days]);

  useEffect(() => {
    loadData();
    loadComparison();
  }, [loadData, loadComparison]);

  const history = data?.marketData.history ?? [];
  const priceChange = calculatePriceChange(history);

  const totalVolume = history.reduce((sum, h) => sum + h.soldItems, 0);
  const maxPrice = history.length > 0 ? Math.max(...history.map((h) => h.avgPrice)) : 0;
  const minPrice = history.length > 0 ? Math.min(...history.map((h) => h.avgPrice)) : 0;
  const latestOffers = history.length > 0 ? history[history.length - 1].openOffers : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-4">
        <Link
          href="/catalog"
          className="text-xs text-habbo-text-dim hover:text-habbo-cyan transition-colors"
        >
          {t.furniDetail.backToCatalog}
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-72 shrink-0">
          <PixelCard className="p-5 text-center" gold>
            <div className="relative w-full h-32 flex items-center justify-center mb-4">
              <FurniImage
                classname={decoded}
                alt={data?.furniName ?? decoded}
                size="lg"
                className="drop-shadow-xl"
              />
              <button
                onClick={() => toggleFavorite(decoded)}
                className={`absolute top-0 right-0 w-8 h-8 rounded-lg flex items-center justify-center text-lg transition-all ${
                  faved ? "text-red-400 scale-110" : "text-habbo-text-dim/40 hover:text-red-400"
                }`}
              >
                {faved ? "♥" : "♡"}
              </button>
            </div>
            <h1 className="font-[family-name:var(--font-pixel)] text-sm text-habbo-gold pixel-text-shadow mb-1">
              {data?.furniName ?? decoded}
            </h1>
            <p className="text-xs text-habbo-text-dim mb-3">
              {data?.furniDescription ?? ""}
            </p>
            <div className="text-xs text-habbo-text-dim space-y-1 text-left">
              <div className="flex justify-between">
                <span>{t.furniDetail.categoryLabel}</span>
                <span className="text-habbo-text">{data?.category ?? "—"}</span>
              </div>
              <div className="flex justify-between">
                <span>{t.furniDetail.lineLabel}</span>
                <span className="text-habbo-text">{data?.line ?? "—"}</span>
              </div>
              <div className="flex justify-between">
                <span>{t.furniDetail.typeLabel}</span>
                <span className="text-habbo-text">{data?.furniType ?? "—"}</span>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <PixelButton
                variant={inCompare ? "primary" : "gold"}
                size="sm"
                className="w-full"
                onClick={() => {
                  if (inCompare) {
                    removeItem(decoded);
                  } else {
                    addItem({
                      classname: decoded,
                      name: data?.furniName ?? decoded,
                    });
                  }
                }}
              >
                {inCompare ? t.furniDetail.inCompare : t.furniDetail.addToCompare}
              </PixelButton>
              <PixelButton
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={() => addToPortfolio(decoded, data?.furniName ?? decoded)}
              >
                {t.portfolio.addToPortfolio}
              </PixelButton>
            </div>
          </PixelCard>

          {data && (
            <div className="grid grid-cols-2 gap-2 mt-3">
              <PixelCard className="p-3 text-center">
                <div className="text-[9px] font-[family-name:var(--font-pixel)] text-habbo-text-dim uppercase">
                  {t.furniDetail.avgPrice}
                </div>
                <div className="text-sm font-mono font-bold text-habbo-cyan mt-1">
                  {formatCredits(data.marketData.averagePrice)}
                </div>
              </PixelCard>
              <PixelCard className="p-3 text-center">
                <div className="text-[9px] font-[family-name:var(--font-pixel)] text-habbo-text-dim uppercase">
                  {t.furniDetail.change}
                </div>
                <div
                  className={`text-sm font-mono font-bold mt-1 ${
                    priceChange && priceChange.value >= 0
                      ? "text-habbo-green"
                      : "text-habbo-red"
                  }`}
                >
                  {priceChange
                    ? `${priceChange.value >= 0 ? "+" : ""}${priceChange.percentage.toFixed(1)}%`
                    : "—"}
                </div>
              </PixelCard>
              <PixelCard className="p-3 text-center">
                <div className="text-[9px] font-[family-name:var(--font-pixel)] text-habbo-text-dim uppercase">
                  {t.furniDetail.volume}
                </div>
                <div className="text-sm font-mono font-bold text-habbo-gold mt-1">
                  {formatCredits(totalVolume)}
                </div>
              </PixelCard>
              <PixelCard className="p-3 text-center">
                <div className="text-[9px] font-[family-name:var(--font-pixel)] text-habbo-text-dim uppercase">
                  {t.furniDetail.offers}
                </div>
                <div className="text-sm font-mono font-bold text-habbo-purple mt-1">
                  {latestOffers}
                </div>
              </PixelCard>
              <PixelCard className="p-3 text-center">
                <div className="text-[9px] font-[family-name:var(--font-pixel)] text-habbo-text-dim uppercase">
                  {t.furniDetail.high}
                </div>
                <div className="text-sm font-mono font-bold text-habbo-green mt-1">
                  {formatCredits(maxPrice)}
                </div>
              </PixelCard>
              <PixelCard className="p-3 text-center">
                <div className="text-[9px] font-[family-name:var(--font-pixel)] text-habbo-text-dim uppercase">
                  {t.furniDetail.low}
                </div>
                <div className="text-sm font-mono font-bold text-habbo-red mt-1">
                  {formatCredits(minPrice)}
                </div>
              </PixelCard>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <HotelSelector value={hotel} onChange={setHotel} />
            <div className="flex gap-1">
              {(["7", "30", "90", "all"] as DayRange[]).map((d) => (
                <PixelButton
                  key={d}
                  variant={days === d ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setDays(d)}
                >
                  {d === "all" ? t.furniDetail.allTime : `${d}d`}
                </PixelButton>
              ))}
            </div>
          </div>

          {loading ? (
            <PixelCard className="p-6 h-[340px] flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-habbo-cyan/30 border-t-habbo-cyan rounded-full animate-spin" />
            </PixelCard>
          ) : error ? (
            <PixelCard className="p-8 text-center">
              <div className="text-2xl mb-3 opacity-50">📉</div>
              <p className="text-sm text-habbo-text-dim">{error}</p>
            </PixelCard>
          ) : (
            <>
              <PixelCard className="p-4">
                <h2 className="font-[family-name:var(--font-pixel)] text-[10px] text-habbo-text-dim uppercase tracking-wider mb-3">
                  {t.furniDetail.priceHistory}
                </h2>
                <PriceChart history={history} />
              </PixelCard>

              <PixelCard className="p-4">
                <h2 className="font-[family-name:var(--font-pixel)] text-[10px] text-habbo-text-dim uppercase tracking-wider mb-3">
                  {t.furniDetail.tradeVolume}
                </h2>
                <VolumeChart history={history} />
              </PixelCard>

              {comData && deData && (
                <PixelCard className="p-4">
                  <h2 className="font-[family-name:var(--font-pixel)] text-[10px] text-habbo-text-dim uppercase tracking-wider mb-3">
                    {t.furniDetail.comVsDeComparison}
                  </h2>
                  <CompareChart
                    datasets={[
                      {
                        label: "Habbo.com",
                        history: comData.marketData.history,
                        color: CHART_COLORS.primary,
                      },
                      {
                        label: "Habbo.de",
                        history: deData.marketData.history,
                        color: CHART_COLORS.secondary,
                      },
                    ]}
                  />
                </PixelCard>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
