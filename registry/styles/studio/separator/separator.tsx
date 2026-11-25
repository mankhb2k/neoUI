"use client";

import type { CSSProperties, HTMLAttributes } from "react";
import styles from "./separator.module.css";

export interface SeparatorProps extends HTMLAttributes<HTMLDivElement> {
  /** `horizontal` (default) is a line across the width. `vertical` is a line down the height of a row. */
  variant?: "horizontal" | "vertical";
  /** Thickness of the line in pixels. Defaults to 1. */
  size?: number;
}

/** A thin line that divides content. Horizontal by default. Use `variant="vertical"` between items in a row. */
export function Separator({ variant = "horizontal", size = 1, className, style, ...props }: SeparatorProps) {
  return (
    <div
      role="separator"
      aria-orientation={variant}
      {...props}
      style={{ "--separator-size": `${size}px`, ...style } as CSSProperties}
      className={[styles.separator, variant === "vertical" && styles.vertical, className].filter(Boolean).join(" ")}
    />
  );
}
