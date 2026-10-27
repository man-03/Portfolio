"use client";

import { FormBanner } from "@/components/ui/feedback";

const BLOCKERS = [
  {
    title: "Analytics charts",
    detail:
      "No admin analytics endpoints exist for referral visits, resume downloads, or contact submissions (ranges: 3 months, 6 months, 1 year, all time).",
    expected:
      "GET /api/admin/{userName}/analytics?range=3m|6m|1y|all returning time-bucketed series for referrals (known vs direct/unknown), successful resume downloads, and successful contact submissions.",
  },
  {
    title: "Contact submissions inbox",
    detail:
      "Admin contact APIs manage published email/phone only. There is no API to list, archive, delete, search, export, or mark visitor form messages as READ.",
    expected:
      "Authenticated endpoints under /api/admin/{userName}/contact-submissions (or equivalent) for list/filter/sort, archive, delete, mark-read, and optional Excel export — distinct from POST /api/public/contact.",
  },
] as const;

export function DashboardView() {
  return (
    <section className="stack">
      <header className="page-intro">
        <h1>Dashboard</h1>
        <p>
          Analytics and the contact-submissions table need backend APIs before they can be wired. Settings, theme, and Global View are available now.
        </p>
      </header>

      <FormBanner message="Dashboard charts and contact inbox are blocked: required admin APIs are not available yet." />

      <div className="card-grid">
        {BLOCKERS.map((item) => (
          <article key={item.title} className="panel clay stack">
            <h2>{item.title}</h2>
            <p>{item.detail}</p>
            <p className="muted">
              Expected contract: {item.expected}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
