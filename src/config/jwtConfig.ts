import envData from "../env.js";

export const jwtConfig = {
  secret: envData.JWT_SECRET!,
  access_token_expires_in: 60 * 60 * 24 * 30, // 30 days
  refresh_token_expires_in: 60 * 60 * 24 * 90, // 90 days
};
