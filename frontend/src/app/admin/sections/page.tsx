import type { Metadata } from "next";
import { SectionsView } from "@/features/admin/sections-view";

export const metadata: Metadata = { title: "Section visibility" };

export default function SectionsPage() {
  return <SectionsView />;
}
