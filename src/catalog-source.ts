import "server-only";
import { readFile } from "fs/promises";
import path from "path";
import type { CatalogStyle } from "./catalog-data";

export async function readSource(style: CatalogStyle, name: string) {
  const source = await readFile(
    path.join(process.cwd(), "registry", "styles", style.name, name),
    "utf8",
  );
  return { name, source };
}

