"use client";

import { useMemo } from "react";
import { Line } from "react-chartjs-2";
import type { ChartOptions } from "chart.js";
import type { HistoryEntry } from "@/lib/types";
import { formatDate, formatCredits } from "@/lib/utils";
import { CHART_COLORS } from "@/lib/constants";
import { ensureChartRegistered } from "./ChartSetup";

interface CompareDataset {
  label: string;
  history: HistoryEntry[];
  color: string;
}

interface CompareChartProps {
  datasets: CompareDataset[];
  height?: number;
}

const PALETTE = [
  CHART_COLORS.primary,
  CHART_COLORS.secondary,
  CHART_COLORS.green,
  CHART_COLORS.red,
  CHART_COLORS.purple,
];

export function CompareChart({ datasets, height = 350 }: CompareChartProps) {
  ensureChartRegistered();

  const allTimestamps = useMemo(() => {
    const set = new Set<number>();
    datasets.forEach((ds) => ds.history.forEach((h) => set.add(h.timestamp)));
    return Array.from(set).sort((a, b) => a - b);
  }, [datasets]);

  const chartData = useMemo(
    () => ({
      labels: allTimestamps.map((t) => formatDate(t)),
      datasets: datasets.map((ds, idx) => {
        const priceMap = new Map(ds.history.map((h) => [h.timestamp, h.avgPrice]));
        return {
          label: ds.label,
          data: allTimestamps.map((t) => priceMap.get(t) ?? null),
          borderColor: ds.color || PALETTE[idx % PALETTE.length],
          backgroundColor: "transparent",
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 5,
          tension: 0.3,
          spanGaps: true,
        };
      }),
    }),
    [allTimestamps, datasets]
  );

  const options: ChartOptions<"line"> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: {
          display: true,
          labels: {
            color: CHART_COLORS.gridText,
            font: { size: 11 },
            usePointStyle: true,
            pointStyle: "circle",
          },
        },
        tooltip: {
          backgroundColor: "#1b2a4a",
          borderColor: CHART_COLORS.grid,
          borderWidth: 1,
          bodyFont: { family: "JetBrains Mono, monospace", size: 12 },
          padding: 10,
          callbacks: {
            label: (ctx) => {
              const val = ctx.parsed.y;
              if (val === null) return "";
              return `${ctx.dataset.label}: ${formatCredits(val)} credits`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: { color: CHART_COLORS.grid, lineWidth: 0.5 },
          ticks: { color: CHART_COLORS.gridText, font: { size: 10 }, maxTicksLimit: 12 },
        },
        y: {
          grid: { color: CHART_COLORS.grid, lineWidth: 0.5 },
          ticks: {
            color: CHART_COLORS.gridText,
            font: { size: 10, family: "JetBrains Mono, monospace" },
            callback: (val) => formatCredits(val as number),
          },
        },
      },
    }),
    []
  );

  return (
    <div style={{ height }}>
      <Line data={chartData} options={options} />
    </div>
  );
}
