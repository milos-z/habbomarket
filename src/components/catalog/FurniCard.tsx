"use client";

import Link from "next/link";
import type { FurniItem } from "@/lib/types";
import { useCompare } from "@/components/providers/CompareProvider";
import { useFavorites } from "@/components/providers/FavoritesProvider";
import { FurniImage } from "@/components/common/FurniImage";

interface FurniCardProps {
  item: FurniItem;
}

export function FurniCard({ item }: FurniCardProps) {
  const { addItem, removeItem, hasItem } = useCompare();
  const { isFavorite, toggleFavorite } = useFavorites();
  const inCompare = hasItem(item.classname);
  const faved = isFavorite(item.classname);

  function handleToggleCompare(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (inCompare) {
      removeItem(item.classname);
    } else {
      addItem({ classname: item.classname, name: item.name });
    }
  }

  function handleToggleFavorite(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(item.classname);
  }

  return (
    <Link
      href={`/furni/${encodeURIComponent(item.classname)}`}
      className="group block bg-habbo-card pixel-border rounded-lg p-3 hover:bg-habbo-card-hover hover:scale-[1.03] transition-all duration-200"
    >
      <div className="relative">
        <div className="w-full h-20 flex items-center justify-center mb-2">
          <FurniImage
            classname={item.classname}
            alt={item.name}
            size="lg"
            className="drop-shadow-lg group-hover:scale-110 transition-transform duration-200"
          />
        </div>

        <button
          onClick={handleToggleFavorite}
          className={`absolute top-0 left-0 w-6 h-6 rounded text-sm flex items-center justify-center transition-all ${
            faved
              ? "text-red-400"
              : "text-habbo-text-dim/30 opacity-0 group-hover:opacity-100"
          }`}
        >
          {faved ? "♥" : "♡"}
        </button>

        <button
          onClick={handleToggleCompare}
          className={`absolute top-0 right-0 w-6 h-6 rounded text-[10px] flex items-center justify-center transition-all ${
            inCompare
              ? "bg-habbo-cyan/30 text-habbo-cyan border border-habbo-cyan/50"
              : "bg-habbo-card/80 text-habbo-text-dim border border-habbo-border opacity-0 group-hover:opacity-100"
          }`}
        >
          {inCompare ? "✓" : "+"}
        </button>

        {item.rare && (
          <span className="absolute bottom-0 left-0 text-[7px] font-[family-name:var(--font-pixel)] px-1.5 py-0.5 bg-habbo-gold/20 text-habbo-gold rounded border border-habbo-gold/30">
            RARE
          </span>
        )}
      </div>

      <div className="text-xs text-habbo-text font-medium truncate">
        {item.name}
      </div>
      <div className="text-[10px] text-habbo-text-dim truncate mt-0.5">
        {item.category} {item.furniline ? `· ${item.furniline}` : ""}
      </div>
    </Link>
  );
}
