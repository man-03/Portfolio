import type { Metadata } from "next";
import { ProjectsView } from "@/features/admin/collection-views";

export const metadata: Metadata = { title: "Projects" };

export default function ProjectsPage() {
  return <ProjectsView />;
}
