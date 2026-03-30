"use client";

import Link from "next/link";

export interface BreadcrumbSegment {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  segments: BreadcrumbSegment[];
}

export function Breadcrumbs({ segments }: BreadcrumbsProps) {
  if (segments.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center gap-1.5 text-xs text-habbo-text-dim flex-wrap">
        <li>
          <Link
            href="/"
            className="hover:text-habbo-cyan transition-colors"
          >
            Dashboard
          </Link>
        </li>
        {segments.map((segment, i) => (
          <li key={i} className="flex items-center gap-1.5">
            <span className="text-habbo-border">/</span>
            {segment.href ? (
              <Link
                href={segment.href}
                className="hover:text-habbo-cyan transition-colors"
              >
                {segment.label}
              </Link>
            ) : (
              <span className="text-habbo-text truncate max-w-[200px]">
                {segment.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
