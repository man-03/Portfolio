import Link from "next/link";

const LABEL = "MANOJ\u2019S DOSSIER";

export function Wordmark({ href }: { href?: string }) {
  if (href) {
    return (
      <Link href={href} className="wordmark">
        {LABEL}
      </Link>
    );
  }
  return <p className="wordmark">{LABEL}</p>;
}
