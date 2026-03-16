import { useMutation } from "@tanstack/react-query";

import { apiPost } from "@/lib/apiClient";
import { removeTokens } from "@/lib/auth";
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

interface AuthResponse {
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    user_type: string;
  };
}

export function useLogin() {
  return useMutation({
    mutationFn: (data: LoginPayload) =>
      apiPost<AuthResponse>("/auth/login", data),
    onSuccess: (response) => {
      if (response.data?.user) {
        setAuthUser(response.data.user);
      }
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterPayload) =>
      apiPost<AuthResponse>("/auth/register", data),
    onSuccess: (response) => {
      if (response.data?.user) {
        setAuthUser(response.data.user);
      }
    },
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
