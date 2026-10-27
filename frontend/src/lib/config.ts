/**
 * API origin for browser fetches.
 * Empty string = same-origin (Next.js rewrite proxies to the Spring Boot API),
 * which avoids CORS preflight failures such as OPTIONS 403 when PATCH is not
 * listed in backend allowedMethods.
 */
export function getApiBaseUrl() {
  if (typeof window !== "undefined") {
    return "";
  }
  const configured = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  return (configured || "http://localhost:8080").replace(/\/$/, "");
}

export function getPortfolioUserName() {
  return process.env.NEXT_PUBLIC_PORTFOLIO_USERNAME?.trim() ?? "";
}

export function getSiteName() {
  return process.env.NEXT_PUBLIC_SITE_NAME?.trim() || "Manoj's Dossier";
}

export const PALETTE_IDS = ["forest", "ocean", "midnight", "vermilion"] as const;

export type PaletteId = (typeof PALETTE_IDS)[number];

export function isPaletteId(value: string | null | undefined): value is PaletteId {
  return PALETTE_IDS.some((id) => id === value);
}

export function getDefaultAccent(): PaletteId {
  const configured = process.env.NEXT_PUBLIC_DEFAULT_ACCENT?.trim();
  return isPaletteId(configured) ? configured : "midnight";
}
