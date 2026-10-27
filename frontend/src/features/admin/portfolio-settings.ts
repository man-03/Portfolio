"use client";

import { useSyncExternalStore } from "react";
import { SECTION_IDS, isSectionId, type SectionId } from "@/features/admin/section-ids";
import { type PaletteId } from "@/lib/config";
import { errorMessage } from "@/lib/errors";
import {
  accentPersistWarning,
  applySettingsResponse,
  patchBodyFromPartial,
} from "@/lib/settings-map";
import { getBootBrand, rememberPortfolioUserName, writeSiteBrand } from "@/lib/site-brand";
import { settingsApi } from "@/services/settings-api";

export type SettingsStatus = "idle" | "loading" | "ready" | "saving" | "error";

export type PortfolioSettingsState = {
  theme: "light" | "dark";
  accent: PaletteId;
  order: SectionId[];
  hidden: SectionId[];
  status: SettingsStatus;
  error: string | null;
  warning: string | null;
  updatedAt: string | null;
  revision: number;
  hydrated: boolean;
};

const EVENT = "dossier-portfolio-settings";
const DEFAULT_ORDER = [...SECTION_IDS] as SectionId[];

let state: PortfolioSettingsState = {
  theme: "light",
  accent: "midnight",
  order: DEFAULT_ORDER,
  hidden: [],
  status: "idle",
  error: null,
  warning: null,
  updatedAt: null,
  revision: 0,
  hydrated: false,
};

let userName: string | null = null;
let loadAbort: AbortController | null = null;
let saveTimer: number | null = null;
let pendingPatch: ReturnType<typeof patchBodyFromPartial> | null = null;
/** Snapshot before an optimistic change; restored if PATCH fails. */
let confirmedSnapshot: {
  theme: "light" | "dark";
  accent: PaletteId;
  order: SectionId[];
  hidden: SectionId[];
  updatedAt: string | null;
} | null = null;
let flushChain: Promise<void> = Promise.resolve();
let loadGeneration = 0;

function notify() {
  window.dispatchEvent(new Event(EVENT));
}

function setState(partial: Partial<PortfolioSettingsState>) {
  state = { ...state, ...partial };
  notify();
}

function asSectionIds(values: string[]): SectionId[] {
  return values.filter(isSectionId);
}

function isAbortError(caught: unknown) {
  return (
    (caught instanceof DOMException && caught.name === "AbortError") ||
    (caught instanceof Error && caught.name === "AbortError")
  );
}

function rememberConfirmed() {
  confirmedSnapshot = {
    theme: state.theme,
    accent: state.accent,
    order: [...state.order],
    hidden: [...state.hidden],
    updatedAt: state.updatedAt,
  };
  // Cache last confirmed admin appearance for login/admin boot (not a substitute for GET/PATCH).
  if (userName) rememberPortfolioUserName(userName);
  writeSiteBrand({
    theme: state.theme,
    accent: state.accent,
    userName: userName ?? undefined,
  });
}

function revertToConfirmed(error: string) {
  if (!confirmedSnapshot) {
    setState({ status: "error", error });
    return;
  }
  setState({
    theme: confirmedSnapshot.theme,
    accent: confirmedSnapshot.accent,
    order: [...confirmedSnapshot.order],
    hidden: [...confirmedSnapshot.hidden],
    updatedAt: confirmedSnapshot.updatedAt,
    status: "error",
    error,
    warning: null,
    revision: state.revision + 1,
  });
  applyToDom(confirmedSnapshot.theme, confirmedSnapshot.accent);
  writeSiteBrand({
    theme: confirmedSnapshot.theme,
    accent: confirmedSnapshot.accent,
    userName: userName ?? undefined,
  });
}

export function getPortfolioSettings() {
  return state;
}

export function subscribePortfolioSettings(onStoreChange: () => void) {
  window.addEventListener(EVENT, onStoreChange);
  return () => window.removeEventListener(EVENT, onStoreChange);
}

export function usePortfolioSettings() {
  return useSyncExternalStore(subscribePortfolioSettings, getPortfolioSettings, () => state);
}

export function visibleSectionIds(settings: PortfolioSettingsState = state) {
  return settings.order.filter((id) => !settings.hidden.includes(id));
}

function applyToDom(theme: "light" | "dark", accent: PaletteId) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.dataset.accent = accent;
}

async function runFlush() {
  if (!userName || !pendingPatch) return;
  const body = pendingPatch;
  pendingPatch = null;
  const activeUser = userName;
  setState({ status: "saving", error: null });

  try {
    const response = await settingsApi.patch(activeUser, body);
    if (userName !== activeUser) return;
    const applied = applySettingsResponse(response, SECTION_IDS);
    const order = asSectionIds(applied.order);
    const hidden = asSectionIds(applied.hidden);
    setState({
      theme: applied.theme,
      accent: applied.accent,
      order,
      hidden,
      updatedAt: applied.updatedAt,
      status: "ready",
      error: null,
      warning: accentPersistWarning(applied.accent),
      revision: state.revision + 1,
      hydrated: true,
    });
    applyToDom(applied.theme, applied.accent);
    rememberConfirmed();
  } catch (caught) {
    if (isAbortError(caught)) {
      // Put the body back only once; do not auto-loop retries.
      if (userName === activeUser) {
        pendingPatch = { ...body, ...(pendingPatch ?? {}) };
      }
      return;
    }
    if (userName !== activeUser) return;
    // Do NOT re-queue into a retry loop — that flooded OPTIONS/PATCH on CORS failure.
    revertToConfirmed(errorMessage(caught, "Settings could not be saved."));
  }
}

function enqueueFlush() {
  flushChain = flushChain
    .catch(() => undefined)
    .then(async () => {
      // Serialize saves. Concurrent edits merge into pendingPatch during an in-flight request.
      // Failures clear pending and stop — no automatic retry flood.
      while (userName && pendingPatch) {
        await runFlush();
      }
    });
  return flushChain;
}

function scheduleSave() {
  if (saveTimer !== null) window.clearTimeout(saveTimer);
  saveTimer = window.setTimeout(() => {
    saveTimer = null;
    void enqueueFlush();
  }, 400);
}

function queuePatch(
  partial: {
    theme?: "light" | "dark";
    accent?: PaletteId;
    order?: SectionId[];
    hidden?: SectionId[];
  },
  options?: { immediate?: boolean },
) {
  if (!userName || !state.hydrated) return;
  const nextBody = patchBodyFromPartial({
    theme: partial.theme,
    accent: partial.accent,
    order: partial.order,
    hidden: partial.hidden,
  });
  if (Object.keys(nextBody).length === 0) return;
  pendingPatch = { ...(pendingPatch ?? {}), ...nextBody };
  if (options?.immediate) {
    if (saveTimer !== null) {
      window.clearTimeout(saveTimer);
      saveTimer = null;
    }
    void enqueueFlush();
  } else {
    scheduleSave();
  }
}

/** Flush any queued settings before logout / navigation away. */
export async function flushPortfolioSettings() {
  if (saveTimer !== null) {
    window.clearTimeout(saveTimer);
    saveTimer = null;
  }
  if (!pendingPatch || !userName) return;
  await enqueueFlush();
}

export async function loadPortfolioSettings(nextUserName: string, options?: { force?: boolean }) {
  if (
    !options?.force &&
    userName === nextUserName &&
    state.hydrated &&
    (state.status === "ready" || state.status === "saving" || state.status === "error")
  ) {
    applyToDom(state.theme, state.accent);
    return state;
  }

  // Loading must never enqueue a PATCH.
  if (saveTimer !== null) {
    window.clearTimeout(saveTimer);
    saveTimer = null;
  }
  pendingPatch = null;

  userName = nextUserName;
  rememberPortfolioUserName(nextUserName);
  loadAbort?.abort();
  loadAbort = new AbortController();
  const generation = ++loadGeneration;
  // Keep last brand on DOM while loading — do not paint midnight defaults.
  const boot = getBootBrand();
  applyToDom(boot.theme, boot.accent);
  setState({
    status: "loading",
    error: null,
    warning: null,
    theme: boot.theme,
    accent: boot.accent,
  });

  try {
    const response = await settingsApi.get(nextUserName, loadAbort.signal);
    if (generation !== loadGeneration || userName !== nextUserName) return state;
    const applied = applySettingsResponse(response, SECTION_IDS);
    const order = asSectionIds(applied.order);
    const hidden = asSectionIds(applied.hidden);
    setState({
      theme: applied.theme,
      accent: applied.accent,
      order,
      hidden,
      updatedAt: applied.updatedAt,
      status: "ready",
      error: null,
      warning: accentPersistWarning(applied.accent),
      hydrated: true,
      revision: state.revision + 1,
    });
    applyToDom(applied.theme, applied.accent);
    rememberConfirmed();
  } catch (caught) {
    if (isAbortError(caught)) return state;
    if (generation !== loadGeneration) return state;
    setState({
      status: "error",
      error: errorMessage(caught, "Settings could not be loaded."),
      hydrated: true,
    });
  }
  return state;
}

export function resetPortfolioSettings() {
  loadAbort?.abort();
  if (saveTimer !== null) window.clearTimeout(saveTimer);
  saveTimer = null;
  pendingPatch = null;
  confirmedSnapshot = null;
  userName = null;
  loadGeneration += 1;
  state = {
    theme: "light",
    accent: "midnight",
    order: DEFAULT_ORDER,
    hidden: [],
    status: "idle",
    error: null,
    warning: null,
    updatedAt: null,
    revision: 0,
    hydrated: false,
  };
  notify();
}

export function setAdminTheme(theme: "light" | "dark") {
  if (!state.hydrated) return;
  if (!confirmedSnapshot) rememberConfirmed();
  setState({ theme, warning: null, error: null, revision: state.revision + 1 });
  applyToDom(theme, state.accent);
  // Optimistic brand cache so logout→login does not flash defaults before PATCH confirms.
  writeSiteBrand({ theme, accent: state.accent, userName: userName ?? undefined });
  queuePatch({ theme }, { immediate: true });
}

export function setAdminAccent(accent: PaletteId) {
  if (!state.hydrated) return;
  if (!confirmedSnapshot) rememberConfirmed();
  setState({
    accent,
    warning: accentPersistWarning(accent),
    error: null,
    revision: state.revision + 1,
  });
  applyToDom(state.theme, accent);
  writeSiteBrand({ theme: state.theme, accent, userName: userName ?? undefined });
  queuePatch({ accent }, { immediate: true });
}

export function toggleSectionVisibility(id: SectionId) {
  if (!state.hydrated) return;
  if (!confirmedSnapshot) rememberConfirmed();
  const hidden = state.hidden.includes(id)
    ? state.hidden.filter((item) => item !== id)
    : [...state.hidden, id];
  setState({ hidden, revision: state.revision + 1, warning: null, error: null });
  queuePatch({ order: state.order, hidden });
}

export function moveSectionBefore(id: SectionId, beforeId: SectionId) {
  if (!state.hydrated) return;
  if (id === beforeId) return;
  if (!confirmedSnapshot) rememberConfirmed();
  const order = state.order.filter((item) => item !== id);
  const index = order.indexOf(beforeId);
  if (index < 0) order.push(id);
  else order.splice(index, 0, id);
  setState({ order, revision: state.revision + 1, warning: null, error: null });
  queuePatch({ order, hidden: state.hidden });
}

export function moveSectionToEnd(id: SectionId) {
  if (!state.hydrated) return;
  if (!confirmedSnapshot) rememberConfirmed();
  const order = state.order.filter((item) => item !== id);
  order.push(id);
  setState({ order, revision: state.revision + 1, warning: null, error: null });
  queuePatch({ order, hidden: state.hidden });
}
