import { BREAKING_NEWS_NOT_FOUND } from "../../constants/appMessages.js";
import { breakingNews } from "../../db/schema/breakingNews.js";
import NotFoundException from "../../exceptions/notFoundException.js";
import { deleteRecordById, getRecordById, getRecordsConditionally, saveSingleRecord, updateRecordById, } from "../../services/db/baseDbService.js";
async function getActiveBreakingNews() {
    const result = await getRecordsConditionally(breakingNews, {
        columns: ["is_active"],
        values: [true],
        operators: ["eq"],
    }, undefined, {
        columns: ["sort_order"],
        values: ["asc"],
    });
    return result;
}
async function getBreakingNewsById(id) {
    const item = await getRecordById(breakingNews, id);
    if (!item) {
        throw new NotFoundException(BREAKING_NEWS_NOT_FOUND);
    }
    return item;
}
async function createBreakingNews(data) {
    const newItem = await saveSingleRecord(breakingNews, {
        text: data.text,
        text_te: data.text_te,
        sort_order: data.sort_order,
    });
    return newItem;
}
async function updateBreakingNews(id, data) {
    await getBreakingNewsById(id);
    const updatedItem = await updateRecordById(breakingNews, id, data);
    return updatedItem;
}
async function deleteBreakingNews(id) {
    await getBreakingNewsById(id);
    const deletedItem = await deleteRecordById(breakingNews, id);
    return deletedItem;
}
export { createBreakingNews, deleteBreakingNews, getActiveBreakingNews, getBreakingNewsById, updateBreakingNews, };
