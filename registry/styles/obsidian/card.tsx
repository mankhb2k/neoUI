import type { HTMLAttributes } from "react";
import styles from "./card.module.css";

export function Card({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return <section {...props} className={[styles.card, className].filter(Boolean).join(" ")} />;
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={[styles.header, className].filter(Boolean).join(" ")} />;
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 {...props} className={[styles.title, className].filter(Boolean).join(" ")} />;
}

export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p {...props} className={[styles.description, className].filter(Boolean).join(" ")} />;
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={[styles.content, className].filter(Boolean).join(" ")} />;
}
