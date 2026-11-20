import { ArrowRight, Palette } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { catalogUrl, components, type CatalogStyle } from "./catalog-data";
import { ComponentPreview } from "./ComponentPreview";
import { readSource } from "./catalog-source";
import { CodePanel } from "./CodePanel";
import { TokenPalette } from "./TokenPalette";
import { StyleSelect } from "./StyleSelect";
import css from "./Catalog.module.css";

function PreviewWindow({ style, page, title }: { style: CatalogStyle; page: string; title: string }) {
  return (
    <section className={css.previewWindow} aria-label={`${title} preview`}>
      <div className={css.windowBar}>
        <span className={css.windowControls} aria-hidden="true"><i /><i /><i /></span>
        <span className={css.windowTitle}>Preview</span>
      </div>
      <ComponentPreview style={style} page={page} />
    </section>
  );
}

function NavLink({ href, active, icon, children }: {
  href: string;
  active: boolean;
  icon?: ReactNode;
  children: ReactNode;
}) {
  return <Link href={href} aria-current={active ? "page" : undefined} className={css.navLink}>
    {icon}{children}
  </Link>;
}

export async function Catalog({ style, page }: { style: CatalogStyle; page: string }) {
  const component = components.find((item) => item.name === page);
  const tokenPage = page === "tokens";
  const title = component?.label ?? (tokenPage ? "Design tokens" : style.label);
  const description = component?.description ?? (tokenPage
    ? `Use the ${style.label} palette, borders, and radii in your Next.js project.`
    : style.description);
  const tokenFile = tokenPage ? await readSource(style, "globals.css") : undefined;
  const sourceFiles = component
    ? await Promise.all(component.files.map((file) => readSource(style, file)))
    : tokenFile ? [tokenFile] : [];

  return (
    <div className={css.site}>
      <div className={css.layout}>
        <aside className={css.sidebar}>
          <StyleSelect style={style} page={page} />
          <nav aria-label="Library">
            <NavLink href={catalogUrl(style.name, "tokens")} active={tokenPage} icon={<Palette size={17} />}>Design tokens</NavLink>
            <div className={css.navGroup}>Components</div>
            {components.map((item) => (
              <NavLink href={catalogUrl(style.name, item.name)} active={page === item.name} key={item.name}>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className={css.main}>
          <div className={css.breadcrumb}>
            <Link href={catalogUrl(style.name)}>{style.label}</Link>
            <span>/</span>
            {component ? "Components" : tokenPage ? title : "Overview"}
            {component && <><span>/</span>{component.label}</>}
          </div>
          <div className={css.intro}>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>

          {component && (
            <>
              <PreviewWindow style={style} page={page} title={component.label} />
              <CodePanel key={`${style.name}/${page}`} files={sourceFiles} />
              <div className={css.note}>
                <Palette size={17} aria-hidden="true" />
                <p>Keep the component files together and add the {style.label} tokens to your app.</p>
                <Link href={catalogUrl(style.name, "tokens")}>View tokens <ArrowRight size={14} /></Link>
              </div>
            </>
          )}

          {tokenPage && tokenFile && (
            <>
              <TokenPalette style={style} />
              <CodePanel key={style.name} files={sourceFiles} />
              <p className={css.usage}>Add this CSS to <code>app/globals.css</code>, then set <code>data-neo-style="{style.name}"</code> on <code>&lt;html&gt;</code> or a wrapper around your components.</p>
            </>
          )}

        </main>
      </div>
    </div>
  );
}
