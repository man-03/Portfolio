"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Brand } from "@/components/brand";
import { Button, TextField } from "@/components/ui/controls";
import { FormBanner, SuccessNote } from "@/components/ui/feedback";
import { useHasMounted, useSession } from "@/hooks/use-session";
import { errorMessage, readMessage } from "@/lib/errors";
import { validateEmail } from "@/lib/forms";
import { writeSession } from "@/lib/session";
import { authApi } from "@/services/auth-api";

function AuthScreen({ title, copy, children }: { title: string; copy: string; children: ReactNode }) {
  return (
    <main id="content" className="auth-screen">
      <section className="auth-card clay">
        <Brand />
        <h1>{title}</h1>
        <p className="auth-copy">{copy}</p>
        {children}
      </section>
    </main>
  );
}

export function LoginView() {
  const router = useRouter();
  const session = useSession();
  const mounted = useHasMounted();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (mounted && session) router.replace("/admin");
  }, [mounted, session, router]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const emailError = validateEmail(email.trim(), true);
    if (emailError) return setError(emailError);
    if (!password) return setError("Password is required.");
    setPending(true);
    setError(null);
    try {
      const result = await authApi.login(email.trim(), password);
      if (!result?.token || !result.userName) {
        setError("Sign-in did not return a session. Try again.");
        return;
      }
      writeSession({ token: result.token, userName: result.userName });
      router.replace("/admin");
    } catch (caught) {
      setError(errorMessage(caught, "Sign-in failed."));
    } finally {
      setPending(false);
    }
  }

  return (
    <AuthScreen title="Sign in" copy="Use the admin email and password.">
      <form className="stack" onSubmit={onSubmit} noValidate>
        <FormBanner message={error} />
        <TextField id="email" label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" required />
        <TextField id="password" label="Password" type="password" value={password} onChange={setPassword} autoComplete="current-password" required />
        <Button type="submit" disabled={pending}>
          {pending ? "Signing in..." : "Sign in"}
        </Button>
      </form>
      <p className="auth-copy">
        <Link href="/forgot-password">Forgot password</Link>
      </p>
    </AuthScreen>
  );
}

export function ForgotPasswordView() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const emailError = validateEmail(email.trim(), true);
    if (emailError) return setError(emailError);
    setPending(true);
    setError(null);
    try {
      const result = await authApi.forgotPassword(email.trim());
      setSuccess(readMessage(result, "If the email is registered, a password reset link has been sent."));
    } catch (caught) {
      setError(errorMessage(caught, "The reset email could not be requested."));
    } finally {
      setPending(false);
    }
  }

  return (
    <AuthScreen title="Reset link" copy="Enter the admin email. If it is registered, the API sends a reset link.">
      <form className="stack" onSubmit={onSubmit} noValidate>
        <FormBanner message={error} />
        <SuccessNote message={success} />
        <TextField id="reset-email" label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" required />
        <Button type="submit" disabled={pending}>
          {pending ? "Sending..." : "Send reset link"}
        </Button>
      </form>
      <p className="auth-copy">
        <Link href="/login">Back to sign in</Link>
      </p>
    </AuthScreen>
  );
}

export function ResetPasswordView({ token }: { token: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!token) return setError("This reset link is missing a token.");
    if (!password) return setError("Enter a new password.");
    if (password !== confirm) return setError("The passwords do not match.");
    setPending(true);
    setError(null);
    try {
      const result = await authApi.resetPassword(token, password);
      setSuccess(readMessage(result, "Password has been reset successfully."));
      window.setTimeout(() => router.replace("/login"), 900);
    } catch (caught) {
      setError(errorMessage(caught, "The password could not be reset."));
    } finally {
      setPending(false);
    }
  }

  return (
    <AuthScreen title="Choose a password" copy="This page uses the token from the reset link.">
      <form className="stack" onSubmit={onSubmit} noValidate>
        <FormBanner message={error ?? (token ? null : "This reset link is missing a token.")} />
        <SuccessNote message={success} />
        <TextField id="reset-password" label="New password" type="password" value={password} onChange={setPassword} autoComplete="new-password" required />
        <TextField id="reset-confirm" label="Confirm password" type="password" value={confirm} onChange={setConfirm} autoComplete="new-password" required />
        <Button type="submit" disabled={pending || !token}>
          {pending ? "Saving..." : "Reset password"}
        </Button>
      </form>
    </AuthScreen>
  );
}
