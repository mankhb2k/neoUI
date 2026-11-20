import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Catalog } from "@/src/Catalog";
import { components, styles } from "@/src/catalog-data";

const pages = [
  { name: "tokens", label: "Design tokens" },
  ...components,
];

type Props = { params: Promise<{ style: string; page: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return styles.flatMap((style) => pages.map((page) => ({ style: style.name, page: page.name })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { style, page } = await params;
  const design = styles.find((item) => item.name === style);
  const section = pages.find((item) => item.name === page);
  return design && section ? { title: `${section.label} · ${design.label} · Neonix UI` } : {};
}

export default async function StylePage({ params }: Props) {
  const { style, page } = await params;
  const design = styles.find((item) => item.name === style);
  if (!design || !pages.some((item) => item.name === page)) notFound();
  return <Catalog style={design} page={page} />;
}
