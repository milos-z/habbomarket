"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { FurniItem } from "@/lib/types";
import { HotelDomain } from "@/lib/types";
import { PixelCard } from "@/components/common/PixelCard";
import { PixelButton } from "@/components/common/PixelButton";
import { FurniImage } from "@/components/common/FurniImage";
import { useFavorites } from "@/components/providers/FavoritesProvider";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { PixelIcon } from "@/components/common/PixelIcon";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";

export default function FavoritesPage() {
  const { favorites, removeFavorite, exportData, importData } = useFavorites();
  const { t } = useLanguage();
  const [furniMap, setFurniMap] = useState<Record<string, FurniItem>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(
          `/api/furnidata?hotel=${HotelDomain.DE}&tradeableOnly=false`
        );
        if (res.ok) {
          const all: FurniItem[] = await res.json();
          const map: Record<string, FurniItem> = {};
          for (const item of all) {
            map[item.classname] = item;
          }
          setFurniMap(map);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const favoriteItems = favorites
    .map((cn) => furniMap[cn])
    .filter(Boolean) as FurniItem[];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <Breadcrumbs segments={[{ label: t.nav.favorites }]} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-pixel)] text-lg text-habbo-gold pixel-text-shadow">
            {t.favorites.title}
          </h1>
          <p className="text-sm text-habbo-text-dim mt-1">{t.favorites.subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <PixelButton variant="ghost" size="sm" onClick={importData}>
            Import
          </PixelButton>
          {favorites.length > 0 && (
            <PixelButton variant="ghost" size="sm" onClick={exportData}>
              Export
            </PixelButton>
          )}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-32 bg-habbo-card pixel-border rounded-lg animate-pulse" />
          ))}
        </div>
      ) : favorites.length === 0 ? (
        <PixelCard className="p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 pixel-grid-bg opacity-20" />
          <div className="relative z-10">
            <div className="w-16 h-16 mx-auto mb-5 rounded-xl bg-habbo-red/10 border border-habbo-red/20 flex items-center justify-center animate-float">
              <span className="text-habbo-red"><PixelIcon name="heart-outline" size="xl" /></span>
            </div>
            <h2 className="font-[family-name:var(--font-pixel)] text-xs text-habbo-text mb-2">
              {t.favorites.empty}
            </h2>
            <p className="text-sm text-habbo-text-dim/70 max-w-md mx-auto">
              {t.favorites.emptyHint}
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {favoriteItems.map((item) => (
            <div
              key={item.classname}
              className="group relative bg-habbo-card pixel-border rounded-lg p-3 hover:bg-habbo-card-hover transition-all"
            >
              <button
                onClick={() => removeFavorite(item.classname)}
                className="absolute top-2 right-2 w-6 h-6 text-red-400 hover:text-red-300 flex items-center justify-center transition-colors z-10"
              >
                <PixelIcon name="heart" size="sm" />
              </button>
              <Link href={`/furni/${encodeURIComponent(item.classname)}`}>
                <div className="w-full h-20 flex items-center justify-center mb-2">
                  <FurniImage
                    classname={item.classname}
                    alt={item.name}
                    size="lg"
                    revision={item.revision}
                    className="drop-shadow-lg group-hover:scale-110 transition-transform"
                  />
                </div>
                <div className="text-xs text-habbo-text font-medium truncate">
                  {item.name}
                </div>
                <div className="text-[10px] text-habbo-text-dim truncate mt-0.5">
                  {item.category}
                </div>
              </Link>
              {item.rare && (
                <span className="absolute bottom-2 left-2 text-[7px] font-[family-name:var(--font-pixel)] px-1.5 py-0.5 bg-habbo-gold/20 text-habbo-gold rounded border border-habbo-gold/30">
                  RARE
                </span>
              )}
            </div>
          ))}
          {favorites
            .filter((cn) => !furniMap[cn])
            .map((cn) => (
              <div
                key={cn}
                className="relative bg-habbo-card pixel-border rounded-lg p-3 opacity-60"
              >
                <button
                  onClick={() => removeFavorite(cn)}
                  className="absolute top-2 right-2 w-6 h-6 text-red-400/50 hover:text-red-300 flex items-center justify-center transition-colors"
                >
                  <PixelIcon name="heart" size="sm" />
                </button>
                <div className="w-full h-20 flex items-center justify-center mb-2">
                  <FurniImage classname={cn} alt={cn} size="lg" />
                </div>
                <div className="text-xs text-habbo-text-dim truncate">{cn}</div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
