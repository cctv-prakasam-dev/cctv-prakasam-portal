import type { Context } from "hono";

import type { ValidatedUpdateUserRoleSchema } from "./dashboard.validation.js";

import {
  DASHBOARD_STATS_FETCHED,
  UPDATE_USER_ROLE_VALIDATION_ERROR,
  USER_ROLE_UPDATED,
  USERS_FETCHED,
} from "../../constants/appMessages.js";
import { sendSuccessResp } from "../../utils/respUtils.js";
import { validateRequest } from "../../validations/validateRequest.js";
import {
  getDashboardStats,
  getUsers,
  updateUserRole,
} from "./dashboard.service.js";

async function getStats(c: Context) {
  const result = await getDashboardStats();

  return sendSuccessResp(c, 200, DASHBOARD_STATS_FETCHED, result);
}

async function listUsers(c: Context) {
  const page = Number(c.req.query("page") || 1);
  const pageSize = Number(c.req.query("page_size") || 10);
  const sort = c.req.query("sort");

  const result = await getUsers(page, pageSize, sort);

  return sendSuccessResp(c, 200, USERS_FETCHED, result);
}

async function updateRole(c: Context) {
  const id = Number(c.req.param("id"));
  const reqData = await c.req.json();

  const validatedData = await validateRequest<ValidatedUpdateUserRoleSchema>(
    "update-user-role",
    reqData,
    UPDATE_USER_ROLE_VALIDATION_ERROR,
  );

  const result = await updateUserRole(id, validatedData);

  return sendSuccessResp(c, 200, USER_ROLE_UPDATED, result);
}

export {
  getStats,
  listUsers,
  updateRole,
};
