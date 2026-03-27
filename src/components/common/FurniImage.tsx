"use client";

import { useState, useEffect, useCallback } from "react";
import { furniImageUrl } from "@/lib/utils";

interface FurniImageProps {
  classname: string;
  alt: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

const sizeClasses = {
  sm: "w-7 h-7",
  md: "w-8 h-8",
  lg: "max-h-full max-w-full",
};

export function FurniImage({
  classname,
  alt,
  className = "",
  size = "md",
}: FurniImageProps) {
  const [src, setSrc] = useState(furniImageUrl(classname));
  const [failed, setFailed] = useState(false);
  const [retries, setRetries] = useState(0);

  useEffect(() => {
    setSrc(furniImageUrl(classname));
    setFailed(false);
    setRetries(0);
  }, [classname]);

  const handleError = useCallback(() => {
    if (retries < MAX_RETRIES) {
      const timer = setTimeout(() => {
        setSrc(`${furniImageUrl(classname)}?r=${retries + 1}`);
        setRetries((r) => r + 1);
      }, RETRY_DELAY);
      return () => clearTimeout(timer);
    } else {
      setFailed(true);
    }
  }, [classname, retries]);

  if (failed) {
    return (
      <div
        className={`${sizeClasses[size]} ${className} flex items-center justify-center bg-habbo-border/20 rounded pixel-border`}
      >
        <svg
          viewBox="0 0 24 24"
          className="w-1/2 h-1/2 text-habbo-text-dim/40"
          fill="currentColor"
        >
          <path d="M4 4h16v16H4V4zm2 2v8l3-3 2 2 4-4 3 3V6H6zm0 12h12v-2l-3-3-4 4-2-2-3 3z" />
        </svg>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`${sizeClasses[size]} object-contain ${className}`}
      loading="lazy"
      onError={handleError}
    />
  );
}
