import type { FurniItem, MarketData, HotelDomain, HistoryEntry } from "./types";

export async function fetchFurnidata(hotel: HotelDomain): Promise<FurniItem[]> {
  const res = await fetch(`/api/furnidata?hotel=${hotel}`);
  if (!res.ok) throw new Error(`Failed to fetch furnidata: ${res.status}`);
  return res.json();
}

interface RawMarketResponse {
  ClassName: string;
  FurniName: string;
  FurniDescription: string;
  Line: string;
  Category: string;
  Revision: number;
  FurniType: string;
  marketData: {
    history: [number, number, number, number, number][];
    averagePrice: number;
    lastUpdated: string;
  };
  hotel_domain: string;
}

function mapMarketResponse(raw: RawMarketResponse, hotel: HotelDomain): MarketData {
  return {
    className: raw.ClassName,
    furniName: raw.FurniName,
    furniDescription: raw.FurniDescription,
    line: raw.Line,
    category: raw.Category,
    revision: raw.Revision,
    furniType: raw.FurniType,
    marketData: {
      history: (raw.marketData?.history ?? []).map(
        ([avgPrice, soldItems, creditSum, openOffers, timestamp]): HistoryEntry => ({
          avgPrice,
          soldItems,
          creditSum,
          openOffers,
          timestamp,
        })
      ),
      averagePrice: raw.marketData?.averagePrice ?? 0,
      lastUpdated: raw.marketData?.lastUpdated ?? "",
    },
    hotelDomain: hotel,
  };
}

export async function fetchMarketHistory(
  classname: string,
  hotel: HotelDomain,
  days?: number
): Promise<MarketData[]> {
  const params = new URLSearchParams({ classname, hotel });
  if (days) params.set("days", String(days));
  const res = await fetch(`/api/market/history?${params}`);
  if (!res.ok) throw new Error(`Failed to fetch market history: ${res.status}`);
  const json: unknown = await res.json();
  if (!Array.isArray(json)) return [];
  const rawData = json as RawMarketResponse[];
  return rawData
    .filter((item) => item && item.ClassName && item.marketData)
    .map((item) => mapMarketResponse(item, hotel));
}
