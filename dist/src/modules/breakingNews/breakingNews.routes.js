import { Hono } from "hono";
import isAdmin from "../../middlewares/isAdmin.js";
import isAuthorized from "../../middlewares/isAuthorized.js";
import { create, getBreakingNews, remove, update, } from "./breakingNews.controller.js";
const breakingNewsPublicRoutes = new Hono();
const breakingNewsAdminRoutes = new Hono();
// Public routes
breakingNewsPublicRoutes.get("/", getBreakingNews);
// Admin routes (protected)
breakingNewsAdminRoutes.use("*", isAuthorized, isAdmin);
breakingNewsAdminRoutes.post("/", create);
breakingNewsAdminRoutes.put("/:id", update);
breakingNewsAdminRoutes.delete("/:id", remove);
export { breakingNewsAdminRoutes, breakingNewsPublicRoutes };
