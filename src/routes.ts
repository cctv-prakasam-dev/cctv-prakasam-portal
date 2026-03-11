import { Hono } from "hono";

import authRoutes from "./modules/auth/auth.routes.js";
import { categoryAdminRoutes, categoryPublicRoutes } from "./modules/categories/categories.routes.js";
import { newsletterAdminRoutes, newsletterPublicRoutes } from "./modules/newsletter/newsletter.routes.js";
import { videoAdminRoutes, videoPublicRoutes } from "./modules/videos/videos.routes.js";

const routes = new Hono();

routes.route("/auth", authRoutes);
routes.route("/categories", categoryPublicRoutes);
routes.route("/admin/categories", categoryAdminRoutes);
routes.route("/videos", videoPublicRoutes);
routes.route("/admin/videos", videoAdminRoutes);
routes.route("/newsletter", newsletterPublicRoutes);
routes.route("/admin/newsletter", newsletterAdminRoutes);

export default routes;
