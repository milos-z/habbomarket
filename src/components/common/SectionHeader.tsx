"use client";

import { PixelIcon } from "@/components/common/PixelIcon";
import type { PixelIconName } from "@/components/common/PixelIcon";

interface SectionHeaderProps {
  title: string;
  icon?: PixelIconName;
  color?: "cyan" | "gold" | "purple" | "green" | "red" | "dim";
}

const colorMap: Record<string, string> = {
  cyan: "text-habbo-cyan",
  gold: "text-habbo-gold",
  purple: "text-habbo-purple",
  green: "text-habbo-green",
  red: "text-habbo-red",
  dim: "text-habbo-text-dim",
};

export function SectionHeader({ title, icon, color = "dim" }: SectionHeaderProps) {
  const textColor = colorMap[color];

  return (
    <div className="flex items-center gap-2 mb-3">
      {icon && (
        <span className={textColor}>
          <PixelIcon name={icon} size="sm" />
        </span>
      )}
      <h2 className={`font-[family-name:var(--font-pixel)] text-[10px] ${textColor} uppercase tracking-wider`}>
        {title}
      </h2>
      <div className={`flex-1 h-px bg-linear-to-r from-current to-transparent opacity-20 ${textColor}`} />
    </div>
  );
}
