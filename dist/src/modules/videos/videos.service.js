import { count } from "drizzle-orm";
import { youtubeConfig } from "../../config/youtubeConfig.js";
import { VIDEO_NOT_FOUND } from "../../constants/appMessages.js";
import { db } from "../../db/configuration.js";
import { videos } from "../../db/schema/videos.js";
import NotFoundException from "../../exceptions/notFoundException.js";
import { deleteRecordById, getMultipleRecordsByAColumnValue, getPaginatedRecordsConditionally, getRecordById, saveSingleRecord, updateRecordById, } from "../../services/db/baseDbService.js";
import { httpGet } from "../../services/http.js";
import { parseOrderByQuery } from "../../utils/dbUtils.js";
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
    const orderByQueryData = parseOrderByQuery(sort, "published_at", "desc");
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
    const orderByQueryData = parseOrderByQuery(undefined, "published_at", "desc");
    const result = await getMultipleRecordsByAColumnValue(videos, "is_featured", true, "eq", undefined, orderByQueryData);
    return (result || []);
}
async function getTrendingVideos() {
    const orderByQueryData = parseOrderByQuery(undefined, "published_at", "desc");
    const result = await getMultipleRecordsByAColumnValue(videos, "is_trending", true, "eq", undefined, orderByQueryData);
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
async function getChannelStats() {
    let subscribers = 0;
    let totalViews = 0;
    let videoCount = 0;
    let channelCreatedAt = null;
    try {
        const url = `${youtubeConfig.baseUrl}/channels?part=statistics,snippet&id=${youtubeConfig.channelId}&key=${youtubeConfig.apiKey}`;
        const data = await httpGet(url);
        if (data.items && data.items.length > 0) {
            const stats = data.items[0].statistics;
            subscribers = Number.parseInt(stats.subscriberCount || "0", 10);
            totalViews = Number.parseInt(stats.viewCount || "0", 10);
            videoCount = Number.parseInt(stats.videoCount || "0", 10);
            channelCreatedAt = data.items[0].snippet?.publishedAt || null;
        }
    }
    catch {
        // Fallback to DB count
        const [dbCount] = await db.select({ total: count() }).from(videos);
        videoCount = dbCount.total;
    }
    // Calculate years since channel creation
    let years = 0;
    if (channelCreatedAt) {
        const created = new Date(channelCreatedAt);
        const now = new Date();
        years = Math.floor((now.getTime() - created.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    }
    return { subscribers, total_views: totalViews, video_count: videoCount, years, channel_created_at: channelCreatedAt };
}
export { createVideo, deleteVideo, getChannelStats, getFeaturedVideos, getTrendingVideos, getVideoById, getVideosPaginated, updateVideo, };
