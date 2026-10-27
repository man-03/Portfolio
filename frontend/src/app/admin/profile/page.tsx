import type { Metadata } from "next";
import { ProfileWorkspace } from "@/features/admin/profile-workspace";

export const metadata: Metadata = { title: "My Profile" };

export default function ProfilePage() {
  return <ProfileWorkspace />;
}
