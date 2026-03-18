import { deleteCookie, setCookie } from "hono/cookie";
import { jwtConfig } from "../config/jwtConfig.js";
import envData from "../env.js";
const isSecure = envData.APP_BASE_URL.startsWith("https://");
export function setAuthCookies(c, accessToken, refreshToken) {
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
        path: "/api",
        maxAge: jwtConfig.refresh_token_expires_in,
    });
}
export function clearAuthCookies(c) {
    deleteCookie(c, "access_token", {
        path: "/",
    });
    deleteCookie(c, "refresh_token", {
        path: "/api",
    });
}
