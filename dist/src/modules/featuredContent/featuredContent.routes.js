import { Hono } from "hono";
import isAuthorized from "../../middlewares/isAuthorized.js";
import isManager from "../../middlewares/isManager.js";
import { create, getFeaturedContent, getFeaturedContentWithVideos, remove, update, } from "./featuredContent.controller.js";
const featuredContentPublicRoutes = new Hono();
const featuredContentAdminRoutes = new Hono();
// Public routes
featuredContentPublicRoutes.get("/", getFeaturedContent);
featuredContentPublicRoutes.get("/with-videos", getFeaturedContentWithVideos);
// Admin routes (protected)
featuredContentAdminRoutes.use("*", isAuthorized, isManager);
featuredContentAdminRoutes.post("/", create);
featuredContentAdminRoutes.put("/:id", update);
featuredContentAdminRoutes.delete("/:id", remove);
export { featuredContentAdminRoutes, featuredContentPublicRoutes };
