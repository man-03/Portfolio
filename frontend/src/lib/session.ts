export type Session = {
  token: string;
  userName: string;
};

const STORAGE_KEY = "dossier.session";
const SESSION_EVENT = "dossier-session";

let cachedRaw: string | null | undefined;
let cachedSession: Session | null = null;

function decodeExpiry(token: string) {
  try {
    const segment = token.split(".")[1];
    if (!segment) return null;
    const normalized = segment.replace(/-/g, "+").replace(/_/g, "/");
    const payload: unknown = JSON.parse(atob(normalized));
    if (!payload || typeof payload !== "object" || !("exp" in payload)) return null;
    return typeof payload.exp === "number" ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string) {
  const expiry = decodeExpiry(token);
  return expiry !== null && expiry <= Date.now();
}

function parseSession(raw: string | null): Session | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    const token = "token" in parsed ? parsed.token : null;
    const userName = "userName" in parsed ? parsed.userName : null;
    if (typeof token !== "string" || typeof userName !== "string" || !token || !userName) {
      return null;
    }
    if (isTokenExpired(token)) return null;
    return { token, userName };
  } catch {
    return null;
  }
}

export function readSession() {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedSession = parseSession(raw);
  }
  if (cachedSession && isTokenExpired(cachedSession.token)) return null;
  return cachedSession;
}

export function writeSession(session: Session) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  cachedRaw = undefined;
  window.dispatchEvent(new Event(SESSION_EVENT));
}

export function clearSession() {
  sessionStorage.removeItem(STORAGE_KEY);
  cachedRaw = undefined;
  window.dispatchEvent(new Event(SESSION_EVENT));
}

export function subscribeSession(onStoreChange: () => void) {
  window.addEventListener(SESSION_EVENT, onStoreChange);
  return () => window.removeEventListener(SESSION_EVENT, onStoreChange);
}

export function getServerSession(): Session | null {
  return null;
}
