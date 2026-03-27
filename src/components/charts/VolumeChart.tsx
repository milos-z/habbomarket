"use client";

import { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import type { ChartOptions } from "chart.js";
import type { HistoryEntry } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { CHART_COLORS } from "@/lib/constants";
import { ensureChartRegistered } from "./ChartSetup";

interface VolumeChartProps {
  history: HistoryEntry[];
  height?: number;
  label?: string;
}

export function VolumeChart({ history, height = 200, label = "Items Sold" }: VolumeChartProps) {
  ensureChartRegistered();

  const data = useMemo(
    () => ({
      labels: history.map((h) => formatDate(h.timestamp)),
      datasets: [
        {
          label,
          data: history.map((h) => h.soldItems),
          backgroundColor: `${CHART_COLORS.secondary}60`,
          borderColor: CHART_COLORS.secondary,
          borderWidth: 1,
          borderRadius: 2,
        },
      ],
    }),
    [history]
  );

  const options: ChartOptions<"bar"> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#1b2a4a",
          borderColor: CHART_COLORS.grid,
          borderWidth: 1,
          bodyFont: { family: "JetBrains Mono, monospace", size: 12 },
          padding: 10,
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: CHART_COLORS.gridText, font: { size: 10 }, maxTicksLimit: 10 },
        },
        y: {
          grid: { color: CHART_COLORS.grid, lineWidth: 0.5 },
          ticks: {
            color: CHART_COLORS.gridText,
            font: { size: 10, family: "JetBrains Mono, monospace" },
          },
        },
      },
    }),
    []
  );

  return (
    <div style={{ height }}>
      <Bar data={data} options={options} />
    </div>
  );
}
