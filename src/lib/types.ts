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
