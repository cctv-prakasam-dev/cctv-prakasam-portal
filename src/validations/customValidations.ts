import { and, eq, ne } from "drizzle-orm";

import type { Category } from "../db/schema/categories.js";
import type { NewsletterSubscriber } from "../db/schema/newsletterSubscribers.js";
import type { User } from "../db/schema/users.js";
import type { Video } from "../db/schema/videos.js";

import { categories } from "../db/schema/categories.js";
import { db } from "../db/configuration.js";
import { newsletterSubscribers } from "../db/schema/newsletterSubscribers.js";
import { users } from "../db/schema/users.js";
import { videos } from "../db/schema/videos.js";
import { getSingleRecordByAColumnValue } from "../services/db/baseDbService.js";

// Check if email exists and return a boolean accordingly
export async function userEmailExists(email: string) {
  const columnsToSelect = ["id", "email"] as const;

  const result = await getSingleRecordByAColumnValue<
    User,
    (typeof columnsToSelect)[number]
  >(users, "email", email, "eq", columnsToSelect);

  return !!result;
}

export async function userExists(id: number) {
  const existingUser = await db
    .select()
    .from(users)
    .where(and(eq(users.id, id)));

  return existingUser.length > 0;
}

export async function emailExists(email: string, id: number) {
  const existingUser = await db
    .select()
    .from(users)
    .where(and(eq(users.email, email), ne(users.id, id)));

  return existingUser.length > 0;
}

export async function phoneExists(phone: string, id: number) {
  const existingUser = await db
    .select()
    .from(users)
    .where(and(eq(users.phone, phone), ne(users.id, id)));

  return existingUser.length > 0;
}
export async function phoneExist(phone: string) {
  const existingUser = await db
    .select()
    .from(users)
    .where(and(eq(users.phone, phone)));

  return existingUser.length > 0;
}

export async function videoYoutubeIdExists(youtubeId: string) {
  const columnsToSelect = ["id", "youtube_id"] as const;

  const result = await getSingleRecordByAColumnValue<
    Video,
    (typeof columnsToSelect)[number]
  >(videos, "youtube_id", youtubeId, "eq", columnsToSelect);

  return !!result;
}

export async function newsletterEmailExists(email: string) {
  const columnsToSelect = ["id", "email"] as const;

  const result = await getSingleRecordByAColumnValue<
    NewsletterSubscriber,
    (typeof columnsToSelect)[number]
  >(newsletterSubscribers, "email", email, "eq", columnsToSelect);

  return !!result;
}

export async function categorySlugExists(slug: string) {
  const columnsToSelect = ["id", "slug"] as const;

  const result = await getSingleRecordByAColumnValue<
    Category,
    (typeof columnsToSelect)[number]
  >(categories, "slug", slug, "eq", columnsToSelect);

  return !!result;
}
