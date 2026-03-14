import { Hono } from "hono";
import isAuthorized from "../../middlewares/isAuthorized.js";
import isManager from "../../middlewares/isManager.js";
import { create, getFeatured, getTrending, getVideo, getVideos, remove, update, } from "./videos.controller.js";
const videoPublicRoutes = new Hono();
const videoAdminRoutes = new Hono();
// Public routes — featured/trending before /:id to avoid param conflict
videoPublicRoutes.get("/", getVideos);
videoPublicRoutes.get("/featured", getFeatured);
videoPublicRoutes.get("/trending", getTrending);
videoPublicRoutes.get("/:id", getVideo);
// Admin routes (protected)
videoAdminRoutes.use("*", isAuthorized, isManager);
videoAdminRoutes.post("/", create);
videoAdminRoutes.put("/:id", update);
videoAdminRoutes.delete("/:id", remove);
export { videoAdminRoutes, videoPublicRoutes };
