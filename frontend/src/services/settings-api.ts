import { apiRequest } from "@/services/api-client";
import type { PortfolioSettingsRequest, PortfolioSettingsResponse } from "@/types/settings";

function settingsPath(userName: string) {
  return `/api/admin/${encodeURIComponent(userName)}/settings`;
}

export const settingsApi = {
  get(userName: string, signal?: AbortSignal) {
    return apiRequest<PortfolioSettingsResponse>(settingsPath(userName), {
      auth: true,
      signal,
    });
  },
  patch(userName: string, body: PortfolioSettingsRequest, signal?: AbortSignal) {
    return apiRequest<PortfolioSettingsResponse>(settingsPath(userName), {
      method: "PATCH",
      auth: true,
      body,
      signal,
    });
  },
};
