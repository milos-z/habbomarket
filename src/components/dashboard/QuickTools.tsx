"use client";

import Link from "next/link";
import { PixelCard } from "@/components/common/PixelCard";
import { PixelIcon } from "@/components/common/PixelIcon";
import type { PixelIconName } from "@/components/common/PixelIcon";
import { SectionHeader } from "@/components/common/SectionHeader";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useAlerts } from "@/components/providers/AlertsProvider";

export function QuickTools() {
  const { t } = useLanguage();
  const { triggeredCount } = useAlerts();

  const tools: Array<{
    href: string;
    icon: PixelIconName;
    label: string;
    desc: string;
    color: string;
    bgColor: string;
    badge?: number;
  }> = [
    {
      href: "/trade",
      icon: "trade",
      label: t.nav.trade,
      desc: t.trade.subtitle,
      color: "text-habbo-cyan",
      bgColor: "bg-habbo-cyan/5",
    },
    {
      href: "/arbitrage",
      icon: "arbitrage",
      label: t.nav.arbitrage,
      desc: t.arbitrage.subtitle,
      color: "text-habbo-gold",
      bgColor: "bg-habbo-gold/5",
    },
    {
      href: "/alerts",
      icon: "alerts",
      label: t.nav.alerts,
      desc: t.alerts.subtitle,
      color: "text-habbo-purple",
      bgColor: "bg-habbo-purple/5",
      badge: triggeredCount,
    },
  ];

  return (
    <PixelCard className="p-4 h-full flex flex-col">
      <SectionHeader title={t.dashboard.traderTools} icon="trade" color="cyan" />
      <div className="flex flex-col gap-2 flex-1">
        {tools.map((tool) => (
          <Link key={tool.href} href={tool.href}>
            <div
              className={`flex items-center gap-3 p-3 rounded-lg ${tool.bgColor} border border-transparent hover:border-habbo-border/50 transition-all duration-200 cursor-pointer group`}
            >
              <span className={`${tool.color} shrink-0`}>
                <PixelIcon name={tool.icon} size="lg" />
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium ${tool.color} group-hover:brightness-125 transition-all`}>
                    {tool.label}
                  </span>
                  {tool.badge !== undefined && tool.badge > 0 && (
                    <span className="w-4 h-4 bg-habbo-gold text-habbo-bg text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                      {tool.badge}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-habbo-text-dim leading-relaxed truncate">
                  {tool.desc}
                </p>
              </div>
              <svg className="w-3 h-3 text-habbo-text-dim/40 group-hover:text-habbo-text-dim group-hover:translate-x-0.5 transition-all shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </PixelCard>
  );
}
