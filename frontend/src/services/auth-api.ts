import { apiRequest } from "@/services/api-client";
import type { LoginResponse } from "@/types/portfolio";

export const authApi = {
  login(email: string, password: string) {
    return apiRequest<LoginResponse>("/api/auth/login", {
      method: "POST",
      body: { email, password },
    });
  },
  forgotPassword(email: string) {
    return apiRequest<string>("/api/auth/forgot-password", {
      method: "POST",
      body: { email },
    });
  },
  resetPassword(token: string, newPassword: string) {
    return apiRequest<string>("/api/auth/reset-forgot-password", {
      method: "POST",
      body: { token, newPassword },
    });
  },
  changePassword(currentPassword: string, newPassword: string) {
    return apiRequest<string>("/api/auth/change-password", {
      method: "POST",
      auth: true,
      body: { currentPassword, newPassword },
    });
  },
};
