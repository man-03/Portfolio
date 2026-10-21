"use client";

import Link from "next/link";
import { LoadingBlock } from "@/components/ui/feedback";
import { useSession } from "@/hooks/use-session";
import { useAdminInventory } from "@/features/admin/use-inventory";

const ROWS = [
  {
    label: "Profile",
    href: "/admin/profile",
    present: (ready: boolean) => ready,
    detail: "Required, with address and contact, before the public page can load.",
  },
  {
    label: "About",
    href: "/admin/profile",
    present: (about: boolean) => about,
    detail: "Omitted, including its heading, when the about text is empty.",
  },
  {
    label: "Skills",
    href: "/admin/skills",
    present: (count: number) => count > 0,
    detail: "Omitted when there are no skills.",
  },
  {
    label: "Projects",
    href: "/admin/projects",
    present: (count: number) => count > 0,
    detail: "Omitted when there are no projects.",
  },
  {
    label: "Experience",
    href: "/admin/experience",
    present: (count: number) => count > 0,
    detail: "Omitted when there are no roles.",
  },
  {
    label: "Education",
    href: "/admin/education",
    present: (count: number) => count > 0,
    detail: "Omitted when there are no education records.",
  },
  {
    label: "Licenses and certifications",
    href: "/admin/credentials",
    present: (count: number) => count > 0,
    detail: "Omitted when there are no credentials.",
  },
  {
    label: "Links",
    href: "/admin/links",
    present: (count: number) => count > 0,
    detail: "Omitted when there are no links.",
  },
  {
    label: "Activities",
    href: "/admin/activities",
    present: (count: number) => count > 0,
    detail: "Omitted when there are no activities.",
  },
  {
    label: "Resume",
    href: "/admin/resume",
    present: (ready: boolean) => ready,
    detail: "Omitted when no PDF is stored.",
  },
  {
    label: "Contact",
    href: "/admin/contact",
    present: (ready: boolean) => ready,
    detail: "Required for the public page to load. The message form is part of this section.",
  },
] as const;

export function SectionsView() {
  const session = useSession();
  const { inventory, loading } = useAdminInventory(session?.userName);
  const flags = [
    inventory.profile,
    inventory.about,
    inventory.skills,
    inventory.projects,
    inventory.experience,
    inventory.education,
    inventory.credentials,
    inventory.links,
    inventory.activities,
    inventory.resume,
    inventory.contact,
  ];

  return (
    <section className="stack">
      <header className="page-intro">
        <h1>Section visibility</h1>
        <p>
          The backend does not store a show or hide flag for portfolio sections. A section with no content is left out of the public page entirely: no heading, no empty message, and no placeholder.
        </p>
      </header>
      <article className="callout clay">
        <p>
          To hide a section from every visitor, remove its records. Appearance choices such as light or dark mode stay in this browser and do not change which sections exist.
        </p>
      </article>
      {loading ? <LoadingBlock label="Checking section content" /> : null}
      {!loading ? (
        <div className="clay panel">
          <table className="status-table">
            <thead>
              <tr>
                <th scope="col">Section</th>
                <th scope="col">Public page</th>
                <th scope="col">How it is decided</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, index) => {
                const visible = row.present(flags[index] as never);
                return (
                  <tr key={row.label}>
                    <td>
                      <Link href={row.href}>{row.label}</Link>
                    </td>
                    <td>
                      <span className="status-pill">{visible ? "Shown" : "Omitted"}</span>
                    </td>
                    <td>{row.detail}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
}
