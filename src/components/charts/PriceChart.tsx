"use client";

import { useMemo } from "react";
import { Line } from "react-chartjs-2";
import type { ChartOptions } from "chart.js";
import type { HistoryEntry } from "@/lib/types";
import { formatDate, formatCredits } from "@/lib/utils";
import { CHART_COLORS } from "@/lib/constants";
import { ensureChartRegistered } from "./ChartSetup";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface PriceChartProps {
  history: HistoryEntry[];
  label?: string;
  color?: string;
  height?: number;
}

export function PriceChart({
  history,
  label,
  color = CHART_COLORS.primary,
  height = 300,
}: PriceChartProps) {
  ensureChartRegistered();
  const { t } = useLanguage();
  const chartLabel = label ?? t.furniDetail.avgPrice;

  const data = useMemo(
    () => ({
      labels: history.map((h) => formatDate(h.timestamp)),
      datasets: [
        {
          label: chartLabel,
          data: history.map((h) => h.avgPrice),
          borderColor: color,
          backgroundColor: `${color}20`,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: color,
          fill: true,
          tension: 0.3,
        },
      ],
    }),
    [history, chartLabel, color]
  );

  const creditsWord = t.furniDetail.credits;

  const options: ChartOptions<"line"> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#1b2a4a",
          borderColor: CHART_COLORS.grid,
          borderWidth: 1,
          titleFont: { size: 11 },
          bodyFont: { family: "JetBrains Mono, monospace", size: 12 },
          padding: 10,
          callbacks: {
            label: (ctx) => `${ctx.dataset.label}: ${formatCredits(ctx.parsed.y ?? 0)} ${creditsWord}`,
          },
        },
      },
      scales: {
        x: {
          grid: { color: CHART_COLORS.grid, lineWidth: 0.5 },
          ticks: { color: CHART_COLORS.gridText, font: { size: 10 }, maxTicksLimit: 10 },
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
    [creditsWord]
  );

  return (
    <div style={{ height }}>
      <Line data={data} options={options} />
    </div>
  );
}
