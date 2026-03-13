import { Hono } from "hono";

import isAdmin from "../../middlewares/isAdmin.js";
import isAuthorized from "../../middlewares/isAuthorized.js";
import {
  getStats,
  listUsers,
  updateRole,
} from "./dashboard.controller.js";

const dashboardAdminRoutes = new Hono();

// Admin routes (protected)
dashboardAdminRoutes.use("*", isAuthorized, isAdmin);
dashboardAdminRoutes.get("/stats", getStats);
dashboardAdminRoutes.get("/users", listUsers);
dashboardAdminRoutes.put("/users/:id", updateRole);

export { dashboardAdminRoutes };
