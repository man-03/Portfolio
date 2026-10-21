"use client";

import { useState, type FormEvent } from "react";
import { Button, TextField } from "@/components/ui/controls";
import { FormBanner, SuccessNote } from "@/components/ui/feedback";
import { useToast } from "@/hooks/use-toast";
import { errorMessage, readMessage } from "@/lib/errors";
import { authApi } from "@/services/auth-api";

export function PasswordView() {
  const toast = useToast();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!currentPassword || !newPassword) {
      setError("Enter your current password and a new password.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("The new passwords do not match.");
      return;
    }
    if (newPassword === currentPassword) {
      setError("Choose a new password that is different from the current one.");
      return;
    }
    setPending(true);
    setError(null);
    setSuccess(null);
    try {
      const result = await authApi.changePassword(currentPassword, newPassword);
      const message = readMessage(result, "Password changed successfully.");
      setSuccess(message);
      toast.success(message);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (caught) {
      setError(errorMessage(caught, "The password could not be changed."));
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="stack">
      <header className="page-intro">
        <h1>Password</h1>
        <p>Change the password for the signed-in admin email.</p>
      </header>
      <form className="editor clay stack" onSubmit={onSubmit} noValidate>
        <FormBanner message={error} />
        <SuccessNote message={success} />
        <TextField id="current-password" label="Current password" type="password" value={currentPassword} onChange={setCurrentPassword} autoComplete="current-password" required />
        <TextField id="new-password" label="New password" type="password" value={newPassword} onChange={setNewPassword} autoComplete="new-password" required />
        <TextField id="confirm-password" label="Confirm new password" type="password" value={confirmPassword} onChange={setConfirmPassword} autoComplete="new-password" required />
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : "Change password"}
        </Button>
      </form>
    </section>
  );
}
