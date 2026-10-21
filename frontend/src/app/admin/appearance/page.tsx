import type { Metadata } from "next";
import { AppearanceView } from "@/features/admin/appearance-view";

export const metadata: Metadata = { title: "Appearance" };

export default function AppearancePage() {
  return <AppearanceView />;
}
