"use client";

import { useSearchParams } from "next/navigation";
import { ResetPasswordView } from "@/features/auth/auth-views";

export function ResetPasswordGate() {
  const params = useSearchParams();
  return <ResetPasswordView token={params.get("token") ?? ""} />;
}
