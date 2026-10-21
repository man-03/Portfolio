import { getApiBaseUrl } from "@/lib/config";
import { apiRequest } from "@/services/api-client";
import type { ContactFormRequest, Portfolio } from "@/types/portfolio";

export function loadPortfolio(userName: string, signal?: AbortSignal) {
  return apiRequest<Portfolio>(`/api/public/${encodeURIComponent(userName)}`, {
    method: "POST",
    signal,
  });
}

export function sendContactMessage(body: ContactFormRequest) {
  return apiRequest<string>("/api/public/contact", {
    method: "POST",
    body,
  });
}

export function publicResumeUrl(userName: string) {
  return `${getApiBaseUrl()}/api/public/${encodeURIComponent(userName)}/resume`;
}
