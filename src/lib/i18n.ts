export enum Language {
  DE = "de",
  EN = "en",
}

export const DEFAULT_LANGUAGE = Language.DE;

export interface Translations {
  nav: {
    dashboard: string;
    catalog: string;
    compare: string;
  };
  dashboard: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    browseCatalog: string;
    compareFurni: string;
    spotlight: string;
    priceMovers: string;
    popularItems: string;
    loadingMarketData: string;
    totalFurni: string;
    tradeable: string;
    rares: string;
    categories: string;
  };
  catalog: {
    title: string;
    subtitle: string;
    filtersAndSort: string;
    noFurniFound: string;
    noFurniHint: string;
    itemsFound: string;
  };
  filters: {
    hotel: string;
    search: string;
    searchPlaceholder: string;
    category: string;
    allCategories: string;
    furniLine: string;
    allLines: string;
    rare: string;
    rareActive: string;
    tradeable: string;
    sortBy: string;
    name: string;
    price: string;
  };
  furniDetail: {
    backToCatalog: string;
    addToCompare: string;
    inCompare: string;
    avgPrice: string;
    change: string;
    volume: string;
    offers: string;
    high: string;
    low: string;
    priceHistory: string;
    tradeVolume: string;
    comVsDeComparison: string;
    noDataFound: string;
    loadFailed: string;
    categoryLabel: string;
    lineLabel: string;
    typeLabel: string;
    allTime: string;
    credits: string;
  };
  compare: {
    title: string;
    subtitle: string;
    clearAll: string;
    noItems: string;
    noItemsHint: string;
    searchToAdd: string;
    addFurni: string;
    priceComparison: string;
    metricsComparison: string;
    item: string;
    avgLabel: string;
  };
  categories: Record<string, string>;
  common: {
    searchFurni: string;
  };
}

const de: Translations = {
  nav: {
    dashboard: "Dashboard",
    catalog: "Katalog",
    compare: "Vergleichen",
  },
  dashboard: {
    title: "HabboMarket",
    subtitle:
      "Analysiere Marktplatz-Preise, vergleiche Möbel zwischen Hotels und verfolge Trends — alles in einem Dashboard.",
    searchPlaceholder: "Möbel nach Name oder Klassename suchen...",
    browseCatalog: "Katalog durchsuchen",
    compareFurni: "Möbel vergleichen",
    spotlight: "Im Rampenlicht",
    priceMovers: "Preisbewegungen",
    popularItems: "Beliebte Artikel",
    loadingMarketData: "Marktdaten werden geladen...",
    totalFurni: "Gesamt Möbel",
    tradeable: "Handelbar",
    rares: "Seltene",
    categories: "Kategorien",
  },
  catalog: {
    title: "Möbel-Katalog",
    subtitle: "Durchsuche und entdecke Möbel aus allen Habbo Hotels",
    filtersAndSort: "Filter & Sortierung",
    noFurniFound: "Keine Möbel gefunden",
    noFurniHint: "Versuche deine Filter oder Suchbegriffe anzupassen.",
    itemsFound: "Artikel gefunden",
  },
  filters: {
    hotel: "Hotel",
    search: "Suche",
    searchPlaceholder: "Name oder Klassename...",
    category: "Kategorie",
    allCategories: "Alle Kategorien",
    furniLine: "Möbel-Linie",
    allLines: "Alle Linien",
    rare: "Selten",
    rareActive: "★ Selten",
    tradeable: "Handelbar",
    sortBy: "Sortieren",
    name: "Name",
    price: "Preis",
  },
  furniDetail: {
    backToCatalog: "← Zurück zum Katalog",
    addToCompare: "+ Zum Vergleich",
    inCompare: "✓ Im Vergleich",
    avgPrice: "Ø Preis",
    change: "Änderung",
    volume: "Volumen",
    offers: "Angebote",
    high: "Hoch",
    low: "Tief",
    priceHistory: "Preisverlauf",
    tradeVolume: "Handelsvolumen",
    comVsDeComparison: ".COM vs .DE Vergleich",
    noDataFound: "Keine Marktdaten für diesen Artikel gefunden.",
    loadFailed:
      "Marktdaten konnten nicht geladen werden. Der Artikel ist möglicherweise nicht handelbar.",
    categoryLabel: "Kategorie",
    lineLabel: "Linie",
    typeLabel: "Typ",
    allTime: "Alle",
    credits: "Credits",
  },
  compare: {
    title: "Möbel vergleichen",
    subtitle: "Vergleiche bis zu 4 Artikel nebeneinander",
    clearAll: "Alle entfernen",
    noItems: "Keine Artikel zum Vergleichen",
    noItemsHint:
      "Suche unten nach Möbeln oder gehe zum {catalog}, um Artikel zur Vergleichsliste hinzuzufügen.",
    searchToAdd: "Möbel zum Hinzufügen suchen...",
    addFurni: "+ Möbel hinzufügen...",
    priceComparison: "Preisvergleich (90 Tage)",
    metricsComparison: "Kennzahlen-Vergleich",
    item: "Artikel",
    avgLabel: "Ø",
  },
  categories: {
    shelf: "Regale",
    chair: "Stühle",
    table: "Tische",
    bed: "Betten",
    rug: "Teppiche",
    divider: "Raumteiler",
    lamp: "Lampen",
    teleport: "Teleporter",
    building: "Gebäude",
    pets: "Haustiere",
    plant: "Pflanzen",
    gate: "Tore",
    roller: "Rollen",
    other: "Sonstiges",
    unknown: "Unbekannt",
    wall: "Wandobjekte",
  },
  common: {
    searchFurni: "Möbel suchen...",
  },
};

const en: Translations = {
  nav: {
    dashboard: "Dashboard",
    catalog: "Catalog",
    compare: "Compare",
  },
  dashboard: {
    title: "HabboMarket",
    subtitle:
      "Analyze marketplace prices, compare furni across hotels, and track trends — all in one dashboard.",
    searchPlaceholder: "Search any furni by name or classname...",
    browseCatalog: "Browse Catalog",
    compareFurni: "Compare Furni",
    spotlight: "Spotlight",
    priceMovers: "Price Movers",
    popularItems: "Popular Items",
    loadingMarketData: "Loading market data...",
    totalFurni: "Total Furni",
    tradeable: "Tradeable",
    rares: "Rares",
    categories: "Categories",
  },
  catalog: {
    title: "Furni Catalog",
    subtitle: "Browse and discover furniture across Habbo hotels",
    filtersAndSort: "Filters & Sort",
    noFurniFound: "No furni found",
    noFurniHint: "Try adjusting your filters or search terms.",
    itemsFound: "items found",
  },
  filters: {
    hotel: "Hotel",
    search: "Search",
    searchPlaceholder: "Name or classname...",
    category: "Category",
    allCategories: "All Categories",
    furniLine: "Furni Line",
    allLines: "All Lines",
    rare: "Rare",
    rareActive: "★ Rare",
    tradeable: "Tradeable",
    sortBy: "Sort By",
    name: "Name",
    price: "Price",
  },
  furniDetail: {
    backToCatalog: "← Back to Catalog",
    addToCompare: "+ Add to Compare",
    inCompare: "✓ In Compare",
    avgPrice: "Avg Price",
    change: "Change",
    volume: "Volume",
    offers: "Offers",
    high: "High",
    low: "Low",
    priceHistory: "Price History",
    tradeVolume: "Trade Volume",
    comVsDeComparison: ".COM vs .DE Comparison",
    noDataFound: "No marketplace data found for this item.",
    loadFailed:
      "Failed to load marketplace data. The item might not be tradeable.",
    categoryLabel: "Category",
    lineLabel: "Line",
    typeLabel: "Type",
    allTime: "All",
    credits: "credits",
  },
  compare: {
    title: "Compare Furni",
    subtitle: "Compare up to 4 items side-by-side",
    clearAll: "Clear All",
    noItems: "No items to compare",
    noItemsHint:
      "Search for furni below or go to the {catalog} to add items to your compare list.",
    searchToAdd: "Search furni to add...",
    addFurni: "+ Add furni...",
    priceComparison: "Price Comparison (90 days)",
    metricsComparison: "Metrics Comparison",
    item: "Item",
    avgLabel: "avg",
  },
  categories: {
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
  },
  common: {
    searchFurni: "Search furni...",
  },
};

export const translations: Record<Language, Translations> = { de, en };

export function getTranslations(lang: Language): Translations {
  return translations[lang];
}
