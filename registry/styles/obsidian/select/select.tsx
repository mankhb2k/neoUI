"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
  type MutableRefObject,
  type ReactNode,
} from "react";
import styles from "./select.module.css";

type SelectContextValue = {
  value: string | undefined;
  open: boolean;
  setOpen: (open: boolean) => void;
  select: (value: string) => void;
  labels: Record<string, string>;
  registerLabel: (value: string, label: string) => void;
  triggerRef: MutableRefObject<HTMLButtonElement | null>;
  contentRef: MutableRefObject<HTMLDivElement | null>;
};
const SelectContext = createContext<SelectContextValue | null>(null);

function useSelect() {
  const context = useContext(SelectContext);
  if (!context) throw new Error("Select parts must be rendered inside <Select>.");
  return context;
}

function classes(...names: Array<string | false | undefined>) {
  return names.filter(Boolean).join(" ");
}

export interface SelectProps {
  /** Controlled selected value. */
  value?: string;
  /** Initial value for an uncontrolled select. */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children?: ReactNode;
}

/** Picks one option from a list. Holds the value and the open state. Renders no DOM of its own. */
export function Select({ value, defaultValue, onValueChange, children }: SelectProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [labels, setLabels] = useState<Record<string, string>>({});
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const current = value ?? internalValue;

  const select = useCallback(
    (next: string) => {
      if (value === undefined) setInternalValue(next);
      onValueChange?.(next);
      setOpen(false);
    },
    [value, onValueChange],
  );

  const registerLabel = useCallback((itemValue: string, label: string) => {
    setLabels((previous) => (previous[itemValue] === label ? previous : { ...previous, [itemValue]: label }));
  }, []);

  const context = useMemo(
    () => ({ value: current, open, setOpen, select, labels, registerLabel, triggerRef, contentRef }),
    [current, open, select, labels, registerLabel],
  );
  return <SelectContext.Provider value={context}>{children}</SelectContext.Provider>;
}

export function SelectTrigger({ className, onClick, onKeyDown, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { open, setOpen, triggerRef } = useSelect();
  return (
    <button
      type="button"
      role="combobox"
      aria-haspopup="listbox"
      aria-expanded={open}
      {...props}
      ref={triggerRef}
      onClick={(event) => {
        onClick?.(event);
        setOpen(!open);
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
          event.preventDefault();
          setOpen(true);
        }
      }}
      className={classes(styles.trigger, className)}
    >
      {children}
      <svg className={styles.chevron} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>
  );
}

/** Shows the label of the selected item, or the placeholder when nothing is selected. */
export function SelectValue({ placeholder, className, ...props }: HTMLAttributes<HTMLSpanElement> & { placeholder?: string }) {
  const { value, labels } = useSelect();
  const label = value === undefined ? undefined : labels[value];
  return (
    <span {...props} className={classes(styles.value, label === undefined && styles.placeholder, className)}>
      {label ?? placeholder ?? ""}
    </span>
  );
}

function place(element: HTMLElement, trigger: HTMLElement | null) {
  if (!trigger) return;
  const rect = trigger.getBoundingClientRect();
  element.style.minWidth = `${rect.width}px`;
  const width = element.offsetWidth;
  const height = element.offsetHeight;
  const gap = 6;
  const edge = 8;
  const left = Math.max(edge, Math.min(rect.left, window.innerWidth - width - edge));
  let top = rect.bottom + gap;
  if (top + height > window.innerHeight - edge && rect.top - gap - height >= edge) top = rect.top - gap - height;
  element.style.left = `${left}px`;
  element.style.top = `${top}px`;
}

const OPTION_SELECTOR = '[role="option"]:not(:disabled)';

/** The list of options. Shown in the top layer, so it is never clipped by a parent. */
export function SelectContent({ className, onKeyDown, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  const { open, setOpen, triggerRef, contentRef } = useSelect();

  useLayoutEffect(() => {
    const element = contentRef.current;
    if (!element) return;
    if (open) {
      if (!element.matches(":popover-open")) element.showPopover();
      place(element, triggerRef.current);
      const target =
        element.querySelector<HTMLElement>('[aria-selected="true"]:not(:disabled)') ??
        element.querySelector<HTMLElement>(OPTION_SELECTOR);
      target?.focus();
    } else if (element.matches(":popover-open")) {
      element.hidePopover();
    }
  }, [open, contentRef, triggerRef]);

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (contentRef.current?.contains(target) || triggerRef.current?.contains(target)) return;
      close();
    };
    const onEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "Escape") return;
      close();
      triggerRef.current?.focus();
    };
    // Scrolling inside the list is allowed. Scrolling anywhere else closes it.
    const onScroll = (event: Event) => {
      if (!contentRef.current?.contains(event.target as Node)) close();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onEscape);
    window.addEventListener("resize", close);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onEscape);
      window.removeEventListener("resize", close);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [open, setOpen, contentRef, triggerRef]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.key === "Tab") {
      setOpen(false);
      return;
    }
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    const items = Array.from(contentRef.current?.querySelectorAll<HTMLElement>(OPTION_SELECTOR) ?? []);
    if (items.length === 0) return;
    event.preventDefault();
    const active = document.activeElement as HTMLElement | null;
    const index = active ? items.indexOf(active) : -1;
    let next = index;
    if (event.key === "ArrowDown") next = index + 1 >= items.length ? 0 : index + 1;
    if (event.key === "ArrowUp") next = index <= 0 ? items.length - 1 : index - 1;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = items.length - 1;
    items[next].focus();
  };

  return (
    <div
      {...props}
      ref={contentRef}
      role="listbox"
      popover="manual"
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      className={classes(styles.content, className)}
    >
      {children}
    </div>
  );
}

export interface SelectItemProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value"> {
  value: string;
}

export function SelectItem({ value, disabled, className, onClick, children, ...props }: SelectItemProps) {
  const { value: current, select, registerLabel } = useSelect();
  const ref = useRef<HTMLButtonElement>(null);
  const selected = current === value;

  // Remember the visible text so SelectValue can show it.
  useLayoutEffect(() => {
    registerLabel(value, ref.current?.textContent?.trim() ?? value);
  });

  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      tabIndex={-1}
      disabled={disabled}
      {...props}
      ref={ref}
      onClick={(event) => {
        onClick?.(event);
        if (!disabled) select(value);
      }}
      className={classes(styles.item, className)}
    >
      <span>{children}</span>
      {selected && (
        <svg className={styles.check} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      )}
    </button>
  );
}

export function SelectLabel({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={classes(styles.label, className)} />;
}

export function SelectSeparator({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div role="separator" {...props} className={classes(styles.separator, className)} />;
}
