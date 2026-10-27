"use client";

import type { ThemeMode } from "@/hooks/use-theme";

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2.2M12 19.8V22M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M2 12h2.2M19.8 12H22M4.9 19.1l1.6-1.6M17.5 6.5l1.6-1.6" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.5 14.2A8.2 8.2 0 0 1 9.8 3.5 8.5 8.5 0 1 0 20.5 14.2Z" />
    </svg>
  );
}

export function ThemeModeSwitch({
  theme,
  onChange,
  label = "Color theme",
}: {
  theme: ThemeMode;
  onChange: (theme: ThemeMode) => void;
  label?: string;
}) {
  const dark = theme === "dark";
  return (
    <div className={`theme-switch ${dark ? "is-dark" : "is-light"}`} role="group" aria-label={label}>
      <span className="theme-switch-thumb" aria-hidden="true" />
      <button
        type="button"
        className={`theme-switch-btn ${dark ? "" : "is-active"}`}
        aria-pressed={!dark}
        aria-label="Light mode"
        onClick={() => onChange("light")}
      >
        <SunIcon />
      </button>
      <button
        type="button"
        className={`theme-switch-btn ${dark ? "is-active" : ""}`}
        aria-pressed={dark}
        aria-label="Dark mode"
        onClick={() => onChange("dark")}
      >
        <MoonIcon />
      </button>
    </div>
  );
}
