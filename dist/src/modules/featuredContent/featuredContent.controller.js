import { CREATE_FEATURED_CONTENT_VALIDATION_ERROR, FEATURED_CONTENT_CREATED, FEATURED_CONTENT_DELETED, FEATURED_CONTENT_FETCHED, FEATURED_CONTENT_UPDATED, UPDATE_FEATURED_CONTENT_VALIDATION_ERROR, } from "../../constants/appMessages.js";
import { sendSuccessResp } from "../../utils/respUtils.js";
import { validateRequest } from "../../validations/validateRequest.js";
import { createFeaturedContent, deleteFeaturedContent, getActiveFeaturedContent, getActiveFeaturedContentWithVideos, updateFeaturedContent, } from "./featuredContent.service.js";
async function getFeaturedContent(c) {
    const result = await getActiveFeaturedContent();
    return sendSuccessResp(c, 200, FEATURED_CONTENT_FETCHED, result);
}
async function getFeaturedContentWithVideos(c) {
    const result = await getActiveFeaturedContentWithVideos();
    return sendSuccessResp(c, 200, FEATURED_CONTENT_FETCHED, result);
}
async function create(c) {
    const reqData = await c.req.json();
    const validatedData = await validateRequest("create-featured-content", reqData, CREATE_FEATURED_CONTENT_VALIDATION_ERROR);
    const result = await createFeaturedContent(validatedData);
    return sendSuccessResp(c, 201, FEATURED_CONTENT_CREATED, result);
}
async function update(c) {
    const id = Number(c.req.param("id"));
    const reqData = await c.req.json();
    const validatedData = await validateRequest("update-featured-content", reqData, UPDATE_FEATURED_CONTENT_VALIDATION_ERROR);
    const result = await updateFeaturedContent(id, validatedData);
    return sendSuccessResp(c, 200, FEATURED_CONTENT_UPDATED, result);
}
async function remove(c) {
    const id = Number(c.req.param("id"));
    const result = await deleteFeaturedContent(id);
    return sendSuccessResp(c, 200, FEATURED_CONTENT_DELETED, result);
}
export { create, getFeaturedContent, getFeaturedContentWithVideos, remove, update, };
