import { deleteCookie, setCookie } from "hono/cookie";
import { appConfig } from "../config/appConfig.js";
import { jwtConfig } from "../config/jwtConfig.js";
import envData from "../env.js";
const isProduction = envData.NODE_ENV === "production";
export function setAuthCookies(c, accessToken, refreshToken) {
    setCookie(c, "access_token", accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "Strict",
        path: "/",
        domain: appConfig.cookie_domain,
        maxAge: jwtConfig.access_token_expires_in,
    });
    setCookie(c, "refresh_token", refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "Strict",
        path: "/api/auth/refresh-token",
        domain: appConfig.cookie_domain,
        maxAge: jwtConfig.refresh_token_expires_in,
    });
}
export function clearAuthCookies(c) {
    deleteCookie(c, "access_token", {
        path: "/",
        domain: appConfig.cookie_domain,
    });
    deleteCookie(c, "refresh_token", {
        path: "/api/auth/refresh-token",
        domain: appConfig.cookie_domain,
    });
}
