"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { HotelDomain, AlertDirection } from "@/lib/types";
import type { FurniItem } from "@/lib/types";
import { debounce } from "@/lib/utils";
import { FurniImage } from "@/components/common/FurniImage";
import { PixelCard } from "@/components/common/PixelCard";
import { PixelButton } from "@/components/common/PixelButton";
import { HotelSelector } from "@/components/common/HotelSelector";
import { useAlerts } from "@/components/providers/AlertsProvider";
import type { Translations } from "@/lib/i18n";

interface CreateAlertFormProps {
  t: Translations;
}

export function CreateAlertForm({ t }: CreateAlertFormProps) {
  const { addAlert } = useAlerts();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FurniItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<FurniItem | null>(null);
  const [targetPrice, setTargetPrice] = useState<number>(0);
  const [direction, setDirection] = useState<AlertDirection>(AlertDirection.BELOW);
  const [hotel, setHotel] = useState<HotelDomain>(HotelDomain.COM);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const search = useCallback(
    debounce(async (term: string) => {
      if (term.length < 2) {
        setResults([]);
        return;
      }
      setSearchLoading(true);
      try {
        const res = await fetch(
          `/api/furnidata?hotel=${HotelDomain.COM}&search=${encodeURIComponent(term)}&limit=8`
        );
        if (res.ok) {
          const data: FurniItem[] = await res.json();
          setResults(data);
        }
      } finally {
        setSearchLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    search(query);
  }, [query, search]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(item: FurniItem) {
    setSelectedItem(item);
    setQuery("");
    setIsOpen(false);
    setResults([]);
  }

  function handleSubmit() {
    if (!selectedItem || targetPrice <= 0) return;

    addAlert({
      classname: selectedItem.classname,
      name: selectedItem.name,
      targetPrice,
      direction,
      hotel,
    });

    setSelectedItem(null);
    setTargetPrice(0);
  }

  return (
    <PixelCard className="p-4 space-y-4">
      <h2 className="font-[family-name:var(--font-pixel)] text-[10px] text-habbo-text uppercase tracking-wider">
        {t.alerts.createAlert}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_120px_120px_auto_auto] gap-3 items-end">
        <div>
          <label className="block text-[10px] text-habbo-text-dim uppercase mb-1">
            {t.compare.item}
          </label>
          {selectedItem ? (
            <div className="flex items-center gap-2 bg-habbo-input border border-habbo-border rounded px-3 py-2">
              <FurniImage classname={selectedItem.classname} alt={selectedItem.name} size="sm" />
              <span className="text-xs text-habbo-text truncate flex-1">{selectedItem.name}</span>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-habbo-text-dim hover:text-habbo-red text-xs"
              >
                ×
              </button>
            </div>
          ) : (
            <div ref={wrapperRef} className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setIsOpen(true);
                }}
                onFocus={() => setIsOpen(true)}
                placeholder={t.trade.searchToAdd}
                className="w-full bg-habbo-input border border-habbo-border rounded text-xs text-habbo-text py-2 px-3 focus:outline-none focus:border-habbo-cyan/50"
              />
              {searchLoading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 border-2 border-habbo-cyan/30 border-t-habbo-cyan rounded-full animate-spin" />
              )}
              {isOpen && results.length > 0 && query.length >= 2 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-habbo-nav border border-habbo-border rounded-lg shadow-2xl overflow-hidden z-50 max-h-48 overflow-y-auto animate-slide-up">
                  {results.map((item) => (
                    <button
                      key={item.classname}
                      onClick={() => handleSelect(item)}
                      className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-habbo-card transition-colors text-left"
                    >
                      <FurniImage classname={item.classname} alt={item.name} size="sm" />
                      <span className="text-xs text-habbo-text truncate flex-1">{item.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div>
          <label className="block text-[10px] text-habbo-text-dim uppercase mb-1">
            {t.alerts.targetPrice}
          </label>
          <input
            type="number"
            value={targetPrice || ""}
            onChange={(e) => setTargetPrice(parseInt(e.target.value) || 0)}
            placeholder="0"
            className="w-full bg-habbo-input border border-habbo-border rounded text-xs text-habbo-text py-2 px-3 focus:outline-none focus:border-habbo-cyan/50"
            min={1}
          />
        </div>

        <div>
          <label className="block text-[10px] text-habbo-text-dim uppercase mb-1">
            {t.alerts.direction}
          </label>
          <div className="flex rounded overflow-hidden border border-habbo-border">
            <button
              onClick={() => setDirection(AlertDirection.BELOW)}
              className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
                direction === AlertDirection.BELOW
                  ? "bg-habbo-green/20 text-habbo-green"
                  : "bg-habbo-card text-habbo-text-dim"
              }`}
            >
              {t.alerts.below}
            </button>
            <button
              onClick={() => setDirection(AlertDirection.ABOVE)}
              className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
                direction === AlertDirection.ABOVE
                  ? "bg-habbo-red/20 text-habbo-red"
                  : "bg-habbo-card text-habbo-text-dim"
              }`}
            >
              {t.alerts.above}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-[10px] text-habbo-text-dim uppercase mb-1">
            {t.filters.hotel}
          </label>
          <HotelSelector value={hotel} onChange={setHotel} />
        </div>

        <div className="flex items-end">
          <PixelButton
            variant="primary"
            onClick={handleSubmit}
            disabled={!selectedItem || targetPrice <= 0}
          >
            + {t.alerts.createAlert}
          </PixelButton>
        </div>
      </div>
    </PixelCard>
  );
}
