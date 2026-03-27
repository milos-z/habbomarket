"use client";

import type { ArbitrageResult } from "@/lib/types";
import { ArbitrageDirection } from "@/lib/types";
import { formatCredits } from "@/lib/utils";
import { FurniImage } from "@/components/common/FurniImage";
import Link from "next/link";

type SortKey = "name" | "difference" | "differencePercent" | "comVolume" | "deVolume";

interface ArbitrageTableProps {
  results: ArbitrageResult[];
  sortKey: SortKey;
  sortAsc: boolean;
  onSort: (key: SortKey) => void;
  comPriceLabel: string;
  dePriceLabel: string;
  diffLabel: string;
  directionLabel: string;
  buyOnComLabel: string;
  buyOnDeLabel: string;
}

export function ArbitrageTable({
  results,
  sortKey,
  sortAsc,
  onSort,
  comPriceLabel,
  dePriceLabel,
  diffLabel,
  directionLabel,
  buyOnComLabel,
  buyOnDeLabel,
}: ArbitrageTableProps) {
  const sorted = [...results].sort((a, b) => {
    const mul = sortAsc ? 1 : -1;
    switch (sortKey) {
      case "name":
        return mul * a.name.localeCompare(b.name);
      case "difference":
        return mul * (a.difference - b.difference);
      case "differencePercent":
        return mul * (a.differencePercent - b.differencePercent);
      case "comVolume":
        return mul * (a.comVolume - b.comVolume);
      case "deVolume":
        return mul * (a.deVolume - b.deVolume);
      default:
        return 0;
    }
  });

  function SortHeader({ label, field }: { label: string; field: SortKey }) {
    const active = sortKey === field;
    return (
      <button
        onClick={() => onSort(field)}
        className={`text-xs font-normal flex items-center gap-1 transition-colors ${
          active ? "text-habbo-cyan" : "text-habbo-text-dim hover:text-habbo-text"
        }`}
      >
        {label}
        {active && <span>{sortAsc ? "↑" : "↓"}</span>}
      </button>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-habbo-border">
            <th className="text-left py-2 px-2">
              <SortHeader label="Item" field="name" />
            </th>
            <th className="text-right py-2 px-2">
              <SortHeader label={comPriceLabel} field="comVolume" />
            </th>
            <th className="text-right py-2 px-2">
              <SortHeader label={dePriceLabel} field="deVolume" />
            </th>
            <th className="text-right py-2 px-2">
              <SortHeader label={diffLabel} field="differencePercent" />
            </th>
            <th className="text-center py-2 px-2 text-xs text-habbo-text-dim font-normal">
              {directionLabel}
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((r) => (
            <tr key={r.classname} className="border-b border-habbo-border/50 group hover:bg-habbo-card/50 transition-colors">
              <td className="py-2 px-2">
                <Link
                  href={`/furni/${encodeURIComponent(r.classname)}`}
                  className="flex items-center gap-2 hover:text-habbo-cyan transition-colors"
                >
                  <FurniImage classname={r.classname} alt={r.name} size="sm" />
                  <span className="text-xs text-habbo-text truncate max-w-[140px]">
                    {r.name}
                  </span>
                </Link>
              </td>
              <td className="text-right py-2 px-2">
                <div className="text-xs font-mono text-habbo-cyan">{formatCredits(r.comPrice)}c</div>
                <div className="text-[10px] font-mono text-habbo-text-dim">vol: {r.comVolume}</div>
              </td>
              <td className="text-right py-2 px-2">
                <div className="text-xs font-mono text-habbo-cyan">{formatCredits(r.dePrice)}c</div>
                <div className="text-[10px] font-mono text-habbo-text-dim">vol: {r.deVolume}</div>
              </td>
              <td className="text-right py-2 px-2">
                <div className={`text-xs font-mono font-bold ${r.differencePercent >= 20 ? "text-habbo-green" : "text-habbo-gold"}`}>
                  {r.differencePercent.toFixed(1)}%
                </div>
                <div className="text-[10px] font-mono text-habbo-text-dim">
                  {formatCredits(r.difference)}c
                </div>
              </td>
              <td className="text-center py-2 px-2">
                <span
                  className={`text-[9px] px-2 py-0.5 rounded font-medium ${
                    r.direction === ArbitrageDirection.BUY_COM_SELL_DE
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-purple-500/20 text-purple-400"
                  }`}
                >
                  {r.direction === ArbitrageDirection.BUY_COM_SELL_DE
                    ? buyOnComLabel
                    : buyOnDeLabel}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
