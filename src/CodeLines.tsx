import { createState, tokenizeLine, type Lang } from "./code-tokens";
import css from "./Catalog.module.css";

export function CodeLines({ code, lang }: { code: string; lang: Lang }) {
  const state = createState();
  return (
    <>
      {code.split("\n").map((line, index) => (
        <span className={css.codeLine} key={index}>
          <span className={css.lineNo}>{index + 1}</span>
          <span>
            {tokenizeLine(line, lang, state).map((token, tokenIndex) => (
              <span key={tokenIndex} style={token.color ? { color: token.color } : undefined}>
                {token.text}
              </span>
            ))}
          </span>
        </span>
      ))}
    </>
  );
}
