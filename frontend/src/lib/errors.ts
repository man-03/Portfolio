const UNSAFE_PATTERN =
  /exception|sql|jdbc|stack trace|jwt|secret|passwordhash|at portfolio\./i;

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function isNotFoundError(error: unknown) {
  return isApiError(error) && error.status === 400 && /not found/i.test(error.message);
}

function fallbackMessage(status: number) {
  if (status === 0) {
    return "The server could not be reached. Check that the API is running.";
  }
  if (status === 401 || status === 403) {
    return "You do not have access to this action.";
  }
  if (status >= 500) {
    return "The server could not complete that request.";
  }
  return "The request could not be completed.";
}

function isSafeMessage(value: string) {
  const trimmed = value.trim();
  return trimmed.length > 0 && trimmed.length <= 180 && !UNSAFE_PATTERN.test(trimmed);
}

export function toUserMessage(status: number, body: string) {
  const trimmed = body.trim();
  if (!trimmed) return fallbackMessage(status);
  if (/bad credentials/i.test(trimmed)) {
    return "Email or password is incorrect.";
  }

  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    try {
      const parsed: unknown = JSON.parse(trimmed);
      if (parsed && typeof parsed === "object" && "message" in parsed) {
        const message = parsed.message;
        if (typeof message === "string" && isSafeMessage(message)) {
          return /bad credentials/i.test(message)
            ? "Email or password is incorrect."
            : message.trim();
        }
      }
    } catch {
      return fallbackMessage(status);
    }
    return fallbackMessage(status);
  }

  return isSafeMessage(trimmed) ? trimmed : fallbackMessage(status);
}

export function readMessage(value: unknown, fallback: string) {
  if (typeof value === "string" && isSafeMessage(value)) return value.trim();
  if (value && typeof value === "object" && "message" in value) {
    const message = value.message;
    if (typeof message === "string" && isSafeMessage(message)) return message.trim();
  }
  return fallback;
}

export function errorMessage(error: unknown, fallback = "Something went wrong. Please try again.") {
  if (isApiError(error)) return error.message;
  if (error instanceof Error && error.message && isSafeMessage(error.message)) {
    return error.message;
  }
  return fallback;
}
