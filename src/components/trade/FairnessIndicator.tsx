"use client";

import { TradeFairness } from "@/lib/types";
import { formatCredits } from "@/lib/utils";
import { PixelIcon } from "@/components/common/PixelIcon";
import { useLanguage } from "@/components/providers/LanguageProvider";

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

const fairnessConfig: Record<TradeFairness, { color: string; bg: string; glow: string; border: string }> = {
  [TradeFairness.FAIR]: {
    color: "text-habbo-green",
    bg: "bg-habbo-green/10",
    border: "border-habbo-green/30",
    glow: "shadow-[0_0_20px_rgba(61,214,140,0.2)]",
  },
  [TradeFairness.SLIGHT_EDGE]: {
    color: "text-habbo-gold",
    bg: "bg-habbo-gold/10",
    border: "border-habbo-gold/30",
    glow: "shadow-[0_0_20px_rgba(245,200,66,0.2)]",
  },
  [TradeFairness.UNFAIR]: {
    color: "text-habbo-red",
    bg: "bg-habbo-red/10",
    border: "border-habbo-red/30",
    glow: "shadow-[0_0_20px_rgba(255,71,87,0.2)]",
  },
};

export function FairnessIndicator({ giveTotal, receiveTotal, loading }: FairnessIndicatorProps) {
  const { t } = useLanguage();
  const hasValues = giveTotal > 0 || receiveTotal > 0;

  if (loading || !hasValues) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-4">
        <div className="w-14 h-14 rounded-xl bg-habbo-card border border-habbo-border flex items-center justify-center">
          <span className="text-habbo-text-dim"><PixelIcon name="trade" size="lg" /></span>
        </div>
        {loading && (
          <div className="w-4 h-4 border-2 border-habbo-cyan/20 border-t-habbo-cyan rounded-full animate-spin" />
        )}
      </div>
    );
  }

  const { fairness, diffPercent, diffAbsolute } = calculateFairness(giveTotal, receiveTotal);
  const config = fairnessConfig[fairness];

  const fairnessLabel =
    fairness === TradeFairness.FAIR
      ? t.trade.fairTrade
      : fairness === TradeFairness.SLIGHT_EDGE
        ? t.trade.slightEdge
        : t.trade.unfairTrade;

  return (
    <div className={`flex flex-col items-center gap-2 p-4 rounded-xl border ${config.bg} ${config.border} ${config.glow} transition-all duration-500`}>
      <div className={`w-10 h-10 rounded-lg ${config.bg} border ${config.border} flex items-center justify-center mb-1`}>
        <span className={config.color}><PixelIcon name="trade" size="md" /></span>
      </div>

      <div className={`font-[family-name:var(--font-pixel)] text-[10px] ${config.color} uppercase tracking-wider`}>
        {fairnessLabel}
      </div>

      <div className="flex items-center gap-1.5">
        <span className={`font-mono text-sm font-bold ${config.color}`}>
          {diffPercent.toFixed(1)}%
        </span>
      </div>

      {diffAbsolute > 0 && (
        <div className="text-[10px] text-habbo-text-dim text-center">
          {formatCredits(diffAbsolute)}c {t.trade.difference.toLowerCase()}
        </div>
      )}

      <div className="flex gap-1 mt-1">
        {[...Array(5)].map((_, i) => {
          const threshold = i * 10;
          const active = diffPercent >= threshold;
          return (
            <div
              key={i}
              className={`w-2.5 h-5 rounded-sm transition-all duration-300 ${
                active ? `${config.bg} border ${config.border}` : "bg-habbo-border/20"
              }`}
              style={active ? { backgroundColor: `color-mix(in srgb, currentColor 30%, transparent)` } : undefined}
            />
          );
        })}
      </div>
    </div>
  );
}
