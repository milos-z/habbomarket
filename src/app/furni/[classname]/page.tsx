"use client";

import { useState, useEffect, useCallback, use } from "react";
import Link from "next/link";
import { HotelDomain } from "@/lib/types";
import type { MarketData } from "@/lib/types";
import { fetchMarketHistory } from "@/lib/api";
import { formatCredits, formatPrice, calculatePriceChange, exportToCSV } from "@/lib/utils";
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
import { useAlerts } from "@/components/providers/AlertsProvider";
import { PixelIcon } from "@/components/common/PixelIcon";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { showToast } from "@/components/common/Toast";
import { addRecentlyViewed } from "@/components/dashboard/RecentlyViewed";
import { AlertDirection } from "@/lib/types";
import type { FurniItem } from "@/lib/types";

type DayRange = "7" | "30" | "90" | "180" | "365" | "all";

export default function FurniDetailPage({
  params,
}: {
  params: Promise<{ classname: string }>;
}) {
  const { classname } = use(params);
  const decoded = decodeURIComponent(classname);
  const { t } = useLanguage();

  const [hotel, setHotel] = useState<HotelDomain>(HotelDomain.DE);
  const [days, setDays] = useState<DayRange>("90");
  const [data, setData] = useState<MarketData | null>(null);
  const [comData, setComData] = useState<MarketData | null>(null);
  const [deData, setDeData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { addItem, removeItem, hasItem } = useCompare();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addEntry: addToPortfolio } = usePortfolio();
  const { addAlert } = useAlerts();
  const inCompare = hasItem(decoded);
  const faved = isFavorite(decoded);
  const [relatedItems, setRelatedItems] = useState<FurniItem[]>([]);
  const [alertTargetPrice, setAlertTargetPrice] = useState("");

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

  useEffect(() => {
    if (data?.furniName) {
      addRecentlyViewed(decoded, data.furniName);
    }
  }, [data?.furniName, decoded]);

  useEffect(() => {
    async function loadRelated() {
      try {
        const res = await fetch(`/api/furnidata?hotel=${hotel}&tradeableOnly=true&limit=200`);
        if (res.ok) {
          const all: FurniItem[] = await res.json();
          const related = all
            .filter((i) => i.classname !== decoded)
            .filter((i) => {
              if (data?.line && i.furniline === data.line) return true;
              if (data?.category && i.category === data.category) return true;
              return false;
            })
            .slice(0, 6);
          setRelatedItems(related);
        }
      } catch {
        /* silent */
      }
    }
    if (data) loadRelated();
  }, [data, hotel, decoded]);

  function handleShare() {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      showToast("Link copied to clipboard", "success");
    }
  }

  function handleQuickAlert(direction: AlertDirection) {
    const price = parseInt(alertTargetPrice);
    if (!price || price <= 0) {
      showToast("Enter a valid target price", "warning");
      return;
    }
    addAlert({
      classname: decoded,
      name: data?.furniName ?? decoded,
      targetPrice: price,
      direction,
      hotel,
    });
    setAlertTargetPrice("");
  }

  const history = data?.marketData.history ?? [];
  const priceChange = calculatePriceChange(history);

  const totalVolume = history.reduce((sum, h) => sum + h.soldItems, 0);
  const maxPrice = history.length > 0 ? Math.max(...history.map((h) => h.avgPrice)) : 0;
  const minPrice = history.length > 0 ? Math.min(...history.map((h) => h.avgPrice)) : 0;
  const latestOffers = history.length > 0 ? history[history.length - 1].openOffers : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Breadcrumbs
        segments={[
          { label: t.nav.catalog, href: "/catalog" },
          { label: data?.furniName ?? decoded },
        ]}
      />

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
                <PixelIcon name={faved ? "heart" : "heart-outline"} size="md" />
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
              <PixelButton
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={handleShare}
              >
                <span className="flex items-center gap-1.5 justify-center">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share
                </span>
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
                  {formatPrice(data.marketData.averagePrice)}
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
                  {formatPrice(maxPrice)}
                </div>
              </PixelCard>
              <PixelCard className="p-3 text-center">
                <div className="text-[9px] font-[family-name:var(--font-pixel)] text-habbo-text-dim uppercase">
                  {t.furniDetail.low}
                </div>
                <div className="text-sm font-mono font-bold text-habbo-red mt-1">
                  {formatPrice(minPrice)}
                </div>
              </PixelCard>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <HotelSelector value={hotel} onChange={setHotel} />
            <div className="flex gap-1 flex-wrap">
              {(["7", "30", "90", "180", "365", "all"] as DayRange[]).map((d) => {
                let label: string;
                if (d === "all") label = t.furniDetail.allTime;
                else if (d === "180") label = t.furniDetail.sixMonths;
                else if (d === "365") label = t.furniDetail.oneYear;
                else label = `${d}d`;
                return (
                  <PixelButton
                    key={d}
                    variant={days === d ? "primary" : "ghost"}
                    size="sm"
                    onClick={() => setDays(d)}
                  >
                    {label}
                  </PixelButton>
                );
              })}
            </div>
          </div>

          {!loading && !error && history.length > 0 && (
            <div className="flex justify-end">
              <PixelButton
                variant="ghost"
                size="sm"
                onClick={() => {
                  const headers = ["Date", "Avg Price", "Sold Items", "Credit Sum", "Open Offers"];
                  const rows = history.map((h) => [
                    new Date(h.timestamp * 1000).toISOString().split("T")[0],
                    h.avgPrice,
                    h.soldItems,
                    h.creditSum,
                    h.openOffers,
                  ]);
                  exportToCSV(`${decoded}-${hotel}-${days}d`, headers, rows);
                }}
              >
                {t.furniDetail.exportCSV}
              </PixelButton>
            </div>
          )}

          {loading ? (
            <PixelCard className="p-6 h-[340px] flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-habbo-cyan/30 border-t-habbo-cyan rounded-full animate-spin" />
            </PixelCard>
          ) : error ? (
            <PixelCard className="p-8 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-habbo-red/10 border border-habbo-red/20 flex items-center justify-center">
                <span className="text-habbo-red"><PixelIcon name="chart-down" size="lg" /></span>
              </div>
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
                <VolumeChart history={history} label={t.furniDetail.volume} />
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
          {!loading && !error && data && (
            <PixelCard className="p-4">
              <h2 className="font-[family-name:var(--font-pixel)] text-[10px] text-habbo-text-dim uppercase tracking-wider mb-3">
                Quick Price Alert
              </h2>
              <div className="flex flex-wrap items-end gap-2">
                <div className="flex-1 min-w-[120px]">
                  <input
                    type="number"
                    value={alertTargetPrice}
                    onChange={(e) => setAlertTargetPrice(e.target.value)}
                    placeholder="Target price..."
                    className="w-full px-3 py-2 bg-habbo-input border border-habbo-border rounded text-sm text-habbo-text placeholder:text-habbo-text-dim/50 focus:outline-none focus:border-habbo-cyan/50"
                    min={1}
                  />
                </div>
                <PixelButton
                  variant="primary"
                  size="sm"
                  onClick={() => handleQuickAlert(AlertDirection.ABOVE)}
                >
                  Alert Above
                </PixelButton>
                <PixelButton
                  variant="gold"
                  size="sm"
                  onClick={() => handleQuickAlert(AlertDirection.BELOW)}
                >
                  Alert Below
                </PixelButton>
              </div>
            </PixelCard>
          )}
        </div>
      </div>

      {relatedItems.length > 0 && (
        <div className="mt-8">
          <h2 className="font-[family-name:var(--font-pixel)] text-xs text-habbo-text-dim uppercase tracking-wider mb-3">
            Related Items
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {relatedItems.map((item) => (
              <Link
                key={item.classname}
                href={`/furni/${encodeURIComponent(item.classname)}`}
                className="group bg-habbo-card pixel-border rounded-lg p-3 hover:bg-habbo-card-hover transition-all text-center"
              >
                <div className="w-full h-16 flex items-center justify-center mb-2">
                  <FurniImage
                    classname={item.classname}
                    alt={item.name}
                    size="md"
                    className="group-hover:scale-110 transition-transform"
                  />
                </div>
                <div className="text-[10px] text-habbo-text truncate">{item.name}</div>
                {item.rare && (
                  <span className="text-[7px] font-[family-name:var(--font-pixel)] text-habbo-gold">RARE</span>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
