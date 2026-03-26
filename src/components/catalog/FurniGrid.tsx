"use client";

import type { FurniItem } from "@/lib/types";
import { FurniCard } from "./FurniCard";

interface FurniGridProps {
  items: FurniItem[];
  loading?: boolean;
}

export function FurniGrid({ items, loading }: FurniGridProps) {
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
        <div className="text-4xl mb-4 opacity-50">🔍</div>
        <h3 className="font-[family-name:var(--font-pixel)] text-sm text-habbo-text-dim mb-2">
          No furni found
        </h3>
        <p className="text-xs text-habbo-text-dim/60">
          Try adjusting your filters or search terms.
        </p>
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
