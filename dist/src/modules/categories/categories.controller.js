import { CATEGORIES_FETCHED, CATEGORY_CREATED, CATEGORY_DELETED, CATEGORY_FETCHED, CATEGORY_UPDATED, CREATE_CATEGORY_VALIDATION_ERROR, UPDATE_CATEGORY_VALIDATION_ERROR, } from "../../constants/appMessages.js";
import { sendSuccessResp } from "../../utils/respUtils.js";
import { validateRequest } from "../../validations/validateRequest.js";
import { createCategory, deleteCategory, getAllActiveCategories, getCategoryById, updateCategory, } from "./categories.service.js";
async function getCategories(c) {
    const result = await getAllActiveCategories();
    return sendSuccessResp(c, 200, CATEGORIES_FETCHED, result);
}
async function getCategory(c) {
    const id = Number(c.req.param("id"));
    const result = await getCategoryById(id);
    return sendSuccessResp(c, 200, CATEGORY_FETCHED, result);
}
async function create(c) {
    const reqData = await c.req.json();
    const validatedData = await validateRequest("create-category", reqData, CREATE_CATEGORY_VALIDATION_ERROR);
    const result = await createCategory(validatedData);
    return sendSuccessResp(c, 201, CATEGORY_CREATED, result);
}
async function update(c) {
    const id = Number(c.req.param("id"));
    const reqData = await c.req.json();
    const validatedData = await validateRequest("update-category", reqData, UPDATE_CATEGORY_VALIDATION_ERROR);
    const result = await updateCategory(id, validatedData);
    return sendSuccessResp(c, 200, CATEGORY_UPDATED, result);
}
async function remove(c) {
    const id = Number(c.req.param("id"));
    const result = await deleteCategory(id);
    return sendSuccessResp(c, 200, CATEGORY_DELETED, result);
}
export { create, getCategories, getCategory, remove, update, };
