"use client";

import { useTheme } from "@/hooks/use-theme";

export function ThemeControls({ compact = false }: { compact?: boolean }) {
  const { theme, accent, setTheme, setAccent, accents } = useTheme();
  const dark = theme === "dark";

  return (
    <div className={compact ? "theme-controls compact" : "theme-controls"}>
      <button
        type="button"
        className="theme-toggle"
        aria-pressed={dark}
        onClick={() => setTheme(dark ? "light" : "dark")}
      >
        {dark ? "Light mode" : "Dark mode"}
      </button>
      <div className="swatch-row" role="radiogroup" aria-label="Accent color">
        {accents.map((item) => (
          <button
            key={item.id}
            type="button"
            role="radio"
            aria-checked={accent === item.id}
            aria-label={item.label}
            className={`swatch ${accent === item.id ? "is-selected" : ""}`}
            style={{ background: item.swatch }}
            onClick={() => setAccent(item.id)}
          />
        ))}
      </div>
    </div>
  );
}
