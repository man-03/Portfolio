"use client";

import Link from "next/link";

export function Brand({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="brand">
      <span className="brand-seal" aria-hidden="true">
        md
      </span>
      <span className="brand-word">
        manoj<span>.dossier</span>
      </span>
    </Link>
  );
}
