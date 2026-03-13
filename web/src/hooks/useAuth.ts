import { useMutation } from "@tanstack/react-query";

import { apiPost } from "@/lib/apiClient";
import { removeTokens, setTokens } from "@/lib/auth";

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

interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

export function useLogin() {
  return useMutation({
    mutationFn: (data: LoginPayload) =>
      apiPost<AuthTokens>("/auth/login", data),
    onSuccess: (response) => {
      if (response.data) {
        setTokens(response.data.access_token, response.data.refresh_token);
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
