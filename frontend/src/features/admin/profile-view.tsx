"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Button, TextArea, TextField } from "@/components/ui/controls";
import { ConfirmDialog } from "@/components/ui/dialog";
import { ErrorState, FormBanner, LoadingBlock } from "@/components/ui/feedback";
import { useSession } from "@/hooks/use-session";
import { useToast } from "@/hooks/use-toast";
import { errorMessage, isNotFoundError, readMessage } from "@/lib/errors";
import { textValue, validateUrl, type FormValues } from "@/lib/forms";
import { adminApi } from "@/services/admin-api";
import type { AdminProfileRequest } from "@/types/portfolio";

const EMPTY: FormValues = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  pronoun: "",
  currentPosition: "",
  headLine: "",
  myQuote: "",
  about: "",
  profileImageUrl: "",
  address: "",
  country: "",
  state: "",
  city: "",
  zip: "",
};

function profileToForm(profile: {
  firstName: string | null;
  lastName: string | null;
  dateOfBirth: string | null;
  pronoun: string | null;
  currentPosition: string | null;
  headLine: string | null;
  myQuote: string | null;
  about: string | null;
  profileImageUrl: string | null;
  adminAddressResponseDTO: {
    address: string | null;
    country: string | null;
    state: string | null;
    city: string | null;
    zip: string | null;
  } | null;
}): FormValues {
  const address = profile.adminAddressResponseDTO;
  return {
    firstName: profile.firstName ?? "",
    lastName: profile.lastName ?? "",
    dateOfBirth: profile.dateOfBirth ?? "",
    pronoun: profile.pronoun ?? "",
    currentPosition: profile.currentPosition ?? "",
    headLine: profile.headLine ?? "",
    myQuote: profile.myQuote ?? "",
    about: profile.about ?? "",
    profileImageUrl: profile.profileImageUrl ?? "",
    address: address?.address ?? "",
    country: address?.country ?? "",
    state: address?.state ?? "",
    city: address?.city ?? "",
    zip: address?.zip ?? "",
  };
}

function toRequest(values: FormValues): AdminProfileRequest {
  return {
    firstName: textValue(values, "firstName"),
    lastName: textValue(values, "lastName"),
    dateOfBirth: textValue(values, "dateOfBirth"),
    pronoun: textValue(values, "pronoun"),
    currentPosition: textValue(values, "currentPosition"),
    headLine: textValue(values, "headLine"),
    myQuote: textValue(values, "myQuote"),
    about: textValue(values, "about"),
    profileImageUrl: textValue(values, "profileImageUrl"),
    adminAddressRequestDTO: {
      address: textValue(values, "address"),
      country: textValue(values, "country"),
      state: textValue(values, "state"),
      city: textValue(values, "city"),
      zip: textValue(values, "zip"),
    },
  };
}

export function ProfileView() {
  const session = useSession();
  const toast = useToast();
  const [values, setValues] = useState<FormValues>(EMPTY);
  const [mode, setMode] = useState<"create" | "update">("update");
  const [status, setStatus] = useState<"loading" | "ready" | "error" | "blocked">("loading");
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!session) return;
    let active = true;
    adminApi
      .getProfile(session.userName)
      .then((profile) => {
        if (!active) return;
        setValues(profileToForm(profile));
        setMode("update");
        setStatus("ready");
      })
      .catch((caught) => {
        if (!active) return;
        if (isNotFoundError(caught) && /admin not found/i.test(caught.message)) {
          setValues(EMPTY);
          setMode("create");
          setStatus("ready");
          return;
        }
        if (isNotFoundError(caught) && /address not found/i.test(caught.message)) {
          setStatus("blocked");
          setError("The profile exists, but its address record is missing. The API cannot load or repair that profile from this screen.");
          return;
        }
        setStatus("error");
        setError(errorMessage(caught, "The profile could not be loaded."));
      });
    return () => {
      active = false;
    };
  }, [session, reloadKey]);

  if (!session) return null;

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!session) return;
    if (!textValue(values, "firstName") || !textValue(values, "lastName")) {
      setFormError("First name and last name are required.");
      return;
    }
    const imageError = validateUrl(textValue(values, "profileImageUrl"), "Profile image URL");
    if (imageError) {
      setFormError(imageError);
      return;
    }
    setPending(true);
    setFormError(null);
    try {
      const result = mode === "create"
        ? await adminApi.createProfile(session.userName, toRequest(values))
        : await adminApi.updateProfile(session.userName, toRequest(values));
      setMode("update");
      toast.success(readMessage(result, "Profile saved."));
      setReloadKey((value) => value + 1);
    } catch (caught) {
      setFormError(errorMessage(caught, "The profile could not be saved."));
    } finally {
      setPending(false);
    }
  }

  async function removeProfile() {
    if (!session) return;
    setPending(true);
    try {
      const result = await adminApi.deleteProfile(session.userName);
      setValues(EMPTY);
      setMode("create");
      setConfirmDelete(false);
      toast.success(readMessage(result, "Profile deleted."));
    } catch (caught) {
      toast.error(errorMessage(caught, "The profile could not be deleted."));
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="stack">
      <header className="page-intro">
        <h1>Profile</h1>
        <p>Introduction, portrait, and location. The street address is saved with the profile and is not printed in full on the public page.</p>
      </header>
      {status === "loading" ? <LoadingBlock label="Loading profile" /> : null}
      {status === "error" ? <ErrorState message={error ?? "The profile could not be loaded."} onRetry={() => { setStatus("loading"); setReloadKey((value) => value + 1); }} /> : null}
      {status === "blocked" ? <ErrorState message={error ?? "The profile could not be loaded."} /> : null}
      {status === "ready" ? (
        <form className="editor clay stack" onSubmit={onSubmit} noValidate>
          <FormBanner message={formError} />
          <div className="form-grid">
            <TextField id="firstName" label="First name" value={String(values.firstName)} onChange={(value) => setValues({ ...values, firstName: value })} required autoComplete="given-name" />
            <TextField id="lastName" label="Last name" value={String(values.lastName)} onChange={(value) => setValues({ ...values, lastName: value })} required autoComplete="family-name" />
            <TextField id="dateOfBirth" label="Date of birth" type="date" value={String(values.dateOfBirth)} onChange={(value) => setValues({ ...values, dateOfBirth: value })} />
            <TextField id="pronoun" label="Pronoun" value={String(values.pronoun)} onChange={(value) => setValues({ ...values, pronoun: value })} />
            <TextField id="currentPosition" label="Current position" value={String(values.currentPosition)} onChange={(value) => setValues({ ...values, currentPosition: value })} span="full" />
            <TextField id="headLine" label="Headline" value={String(values.headLine)} onChange={(value) => setValues({ ...values, headLine: value })} span="full" />
            <TextArea id="myQuote" label="Quote" value={String(values.myQuote)} onChange={(value) => setValues({ ...values, myQuote: value })} rows={3} />
            <TextArea id="about" label="About" value={String(values.about)} onChange={(value) => setValues({ ...values, about: value })} />
            <TextField id="profileImageUrl" label="Profile image URL" type="url" value={String(values.profileImageUrl)} onChange={(value) => setValues({ ...values, profileImageUrl: value })} span="full" />
            <TextField id="address" label="Street address" value={String(values.address)} onChange={(value) => setValues({ ...values, address: value })} span="full" />
            <TextField id="city" label="City" value={String(values.city)} onChange={(value) => setValues({ ...values, city: value })} />
            <TextField id="state" label="State" value={String(values.state)} onChange={(value) => setValues({ ...values, state: value })} />
            <TextField id="country" label="Country" value={String(values.country)} onChange={(value) => setValues({ ...values, country: value })} />
            <TextField id="zip" label="Postal code" value={String(values.zip)} onChange={(value) => setValues({ ...values, zip: value })} />
          </div>
          <div className="row">
            <Button type="submit" disabled={pending}>
              {pending ? "Saving..." : mode === "create" ? "Create profile" : "Save profile"}
            </Button>
          </div>
        </form>
      ) : null}
      {status === "ready" && mode === "update" ? (
        <div className="danger-zone clay">
          <h2>Delete profile</h2>
          <p className="muted">This deletes the profile record for the signed-in admin. Authentication itself is unchanged.</p>
          <Button variant="danger" onClick={() => setConfirmDelete(true)}>
            Delete profile
          </Button>
        </div>
      ) : null}
      <ConfirmDialog
        open={confirmDelete}
        title="Delete this profile?"
        description="The public portfolio cannot load without a profile, address, and contact record."
        confirmLabel="Delete profile"
        pending={pending}
        onConfirm={() => void removeProfile()}
        onClose={() => {
          if (!pending) setConfirmDelete(false);
        }}
      />
    </section>
  );
}
