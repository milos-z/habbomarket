import { HotelDomain, SortField, SortDirection } from "./types";
import type { HotelConfig, CatalogFilters } from "./types";

export const HOTELS: Record<HotelDomain, HotelConfig> = {
  [HotelDomain.COM]: {
    domain: HotelDomain.COM,
    label: "Habbo.com",
    baseUrl: "https://www.habbo.com",
    flag: "🇺🇸",
  },
  [HotelDomain.DE]: {
    domain: HotelDomain.DE,
    label: "Habbo.de",
    baseUrl: "https://www.habbo.de",
    flag: "🇩🇪",
  },
};

export const MARKET_API_BASE = "https://habboapi.site";
export const FURNIDATA_PATH = "/gamedata/furnidata_json/1";
export const IMAGE_API_PATH = "/api/image";

export const DEFAULT_FILTERS: CatalogFilters = {
  search: "",
  category: "",
  furniline: "",
  rareOnly: false,
  tradeableOnly: true,
  hotel: HotelDomain.COM,
  sortField: SortField.NAME,
  sortDirection: SortDirection.ASC,
  page: 1,
  perPage: 48,
};

export const CATEGORY_LABELS: Record<string, string> = {
  shelf: "Shelves",
  chair: "Chairs",
  table: "Tables",
  bed: "Beds",
  rug: "Rugs",
  divider: "Dividers",
  lamp: "Lamps",
  teleport: "Teleports",
  building: "Building",
  pets: "Pets",
  plant: "Plants",
  gate: "Gates",
  roller: "Rollers",
  other: "Other",
  unknown: "Unknown",
  wall: "Wall Items",
};

export const CHART_COLORS = {
  primary: "#00d4ff",
  secondary: "#f5c842",
  green: "#3dd68c",
  red: "#ff4757",
  purple: "#a66bff",
  grid: "rgba(42, 63, 110, 0.4)",
  gridText: "#8899b8",
};

export const ITEMS_PER_PAGE = 48;
