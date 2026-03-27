"use client";

interface ScanProgressProps {
  scanned: number;
  total: number;
  found: number;
  scanning: boolean;
  scannedLabel: string;
  opportunitiesLabel: string;
}

export function ScanProgress({
  scanned,
  total,
  found,
  scanning,
  scannedLabel,
  opportunitiesLabel,
}: ScanProgressProps) {
  const percent = total > 0 ? Math.round((scanned / total) * 100) : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-habbo-text-dim">
          {scanned}/{total} {scannedLabel}
        </span>
        <span className="text-habbo-gold font-mono font-bold">
          {found} {opportunitiesLabel}
        </span>
      </div>
      <div className="w-full h-2 bg-habbo-border/30 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-habbo-cyan to-habbo-gold rounded-full transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
      {scanning && (
        <div className="flex items-center gap-2 text-xs text-habbo-cyan">
          <div className="w-3 h-3 border-2 border-habbo-cyan/30 border-t-habbo-cyan rounded-full animate-spin" />
          <span className="font-mono">{percent}%</span>
        </div>
      )}
    </div>
  );
}
