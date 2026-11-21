"use client";

import {
  cloneElement,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type HTMLAttributes,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import styles from "./dialog.module.css";

type DialogContextValue = { open: boolean; setOpen: (open: boolean) => void };
const DialogContext = createContext<DialogContextValue | null>(null);

function useDialogContext() {
  const context = useContext(DialogContext);
  if (!context) throw new Error("Dialog parts must be rendered inside <Dialog>.");
  return context;
}

type RenderElement = ReactElement<{ onClick?: (event: MouseEvent<HTMLElement>) => void; "aria-haspopup"?: string }>;

export interface DialogProps {
  /** Controlled open state. Omit it to let the dialog manage its own state. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
}

/** Holds the open state for its trigger and content. Renders no DOM of its own. */
export function Dialog({ open, defaultOpen = false, onOpenChange, children }: DialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = open !== undefined;
  const isOpen = open ?? uncontrolledOpen;

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  const value = useMemo(() => ({ open: isOpen, setOpen }), [isOpen, setOpen]);
  return <DialogContext.Provider value={value}>{children}</DialogContext.Provider>;
}

/** Opens the dialog. Pass a button with `render`, or use children for a default button. */
export function DialogTrigger({
  render,
  onClick,
  children,
  ...props
}: ComponentPropsWithoutRef<"button"> & { render?: RenderElement }) {
  const { setOpen } = useDialogContext();
  if (render) {
    return cloneElement(render, {
      "aria-haspopup": "dialog",
      onClick: (event: MouseEvent<HTMLElement>) => {
        render.props.onClick?.(event);
        setOpen(true);
      },
    });
  }
  return (
    <button type="button" aria-haspopup="dialog" {...props} onClick={(event) => { onClick?.(event); setOpen(true); }}>
      {children}
    </button>
  );
}

/** Closes the dialog. Pass a button with `render`, or use children for a default button. */
export function DialogClose({
  render,
  onClick,
  children,
  ...props
}: ComponentPropsWithoutRef<"button"> & { render?: RenderElement }) {
  const { setOpen } = useDialogContext();
  if (render) {
    return cloneElement(render, {
      onClick: (event: MouseEvent<HTMLElement>) => {
        render.props.onClick?.(event);
        setOpen(false);
      },
    });
  }
  return (
    <button type="button" {...props} onClick={(event) => { onClick?.(event); setOpen(false); }}>
      {children}
    </button>
  );
}

/** The modal panel. Opens with `showModal()`, closes on Escape or when `open` becomes false. */
export function DialogContent({ className, children, ...props }: ComponentPropsWithoutRef<"dialog">) {
  const { open, setOpen } = useDialogContext();
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const handleClose = () => {
      if (open) setOpen(false);
    };
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [open, setOpen]);

  return (
    <dialog {...props} ref={ref} className={[styles.dialog, className].filter(Boolean).join(" ")}>
      {children}
    </dialog>
  );
}

/** Fixed-height macOS-style header with window dots. Put the title inside. The X close button shows by default; set `showCloseButton={false}` to hide it. */
export function DialogHeader({
  className,
  children,
  showCloseButton = true,
  ...props
}: HTMLAttributes<HTMLDivElement> & { showCloseButton?: boolean }) {
  const { setOpen } = useDialogContext();
  return (
    <div {...props} className={[styles.header, className].filter(Boolean).join(" ")}>
      <span className={styles.windowControls} aria-hidden="true"><i /><i /><i /></span>
      <div className={styles.title}>{children}</div>
      {showCloseButton && (
        <button type="button" className={styles.close} aria-label="Close" onClick={() => setOpen(false)}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

export function DialogBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={[styles.body, className].filter(Boolean).join(" ")} />;
}

/** Fixed-height footer for actions. */
export function DialogFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={[styles.footer, className].filter(Boolean).join(" ")} />;
}
