import type { Metadata } from "next";
import { Suspense } from "react";
import { ResetPasswordGate } from "@/features/auth/reset-password-gate";
import { LoadingBlock } from "@/components/ui/feedback";

export const metadata: Metadata = { title: "Reset password" };

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<main className="page"><LoadingBlock label="Loading reset form" /></main>}>
      <ResetPasswordGate />
    </Suspense>
  );
}
