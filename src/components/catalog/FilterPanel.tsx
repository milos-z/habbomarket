"use client";

import { HotelDomain, SortField, SortDirection } from "@/lib/types";
import type { CatalogFilters } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/constants";
import { HotelSelector } from "@/components/common/HotelSelector";
import { PixelButton } from "@/components/common/PixelButton";

interface FilterPanelProps {
  filters: CatalogFilters;
  categories: string[];
  furnilines: string[];
  onChange: (patch: Partial<CatalogFilters>) => void;
  totalResults: number;
}

export function FilterPanel({
  filters,
  categories,
  furnilines,
  onChange,
  totalResults,
}: FilterPanelProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-[10px] font-[family-name:var(--font-pixel)] text-habbo-text-dim uppercase tracking-wider mb-2 block">
          Hotel
        </label>
        <HotelSelector
          value={filters.hotel}
          onChange={(hotel: HotelDomain) => onChange({ hotel, page: 1 })}
        />
      </div>

      <div>
        <label className="text-[10px] font-[family-name:var(--font-pixel)] text-habbo-text-dim uppercase tracking-wider mb-2 block">
          Search
        </label>
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value, page: 1 })}
          placeholder="Name or classname..."
          className="w-full px-3 py-2 bg-habbo-input border border-habbo-border rounded text-sm text-habbo-text placeholder:text-habbo-text-dim/50 focus:outline-none focus:border-habbo-cyan/50"
        />
      </div>

      <div>
        <label className="text-[10px] font-[family-name:var(--font-pixel)] text-habbo-text-dim uppercase tracking-wider mb-2 block">
          Category
        </label>
        <select
          value={filters.category}
          onChange={(e) => onChange({ category: e.target.value, page: 1 })}
          className="w-full px-3 py-2 bg-habbo-input border border-habbo-border rounded text-sm text-habbo-text focus:outline-none focus:border-habbo-cyan/50"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {CATEGORY_LABELS[cat] || cat}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-[10px] font-[family-name:var(--font-pixel)] text-habbo-text-dim uppercase tracking-wider mb-2 block">
          Furni Line
        </label>
        <select
          value={filters.furniline}
          onChange={(e) => onChange({ furniline: e.target.value, page: 1 })}
          className="w-full px-3 py-2 bg-habbo-input border border-habbo-border rounded text-sm text-habbo-text focus:outline-none focus:border-habbo-cyan/50"
        >
          <option value="">All Lines</option>
          {furnilines.map((line) => (
            <option key={line} value={line}>
              {line}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2">
        <PixelButton
          variant={filters.rareOnly ? "gold" : "secondary"}
          size="sm"
          onClick={() => onChange({ rareOnly: !filters.rareOnly, page: 1 })}
          className="flex-1"
        >
          {filters.rareOnly ? "★ Rare" : "Rare"}
        </PixelButton>
        <PixelButton
          variant={filters.tradeableOnly ? "primary" : "secondary"}
          size="sm"
          onClick={() =>
            onChange({ tradeableOnly: !filters.tradeableOnly, page: 1 })
          }
          className="flex-1"
        >
          Tradeable
        </PixelButton>
      </div>

      <div>
        <label className="text-[10px] font-[family-name:var(--font-pixel)] text-habbo-text-dim uppercase tracking-wider mb-2 block">
          Sort By
        </label>
        <div className="flex gap-1 flex-wrap">
          {[
            { field: SortField.NAME, label: "Name" },
            { field: SortField.PRICE, label: "Price" },
          ].map(({ field, label }) => (
            <PixelButton
              key={field}
              variant={filters.sortField === field ? "primary" : "ghost"}
              size="sm"
              onClick={() => {
                if (filters.sortField === field) {
                  onChange({
                    sortDirection:
                      filters.sortDirection === SortDirection.ASC
                        ? SortDirection.DESC
                        : SortDirection.ASC,
                  });
                } else {
                  onChange({ sortField: field, sortDirection: SortDirection.ASC });
                }
              }}
            >
              {label}
              {filters.sortField === field && (
                <span className="ml-1">
                  {filters.sortDirection === SortDirection.ASC ? "↑" : "↓"}
                </span>
              )}
            </PixelButton>
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-habbo-border">
        <div className="text-xs text-habbo-text-dim">
          <span className="text-habbo-cyan font-mono font-bold">
            {totalResults.toLocaleString()}
          </span>{" "}
          items found
        </div>
      </div>
    </div>
  );
}
