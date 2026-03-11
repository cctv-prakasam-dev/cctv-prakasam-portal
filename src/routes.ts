import { Hono } from "hono";

import authRoutes from "./modules/auth/auth.routes.js";

const routes = new Hono();

routes.route("/auth", authRoutes);

export default routes;
