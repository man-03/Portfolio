import type { Metadata } from "next";
import { ExperienceView } from "@/features/admin/collection-views";

export const metadata: Metadata = { title: "Experience" };

export default function ExperiencePage() {
  return <ExperienceView />;
}
