"use client";

import {
  cloneElement,
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
  type MouseEvent,
  type MutableRefObject,
  type ReactElement,
  type ReactNode,
} from "react";
import styles from "./dropdown-menu.module.css";

type MenuContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: MutableRefObject<HTMLElement | null>;
};
const MenuContext = createContext<MenuContextValue | null>(null);

function useMenu() {
  const context = useContext(MenuContext);
  if (!context) throw new Error("Dropdown menu parts must be rendered inside <DropdownMenu>.");
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
  if (!context) throw new Error("DropdownMenuSubTrigger and DropdownMenuSubContent must be rendered inside <DropdownMenuSub>.");
  return context;
}

type RenderElement = ReactElement<{
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  "aria-haspopup"?: "menu";
  "aria-expanded"?: boolean;
}>;

const ITEM_SELECTOR = ':scope > [role="menuitem"]:not(:disabled), :scope > [data-menu-sub] > [role="menuitem"]:not(:disabled)';

function classes(...names: Array<string | false | undefined>) {
  return names.filter(Boolean).join(" ");
}

export interface DropdownMenuProps {
  /** Controlled open state. Omit it to let the menu manage its own state. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
}

/** Holds the open state for the trigger and content. Renders no DOM of its own. */
export function DropdownMenu({ open, defaultOpen = false, onOpenChange, children }: DropdownMenuProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = open !== undefined;
  const isOpen = open ?? uncontrolledOpen;
  const triggerRef = useRef<HTMLElement | null>(null);

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  const value = useMemo(() => ({ open: isOpen, setOpen, triggerRef }), [isOpen, setOpen]);
  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

/** Toggles the menu. Pass a button with `render`, or use children for a default button. */
export function DropdownMenuTrigger({
  render,
  onClick,
  children,
  ...props
}: ComponentPropsWithoutRef<"button"> & { render?: RenderElement }) {
  const { open, setOpen, triggerRef } = useMenu();
  const toggle = (event: MouseEvent<HTMLElement>) => {
    triggerRef.current = event.currentTarget;
    setOpen(!open);
  };

  if (render) {
    return cloneElement(render, {
      "aria-haspopup": "menu",
      "aria-expanded": open,
      onClick: (event: MouseEvent<HTMLElement>) => {
        render.props.onClick?.(event);
        toggle(event);
      },
    });
  }
  return (
    <button
      type="button"
      aria-haspopup="menu"
      aria-expanded={open}
      {...props}
      onClick={(event) => {
        onClick?.(event);
        toggle(event);
      }}
    >
      {children}
    </button>
  );
}

function place(element: HTMLElement, trigger: HTMLElement | null, align: "start" | "center" | "end") {
  if (!trigger) return;
  const rect = trigger.getBoundingClientRect();
  const width = element.offsetWidth;
  const height = element.offsetHeight;
  const gap = 6;
  const edge = 8;
  let left = align === "end" ? rect.right - width : align === "center" ? rect.left + (rect.width - width) / 2 : rect.left;
  left = Math.max(edge, Math.min(left, window.innerWidth - width - edge));
  let top = rect.bottom + gap;
  if (top + height > window.innerHeight - edge && rect.top - gap - height >= edge) top = rect.top - gap - height;
  element.style.left = `${left}px`;
  element.style.top = `${top}px`;
}

/** The menu panel. Shown in the top layer, so it is never clipped by a parent. */
export function DropdownMenuContent({
  align = "start",
  className,
  onKeyDown,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & { align?: "start" | "center" | "end" }) {
  const { open, setOpen, triggerRef } = useMenu();
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (open) {
      if (!element.matches(":popover-open")) element.showPopover();
      place(element, triggerRef.current, align);
      element.focus();
    } else if (element.matches(":popover-open")) {
      element.hidePopover();
    }
  }, [open, align, triggerRef]);

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (ref.current?.contains(target) || triggerRef.current?.contains(target)) return;
      close();
    };
    const onEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "Escape") return;
      close();
      triggerRef.current?.focus();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onEscape);
    window.addEventListener("resize", close);
    window.addEventListener("scroll", close, true);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onEscape);
      window.removeEventListener("resize", close);
      window.removeEventListener("scroll", close, true);
    };
  }, [open, setOpen, triggerRef]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
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
      className={classes(styles.content, className)}
    >
      {children}
    </div>
  );
}

export interface DropdownMenuItemProps extends Omit<ComponentPropsWithoutRef<"button">, "type"> {
  variant?: "default" | "destructive";
  /** Runs when the item is chosen. The menu closes afterwards. */
  onSelect?: () => void;
}

export function DropdownMenuItem({ variant = "default", onSelect, onClick, className, ...props }: DropdownMenuItemProps) {
  const { setOpen, triggerRef } = useMenu();
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
        triggerRef.current?.focus();
      }}
      className={classes(styles.item, className)}
    />
  );
}

export function DropdownMenuLabel({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={classes(styles.label, className)} />;
}

export function DropdownMenuSeparator({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div role="separator" {...props} className={classes(styles.separator, className)} />;
}

/** Keyboard shortcut hint, pushed to the right of the item. */
export function DropdownMenuShortcut({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span {...props} className={classes(styles.shortcut, className)} />;
}

/** Wraps a `DropdownMenuSubTrigger` and a `DropdownMenuSubContent`. Opens on hover or ArrowRight. */
export function DropdownMenuSub({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  const [open, setOpen] = useState(false);
  const keyboardOpen = useRef(false);
  const value = useMemo(() => ({ open, setOpen, keyboardOpen }), [open]);
  return (
    <SubContext.Provider value={value}>
      <div {...props} data-menu-sub="" onMouseLeave={() => setOpen(false)} className={classes(styles.sub, className)}>
        {children}
      </div>
    </SubContext.Provider>
  );
}

export function DropdownMenuSubTrigger({
  className,
  onClick,
  onKeyDown,
  children,
  ...props
}: Omit<ComponentPropsWithoutRef<"button">, "type">) {
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

export function DropdownMenuSubContent({ className, onKeyDown, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  const sub = useSub();
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element || !sub.open) return;
    element.removeAttribute("data-flip");
    if (element.getBoundingClientRect().right > window.innerWidth - 8) element.setAttribute("data-flip", "");
    if (sub.keyboardOpen.current) {
      sub.keyboardOpen.current = false;
      element.querySelector<HTMLElement>(ITEM_SELECTOR)?.focus();
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
