"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type ThemeMode = "light" | "dark" | "system";

interface ThemeContextType {
  theme: ThemeMode;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "tmr_theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  // Determine system preference
  const getSystemTheme = (): "light" | "dark" => {
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  };

  const applyThemeToDOM = (effective: "light" | "dark") => {
    const root = document.documentElement;
    if (effective === "dark") {
      root.classList.add("dark");
      root.style.colorScheme = "dark";
    } else {
      root.classList.remove("dark");
      root.style.colorScheme = "light";
    }
  };

  useEffect(() => {
    // 1. Load saved preference from localStorage
    const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
    const initialMode: ThemeMode = saved === "light" || saved === "dark" || saved === "system" ? saved : "system";
    setThemeState(initialMode);

    const effective = initialMode === "system" ? getSystemTheme() : initialMode;
    setResolvedTheme(effective);
    applyThemeToDOM(effective);

    // 2. Listen to system preference changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const current = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
      if (!current || current === "system") {
        const sys = getSystemTheme();
        setResolvedTheme(sys);
        applyThemeToDOM(sys);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);

    const effective = newTheme === "system" ? getSystemTheme() : newTheme;
    setResolvedTheme(effective);
    applyThemeToDOM(effective);
  };

  const toggleTheme = () => {
    if (resolvedTheme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
