"use client";

import {
  createContext,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import styles from "./tabs.module.css";

type TabsContextValue = { value: string | undefined; select: (value: string) => void };
const TabsContext = createContext<TabsContextValue | null>(null);

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  /** Controlled selected value. */
  value?: string;
  /** Initial value for an uncontrolled group. */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** `default` is the pill style. `line` shows an underline under the selected item. */
  variant?: "default" | "line";
  children?: ReactNode;
}

/** Segmented control. One item is selected at a time. Arrow keys move the selection. */
export function Tabs({ value, defaultValue, onValueChange, variant = "default", className, children, ...props }: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const current = value ?? internalValue;
  const ref = useRef<HTMLDivElement>(null);

  // Move the sliding indicator to the selected item. The CSS reads --tabs-x and --tabs-w.
  useLayoutEffect(() => {
    const group = ref.current;
    if (!group) return;
    const update = () => {
      const selected = group.querySelector<HTMLElement>('[aria-checked="true"]');
      group.style.setProperty("--tabs-x", `${selected?.offsetLeft ?? 4}px`);
      group.style.setProperty("--tabs-w", `${selected?.offsetWidth ?? 0}px`);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(group);
    return () => observer.disconnect();
  }, [current]);

  const select = (next: string) => {
    if (value === undefined) setInternalValue(next);
    onValueChange?.(next);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    const items = Array.from(ref.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]:not(:disabled)') ?? []);
    const index = items.indexOf(document.activeElement as HTMLButtonElement);
    if (index === -1) return;
    event.preventDefault();
    const step = event.key === "ArrowRight" ? 1 : -1;
    const next = items[(index + step + items.length) % items.length];
    next.focus();
    next.click();
  };

  return (
    <TabsContext.Provider value={{ value: current, select }}>
      <div
        {...props}
        ref={ref}
        role="radiogroup"
        onKeyDown={handleKeyDown}
        className={[styles.group, variant === "line" && styles.line, className].filter(Boolean).join(" ")}
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export interface TabsTriggerProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value"> {
  value: string;
}

export function TabsTrigger({ value, className, onClick, ...props }: TabsTriggerProps) {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabsTrigger must be rendered inside <Tabs>.");
  const selected = context.value === value;
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      tabIndex={selected || context.value === undefined ? 0 : -1}
      {...props}
      onClick={(event) => {
        onClick?.(event);
        context.select(value);
      }}
      className={[styles.item, className].filter(Boolean).join(" ")}
    />
  );
}
