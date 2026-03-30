"use client";

import { useState, useCallback, useMemo } from "react";
import { HotelDomain } from "@/lib/types";
import type { TradeItem } from "@/lib/types";
import { fetchMarketHistory } from "@/lib/api";
import { formatCredits } from "@/lib/utils";
import { PixelCard } from "@/components/common/PixelCard";
import { PixelButton } from "@/components/common/PixelButton";
import { HotelSelector } from "@/components/common/HotelSelector";
import { TradeSide } from "@/components/trade/TradeSide";
import { FairnessIndicator } from "@/components/trade/FairnessIndicator";
import { PixelIcon } from "@/components/common/PixelIcon";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { showToast } from "@/components/common/Toast";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { saveTradeToHistory } from "@/lib/trade-history";

export default function TradePage() {
  const { t } = useLanguage();
  const [hotel, setHotel] = useState<HotelDomain>(HotelDomain.DE);
  const [giveItems, setGiveItems] = useState<TradeItem[]>([]);
  const [receiveItems, setReceiveItems] = useState<TradeItem[]>([]);
  const [giveCredits, setGiveCredits] = useState(0);
  const [receiveCredits, setReceiveCredits] = useState(0);

  const fetchPrice = useCallback(
    async (classname: string): Promise<number> => {
      try {
        const data = await fetchMarketHistory(classname, hotel, 30);
        return data.length > 0 ? data[0].marketData.averagePrice : 0;
      } catch {
        return 0;
      }
    },
    [hotel]
  );

  const addItem = useCallback(
    (
      setter: React.Dispatch<React.SetStateAction<TradeItem[]>>,
      classname: string,
      name: string
    ) => {
      setter((prev) => {
        const existing = prev.find((i) => i.classname === classname);
        if (existing) {
          return prev.map((i) =>
            i.classname === classname ? { ...i, quantity: i.quantity + 1 } : i
          );
        }
        return [...prev, { classname, name, quantity: 1, avgPrice: 0, loading: true }];
      });

      fetchPrice(classname).then((price) => {
        setter((prev) =>
          prev.map((i) =>
            i.classname === classname ? { ...i, avgPrice: price, loading: false } : i
          )
        );
      });
    },
    [fetchPrice]
  );

  const removeItem = useCallback(
    (setter: React.Dispatch<React.SetStateAction<TradeItem[]>>, classname: string) => {
      setter((prev) => prev.filter((i) => i.classname !== classname));
    },
    []
  );

  const updateQuantity = useCallback(
    (
      setter: React.Dispatch<React.SetStateAction<TradeItem[]>>,
      classname: string,
      quantity: number
    ) => {
      if (quantity <= 0) {
        setter((prev) => prev.filter((i) => i.classname !== classname));
      } else {
        setter((prev) =>
          prev.map((i) => (i.classname === classname ? { ...i, quantity } : i))
        );
      }
    },
    []
  );

  const giveItemsTotal = useMemo(
    () => giveItems.reduce((sum, i) => sum + i.avgPrice * i.quantity, 0),
    [giveItems]
  );

  const receiveItemsTotal = useMemo(
    () => receiveItems.reduce((sum, i) => sum + i.avgPrice * i.quantity, 0),
    [receiveItems]
  );

  const giveTotal = giveItemsTotal + giveCredits;
  const receiveTotal = receiveItemsTotal + receiveCredits;

  const anyLoading = giveItems.some((i) => i.loading) || receiveItems.some((i) => i.loading);

  function handleSwap() {
    const tempItems = [...giveItems];
    const tempCredits = giveCredits;
    setGiveItems([...receiveItems]);
    setGiveCredits(receiveCredits);
    setReceiveItems(tempItems);
    setReceiveCredits(tempCredits);
    showToast("Trade sides swapped", "info");
  }

  function handleClear() {
    setGiveItems([]);
    setReceiveItems([]);
    setGiveCredits(0);
    setReceiveCredits(0);
    showToast("Trade cleared", "info");
  }

  function handleSaveTrade() {
    if (giveItems.length === 0 && receiveItems.length === 0 && giveCredits === 0 && receiveCredits === 0) {
      showToast("Nothing to save", "warning");
      return;
    }
    saveTradeToHistory({
      giveItems,
      receiveItems,
      giveCredits,
      receiveCredits,
      giveTotal: giveTotal + giveCredits,
      receiveTotal: receiveTotal + receiveCredits,
    });
    showToast("Trade saved to history", "success");
  }

  const isEmpty = giveItems.length === 0 && receiveItems.length === 0 && giveCredits === 0 && receiveCredits === 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <Breadcrumbs segments={[{ label: t.nav.trade }]} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-pixel)] text-lg text-habbo-gold pixel-text-shadow">
            {t.trade.title}
          </h1>
          <p className="text-sm text-habbo-text-dim mt-1">{t.trade.subtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <HotelSelector value={hotel} onChange={setHotel} />
          {!isEmpty && (
            <>
              <PixelButton variant="ghost" size="sm" onClick={handleSwap}>
                {t.trade.swapSides}
              </PixelButton>
              <PixelButton variant="ghost" size="sm" onClick={handleClear}>
                {t.trade.clearTrade}
              </PixelButton>
              <PixelButton variant="gold" size="sm" onClick={handleSaveTrade}>
                Save Trade
              </PixelButton>
            </>
          )}
        </div>
      </div>

      {isEmpty ? (
        <PixelCard className="p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 pixel-grid-bg opacity-20" />
          <div className="relative z-10">
            <div className="w-16 h-16 mx-auto mb-5 rounded-xl bg-habbo-cyan/10 border border-habbo-cyan/20 flex items-center justify-center animate-float">
              <span className="text-habbo-cyan"><PixelIcon name="trade" size="xl" /></span>
            </div>
            <h2 className="font-[family-name:var(--font-pixel)] text-xs text-habbo-text mb-2">
              {t.trade.empty}
            </h2>
            <p className="text-sm text-habbo-text-dim/70 max-w-md mx-auto">
              {t.trade.emptyHint}
            </p>
          </div>
        </PixelCard>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-4 items-start">
        <TradeSide
          label={t.trade.iGive}
          items={giveItems}
          total={giveItemsTotal}
          credits={giveCredits}
          onCreditsChange={setGiveCredits}
          onAdd={(c, n) => addItem(setGiveItems, c, n)}
          onRemove={(c) => removeItem(setGiveItems, c)}
          onUpdateQuantity={(c, q) => updateQuantity(setGiveItems, c, q)}
          searchPlaceholder={t.trade.searchToAdd}
          perItemLabel={t.trade.perItem}
          creditsLabel={t.trade.credits}
          creditsPlaceholder={t.trade.creditsPlaceholder}
        />

        <div className="flex flex-col items-center justify-center gap-3 lg:pt-14">
          <FairnessIndicator
            giveTotal={giveTotal}
            receiveTotal={receiveTotal}
            loading={anyLoading}
          />
          <button
            onClick={handleSwap}
            className="text-habbo-text-dim hover:text-habbo-cyan transition-colors p-2 rounded-full hover:bg-habbo-card"
            title={t.trade.swapSides}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </button>
        </div>

        <TradeSide
          label={t.trade.iReceive}
          items={receiveItems}
          total={receiveItemsTotal}
          credits={receiveCredits}
          onCreditsChange={setReceiveCredits}
          onAdd={(c, n) => addItem(setReceiveItems, c, n)}
          onRemove={(c) => removeItem(setReceiveItems, c)}
          onUpdateQuantity={(c, q) => updateQuantity(setReceiveItems, c, q)}
          searchPlaceholder={t.trade.searchToAdd}
          perItemLabel={t.trade.perItem}
          creditsLabel={t.trade.credits}
          creditsPlaceholder={t.trade.creditsPlaceholder}
        />
      </div>

      {!isEmpty && (
        <div className="flex flex-wrap justify-center gap-4">
          <PixelCard className="px-5 py-3 text-center">
            <div className="text-[9px] font-[family-name:var(--font-pixel)] text-habbo-text-dim uppercase">
              {t.trade.iGive} {t.trade.totalValue}
            </div>
            <div className="text-sm font-mono font-bold text-habbo-red mt-0.5">
              −{formatCredits(giveTotal)}c
            </div>
            {giveCredits > 0 && giveItemsTotal > 0 && (
              <div className="text-[9px] text-habbo-text-dim/60 font-mono mt-0.5">
                {formatCredits(giveItemsTotal)}c items + {formatCredits(giveCredits)}c
              </div>
            )}
          </PixelCard>
          <PixelCard className="px-5 py-3 text-center">
            <div className="text-[9px] font-[family-name:var(--font-pixel)] text-habbo-text-dim uppercase">
              {t.trade.iReceive} {t.trade.totalValue}
            </div>
            <div className="text-sm font-mono font-bold text-habbo-green mt-0.5">
              +{formatCredits(receiveTotal)}c
            </div>
            {receiveCredits > 0 && receiveItemsTotal > 0 && (
              <div className="text-[9px] text-habbo-text-dim/60 font-mono mt-0.5">
                {formatCredits(receiveItemsTotal)}c items + {formatCredits(receiveCredits)}c
              </div>
            )}
          </PixelCard>
          <PixelCard className="px-5 py-3 text-center">
            <div className="text-[9px] font-[family-name:var(--font-pixel)] text-habbo-text-dim uppercase">
              {t.trade.difference}
            </div>
            <div
              className={`text-sm font-mono font-bold mt-0.5 ${
                receiveTotal >= giveTotal ? "text-habbo-green" : "text-habbo-red"
              }`}
            >
              {receiveTotal >= giveTotal ? "+" : ""}
              {formatCredits(receiveTotal - giveTotal)}c
            </div>
          </PixelCard>
        </div>
      )}
    </div>
  );
}
