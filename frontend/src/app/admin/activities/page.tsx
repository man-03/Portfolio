import type { Metadata } from "next";
import { ActivitiesView } from "@/features/admin/collection-views";

export const metadata: Metadata = { title: "Activities" };

export default function ActivitiesPage() {
  return <ActivitiesView />;
}
