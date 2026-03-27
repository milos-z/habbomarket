"use client";

import Link from "next/link";
import { useLanguage } from "@/components/providers/LanguageProvider";

const CATEGORY_ICONS: Record<string, string> = {
  chair: "🪑",
  table: "🪵",
  bed: "🛏️",
  lamp: "💡",
  shelf: "📚",
  rug: "🟫",
  plant: "🌿",
  teleport: "🌀",
  divider: "🧱",
  building: "🏗️",
  pets: "🐾",
  gate: "🚪",
  wall: "🖼️",
  roller: "⚙️",
  other: "📦",
};

const TOP_CATEGORIES = [
  "chair", "table", "bed", "lamp", "shelf",
  "rug", "plant", "teleport", "wall", "other",
];

export function QuickCategories() {
  const { t } = useLanguage();

  return (
    <section>
      <h2 className="font-[family-name:var(--font-pixel)] text-[10px] text-habbo-text-dim uppercase tracking-wider mb-3">
        {t.dashboard.categories}
      </h2>
      <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
        {TOP_CATEGORIES.map((cat) => (
          <Link
            key={cat}
            href={`/catalog?category=${cat}`}
            className="flex flex-col items-center gap-1.5 px-2 py-3 rounded-lg bg-habbo-card pixel-border hover:bg-habbo-card-hover hover:scale-105 transition-all duration-200 group"
          >
            <span className="text-lg group-hover:scale-110 transition-transform">
              {CATEGORY_ICONS[cat] ?? "📦"}
            </span>
            <span className="text-[9px] text-habbo-text-dim group-hover:text-habbo-text transition-colors text-center leading-tight truncate w-full">
              {t.categories[cat] ?? cat}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
