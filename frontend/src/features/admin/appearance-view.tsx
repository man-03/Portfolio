"use client";

import { ThemeControls } from "@/components/theme-controls";
import { ACCENTS } from "@/hooks/use-theme";

export function AppearanceView() {
  return (
    <section className="stack">
      <header className="page-intro">
        <h1>Appearance</h1>
        <p>Light or dark mode and the accent color are saved in this browser and apply to both the portfolio and the studio.</p>
      </header>
      <article className="panel clay stack">
        <h2>Theme and accent</h2>
        <ThemeControls />
        <ul className="plain-list">
          {ACCENTS.map((accent) => (
            <li key={accent.id} className="pill">
              {accent.label}
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
