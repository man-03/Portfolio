"use client";

import { useEffect, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import { useAdminAppearance, useVisitorTheme, readVisitorTheme } from "@/hooks/use-theme";
import { useSession } from "@/hooks/use-session";
import { setUnauthorizedHandler } from "@/services/api-client";
import { clearSession } from "@/lib/session";
import { ToastProvider } from "@/hooks/use-toast";
import {
  loadPortfolioSettings,
  resetPortfolioSettings,
} from "@/features/admin/portfolio-settings";
import { getDefaultAccent } from "@/lib/config";
import {
  applyAdminAppearance,
  applyPublicAccent,
  getBootBrand,
  loadPublicSiteBrand,
  readSiteBrand,
  resolvePortfolioUserName,
} from "@/lib/site-brand";

function isAuthPath(pathname: string | null) {
  if (!pathname) return false;
  return (
    pathname === "/login" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password" ||
    pathname.startsWith("/login/") ||
    pathname.startsWith("/forgot-password/") ||
    pathname.startsWith("/reset-password/")
  );
}

function AppearanceSync() {
  const pathname = usePathname();
  const session = useSession();
  const isAdminRoute = pathname?.startsWith("/admin") ?? false;
  const isAuthRoute = isAuthPath(pathname);
  const isPublicHome = pathname === "/";
  const visitor = useVisitorTheme();
  const admin = useAdminAppearance();

  useEffect(() => {
    setUnauthorizedHandler(() => {
      clearSession();
      resetPortfolioSettings();
    });
  }, []);

  // Admin: fetch settings from API after login / refresh (source of truth).
  useEffect(() => {
    if (!session?.userName || !isAdminRoute) return;
    void loadPortfolioSettings(session.userName, { force: true });
  }, [session?.userName, isAdminRoute]);

  useEffect(() => {
    if (session) return;
    // Clear in-memory admin store only — do not wipe sessionStorage brand (login/admin paint).
    resetPortfolioSettings();
  }, [session]);

  // Sync DOM before paint so React hydration does not flash defaults on admin/auth.
  useLayoutEffect(() => {
    if (isAdminRoute || isAuthRoute) {
      applyAdminAppearance(getBootBrand());
      return;
    }
    if (isPublicHome) {
      document.documentElement.dataset.theme = readVisitorTheme();
      const brand = readSiteBrand();
      applyPublicAccent(brand?.accent ?? getDefaultAccent());
    }
  }, [isAdminRoute, isAuthRoute, isPublicHome, pathname]);

  // Auth pages: confirm appearance from public settings (includes admin theme + accent).
  useEffect(() => {
    if (!isAuthRoute) return;
    applyAdminAppearance(getBootBrand());

    const userName = resolvePortfolioUserName();
    if (!userName) return;

    const controller = new AbortController();
    void loadPublicSiteBrand(userName, controller.signal)
      .then((brand) => {
        applyAdminAppearance(brand);
      })
      .catch((caught) => {
        if (caught instanceof Error && caught.message === "PUBLIC_SETTINGS_MISSING") {
          console.warn(
            "[dossier] Public portfolio response has no settings field; login branding uses last confirmed admin appearance only.",
          );
        }
        applyAdminAppearance(getBootBrand());
      });

    return () => controller.abort();
  }, [isAuthRoute, pathname]);

  useEffect(() => {
    if (isAdminRoute && session) {
      if (admin.status === "ready" || admin.status === "saving") {
        document.documentElement.dataset.theme = admin.theme;
        document.documentElement.dataset.accent = admin.accent;
      } else {
        applyAdminAppearance(getBootBrand());
      }
      return;
    }

    if (isAuthRoute) return;

    if (isPublicHome) {
      // Visitor theme only — never admin theme.
      document.documentElement.dataset.theme = visitor.theme;
      return;
    }

    // Other non-admin routes (e.g. not-found): light visitor + known accent.
    document.documentElement.dataset.theme = visitor.theme;
    applyPublicAccent(readSiteBrand()?.accent ?? getDefaultAccent());
  }, [
    isAdminRoute,
    isAuthRoute,
    isPublicHome,
    session,
    admin.theme,
    admin.accent,
    admin.status,
    visitor.theme,
    pathname,
  ]);

  return null;
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <AppearanceSync />
      {children}
    </ToastProvider>
  );
}
