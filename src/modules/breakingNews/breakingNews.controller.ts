import type { Context } from "hono";

import type {
  ValidatedCreateBreakingNewsSchema,
  ValidatedUpdateBreakingNewsSchema,
} from "./breakingNews.validation.js";

import {
  BREAKING_NEWS_CREATED,
  BREAKING_NEWS_DELETED,
  BREAKING_NEWS_FETCHED,
  BREAKING_NEWS_UPDATED,
  CREATE_BREAKING_NEWS_VALIDATION_ERROR,
  UPDATE_BREAKING_NEWS_VALIDATION_ERROR,
} from "../../constants/appMessages.js";
import { sendSuccessResp } from "../../utils/respUtils.js";
import { validateRequest } from "../../validations/validateRequest.js";
import {
  createBreakingNews,
  deleteBreakingNews,
  getActiveBreakingNews,
  updateBreakingNews,
} from "./breakingNews.service.js";

async function getBreakingNews(c: Context) {
  const result = await getActiveBreakingNews();

  return sendSuccessResp(c, 200, BREAKING_NEWS_FETCHED, result);
}

async function create(c: Context) {
  const reqData = await c.req.json();

  const validatedData = await validateRequest<ValidatedCreateBreakingNewsSchema>(
    "create-breaking-news",
    reqData,
    CREATE_BREAKING_NEWS_VALIDATION_ERROR,
  );

  const result = await createBreakingNews(validatedData);

  return sendSuccessResp(c, 201, BREAKING_NEWS_CREATED, result);
}

async function update(c: Context) {
  const id = Number(c.req.param("id"));
  const reqData = await c.req.json();

  const validatedData = await validateRequest<ValidatedUpdateBreakingNewsSchema>(
    "update-breaking-news",
    reqData,
    UPDATE_BREAKING_NEWS_VALIDATION_ERROR,
  );

  const result = await updateBreakingNews(id, validatedData);

  return sendSuccessResp(c, 200, BREAKING_NEWS_UPDATED, result);
}

async function remove(c: Context) {
  const id = Number(c.req.param("id"));

  const result = await deleteBreakingNews(id);

  return sendSuccessResp(c, 200, BREAKING_NEWS_DELETED, result);
}

export {
  create,
  getBreakingNews,
  remove,
  update,
};
