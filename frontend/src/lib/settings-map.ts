import { isPaletteId, type PaletteId } from "@/lib/config";
import type { PortfolioSettingsRequest, PortfolioSettingsResponse, SettingsTheme } from "@/types/settings";

/** Accents the current backend accepts (AdminPortfolioSettingsService.ALLOWED_ACCENTS). */
export const BACKEND_ACCENTS = [
  "MIDNIGHT_PARCHMENT",
  "TERRACOTTA",
  "LAGOON",
  "VERMILION",
] as const;

export type BackendAccent = (typeof BACKEND_ACCENTS)[number];

/** Map every studio palette to an allowed backend code so accents can persist. */
const FRONTEND_TO_BACKEND: Record<PaletteId, BackendAccent> = {
  midnight: "MIDNIGHT_PARCHMENT",
  forest: "TERRACOTTA",
  ocean: "LAGOON",
  vermilion: "VERMILION",
};

const BACKEND_TO_FRONTEND: Record<BackendAccent, PaletteId> = {
  MIDNIGHT_PARCHMENT: "midnight",
  TERRACOTTA: "forest",
  LAGOON: "ocean",
  VERMILION: "vermilion",
};

export function toBackendTheme(theme: "light" | "dark"): SettingsTheme {
  return theme === "dark" ? "DARK" : "LIGHT";
}

export function fromBackendTheme(theme: string | null | undefined): "light" | "dark" {
  return theme?.toUpperCase() === "DARK" ? "dark" : "light";
}

export function toBackendAccent(accent: PaletteId): BackendAccent {
  return FRONTEND_TO_BACKEND[accent];
}

export function fromBackendAccent(accent: string | null | undefined): PaletteId {
  const key = accent?.trim().toUpperCase() as BackendAccent | undefined;
  if (key && BACKEND_TO_FRONTEND[key]) return BACKEND_TO_FRONTEND[key];
  if (isPaletteId(accent ?? null)) return accent as PaletteId;
  return "midnight";
}

export function accentCanPersist(accent: PaletteId) {
  return Boolean(toBackendAccent(accent));
}

export function accentPersistWarning(_accent: PaletteId): string | null {
  return null;
}

export function visibilityMap(order: string[], hidden: string[]): Record<string, boolean> {
  const map: Record<string, boolean> = {};
  for (const id of order) map[id] = !hidden.includes(id);
  return map;
}

export function patchBodyFromPartial(partial: {
  theme?: "light" | "dark";
  accent?: PaletteId;
  order?: string[];
  hidden?: string[];
}): PortfolioSettingsRequest {
  const body: PortfolioSettingsRequest = {};
  if (partial.theme) body.theme = toBackendTheme(partial.theme);
  if (partial.accent) body.accentPalette = toBackendAccent(partial.accent);
  if (partial.order && partial.hidden) {
    body.sectionOrder = partial.order;
    body.sectionVisibility = visibilityMap(partial.order, partial.hidden);
  }
  return body;
}

export function parseOrder(raw: string[] | null | undefined, allowed: readonly string[]): string[] {
  const order: string[] = [];
  for (const entry of raw ?? []) {
    if (typeof entry === "string" && allowed.includes(entry) && !order.includes(entry)) order.push(entry);
  }
  for (const id of allowed) {
    if (!order.includes(id)) order.push(id);
  }
  return order;
}

export function parseHidden(
  order: string[],
  visibility: Record<string, boolean> | null | undefined,
): string[] {
  const hidden: string[] = [];
  const map = visibility ?? {};
  for (const id of order) {
    if (map[id] === false) hidden.push(id);
  }
  return hidden;
}

export function applySettingsResponse(response: PortfolioSettingsResponse, allowedSections: readonly string[]) {
  const order = parseOrder(response.sectionOrder, allowedSections);
  const hidden = parseHidden(order, response.sectionVisibility);
  return {
    theme: fromBackendTheme(response.theme),
    accent: fromBackendAccent(response.accentPalette),
    order,
    hidden,
    updatedAt: response.updatedAt,
  };
}
