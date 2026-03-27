export enum HotelDomain {
  COM = "com",
  DE = "de",
}

export enum FurniType {
  ROOM_ITEM = "roomItem",
  WALL_ITEM = "wallItem",
}

export enum SortField {
  NAME = "name",
  PRICE = "price",
  VOLUME = "volume",
  PRICE_CHANGE = "priceChange",
}

export enum SortDirection {
  ASC = "asc",
  DESC = "desc",
}

export interface FurniItem {
  id: number;
  classname: string;
  name: string;
  description: string;
  category: string;
  furniline: string;
  revision: number;
  rare: boolean;
  tradeable: boolean;
  furniType: FurniType;
  xdim: number;
  ydim: number;
}

export interface HistoryEntry {
  avgPrice: number;
  soldItems: number;
  creditSum: number;
  openOffers: number;
  timestamp: number;
}

export interface MarketData {
  className: string;
  furniName: string;
  furniDescription: string;
  line: string;
  category: string;
  revision: number;
  furniType: string;
  marketData: {
    history: HistoryEntry[];
    averagePrice: number;
    lastUpdated: string;
  };
  hotelDomain: HotelDomain;
}

export interface FurniCatalogResponse {
  roomitemtypes: {
    furnitype: RawFurniItem[];
  };
  wallitemtypes: {
    furnitype: RawFurniItem[];
  };
}

export interface RawFurniItem {
  id: number;
  classname: string;
  name: string;
  description: string;
  category: string;
  furniline: string;
  revision: number;
  rare: boolean;
  tradeable: boolean;
  xdim: number;
  ydim: number;
}

export interface CatalogFilters {
  search: string;
  category: string;
  furniline: string;
  rareOnly: boolean;
  tradeableOnly: boolean;
  hotel: HotelDomain;
  sortField: SortField;
  sortDirection: SortDirection;
  page: number;
  perPage: number;
}

export interface CompareItem {
  classname: string;
  name: string;
}

export interface HotelConfig {
  domain: HotelDomain;
  label: string;
  baseUrl: string;
  flag: string;
}

// --- Trade Calculator ---

export interface TradeItem {
  classname: string;
  name: string;
  quantity: number;
  avgPrice: number;
  loading: boolean;
}

export enum TradeFairness {
  FAIR = "fair",
  SLIGHT_EDGE = "edge",
  UNFAIR = "unfair",
}

// --- Arbitrage Finder ---

export interface ArbitrageResult {
  classname: string;
  name: string;
  comPrice: number;
  dePrice: number;
  comVolume: number;
  deVolume: number;
  difference: number;
  differencePercent: number;
  direction: ArbitrageDirection;
}

export enum ArbitrageDirection {
  BUY_COM_SELL_DE = "buyComSellDe",
  BUY_DE_SELL_COM = "buyDeSellCom",
}

// --- Price Alerts ---

export interface PriceAlert {
  id: string;
  classname: string;
  name: string;
  targetPrice: number;
  direction: AlertDirection;
  hotel: HotelDomain;
  status: AlertStatus;
  currentPrice: number;
  createdAt: number;
  triggeredAt?: number;
}

export enum AlertDirection {
  ABOVE = "above",
  BELOW = "below",
}

export enum AlertStatus {
  ACTIVE = "active",
  TRIGGERED = "triggered",
  SNOOZED = "snoozed",
}
