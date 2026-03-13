import type { User } from "../../db/schema/users.js";
import type { ValidatedUpdateUserRoleSchema } from "./dashboard.validation.js";

import { count } from "drizzle-orm";

import { USER_NOT_FOUND } from "../../constants/appMessages.js";
import { db } from "../../db/configuration.js";
import { breakingNews } from "../../db/schema/breakingNews.js";
import { newsletterSubscribers } from "../../db/schema/newsletterSubscribers.js";
import { users } from "../../db/schema/users.js";
import { videos } from "../../db/schema/videos.js";
import NotFoundException from "../../exceptions/notFoundException.js";
import {
  getPaginatedRecordsConditionally,
  getRecordById,
  updateRecordById,
} from "../../services/db/baseDbService.js";
import { parseOrderByQuery } from "../../utils/dbUtils.js";

async function getDashboardStats() {
  const [videoCount] = await db.select({ total: count() }).from(videos);
  const [userCount] = await db.select({ total: count() }).from(users);
  const [subscriberCount] = await db.select({ total: count() }).from(newsletterSubscribers);
  const [breakingNewsCount] = await db.select({ total: count() }).from(breakingNews);

  return {
    videos: videoCount.total,
    users: userCount.total,
    newsletter_subscribers: subscriberCount.total,
    breaking_news: breakingNewsCount.total,
  };
}

async function getUsers(page: number, pageSize: number, sort?: string) {
  const orderByQueryData = parseOrderByQuery<User>(sort, "created_at", "desc");

  const result = await getPaginatedRecordsConditionally<User>(
    users,
    page,
    pageSize,
    orderByQueryData,
  );

  return result;
}

async function updateUserRole(id: number, data: ValidatedUpdateUserRoleSchema): Promise<User> {
  const existing = await getRecordById<User>(users, id);

  if (!existing) {
    throw new NotFoundException(USER_NOT_FOUND);
  }

  const updatedUser = await updateRecordById<User>(users, id, data);

  return updatedUser;
}

export {
  getDashboardStats,
  getUsers,
  updateUserRole,
};
