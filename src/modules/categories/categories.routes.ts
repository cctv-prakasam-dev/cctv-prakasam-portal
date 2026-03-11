import { Hono } from "hono";

import isAdmin from "../../middlewares/isAdmin.js";
import isAuthorized from "../../middlewares/isAuthorized.js";
import {
  create,
  getCategories,
  getCategory,
  remove,
  update,
} from "./categories.controller.js";

const categoryPublicRoutes = new Hono();
const categoryAdminRoutes = new Hono();

// Public routes
categoryPublicRoutes.get("/", getCategories);
categoryPublicRoutes.get("/:id", getCategory);

// Admin routes (protected)
categoryAdminRoutes.use("*", isAuthorized, isAdmin);
categoryAdminRoutes.post("/", create);
categoryAdminRoutes.put("/:id", update);
categoryAdminRoutes.delete("/:id", remove);

export { categoryAdminRoutes, categoryPublicRoutes };
