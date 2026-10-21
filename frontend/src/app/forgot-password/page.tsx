import type { Metadata } from "next";
import { ForgotPasswordView } from "@/features/auth/auth-views";

export const metadata: Metadata = { title: "Forgot password" };

export default function ForgotPasswordPage() {
  return <ForgotPasswordView />;
}
