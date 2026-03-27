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
    favorites: string;
    portfolio: string;
    trade: string;
    arbitrage: string;
    alerts: string;
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
    marketSummary: string;
    marketUp: string;
    marketDown: string;
    marketStable: string;
    avgChange: string;
    itemsTracked: string;
    traderTools: string;
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
    sixMonths: string;
    oneYear: string;
    exportCSV: string;
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
    recentSearches: string;
    clearHistory: string;
  };
  favorites: {
    title: string;
    subtitle: string;
    empty: string;
    emptyHint: string;
    addFavorite: string;
    removeFavorite: string;
  };
  portfolio: {
    title: string;
    subtitle: string;
    empty: string;
    emptyHint: string;
    addToPortfolio: string;
    quantity: string;
    totalItems: string;
    estimatedValue: string;
    remove: string;
    buyPrice: string;
    profitLoss: string;
    totalProfit: string;
  };
  trade: {
    title: string;
    subtitle: string;
    iGive: string;
    iReceive: string;
    searchToAdd: string;
    totalValue: string;
    fairTrade: string;
    slightEdge: string;
    unfairTrade: string;
    difference: string;
    swapSides: string;
    clearTrade: string;
    empty: string;
    emptyHint: string;
    addItems: string;
    perItem: string;
  };
  arbitrage: {
    title: string;
    subtitle: string;
    selectCategory: string;
    scan: string;
    scanning: string;
    stopScan: string;
    scanned: string;
    opportunities: string;
    noResults: string;
    noResultsHint: string;
    comPrice: string;
    dePrice: string;
    diff: string;
    direction: string;
    buyOnCom: string;
    buyOnDe: string;
    minVolume: string;
    minDifference: string;
  };
  alerts: {
    title: string;
    subtitle: string;
    createAlert: string;
    targetPrice: string;
    direction: string;
    above: string;
    below: string;
    active: string;
    triggered: string;
    snoozed: string;
    snooze: string;
    deleteAlert: string;
    reactivate: string;
    empty: string;
    emptyHint: string;
    currentPrice: string;
    created: string;
    triggeredAt: string;
    checking: string;
  };
}

const de: Translations = {
  nav: {
    dashboard: "Dashboard",
    catalog: "Katalog",
    compare: "Vergleichen",
    favorites: "Favoriten",
    portfolio: "Portfolio",
    trade: "Trade",
    arbitrage: "Arbitrage",
    alerts: "Alarme",
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
    marketSummary: "Marktübersicht",
    marketUp: "Markt steigt",
    marketDown: "Markt fällt",
    marketStable: "Markt stabil",
    avgChange: "Ø Änderung",
    itemsTracked: "Artikel beobachtet",
    traderTools: "Trader-Werkzeuge",
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
    sixMonths: "6M",
    oneYear: "1J",
    exportCSV: "CSV Export",
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
    recentSearches: "Letzte Suchen",
    clearHistory: "Verlauf löschen",
  },
  favorites: {
    title: "Favoriten",
    subtitle: "Deine gespeicherten Lieblings-Möbel",
    empty: "Keine Favoriten",
    emptyHint: "Klicke auf das Herz-Symbol bei einem Möbelstück, um es zu speichern.",
    addFavorite: "Favorit hinzufügen",
    removeFavorite: "Favorit entfernen",
  },
  portfolio: {
    title: "Portfolio",
    subtitle: "Verfolge deine Möbel und deren Gesamtwert",
    empty: "Portfolio ist leer",
    emptyHint: "Füge Möbel über den Katalog oder die Detail-Seite zu deinem Portfolio hinzu.",
    addToPortfolio: "+ Portfolio",
    quantity: "Anzahl",
    totalItems: "Gesamt Stück",
    estimatedValue: "Geschätzter Wert",
    remove: "Entfernen",
    buyPrice: "Kaufpreis",
    profitLoss: "Gewinn/Verlust",
    totalProfit: "Gesamt G/V",
  },
  trade: {
    title: "Trade Rechner",
    subtitle: "Berechne ob ein Trade fair ist, bevor du tauschst",
    iGive: "Ich gebe",
    iReceive: "Ich bekomme",
    searchToAdd: "Möbel suchen & hinzufügen...",
    totalValue: "Gesamtwert",
    fairTrade: "Fairer Trade",
    slightEdge: "Leichter Vorteil",
    unfairTrade: "Unfairer Trade",
    difference: "Differenz",
    swapSides: "Seiten tauschen",
    clearTrade: "Trade leeren",
    empty: "Kein Trade eingerichtet",
    emptyHint: "Füge Möbel auf beiden Seiten hinzu, um den Trade-Wert zu berechnen.",
    addItems: "Artikel hinzufügen",
    perItem: "pro Stück",
  },
  arbitrage: {
    title: "Arbitrage Finder",
    subtitle: "Finde Preisunterschiede zwischen .COM und .DE Hotels",
    selectCategory: "Kategorie wählen",
    scan: "Scannen",
    scanning: "Scanne...",
    stopScan: "Scan stoppen",
    scanned: "gescannt",
    opportunities: "Möglichkeiten",
    noResults: "Keine Ergebnisse",
    noResultsHint: "Wähle eine Kategorie und starte den Scan, um Preisunterschiede zu finden.",
    comPrice: ".COM Preis",
    dePrice: ".DE Preis",
    diff: "Diff",
    direction: "Richtung",
    buyOnCom: "Kauf auf .COM",
    buyOnDe: "Kauf auf .DE",
    minVolume: "Min. Volumen",
    minDifference: "Min. Differenz %",
  },
  alerts: {
    title: "Preis-Alarme",
    subtitle: "Überwache Preise und werde benachrichtigt wenn Schwellen erreicht werden",
    createAlert: "Alarm erstellen",
    targetPrice: "Zielpreis",
    direction: "Richtung",
    above: "Über",
    below: "Unter",
    active: "Aktiv",
    triggered: "Ausgelöst",
    snoozed: "Pausiert",
    snooze: "Pausieren",
    deleteAlert: "Löschen",
    reactivate: "Reaktivieren",
    empty: "Keine Alarme",
    emptyHint: "Erstelle einen Alarm, um benachrichtigt zu werden wenn ein Preis dein Ziel erreicht.",
    currentPrice: "Aktueller Preis",
    created: "Erstellt",
    triggeredAt: "Ausgelöst am",
    checking: "Prüfe...",
  },
};

const en: Translations = {
  nav: {
    dashboard: "Dashboard",
    catalog: "Catalog",
    compare: "Compare",
    favorites: "Favorites",
    portfolio: "Portfolio",
    trade: "Trade",
    arbitrage: "Arbitrage",
    alerts: "Alerts",
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
    marketSummary: "Market Overview",
    marketUp: "Market trending up",
    marketDown: "Market trending down",
    marketStable: "Market stable",
    avgChange: "Avg Change",
    itemsTracked: "Items tracked",
    traderTools: "Trader Tools",
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
    sixMonths: "6M",
    oneYear: "1Y",
    exportCSV: "CSV Export",
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
    recentSearches: "Recent Searches",
    clearHistory: "Clear History",
  },
  favorites: {
    title: "Favorites",
    subtitle: "Your saved favorite furni",
    empty: "No favorites yet",
    emptyHint: "Click the heart icon on any furni to save it here.",
    addFavorite: "Add to favorites",
    removeFavorite: "Remove from favorites",
  },
  portfolio: {
    title: "Portfolio",
    subtitle: "Track your furni and estimated total value",
    empty: "Portfolio is empty",
    emptyHint: "Add furni from the catalog or detail page to track your collection.",
    addToPortfolio: "+ Portfolio",
    quantity: "Qty",
    totalItems: "Total Items",
    estimatedValue: "Est. Value",
    remove: "Remove",
    buyPrice: "Buy Price",
    profitLoss: "Profit/Loss",
    totalProfit: "Total P/L",
  },
  trade: {
    title: "Trade Calculator",
    subtitle: "Calculate if a trade is fair before you swap",
    iGive: "I Give",
    iReceive: "I Receive",
    searchToAdd: "Search furni to add...",
    totalValue: "Total Value",
    fairTrade: "Fair Trade",
    slightEdge: "Slight Edge",
    unfairTrade: "Unfair Trade",
    difference: "Difference",
    swapSides: "Swap Sides",
    clearTrade: "Clear Trade",
    empty: "No trade set up",
    emptyHint: "Add furni to both sides to calculate trade value.",
    addItems: "Add items",
    perItem: "per item",
  },
  arbitrage: {
    title: "Arbitrage Finder",
    subtitle: "Find price gaps between .COM and .DE hotels",
    selectCategory: "Select Category",
    scan: "Scan",
    scanning: "Scanning...",
    stopScan: "Stop Scan",
    scanned: "scanned",
    opportunities: "opportunities",
    noResults: "No results",
    noResultsHint: "Select a category and start scanning to find price differences.",
    comPrice: ".COM Price",
    dePrice: ".DE Price",
    diff: "Diff",
    direction: "Direction",
    buyOnCom: "Buy on .COM",
    buyOnDe: "Buy on .DE",
    minVolume: "Min Volume",
    minDifference: "Min Difference %",
  },
  alerts: {
    title: "Price Alerts",
    subtitle: "Monitor prices and get notified when thresholds are hit",
    createAlert: "Create Alert",
    targetPrice: "Target Price",
    direction: "Direction",
    above: "Above",
    below: "Below",
    active: "Active",
    triggered: "Triggered",
    snoozed: "Snoozed",
    snooze: "Snooze",
    deleteAlert: "Delete",
    reactivate: "Reactivate",
    empty: "No alerts",
    emptyHint: "Create an alert to get notified when a price hits your target.",
    currentPrice: "Current Price",
    created: "Created",
    triggeredAt: "Triggered at",
    checking: "Checking...",
  },
};

export const translations: Record<Language, Translations> = { de, en };

export function getTranslations(lang: Language): Translations {
  return translations[lang];
}
