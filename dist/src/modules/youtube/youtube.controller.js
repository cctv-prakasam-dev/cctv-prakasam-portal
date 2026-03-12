import { YOUTUBE_SYNC_DONE } from "../../constants/appMessages.js";
import { sendSuccessResp } from "../../utils/respUtils.js";
import { syncYouTubeVideos } from "./youtube.service.js";
async function syncVideos(c) {
    const result = await syncYouTubeVideos();
    return sendSuccessResp(c, 200, YOUTUBE_SYNC_DONE, result);
}
export { syncVideos };
