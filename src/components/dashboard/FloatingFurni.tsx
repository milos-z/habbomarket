"use client";

import { useEffect, useState } from "react";
import { FurniImage } from "@/components/common/FurniImage";
import type { FurniItem } from "@/lib/types";
import { HotelDomain } from "@/lib/types";

interface FloatingItem {
  classname: string;
  revision: number;
  x: number;
  y: number;
  delay: number;
  duration: number;
  size: number;
}

const PREFERRED = [
  "throne",
  "rare_fountain",
  "club_sofa",
  "exe_floorlight",
  "rare_elephant_statue",
  "val11_rare",
];

export function FloatingFurni() {
  const [items, setItems] = useState<FloatingItem[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(
          `/api/furnidata?hotel=${HotelDomain.DE}&tradeableOnly=true&limit=200`
        );
        if (!res.ok) return;
        const data: FurniItem[] = await res.json();

        const preferred = PREFERRED
          .map((cn) => data.find((i) => i.classname === cn))
          .filter((i): i is FurniItem => !!i);

        const rares = data
          .filter((i) => i.rare && !PREFERRED.includes(i.classname))
          .slice(0, 6);

        const pool = [...preferred, ...rares].slice(0, 6);

        if (cancelled || pool.length === 0) return;

        const generated = pool.map((item, i) => ({
          classname: item.classname,
          revision: item.revision,
          x: 8 + (i % 3) * 35 + Math.random() * 15,
          y: 10 + Math.floor(i / 3) * 40 + Math.random() * 20,
          delay: i * 0.5,
          duration: 3 + Math.random() * 2,
          size: 28 + Math.random() * 16,
        }));

        setItems(generated);
      } catch {
        /* noop */
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      {items.map((item, i) => (
        <div
          key={i}
          className="absolute pointer-events-none opacity-[0.08] animate-float"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            animationDelay: `${item.delay}s`,
            animationDuration: `${item.duration}s`,
            width: item.size,
            height: item.size,
          }}
        >
          <FurniImage
            classname={item.classname}
            alt=""
            size="md"
            revision={item.revision}
          />
        </div>
      ))}
    </>
  );
}
