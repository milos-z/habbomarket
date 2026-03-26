import { NextRequest, NextResponse } from "next/server";
import { MARKET_API_BASE, IMAGE_API_PATH } from "@/lib/constants";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ classname: string }> }
) {
  try {
    const { classname } = await params;
    const imageUrl = `${MARKET_API_BASE}${IMAGE_API_PATH}/${encodeURIComponent(classname)}`;

    const res = await fetch(imageUrl);

    if (res.status === 202) {
      return NextResponse.json(
        { message: "Image is being generated, retry shortly" },
        { status: 202 }
      );
    }

    if (!res.ok) {
      return new NextResponse(null, { status: res.status });
    }

    const buffer = await res.arrayBuffer();
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400, immutable",
      },
    });
  } catch {
    return new NextResponse(null, { status: 500 });
  }
}
