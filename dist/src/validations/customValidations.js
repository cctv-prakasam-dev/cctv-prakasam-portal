import { and, eq, ne } from "drizzle-orm";
import { db } from "../db/configuration.js";
import { users } from "../db/schema/users.js";
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
