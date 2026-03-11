import type { Context } from "hono";

import { createMiddleware } from "hono/factory";

import { FORBIDDEN_ACCESS } from "../constants/appMessages.js";
import ForbiddenException from "../exceptions/forbiddenException.js";

const isAdmin = createMiddleware(async (c: Context, next) => {
  const userPayload = c.get("user_payload");

  if (!userPayload || userPayload.user_type !== "ADMIN") {
    throw new ForbiddenException(FORBIDDEN_ACCESS);
  }

  await next();
});

export default isAdmin;
