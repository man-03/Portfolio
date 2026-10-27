"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent, ReactNode } from "react";
import { Wordmark } from "@/components/wordmark";
import { Button } from "@/components/ui/controls";
import { FormBanner, SuccessNote } from "@/components/ui/feedback";
import { PasswordField } from "@/components/ui/password-field";
import { useHasMounted, useSession } from "@/hooks/use-session";
import { getSiteName } from "@/lib/config";
import { errorMessage, readMessage } from "@/lib/errors";
import { validateEmail } from "@/lib/forms";
import { writeSession } from "@/lib/session";
import { authApi } from "@/services/auth-api";

const INTRO_KEY = "dossier.admin-intro";
const INTRO_EVENT = "dossier-intro";

function subscribeIntro(onStoreChange: () => void) {
  window.addEventListener(INTRO_EVENT, onStoreChange);
  return () => window.removeEventListener(INTRO_EVENT, onStoreChange);
}

function readIntro() {
  return sessionStorage.getItem(INTRO_KEY) === "1" ? "form" : "intro";
}

function AuthScreen({ title, copy, children }: { title: string; copy?: string; children: ReactNode }) {
  const year = new Date().getFullYear();
  return (
    <main id="content" className="auth-screen">
      <section className="auth-card clay">
        <Wordmark />
        <h1>{title}</h1>
        {copy ? <p className="auth-copy">{copy}</p> : null}
        {children}
      </section>
      <p className="copyright auth-copyright">
        © {year} {getSiteName()}
      </p>
    </main>
  );
}

function IntroScreen() {
  return (
    <main className="intro-screen" aria-live="polite">
      <div className="intro-card">
        <Wordmark />
        <p>Opening studio</p>
        <div className="intro-bar" aria-hidden="true">
          <span />
        </div>
      </div>
    </main>
  );
}

export function LoginView() {
  const router = useRouter();
  const session = useSession();
  const mounted = useHasMounted();
  const phase = useSyncExternalStore(subscribeIntro, readIntro, () => "intro" as const);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (mounted && session) router.replace("/admin");
  }, [mounted, session, router]);

  useEffect(() => {
    if (!mounted || session || phase === "form") return;
    const timer = window.setTimeout(() => {
      sessionStorage.setItem(INTRO_KEY, "1");
      window.dispatchEvent(new Event(INTRO_EVENT));
    }, 2000);
    return () => window.clearTimeout(timer);
  }, [mounted, session, phase]);

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

  if (!mounted || session || phase === "intro") return <IntroScreen />;

  return (
    <AuthScreen title="Welcome Admin">
      <form className="stack" onSubmit={onSubmit} noValidate>
        <FormBanner message={error} />
        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="email@example.com"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <PasswordField
          id="password"
          label="Password"
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
          placeholder="Password"
        />
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
        <div className="field">
          <label htmlFor="reset-email">Email</label>
          <input id="reset-email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
        </div>
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
        <PasswordField id="reset-password" label="New password" value={password} onChange={setPassword} autoComplete="new-password" />
        <PasswordField id="reset-confirm" label="Confirm password" value={confirm} onChange={setConfirm} autoComplete="new-password" />
        <Button type="submit" disabled={pending || !token}>
          {pending ? "Saving..." : "Reset password"}
        </Button>
      </form>
    </AuthScreen>
  );
}
