import { API_BASE_URL } from "@/config/api";
import { removeTokens } from "@/lib/auth";
import { clearAuthUser } from "@/stores/authStore";

interface ApiResponse<T = unknown> {
  status: number;
  success: boolean;
  message: string;
  data?: T;
  errData?: unknown;
}

const REQUEST_TIMEOUT_MS = 30_000;

// Mutex for refresh token to prevent race conditions
let refreshPromise: Promise<boolean> | null = null;

async function request<T = unknown>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: "include",
      signal: controller.signal,
    });

    // Handle token expiry — attempt refresh once
    if (response.status === 401 && !endpoint.includes("/auth/refresh-token")) {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, {
          ...options,
          headers,
          credentials: "include",
        });
        const retryData: ApiResponse<T> = await retryResponse.json();
        if (!retryResponse.ok) {
          throw retryData;
        }
        return retryData;
      }
      // Refresh failed — force logout
      removeTokens();
      clearAuthUser();
      window.location.href = "/admin/login";
      throw { status: 401, success: false, message: "Session expired" };
    }

    const data: ApiResponse<T> = await response.json();

    if (!response.ok) {
      throw data;
    }

    return data;
  }
  catch (error: unknown) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw { status: 408, success: false, message: "Request timed out" };
    }
    throw error;
  }
  finally {
    clearTimeout(timeout);
  }
}

async function refreshAccessToken(): Promise<boolean> {
  // Use mutex — if a refresh is already in progress, wait for it
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = doRefresh();

  try {
    return await refreshPromise;
  }
  finally {
    refreshPromise = null;
  }
}

async function doRefresh(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    return response.ok;
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
