import { eq, sql } from "drizzle-orm";
import { CATEGORY_NOT_FOUND } from "../../constants/appMessages.js";
import { db } from "../../db/configuration.js";
import { categories } from "../../db/schema/categories.js";
import NotFoundException from "../../exceptions/notFoundException.js";
import { deleteRecordById, getRecordById, saveSingleRecord, updateRecordById, } from "../../services/db/baseDbService.js";
async function getAllActiveCategories() {
    const result = await db
        .select({
        id: categories.id,
        name: categories.name,
        name_te: categories.name_te,
        slug: categories.slug,
        icon: categories.icon,
        color: categories.color,
        video_count: sql `COALESCE((
        SELECT COUNT(*)::int FROM videos
        WHERE videos.category_id = ${categories.id} AND videos.is_active = true
      ), 0)`,
        sort_order: categories.sort_order,
        is_active: categories.is_active,
        created_at: categories.created_at,
        updated_at: categories.updated_at,
    })
        .from(categories)
        .where(eq(categories.is_active, true))
        .orderBy(categories.sort_order);
    return result;
}
async function getCategoryById(id) {
    const category = await getRecordById(categories, id);
    if (!category) {
        throw new NotFoundException(CATEGORY_NOT_FOUND);
    }
    return category;
}
async function createCategory(data) {
    const newCategory = await saveSingleRecord(categories, {
        name: data.name,
        name_te: data.name_te,
        slug: data.slug,
        icon: data.icon,
        color: data.color,
        sort_order: data.sort_order,
    });
    return newCategory;
}
async function updateCategory(id, data) {
    await getCategoryById(id);
    const updatedCategory = await updateRecordById(categories, id, data);
    return updatedCategory;
}
async function deleteCategory(id) {
    await getCategoryById(id);
    const deletedCategory = await deleteRecordById(categories, id);
    return deletedCategory;
}
export { createCategory, deleteCategory, getAllActiveCategories, getCategoryById, updateCategory, };
