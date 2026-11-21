import type { HTMLAttributes } from "react";
import styles from "./card.module.css";

export function Card({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return <section {...props} className={[styles.card, className].filter(Boolean).join(" ")} />;
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={[styles.header, className].filter(Boolean).join(" ")} />;
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={[styles.content, className].filter(Boolean).join(" ")} />;
}

export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={[styles.footer, className].filter(Boolean).join(" ")} />;
}
