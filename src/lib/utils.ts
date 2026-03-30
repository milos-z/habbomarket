export function formatCredits(amount: number): string {
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (amount >= 1_000) {
    return `${(amount / 1_000).toFixed(1)}K`;
  }
  return amount.toLocaleString();
}

export function formatPrice(amount: number, naLabel = "N/A"): string {
  if (amount <= 0) return naLabel;
  return `${formatCredits(amount)}c`;
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function formatFullDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function calculatePriceChange(
  history: { avgPrice: number }[]
): { value: number; percentage: number } | null {
  if (history.length < 2) return null;
  const recent = history[history.length - 1].avgPrice;
  const previous = history[history.length - 2].avgPrice;
  if (previous === 0) return null;
  const value = recent - previous;
  const percentage = ((value / previous) * 100);
  return { value, percentage };
}

export function furniImageUrl(classname: string, revision?: number): string {
  const base = `/api/image/${encodeURIComponent(classname)}`;
  return revision ? `${base}?rev=${revision}` : base;
}

export function debounce<T extends (...args: Parameters<T>) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function exportToJSON(filename: string, data: unknown): void {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.json`;
  a.click();
  URL.revokeObjectURL(url);

  import("@/components/common/Toast").then(({ showToast }) => {
    showToast(`Exported ${filename}.json`, "success");
  });
}

export function importFromJSON<T>(accept = ".json"): Promise<T> {
  return new Promise((resolve, reject) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept;
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) {
        reject(new Error("No file selected"));
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result as string) as T;
          resolve(data);
        } catch {
          reject(new Error("Invalid JSON file"));
        }
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsText(file);
    };
    input.click();
  });
}

export function exportToCSV(
  filename: string,
  headers: string[],
  rows: (string | number)[][]
): void {
  const escape = (val: string | number) => {
    const str = String(val);
    return str.includes(",") || str.includes('"')
      ? `"${str.replace(/"/g, '""')}"`
      : str;
  };
  const csv = [
    headers.map(escape).join(","),
    ...rows.map((row) => row.map(escape).join(",")),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);

  import("@/components/common/Toast").then(({ showToast }) => {
    showToast(`Exported ${filename}.csv`, "success");
  });
}
