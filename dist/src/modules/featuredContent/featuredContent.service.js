import { FEATURED_CONTENT_NOT_FOUND } from "../../constants/appMessages.js";
import { featuredContent } from "../../db/schema/featuredContent.js";
import NotFoundException from "../../exceptions/notFoundException.js";
import { deleteRecordById, getRecordById, getRecordsConditionally, saveSingleRecord, updateRecordById, } from "../../services/db/baseDbService.js";
async function getActiveFeaturedContent() {
    const result = await getRecordsConditionally(featuredContent, {
        columns: ["is_active"],
        values: [true],
        operators: ["eq"],
    }, undefined, {
        columns: ["sort_order"],
        values: ["asc"],
    });
    return result;
}
async function getFeaturedContentById(id) {
    const item = await getRecordById(featuredContent, id);
    if (!item) {
        throw new NotFoundException(FEATURED_CONTENT_NOT_FOUND);
    }
    return item;
}
async function createFeaturedContent(data) {
    const newItem = await saveSingleRecord(featuredContent, {
        type: data.type,
        video_id: data.video_id,
        title: data.title,
        sort_order: data.sort_order,
    });
    return newItem;
}
async function updateFeaturedContent(id, data) {
    await getFeaturedContentById(id);
    const updatedItem = await updateRecordById(featuredContent, id, data);
    return updatedItem;
}
async function deleteFeaturedContent(id) {
    await getFeaturedContentById(id);
    const deletedItem = await deleteRecordById(featuredContent, id);
    return deletedItem;
}
export { createFeaturedContent, deleteFeaturedContent, getActiveFeaturedContent, getFeaturedContentById, updateFeaturedContent, };
