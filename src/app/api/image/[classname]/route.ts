import { NextRequest, NextResponse } from "next/server";
import { MARKET_API_BASE, IMAGE_API_PATH } from "@/lib/constants";

const HABBO_CDN_BASE = "https://images.habbo.com/dcr/hof_furni";
const MAX_202_RETRIES = 2;
const RETRY_WAIT_MS = 3000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function stripVariant(classname: string): string {
  const idx = classname.indexOf("*");
  return idx >= 0 ? classname.substring(0, idx) : classname;
}

async function tryFetchImage(url: string): Promise<ArrayBuffer | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (res.status === 200) {
      const ct = res.headers.get("content-type") ?? "";
      if (ct.includes("image")) {
        return res.arrayBuffer();
      }
    }
  } catch {
    // timeout or network error
  }
  return null;
}

async function tryFetchWithRetry(url: string): Promise<ArrayBuffer | null> {
  let attempts = 0;
  while (attempts <= MAX_202_RETRIES) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ classname: string }> }
) {
  try {
    const { classname } = await params;
    const revision = request.nextUrl.searchParams.get("rev");
    const base = stripVariant(classname);
    const hasVariant = classname.includes("*");

    // 1) Primary: habboapi.site with full classname
    const primaryUrl = `${MARKET_API_BASE}${IMAGE_API_PATH}/${encodeURIComponent(classname)}`;
    const img1 = await tryFetchWithRetry(primaryUrl);
    if (img1) {
      return new NextResponse(img1, {
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": "public, max-age=604800, immutable",
        },
      });
    }

    // 2) If variant, try base classname on habboapi.site
    if (hasVariant) {
      const baseUrl = `${MARKET_API_BASE}${IMAGE_API_PATH}/${encodeURIComponent(base)}`;
      const img2 = await tryFetchWithRetry(baseUrl);
      if (img2) {
        return new NextResponse(img2, {
          headers: {
            "Content-Type": "image/png",
            "Cache-Control": "public, max-age=604800, immutable",
          },
        });
      }
    }

    // 3) Habbo CDN with revision (if provided)
    if (revision) {
      const cdnUrl = `${HABBO_CDN_BASE}/${revision}/${encodeURIComponent(base)}_icon.png`;
      const img3 = await tryFetchImage(cdnUrl);
      if (img3) {
        return new NextResponse(img3, {
          headers: {
            "Content-Type": "image/png",
            "Cache-Control": "public, max-age=604800, immutable",
          },
        });
      }
    }

    return new NextResponse(null, { status: 404 });
  } catch {
    return new NextResponse(null, { status: 500 });
  }
}
