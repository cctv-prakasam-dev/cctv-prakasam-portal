import { Hono } from "hono";
import authRoutes from "./modules/auth/auth.routes.js";
import { categoryAdminRoutes, categoryPublicRoutes } from "./modules/categories/categories.routes.js";
const routes = new Hono();
routes.route("/auth", authRoutes);
routes.route("/categories", categoryPublicRoutes);
routes.route("/admin/categories", categoryAdminRoutes);
export default routes;
