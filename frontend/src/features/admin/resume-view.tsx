"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { Button } from "@/components/ui/controls";
import { ConfirmDialog } from "@/components/ui/dialog";
import { EmptyState, ErrorState, FormBanner, LoadingBlock } from "@/components/ui/feedback";
import { useSession } from "@/hooks/use-session";
import { useToast } from "@/hooks/use-toast";
import { errorMessage, isNotFoundError, readMessage } from "@/lib/errors";
import { downloadBlob, openBlob } from "@/lib/files";
import { formatBytes, formatTimestamp } from "@/lib/format";
import { adminApi } from "@/services/admin-api";
import type { ResumeMeta } from "@/types/portfolio";

export function ResumeView() {
  const session = useSession();
  const toast = useToast();
  const [resume, setResume] = useState<ResumeMeta | null>(null);
  const [missing, setMissing] = useState(false);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!session) return;
    let active = true;
    adminApi
      .getResume(session.userName)
      .then((next) => {
        if (!active) return;
        setResume(next);
        setMissing(false);
        setStatus("ready");
      })
      .catch((caught) => {
        if (!active) return;
        if (isNotFoundError(caught)) {
          setResume(null);
          setMissing(true);
          setStatus("ready");
          return;
        }
        setStatus("error");
        setError(errorMessage(caught, "The resume could not be loaded."));
      });
    return () => {
      active = false;
    };
  }, [session, reloadKey]);

  if (!session) return null;

  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !session) return;
    if (file.type !== "application/pdf") {
      setFormError("Only PDF files are allowed.");
      return;
    }
    setPending(true);
    setFormError(null);
    try {
      const saved = resume
        ? await adminApi.replaceResume(session.userName, resume.id, file)
        : await adminApi.uploadResume(session.userName, file);
      setResume(saved);
      setMissing(false);
      toast.success(resume ? "Resume replaced." : "Resume uploaded.");
    } catch (caught) {
      setFormError(errorMessage(caught, "The resume could not be uploaded."));
    } finally {
      setPending(false);
    }
  }

  async function view() {
    if (!resume || !session) return;
    setPending(true);
    try {
      const file = await adminApi.viewResume(session.userName, resume.id);
      openBlob(file.blob);
    } catch (caught) {
      toast.error(errorMessage(caught, "The resume could not be opened."));
    } finally {
      setPending(false);
    }
  }

  async function download() {
    if (!resume || !session) return;
    setPending(true);
    try {
      const file = await adminApi.viewResume(session.userName, resume.id);
      downloadBlob(file.blob, file.fileName || resume.fileName || "resume.pdf");
    } catch (caught) {
      toast.error(errorMessage(caught, "The resume could not be downloaded."));
    } finally {
      setPending(false);
    }
  }

  async function remove() {
    if (!resume || !session) return;
    setPending(true);
    try {
      const result = await adminApi.deleteResume(session.userName, resume.id);
      setResume(null);
      setMissing(true);
      setConfirmDelete(false);
      toast.success(readMessage(result, "Resume deleted."));
    } catch (caught) {
      toast.error(errorMessage(caught, "The resume could not be deleted."));
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="stack">
      <header className="page-intro">
        <h1>Resume</h1>
        <p>Upload one PDF. Visitors can view or download it when a file is on record.</p>
      </header>
      {status === "loading" ? <LoadingBlock label="Loading resume" /> : null}
      {status === "error" ? <ErrorState message={error ?? "The resume could not be loaded."} onRetry={() => { setStatus("loading"); setReloadKey((value) => value + 1); }} /> : null}
      {status === "ready" && missing ? <EmptyState title="No resume uploaded" description="Choose a PDF to publish it on the portfolio." /> : null}
      {status === "ready" && resume ? (
        <article className="panel clay spread">
          <div>
            <h2>{resume.fileName || "Resume"}</h2>
            <p className="muted">{[formatBytes(resume.fileSize), formatTimestamp(resume.uploadedAt)].filter(Boolean).join(" · ")}</p>
          </div>
          <div className="row">
            <Button onClick={() => void view()} disabled={pending}>View</Button>
            <Button variant="secondary" onClick={() => void download()} disabled={pending}>Download</Button>
            <Button variant="danger" onClick={() => setConfirmDelete(true)} disabled={pending}>Delete</Button>
          </div>
        </article>
      ) : null}
      {status === "ready" ? (
        <form className="editor clay stack">
          <FormBanner message={formError} />
          <label className="field" htmlFor="resume-file">
            <span>{resume ? "Replace PDF" : "Upload PDF"}</span>
            <input id="resume-file" type="file" accept="application/pdf" onChange={(event) => void upload(event)} disabled={pending} />
          </label>
        </form>
      ) : null}
      <ConfirmDialog
        open={confirmDelete}
        title="Delete this resume?"
        description="The public resume link will no longer have a file to show."
        confirmLabel="Delete resume"
        pending={pending}
        onConfirm={() => void remove()}
        onClose={() => {
          if (!pending) setConfirmDelete(false);
        }}
      />
    </section>
  );
}
