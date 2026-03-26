"use client";

import type { ReactNode, ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "gold" | "ghost";

interface PixelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: Variant;
  size?: "sm" | "md";
  active?: boolean;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-habbo-cyan/20 text-habbo-cyan border-habbo-cyan/40 hover:bg-habbo-cyan/30",
  secondary:
    "bg-habbo-card text-habbo-text border-habbo-border hover:bg-habbo-card-hover",
  gold: "bg-habbo-gold/20 text-habbo-gold border-habbo-gold/40 hover:bg-habbo-gold/30",
  ghost:
    "bg-transparent text-habbo-text-dim border-transparent hover:text-habbo-text hover:bg-habbo-card/50",
};

export function PixelButton({
  children,
  variant = "primary",
  size = "md",
  active,
  className = "",
  ...props
}: PixelButtonProps) {
  const sizeStyle = size === "sm" ? "px-2 py-1 text-xs" : "px-4 py-2 text-sm";
  const activeStyle = active ? "ring-1 ring-habbo-cyan" : "";

  return (
    <button
      className={`
        ${variantStyles[variant]} ${sizeStyle} ${activeStyle}
        border rounded font-medium transition-all duration-150
        disabled:opacity-40 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
