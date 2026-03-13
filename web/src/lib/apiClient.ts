import { API_BASE_URL } from "@/config/api";
import { getAccessToken, getRefreshToken, removeTokens, setTokens } from "@/lib/auth";

interface ApiResponse<T = unknown> {
  status: number;
  success: boolean;
  message: string;
  data?: T;
  errData?: unknown;
}

async function request<T = unknown>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const token = getAccessToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data: ApiResponse<T> = await response.json();

  // Handle token expiry — attempt refresh
  if (response.status === 401 && getRefreshToken()) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      headers.Authorization = `Bearer ${getAccessToken()}`;
      const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });
      return retryResponse.json();
    }
    removeTokens();
  }

  if (!response.ok) {
    throw data;
  }

  return data;
}

async function refreshAccessToken(): Promise<boolean> {
  try {
    const refreshToken = getRefreshToken();
    const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok)
      return false;

    const data = await response.json();
    if (data.success && data.data?.access_token) {
      setTokens(data.data.access_token, data.data.refresh_token);
      return true;
    }
    return false;
  }
  catch {
    return false;
  }
}

export function apiGet<T = unknown>(endpoint: string) {
  return request<T>(endpoint, { method: "GET" });
}

export function apiPost<T = unknown>(endpoint: string, body?: unknown) {
  return request<T>(endpoint, {
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
  });
}

export function apiPut<T = unknown>(endpoint: string, body?: unknown) {
  return request<T>(endpoint, {
    method: "PUT",
    body: body ? JSON.stringify(body) : undefined,
  });
}

export function apiDelete<T = unknown>(endpoint: string) {
  return request<T>(endpoint, { method: "DELETE" });
}
