import { CREATE_VIDEO_VALIDATION_ERROR, FEATURED_VIDEOS_FETCHED, TRENDING_VIDEOS_FETCHED, UPDATE_VIDEO_VALIDATION_ERROR, VIDEO_CREATED, VIDEO_DELETED, VIDEO_FETCHED, VIDEO_UPDATED, VIDEOS_FETCHED, } from "../../constants/appMessages.js";
import { sendSuccessResp } from "../../utils/respUtils.js";
import { validateRequest } from "../../validations/validateRequest.js";
import { createVideo, deleteVideo, getChannelStats, getFeaturedVideos, getTrendingVideos, getVideoById, getVideosPaginated, updateVideo, } from "./videos.service.js";
async function getVideos(c) {
    const page = Number(c.req.query("page")) || 1;
    const limit = Number(c.req.query("limit")) || 10;
    const categoryId = c.req.query("category") ? Number(c.req.query("category")) : undefined;
    const sort = c.req.query("sort");
    const search = c.req.query("search");
    const result = await getVideosPaginated(page, limit, categoryId, sort, search);
    return sendSuccessResp(c, 200, VIDEOS_FETCHED, result);
}
async function getVideo(c) {
    const id = Number(c.req.param("id"));
    const result = await getVideoById(id);
    return sendSuccessResp(c, 200, VIDEO_FETCHED, result);
}
async function getFeatured(c) {
    const result = await getFeaturedVideos();
    return sendSuccessResp(c, 200, FEATURED_VIDEOS_FETCHED, result);
}
async function getTrending(c) {
    const result = await getTrendingVideos();
    return sendSuccessResp(c, 200, TRENDING_VIDEOS_FETCHED, result);
}
async function create(c) {
    const reqData = await c.req.json();
    const validatedData = await validateRequest("create-video", reqData, CREATE_VIDEO_VALIDATION_ERROR);
    const result = await createVideo(validatedData);
    return sendSuccessResp(c, 201, VIDEO_CREATED, result);
}
async function update(c) {
    const id = Number(c.req.param("id"));
    const reqData = await c.req.json();
    const validatedData = await validateRequest("update-video", reqData, UPDATE_VIDEO_VALIDATION_ERROR);
    const result = await updateVideo(id, validatedData);
    return sendSuccessResp(c, 200, VIDEO_UPDATED, result);
}
async function remove(c) {
    const id = Number(c.req.param("id"));
    const result = await deleteVideo(id);
    return sendSuccessResp(c, 200, VIDEO_DELETED, result);
}
async function getStats(c) {
    const result = await getChannelStats();
    return sendSuccessResp(c, 200, "Channel stats fetched", result);
}
export { create, getFeatured, getStats, getTrending, getVideo, getVideos, remove, update, };
