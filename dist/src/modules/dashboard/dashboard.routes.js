import { Hono } from "hono";
import isAdmin from "../../middlewares/isAdmin.js";
import isAuthorized from "../../middlewares/isAuthorized.js";
import isManager from "../../middlewares/isManager.js";
import { createUser, getStats, listUsers, updateRole, } from "./dashboard.controller.js";
const dashboardAdminRoutes = new Hono();
// Stats accessible by MANAGER and ADMIN
dashboardAdminRoutes.get("/stats", isAuthorized, isManager, getStats);
// User management - ADMIN only
dashboardAdminRoutes.get("/users", isAuthorized, isAdmin, listUsers);
dashboardAdminRoutes.post("/users", isAuthorized, isAdmin, createUser);
dashboardAdminRoutes.put("/users/:id", isAuthorized, isAdmin, updateRole);
export { dashboardAdminRoutes };
