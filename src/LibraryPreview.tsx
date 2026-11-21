"use client";

import { Layers2 } from "lucide-react";
import { previewComponents } from "./catalog-previews";
import type { CatalogStyle } from "./catalog-data";
import { useThemeStore } from "./theme-store";
import css from "../app/Home.module.css";

export function LibraryPreview({ style }: { style: CatalogStyle }) {
  const mode = useThemeStore((state) => state.mode);
  const { Button, Card, CardHeader, CardFooter } =
    previewComponents[style.name as keyof typeof previewComponents];

  return (
    <div className={css.preview} data-neo-style={style.name} data-theme={mode} inert>
      <Card className={css.example}>
        <CardHeader>
          <span className={css.exampleIcon}><Layers2 size={17} aria-hidden="true" /></span>
          <h3>Project settings</h3>
          <p>Manage your workspace preferences.</p>
        </CardHeader>
        <CardFooter>
          <Button>Save changes</Button>
          <Button variant="outline">Cancel</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
