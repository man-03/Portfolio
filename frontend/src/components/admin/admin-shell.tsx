"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ChangeEvent, type DragEvent, type ReactNode } from "react";
import { SiteFooter } from "@/components/site-footer";
import { ThemeModeSwitch } from "@/components/theme-mode-switch";
import { ConfirmDialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/controls";
import { FormBanner } from "@/components/ui/feedback";
import { Wordmark } from "@/components/wordmark";
import { PasswordView } from "@/features/admin/password-view";
import {
  SECTION_LABELS,
  toggleSection,
  useSectionLayout,
  type SectionId,
} from "@/features/admin/section-layout";
import { useSectionDrag } from "@/features/admin/use-section-drag";
import { useAdminAppearance } from "@/hooks/use-theme";
import { useToast } from "@/hooks/use-toast";
import {
  flushPortfolioSettings,
  resetPortfolioSettings,
} from "@/features/admin/portfolio-settings";
import { downloadBlob, openBlob } from "@/lib/files";
import { errorMessage, isNotFoundError } from "@/lib/errors";
import { fullName, safeHttpUrl } from "@/lib/format";
import { clearSession } from "@/lib/session";
import { adminApi } from "@/services/admin-api";
import type { AdminProfile, ResumeMeta } from "@/types/portfolio";

function GripIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="5" cy="3" r="1.2" fill="currentColor" />
      <circle cx="11" cy="3" r="1.2" fill="currentColor" />
      <circle cx="5" cy="8" r="1.2" fill="currentColor" />
      <circle cx="11" cy="8" r="1.2" fill="currentColor" />
      <circle cx="5" cy="13" r="1.2" fill="currentColor" />
      <circle cx="11" cy="13" r="1.2" fill="currentColor" />
    </svg>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
        <path d="M6 6l12 12M18 6 6 18" />
      </svg>
    );
  }
  // Staggered hamburger: bar+dot / full bar / dot+bar
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="3" y="5.25" width="14" height="2.5" rx="1.25" />
      <circle cx="20" cy="6.5" r="1.35" />
      <rect x="3" y="10.75" width="18" height="2.5" rx="1.25" />
      <circle cx="4" cy="17.5" r="1.35" />
      <rect x="7" y="16.25" width="14" height="2.5" rx="1.25" />
    </svg>
  );
}

function Avatar({ profile, name }: { profile: AdminProfile | null; name: string }) {
  const [failed, setFailed] = useState(false);
  const src = safeHttpUrl(profile?.profileImageUrl);
  if (src && !failed) {
    return <img className="avatar" src={src} alt="" onError={() => setFailed(true)} />;
  }
  const letters = name.replace(/\s+/g, "").slice(0, 2).toUpperCase();
  return <span className="avatar-fallback">{letters || "?"}</span>;
}

function UploadIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 16V5" />
      <path d="M8 9l4-4 4 4" />
      <path d="M5 19h14" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 4v11" />
      <path d="M7 11l5 5 5-5" />
      <path d="M5 20h14" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 7h16" />
      <path d="M9 7V5h6v2" />
      <path d="M7 7l1 13h8l1-13" />
    </svg>
  );
}

function ResumeControl({ userName }: { userName: string }) {
  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [resume, setResume] = useState<ResumeMeta | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    let active = true;
    adminApi
      .getResume(userName)
      .then((next) => {
        if (active) setResume(next);
      })
      .catch((caught) => {
        if (!active) return;
        if (isNotFoundError(caught)) {
          setResume(null);
          return;
        }
        setError(errorMessage(caught, "The current resume could not be checked."));
      });
    return () => {
      active = false;
    };
  }, [userName]);

  async function saveFile(file: File) {
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setError("Only PDF files are allowed.");
      setMessage(null);
      return;
    }
    setPending(true);
    setError(null);
    setMessage(resume ? "Replacing resume..." : "Uploading resume...");
    try {
      const saved = resume
        ? await adminApi.replaceResume(userName, resume.id, file)
        : await adminApi.uploadResume(userName, file);
      setResume(saved);
      const success = resume ? "Resume replaced." : "Resume uploaded.";
      setMessage(success);
      toast.success(success);
    } catch (caught) {
      setMessage(null);
      setError(errorMessage(caught, "The resume could not be uploaded."));
    } finally {
      setPending(false);
    }
  }

  function onFileInput(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (file) void saveFile(file);
  }

  function onDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) void saveFile(file);
  }

  async function viewResume() {
    if (!resume) return;
    setPending(true);
    setError(null);
    try {
      const file = await adminApi.viewResume(userName, resume.id);
      openBlob(file.blob);
    } catch (caught) {
      setError(errorMessage(caught, "The resume could not be opened."));
    } finally {
      setPending(false);
    }
  }

  async function downloadResume() {
    if (!resume) return;
    setPending(true);
    setError(null);
    try {
      const file = await adminApi.viewResume(userName, resume.id);
      downloadBlob(file.blob, file.fileName || resume.fileName || "resume.pdf");
    } catch (caught) {
      setError(errorMessage(caught, "The resume could not be downloaded."));
    } finally {
      setPending(false);
    }
  }

  async function deleteResume() {
    if (!resume) return;
    setPending(true);
    try {
      await adminApi.deleteResume(userName, resume.id);
      setResume(null);
      setConfirmDelete(false);
      setMessage("Resume deleted.");
      toast.success("Resume deleted.");
    } catch (caught) {
      setError(errorMessage(caught, "The resume could not be deleted."));
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="sidebar-block">
      <h3>Resume</h3>
      <input
        ref={inputRef}
        id="sidebar-resume"
        className="sr-only"
        type="file"
        accept="application/pdf"
        onChange={onFileInput}
        disabled={pending}
      />
      <label
        htmlFor="sidebar-resume"
        className={`resume-dropzone ${dragging ? "is-dragging" : ""} ${pending ? "is-pending" : ""}`}
        onDragEnter={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        <span className="resume-dropzone-icon">
          <UploadIcon />
        </span>
        <span>{pending ? "Working…" : "Drag & drop / Browse file"}</span>
      </label>

      {resume ? (
        <div className="resume-file-card">
          <button
            type="button"
            className="resume-file-name"
            title="View resume"
            onClick={() => void viewResume()}
            disabled={pending}
          >
            {resume.fileName || "Resume.pdf"}
          </button>
          <div className="resume-file-actions">
            <button type="button" className="resume-action resume-action-download" aria-label="Download resume" title="Download" onClick={() => void downloadResume()} disabled={pending}>
              <DownloadIcon />
            </button>
            <button type="button" className="resume-action resume-action-delete" aria-label="Delete resume" title="Delete" onClick={() => setConfirmDelete(true)} disabled={pending}>
              <TrashIcon />
            </button>
          </div>
        </div>
      ) : null}

      {message ? <p className="success-note">{message}</p> : null}
      <FormBanner message={error} />
      <ConfirmDialog
        open={confirmDelete}
        title="Delete this resume?"
        description="The public resume link will no longer have a file to show."
        confirmLabel="Delete resume"
        pending={pending}
        onConfirm={() => void deleteResume()}
        onClose={() => setConfirmDelete(false)}
      />
    </div>
  );
}

export function AdminShell({ userName, children }: { userName: string; children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const toast = useToast();
  const { theme, accent, setTheme, setAccent, palettes, error: settingsError, warning } = useAdminAppearance();
  const layout = useSectionLayout();
  const drag = useSectionDrag();
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [menuOpen, setMenuOpen] = useState(true);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);
  const name = fullName(profile?.firstName, profile?.lastName) || userName;
  const showFooter =
    pathname.startsWith("/admin/profile") || pathname.startsWith("/admin/global");

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 900px)");
    const sync = () => setMenuOpen(!mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const node = sidebarRef.current;
    if (!node) return;
    node.scrollTop = 0;
  }, [menuOpen]);

  useEffect(() => {
    let active = true;
    adminApi
      .getProfile(userName)
      .then((next) => {
        if (active) setProfile(next);
      })
      .catch(() => {
        if (active) setProfile(null);
      });
    return () => {
      active = false;
    };
  }, [userName]);

  useEffect(() => {
    const onHide = () => {
      void flushPortfolioSettings();
    };
    const onVisibility = () => {
      if (document.visibilityState === "hidden") onHide();
    };
    window.addEventListener("pagehide", onHide);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("pagehide", onHide);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  async function logout() {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await flushPortfolioSettings();
    } finally {
      clearSession();
      resetPortfolioSettings();
      toast.success("Signed out.");
      router.replace("/login");
    }
  }

  return (
    <div className={`studio ${menuOpen ? "is-sidebar-open" : ""}`}>
      {menuOpen ? <button type="button" className="sidebar-backdrop" aria-label="Close menu" onClick={() => setMenuOpen(false)} /> : null}
      <aside
        ref={sidebarRef}
        id="studio-sidebar"
        className={`studio-sidebar ${menuOpen ? "is-open" : ""}`}
        aria-hidden={!menuOpen}
      >
        <div className="identity">
          <Avatar profile={profile} name={name} />
          <div>
            <h2>{name}</h2>
            <p>{userName}</p>
          </div>
        </div>

        <ResumeControl userName={userName} />

        <div className="sidebar-block">
          <h3>Theme</h3>
          <ThemeModeSwitch theme={theme} onChange={setTheme} label="Studio color theme" />
        </div>

        <div className="sidebar-block">
          <h3>Accent</h3>
          <div className="palette-list" role="radiogroup" aria-label="Accent colour">
            {palettes.map((palette) => (
              <button
                key={palette.id}
                type="button"
                role="radio"
                aria-checked={accent === palette.id}
                className={`palette-option ${accent === palette.id ? "is-selected" : ""}`}
                onClick={() => setAccent(palette.id)}
              >
                <span className="palette-chips" aria-hidden="true">
                  {palette.chips.map((chip) => (
                    <i key={chip} style={{ background: chip }} />
                  ))}
                </span>
                <span>{palette.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="sidebar-block">
          <h3>Sections</h3>
          {warning ? <p className="sidebar-note">{warning}</p> : null}
          {settingsError ? <FormBanner message={settingsError} /> : null}
          <div className="stack section-toggle-list">
            {layout.order.map((id) => {
              const hidden = layout.hidden.includes(id);
              return (
                <div
                  key={id}
                  className={`section-row ${drag.dragId === id ? "is-dragging" : ""} ${drag.overId === id && drag.dragId !== id ? "is-over" : ""}`}
                  data-drop-scope="sidebar"
                  data-section-id={id}
                >
                  <button
                    type="button"
                    className="drag-handle"
                    aria-label={`Reorder ${SECTION_LABELS[id]}. Use the arrow keys to move it.`}
                    onPointerDown={(event) => drag.onHandlePointerDown(event, id)}
                    onKeyDown={(event) => drag.onHandleKeyDown(event, id)}
                  >
                    <GripIcon />
                  </button>
                  <span className="section-label">{SECTION_LABELS[id]}</span>
                  <button
                    type="button"
                    className="section-toggle"
                    role="switch"
                    aria-checked={!hidden}
                    aria-label={`${SECTION_LABELS[id]} visibility`}
                    onClick={() => toggleSection(id)}
                  >
                    <span className="section-toggle-thumb" aria-hidden="true" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="sidebar-block sidebar-account">
          <Button variant="secondary" onClick={() => setPasswordOpen(true)}>
            Change password
          </Button>
          <Button variant="ghost" onClick={() => void logout()} disabled={loggingOut}>
            {loggingOut ? "Signing out…" : "Log out"}
          </Button>
        </div>
      </aside>

      <div className="studio-main">
        <header className="studio-top">
          <div className="studio-top-start">
            <button
              type="button"
              className="studio-menu"
              aria-expanded={menuOpen}
              aria-controls="studio-sidebar"
              aria-label={menuOpen ? "Close side menu" : "Open side menu"}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <MenuIcon open={menuOpen} />
            </button>
            <Wordmark />
          </div>
          <nav aria-label="Studio" className="studio-nav">
            <Link className="nav-link" href="/admin" aria-current={pathname === "/admin" ? "page" : undefined}>
              Dashboard
            </Link>
            <Link
              className="nav-link"
              href="/admin/profile"
              aria-current={pathname.startsWith("/admin/profile") ? "page" : undefined}
            >
              My Profile
            </Link>
            <Link
              className="nav-link"
              href="/admin/global"
              aria-current={pathname.startsWith("/admin/global") ? "page" : undefined}
            >
              Global View
            </Link>
          </nav>
          <div className="studio-top-end" aria-hidden="true" />
        </header>
        <div id="content" className="studio-content">
          {children}
        </div>
        {showFooter ? <SiteFooter className="studio-footer" /> : null}
      </div>

      {passwordOpen ? (
        <div className="dialog-backdrop" onMouseDown={() => setPasswordOpen(false)}>
          <div
            className="dialog clay"
            role="dialog"
            aria-modal="true"
            aria-labelledby="password-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <PasswordView />
            <div className="dialog-actions">
              <Button variant="secondary" onClick={() => setPasswordOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export type { SectionId };
