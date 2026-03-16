import { YOUTUBE_SYNC_DONE } from "../../constants/appMessages.js";
import { sendSuccessResp } from "../../utils/respUtils.js";
import { getSyncStatus, triggerManualSync } from "./youtube.service.js";
async function syncVideos(c) {
    triggerManualSync();
    return sendSuccessResp(c, 200, YOUTUBE_SYNC_DONE, { message: "Sync started in background" });
}
async function syncStatus(c) {
    const status = getSyncStatus();
    return sendSuccessResp(c, 200, "Sync status", status);
}
export { syncStatus, syncVideos };
