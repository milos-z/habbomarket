"use client";

import { useState, useEffect } from "react";
import { PixelCard } from "@/components/common/PixelCard";
import { PixelButton } from "@/components/common/PixelButton";
import { FurniImage } from "@/components/common/FurniImage";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { PixelIcon } from "@/components/common/PixelIcon";
import { showToast } from "@/components/common/Toast";
import { formatCredits, exportToCSV } from "@/lib/utils";
import {
  loadTradeHistory,
  removeTradeFromHistory,
  clearTradeHistory,
  type SavedTrade,
} from "@/lib/trade-history";

export default function HistoryPage() {
  const [trades, setTrades] = useState<SavedTrade[]>([]);

  useEffect(() => {
    setTrades(loadTradeHistory());
  }, []);

  function handleRemove(id: string) {
    removeTradeFromHistory(id);
    setTrades((prev) => prev.filter((t) => t.id !== id));
    showToast("Trade removed", "info");
  }

  function handleClearAll() {
    clearTradeHistory();
    setTrades([]);
    showToast("Trade history cleared", "info");
  }

  function handleExportCSV() {
    const headers = [
      "Date",
      "Give Items",
      "Give Credits",
      "Give Total",
      "Receive Items",
      "Receive Credits",
      "Receive Total",
    ];
    const rows = trades.map((t) => [
      new Date(t.timestamp).toLocaleDateString(),
      t.giveItems.map((i) => `${i.name} x${i.quantity}`).join("; "),
      t.giveCredits,
      t.giveTotal,
      t.receiveItems.map((i) => `${i.name} x${i.quantity}`).join("; "),
      t.receiveCredits,
      t.receiveTotal,
    ]);
    exportToCSV("habbomarket-trade-history", headers, rows);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <Breadcrumbs segments={[{ label: "Trade History" }]} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-pixel)] text-lg text-habbo-gold pixel-text-shadow">
            Trade History
          </h1>
          <p className="text-sm text-habbo-text-dim mt-1">
            Your saved trades and their values at time of recording
          </p>
        </div>
        {trades.length > 0 && (
          <div className="flex items-center gap-2">
            <PixelButton variant="ghost" size="sm" onClick={handleExportCSV}>
              Export CSV
            </PixelButton>
            <PixelButton variant="ghost" size="sm" onClick={handleClearAll}>
              Clear All
            </PixelButton>
          </div>
        )}
      </div>

      {trades.length === 0 ? (
        <PixelCard className="p-8 text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-habbo-card border border-habbo-border flex items-center justify-center">
            <PixelIcon name="trade" size="lg" className="text-habbo-text-dim" />
          </div>
          <h3 className="font-[family-name:var(--font-pixel)] text-sm text-habbo-text-dim mb-2">
            No trades saved yet
          </h3>
          <p className="text-xs text-habbo-text-dim/60">
            Save trades from the Trade Calculator to see them here.
          </p>
        </PixelCard>
      ) : (
        <div className="space-y-3">
          {trades.map((trade) => (
            <PixelCard key={trade.id} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <PixelIcon name="trade" size="sm" className="text-habbo-gold" />
                  <span className="text-xs text-habbo-text-dim">
                    {new Date(trade.timestamp).toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={() => handleRemove(trade.id)}
                  className="text-habbo-text-dim hover:text-habbo-red transition-colors text-xs"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-3">
                {/* Give Side */}
                <div className="bg-habbo-red/5 rounded-lg p-3 border border-habbo-red/10">
                  <div className="text-[9px] font-[family-name:var(--font-pixel)] text-habbo-red uppercase mb-2">
                    Give
                  </div>
                  {trade.giveItems.map((item) => (
                    <div key={item.classname} className="flex items-center gap-2 mb-1">
                      <FurniImage classname={item.classname} alt={item.name} size="sm" />
                      <span className="text-[10px] text-habbo-text truncate flex-1">{item.name}</span>
                      <span className="text-[10px] font-mono text-habbo-text-dim">x{item.quantity}</span>
                    </div>
                  ))}
                  {trade.giveCredits > 0 && (
                    <div className="text-[10px] font-mono text-habbo-gold mt-1">
                      +{formatCredits(trade.giveCredits)}c credits
                    </div>
                  )}
                  <div className="mt-2 pt-2 border-t border-habbo-border/30 text-xs font-mono font-bold text-habbo-red">
                    Total: {formatCredits(trade.giveTotal)}c
                  </div>
                </div>

                {/* Arrow */}
                <div className="hidden md:flex items-center justify-center">
                  <svg className="w-5 h-5 text-habbo-text-dim" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>

                {/* Receive Side */}
                <div className="bg-habbo-green/5 rounded-lg p-3 border border-habbo-green/10">
                  <div className="text-[9px] font-[family-name:var(--font-pixel)] text-habbo-green uppercase mb-2">
                    Receive
                  </div>
                  {trade.receiveItems.map((item) => (
                    <div key={item.classname} className="flex items-center gap-2 mb-1">
                      <FurniImage classname={item.classname} alt={item.name} size="sm" />
                      <span className="text-[10px] text-habbo-text truncate flex-1">{item.name}</span>
                      <span className="text-[10px] font-mono text-habbo-text-dim">x{item.quantity}</span>
                    </div>
                  ))}
                  {trade.receiveCredits > 0 && (
                    <div className="text-[10px] font-mono text-habbo-gold mt-1">
                      +{formatCredits(trade.receiveCredits)}c credits
                    </div>
                  )}
                  <div className="mt-2 pt-2 border-t border-habbo-border/30 text-xs font-mono font-bold text-habbo-green">
                    Total: {formatCredits(trade.receiveTotal)}c
                  </div>
                </div>
              </div>
            </PixelCard>
          ))}
        </div>
      )}
    </div>
  );
}
