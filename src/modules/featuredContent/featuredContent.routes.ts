import { Hono } from "hono";

import isAdmin from "../../middlewares/isAdmin.js";
import isAuthorized from "../../middlewares/isAuthorized.js";
import {
  create,
  getFeaturedContent,
  remove,
  update,
} from "./featuredContent.controller.js";

const featuredContentPublicRoutes = new Hono();
const featuredContentAdminRoutes = new Hono();

// Public routes
featuredContentPublicRoutes.get("/", getFeaturedContent);

// Admin routes (protected)
featuredContentAdminRoutes.use("*", isAuthorized, isAdmin);
featuredContentAdminRoutes.post("/", create);
featuredContentAdminRoutes.put("/:id", update);
featuredContentAdminRoutes.delete("/:id", remove);

export { featuredContentAdminRoutes, featuredContentPublicRoutes };
