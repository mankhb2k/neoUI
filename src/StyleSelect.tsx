"use client";

import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { catalogUrl, styles, type CatalogStyle } from "./catalog-data";
import css from "./Catalog.module.css";

export function StyleSelect({ style, page }: { style: CatalogStyle; page: string }) {
  const router = useRouter();

  return (
    <label className={css.selectLabel}>
      <span>Design style</span>
      <span className={css.selectField}>
        <i className={css.styleDot} style={{ background: style.color }} aria-hidden="true" />
        <select value={style.name} onChange={(event) => router.push(catalogUrl(event.target.value, page))}>
          {styles.map((option) => <option value={option.name} key={option.name}>{option.label}</option>)}
        </select>
        <ChevronDown size={15} aria-hidden="true" />
      </span>
    </label>
  );
}
