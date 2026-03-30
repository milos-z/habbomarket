"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FurniImage } from "@/components/common/FurniImage";
import { PixelCard } from "@/components/common/PixelCard";
import { SectionHeader } from "@/components/common/SectionHeader";

const STORAGE_KEY = "habbomarket-recently-viewed";
const MAX_ITEMS = 8;

export interface RecentItem {
  classname: string;
  name: string;
  timestamp: number;
}

export function addRecentlyViewed(classname: string, name: string) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const items: RecentItem[] = raw ? JSON.parse(raw) : [];
    const filtered = items.filter((i) => i.classname !== classname);
    const updated = [{ classname, name, timestamp: Date.now() }, ...filtered].slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    /* noop */
  }
}

export function RecentlyViewed() {
  const [items, setItems] = useState<RecentItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* noop */
    }
  }, []);

  if (items.length === 0) return null;

  return (
    <PixelCard className="p-5">
      <SectionHeader title="Recently Viewed" icon="star" color="cyan" />
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-thin">
        {items.map((item) => (
          <Link
            key={item.classname}
            href={`/furni/${encodeURIComponent(item.classname)}`}
            className="shrink-0 w-24 group text-center"
          >
            <div className="w-20 h-16 mx-auto flex items-center justify-center bg-habbo-bg/40 rounded-lg mb-1.5 group-hover:bg-habbo-card-hover transition-colors">
              <FurniImage
                classname={item.classname}
                alt={item.name}
                size="md"
                className="group-hover:scale-110 transition-transform"
              />
            </div>
            <div className="text-[10px] text-habbo-text-dim group-hover:text-habbo-cyan truncate transition-colors">
              {item.name}
            </div>
          </Link>
        ))}
      </div>
    </PixelCard>
  );
}
