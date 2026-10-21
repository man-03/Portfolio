import type { Metadata } from "next";
import { PasswordView } from "@/features/admin/password-view";

export const metadata: Metadata = { title: "Password" };

export default function PasswordPage() {
  return <PasswordView />;
}
