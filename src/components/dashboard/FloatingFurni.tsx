"use client";

import { useEffect, useState } from "react";
import { FurniImage } from "@/components/common/FurniImage";

const FURNI_ITEMS = [
  "throne",
  "rare_dragonlamp*1",
  "rare_fountain",
  "club_sofa",
  "rare_parasol*1",
  "exe_floorlight",
];

interface FloatingItem {
  classname: string;
  x: number;
  y: number;
  delay: number;
  duration: number;
  size: number;
}

export function FloatingFurni() {
  const [items, setItems] = useState<FloatingItem[]>([]);

  useEffect(() => {
    const generated = FURNI_ITEMS.map((classname, i) => ({
      classname,
      x: 8 + (i % 3) * 35 + Math.random() * 15,
      y: 10 + Math.floor(i / 3) * 40 + Math.random() * 20,
      delay: i * 0.5,
      duration: 3 + Math.random() * 2,
      size: 28 + Math.random() * 16,
    }));
    setItems(generated);
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
          />
        </div>
      ))}
    </>
  );
}
