import Link from "next/link";

export default function NotFound() {
  return (
    <main id="content" className="page">
      <section className="clay panel">
        <p className="kicker">manoj.dossier</p>
        <h1>Page not found</h1>
        <p className="auth-copy">That address is not part of this portfolio.</p>
        <Link href="/" className="btn btn-primary">
          Back to the portfolio
        </Link>
      </section>
    </main>
  );
}
