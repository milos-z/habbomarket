"use client";

import { HotelDomain } from "@/lib/types";
import { HOTELS } from "@/lib/constants";

interface HotelSelectorProps {
  value: HotelDomain;
  onChange: (hotel: HotelDomain) => void;
  compact?: boolean;
}

const PRIMARY_HOTELS = [HotelDomain.DE, HotelDomain.COM];

export function HotelSelector({ value, onChange, compact = false }: HotelSelectorProps) {
  if (compact) {
    return (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as HotelDomain)}
        className="px-3 py-1.5 bg-habbo-input border border-habbo-border rounded text-xs text-habbo-text focus:outline-none focus:border-habbo-cyan/50"
      >
        {Object.values(HOTELS).map((hotel) => (
          <option key={hotel.domain} value={hotel.domain}>
            {hotel.flag} {hotel.label}
          </option>
        ))}
      </select>
    );
  }

  return (
    <div className="flex flex-wrap gap-1">
      <div className="flex rounded overflow-hidden border border-habbo-border">
        {PRIMARY_HOTELS.map((domain) => {
          const hotel = HOTELS[domain];
          return (
            <button
              key={hotel.domain}
              onClick={() => onChange(hotel.domain)}
              className={`
                px-3 py-1.5 text-xs font-medium transition-colors
                ${
                  value === hotel.domain
                    ? "bg-habbo-cyan/20 text-habbo-cyan"
                    : "bg-habbo-card text-habbo-text-dim hover:text-habbo-text"
                }
              `}
            >
              <span className="font-mono text-[10px] font-bold mr-1 opacity-70">{hotel.flag}</span>
              {hotel.label}
            </button>
          );
        })}
      </div>
      <select
        value={PRIMARY_HOTELS.includes(value) ? "" : value}
        onChange={(e) => {
          if (e.target.value) onChange(e.target.value as HotelDomain);
        }}
        className={`px-2 py-1.5 bg-habbo-input border border-habbo-border rounded text-xs focus:outline-none focus:border-habbo-cyan/50 ${
          !PRIMARY_HOTELS.includes(value)
            ? "text-habbo-cyan border-habbo-cyan/30"
            : "text-habbo-text-dim"
        }`}
      >
        <option value="">More...</option>
        {Object.values(HOTELS)
          .filter((h) => !PRIMARY_HOTELS.includes(h.domain))
          .map((hotel) => (
            <option key={hotel.domain} value={hotel.domain}>
              {hotel.flag} {hotel.label}
            </option>
          ))}
      </select>
    </div>
  );
}
