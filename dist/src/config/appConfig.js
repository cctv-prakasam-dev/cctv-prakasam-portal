import envData from "../env.js";
export const appConfig = {
    port: Number(envData.PORT),
    version: envData.API_VERSION,
    api_base_url: envData.API_BASE_URL,
    app_base_url: envData.APP_BASE_URL,
    cookie_domain: envData.COOKIE_DOMAIN,
    SCOPE: envData.SCOPE,
};
