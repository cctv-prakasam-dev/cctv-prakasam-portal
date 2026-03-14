import { useMutation } from "@tanstack/react-query";

import { apiPost } from "@/lib/apiClient";
import { removeTokens, setTokens } from "@/lib/auth";
import { clearAuthUser, setAuthUser } from "@/stores/authStore";

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

interface LoginResponse {
  user: Record<string, unknown>;
  tokens: {
    access_token: string;
    refresh_token: string;
    refresh_token_expires_at: number;
  };
}

export function useLogin() {
  return useMutation({
    mutationFn: (data: LoginPayload) =>
      apiPost<LoginResponse>("/auth/login", data),
    onSuccess: (response) => {
      if (response.data?.tokens) {
        setTokens(response.data.tokens.access_token, response.data.tokens.refresh_token);
      }
      if (response.data?.user) {
        const u = response.data.user;
        setAuthUser({
          id: u.id as number,
          first_name: u.first_name as string,
          last_name: u.last_name as string,
          email: u.email as string,
          user_type: u.user_type as string,
        });
      }
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterPayload) =>
      apiPost("/auth/register", data),
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: () => apiPost("/auth/logout"),
    onSettled: () => {
      removeTokens();
      clearAuthUser();
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (data: { email: string }) =>
      apiPost("/auth/forgot-password", data),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (data: { token: string; password: string; confirm_password: string }) =>
      apiPost("/auth/reset-password", data),
  });
}
