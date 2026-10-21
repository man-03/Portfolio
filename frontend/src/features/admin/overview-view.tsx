"use client";

import Link from "next/link";
import { LoadingBlock } from "@/components/ui/feedback";
import { useSession } from "@/hooks/use-session";
import { formatCount } from "@/lib/format";
import { useAdminInventory } from "@/features/admin/use-inventory";

const CARDS = [
  { href: "/admin/profile", label: "Profile", key: "profile" },
  { href: "/admin/skills", label: "Skills", key: "skills" },
  { href: "/admin/projects", label: "Projects", key: "projects" },
  { href: "/admin/experience", label: "Experience", key: "experience" },
  { href: "/admin/education", label: "Education", key: "education" },
  { href: "/admin/credentials", label: "Credentials", key: "credentials" },
  { href: "/admin/links", label: "Links", key: "links" },
  { href: "/admin/activities", label: "Activities", key: "activities" },
  { href: "/admin/contact", label: "Contact", key: "contact" },
  { href: "/admin/resume", label: "Resume", key: "resume" },
] as const;

export function OverviewView() {
  const session = useSession();
  const { inventory, loading } = useAdminInventory(session?.userName);

  return (
    <section className="stack">
      <header className="page-intro">
        <h1>Overview</h1>
        <p>A snapshot of the records behind the public portfolio.</p>
      </header>
      {loading ? <LoadingBlock label="Loading overview" /> : null}
      {!loading ? (
        <div className="stat-grid">
          {CARDS.map((card) => {
            const value = inventory[card.key];
            const detail = typeof value === "boolean" ? (value ? "On record" : "Missing") : formatCount(value, "record");
            return (
              <Link key={card.href} href={card.href} className="stat-card clay">
                <span>{card.label}</span>
                <strong>{typeof value === "boolean" ? (value ? "Yes" : "No") : value}</strong>
                <span>{detail}</span>
              </Link>
            );
          })}
        </div>
      ) : null}
      {!loading && (!inventory.profile || !inventory.address || !inventory.contact) ? (
        <article className="callout clay">
          <h2>Public page requirements</h2>
          <p>The public portfolio loads only when the profile, address, and contact records all exist.</p>
        </article>
      ) : null}
      {inventory.notes.map((note) => (
        <p key={note} className="form-banner" role="status">
          {note}
        </p>
      ))}
    </section>
  );
}
