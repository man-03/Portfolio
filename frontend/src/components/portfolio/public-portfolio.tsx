"use client";

import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { Brand } from "@/components/brand";
import { ThemeControls } from "@/components/theme-controls";
import { Button, TextArea, TextField } from "@/components/ui/controls";
import { ErrorState, FormBanner, Skeleton, SuccessNote } from "@/components/ui/feedback";
import { getPortfolioUserName } from "@/lib/config";
import { ApiError, errorMessage } from "@/lib/errors";
import {
  formatBytes,
  formatPeriod,
  formatPlace,
  formatTimestamp,
  fullName,
  initials,
  isImageUrl,
  safeHttpUrl,
  splitList,
} from "@/lib/format";
import { validateEmail } from "@/lib/forms";
import { downloadBlob } from "@/lib/files";
import { loadPortfolio, publicResumeUrl, sendContactMessage } from "@/services/portfolio-api";
import type { Portfolio, SkillCategory } from "@/types/portfolio";

type NavItem = { id: string; label: string };

function categoriesWithContent(categories: SkillCategory[] | null | undefined) {
  return (categories ?? []).filter((category) => category.category?.trim() || (category.skills ?? []).some((skill) => skill.skill?.trim()));
}

function navigationFor(portfolio: Portfolio): NavItem[] {
  const items: NavItem[] = [{ id: "profile", label: "Profile" }];
  if (portfolio.admin.about?.trim()) items.push({ id: "about", label: "About" });
  if (categoriesWithContent(portfolio.skills?.categories).length) items.push({ id: "skills", label: "Skills" });
  if (portfolio.experience?.length) items.push({ id: "experience", label: "Experience" });
  if (portfolio.project?.length) items.push({ id: "projects", label: "Projects" });
  if (portfolio.education?.length) items.push({ id: "education", label: "Education" });
  if (portfolio.licenseAndCertification?.length) items.push({ id: "credentials", label: "Credentials" });
  if (portfolio.link?.length) items.push({ id: "links", label: "Links" });
  if (portfolio.activity?.length) items.push({ id: "activities", label: "Activities" });
  if (portfolio.resume) items.push({ id: "resume", label: "Resume" });
  if (portfolio.contact) items.push({ id: "contact", label: "Contact" });
  return items;
}

function Section({ id, kicker, title, children }: { id: string; kicker: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="portfolio-section" aria-labelledby={`${id}-title`}>
      <div className="section-heading">
        <p className="kicker">{kicker}</p>
        <h2 id={`${id}-title`}>{title}</h2>
      </div>
      {children}
    </section>
  );
}

function PortfolioSkeleton() {
  return (
    <div className="page" id="content" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading portfolio</span>
      <Skeleton className="hero-skeleton" />
      <Skeleton className="block-skeleton" />
      <Skeleton className="block-skeleton" />
    </div>
  );
}

function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const emailError = validateEmail(email.trim(), true);
    if (!name.trim()) return setError("Name is required.");
    if (emailError) return setError(emailError);
    if (!message.trim()) return setError("Message is required.");
    if (message.trim().length > 3000) return setError("Message must not exceed 3000 characters.");
    setPending(true);
    setError(null);
    setSuccess(null);
    try {
      const result = await sendContactMessage({ name: name.trim(), email: email.trim(), message: message.trim() });
      setSuccess(typeof result === "string" ? result : "Message sent successfully.");
      setName("");
      setEmail("");
      setMessage("");
    } catch (caught) {
      setError(errorMessage(caught, "The message could not be sent."));
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="contact-form clay stack" onSubmit={onSubmit} noValidate>
      <h3>Send a message</h3>
      <FormBanner message={error} />
      <SuccessNote message={success} />
      <TextField id="visitor-name" label="Name" value={name} onChange={setName} required autoComplete="name" />
      <TextField id="visitor-email" label="Email" type="email" value={email} onChange={setEmail} required autoComplete="email" />
      <TextArea id="visitor-message" label="Message" value={message} onChange={setMessage} required maxLength={3000} hint={`${message.length}/3000`} />
      <Button type="submit" disabled={pending}>
        {pending ? "Sending..." : "Send message"}
      </Button>
    </form>
  );
}

export function PublicPortfolio() {
  const userName = getPortfolioUserName();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(Boolean(userName));
  const [attempt, setAttempt] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("profile");

  useEffect(() => {
    if (!userName) return;
    const controller = new AbortController();
    let activeRequest = true;
    loadPortfolio(userName, controller.signal)
      .then((data) => {
        if (!activeRequest) return;
        setPortfolio(data);
        setError(null);
      })
      .catch((caught) => {
        if (!activeRequest || (caught instanceof DOMException && caught.name === "AbortError")) return;
        const message = caught instanceof ApiError && /not found/i.test(caught.message)
          ? "This portfolio is not available yet."
          : errorMessage(caught, "The portfolio could not be loaded.");
        setError(message);
        setPortfolio(null);
      })
      .finally(() => {
        if (activeRequest) setLoading(false);
      });
    return () => {
      activeRequest = false;
      controller.abort();
    };
  }, [userName, attempt]);

  const nav = useMemo(() => (portfolio ? navigationFor(portfolio) : []), [portfolio]);

  useEffect(() => {
    if (!nav.length) return;
    const nodes = nav.map((item) => document.getElementById(item.id)).filter((node): node is HTMLElement => Boolean(node));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0.15, 0.4] },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [nav]);

  if (!userName) {
    return (
      <main id="content" className="page">
        <section className="clay panel">
          <p className="kicker">manoj.dossier</p>
          <h1>Portfolio username is not configured</h1>
          <p className="auth-copy">
            Set NEXT_PUBLIC_PORTFOLIO_USERNAME in frontend/.env.local to the admin username, then restart the dev server.
          </p>
          <Link href="/login" className="btn btn-primary">
            Open the studio
          </Link>
        </section>
      </main>
    );
  }

  const admin = portfolio?.admin;
  const name = fullName(admin?.firstName, admin?.lastName);
  const location = formatPlace([
    admin?.adminAddressResponseDTO?.city,
    admin?.adminAddressResponseDTO?.state,
    admin?.adminAddressResponseDTO?.country,
  ]);
  const portrait = safeHttpUrl(admin?.profileImageUrl);
  const skills = categoriesWithContent(portfolio?.skills?.categories);

  return (
    <>
      <header className="site-header glass">
        <Brand />
        <button type="button" className="btn btn-ghost menu-toggle" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
          Sections
        </button>
        <div className={`nav-drawer ${menuOpen ? "is-open" : ""}`}>
          <nav className="section-nav" aria-label="Portfolio sections">
            {nav.map((item) => (
              <a key={item.id} href={`#${item.id}`} aria-current={active === item.id} onClick={() => setMenuOpen(false)}>
                {item.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="header-tools">
          <ThemeControls compact />
          <Link href="/login" className="btn btn-secondary">
            Manage
          </Link>
        </div>
      </header>

      {loading ? <PortfolioSkeleton /> : null}
      {!loading && error ? (
        <main id="content" className="page">
          <ErrorState message={error} onRetry={() => { setLoading(true); setAttempt((value) => value + 1); }} />
        </main>
      ) : null}

      {!loading && portfolio && admin ? (
        <main id="content" className="page">
          <section id="profile" className="hero">
            <div className="hero-copy clay">
              <p className="kicker">manoj.dossier</p>
              <h1>{name || "Portfolio"}</h1>
              {admin.headLine?.trim() ? <p className="headline">{admin.headLine}</p> : null}
              {admin.currentPosition?.trim() ? <p className="position">{admin.currentPosition}</p> : null}
              {admin.myQuote?.trim() ? (
                <blockquote className="quote">
                  <p>{admin.myQuote}</p>
                </blockquote>
              ) : null}
              {admin.pronoun?.trim() || location ? (
                <p className="meta">{[admin.pronoun, location].filter(Boolean).join(" · ")}</p>
              ) : null}
              <div className="hero-actions">
                {portfolio.resume ? (
                  <a className="btn btn-primary" href="#resume">
                    Resume
                  </a>
                ) : null}
                {portfolio.contact ? (
                  <a className="btn btn-secondary" href="#contact">
                    Contact
                  </a>
                ) : null}
              </div>
            </div>
            <div className="portrait-frame clay">
              {portrait ? (
                // User-provided profile URLs are not known at build time.
                <img className="portrait" src={portrait} alt={name ? `${name} profile photo` : "Profile photo"} />
              ) : (
                <div className="monogram" aria-hidden="true">
                  {initials(admin.firstName, admin.lastName)}
                </div>
              )}
            </div>
          </section>

          {admin.about?.trim() ? (
            <Section id="about" kicker="01" title="About">
              <div className="about-copy clay">{admin.about}</div>
            </Section>
          ) : null}

          {skills.length ? (
            <Section id="skills" kicker="02" title="Skills">
              <div className="skill-grid">
                {skills.map((category) => (
                  <article key={category.id} className="panel clay">
                    {category.category?.trim() ? <h3>{category.category}</h3> : null}
                    <ul className="pills">
                      {(category.skills ?? [])
                        .filter((skill) => skill.skill?.trim())
                        .map((skill) => (
                          <li key={skill.id}>{skill.skill}</li>
                        ))}
                    </ul>
                  </article>
                ))}
              </div>
            </Section>
          ) : null}

          {portfolio.experience?.length ? (
            <Section id="experience" kicker="03" title="Experience">
              <div className="timeline">
                {portfolio.experience.map((item) => {
                  const logo = safeHttpUrl(item.companyLogoUrl);
                  return (
                    <article key={item.id} className="clay">
                      <div className="logo-row">
                        {logo ? <img src={logo} alt="" /> : null}
                        <div>
                          <h3>{item.title}</h3>
                          <p className="subhead">
                            {[item.company, item.employmentType, item.locationType].filter(Boolean).join(" · ")}
                          </p>
                          <p className="muted">
                            {formatPeriod(item.startMonth, item.startYear, item.endMonth, item.endYear, Boolean(item.currentlyWorking))}
                            {item.location ? ` · ${item.location}` : ""}
                          </p>
                        </div>
                      </div>
                      {item.description?.trim() ? <p className="prose">{item.description}</p> : null}
                    </article>
                  );
                })}
              </div>
            </Section>
          ) : null}

          {portfolio.project?.length ? (
            <Section id="projects" kicker="04" title="Projects">
              <div className="project-grid">
                {portfolio.project.map((item) => (
                  <article key={item.id} className="panel clay">
                    <h3>{item.title}</h3>
                    <p className="muted">{formatPeriod(item.startMonth, item.startYear, item.endMonth, item.endYear)}</p>
                    {item.projectDescription?.trim() ? <p className="prose">{item.projectDescription}</p> : null}
                    {item.rolesAndResponsibilities?.trim() ? (
                      <p className="prose">{item.rolesAndResponsibilities}</p>
                    ) : null}
                    {splitList(item.techStack).length ? (
                      <ul className="pills">
                        {splitList(item.techStack).map((tech) => (
                          <li key={tech}>{tech}</li>
                        ))}
                      </ul>
                    ) : null}
                  </article>
                ))}
              </div>
            </Section>
          ) : null}

          {portfolio.education?.length ? (
            <Section id="education" kicker="05" title="Education">
              <div className="card-grid">
                {portfolio.education.map((item) => {
                  const logo = safeHttpUrl(item.schoolLogoUrl);
                  return (
                    <article key={item.id} className="panel clay">
                      <div className="logo-row">
                        {logo ? <img src={logo} alt="" /> : null}
                        <div>
                          <h3>{item.degree || item.school}</h3>
                          <p className="subhead">{[item.school, item.university, item.fieldOfStudy].filter(Boolean).join(" · ")}</p>
                        </div>
                      </div>
                      <p className="muted">{formatPeriod(item.startMonth, item.startYear, item.endMonth, item.endYear)}</p>
                      {item.grade?.trim() ? <p>Grade: {item.grade}</p> : null}
                      {item.description?.trim() ? <p className="prose">{item.description}</p> : null}
                      {splitList(item.skills).length ? (
                        <ul className="pills">
                          {splitList(item.skills).map((skill) => (
                            <li key={skill}>{skill}</li>
                          ))}
                        </ul>
                      ) : null}
                      {item.activities?.trim() ? <p className="prose">{item.activities}</p> : null}
                    </article>
                  );
                })}
              </div>
            </Section>
          ) : null}

          {portfolio.licenseAndCertification?.length ? (
            <Section id="credentials" kicker="06" title="Licenses and certifications">
              <div className="card-grid">
                {portfolio.licenseAndCertification.map((item) => {
                  const logo = safeHttpUrl(item.orgLogoUrl);
                  const page = safeHttpUrl(item.landcUrl);
                  const credential = safeHttpUrl(item.credentialUrl);
                  return (
                    <article key={item.id} className="panel clay">
                      <div className="logo-row">
                        {logo ? <img src={logo} alt="" /> : null}
                        <div>
                          <h3>{item.name}</h3>
                          <p className="subhead">{item.issuingOrganisation}</p>
                        </div>
                      </div>
                      <p className="muted">{formatPeriod(item.startMonth, item.startYear, item.endMonth, item.endYear)}</p>
                      {item.credentialId ? <p>Credential ID: {item.credentialId}</p> : null}
                      <div className="row">
                        {page ? (
                          <a href={page} target="_blank" rel="noreferrer">
                            Certificate page
                          </a>
                        ) : null}
                        {credential ? (
                          <a href={credential} target="_blank" rel="noreferrer">
                            Verify credential
                          </a>
                        ) : null}
                      </div>
                    </article>
                  );
                })}
              </div>
            </Section>
          ) : null}

          {portfolio.link?.length ? (
            <Section id="links" kicker="07" title="Links">
              <div className="link-row">
                {portfolio.link.map((item) => {
                  const href = safeHttpUrl(item.url);
                  const content = (
                    <>
                      <span className="link-mark" aria-hidden="true">
                        {(item.platform || "L").slice(0, 1).toUpperCase()}
                      </span>
                      <span>
                        <strong>{item.platform || "Link"}</strong>
                        <span className="muted" style={{ display: "block" }}>
                          {href ? new URL(href).host : "Unavailable"}
                        </span>
                      </span>
                    </>
                  );
                  return href ? (
                    <a key={item.id} className="link-card clay" href={href} target="_blank" rel="noreferrer">
                      {content}
                    </a>
                  ) : (
                    <article key={item.id} className="link-card clay">
                      {content}
                    </article>
                  );
                })}
              </div>
            </Section>
          ) : null}

          {portfolio.activity?.length ? (
            <Section id="activities" kicker="08" title="Activities">
              <div className="card-grid">
                {portfolio.activity.map((item) => {
                  const media = safeHttpUrl(item.activityMediaUrl);
                  return (
                    <article key={item.id} className="panel clay">
                      {item.activityDescription?.trim() ? <p className="prose">{item.activityDescription}</p> : null}
                      {media && isImageUrl(media) ? (
                        <img className="media-frame" src={media} alt="" />
                      ) : null}
                      {media && !isImageUrl(media) ? (
                        <p>
                          <a href={media} target="_blank" rel="noreferrer">
                            View activity media
                          </a>
                        </p>
                      ) : null}
                    </article>
                  );
                })}
              </div>
            </Section>
          ) : null}

          {portfolio.resume ? (
            <Section id="resume" kicker="09" title="Resume">
              <article className="panel clay spread">
                <div>
                  <h3>{portfolio.resume.fileName || "Resume"}</h3>
                  <p className="muted">
                    {[formatBytes(portfolio.resume.fileSize), formatTimestamp(portfolio.resume.uploadedAt)].filter(Boolean).join(" · ")}
                  </p>
                </div>
                <div className="row">
                  <a className="btn btn-primary" href={publicResumeUrl(userName)} target="_blank" rel="noreferrer">
                    View
                  </a>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      void fetch(publicResumeUrl(userName))
                        .then((response) => {
                          if (!response.ok) throw new Error("unavailable");
                          return response.blob();
                        })
                        .then((blob) => downloadBlob(blob, portfolio.resume?.fileName || "resume.pdf"))
                        .catch(() => {
                          window.open(publicResumeUrl(userName), "_blank", "noopener,noreferrer");
                        });
                    }}
                  >
                    Download
                  </Button>
                </div>
              </article>
            </Section>
          ) : null}

          {portfolio.contact ? (
            <Section id="contact" kicker="10" title="Contact">
              <div className="contact-layout">
                <article className="contact-card clay">
                  <h3>Reach me</h3>
                  {portfolio.contact.email ? (
                    <p>
                      Email
                      <a href={`mailto:${portfolio.contact.email}`}>{portfolio.contact.email}</a>
                    </p>
                  ) : null}
                  {portfolio.contact.phone ? (
                    <p>
                      Phone
                      <a href={`tel:${portfolio.contact.phone}`}>{portfolio.contact.phone}</a>
                    </p>
                  ) : null}
                  {location ? <p className="muted">{location}</p> : null}
                </article>
                <ContactForm />
              </div>
            </Section>
          ) : null}
        </main>
      ) : null}

      <footer className="site-footer glass">
        <span>manoj.dossier</span>
        <Link href="/login">Admin studio</Link>
      </footer>
    </>
  );
}
