"use client";

import { useSyncExternalStore } from "react";

export const ACCENTS = [
  { id: "terracotta", label: "Terracotta", swatch: "#c4623a" },
  { id: "lagoon", label: "Lagoon", swatch: "#0f766e" },
  { id: "iris", label: "Iris", swatch: "#5b4fd6" },
  { id: "amber", label: "Amber", swatch: "#b7791f" },
  { id: "rosewood", label: "Rosewood", swatch: "#be4b6a" },
] as const;

export type AccentId = (typeof ACCENTS)[number]["id"];
export type ThemeMode = "light" | "dark";

const THEME_KEY = "dossier.theme";
const ACCENT_KEY = "dossier.accent";
const THEME_EVENT = "dossier-theme";

function subscribe(onStoreChange: () => void) {
  window.addEventListener(THEME_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(THEME_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function notify() {
  window.dispatchEvent(new Event(THEME_EVENT));
}

export function readTheme(): ThemeMode {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function readAccent(): AccentId {
  const stored = localStorage.getItem(ACCENT_KEY);
  return ACCENTS.some((accent) => accent.id === stored) ? (stored as AccentId) : "terracotta";
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, readTheme, () => "light" as ThemeMode);
  const accent = useSyncExternalStore(subscribe, readAccent, () => "terracotta" as AccentId);

  const setTheme = (next: ThemeMode) => {
    localStorage.setItem(THEME_KEY, next);
    document.documentElement.dataset.theme = next;
    notify();
  };

  const setAccent = (next: AccentId) => {
    localStorage.setItem(ACCENT_KEY, next);
    document.documentElement.dataset.accent = next;
    notify();
  };

  return { theme, accent, setTheme, setAccent, accents: ACCENTS };
}
