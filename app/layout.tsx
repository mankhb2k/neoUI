import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ArrowUpRight, Box } from "lucide-react";
import Link from "next/link";
import { catalogUrl, defaultStyle } from "../src/catalog-data";
import { ThemeBridge, ThemeToggle } from "../src/ThemeControls";
import css from "./SiteHeader.module.css";
import "./globals.css";
import "../registry/styles/obsidian/globals.css";
import "../registry/styles/minimal/globals.css";

export const metadata: Metadata = {
  title: "Neonix UI — UI libraries for Next.js",
  description:
    "A reusable React and Next.js component library with live previews and a simple install CLI.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-neo-style={defaultStyle} data-theme="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400..800&family=JetBrains+Mono:wght@400..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeBridge />
        <header className={css.header}>
          <div className={css.inner}>
            <Link href="/" className={css.brand}>
              <span><Box size={19} aria-hidden="true" /></span>
              Neonix UI
            </Link>
            <Link className={css.components} href={catalogUrl(defaultStyle, "button")}>
              Components <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
            <ThemeToggle />
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
