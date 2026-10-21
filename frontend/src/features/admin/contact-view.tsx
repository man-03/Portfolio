"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { Button, TextField } from "@/components/ui/controls";
import { ConfirmDialog } from "@/components/ui/dialog";
import { ErrorState, FormBanner, LoadingBlock } from "@/components/ui/feedback";
import { useSession } from "@/hooks/use-session";
import { useToast } from "@/hooks/use-toast";
import { errorMessage, isNotFoundError, readMessage } from "@/lib/errors";
import { textValue, validateEmail, validatePhone } from "@/lib/forms";
import { formatPlace } from "@/lib/format";
import { adminApi } from "@/services/admin-api";

export function ContactView() {
  const session = useSession();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [contactId, setContactId] = useState<number | null>(null);
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!session) return;
    let active = true;
    Promise.allSettled([adminApi.getContact(session.userName), adminApi.getProfile(session.userName)]).then((results) => {
      if (!active) return;
      const [contactResult, profileResult] = results;
      if (profileResult.status === "fulfilled") {
        const address = profileResult.value.adminAddressResponseDTO;
        setLocation(formatPlace([address?.address, address?.city, address?.state, address?.zip, address?.country]));
      }
      if (contactResult.status === "fulfilled") {
        setEmail(contactResult.value.email ?? "");
        setPhone(contactResult.value.phone ?? "");
        setContactId(contactResult.value.id);
        setStatus("ready");
        return;
      }
      if (isNotFoundError(contactResult.reason) && /contact not found/i.test(contactResult.reason.message)) {
        setEmail("");
        setPhone("");
        setContactId(null);
        setStatus("ready");
        return;
      }
      setStatus("error");
      setError(errorMessage(contactResult.reason, "Contact details could not be loaded."));
    });
    return () => {
      active = false;
    };
  }, [session, reloadKey]);

  if (!session) return null;

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!session) return;
    const emailError = validateEmail(textValue({ email }, "email"), true);
    const phoneError = validatePhone(textValue({ phone }, "phone"));
    if (emailError || phoneError) {
      setFormError(emailError ?? phoneError);
      return;
    }
    setPending(true);
    setFormError(null);
    try {
      const body = { email: email.trim(), phone: phone.trim() || null };
      const result = contactId === null
        ? await adminApi.createContact(session.userName, body)
        : await adminApi.updateContact(session.userName, contactId, body);
      toast.success(readMessage(result, "Contact saved."));
      setReloadKey((value) => value + 1);
    } catch (caught) {
      setFormError(errorMessage(caught, "Contact details could not be saved."));
    } finally {
      setPending(false);
    }
  }

  async function removeContact() {
    if (!session || contactId === null) return;
    setPending(true);
    try {
      const result = await adminApi.deleteContact(session.userName, contactId);
      setContactId(null);
      setEmail("");
      setPhone("");
      setConfirmDelete(false);
      toast.success(readMessage(result, "Contact deleted."));
    } catch (caught) {
      toast.error(errorMessage(caught, "Contact details could not be deleted."));
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="stack">
      <header className="page-intro">
        <h1>Contact</h1>
        <p>Email and phone are shown publicly. The street address is edited with the profile.</p>
      </header>
      {location ? (
        <article className="callout clay">
          <h2>Location on file</h2>
          <p>{location}</p>
          <Link href="/admin/profile">Edit address in profile</Link>
        </article>
      ) : null}
      {status === "loading" ? <LoadingBlock label="Loading contact" /> : null}
      {status === "error" ? <ErrorState message={error ?? "Contact details could not be loaded."} onRetry={() => { setStatus("loading"); setReloadKey((value) => value + 1); }} /> : null}
      {status === "ready" ? (
        <form className="editor clay stack" onSubmit={onSubmit} noValidate>
          <FormBanner message={formError} />
          <div className="form-grid">
            <TextField id="contact-email" label="Email" type="email" value={email} onChange={setEmail} required autoComplete="email" />
            <TextField id="contact-phone" label="Phone" type="text" value={phone} onChange={setPhone} autoComplete="tel" />
          </div>
          <div className="row">
            <Button type="submit" disabled={pending}>
              {pending ? "Saving..." : contactId === null ? "Create contact" : "Save contact"}
            </Button>
            {contactId !== null ? (
              <Button variant="danger" onClick={() => setConfirmDelete(true)} disabled={pending}>
                Delete
              </Button>
            ) : null}
          </div>
        </form>
      ) : null}
      <ConfirmDialog
        open={confirmDelete}
        title="Delete contact details?"
        description="The public portfolio cannot load without a contact record."
        confirmLabel="Delete contact"
        pending={pending}
        onConfirm={() => void removeContact()}
        onClose={() => {
          if (!pending) setConfirmDelete(false);
        }}
      />
    </section>
  );
}
