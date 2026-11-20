import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { catalogUrl, components, defaultStyle, styles, type CatalogStyle } from "../src/catalog-data";
import { LibraryPreview } from "../src/LibraryPreview";
import css from "./Home.module.css";

export default function HomePage() {
  return (
    <main className={css.home}>
      <section className={css.hero} aria-labelledby="home-title">
        <h1 id="home-title">UI libraries for <span>Next.js</span></h1>
        <p>Pick a design style and copy components, CSS Modules, and design tokens into your project.</p>
      </section>
      <section aria-labelledby="libraries-title">
        <h2 id="libraries-title" className={css.heading}>Design libraries</h2>
        <div className={css.grid}>
          {styles.map((style) => (
            <article className={css.library} key={style.name}>
              <LibraryPreview style={style} />
              <div className={css.details}>
                <div className={css.libraryTitle}>
                  <h3><Link href={catalogUrl(style.name)}>{style.label}<span className={css.srOnly}> library</span></Link></h3>
                  {style.name === defaultStyle && <span className={css.defaultTag}>Default</span>}
                </div>
                <p>{style.description}</p>
                <div className={css.libraryFooter}>
                  <span>{components.length} components</span>
                  <ArrowRight size={18} aria-hidden="true" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
