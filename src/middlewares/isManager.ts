import type { Context } from "hono";

import { createMiddleware } from "hono/factory";

import { FORBIDDEN_ACCESS } from "../constants/appMessages.js";
import ForbiddenException from "../exceptions/forbiddenException.js";

const MANAGER_ROLES = ["MANAGER", "ADMIN"];

const isManager = createMiddleware(async (c: Context, next) => {
  const userPayload = c.get("user_payload");

  if (!userPayload || !MANAGER_ROLES.includes(userPayload.user_type)) {
    throw new ForbiddenException(FORBIDDEN_ACCESS);
  }

  await next();
});

export default isManager;
