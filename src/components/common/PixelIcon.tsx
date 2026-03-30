"use client";

type IconSize = "xs" | "sm" | "md" | "lg" | "xl";

const sizeMap: Record<IconSize, string> = {
  xs: "w-3 h-3",
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
  xl: "w-8 h-8",
};

interface PixelIconProps {
  name: PixelIconName;
  size?: IconSize;
  className?: string;
}

export type PixelIconName =
  | "chair" | "table" | "bed" | "lighting" | "shelf" | "rug"
  | "teleport" | "wall" | "other" | "divider"
  | "pets" | "gate" | "roller"
  | "games" | "music" | "trophy" | "food" | "floor" | "vending_machine"
  | "trade" | "arbitrage" | "alerts" | "search"
  | "box" | "heart" | "heart-outline" | "chart-down" | "chart-up"
  | "compare" | "star" | "credits";

const icons: Record<PixelIconName, (color: string) => React.ReactNode> = {
  chair: (c) => (
    <svg viewBox="0 0 16 16" fill="none" className={c}>
      <rect x="3" y="2" width="10" height="3" rx="1" fill="currentColor" opacity="0.9" />
      <rect x="4" y="5" width="8" height="2" fill="currentColor" opacity="0.7" />
      <rect x="3" y="7" width="10" height="1" fill="currentColor" />
      <rect x="3" y="8" width="2" height="6" fill="currentColor" opacity="0.8" />
      <rect x="11" y="8" width="2" height="6" fill="currentColor" opacity="0.8" />
    </svg>
  ),
  table: (c) => (
    <svg viewBox="0 0 16 16" fill="none" className={c}>
      <rect x="1" y="5" width="14" height="2" rx="1" fill="currentColor" />
      <rect x="2" y="7" width="2" height="7" fill="currentColor" opacity="0.8" />
      <rect x="12" y="7" width="2" height="7" fill="currentColor" opacity="0.8" />
      <rect x="1" y="4" width="14" height="1" fill="currentColor" opacity="0.5" />
    </svg>
  ),
  bed: (c) => (
    <svg viewBox="0 0 16 16" fill="none" className={c}>
      <rect x="1" y="4" width="14" height="2" rx="1" fill="currentColor" opacity="0.6" />
      <rect x="1" y="6" width="14" height="4" rx="1" fill="currentColor" />
      <rect x="1" y="10" width="2" height="3" fill="currentColor" opacity="0.7" />
      <rect x="13" y="10" width="2" height="3" fill="currentColor" opacity="0.7" />
      <rect x="2" y="2" width="4" height="3" rx="1" fill="currentColor" opacity="0.8" />
    </svg>
  ),
  lighting: (c) => (
    <svg viewBox="0 0 16 16" fill="none" className={c}>
      <path d="M5 2h6l2 6H3L5 2z" fill="currentColor" opacity="0.9" />
      <rect x="7" y="8" width="2" height="4" fill="currentColor" opacity="0.7" />
      <rect x="5" y="12" width="6" height="2" rx="1" fill="currentColor" />
      <rect x="6" y="0" width="4" height="1" fill="currentColor" opacity="0.4" />
    </svg>
  ),
  shelf: (c) => (
    <svg viewBox="0 0 16 16" fill="none" className={c}>
      <rect x="1" y="1" width="2" height="14" fill="currentColor" opacity="0.8" />
      <rect x="13" y="1" width="2" height="14" fill="currentColor" opacity="0.8" />
      <rect x="1" y="1" width="14" height="2" fill="currentColor" />
      <rect x="1" y="7" width="14" height="2" fill="currentColor" />
      <rect x="1" y="13" width="14" height="2" fill="currentColor" />
    </svg>
  ),
  rug: (c) => (
    <svg viewBox="0 0 16 16" fill="none" className={c}>
      <rect x="1" y="4" width="14" height="8" rx="1" fill="currentColor" opacity="0.7" />
      <rect x="3" y="6" width="10" height="4" rx="1" fill="currentColor" opacity="0.4" />
      <rect x="5" y="7" width="6" height="2" fill="currentColor" opacity="0.6" />
    </svg>
  ),
  games: (c) => (
    <svg viewBox="0 0 16 16" fill="none" className={c}>
      <rect x="2" y="5" width="12" height="8" rx="2" fill="currentColor" opacity="0.7" />
      <circle cx="5" cy="9" r="1.5" fill="currentColor" opacity="0.4" />
      <circle cx="11" cy="9" r="1.5" fill="currentColor" opacity="0.4" />
      <rect x="7" y="7" width="2" height="4" rx="1" fill="currentColor" opacity="0.5" />
      <rect x="3" y="3" width="3" height="3" rx="1" fill="currentColor" opacity="0.6" />
      <rect x="10" y="3" width="3" height="3" rx="1" fill="currentColor" opacity="0.6" />
    </svg>
  ),
  music: (c) => (
    <svg viewBox="0 0 16 16" fill="none" className={c}>
      <rect x="5" y="2" width="2" height="10" fill="currentColor" opacity="0.7" />
      <rect x="11" y="1" width="2" height="10" fill="currentColor" opacity="0.7" />
      <rect x="5" y="1" width="8" height="2" fill="currentColor" opacity="0.5" />
      <circle cx="4" cy="12" r="2.5" fill="currentColor" />
      <circle cx="10" cy="11" r="2.5" fill="currentColor" />
    </svg>
  ),
  trophy: (c) => (
    <svg viewBox="0 0 16 16" fill="none" className={c}>
      <rect x="4" y="1" width="8" height="7" rx="1" fill="currentColor" opacity="0.8" />
      <rect x="2" y="2" width="2" height="4" rx="1" fill="currentColor" opacity="0.5" />
      <rect x="12" y="2" width="2" height="4" rx="1" fill="currentColor" opacity="0.5" />
      <rect x="7" y="8" width="2" height="3" fill="currentColor" opacity="0.6" />
      <rect x="5" y="11" width="6" height="2" rx="1" fill="currentColor" />
    </svg>
  ),
  food: (c) => (
    <svg viewBox="0 0 16 16" fill="none" className={c}>
      <ellipse cx="8" cy="10" rx="6" ry="4" fill="currentColor" opacity="0.6" />
      <ellipse cx="8" cy="8" rx="6" ry="2" fill="currentColor" opacity="0.8" />
      <path d="M5 3c0-1 1-2 3-2s3 1 3 2v5H5V3z" fill="currentColor" opacity="0.5" />
    </svg>
  ),
  floor: (c) => (
    <svg viewBox="0 0 16 16" fill="none" className={c}>
      <path d="M1 8l7-6 7 6v6H1V8z" fill="currentColor" opacity="0.5" />
      <rect x="3" y="9" width="4" height="5" fill="currentColor" opacity="0.7" />
      <rect x="9" y="9" width="4" height="3" rx="1" fill="currentColor" opacity="0.4" />
      <path d="M1 8l7-6 7 6" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.8" />
    </svg>
  ),
  vending_machine: (c) => (
    <svg viewBox="0 0 16 16" fill="none" className={c}>
      <rect x="3" y="1" width="10" height="14" rx="1" fill="currentColor" opacity="0.7" />
      <rect x="5" y="3" width="6" height="4" rx="0.5" fill="currentColor" opacity="0.3" />
      <rect x="5" y="8" width="2" height="2" rx="0.5" fill="currentColor" opacity="0.5" />
      <rect x="9" y="8" width="2" height="2" rx="0.5" fill="currentColor" opacity="0.5" />
      <rect x="5" y="11" width="6" height="2" rx="0.5" fill="currentColor" opacity="0.4" />
    </svg>
  ),
  teleport: (c) => (
    <svg viewBox="0 0 16 16" fill="none" className={c}>
      <circle cx="8" cy="8" r="6" fill="currentColor" opacity="0.3" />
      <circle cx="8" cy="8" r="4" fill="currentColor" opacity="0.5" />
      <circle cx="8" cy="8" r="2" fill="currentColor" opacity="0.9" />
      <rect x="7" y="1" width="2" height="3" fill="currentColor" opacity="0.6" />
      <rect x="7" y="12" width="2" height="3" fill="currentColor" opacity="0.6" />
      <rect x="1" y="7" width="3" height="2" fill="currentColor" opacity="0.6" />
      <rect x="12" y="7" width="3" height="2" fill="currentColor" opacity="0.6" />
    </svg>
  ),
  wall: (c) => (
    <svg viewBox="0 0 16 16" fill="none" className={c}>
      <rect x="1" y="1" width="14" height="14" rx="1" fill="currentColor" opacity="0.3" />
      <rect x="3" y="3" width="10" height="7" rx="1" fill="currentColor" opacity="0.7" />
      <rect x="4" y="4" width="8" height="5" fill="currentColor" opacity="0.4" />
      <rect x="6" y="12" width="4" height="2" rx="1" fill="currentColor" opacity="0.5" />
    </svg>
  ),
  other: (c) => (
    <svg viewBox="0 0 16 16" fill="none" className={c}>
      <rect x="2" y="4" width="12" height="10" rx="1" fill="currentColor" opacity="0.7" />
      <rect x="2" y="4" width="12" height="2" fill="currentColor" />
      <path d="M6 1h4l1 3H5l1-3z" fill="currentColor" opacity="0.8" />
    </svg>
  ),
  divider: (c) => (
    <svg viewBox="0 0 16 16" fill="none" className={c}>
      <rect x="1" y="2" width="2" height="12" fill="currentColor" />
      <rect x="13" y="2" width="2" height="12" fill="currentColor" />
      <rect x="3" y="2" width="10" height="2" fill="currentColor" opacity="0.8" />
      <rect x="3" y="7" width="10" height="2" fill="currentColor" opacity="0.6" />
      <rect x="3" y="12" width="10" height="2" fill="currentColor" opacity="0.8" />
    </svg>
  ),
  pets: (c) => (
    <svg viewBox="0 0 16 16" fill="none" className={c}>
      <circle cx="4" cy="3" r="2" fill="currentColor" opacity="0.8" />
      <circle cx="12" cy="3" r="2" fill="currentColor" opacity="0.8" />
      <circle cx="2" cy="8" r="2" fill="currentColor" opacity="0.8" />
      <circle cx="14" cy="8" r="2" fill="currentColor" opacity="0.8" />
      <ellipse cx="8" cy="12" rx="4" ry="3" fill="currentColor" />
    </svg>
  ),
  gate: (c) => (
    <svg viewBox="0 0 16 16" fill="none" className={c}>
      <rect x="1" y="1" width="3" height="14" fill="currentColor" />
      <rect x="12" y="1" width="3" height="14" fill="currentColor" />
      <rect x="4" y="1" width="8" height="2" fill="currentColor" opacity="0.8" />
      <rect x="5" y="5" width="6" height="10" rx="3" fill="currentColor" opacity="0.5" />
    </svg>
  ),
  roller: (c) => (
    <svg viewBox="0 0 16 16" fill="none" className={c}>
      <circle cx="8" cy="8" r="6" fill="currentColor" opacity="0.3" />
      <circle cx="8" cy="8" r="4" fill="currentColor" opacity="0.6" />
      <path d="M8 4l2.5 3H5.5L8 4z" fill="currentColor" opacity="0.9" />
      <rect x="7" y="7" width="2" height="4" fill="currentColor" opacity="0.9" />
    </svg>
  ),
  trade: (c) => (
    <svg viewBox="0 0 16 16" fill="none" className={c}>
      <rect x="7" y="1" width="2" height="14" fill="currentColor" opacity="0.5" />
      <rect x="3" y="7" width="10" height="2" fill="currentColor" />
      <path d="M3 3h4v4H3V3z" fill="currentColor" opacity="0.8" />
      <path d="M9 9h4v4H9V9z" fill="currentColor" opacity="0.8" />
      <circle cx="5" cy="5" r="1" fill="currentColor" />
      <circle cx="11" cy="11" r="1" fill="currentColor" />
    </svg>
  ),
  arbitrage: (c) => (
    <svg viewBox="0 0 16 16" fill="none" className={c}>
      <rect x="1" y="14" width="14" height="1" fill="currentColor" opacity="0.4" />
      <rect x="1" y="1" width="1" height="14" fill="currentColor" opacity="0.4" />
      <rect x="3" y="10" width="2" height="4" fill="currentColor" opacity="0.7" />
      <rect x="6" y="6" width="2" height="8" fill="currentColor" />
      <rect x="9" y="8" width="2" height="6" fill="currentColor" opacity="0.7" />
      <rect x="12" y="3" width="2" height="11" fill="currentColor" opacity="0.9" />
      <path d="M4 9l3-4 2 3 4-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
    </svg>
  ),
  alerts: (c) => (
    <svg viewBox="0 0 16 16" fill="none" className={c}>
      <path d="M8 1C5.5 1 4 3 4 5v3l-2 2v1h12v-1l-2-2V5c0-2-1.5-4-4-4z" fill="currentColor" />
      <rect x="6" y="12" width="4" height="2" rx="1" fill="currentColor" opacity="0.7" />
      <circle cx="8" cy="1" r="0.5" fill="currentColor" opacity="0.5" />
    </svg>
  ),
  search: (c) => (
    <svg viewBox="0 0 16 16" fill="none" className={c}>
      <circle cx="7" cy="7" r="4" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M10 10l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  box: (c) => (
    <svg viewBox="0 0 16 16" fill="none" className={c}>
      <rect x="2" y="5" width="12" height="9" rx="1" fill="currentColor" opacity="0.7" />
      <rect x="2" y="5" width="12" height="2" fill="currentColor" />
      <path d="M5 2h6l2 3H3l2-3z" fill="currentColor" opacity="0.8" />
      <rect x="6" y="7" width="4" height="3" rx="0.5" fill="currentColor" opacity="0.4" />
    </svg>
  ),
  heart: (c) => (
    <svg viewBox="0 0 16 16" fill="none" className={c}>
      <path d="M8 14s-6-4-6-8c0-2 1.5-4 3.5-4S8 4 8 4s1.5-2 3.5-2S15 4 15 6c0 4-6 8-6 8z" fill="currentColor" opacity="0.1" />
      <path d="M8 13s-5-3.5-5-7c0-1.8 1.2-3.5 3-3.5S8 4.5 8 4.5s1.2-2 3-2 3 1.7 3 3.5c0 3.5-5 7-5 7z" fill="currentColor" />
    </svg>
  ),
  "heart-outline": (c) => (
    <svg viewBox="0 0 16 16" fill="none" className={c}>
      <path d="M8 13s-5-3.5-5-7c0-1.8 1.2-3.5 3-3.5S8 4.5 8 4.5s1.2-2 3-2 3 1.7 3 3.5c0 3.5-5 7-5 7z" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  ),
  "chart-down": (c) => (
    <svg viewBox="0 0 16 16" fill="none" className={c}>
      <rect x="1" y="14" width="14" height="1" fill="currentColor" opacity="0.4" />
      <rect x="1" y="1" width="1" height="14" fill="currentColor" opacity="0.4" />
      <path d="M3 4l3 3 2-2 5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11 7l2 4h-4l2-4z" fill="currentColor" opacity="0.5" />
    </svg>
  ),
  "chart-up": (c) => (
    <svg viewBox="0 0 16 16" fill="none" className={c}>
      <rect x="1" y="14" width="14" height="1" fill="currentColor" opacity="0.4" />
      <rect x="1" y="1" width="1" height="14" fill="currentColor" opacity="0.4" />
      <path d="M3 11l3-3 2 2 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11 3l2 0 0 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  compare: (c) => (
    <svg viewBox="0 0 16 16" fill="none" className={c}>
      <rect x="1" y="1" width="6" height="6" rx="1" fill="currentColor" opacity="0.8" />
      <rect x="9" y="1" width="6" height="6" rx="1" fill="currentColor" opacity="0.5" />
      <rect x="1" y="9" width="6" height="6" rx="1" fill="currentColor" opacity="0.5" />
      <rect x="9" y="9" width="6" height="6" rx="1" fill="currentColor" opacity="0.8" />
    </svg>
  ),
  star: (c) => (
    <svg viewBox="0 0 16 16" fill="none" className={c}>
      <path d="M8 1l2 5h5l-4 3 1.5 5L8 11l-4.5 3L5 9 1 6h5l2-5z" fill="currentColor" />
    </svg>
  ),
  credits: (c) => (
    <svg viewBox="0 0 16 16" fill="none" className={c}>
      <circle cx="8" cy="8" r="7" fill="currentColor" opacity="0.3" />
      <circle cx="8" cy="8" r="5" fill="currentColor" opacity="0.6" />
      <text x="8" y="11" textAnchor="middle" fill="currentColor" fontSize="8" fontWeight="bold" opacity="0.9">C</text>
    </svg>
  ),
};

export function PixelIcon({ name, size = "md", className = "" }: PixelIconProps) {
  const sizeClass = sizeMap[size];
  const icon = icons[name];
  if (!icon) return null;
  return <span className={`inline-flex items-center justify-center ${sizeClass} ${className}`}>{icon(sizeClass)}</span>;
}
