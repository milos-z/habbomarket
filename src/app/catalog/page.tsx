"use client";

import { Suspense, useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { FurniItem, CatalogFilters } from "@/lib/types";
import { SortField, SortDirection, HotelDomain } from "@/lib/types";
import { DEFAULT_FILTERS, ITEMS_PER_PAGE } from "@/lib/constants";
import { FilterPanel } from "@/components/catalog/FilterPanel";
import { FurniGrid } from "@/components/catalog/FurniGrid";
import { Pagination } from "@/components/common/Pagination";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { PixelButton } from "@/components/common/PixelButton";
import { PixelIcon } from "@/components/common/PixelIcon";

export default function CatalogPage() {
  return (
    <Suspense>
      <CatalogContent />
    </Suspense>
  );
}

type ViewMode = "grid" | "list";

function filtersFromParams(params: URLSearchParams): CatalogFilters {
  return {
    search: params.get("search") ?? "",
    category: params.get("category") ?? "",
    furniline: params.get("furniline") ?? "",
    rareOnly: params.get("rare") === "true",
    tradeableOnly: params.get("tradeable") !== "false",
    hotel: (params.get("hotel") as HotelDomain) || HotelDomain.DE,
    sortField: (params.get("sort") as SortField) || SortField.NAME,
    sortDirection: (params.get("dir") as SortDirection) || SortDirection.ASC,
    page: parseInt(params.get("page") ?? "1") || 1,
    perPage: ITEMS_PER_PAGE,
  };
}

function filtersToParams(filters: CatalogFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.category) params.set("category", filters.category);
  if (filters.furniline) params.set("furniline", filters.furniline);
  if (filters.rareOnly) params.set("rare", "true");
  if (!filters.tradeableOnly) params.set("tradeable", "false");
  if (filters.hotel !== HotelDomain.DE) params.set("hotel", filters.hotel);
  if (filters.sortField !== SortField.NAME) params.set("sort", filters.sortField);
  if (filters.sortDirection !== SortDirection.ASC) params.set("dir", filters.sortDirection);
  if (filters.page > 1) params.set("page", String(filters.page));
  return params;
}

function CatalogContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [allItems, setAllItems] = useState<FurniItem[]>([]);
  const [filters, setFilters] = useState<CatalogFilters>(() => filtersFromParams(searchParams));
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    const params = filtersToParams(filters);
    const paramStr = params.toString();
    router.replace(paramStr ? `/catalog?${paramStr}` : "/catalog", { scroll: false });
  }, [filters, router]);

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
        case SortField.PRICE: {
          const aScore = (a.rare ? 100000 : 0) + a.revision;
          const bScore = (b.rare ? 100000 : 0) + b.revision;
          return (aScore - bScore) * dir;
        }
        case SortField.VOLUME:
          return (a.revision - b.revision) * dir;
        case SortField.PRICE_CHANGE:
          return (a.revision - b.revision) * dir;
        case SortField.NAME:
        default:
          return a.name.localeCompare(b.name) * dir;
      }
    });

    return result;
  }, [allItems, filters]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE));

  const clampedPage = Math.min(filters.page, totalPages);
  useEffect(() => {
    if (filters.page > totalPages && totalPages > 0) {
      setFilters((prev) => ({ ...prev, page: 1 }));
    }
  }, [filters.page, totalPages]);

  const paginatedItems = filteredItems.slice(
    (clampedPage - 1) * ITEMS_PER_PAGE,
    clampedPage * ITEMS_PER_PAGE
  );

  function updateFilters(patch: Partial<CatalogFilters>) {
    const hasFilterChange = Object.keys(patch).some((k) => k !== "page");
    setFilters((prev) => ({
      ...prev,
      ...patch,
      ...(hasFilterChange && !("page" in patch) ? { page: 1 } : {}),
    }));
  }

  const hasActiveFilters =
    filters.search !== "" ||
    filters.category !== "" ||
    filters.furniline !== "" ||
    filters.rareOnly ||
    !filters.tradeableOnly;

  function clearAllFilters() {
    setFilters((prev) => ({
      ...DEFAULT_FILTERS,
      hotel: prev.hotel,
    }));
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Breadcrumbs segments={[{ label: t.nav.catalog }]} />
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-pixel)] text-lg text-habbo-gold pixel-text-shadow">
            {t.catalog.title}
          </h1>
          <p className="text-sm text-habbo-text-dim mt-1">
            {t.catalog.subtitle}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <PixelButton variant="ghost" size="sm" onClick={clearAllFilters}>
              Clear Filters
            </PixelButton>
          )}
          <div className="flex bg-habbo-card pixel-border rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-2.5 py-1.5 text-xs transition-colors ${
                viewMode === "grid"
                  ? "bg-habbo-cyan/20 text-habbo-cyan"
                  : "text-habbo-text-dim hover:text-habbo-text"
              }`}
              aria-label="Grid view"
            >
              <PixelIcon name="search" size="xs" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-2.5 py-1.5 text-xs transition-colors ${
                viewMode === "list"
                  ? "bg-habbo-cyan/20 text-habbo-cyan"
                  : "text-habbo-text-dim hover:text-habbo-text"
              }`}
              aria-label="List view"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
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
          <details className="md:hidden mb-4 bg-habbo-card pixel-border rounded-lg">
            <summary className="px-4 py-3 text-sm text-habbo-text-dim cursor-pointer">
              {t.catalog.filtersAndSort}
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

          <FurniGrid items={paginatedItems} loading={loading} viewMode={viewMode} />

          <Pagination
            currentPage={clampedPage}
            totalPages={totalPages}
            onPageChange={(page) => updateFilters({ page })}
          />
        </div>
      </div>
    </div>
  );
}
