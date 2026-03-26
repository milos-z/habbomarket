"use client";

import Link from "next/link";
import type { FurniItem } from "@/lib/types";
import { furniImageUrl } from "@/lib/utils";
import { useCompare } from "@/components/providers/CompareProvider";

interface FurniCardProps {
  item: FurniItem;
}

export function FurniCard({ item }: FurniCardProps) {
  const { addItem, removeItem, hasItem } = useCompare();
  const inCompare = hasItem(item.classname);

  function toggleCompare(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (inCompare) {
      removeItem(item.classname);
    } else {
      addItem({ classname: item.classname, name: item.name });
    }
  }

  return (
    <Link
      href={`/furni/${encodeURIComponent(item.classname)}`}
      className="group block bg-habbo-card pixel-border rounded-lg p-3 hover:bg-habbo-card-hover hover:scale-[1.03] transition-all duration-200"
    >
      <div className="relative">
        <div className="w-full h-20 flex items-center justify-center mb-2">
          <img
            src={furniImageUrl(item.classname)}
            alt={item.name}
            className="max-h-full max-w-full object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-200"
            loading="lazy"
          />
        </div>

        <button
          onClick={toggleCompare}
          className={`absolute top-0 right-0 w-6 h-6 rounded text-[10px] flex items-center justify-center transition-all ${
            inCompare
              ? "bg-habbo-cyan/30 text-habbo-cyan border border-habbo-cyan/50"
              : "bg-habbo-card/80 text-habbo-text-dim border border-habbo-border opacity-0 group-hover:opacity-100"
          }`}
          title={inCompare ? "Remove from compare" : "Add to compare"}
        >
          {inCompare ? "✓" : "+"}
        </button>

        {item.rare && (
          <span className="absolute top-0 left-0 text-[7px] font-[family-name:var(--font-pixel)] px-1.5 py-0.5 bg-habbo-gold/20 text-habbo-gold rounded border border-habbo-gold/30">
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
