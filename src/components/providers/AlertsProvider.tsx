"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import type { PriceAlert } from "@/lib/types";
import { AlertStatus, AlertDirection } from "@/lib/types";
import type { HotelDomain } from "@/lib/types";
import { fetchMarketHistory } from "@/lib/api";
import { showToast } from "@/components/common/Toast";

function requestNotificationPermission() {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission === "default") {
    Notification.requestPermission();
  }
}

function sendBrowserNotification(title: string, body: string, classname: string) {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;

  const notification = new Notification(title, {
    body,
    icon: `/api/image/${encodeURIComponent(classname)}`,
    tag: `alert-${classname}`,
  });

  notification.onclick = () => {
    window.focus();
    window.location.href = `/furni/${encodeURIComponent(classname)}`;
    notification.close();
  };
}

const STORAGE_KEY = "habbomarket-alerts";
const POLL_INTERVAL_MS = 5 * 60 * 1000;

interface AlertsContextValue {
  alerts: PriceAlert[];
  triggeredCount: number;
  addAlert: (alert: Omit<PriceAlert, "id" | "status" | "currentPrice" | "createdAt">) => void;
  removeAlert: (id: string) => void;
  snoozeAlert: (id: string) => void;
  reactivateAlert: (id: string) => void;
  clearTriggered: () => void;
  checking: boolean;
}

const AlertsContext = createContext<AlertsContextValue | null>(null);

function loadFromStorage(): PriceAlert[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveToStorage(alerts: PriceAlert[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts));
  } catch {
    /* storage full */
  }
}

function generateId(): string {
  return `alert_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function AlertsProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [checking, setChecking] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setAlerts(loadFromStorage());
  }, []);

  const checkAlerts = useCallback(async (currentAlerts: PriceAlert[]) => {
    const activeAlerts = currentAlerts.filter((a) => a.status === AlertStatus.ACTIVE);
    if (activeAlerts.length === 0) return;

    setChecking(true);

    const results = await Promise.allSettled(
      activeAlerts.map(async (alert) => {
        const data = await fetchMarketHistory(alert.classname, alert.hotel, 7);
        const currentPrice = data.length > 0 ? data[0].marketData.averagePrice : 0;
        return { id: alert.id, currentPrice };
      })
    );

    setAlerts((prev) => {
      const updated = prev.map((alert) => {
        const result = results.find(
          (r) => r.status === "fulfilled" && r.value.id === alert.id
        );
        if (!result || result.status !== "fulfilled") return alert;

        const { currentPrice } = result.value;
        const wasTriggered =
          alert.status === AlertStatus.ACTIVE &&
          ((alert.direction === AlertDirection.ABOVE && currentPrice >= alert.targetPrice) ||
            (alert.direction === AlertDirection.BELOW && currentPrice <= alert.targetPrice));

        if (wasTriggered) {
          showToast(`Alert triggered: ${alert.name} reached ${currentPrice}c`, "warning");
          sendBrowserNotification(
            `Price Alert: ${alert.name}`,
            `${alert.direction === AlertDirection.ABOVE ? "Reached" : "Dropped to"} ${currentPrice}c (target: ${alert.targetPrice}c)`,
            alert.classname
          );
        }

        return {
          ...alert,
          currentPrice,
          ...(wasTriggered
            ? { status: AlertStatus.TRIGGERED as const, triggeredAt: Date.now() }
            : {}),
        };
      });

      saveToStorage(updated);
      return updated;
    });

    setChecking(false);
  }, []);

  useEffect(() => {
    if (alerts.length > 0 && alerts.some((a) => a.status === AlertStatus.ACTIVE)) {
      checkAlerts(alerts);
    }
    // Only run on mount + when alerts list changes length
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alerts.length]);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    const hasActive = alerts.some((a) => a.status === AlertStatus.ACTIVE);
    if (hasActive) {
      intervalRef.current = setInterval(() => {
        checkAlerts(alerts);
      }, POLL_INTERVAL_MS);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [alerts, checkAlerts]);

  const addAlert = useCallback(
    (alertData: Omit<PriceAlert, "id" | "status" | "currentPrice" | "createdAt">) => {
      setAlerts((prev) => {
        const newAlert: PriceAlert = {
          ...alertData,
          id: generateId(),
          status: AlertStatus.ACTIVE,
          currentPrice: 0,
          createdAt: Date.now(),
        };
        const next = [...prev, newAlert];
        saveToStorage(next);
        showToast(`Alert created for "${alertData.name}"`, "success");
        requestNotificationPermission();
        return next;
      });
    },
    []
  );

  const removeAlert = useCallback((id: string) => {
    setAlerts((prev) => {
      const next = prev.filter((a) => a.id !== id);
      saveToStorage(next);
      showToast("Alert deleted", "info");
      return next;
    });
  }, []);

  const snoozeAlert = useCallback((id: string) => {
    setAlerts((prev) => {
      const next = prev.map((a) =>
        a.id === id ? { ...a, status: AlertStatus.SNOOZED as const } : a
      );
      saveToStorage(next);
      showToast("Alert snoozed", "info");
      return next;
    });
  }, []);

  const reactivateAlert = useCallback((id: string) => {
    setAlerts((prev) => {
      const next = prev.map((a) =>
        a.id === id
          ? { ...a, status: AlertStatus.ACTIVE as const, triggeredAt: undefined }
          : a
      );
      saveToStorage(next);
      showToast("Alert reactivated", "success");
      return next;
    });
  }, []);

  const clearTriggered = useCallback(() => {
    setAlerts((prev) => {
      const next = prev.filter((a) => a.status !== AlertStatus.TRIGGERED);
      saveToStorage(next);
      return next;
    });
  }, []);

  const triggeredCount = alerts.filter((a) => a.status === AlertStatus.TRIGGERED).length;

  return (
    <AlertsContext
      value={{
        alerts,
        triggeredCount,
        addAlert,
        removeAlert,
        snoozeAlert,
        reactivateAlert,
        clearTriggered,
        checking,
      }}
    >
      {children}
    </AlertsContext>
  );
}

export function useAlerts(): AlertsContextValue {
  const ctx = useContext(AlertsContext);
  if (!ctx) throw new Error("useAlerts must be used within AlertsProvider");
  return ctx;
}
