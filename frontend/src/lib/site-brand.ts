import { getDefaultAccent, getPortfolioUserName, isPaletteId, type PaletteId } from "@/lib/config";
import { applySettingsResponse } from "@/lib/settings-map";
import { SECTION_IDS } from "@/features/admin/section-ids";
import { loadPortfolio } from "@/services/portfolio-api";

/** Last confirmed admin appearance (theme+accent). Used for admin/auth paint only — not public theme. */
const BRAND_KEY = "dossier.site-brand";
const USER_KEY = "dossier.portfolio-username";
const EVENT = "dossier-site-brand";

export type SiteBrand = {
  theme: "light" | "dark";
  accent: PaletteId;
  userName?: string;
};

function notify() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(EVENT));
}

export function rememberPortfolioUserName(userName: string) {
  if (typeof window === "undefined" || !userName.trim()) return;
  sessionStorage.setItem(USER_KEY, userName.trim());
}

export function resolvePortfolioUserName() {
  const configured = getPortfolioUserName();
  if (configured) return configured;
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem(USER_KEY)?.trim() || readSiteBrand()?.userName?.trim() || "";
}

export function readSiteBrand(): SiteBrand | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(BRAND_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    const theme = "theme" in parsed ? parsed.theme : null;
    const accent = "accent" in parsed && typeof parsed.accent === "string" ? parsed.accent : null;
    const userName =
      "userName" in parsed && typeof parsed.userName === "string" ? parsed.userName.trim() : undefined;
    if ((theme !== "light" && theme !== "dark") || !isPaletteId(accent)) {
      return null;
    }
    return { theme, accent, userName };
  } catch {
    return null;
  }
}

export function writeSiteBrand(brand: SiteBrand) {
  if (typeof window === "undefined") return;
  const userName = brand.userName?.trim() || resolvePortfolioUserName() || undefined;
  const next: SiteBrand = {
    theme: brand.theme,
    accent: brand.accent,
    ...(userName ? { userName } : {}),
  };
  sessionStorage.setItem(BRAND_KEY, JSON.stringify(next));
  if (userName) sessionStorage.setItem(USER_KEY, userName);
  notify();
}

/** Apply admin/auth appearance (theme + accent). Never use for public visitors. */
export function applyAdminAppearance(brand: SiteBrand) {
  document.documentElement.dataset.theme = brand.theme;
  document.documentElement.dataset.accent = brand.accent;
}

/** Public visitors: accent only — theme stays visitor-controlled. */
export function applyPublicAccent(accent: PaletteId) {
  document.documentElement.dataset.accent = accent;
}

export function getBootBrand(): SiteBrand {
  return readSiteBrand() ?? { theme: "light", accent: getDefaultAccent() };
}

/**
 * Load shared public configuration (accent + admin theme for auth branding).
 * Source: POST /api/public/{userName} → settings.
 */
export async function loadPublicSiteBrand(userName: string, signal?: AbortSignal) {
  const name = userName.trim();
  if (!name) return getBootBrand();
  const portfolio = await loadPortfolio(name, signal);
  if (!portfolio.settings) {
    // Public payload has no settings block — report via throw for callers that care.
    throw new Error("PUBLIC_SETTINGS_MISSING");
  }
  const applied = applySettingsResponse(portfolio.settings, SECTION_IDS);
  const brand: SiteBrand = {
    theme: applied.theme,
    accent: applied.accent,
    userName: name,
  };
  writeSiteBrand(brand);
  return brand;
}

export function subscribeSiteBrand(onStoreChange: () => void) {
  window.addEventListener(EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}
