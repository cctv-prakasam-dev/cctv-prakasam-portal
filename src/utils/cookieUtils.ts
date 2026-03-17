import type { Context } from "hono";

import { deleteCookie, setCookie } from "hono/cookie";

import { jwtConfig } from "../config/jwtConfig.js";
import envData from "../env.js";

const isSecure = envData.APP_BASE_URL.startsWith("https://");

export function setAuthCookies(c: Context, accessToken: string, refreshToken: string) {
  setCookie(c, "access_token", accessToken, {
    httpOnly: true,
    secure: isSecure,
    sameSite: "Lax",
    path: "/",
    maxAge: jwtConfig.access_token_expires_in,
  });

  setCookie(c, "refresh_token", refreshToken, {
    httpOnly: true,
    secure: isSecure,
    sameSite: "Lax",
    path: "/api/auth/refresh-token",
    maxAge: jwtConfig.refresh_token_expires_in,
  });
}

export function clearAuthCookies(c: Context) {
  deleteCookie(c, "access_token", {
    path: "/",
  });

  deleteCookie(c, "refresh_token", {
    path: "/api/auth/refresh-token",
  });
}
