import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "cctv-prakasam-theme";

function getInitialTheme(): Theme {
  if (typeof window === "undefined")
    return "light";

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "dark" || stored === "light")
    return stored;

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

let currentTheme: Theme = getInitialTheme();
const listeners = new Set<() => void>();

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return currentTheme;
}

function setTheme(theme: Theme) {
  currentTheme = theme;
  localStorage.setItem(STORAGE_KEY, theme);
  applyTheme(theme);
  listeners.forEach(listener => listener());
}

function toggleTheme() {
  setTheme(currentTheme === "light" ? "dark" : "light");
}

// Apply on load
applyTheme(currentTheme);

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot);
  return { theme, setTheme, toggleTheme };
}
