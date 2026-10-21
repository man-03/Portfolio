import type { Metadata } from "next";
import { ResumeView } from "@/features/admin/resume-view";

export const metadata: Metadata = { title: "Resume" };

export default function ResumePage() {
  return <ResumeView />;
}
