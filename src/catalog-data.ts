import catalog from "../registry/catalog.json";

export const { defaultStyle, styles, components } = catalog;

export type CatalogStyle = (typeof styles)[number];
export type CatalogComponent = (typeof components)[number];

export function catalogUrl(style: string, page = "tokens") {
  return page === "tokens" ? `/styles/${style}` : `/styles/${style}/${page}`;
}

/** Components whose page shows the sectioned examples instead of the single preview. */
export const componentsWithExamples = ["button"];
