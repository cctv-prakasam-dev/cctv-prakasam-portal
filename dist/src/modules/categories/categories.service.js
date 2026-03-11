import { CATEGORY_NOT_FOUND } from "../../constants/appMessages.js";
import { categories } from "../../db/schema/categories.js";
import NotFoundException from "../../exceptions/notFoundException.js";
import { deleteRecordById, getRecordById, getRecordsConditionally, saveSingleRecord, updateRecordById, } from "../../services/db/baseDbService.js";
async function getAllActiveCategories() {
    const result = await getRecordsConditionally(categories, {
        columns: ["is_active"],
        values: [true],
        operators: ["eq"],
    }, undefined, {
        columns: ["sort_order"],
        values: ["asc"],
    });
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
