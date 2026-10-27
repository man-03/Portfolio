"use client";

import { ThemeModeSwitch } from "@/components/theme-mode-switch";
import { useVisitorTheme } from "@/hooks/use-theme";

/** Public portfolio light/dark toggle. Never writes admin settings. */
export function ThemeControls({ compact = false }: { compact?: boolean }) {
  const { theme, setTheme } = useVisitorTheme();

  return (
    <div className={compact ? "theme-controls compact" : "theme-controls"}>
      <ThemeModeSwitch theme={theme} onChange={setTheme} label="Visitor color theme" />
    </div>
  );
}
