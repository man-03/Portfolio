"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/controls";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="empty-state">
      <h3>{title}</h3>
      {description ? <p>{description}</p> : null}
      {action}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="error-state" role="alert">
      <p>{message}</p>
      {onRetry ? (
        <Button variant="secondary" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  );
}

export function FormBanner({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p className="form-banner" role="alert">
      {message}
    </p>
  );
}

export function SuccessNote({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p className="success-note" role="status">
      {message}
    </p>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <span className={`skeleton ${className}`.trim()} aria-hidden="true" />;
}

export function LoadingBlock({ label }: { label: string }) {
  return (
    <div className="loading-block" aria-busy="true" aria-live="polite">
      <span className="sr-only">{label}</span>
      <Skeleton className="skeleton-line wide" />
      <Skeleton className="skeleton-line" />
      <Skeleton className="skeleton-card" />
    </div>
  );
}
