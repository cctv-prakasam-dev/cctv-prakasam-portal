import { useSyncExternalStore } from "react";
const STORAGE_KEY = "cctv-prakasam-theme";
function getInitialTheme() {
    if (typeof window === "undefined")
        return "light";
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "dark" || stored === "light")
        return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
}
let currentTheme = getInitialTheme();
const listeners = new Set();
function applyTheme(theme) {
    document.documentElement.classList.toggle("dark", theme === "dark");
}
function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}
function getSnapshot() {
    return currentTheme;
}
function setTheme(theme) {
    currentTheme = theme;
    localStorage.setItem(STORAGE_KEY, theme);
    applyTheme(theme);
    listeners.forEach((listener) => listener());
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
