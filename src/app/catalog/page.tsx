"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import type { FurniItem, CatalogFilters } from "@/lib/types";
import { SortField, SortDirection, HotelDomain } from "@/lib/types";
import { DEFAULT_FILTERS, ITEMS_PER_PAGE } from "@/lib/constants";
import { FilterPanel } from "@/components/catalog/FilterPanel";
import { FurniGrid } from "@/components/catalog/FurniGrid";
import { Pagination } from "@/components/common/Pagination";

export default function CatalogPage() {
  const [allItems, setAllItems] = useState<FurniItem[]>([]);
  const [filters, setFilters] = useState<CatalogFilters>(DEFAULT_FILTERS);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async (hotel: HotelDomain) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/furnidata?hotel=${hotel}&tradeableOnly=false`
      );
      if (res.ok) {
        const data: FurniItem[] = await res.json();
        setAllItems(data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(filters.hotel);
  }, [filters.hotel, loadData]);

  const categories = useMemo(() => {
    const set = new Set(allItems.map((i) => i.category));
    return Array.from(set).sort();
  }, [allItems]);

  const furnilines = useMemo(() => {
    const set = new Set(allItems.map((i) => i.furniline).filter(Boolean));
    return Array.from(set).sort();
  }, [allItems]);

  const filteredItems = useMemo(() => {
    let result = allItems;

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.classname.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q)
      );
    }
    if (filters.category) {
      result = result.filter((i) => i.category === filters.category);
    }
    if (filters.furniline) {
      result = result.filter((i) => i.furniline === filters.furniline);
    }
    if (filters.rareOnly) {
      result = result.filter((i) => i.rare);
    }
    if (filters.tradeableOnly) {
      result = result.filter((i) => i.tradeable);
    }

    result.sort((a, b) => {
      const dir = filters.sortDirection === SortDirection.ASC ? 1 : -1;
      switch (filters.sortField) {
        case SortField.NAME:
          return a.name.localeCompare(b.name) * dir;
        default:
          return a.name.localeCompare(b.name) * dir;
      }
    });

    return result;
  }, [allItems, filters]);

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const paginatedItems = filteredItems.slice(
    (filters.page - 1) * ITEMS_PER_PAGE,
    filters.page * ITEMS_PER_PAGE
  );

  function updateFilters(patch: Partial<CatalogFilters>) {
    setFilters((prev) => ({ ...prev, ...patch }));
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="font-[family-name:var(--font-pixel)] text-lg text-habbo-gold pixel-text-shadow">
          Furni Catalog
        </h1>
        <p className="text-sm text-habbo-text-dim mt-1">
          Browse and discover furniture across Habbo hotels
        </p>
      </div>

      <div className="flex gap-6">
        <aside className="w-56 shrink-0 hidden md:block">
          <div className="sticky top-20 bg-habbo-card pixel-border rounded-lg p-4">
            <FilterPanel
              filters={filters}
              categories={categories}
              furnilines={furnilines}
              onChange={updateFilters}
              totalResults={filteredItems.length}
            />
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          {/* Mobile filters */}
          <details className="md:hidden mb-4 bg-habbo-card pixel-border rounded-lg">
            <summary className="px-4 py-3 text-sm text-habbo-text-dim cursor-pointer">
              Filters & Sort
            </summary>
            <div className="px-4 pb-4">
              <FilterPanel
                filters={filters}
                categories={categories}
                furnilines={furnilines}
                onChange={updateFilters}
                totalResults={filteredItems.length}
              />
            </div>
          </details>

          <FurniGrid items={paginatedItems} loading={loading} />

          <Pagination
            currentPage={filters.page}
            totalPages={totalPages}
            onPageChange={(page) => updateFilters({ page })}
          />
        </div>
      </div>
    </div>
  );
}
