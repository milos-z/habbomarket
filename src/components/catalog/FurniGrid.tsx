"use client";

import Link from "next/link";
import type { FurniItem } from "@/lib/types";
import { FurniCard } from "./FurniCard";
import { FurniImage } from "@/components/common/FurniImage";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { PixelIcon } from "@/components/common/PixelIcon";

interface FurniGridProps {
  items: FurniItem[];
  loading?: boolean;
  viewMode?: "grid" | "list";
}

export function FurniGrid({ items, loading, viewMode = "grid" }: FurniGridProps) {
  const { t } = useLanguage();

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {Array.from({ length: 24 }).map((_, i) => (
          <div
            key={i}
            className="bg-habbo-card pixel-border rounded-lg p-3 animate-pulse"
          >
            <div className="w-full h-20 bg-habbo-border/30 rounded mb-2" />
            <div className="h-3 bg-habbo-border/30 rounded w-3/4 mb-1" />
            <div className="h-2 bg-habbo-border/20 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-habbo-card border border-habbo-border flex items-center justify-center">
          <span className="text-habbo-text-dim"><PixelIcon name="search" size="lg" /></span>
        </div>
        <h3 className="font-[family-name:var(--font-pixel)] text-sm text-habbo-text-dim mb-2">
          {t.catalog.noFurniFound}
        </h3>
        <p className="text-xs text-habbo-text-dim/60">
          {t.catalog.noFurniHint}
        </p>
      </div>
    );
  }

  if (viewMode === "list") {
    return (
      <div className="space-y-1">
        {items.map((item) => (
          <Link
            key={`${item.classname}-${item.id}`}
            href={`/furni/${encodeURIComponent(item.classname)}`}
            className="group flex items-center gap-3 px-3 py-2 bg-habbo-card/50 hover:bg-habbo-card rounded-lg transition-colors"
          >
            <FurniImage
              classname={item.classname}
              alt={item.name}
              size="sm"
              revision={item.revision}
            />
            <div className="flex-1 min-w-0">
              <div className="text-xs text-habbo-text font-medium truncate group-hover:text-habbo-cyan transition-colors">
                {item.name}
              </div>
              <div className="text-[10px] text-habbo-text-dim truncate">
                {item.category} {item.furniline ? `· ${item.furniline}` : ""}
              </div>
            </div>
            {item.rare && (
              <span className="text-[7px] font-[family-name:var(--font-pixel)] px-1.5 py-0.5 bg-habbo-gold/20 text-habbo-gold rounded border border-habbo-gold/30 shrink-0">
                RARE
              </span>
            )}
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
      {items.map((item) => (
        <FurniCard key={`${item.classname}-${item.id}`} item={item} />
      ))}
    </div>
  );
}
