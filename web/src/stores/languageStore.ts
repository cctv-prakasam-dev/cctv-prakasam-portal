import { useSyncExternalStore } from "react";

type Language = "en" | "te";

const STORAGE_KEY = "cctv-prakasam-lang";

function getInitialLanguage(): Language {
  if (typeof window === "undefined")
    return "en";

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "en" || stored === "te")
    return stored;

  return "en";
}

let currentLanguage: Language = getInitialLanguage();
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return currentLanguage;
}

function setLanguage(lang: Language) {
  currentLanguage = lang;
  localStorage.setItem(STORAGE_KEY, lang);
  listeners.forEach(listener => listener());
}

function toggleLanguage() {
  setLanguage(currentLanguage === "en" ? "te" : "en");
}

export function useLanguage() {
  const language = useSyncExternalStore(subscribe, getSnapshot);
  return { language, setLanguage, toggleLanguage };
}
