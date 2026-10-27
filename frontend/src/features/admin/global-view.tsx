"use client";

import { PublicPortfolio } from "@/components/portfolio/public-portfolio";
import { FormBanner, LoadingBlock } from "@/components/ui/feedback";
import { usePortfolioSettings } from "@/features/admin/portfolio-settings";
import { useSession } from "@/hooks/use-session";

export function GlobalView() {
  const session = useSession();
  const settings = usePortfolioSettings();

  if (!session) {
    return <LoadingBlock label="Checking your session" />;
  }

  if (settings.status === "loading" && !settings.hydrated) {
    return <LoadingBlock label="Loading portfolio settings" />;
  }

  return (
    <section className="stack global-view">
      <header className="page-intro">
        <h1>Global View</h1>
        <p>
          Live preview of the public portfolio with your saved accent, section visibility, and order.
          Theme follows the studio; visitors choose their own light or dark preference.
        </p>
      </header>
      {settings.error ? <FormBanner message={settings.error} /> : null}
      {settings.warning ? <p className="sidebar-note">{settings.warning}</p> : null}
      <div className="global-preview clay">
        <PublicPortfolio
          userName={session.userName}
          mode="preview"
          sectionOrder={settings.order}
          hiddenSections={settings.hidden}
        />
      </div>
    </section>
  );
}
