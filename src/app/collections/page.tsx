"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { HotelDomain } from "@/lib/types";
import type { FurniItem } from "@/lib/types";
import { PixelCard } from "@/components/common/PixelCard";
import { PixelButton } from "@/components/common/PixelButton";
import { HotelSelector } from "@/components/common/HotelSelector";
import { FurniImage } from "@/components/common/FurniImage";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { PixelIcon } from "@/components/common/PixelIcon";
import { useFavorites } from "@/components/providers/FavoritesProvider";
import { usePortfolio } from "@/components/providers/PortfolioProvider";

interface FurnilineGroup {
  name: string;
  items: FurniItem[];
  rareCount: number;
  ownedCount: number;
}

export default function CollectionsPage() {
  const [hotel, setHotel] = useState<HotelDomain>(HotelDomain.DE);
  const [allItems, setAllItems] = useState<FurniItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [expandedLine, setExpandedLine] = useState<string | null>(null);
  const { favorites } = useFavorites();
  const { entries: portfolioEntries } = usePortfolio();

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/furnidata?hotel=${hotel}&tradeableOnly=false`);
        if (res.ok) {
          const data: FurniItem[] = await res.json();
          setAllItems(data);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [hotel]);

  const ownedSet = useMemo(() => {
    const set = new Set<string>();
    for (const f of favorites) set.add(f);
    for (const p of portfolioEntries) set.add(p.classname);
    return set;
  }, [favorites, portfolioEntries]);

  const collections = useMemo(() => {
    const groups = new Map<string, FurniItem[]>();
    for (const item of allItems) {
      const line = item.furniline || item.category;
      if (!line) continue;
      const list = groups.get(line) ?? [];
      list.push(item);
      groups.set(line, list);
    }

    const result: FurnilineGroup[] = [];
    for (const [name, items] of groups) {
      if (items.length < 2) continue;
      result.push({
        name,
        items: items.sort((a, b) => a.name.localeCompare(b.name)),
        rareCount: items.filter((i) => i.rare).length,
        ownedCount: items.filter((i) => ownedSet.has(i.classname)).length,
      });
    }

    return result.sort((a, b) => b.items.length - a.items.length);
  }, [allItems, ownedSet]);

  const filteredCollections = useMemo(() => {
    if (!filter) return collections;
    const q = filter.toLowerCase();
    return collections.filter((c) =>
      c.name.toLowerCase().includes(q) ||
      c.items.some((i) => i.name.toLowerCase().includes(q))
    );
  }, [collections, filter]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <Breadcrumbs segments={[{ label: "Collections" }]} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-pixel)] text-lg text-habbo-gold pixel-text-shadow">
            Furni Collections
          </h1>
          <p className="text-sm text-habbo-text-dim mt-1">
            Browse furniture grouped by collection line
          </p>
        </div>
        <HotelSelector value={hotel} onChange={setHotel} />
      </div>

      <div>
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter collections..."
          className="w-full max-w-sm px-3 py-2 bg-habbo-input border border-habbo-border rounded text-sm text-habbo-text placeholder:text-habbo-text-dim/50 focus:outline-none focus:border-habbo-cyan/50"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="h-32 bg-habbo-card pixel-border rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          <p className="text-xs text-habbo-text-dim">
            <span className="text-habbo-cyan font-mono font-bold">{filteredCollections.length}</span> collections found
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredCollections.map((collection) => (
              <div key={collection.name}>
                <PixelCard
                  className="p-4 cursor-pointer"
                  hover
                  onClick={() =>
                    setExpandedLine(
                      expandedLine === collection.name ? null : collection.name
                    )
                  }
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-[family-name:var(--font-pixel)] text-[10px] text-habbo-gold truncate">
                      {collection.name}
                    </h3>
                    <div className="flex gap-1.5 shrink-0">
                      {collection.rareCount > 0 && (
                        <span className="text-[8px] font-[family-name:var(--font-pixel)] px-1.5 py-0.5 bg-habbo-gold/15 text-habbo-gold rounded border border-habbo-gold/20">
                          {collection.rareCount} RARE
                        </span>
                      )}
                      <span className="text-[8px] font-[family-name:var(--font-pixel)] px-1.5 py-0.5 bg-habbo-cyan/15 text-habbo-cyan rounded border border-habbo-cyan/20">
                        {collection.items.length}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-1 mb-2">
                    {collection.items.slice(0, 6).map((item) => (
                      <div
                        key={item.classname}
                        className="w-8 h-8 flex items-center justify-center bg-habbo-bg/40 rounded"
                      >
                        <FurniImage classname={item.classname} alt={item.name} size="sm" />
                      </div>
                    ))}
                    {collection.items.length > 6 && (
                      <div className="w-8 h-8 flex items-center justify-center bg-habbo-bg/40 rounded text-[9px] text-habbo-text-dim">
                        +{collection.items.length - 6}
                      </div>
                    )}
                  </div>

                  {collection.ownedCount > 0 && (
                    <div className="flex items-center gap-1.5">
                      <div
                        className="h-1 rounded-full bg-habbo-green/30 flex-1"
                      >
                        <div
                          className="h-full rounded-full bg-habbo-green transition-all"
                          style={{
                            width: `${Math.min(100, (collection.ownedCount / collection.items.length) * 100)}%`,
                          }}
                        />
                      </div>
                      <span className="text-[9px] text-habbo-green font-mono shrink-0">
                        {collection.ownedCount}/{collection.items.length}
                      </span>
                    </div>
                  )}
                </PixelCard>

                {expandedLine === collection.name && (
                  <div className="mt-1 bg-habbo-card/50 rounded-lg p-3 grid grid-cols-3 sm:grid-cols-4 gap-2 animate-slide-up">
                    {collection.items.map((item) => (
                      <Link
                        key={item.classname}
                        href={`/furni/${encodeURIComponent(item.classname)}`}
                        className={`group text-center p-2 rounded-lg transition-colors ${
                          ownedSet.has(item.classname)
                            ? "bg-habbo-green/10 border border-habbo-green/20"
                            : "hover:bg-habbo-card/80"
                        }`}
                      >
                        <div className="w-full h-10 flex items-center justify-center mb-1">
                          <FurniImage
                            classname={item.classname}
                            alt={item.name}
                            size="sm"
                            className="group-hover:scale-110 transition-transform"
                          />
                        </div>
                        <div className="text-[9px] text-habbo-text-dim truncate group-hover:text-habbo-cyan transition-colors">
                          {item.name}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
