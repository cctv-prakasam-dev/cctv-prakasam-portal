import { Hono } from "hono";

import isAuthorized from "../../middlewares/isAuthorized.js";
import isManager from "../../middlewares/isManager.js";
import { syncStatus, syncVideos } from "./youtube.controller.js";

const youtubeAdminRoutes = new Hono();

// Admin routes (protected)
youtubeAdminRoutes.use("*", isAuthorized, isManager);
youtubeAdminRoutes.post("/sync-youtube", syncVideos);
youtubeAdminRoutes.get("/sync-status", syncStatus);

export { youtubeAdminRoutes };
