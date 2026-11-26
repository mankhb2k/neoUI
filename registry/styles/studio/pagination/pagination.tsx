"use client";

import { useState, type HTMLAttributes } from "react";
import { Button } from "../button/button";
import styles from "./pagination.module.css";

type PageItem = number | "ellipsis";

/**
 * Page numbers to show. Always includes the first and last page and the pages around the current one.
 * A gap is shown as "ellipsis".
 */
function getPageItems(current: number, total: number, siblingCount: number): PageItem[] {
  const range = (start: number, end: number) => Array.from({ length: end - start + 1 }, (_, i) => start + i);

  // With few pages, show them all. No ellipsis is needed.
  if (2 * siblingCount + 5 >= total) return range(1, total);

  const left = Math.max(current - siblingCount, 1);
  const right = Math.min(current + siblingCount, total);
  const showLeft = left > 2;
  const showRight = right < total - 1;

  if (!showLeft && showRight) return [...range(1, 3 + 2 * siblingCount), "ellipsis", total];
  if (showLeft && !showRight) return [1, "ellipsis", ...range(total - 2 - 2 * siblingCount, total)];
  return [1, "ellipsis", ...range(left, right), "ellipsis", total];
}

export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, "defaultValue" | "onChange"> {
  /** Controlled current page, starting at 1. Use it with `onPageChange`. */
  page?: number;
  /** Starting page for an uncontrolled pagination. Defaults to 1. */
  defaultPage?: number;
  /** Total number of pages. */
  pageCount: number;
  onPageChange?: (page: number) => void;
  /** Number of pages shown on each side of the current page. Defaults to 1. */
  siblingCount?: number;
}

/** Moves between pages with previous and next buttons and numbered page buttons. */
export function Pagination({
  page,
  defaultPage = 1,
  pageCount,
  onPageChange,
  siblingCount = 1,
  className,
  ...props
}: PaginationProps) {
  const [internalPage, setInternalPage] = useState(defaultPage);
  const total = Math.max(1, pageCount);
  const current = Math.min(Math.max(page ?? internalPage, 1), total);

  const go = (next: number) => {
    if (next < 1 || next > total || next === current) return;
    if (page === undefined) setInternalPage(next);
    onPageChange?.(next);
  };

  return (
    <nav aria-label="Pagination" {...props} className={[styles.pagination, className].filter(Boolean).join(" ")}>
      <Button variant="outline" disabled={current <= 1} onClick={() => go(current - 1)}>
        <svg data-icon="inline-start" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m15 18-6-6 6-6" />
        </svg>
        Previous
      </Button>
      <div className={styles.pages}>
        {getPageItems(current, total, siblingCount).map((item, index) =>
          item === "ellipsis" ? (
            <span key={`ellipsis-${index}`} className={styles.ellipsis} aria-hidden="true">…</span>
          ) : (
            <Button
              key={item}
              variant={item === current ? "default" : "ghost"}
              className={styles.page}
              aria-label={`Page ${item}`}
              aria-current={item === current ? "page" : undefined}
              onClick={() => go(item)}
            >
              {item}
            </Button>
          ),
        )}
      </div>
      <Button variant="outline" disabled={current >= total} onClick={() => go(current + 1)}>
        Next
        <svg data-icon="inline-end" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m9 18 6-6-6-6" />
        </svg>
      </Button>
    </nav>
  );
}
