import { NextRequest, NextResponse } from "next/server";
import { getCached, setCache, TTL } from "@/lib/cache";
import { HotelDomain, FurniType } from "@/lib/types";
import type { FurniItem, FurniCatalogResponse } from "@/lib/types";
import { HOTELS, FURNIDATA_PATH } from "@/lib/constants";

function parseFurnidata(raw: FurniCatalogResponse): FurniItem[] {
  const items: FurniItem[] = [];

  for (const entry of raw.roomitemtypes?.furnitype ?? []) {
    items.push({
      id: entry.id,
      classname: entry.classname,
      name: entry.name || entry.classname,
      description: entry.description || "",
      category: entry.category || "unknown",
      furniline: entry.furniline || "",
      revision: entry.revision,
      rare: entry.rare ?? false,
      tradeable: entry.tradeable ?? false,
      furniType: FurniType.ROOM_ITEM,
      xdim: entry.xdim ?? 1,
      ydim: entry.ydim ?? 1,
    });
  }

  for (const entry of raw.wallitemtypes?.furnitype ?? []) {
    items.push({
      id: entry.id,
      classname: entry.classname,
      name: entry.name || entry.classname,
      description: entry.description || "",
      category: "wall",
      furniline: entry.furniline || "",
      revision: entry.revision,
      rare: entry.rare ?? false,
      tradeable: entry.tradeable ?? false,
      furniType: FurniType.WALL_ITEM,
      xdim: 1,
      ydim: 1,
    });
  }

  return items;
}

async function loadFurnidata(hotel: HotelDomain): Promise<FurniItem[]> {
  const cacheKey = `furnidata_${hotel}`;
  const cached = getCached<FurniItem[]>(cacheKey);
  if (cached) return cached;

  const config = HOTELS[hotel];
  if (!config) throw new Error(`Unknown hotel: ${hotel}`);

  const res = await fetch(`${config.baseUrl}${FURNIDATA_PATH}`, {
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error(`Habbo API returned ${res.status}`);
  }

  const raw: FurniCatalogResponse = await res.json();
  const items = parseFurnidata(raw);
  setCache(cacheKey, items, TTL.FURNIDATA);
  return items;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const hotel = (searchParams.get("hotel") as HotelDomain) || HotelDomain.DE;
    const search = searchParams.get("search")?.toLowerCase() ?? "";
    const category = searchParams.get("category") ?? "";
    const furniline = searchParams.get("furniline") ?? "";
    const rareOnly = searchParams.get("rareOnly") === "true";
    const tradeableOnly = searchParams.get("tradeableOnly") !== "false";
    const limit = parseInt(searchParams.get("limit") ?? "0", 10);

    let items = await loadFurnidata(hotel);

    if (search) {
      items = items.filter(
        (i) =>
          i.name.toLowerCase().includes(search) ||
          i.classname.toLowerCase().includes(search) ||
          i.description.toLowerCase().includes(search)
      );
    }
    if (category) {
      items = items.filter((i) => i.category === category);
    }
    if (furniline) {
      items = items.filter((i) => i.furniline === furniline);
    }
    if (rareOnly) {
      items = items.filter((i) => i.rare);
    }
    if (tradeableOnly) {
      items = items.filter((i) => i.tradeable);
    }
    if (limit > 0) {
      items = items.slice(0, limit);
    }

    return NextResponse.json(items, {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
