"use client";

import { TradeFairness } from "@/lib/types";
import { formatCredits } from "@/lib/utils";

interface FairnessIndicatorProps {
  giveTotal: number;
  receiveTotal: number;
  loading: boolean;
}

function calculateFairness(giveTotal: number, receiveTotal: number): {
  fairness: TradeFairness;
  diffPercent: number;
  diffAbsolute: number;
} {
  if (giveTotal === 0 && receiveTotal === 0) {
    return { fairness: TradeFairness.FAIR, diffPercent: 0, diffAbsolute: 0 };
  }

  const max = Math.max(giveTotal, receiveTotal);
  const diffAbsolute = Math.abs(giveTotal - receiveTotal);
  const diffPercent = max > 0 ? (diffAbsolute / max) * 100 : 0;

  if (diffPercent < 10) {
    return { fairness: TradeFairness.FAIR, diffPercent, diffAbsolute };
  }
  if (diffPercent < 25) {
    return { fairness: TradeFairness.SLIGHT_EDGE, diffPercent, diffAbsolute };
  }
  return { fairness: TradeFairness.UNFAIR, diffPercent, diffAbsolute };
}

const fairnessConfig: Record<TradeFairness, { color: string; bg: string; glow: string }> = {
  [TradeFairness.FAIR]: {
    color: "text-habbo-green",
    bg: "bg-habbo-green/20 border-habbo-green/40",
    glow: "shadow-[0_0_20px_rgba(61,214,140,0.3)]",
  },
  [TradeFairness.SLIGHT_EDGE]: {
    color: "text-habbo-gold",
    bg: "bg-habbo-gold/20 border-habbo-gold/40",
    glow: "shadow-[0_0_20px_rgba(245,200,66,0.3)]",
  },
  [TradeFairness.UNFAIR]: {
    color: "text-habbo-red",
    bg: "bg-habbo-red/20 border-habbo-red/40",
    glow: "shadow-[0_0_20px_rgba(255,71,87,0.3)]",
  },
};

export function FairnessIndicator({ giveTotal, receiveTotal, loading }: FairnessIndicatorProps) {
  const hasValues = giveTotal > 0 || receiveTotal > 0;

  if (loading || !hasValues) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-4">
        <div className="w-12 h-12 rounded-full bg-habbo-card border border-habbo-border flex items-center justify-center">
          <span className="text-habbo-text-dim text-lg">?</span>
        </div>
        {loading && (
          <div className="w-4 h-4 border-2 border-habbo-cyan/20 border-t-habbo-cyan rounded-full animate-spin" />
        )}
      </div>
    );
  }

  const { fairness, diffPercent, diffAbsolute } = calculateFairness(giveTotal, receiveTotal);
  const config = fairnessConfig[fairness];
  const edgeSide = giveTotal > receiveTotal ? "give" : "receive";

  return (
    <div className={`flex flex-col items-center gap-2 p-3 rounded-lg border ${config.bg} ${config.glow} transition-all duration-500`}>
      <div className={`font-[family-name:var(--font-pixel)] text-[10px] ${config.color} uppercase tracking-wider`}>
        {fairness === TradeFairness.FAIR && "Fair Trade"}
        {fairness === TradeFairness.SLIGHT_EDGE && "Slight Edge"}
        {fairness === TradeFairness.UNFAIR && "Unfair"}
      </div>

      <div className="flex items-center gap-1.5">
        <span className={`font-mono text-sm font-bold ${config.color}`}>
          {diffPercent.toFixed(1)}%
        </span>
      </div>

      {diffAbsolute > 0 && (
        <div className="text-[10px] text-habbo-text-dim text-center">
          {formatCredits(diffAbsolute)}c {edgeSide === "give" ? "overpay" : "profit"}
        </div>
      )}

      <div className="flex gap-0.5 mt-1">
        {[...Array(5)].map((_, i) => {
          const threshold = i * 10;
          const active = diffPercent >= threshold;
          return (
            <div
              key={i}
              className={`w-2 h-4 rounded-sm transition-all duration-300 ${
                active ? config.bg.replace("/20", "/60") : "bg-habbo-border/30"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
