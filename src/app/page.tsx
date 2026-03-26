"use client";

import Link from "next/link";
import { SearchBar } from "@/components/common/SearchBar";
import { SpotlightCarousel } from "@/components/dashboard/SpotlightCarousel";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { PriceMovers } from "@/components/dashboard/PriceMovers";
import { TrendingFurni } from "@/components/dashboard/TrendingFurni";
import { PixelButton } from "@/components/common/PixelButton";

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Hero */}
      <section className="text-center py-8">
        <h1 className="font-[family-name:var(--font-pixel)] text-xl md:text-2xl text-habbo-gold pixel-text-shadow mb-3">
          HabboMarket
        </h1>
        <p className="text-sm text-habbo-text-dim max-w-lg mx-auto mb-6">
          Analyze marketplace prices, compare furni across hotels, and track
          trends — all in one dashboard.
        </p>
        <SearchBar
          placeholder="Search any furni by name or classname..."
          className="max-w-md mx-auto"
        />
        <div className="flex justify-center gap-3 mt-4">
          <Link href="/catalog">
            <PixelButton variant="primary">Browse Catalog</PixelButton>
          </Link>
          <Link href="/compare">
            <PixelButton variant="gold">Compare Furni</PixelButton>
          </Link>
        </div>
      </section>

      {/* Quick stats */}
      <QuickStats />

      {/* Spotlight */}
      <SpotlightCarousel />

      {/* Widgets grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PriceMovers />
        <TrendingFurni />
      </div>
    </div>
  );
}
