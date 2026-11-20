"use client";

import { Layers2 } from "lucide-react";
import { previewComponents } from "./catalog-previews";
import type { CatalogStyle } from "./catalog-data";
import { useThemeStore } from "./theme-store";
import css from "../app/Home.module.css";

export function LibraryPreview({ style }: { style: CatalogStyle }) {
  const mode = useThemeStore((state) => state.mode);
  const { Button, Card, CardHeader, CardTitle, CardDescription, CardContent } =
    previewComponents[style.name as keyof typeof previewComponents];

  return (
    <div className={css.preview} data-neo-style={style.name} data-theme={mode} inert>
      <Card className={css.example}>
        <CardHeader>
          <span className={css.exampleIcon}><Layers2 size={17} aria-hidden="true" /></span>
          <CardTitle>Project settings</CardTitle>
          <CardDescription>Manage your workspace preferences.</CardDescription>
        </CardHeader>
        <CardContent className={css.exampleActions}>
          <Button>Save changes</Button>
          <Button variant="outline">Cancel</Button>
        </CardContent>
      </Card>
    </div>
  );
}
