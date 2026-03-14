import { Hono } from "hono";

import isAuthorized from "../../middlewares/isAuthorized.js";
import isManager from "../../middlewares/isManager.js";
import { syncVideos } from "./youtube.controller.js";

const youtubeAdminRoutes = new Hono();

// Admin routes (protected)
youtubeAdminRoutes.use("*", isAuthorized, isManager);
youtubeAdminRoutes.post("/sync-youtube", syncVideos);

export { youtubeAdminRoutes };
