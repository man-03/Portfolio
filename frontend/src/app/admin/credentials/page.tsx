import type { Metadata } from "next";
import { CredentialsView } from "@/features/admin/collection-views";

export const metadata: Metadata = { title: "Credentials" };

export default function CredentialsPage() {
  return <CredentialsView />;
}
