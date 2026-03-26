"use client";

import { PixelButton } from "./PixelButton";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | "...")[] = [];
  const delta = 2;

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - delta && i <= currentPage + delta)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <div className="flex items-center justify-center gap-1 mt-6">
      <PixelButton
        variant="ghost"
        size="sm"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        ←
      </PixelButton>

      {pages.map((page, idx) =>
        page === "..." ? (
          <span key={`dot-${idx}`} className="px-2 text-habbo-text-dim text-xs">
            ...
          </span>
        ) : (
          <PixelButton
            key={page}
            variant={page === currentPage ? "primary" : "ghost"}
            size="sm"
            onClick={() => onPageChange(page)}
          >
            {page}
          </PixelButton>
        )
      )}

      <PixelButton
        variant="ghost"
        size="sm"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        →
      </PixelButton>
    </div>
  );
}
