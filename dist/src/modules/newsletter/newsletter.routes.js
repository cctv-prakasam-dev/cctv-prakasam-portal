import { Hono } from "hono";
import isAdmin from "../../middlewares/isAdmin.js";
import isAuthorized from "../../middlewares/isAuthorized.js";
import { deleteSubscriber, getSubscribers, subscribeNewsletter, } from "./newsletter.controller.js";
const newsletterPublicRoutes = new Hono();
const newsletterAdminRoutes = new Hono();
// Public routes
newsletterPublicRoutes.post("/subscribe", subscribeNewsletter);
// Admin routes (protected)
newsletterAdminRoutes.use("*", isAuthorized, isAdmin);
newsletterAdminRoutes.get("/", getSubscribers);
newsletterAdminRoutes.delete("/:id", deleteSubscriber);
export { newsletterAdminRoutes, newsletterPublicRoutes };
