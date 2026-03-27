export function formatCredits(amount: number): string {
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (amount >= 1_000) {
    return `${(amount / 1_000).toFixed(1)}K`;
  }
  return amount.toLocaleString();
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

export function furniImageUrl(classname: string): string {
  return `/api/image/${encodeURIComponent(classname)}`;
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
}
