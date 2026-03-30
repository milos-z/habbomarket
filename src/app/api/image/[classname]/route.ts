import { NextRequest, NextResponse } from "next/server";
import { getCached } from "@/lib/cache";
import { MARKET_API_BASE, IMAGE_API_PATH } from "@/lib/constants";
import type { FurniItem } from "@/lib/types";
import { HotelDomain } from "@/lib/types";

const HABBO_CDN_BASE = "https://images.habbo.com/dcr/hof_furni";
const HABBO_CATALOGUE_CDN = "https://images.habbo.com/c_images/catalogue";
const MAX_202_RETRIES = 2;
const RETRY_WAIT_MS = 2000;

const failedClassnames = new Map<string, number>();
const FAILED_TTL_MS = 30 * 60 * 1000;
const FAILED_CACHE_MAX = 5000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function stripVariant(classname: string): string {
  const idx = classname.indexOf("*");
  return idx >= 0 ? classname.substring(0, idx) : classname;
}

function lookupRevisionFromCache(classname: string): number | null {
  const base = stripVariant(classname);
  const hotels = Object.values(HotelDomain);

  for (const hotel of hotels) {
    const items = getCached<FurniItem[]>(`furnidata_${hotel}`);
    if (!items) continue;

    const match = items.find(
      (i) => i.classname === classname || stripVariant(i.classname) === base
    );
    if (match?.revision) return match.revision;
  }

  return null;
}

async function tryFetchImage(url: string): Promise<ArrayBuffer | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (res.status === 200) {
      const ct = res.headers.get("content-type") ?? "";
      if (ct.includes("image")) {
        return res.arrayBuffer();
      }
    }
  } catch {
    /* timeout or network error */
  }
  return null;
}

async function tryFetchWithRetry(url: string): Promise<ArrayBuffer | null> {
  let attempts = 0;
  while (attempts <= MAX_202_RETRIES) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
      if (res.status === 200) {
        const ct = res.headers.get("content-type") ?? "";
        if (ct.includes("image")) {
          return res.arrayBuffer();
        }
      }
      if (res.status === 202) {
        attempts++;
        if (attempts <= MAX_202_RETRIES) {
          await sleep(RETRY_WAIT_MS);
          continue;
        }
      }
      break;
    } catch {
      break;
    }
  }
  return null;
}

function imageResponse(data: ArrayBuffer): NextResponse {
  return new NextResponse(data, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=604800, immutable",
    },
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ classname: string }> }
) {
  try {
    const { classname } = await params;
    const revParam = request.nextUrl.searchParams.get("rev") || undefined;
    const base = stripVariant(classname);
    const hasVariant = classname.includes("*");

    const failedAt = failedClassnames.get(classname);
    if (failedAt && Date.now() - failedAt < FAILED_TTL_MS) {
      return new NextResponse(null, {
        status: 404,
        headers: { "Cache-Control": "public, max-age=1800" },
      });
    }

    // 1) habboapi.site — full classname
    const primaryUrl = `${MARKET_API_BASE}${IMAGE_API_PATH}/${encodeURIComponent(classname)}`;
    const img1 = await tryFetchWithRetry(primaryUrl);
    if (img1) return imageResponse(img1);

    // 2) habboapi.site — base classname (for variants)
    if (hasVariant) {
      const baseUrl = `${MARKET_API_BASE}${IMAGE_API_PATH}/${encodeURIComponent(base)}`;
      const img2 = await tryFetchWithRetry(baseUrl);
      if (img2) return imageResponse(img2);
    }

    // 3) Habbo CDN — resolve revision from URL param OR furnidata cache
    const revision = revParam ?? lookupRevisionFromCache(classname)?.toString();
    if (revision) {
      const cdnUrl = `${HABBO_CDN_BASE}/${revision}/${encodeURIComponent(base)}_icon.png`;
      const img3 = await tryFetchImage(cdnUrl);
      if (img3) return imageResponse(img3);

      const cdnSmall = `${HABBO_CDN_BASE}/${revision}/${encodeURIComponent(base)}_small.png`;
      const img3b = await tryFetchImage(cdnSmall);
      if (img3b) return imageResponse(img3b);
    }

    // 4) Habbo catalogue images CDN (no revision needed)
    const catalogueUrls = [
      `${HABBO_CATALOGUE_CDN}/${encodeURIComponent(base)}_icon.png`,
      `${HABBO_CATALOGUE_CDN}/${encodeURIComponent(base)}.png`,
    ];
    for (const url of catalogueUrls) {
      const img = await tryFetchImage(url);
      if (img) return imageResponse(img);
    }

    // All sources exhausted — cache failure
    if (failedClassnames.size < FAILED_CACHE_MAX) {
      failedClassnames.set(classname, Date.now());
    }

    return new NextResponse(null, {
      status: 404,
      headers: { "Cache-Control": "public, max-age=1800" },
    });
  } catch {
    return new NextResponse(null, { status: 500 });
  }
}
