"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type ThemeMode = "light" | "dark";

type ThemeState = {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: "dark",
      setMode: (mode) => set({ mode }),
      toggleMode: () => set((state) => ({ mode: state.mode === "dark" ? "light" : "dark" })),
    }),
    {
      name: "neonix-ui-theme",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
);
