import envData from "../env.js";
export const jwtConfig = {
    secret: envData.JWT_SECRET,
    access_token_expires_in: 60 * 60, // 1 hour
    refresh_token_expires_in: 60 * 60 * 24 * 7, // 7 days
};
