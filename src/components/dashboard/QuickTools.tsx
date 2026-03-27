"use client";

import Link from "next/link";
import { PixelCard } from "@/components/common/PixelCard";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useAlerts } from "@/components/providers/AlertsProvider";

export function QuickTools() {
  const { t } = useLanguage();
  const { triggeredCount } = useAlerts();

  const tools = [
    {
      href: "/trade",
      icon: "⚖️",
      label: t.nav.trade,
      desc: t.trade.subtitle,
      color: "text-habbo-cyan" as const,
      border: "border-habbo-cyan/20 hover:border-habbo-cyan/40" as const,
    },
    {
      href: "/arbitrage",
      icon: "📊",
      label: t.nav.arbitrage,
      desc: t.arbitrage.subtitle,
      color: "text-habbo-gold" as const,
      border: "border-habbo-gold/20 hover:border-habbo-gold/40" as const,
    },
    {
      href: "/alerts",
      icon: "🔔",
      label: t.nav.alerts,
      desc: t.alerts.subtitle,
      color: "text-habbo-purple" as const,
      border: "border-habbo-purple/20 hover:border-habbo-purple/40" as const,
      badge: triggeredCount,
    },
  ];

  return (
    <section>
      <h2 className="font-[family-name:var(--font-pixel)] text-[10px] text-habbo-text-dim uppercase tracking-wider mb-3">
        {t.dashboard.traderTools}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {tools.map((tool) => (
          <Link key={tool.href} href={tool.href}>
            <PixelCard
              className={`p-4 border ${tool.border} hover:bg-habbo-card-hover transition-all duration-200 cursor-pointer h-full`}
              hover
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{tool.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${tool.color}`}>{tool.label}</span>
                    {tool.badge !== undefined && tool.badge > 0 && (
                      <span className="w-4 h-4 bg-habbo-gold text-habbo-bg text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                        {tool.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-habbo-text-dim mt-1 leading-relaxed">
                    {tool.desc}
                  </p>
                </div>
              </div>
            </PixelCard>
          </Link>
        ))}
      </div>
    </section>
  );
}
