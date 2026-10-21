import type { Metadata } from "next";
import { LinksView } from "@/features/admin/collection-views";

export const metadata: Metadata = { title: "Links" };

export default function LinksPage() {
  return <LinksView />;
}
