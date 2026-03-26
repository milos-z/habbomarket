"use client";

import { HotelDomain } from "@/lib/types";
import { HOTELS } from "@/lib/constants";

interface HotelSelectorProps {
  value: HotelDomain;
  onChange: (hotel: HotelDomain) => void;
}

export function HotelSelector({ value, onChange }: HotelSelectorProps) {
  return (
    <div className="flex rounded overflow-hidden border border-habbo-border">
      {Object.values(HOTELS).map((hotel) => (
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
          {hotel.flag} {hotel.label}
        </button>
      ))}
    </div>
  );
}
