"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/controls";
import { clearSession } from "@/lib/session";

const NAV = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/profile", label: "Profile" },
  { href: "/admin/skills", label: "Skills" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/experience", label: "Experience" },
  { href: "/admin/education", label: "Education" },
  { href: "/admin/credentials", label: "Credentials" },
  { href: "/admin/links", label: "Links" },
  { href: "/admin/activities", label: "Activities" },
  { href: "/admin/contact", label: "Contact" },
  { href: "/admin/resume", label: "Resume" },
  { href: "/admin/appearance", label: "Appearance" },
  { href: "/admin/sections", label: "Section visibility" },
  { href: "/admin/password", label: "Password" },
];

export function AdminShell({ userName, children }: { userName: string; children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Brand />
        <nav className="admin-nav" aria-label="Admin">
          {NAV.map((item) => {
            const current = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} aria-current={current ? "page" : undefined}>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="admin-main">
        <header className="admin-topbar glass">
          <p>
            Signed in as <strong>{userName}</strong>
          </p>
          <div className="row">
            <Link href="/" className="btn btn-secondary">
              View portfolio
            </Link>
            <Button
              variant="ghost"
              onClick={() => {
                clearSession();
                router.replace("/login");
              }}
            >
              Log out
            </Button>
          </div>
        </header>
        <div id="content" className="admin-content">
          {children}
        </div>
      </div>
    </div>
  );
}
