import { and, eq, ne } from "drizzle-orm";
import { categories } from "../db/schema/categories.js";
import { db } from "../db/configuration.js";
import { newsletterSubscribers } from "../db/schema/newsletterSubscribers.js";
import { users } from "../db/schema/users.js";
import { videos } from "../db/schema/videos.js";
import { getSingleRecordByAColumnValue } from "../services/db/baseDbService.js";
// Check if email exists and return a boolean accordingly
export async function userEmailExists(email) {
    const columnsToSelect = ["id", "email"];
    const result = await getSingleRecordByAColumnValue(users, "email", email, "eq", columnsToSelect);
    return !!result;
}
export async function userExists(id) {
    const existingUser = await db
        .select()
        .from(users)
        .where(and(eq(users.id, id)));
    return existingUser.length > 0;
}
export async function emailExists(email, id) {
    const existingUser = await db
        .select()
        .from(users)
        .where(and(eq(users.email, email), ne(users.id, id)));
    return existingUser.length > 0;
}
export async function phoneExists(phone, id) {
    const existingUser = await db
        .select()
        .from(users)
        .where(and(eq(users.phone, phone), ne(users.id, id)));
    return existingUser.length > 0;
}
export async function phoneExist(phone) {
    const existingUser = await db
        .select()
        .from(users)
        .where(and(eq(users.phone, phone)));
    return existingUser.length > 0;
}
export async function videoYoutubeIdExists(youtubeId) {
    const columnsToSelect = ["id", "youtube_id"];
    const result = await getSingleRecordByAColumnValue(videos, "youtube_id", youtubeId, "eq", columnsToSelect);
    return !!result;
}
export async function newsletterEmailExists(email) {
    const columnsToSelect = ["id", "email"];
    const result = await getSingleRecordByAColumnValue(newsletterSubscribers, "email", email, "eq", columnsToSelect);
    return !!result;
}
export async function categorySlugExists(slug) {
    const columnsToSelect = ["id", "slug"];
    const result = await getSingleRecordByAColumnValue(categories, "slug", slug, "eq", columnsToSelect);
    return !!result;
}
