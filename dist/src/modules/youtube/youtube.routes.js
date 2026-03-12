import { Hono } from "hono";
import isAdmin from "../../middlewares/isAdmin.js";
import isAuthorized from "../../middlewares/isAuthorized.js";
import { syncVideos } from "./youtube.controller.js";
const youtubeAdminRoutes = new Hono();
// Admin routes (protected)
youtubeAdminRoutes.use("*", isAuthorized, isAdmin);
youtubeAdminRoutes.post("/sync-youtube", syncVideos);
export { youtubeAdminRoutes };
