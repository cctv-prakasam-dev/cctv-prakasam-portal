import envData from "../env.js";

export const appConfig = {
  port: Number(envData.PORT),
  version: envData.API_VERSION,
  app_base_url: envData.APP_BASE_URL,
  youtube_api_key: envData.YOUTUBE_API_KEY,
  youtube_channel_id: envData.YOUTUBE_CHANNEL_ID,
};
