"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { LoadingBlock } from "@/components/ui/feedback";
import { useHasMounted, useSession } from "@/hooks/use-session";

export function AdminGuard({ children }: { children: ReactNode }) {
  const mounted = useHasMounted();
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (mounted && !session) router.replace("/login");
  }, [mounted, session, router]);

  if (!mounted || !session) {
    return (
      <main id="content" className="page">
        <LoadingBlock label="Checking your session" />
      </main>
    );
  }

  return <AdminShell userName={session.userName}>{children}</AdminShell>;
}
