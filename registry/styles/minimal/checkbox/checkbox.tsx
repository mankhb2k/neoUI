"use client";

import { useCallback, useLayoutEffect, useRef, type InputHTMLAttributes, type Ref } from "react";
import styles from "./checkbox.module.css";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  /** Shows a dash instead of a check, for a parent whose children are only partly selected. */
  indeterminate?: boolean;
  ref?: Ref<HTMLInputElement>;
}

/** A box for choosing one or more options. Wrap it in a label so the text next to it is clickable too. */
export function Checkbox({ indeterminate = false, className, ref, ...props }: CheckboxProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  // `indeterminate` has no HTML attribute, so it is set on the element itself.
  useLayoutEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate;
  });

  const setRef = useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  return (
    <input
      ref={setRef}
      type="checkbox"
      {...props}
      className={[styles.checkbox, className].filter(Boolean).join(" ")}
    />
  );
}
