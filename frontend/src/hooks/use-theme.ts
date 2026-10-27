"use client";

import { useSyncExternalStore } from "react";
import { getDefaultAccent, isPaletteId, type PaletteId } from "@/lib/config";
import {
  getPortfolioSettings,
  setAdminAccent,
  setAdminTheme,
  subscribePortfolioSettings,
} from "@/features/admin/portfolio-settings";

export const PALETTES = [
  {
    id: "forest",
    label: "Forest Meadow",
    swatch: "#9EC18B",
    chips: ["#EDF1D6", "#609966", "#9EC18B", "#3F513B"],
  },
  {
    id: "ocean",
    label: "Ocean Slate",
    swatch: "#9FB1BF",
    chips: ["#DEE5ED", "#526D82", "#9FB1BF", "#27374E"],
  },
  {
    id: "midnight",
    label: "Midnight & Parchment",
    swatch: "#362417",
    chips: ["#FFFBFF", "#92817A", "#F1DABF", "#362417"],
  },
  {
    id: "vermilion",
    label: "Vermilion",
    swatch: "#FC4C13",
    chips: ["#FFFFFF", "#808080", "#FC4C13", "#1D1D1D"],
  },
] as const;

export type { PaletteId };
export { isPaletteId };
export type ThemeMode = "light" | "dark";

const VISITOR_THEME_KEY = "dossier.visitor-theme";
const VISITOR_EVENT = "dossier-visitor-theme";
const DEFAULT_PALETTE = getDefaultAccent();

function subscribeVisitor(onStoreChange: () => void) {
  window.addEventListener(VISITOR_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(VISITOR_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function notifyVisitor() {
  window.dispatchEvent(new Event(VISITOR_EVENT));
}

export function readVisitorTheme(): ThemeMode {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem(VISITOR_THEME_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return "light";
}

export function writeVisitorTheme(next: ThemeMode) {
  localStorage.setItem(VISITOR_THEME_KEY, next);
  notifyVisitor();
}

/** Public-site theme: visitor preference only, never the admin studio theme. */
export function useVisitorTheme() {
  const theme = useSyncExternalStore(subscribeVisitor, readVisitorTheme, () => "light" as ThemeMode);
  return {
    theme,
    setTheme: (next: ThemeMode) => {
      writeVisitorTheme(next);
      document.documentElement.dataset.theme = next;
    },
  };
}

/** Admin studio appearance: theme + accent from backend-backed settings. */
export function useAdminAppearance() {
  const settings = useSyncExternalStore(
    subscribePortfolioSettings,
    getPortfolioSettings,
    getPortfolioSettings,
  );
  return {
    theme: settings.theme,
    accent: settings.accent,
    status: settings.status,
    hydrated: settings.hydrated,
    error: settings.error,
    warning: settings.warning,
    setTheme: setAdminTheme,
    setAccent: setAdminAccent,
    palettes: PALETTES,
  };
}

/** @deprecated Prefer useVisitorTheme or useAdminAppearance for clear separation. */
export function useTheme() {
  return useVisitorTheme();
}

export function getDefaultPalette() {
  return DEFAULT_PALETTE;
}
