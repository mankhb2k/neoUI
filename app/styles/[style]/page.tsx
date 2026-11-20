import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Catalog } from "@/src/Catalog";
import { styles } from "@/src/catalog-data";

type Props = { params: Promise<{ style: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return styles.map((style) => ({ style: style.name }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { style: name } = await params;
  const style = styles.find((item) => item.name === name);
  return style ? { title: `Design tokens · ${style.label} · Neonix UI` } : {};
}

export default async function StyleOverview({ params }: Props) {
  const { style: name } = await params;
  const style = styles.find((item) => item.name === name);
  if (!style) notFound();
  return <Catalog style={style} page="tokens" />;
}
