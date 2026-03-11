import type { Context } from "hono";

import type {
  ValidatedCreateVideo,
  ValidatedUpdateVideo,
} from "../../types/app.types.js";

import {
  CREATE_VIDEO_VALIDATION_ERROR,
  FEATURED_VIDEOS_FETCHED,
  TRENDING_VIDEOS_FETCHED,
  UPDATE_VIDEO_VALIDATION_ERROR,
  VIDEO_CREATED,
  VIDEO_DELETED,
  VIDEO_FETCHED,
  VIDEO_UPDATED,
  VIDEOS_FETCHED,
} from "../../constants/appMessages.js";
import { sendSuccessResp } from "../../utils/respUtils.js";
import { validateRequest } from "../../validations/validateRequest.js";
import {
  createVideo,
  deleteVideo,
  getFeaturedVideos,
  getTrendingVideos,
  getVideoById,
  getVideosPaginated,
  updateVideo,
} from "./videos.service.js";

async function getVideos(c: Context) {
  const page = Number(c.req.query("page")) || 1;
  const limit = Number(c.req.query("limit")) || 10;
  const categoryId = c.req.query("category") ? Number(c.req.query("category")) : undefined;
  const sort = c.req.query("sort") || "latest";

  const result = await getVideosPaginated(page, limit, categoryId, sort);

  return sendSuccessResp(c, 200, VIDEOS_FETCHED, result);
}

async function getVideo(c: Context) {
  const id = Number(c.req.param("id"));
  const result = await getVideoById(id);

  return sendSuccessResp(c, 200, VIDEO_FETCHED, result);
}

async function getFeatured(c: Context) {
  const result = await getFeaturedVideos();

  return sendSuccessResp(c, 200, FEATURED_VIDEOS_FETCHED, result);
}

async function getTrending(c: Context) {
  const result = await getTrendingVideos();

  return sendSuccessResp(c, 200, TRENDING_VIDEOS_FETCHED, result);
}

async function create(c: Context) {
  const reqData = await c.req.json();

  const validatedData = await validateRequest<ValidatedCreateVideo>(
    "create-video",
    reqData,
    CREATE_VIDEO_VALIDATION_ERROR,
  );

  const result = await createVideo(validatedData);

  return sendSuccessResp(c, 201, VIDEO_CREATED, result);
}

async function update(c: Context) {
  const id = Number(c.req.param("id"));
  const reqData = await c.req.json();

  const validatedData = await validateRequest<ValidatedUpdateVideo>(
    "update-video",
    reqData,
    UPDATE_VIDEO_VALIDATION_ERROR,
  );

  const result = await updateVideo(id, validatedData);

  return sendSuccessResp(c, 200, VIDEO_UPDATED, result);
}

async function remove(c: Context) {
  const id = Number(c.req.param("id"));

  const result = await deleteVideo(id);

  return sendSuccessResp(c, 200, VIDEO_DELETED, result);
}

export {
  create,
  getFeatured,
  getTrending,
  getVideo,
  getVideos,
  remove,
  update,
};
