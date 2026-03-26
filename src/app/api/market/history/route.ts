import { NextRequest, NextResponse } from "next/server";
import { getCached, setCache, TTL } from "@/lib/cache";
import { MARKET_API_BASE } from "@/lib/constants";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const classname = searchParams.get("classname");
    const hotel = searchParams.get("hotel") || "com";
    const days = searchParams.get("days") || "90";

    if (!classname) {
      return NextResponse.json(
        { error: "classname parameter is required" },
        { status: 400 }
      );
    }

    const cacheKey = `market_${hotel}_${classname}_${days}`;
    const cached = getCached<unknown>(cacheKey);
    if (cached) {
      return NextResponse.json(cached, {
        headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60" },
      });
    }

    const apiUrl = new URL(`${MARKET_API_BASE}/api/market/history`);
    apiUrl.searchParams.set("classname", classname);
    apiUrl.searchParams.set("hotel", hotel);
    if (days !== "all") {
      apiUrl.searchParams.set("days", days);
    }

    const res = await fetch(apiUrl.toString(), {
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      if (res.status === 429) {
        return NextResponse.json(
          { error: "Rate limited. Please try again shortly." },
          { status: 429 }
        );
      }
      return NextResponse.json(
        { error: `Market API returned ${res.status}` },
        { status: res.status }
      );
    }

    const data: unknown = await res.json();
    setCache(cacheKey, data, TTL.MARKET_HISTORY);

    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
