"use client";

import Link from "next/link";
import { PixelCard } from "@/components/common/PixelCard";
import { SectionHeader } from "@/components/common/SectionHeader";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { PixelIcon } from "@/components/common/PixelIcon";
import type { PixelIconName } from "@/components/common/PixelIcon";

const CATEGORY_ICONS: Record<string, PixelIconName> = {
  chair: "chair",
  table: "table",
  bed: "bed",
  lighting: "lighting",
  shelf: "shelf",
  rug: "rug",
  divider: "divider",
  gate: "gate",
  teleport: "teleport",
  pets: "pets",
  games: "games",
  music: "music",
  trophy: "trophy",
  food: "food",
  floor: "floor",
  vending_machine: "vending_machine",
  roller: "roller",
  wall: "wall",
  other: "other",
};

const TOP_CATEGORIES = [
  "chair", "table", "bed", "lighting", "shelf",
  "rug", "divider", "gate", "teleport", "pets",
  "games", "music", "trophy", "food", "wall",
];

export function QuickCategories() {
  const { t } = useLanguage();

  return (
    <PixelCard className="p-4">
      <SectionHeader title={t.dashboard.categories} icon="shelf" color="cyan" />
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-habbo-border/30 md:grid md:grid-cols-15 md:overflow-x-visible">
        {TOP_CATEGORIES.map((cat) => (
          <Link
            key={cat}
            href={`/catalog?category=${cat}`}
            className="flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-lg bg-habbo-bg/40 hover:bg-habbo-card-hover hover:scale-105 transition-all duration-200 group shrink-0 min-w-[60px]"
          >
            <span className="text-habbo-cyan group-hover:text-habbo-gold transition-colors group-hover:scale-110 inline-flex transition-transform">
              <PixelIcon name={CATEGORY_ICONS[cat] ?? "other"} size="lg" />
            </span>
            <span className="text-[9px] text-habbo-text-dim group-hover:text-habbo-text transition-colors text-center leading-tight truncate w-full">
              {t.categories[cat] ?? cat}
            </span>
          </Link>
        ))}
      </div>
    </PixelCard>
  );
}
