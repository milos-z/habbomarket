import { HotelDomain, SortField, SortDirection } from "./types";
import type { HotelConfig, CatalogFilters } from "./types";

export const HOTELS: Record<HotelDomain, HotelConfig> = {
  [HotelDomain.DE]: {
    domain: HotelDomain.DE,
    label: "Habbo.de",
    baseUrl: "https://www.habbo.de",
    flag: "DE",
  },
  [HotelDomain.COM]: {
    domain: HotelDomain.COM,
    label: "Habbo.com",
    baseUrl: "https://www.habbo.com",
    flag: "COM",
  },
  [HotelDomain.ES]: {
    domain: HotelDomain.ES,
    label: "Habbo.es",
    baseUrl: "https://www.habbo.es",
    flag: "ES",
  },
  [HotelDomain.FR]: {
    domain: HotelDomain.FR,
    label: "Habbo.fr",
    baseUrl: "https://www.habbo.fr",
    flag: "FR",
  },
  [HotelDomain.IT]: {
    domain: HotelDomain.IT,
    label: "Habbo.it",
    baseUrl: "https://www.habbo.it",
    flag: "IT",
  },
  [HotelDomain.FI]: {
    domain: HotelDomain.FI,
    label: "Habbo.fi",
    baseUrl: "https://www.habbo.fi",
    flag: "FI",
  },
  [HotelDomain.NL]: {
    domain: HotelDomain.NL,
    label: "Habbo.nl",
    baseUrl: "https://www.habbo.nl",
    flag: "NL",
  },
  [HotelDomain.BR]: {
    domain: HotelDomain.BR,
    label: "Habbo.com.br",
    baseUrl: "https://www.habbo.com.br",
    flag: "BR",
  },
  [HotelDomain.TR]: {
    domain: HotelDomain.TR,
    label: "Habbo.com.tr",
    baseUrl: "https://www.habbo.com.tr",
    flag: "TR",
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
  hotel: HotelDomain.DE,
  sortField: SortField.NAME,
  sortDirection: SortDirection.ASC,
  page: 1,
  perPage: 48,
};

export const CATEGORY_LABELS: Record<string, string> = {
  chair: "Chairs",
  table: "Tables",
  bed: "Beds",
  shelf: "Shelves",
  rug: "Rugs",
  divider: "Dividers",
  lighting: "Lighting",
  gate: "Gates",
  vending_machine: "Vending Machines",
  teleport: "Teleports",
  pets: "Pets",
  games: "Games",
  music: "Music",
  trophy: "Trophies",
  food: "Food & Drink",
  floor: "Floor Deco",
  credit: "Credits",
  roller: "Rollers",
  tent: "Tents",
  wall: "Wall Items",
  wall_decoration: "Wall Deco",
  wired: "Wired",
  wired_effect: "Wired Effects",
  wired_condition: "Wired Conditions",
  wired_trigger: "Wired Triggers",
  wired_add_on: "Wired Add-ons",
  sound_fx: "Sound FX",
  present: "Presents",
  extras: "Extras",
  fortuna: "Fortuna",
  leaderboards: "Leaderboards",
  window: "Windows",
  other: "Other",
  unknown: "Unknown",
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
