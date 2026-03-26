"use client";

import type { ReactNode } from "react";

interface PixelCardProps {
  children: ReactNode;
  className?: string;
  gold?: boolean;
  hover?: boolean;
  onClick?: () => void;
}

export function PixelCard({
  children,
  className = "",
  gold = false,
  hover = false,
  onClick,
}: PixelCardProps) {
  const base = "bg-habbo-card rounded-lg";
  const border = gold ? "pixel-border-gold" : "pixel-border";
  const hoverStyle = hover
    ? "hover:bg-habbo-card-hover hover:scale-[1.02] transition-all duration-200 cursor-pointer"
    : "";
  const Tag = onClick ? "button" : "div";

  return (
    <Tag
      className={`${base} ${border} ${hoverStyle} ${className}`}
      onClick={onClick}
    >
      {children}
    </Tag>
  );
}
