"use client";

import { useEffect } from "react";
import { useTheme } from "@/hooks/use-theme";
import { setUnauthorizedHandler } from "@/services/api-client";
import { clearSession } from "@/lib/session";
import { ToastProvider } from "@/hooks/use-toast";

function AppearanceSync() {
  const { theme, accent } = useTheme();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.accent = accent;
  }, [theme, accent]);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      clearSession();
    });
  }, []);

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
