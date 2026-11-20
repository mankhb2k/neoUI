"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect } from "react";
import { useThemeStore } from "./theme-store";
import css from "../app/SiteHeader.module.css";

export function ThemeBridge() {
  const mode = useThemeStore((state) => state.mode);

  useEffect(() => {
    document.documentElement.dataset.theme = mode;
  }, [mode]);

  useEffect(() => {
    void useThemeStore.persist.rehydrate();
  }, []);

  return null;
}

export function ThemeToggle() {
  const mode = useThemeStore((state) => state.mode);
  const toggleMode = useThemeStore((state) => state.toggleMode);
  const Icon = mode === "dark" ? Sun : Moon;
  const nextMode = mode === "dark" ? "light" : "dark";

  return (
    <button className={css.themeToggle} type="button" onClick={toggleMode} aria-label={`Switch to ${nextMode} mode`} title={`Switch to ${nextMode} mode`}>
      <Icon size={17} aria-hidden="true" />
    </button>
  );
}
