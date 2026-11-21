"use client";

import type { ReactNode } from "react";
import { previewComponents } from "./catalog-previews";
import type { CatalogStyle } from "./catalog-data";
import { useThemeStore } from "./theme-store";
import css from "./Catalog.module.css";

export function ComponentPreview({ style, page }: { style: CatalogStyle; page: string }) {
  const mode = useThemeStore((state) => state.mode);
  const { Card, CardHeader, CardTitle, CardDescription, CardContent, Input } =
    previewComponents[style.name as keyof typeof previewComponents];
  const examples: Record<string, ReactNode> = {
    card: (
      <div className={css.exampleCard}>
        <Card>
          <CardHeader>
            <CardTitle>Project overview</CardTitle>
            <CardDescription>Keep notes, files, and team updates in one place.</CardDescription>
          </CardHeader>
          <CardContent><small>Updated today</small></CardContent>
        </Card>
      </div>
    ),
    input: (
      <label className={css.exampleInput}>
        Email address
        <Input type="email" placeholder="you@example.com" />
      </label>
    ),
  };

  return <div className={css.preview} data-neo-style={style.name} data-theme={mode}>{examples[page]}</div>;
}
