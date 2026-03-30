"use client";

import Link from "next/link";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { PixelIcon } from "@/components/common/PixelIcon";

export function Footer() {
  const { t } = useLanguage();

  const navLinks = [
    { href: "/catalog", label: t.nav.catalog },
    { href: "/trade", label: t.nav.trade },
    { href: "/compare", label: t.nav.compare },
    { href: "/portfolio", label: t.nav.portfolio },
    { href: "/arbitrage", label: t.nav.arbitrage },
    { href: "/alerts", label: t.nav.alerts },
  ];

  const externalLinks = [
    { href: "https://www.habbo.de", label: "Habbo.de" },
    { href: "https://www.habbo.com", label: "Habbo.com" },
    { href: "https://habboapi.site", label: "HabboAPI" },
  ];

  return (
    <footer className="border-t border-habbo-border bg-habbo-nav mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-habbo-gold rounded pixel-border flex items-center justify-center">
                <span className="font-[family-name:var(--font-pixel)] text-habbo-bg text-[7px] leading-none">
                  HM
                </span>
              </div>
              <span className="font-[family-name:var(--font-pixel)] text-habbo-gold text-[10px]">
                HabboMarket
              </span>
            </Link>
            <p className="text-xs text-habbo-text-dim leading-relaxed">
              {t.dashboard.subtitle}
            </p>
          </div>

          <div>
            <h4 className="text-[9px] font-[family-name:var(--font-pixel)] text-habbo-text-dim uppercase tracking-wider mb-3">
              Navigation
            </h4>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs text-habbo-text-dim hover:text-habbo-cyan transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[9px] font-[family-name:var(--font-pixel)] text-habbo-text-dim uppercase tracking-wider mb-3">
              External
            </h4>
            <ul className="space-y-2">
              {externalLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-habbo-text-dim hover:text-habbo-cyan transition-colors inline-flex items-center gap-1"
                  >
                    {link.label}
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[9px] font-[family-name:var(--font-pixel)] text-habbo-text-dim uppercase tracking-wider mb-3">
              {t.dashboard.traderTools}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/favorites" className="text-xs text-habbo-text-dim hover:text-habbo-cyan transition-colors inline-flex items-center gap-1.5">
                  <PixelIcon name="heart" size="xs" />
                  {t.nav.favorites}
                </Link>
              </li>
              <li>
                <Link href="/alerts" className="text-xs text-habbo-text-dim hover:text-habbo-cyan transition-colors inline-flex items-center gap-1.5">
                  <PixelIcon name="alerts" size="xs" />
                  {t.nav.alerts}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-habbo-border/50 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[10px] text-habbo-text-dim/50">
            HabboMarket &mdash; Not affiliated with Habbo or Sulake.
          </p>
          <p className="text-[10px] text-habbo-text-dim/50">
            Market data via habboapi.site
          </p>
        </div>
      </div>
    </footer>
  );
}
