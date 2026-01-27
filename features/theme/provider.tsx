"use client";

import { createContext, useCallback, useEffect, useSyncExternalStore, type ReactNode } from "react";
import { DEFAULT_THEME, STORAGE_KEY, VALID_THEMES } from "./config";
import type { ColorTheme } from "./types";

interface ColorThemeContextValue {
  colorTheme: ColorTheme;
  setColorTheme: (theme: ColorTheme) => void;
}

export const ColorThemeContext = createContext<ColorThemeContextValue | undefined>(undefined);

function getStoredTheme(): ColorTheme {
  if (typeof window === "undefined") return DEFAULT_THEME;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && VALID_THEMES.includes(stored as ColorTheme)) {
    return stored as ColorTheme;
  }
  return DEFAULT_THEME;
}

// Store pour useSyncExternalStore
let listeners: (() => void)[] = [];
let currentTheme: ColorTheme = DEFAULT_THEME;

function subscribe(listener: () => void) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function getSnapshot(): ColorTheme {
  return currentTheme;
}

function getServerSnapshot(): ColorTheme {
  return DEFAULT_THEME;
}

function setTheme(theme: ColorTheme) {
  currentTheme = theme;
  localStorage.setItem(STORAGE_KEY, theme);
  document.body.setAttribute("data-theme", theme);
  listeners.forEach((listener) => listener());
}

export function ColorThemeProvider({ children }: { children: ReactNode }) {
  const colorTheme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Initialiser le theme depuis localStorage au mount
  useEffect(() => {
    const stored = getStoredTheme();
    if (stored !== currentTheme) {
      currentTheme = stored;
      document.body.setAttribute("data-theme", stored);
      listeners.forEach((listener) => listener());
    }
  }, []);

  const setColorTheme = useCallback((theme: ColorTheme) => {
    setTheme(theme);
  }, []);

  return <ColorThemeContext.Provider value={{ colorTheme, setColorTheme }}>{children}</ColorThemeContext.Provider>;
}
