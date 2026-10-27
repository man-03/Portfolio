import type { Metadata } from "next";
import { GlobalView } from "@/features/admin/global-view";

export const metadata: Metadata = { title: "Global View" };

export default function GlobalViewPage() {
  return <GlobalView />;
}
