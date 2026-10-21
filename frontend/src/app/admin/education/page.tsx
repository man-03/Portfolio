import type { Metadata } from "next";
import { EducationView } from "@/features/admin/collection-views";

export const metadata: Metadata = { title: "Education" };

export default function EducationPage() {
  return <EducationView />;
}
