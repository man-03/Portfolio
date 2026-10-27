import { getApiBaseUrl } from "@/lib/config";
import { ApiError, toUserMessage } from "@/lib/errors";
import { clearSession, isTokenExpired, readSession } from "@/lib/session";

type RequestOptions = {
  method?: string;
  body?: unknown;
  auth?: boolean;
  formData?: FormData;
  signal?: AbortSignal;
};

let unauthorizedHandler: (() => void) | null = null;

export function setUnauthorizedHandler(handler: () => void) {
  unauthorizedHandler = handler;
}

function endSession() {
  clearSession();
  unauthorizedHandler?.();
}

async function send(path: string, options: RequestOptions) {
  const headers = new Headers();
  let body: BodyInit | undefined;

  if (options.formData) {
    body = options.formData;
  } else if (options.body !== undefined) {
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(options.body);
  }

  if (options.auth) {
    const session = readSession();
    if (!session || isTokenExpired(session.token)) {
      endSession();
      throw new ApiError("Your session has ended. Please sign in again.", 401);
    }
    headers.set("Authorization", `Bearer ${session.token}`);
  }

  let response: Response;
  try {
    response = await fetch(`${getApiBaseUrl()}${path}`, {
      method: options.method ?? "GET",
      headers,
      body,
      signal: options.signal,
    });
  } catch (error) {
    const aborted =
      (error instanceof DOMException && error.name === "AbortError") ||
      (error instanceof Error && error.name === "AbortError") ||
      options.signal?.aborted;
    if (aborted) {
      const abortError = error instanceof Error ? error : new DOMException("Aborted", "AbortError");
      throw abortError;
    }
    throw new ApiError("The server could not be reached. Check that the API is running.", 0);
  }

  if (options.auth && (response.status === 401 || (response.status === 403 && isTokenExpired(readSession()?.token ?? "")))) {
    endSession();
    throw new ApiError("Your session has ended. Please sign in again.", response.status);
  }

  return response;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await send(path, options);
  const text = await response.text();

  if (!response.ok) {
    throw new ApiError(toUserMessage(response.status, text), response.status);
  }

  if (!text) return undefined as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    return text as T;
  }
}

export async function apiRequestBlob(path: string, options: RequestOptions = {}) {
  const response = await send(path, options);
  if (!response.ok) {
    const text = await response.text();
    throw new ApiError(toUserMessage(response.status, text), response.status);
  }
  const blob = await response.blob();
  const disposition = response.headers.get("content-disposition") ?? "";
  const match = disposition.match(/filename="([^"]+)"/);
  return { blob, fileName: match?.[1] ?? null };
}
