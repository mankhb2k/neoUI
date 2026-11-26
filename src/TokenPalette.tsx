"use client";

import { useThemeStore } from "./theme-store";
import css from "./Catalog.module.css";
import type { CatalogStyle } from "./catalog-data";

const tokens = ["background", "surface", "border", "accent", "foreground"];

export function TokenPalette({ style }: { style: CatalogStyle }) {
  const mode = useThemeStore((state) => state.mode);

  return (
    <div className={css.tokenPalette} data-style={style.name} data-theme={mode}>
      {tokens.map((token) => (
        <div key={token}>
          <i style={{ background: `var(--${token})` }} />
          <code>--{token}</code>
        </div>
      ))}
    </div>
  );
}
