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
import { PixelButton } from "@/components/common/PixelButton";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function DashboardPage() {
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
      <section className="text-center py-6 md:py-10">
        <h1 className="font-[family-name:var(--font-pixel)] text-xl md:text-2xl text-habbo-gold pixel-text-shadow mb-3">
          {t.dashboard.title}
        </h1>
        <p className="text-sm text-habbo-text-dim max-w-lg mx-auto mb-6">
          {t.dashboard.subtitle}
        </p>
        <SearchBar
          placeholder={t.dashboard.searchPlaceholder}
          className="max-w-md mx-auto"
        />
        <div className="flex flex-wrap justify-center gap-3 mt-5">
          <Link href="/catalog">
            <PixelButton variant="primary">{t.dashboard.browseCatalog}</PixelButton>
          </Link>
          <Link href="/trade">
            <PixelButton variant="gold">{t.nav.trade}</PixelButton>
          </Link>
          <Link href="/compare">
            <PixelButton variant="secondary">{t.dashboard.compareFurni}</PixelButton>
          </Link>
        </div>
      </section>

      <QuickCategories />

      <QuickStats />

      <MarketSummary />

      <QuickTools />

      <SpotlightCarousel />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PriceMovers />
        <TrendingFurni />
      </div>
    </div>
  );
}
