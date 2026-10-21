import type { Metadata } from "next";
import { OverviewView } from "@/features/admin/overview-view";

export const metadata: Metadata = { title: "Overview" };

export default function AdminHomePage() {
  return <OverviewView />;
}
