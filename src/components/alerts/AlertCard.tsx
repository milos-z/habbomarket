"use client";

import type { PriceAlert } from "@/lib/types";
import { AlertStatus, AlertDirection } from "@/lib/types";
import { HOTELS } from "@/lib/constants";
import { formatCredits } from "@/lib/utils";
import { FurniImage } from "@/components/common/FurniImage";
import { PixelButton } from "@/components/common/PixelButton";
import Link from "next/link";
import type { Translations } from "@/lib/i18n";

interface AlertCardProps {
  alert: PriceAlert;
  onSnooze: (id: string) => void;
  onReactivate: (id: string) => void;
  onDelete: (id: string) => void;
  t: Translations;
}

const statusStyles: Record<AlertStatus, string> = {
  [AlertStatus.ACTIVE]: "border-habbo-cyan/30",
  [AlertStatus.TRIGGERED]: "border-habbo-gold/50 shadow-[0_0_12px_rgba(245,200,66,0.15)]",
  [AlertStatus.SNOOZED]: "border-habbo-border opacity-60",
};

const statusBadgeStyles: Record<AlertStatus, string> = {
  [AlertStatus.ACTIVE]: "bg-habbo-cyan/20 text-habbo-cyan",
  [AlertStatus.TRIGGERED]: "bg-habbo-gold/20 text-habbo-gold animate-pulse",
  [AlertStatus.SNOOZED]: "bg-habbo-border/40 text-habbo-text-dim",
};

export function AlertCard({ alert, onSnooze, onReactivate, onDelete, t }: AlertCardProps) {
  const hotel = HOTELS[alert.hotel];
  const statusLabel =
    alert.status === AlertStatus.ACTIVE
      ? t.alerts.active
      : alert.status === AlertStatus.TRIGGERED
        ? t.alerts.triggered
        : t.alerts.snoozed;

  const dirLabel = alert.direction === AlertDirection.BELOW ? t.alerts.below : t.alerts.above;

  const createdDate = new Date(alert.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const triggeredDate = alert.triggeredAt
    ? new Date(alert.triggeredAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <div
      className={`bg-habbo-card rounded-lg border p-3 flex items-center gap-3 transition-all ${statusStyles[alert.status]}`}
    >
      <Link
        href={`/furni/${encodeURIComponent(alert.classname)}`}
        className="hover:opacity-80 transition-opacity"
      >
        <FurniImage classname={alert.classname} alt={alert.name} size="md" />
      </Link>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Link
            href={`/furni/${encodeURIComponent(alert.classname)}`}
            className="text-xs text-habbo-text truncate hover:text-habbo-cyan transition-colors"
          >
            {alert.name}
          </Link>
          <span className={`text-[9px] px-1.5 py-0.5 rounded ${statusBadgeStyles[alert.status]}`}>
            {statusLabel}
          </span>
        </div>

        <div className="flex items-center gap-3 mt-1">
          <span className="text-[10px] text-habbo-text-dim">
            {dirLabel} {formatCredits(alert.targetPrice)}c
          </span>
          <span className="text-[10px] text-habbo-text-dim">
            {hotel.flag} {hotel.label}
          </span>
          {alert.currentPrice > 0 && (
            <span className="text-[10px] font-mono text-habbo-cyan">
              {t.alerts.currentPrice}: {formatCredits(alert.currentPrice)}c
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 mt-0.5 text-[9px] text-habbo-text-dim/60">
          <span>{t.alerts.created}: {createdDate}</span>
          {triggeredDate && (
            <span>{t.alerts.triggeredAt}: {triggeredDate}</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        {alert.status === AlertStatus.ACTIVE && (
          <PixelButton variant="ghost" size="sm" onClick={() => onSnooze(alert.id)}>
            {t.alerts.snooze}
          </PixelButton>
        )}
        {(alert.status === AlertStatus.TRIGGERED || alert.status === AlertStatus.SNOOZED) && (
          <PixelButton variant="ghost" size="sm" onClick={() => onReactivate(alert.id)}>
            {t.alerts.reactivate}
          </PixelButton>
        )}
        <PixelButton variant="ghost" size="sm" onClick={() => onDelete(alert.id)}>
          {t.alerts.deleteAlert}
        </PixelButton>
      </div>
    </div>
  );
}
