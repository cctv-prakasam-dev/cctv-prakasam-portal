import { VIDEO_NOT_FOUND } from "../../constants/appMessages.js";
import { videos } from "../../db/schema/videos.js";
import NotFoundException from "../../exceptions/notFoundException.js";
import { deleteRecordById, getMultipleRecordsByAColumnValue, getPaginatedRecordsConditionally, getRecordById, saveSingleRecord, updateRecordById, } from "../../services/db/baseDbService.js";
async function getVideosPaginated(page, pageSize, categoryId, sort) {
    const whereQueryData = {
        columns: ["is_active"],
        values: [true],
        operators: ["eq"],
    };
    if (categoryId) {
        whereQueryData.columns.push("category_id");
        whereQueryData.values.push(categoryId);
        whereQueryData.operators.push("eq");
    }
    const orderByQueryData = {
        columns: [sort === "oldest" ? "published_at" : "published_at"],
        values: [sort === "oldest" ? "asc" : "desc"],
    };
    const result = await getPaginatedRecordsConditionally(videos, page, pageSize, orderByQueryData, whereQueryData);
    return result;
}
async function getVideoById(id) {
    const video = await getRecordById(videos, id);
    if (!video) {
        throw new NotFoundException(VIDEO_NOT_FOUND);
    }
    return video;
}
async function getFeaturedVideos() {
    const result = await getMultipleRecordsByAColumnValue(videos, "is_featured", true, "eq", undefined, {
        columns: ["published_at"],
        values: ["desc"],
    });
    return (result || []);
}
async function getTrendingVideos() {
    const result = await getMultipleRecordsByAColumnValue(videos, "is_trending", true, "eq", undefined, {
        columns: ["published_at"],
        values: ["desc"],
    });
    return (result || []);
}
async function createVideo(data) {
    const newVideo = await saveSingleRecord(videos, {
        youtube_id: data.youtube_id,
        title: data.title,
        title_te: data.title_te,
        description: data.description,
        category_id: data.category_id,
        thumbnail_url: data.thumbnail_url,
        duration: data.duration,
        view_count: data.view_count,
        published_at: data.published_at ? new Date(data.published_at) : undefined,
        is_featured: data.is_featured,
        is_trending: data.is_trending,
    });
    return newVideo;
}
async function updateVideo(id, data) {
    await getVideoById(id);
    const updateData = { ...data };
    if (data.published_at) {
        updateData.published_at = new Date(data.published_at);
    }
    const updatedVideo = await updateRecordById(videos, id, updateData);
    return updatedVideo;
}
async function deleteVideo(id) {
    await getVideoById(id);
    const deletedVideo = await deleteRecordById(videos, id);
    return deletedVideo;
}
export { createVideo, deleteVideo, getFeaturedVideos, getTrendingVideos, getVideoById, getVideosPaginated, updateVideo, };
