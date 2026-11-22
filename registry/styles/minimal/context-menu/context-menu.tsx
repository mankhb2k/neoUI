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
  type ComponentPropsWithoutRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type MutableRefObject,
  type ReactNode,
} from "react";
import styles from "./context-menu.module.css";

type Point = { x: number; y: number };

type MenuContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  position: Point;
  openAt: (point: Point, origin: HTMLElement) => void;
  origin: MutableRefObject<HTMLElement | null>;
};
const MenuContext = createContext<MenuContextValue | null>(null);

function useMenu() {
  const context = useContext(MenuContext);
  if (!context) throw new Error("Context menu parts must be rendered inside <ContextMenu>.");
  return context;
}

type SubContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  keyboardOpen: MutableRefObject<boolean>;
};
const SubContext = createContext<SubContextValue | null>(null);

function useSub() {
  const context = useContext(SubContext);
  if (!context) throw new Error("ContextMenuSubTrigger and ContextMenuSubContent must be rendered inside <ContextMenuSub>.");
  return context;
}

const ITEM_SELECTOR = ':scope > [role="menuitem"]:not(:disabled), :scope > [data-menu-sub] > [role="menuitem"]:not(:disabled)';

function classes(...names: Array<string | false | undefined>) {
  return names.filter(Boolean).join(" ");
}

/** Opens at the pointer position. Keeps the open state and the last trigger for focus. */
export function ContextMenu({ onOpenChange, children }: { onOpenChange?: (open: boolean) => void; children?: ReactNode }) {
  const [open, setOpenState] = useState(false);
  const [position, setPosition] = useState<Point>({ x: 0, y: 0 });
  const origin = useRef<HTMLElement | null>(null);

  const setOpen = useCallback(
    (next: boolean) => {
      setOpenState(next);
      onOpenChange?.(next);
    },
    [onOpenChange],
  );

  const openAt = useCallback(
    (point: Point, from: HTMLElement) => {
      origin.current = from;
      setPosition(point);
      setOpen(true);
    },
    [setOpen],
  );

  const value = useMemo(() => ({ open, setOpen, position, openAt, origin }), [open, setOpen, position, openAt]);
  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

/** The area that opens the menu on right click, or with the Menu key or Shift+F10. */
export function ContextMenuTrigger({ className, onContextMenu, onKeyDown, ...props }: HTMLAttributes<HTMLDivElement>) {
  const { openAt } = useMenu();
  return (
    <div
      tabIndex={0}
      {...props}
      onContextMenu={(event) => {
        onContextMenu?.(event);
        event.preventDefault();
        openAt({ x: event.clientX, y: event.clientY }, event.currentTarget);
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.key === "ContextMenu" || (event.shiftKey && event.key === "F10")) {
          event.preventDefault();
          const rect = event.currentTarget.getBoundingClientRect();
          openAt({ x: rect.left + 8, y: rect.top + 8 }, event.currentTarget);
        }
      }}
      className={classes(styles.trigger, className)}
    />
  );
}

/** Places the menu at the point, flipping left or up when there is no room on the right or below. */
function placeAt(element: HTMLElement, point: Point) {
  const edge = 8;
  const width = element.offsetWidth;
  const height = element.offsetHeight;
  let left = point.x;
  if (left + width > window.innerWidth - edge) left = point.x - width;
  left = Math.max(edge, left);
  let top = point.y;
  if (top + height > window.innerHeight - edge) top = Math.max(edge, window.innerHeight - height - edge);
  element.style.left = `${left}px`;
  element.style.top = `${top}px`;
}

/** The menu panel. Shown in the top layer, so it is never clipped by a parent. */
export function ContextMenuContent({ className, onKeyDown, onContextMenu, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  const { open, setOpen, position, origin } = useMenu();
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (open) {
      if (!element.matches(":popover-open")) element.showPopover();
      placeAt(element, position);
      element.querySelector<HTMLElement>(ITEM_SELECTOR)?.focus();
    } else if (element.matches(":popover-open")) {
      element.hidePopover();
    }
  }, [open, position]);

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    const onPointerDown = (event: PointerEvent) => {
      if (ref.current?.contains(event.target as Node)) return;
      close();
    };
    const onEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "Escape") return;
      close();
      origin.current?.focus();
    };
    const onScroll = (event: Event) => {
      if (!ref.current?.contains(event.target as Node)) close();
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
  }, [open, setOpen, origin]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.key === "Tab") {
      setOpen(false);
      return;
    }
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    const active = document.activeElement as HTMLElement | null;
    const menu = active?.closest<HTMLElement>('[role="menu"]') ?? ref.current;
    if (!menu) return;
    const items = Array.from(menu.querySelectorAll<HTMLElement>(ITEM_SELECTOR));
    if (items.length === 0) return;
    event.preventDefault();
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
      ref={ref}
      role="menu"
      popover="manual"
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      onContextMenu={(event) => {
        onContextMenu?.(event);
        event.preventDefault();
      }}
      className={classes(styles.content, className)}
    >
      {children}
    </div>
  );
}

export interface ContextMenuItemProps extends Omit<ComponentPropsWithoutRef<"button">, "type"> {
  variant?: "default" | "destructive";
  /** Runs when the item is chosen. The menu closes afterwards. */
  onSelect?: () => void;
}

export function ContextMenuItem({ variant = "default", onSelect, onClick, className, ...props }: ContextMenuItemProps) {
  const { setOpen, origin } = useMenu();
  return (
    <button
      type="button"
      role="menuitem"
      tabIndex={-1}
      data-variant={variant}
      {...props}
      onMouseEnter={(event) => event.currentTarget.focus()}
      onClick={(event) => {
        onClick?.(event);
        onSelect?.();
        setOpen(false);
        origin.current?.focus();
      }}
      className={classes(styles.item, className)}
    />
  );
}

export function ContextMenuLabel({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={classes(styles.label, className)} />;
}

export function ContextMenuSeparator({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div role="separator" {...props} className={classes(styles.separator, className)} />;
}

/** Keyboard shortcut hint, pushed to the right of the item. */
export function ContextMenuShortcut({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span {...props} className={classes(styles.shortcut, className)} />;
}

/** Wraps a `ContextMenuSubTrigger` and a `ContextMenuSubContent`. Opens on hover or ArrowRight. */
export function ContextMenuSub({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  const [open, setOpen] = useState(false);
  const keyboardOpen = useRef(false);
  const timer = useRef<number | undefined>(undefined);
  // Closing waits a moment, so the pointer can cross the gap into the submenu.
  const cancelClose = useCallback(() => window.clearTimeout(timer.current), []);
  const scheduleClose = useCallback(() => {
    cancelClose();
    timer.current = window.setTimeout(() => setOpen(false), 150);
  }, [cancelClose]);
  useEffect(() => cancelClose, [cancelClose]);
  const value = useMemo(() => ({ open, setOpen, keyboardOpen }), [open]);
  return (
    <SubContext.Provider value={value}>
      <div {...props} data-menu-sub="" onMouseEnter={cancelClose} onMouseLeave={scheduleClose} className={classes(styles.sub, className)}>
        {children}
      </div>
    </SubContext.Provider>
  );
}

export function ContextMenuSubTrigger({ className, onClick, onKeyDown, children, ...props }: Omit<ComponentPropsWithoutRef<"button">, "type">) {
  const sub = useSub();
  return (
    <button
      type="button"
      role="menuitem"
      aria-haspopup="menu"
      aria-expanded={sub.open}
      tabIndex={-1}
      {...props}
      onMouseEnter={(event) => {
        event.currentTarget.focus();
        sub.setOpen(true);
      }}
      onClick={(event) => {
        onClick?.(event);
        sub.setOpen(!sub.open);
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.key === "ArrowRight" || event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          event.stopPropagation();
          sub.keyboardOpen.current = true;
          sub.setOpen(true);
        }
      }}
      className={classes(styles.item, className)}
    >
      {children}
      <svg className={styles.chevron} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m9 18 6-6-6-6" />
      </svg>
    </button>
  );
}

export function ContextMenuSubContent({ className, onKeyDown, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  const sub = useSub();
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element || !sub.open) return;
    element.removeAttribute("data-flip");
    if (element.getBoundingClientRect().right > window.innerWidth - 8) element.setAttribute("data-flip", "");
    if (sub.keyboardOpen.current) {
      sub.keyboardOpen.current = false;
      element.querySelector<HTMLElement>('[role="menuitem"]:not(:disabled)')?.focus();
    }
  }, [sub.open, sub.keyboardOpen]);

  return (
    <div
      {...props}
      ref={ref}
      role="menu"
      hidden={!sub.open}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          event.stopPropagation();
          sub.setOpen(false);
          (ref.current?.previousElementSibling as HTMLElement | null)?.focus();
        }
      }}
      className={classes(styles.subContent, className)}
    >
      {children}
    </div>
  );
}
