const AUTH_USER_KEY = "cctv_auth_user";

export function removeTokens() {
  localStorage.removeItem(AUTH_USER_KEY);
  // Clean up legacy token keys if present
  localStorage.removeItem("cctv_access_token");
  localStorage.removeItem("cctv_refresh_token");
}

export function isAuthenticated(): boolean {
  return !!localStorage.getItem(AUTH_USER_KEY);
}
