"use client";

import Link from "next/link";
import { SearchBar } from "@/components/common/SearchBar";
import { SpotlightCarousel } from "@/components/dashboard/SpotlightCarousel";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { PriceMovers } from "@/components/dashboard/PriceMovers";
import { TrendingFurni } from "@/components/dashboard/TrendingFurni";
import { MarketSummary } from "@/components/dashboard/MarketSummary";
import { QuickCategories } from "@/components/dashboard/QuickCategories";
import { QuickTools } from "@/components/dashboard/QuickTools";
import { FloatingFurni } from "@/components/dashboard/FloatingFurni";
import { RecentlyViewed } from "@/components/dashboard/RecentlyViewed";
import { PortfolioWidget } from "@/components/dashboard/PortfolioWidget";
import { MarketHealth } from "@/components/dashboard/MarketHealth";
import { PixelButton } from "@/components/common/PixelButton";
import { PixelIcon } from "@/components/common/PixelIcon";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function DashboardPage() {
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Enhanced Hero */}
      <section className="relative text-center py-12 md:py-16 rounded-xl overflow-hidden">
        <div className="absolute inset-0 pixel-grid-bg opacity-30 rounded-xl" />
        <div className="absolute inset-0 bg-linear-to-b from-habbo-gold/5 via-transparent to-habbo-cyan/3 pointer-events-none rounded-xl" />

        <FloatingFurni />

        {/* Sparkles */}
        <div className="absolute top-6 left-[15%] w-1 h-1 bg-habbo-gold rounded-full animate-pixel-pulse" />
        <div className="absolute top-10 right-[20%] w-1.5 h-1.5 bg-habbo-cyan rounded-full animate-pixel-pulse" style={{ animationDelay: "0.5s" }} />
        <div className="absolute bottom-8 left-[25%] w-1 h-1 bg-habbo-gold rounded-full animate-pixel-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-12 right-[30%] w-1 h-1 bg-habbo-cyan rounded-full animate-pixel-pulse" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-[40%] left-[8%] w-0.5 h-0.5 bg-habbo-gold rounded-full animate-pixel-pulse" style={{ animationDelay: "0.8s" }} />
        <div className="absolute top-[30%] right-[10%] w-0.5 h-0.5 bg-habbo-cyan rounded-full animate-pixel-pulse" style={{ animationDelay: "1.2s" }} />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-habbo-gold/10 border border-habbo-gold/20 animate-fade-in">
            <PixelIcon name="star" size="xs" className="text-habbo-gold" />
            <span className="text-[10px] font-pixel text-habbo-gold uppercase tracking-wider">
              Habbo Market
            </span>
          </div>

          <h1 className="font-pixel text-xl md:text-2xl text-habbo-gold pixel-text-shadow mb-3 animate-slide-up">
            {t.dashboard.title}
          </h1>
          <p className="text-sm text-habbo-text-dim max-w-lg mx-auto mb-6 leading-relaxed animate-fade-in" style={{ animationDelay: "0.2s" }}>
            {t.dashboard.subtitle}
          </p>
          <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <SearchBar
              placeholder={t.dashboard.searchPlaceholder}
              className="max-w-lg mx-auto"
            />
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-6 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <Link href="/catalog">
              <PixelButton variant="primary">
                <span className="flex items-center gap-1.5">
                  <PixelIcon name="search" size="xs" />
                  {t.dashboard.browseCatalog}
                </span>
              </PixelButton>
            </Link>
            <Link href="/trade">
              <PixelButton variant="gold">
                <span className="flex items-center gap-1.5">
                  <PixelIcon name="trade" size="xs" />
                  {t.nav.trade}
                </span>
              </PixelButton>
            </Link>
            <Link href="/compare">
              <PixelButton variant="secondary">
                <span className="flex items-center gap-1.5">
                  <PixelIcon name="compare" size="xs" />
                  {t.dashboard.compareFurni}
                </span>
              </PixelButton>
            </Link>
          </div>
        </div>
      </section>

      {/* Market Health */}
      <MarketHealth />

      {/* Stats + Market Summary row */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-4">
        <QuickStats />
        <MarketSummary />
      </div>

      {/* Recently Viewed */}
      <RecentlyViewed />

      {/* Categories */}
      <QuickCategories />

      {/* Spotlight + Tools + Portfolio */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
        <SpotlightCarousel />
        <div className="space-y-4">
          <QuickTools />
          <PortfolioWidget />
        </div>
      </div>

      {/* Market data columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PriceMovers />
        <TrendingFurni />
      </div>
    </div>
  );
}
