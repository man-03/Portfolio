"use client";

import { useSyncExternalStore } from "react";
import { getServerSession, readSession, subscribeSession } from "@/lib/session";

const emptySubscribe = () => () => {};

export function useHasMounted() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

export function useSession() {
  return useSyncExternalStore(subscribeSession, readSession, getServerSession);
}
