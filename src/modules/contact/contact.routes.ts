import { Hono } from "hono";

import { submitContact } from "./contact.controller.js";

const contactPublicRoutes = new Hono();

// Public routes
contactPublicRoutes.post("/", submitContact);

export { contactPublicRoutes };
