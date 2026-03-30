"use client";

import { useState, useEffect, useCallback } from "react";
import { furniImageUrl } from "@/lib/utils";

interface FurniImageProps {
  classname: string;
  alt: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  revision?: number;
}

const MAX_RETRIES = 1;
const RETRY_DELAY = 1500;

const sizeClasses = {
  sm: "w-7 h-7",
  md: "w-8 h-8",
  lg: "max-h-full max-w-full",
};

const knownBroken = new Set<string>();

export function FurniImage({
  classname,
  alt,
  className = "",
  size = "md",
  revision,
}: FurniImageProps) {
  const [src, setSrc] = useState(() =>
    knownBroken.has(classname) ? "" : furniImageUrl(classname, revision)
  );
  const [failed, setFailed] = useState(() => knownBroken.has(classname));
  const [loading, setLoading] = useState(() => !knownBroken.has(classname));
  const [retries, setRetries] = useState(0);

  useEffect(() => {
    if (knownBroken.has(classname)) {
      setFailed(true);
      setLoading(false);
      setSrc("");
      return;
    }
    setSrc(furniImageUrl(classname, revision));
    setFailed(false);
    setLoading(true);
    setRetries(0);
  }, [classname, revision]);

  const handleError = useCallback(() => {
    if (retries < MAX_RETRIES) {
      setTimeout(() => {
        const baseUrl = furniImageUrl(classname, revision);
        const sep = baseUrl.includes("?") ? "&" : "?";
        setSrc(`${baseUrl}${sep}_r=${retries + 1}`);
        setRetries((r) => r + 1);
      }, RETRY_DELAY);
    } else {
      knownBroken.add(classname);
      setFailed(true);
      setLoading(false);
    }
  }, [retries, classname, revision]);

  const handleLoad = useCallback(() => {
    setLoading(false);
  }, []);

  if (failed) {
    return (
      <div
        className={`${sizeClasses[size]} ${className} flex items-center justify-center bg-habbo-border/20 rounded pixel-border`}
        title={alt || classname}
      >
        <svg
          viewBox="0 0 24 24"
          className="w-1/2 h-1/2 text-habbo-text-dim/30"
          fill="currentColor"
        >
          <path d="M21 3H3a1 1 0 00-1 1v16a1 1 0 001 1h18a1 1 0 001-1V4a1 1 0 00-1-1zm-1 16H4V5h16v14zm-5.04-6.71l-2.75 3.54-1.96-2.36L8.5 16h7l-1.54-3.71z" />
        </svg>
      </div>
    );
  }

  return (
    <div className={`${sizeClasses[size]} ${className} relative flex items-center justify-center`}>
      {loading && (
        <div className="absolute inset-0 bg-habbo-border/10 rounded animate-pulse" />
      )}
      {src && (
        <img
          src={src}
          alt={alt}
          className={`${sizeClasses[size]} object-contain transition-opacity duration-200 ${loading ? "opacity-0" : "opacity-100"}`}
          loading="lazy"
          onError={handleError}
          onLoad={handleLoad}
        />
      )}
    </div>
  );
}
