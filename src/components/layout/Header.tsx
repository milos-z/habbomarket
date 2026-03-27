"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCompare } from "@/components/providers/CompareProvider";
import { useFavorites } from "@/components/providers/FavoritesProvider";
import { usePortfolio } from "@/components/providers/PortfolioProvider";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { LanguageSelector } from "@/components/common/LanguageSelector";

export function Header() {
  const pathname = usePathname();
  const { items } = useCompare();
  const { favorites } = useFavorites();
  const { totalItems } = usePortfolio();
  const { t } = useLanguage();

  const navLinks = [
    { href: "/", label: t.nav.dashboard, badge: 0 },
    { href: "/catalog", label: t.nav.catalog, badge: 0 },
    { href: "/compare", label: t.nav.compare, badge: items.length },
    { href: "/favorites", label: t.nav.favorites, badge: favorites.length },
    { href: "/portfolio", label: t.nav.portfolio, badge: totalItems },
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

        <div className="flex items-center gap-3">
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
                    relative px-3 py-2 text-sm rounded transition-colors
                    ${
                      isActive
                        ? "text-habbo-cyan bg-habbo-card"
                        : "text-habbo-text-dim hover:text-habbo-text hover:bg-habbo-card/50"
                    }
                  `}
                >
                  {link.label}
                  {link.badge > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-habbo-gold text-habbo-bg text-[9px] font-bold rounded-full flex items-center justify-center">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
          <LanguageSelector />
        </div>
      </div>
    </header>
  );
}
