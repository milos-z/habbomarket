"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCompare } from "@/components/providers/CompareProvider";
import { useFavorites } from "@/components/providers/FavoritesProvider";
import { usePortfolio } from "@/components/providers/PortfolioProvider";
import { useAlerts } from "@/components/providers/AlertsProvider";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { LanguageSelector } from "@/components/common/LanguageSelector";
import { PixelIcon } from "@/components/common/PixelIcon";
import type { PixelIconName } from "@/components/common/PixelIcon";
import { useCommandPalette } from "@/components/common/CommandPalette";

export function Header() {
  const pathname = usePathname();
  const { items } = useCompare();
  const { favorites } = useFavorites();
  const { totalItems } = usePortfolio();
  const { triggeredCount } = useAlerts();
  const { t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { setOpen: setCommandPaletteOpen } = useCommandPalette();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const navLinks: Array<{
    href: string;
    label: string;
    badge: number;
    icon: PixelIconName;
  }> = [
    { href: "/", label: t.nav.dashboard, badge: 0, icon: "star" },
    { href: "/catalog", label: t.nav.catalog, badge: 0, icon: "search" },
    { href: "/trade", label: t.nav.trade, badge: 0, icon: "trade" },
    { href: "/arbitrage", label: t.nav.arbitrage, badge: 0, icon: "arbitrage" },
    { href: "/compare", label: t.nav.compare, badge: items.length, icon: "compare" },
    { href: "/favorites", label: t.nav.favorites, badge: favorites.length, icon: "heart" },
    { href: "/portfolio", label: t.nav.portfolio, badge: totalItems, icon: "box" },
    { href: "/alerts", label: t.nav.alerts, badge: triggeredCount, icon: "alerts" },
    { href: "/stats", label: "Stats", badge: 0, icon: "chart-up" },
  ];

  return (
    <header className="bg-habbo-nav border-b border-habbo-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 bg-habbo-gold rounded pixel-border flex items-center justify-center">
            <span className="font-[family-name:var(--font-pixel)] text-habbo-bg text-[8px] leading-none">
              HM
            </span>
          </div>
          <span className="font-[family-name:var(--font-pixel)] text-habbo-gold text-xs hidden sm:block group-hover:text-habbo-cyan transition-colors">
            HabboMarket
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-3">
          <nav className="flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    relative px-2.5 py-2 text-sm rounded transition-colors flex items-center gap-1.5
                    ${
                      isActive
                        ? "text-habbo-cyan bg-habbo-card"
                        : "text-habbo-text-dim hover:text-habbo-text hover:bg-habbo-card/50"
                    }
                  `}
                >
                  <PixelIcon name={link.icon} size="sm" />
                  <span>{link.label}</span>
                  {link.badge > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-habbo-gold text-habbo-bg text-[9px] font-bold rounded-full flex items-center justify-center">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="px-2.5 py-2 text-sm rounded transition-colors flex items-center gap-1.5 text-habbo-text-dim hover:text-habbo-text hover:bg-habbo-card/50"
            title="Search (⌘K)"
          >
            <PixelIcon name="search" size="sm" />
            <kbd className="hidden xl:inline-flex px-1.5 py-0.5 text-[8px] text-habbo-text-dim/50 bg-habbo-card border border-habbo-border rounded ml-1">
              ⌘K
            </kbd>
          </button>
          <LanguageSelector />
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="w-10 h-10 flex items-center justify-center rounded text-habbo-text-dim hover:text-habbo-text hover:bg-habbo-card/50 transition-colors"
            aria-label="Search"
          >
            <PixelIcon name="search" size="sm" />
          </button>
          <LanguageSelector />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="relative w-10 h-10 flex items-center justify-center rounded text-habbo-text-dim hover:text-habbo-text hover:bg-habbo-card/50 transition-colors"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {triggeredCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-habbo-gold rounded-full animate-pulse" />
            )}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <nav className="fixed top-14 right-0 bottom-0 w-64 bg-habbo-nav border-l border-habbo-border z-50 overflow-y-auto animate-slide-up lg:hidden">
            <div className="py-2">
              {navLinks.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`
                      flex items-center gap-3 px-5 py-3 text-sm transition-colors border-l-2
                      ${
                        isActive
                          ? "text-habbo-cyan bg-habbo-card/50 border-habbo-cyan"
                          : "text-habbo-text-dim hover:text-habbo-text hover:bg-habbo-card/30 border-transparent"
                      }
                    `}
                  >
                    <PixelIcon name={link.icon} size="sm" />
                    <span className="flex-1">{link.label}</span>
                    {link.badge > 0 && (
                      <span className="w-5 h-5 bg-habbo-gold text-habbo-bg text-[9px] font-bold rounded-full flex items-center justify-center">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>
        </>
      )}
    </header>
  );
}
