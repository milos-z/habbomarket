"use client";

import { useMemo } from "react";
import { AlertStatus } from "@/lib/types";
import { PixelCard } from "@/components/common/PixelCard";
import { PixelButton } from "@/components/common/PixelButton";
import { useAlerts } from "@/components/providers/AlertsProvider";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { CreateAlertForm } from "@/components/alerts/CreateAlertForm";
import { AlertCard } from "@/components/alerts/AlertCard";

export default function AlertsPage() {
  const { t } = useLanguage();
  const { alerts, triggeredCount, snoozeAlert, reactivateAlert, removeAlert, clearTriggered, checking } =
    useAlerts();

  const { triggered, active, snoozed } = useMemo(() => {
    const triggered = alerts.filter((a) => a.status === AlertStatus.TRIGGERED);
    const active = alerts.filter((a) => a.status === AlertStatus.ACTIVE);
    const snoozed = alerts.filter((a) => a.status === AlertStatus.SNOOZED);
    return { triggered, active, snoozed };
  }, [alerts]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-pixel)] text-lg text-habbo-gold pixel-text-shadow">
            {t.alerts.title}
          </h1>
          <p className="text-sm text-habbo-text-dim mt-1">{t.alerts.subtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          {checking && (
            <div className="flex items-center gap-2 text-xs text-habbo-cyan">
              <div className="w-3 h-3 border-2 border-habbo-cyan/30 border-t-habbo-cyan rounded-full animate-spin" />
              {t.alerts.checking}
            </div>
          )}
          {triggeredCount > 0 && (
            <PixelButton variant="ghost" size="sm" onClick={clearTriggered}>
              {t.compare.clearAll} ({triggeredCount})
            </PixelButton>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <PixelCard className="px-4 py-2 text-center">
          <div className="text-[9px] font-[family-name:var(--font-pixel)] text-habbo-text-dim uppercase">
            {t.alerts.active}
          </div>
          <div className="text-sm font-mono font-bold text-habbo-cyan mt-0.5">
            {active.length}
          </div>
        </PixelCard>
        <PixelCard className="px-4 py-2 text-center">
          <div className="text-[9px] font-[family-name:var(--font-pixel)] text-habbo-text-dim uppercase">
            {t.alerts.triggered}
          </div>
          <div className="text-sm font-mono font-bold text-habbo-gold mt-0.5">
            {triggered.length}
          </div>
        </PixelCard>
        <PixelCard className="px-4 py-2 text-center">
          <div className="text-[9px] font-[family-name:var(--font-pixel)] text-habbo-text-dim uppercase">
            {t.alerts.snoozed}
          </div>
          <div className="text-sm font-mono font-bold text-habbo-text-dim mt-0.5">
            {snoozed.length}
          </div>
        </PixelCard>
      </div>

      <CreateAlertForm t={t} />

      {triggered.length > 0 && (
        <div className="space-y-2">
          <h2 className="font-[family-name:var(--font-pixel)] text-[10px] text-habbo-gold uppercase tracking-wider">
            {t.alerts.triggered}
          </h2>
          {triggered.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onSnooze={snoozeAlert}
              onReactivate={reactivateAlert}
              onDelete={removeAlert}
              t={t}
            />
          ))}
        </div>
      )}

      {active.length > 0 && (
        <div className="space-y-2">
          <h2 className="font-[family-name:var(--font-pixel)] text-[10px] text-habbo-cyan uppercase tracking-wider">
            {t.alerts.active}
          </h2>
          {active.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onSnooze={snoozeAlert}
              onReactivate={reactivateAlert}
              onDelete={removeAlert}
              t={t}
            />
          ))}
        </div>
      )}

      {snoozed.length > 0 && (
        <div className="space-y-2">
          <h2 className="font-[family-name:var(--font-pixel)] text-[10px] text-habbo-text-dim uppercase tracking-wider">
            {t.alerts.snoozed}
          </h2>
          {snoozed.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onSnooze={snoozeAlert}
              onReactivate={reactivateAlert}
              onDelete={removeAlert}
              t={t}
            />
          ))}
        </div>
      )}

      {alerts.length === 0 && (
        <PixelCard className="p-8 text-center">
          <div className="text-4xl mb-4 opacity-40">🔔</div>
          <h2 className="font-[family-name:var(--font-pixel)] text-xs text-habbo-text-dim mb-2">
            {t.alerts.empty}
          </h2>
          <p className="text-sm text-habbo-text-dim/70 max-w-md mx-auto">
            {t.alerts.emptyHint}
          </p>
        </PixelCard>
      )}
    </div>
  );
}
