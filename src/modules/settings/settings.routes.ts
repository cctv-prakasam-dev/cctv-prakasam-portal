import { Hono } from "hono";

import isAdmin from "../../middlewares/isAdmin.js";
import isAuthorized from "../../middlewares/isAuthorized.js";
import {
  getSetting,
  getSettings,
  update,
} from "./settings.controller.js";

const settingsPublicRoutes = new Hono();
const settingsAdminRoutes = new Hono();

// Public routes
settingsPublicRoutes.get("/:key", getSetting);

// Admin routes (protected)
settingsAdminRoutes.use("*", isAuthorized, isAdmin);
settingsAdminRoutes.get("/", getSettings);
settingsAdminRoutes.put("/:id", update);

export { settingsAdminRoutes, settingsPublicRoutes };
