import type { BreakingNewsItem } from "../../db/schema/breakingNews.js";
import type { ValidatedCreateBreakingNewsSchema, ValidatedUpdateBreakingNewsSchema } from "./breakingNews.validation.js";

import { BREAKING_NEWS_NOT_FOUND } from "../../constants/appMessages.js";
import { breakingNews } from "../../db/schema/breakingNews.js";
import NotFoundException from "../../exceptions/notFoundException.js";
import {
  deleteRecordById,
  getRecordById,
  getRecordsConditionally,
  saveSingleRecord,
  updateRecordById,
} from "../../services/db/baseDbService.js";
import { parseOrderByQuery } from "../../utils/dbUtils.js";

async function getActiveBreakingNews(): Promise<BreakingNewsItem[]> {
  const orderByQueryData = parseOrderByQuery<BreakingNewsItem>(undefined, "sort_order", "asc");

  const result = await getRecordsConditionally<BreakingNewsItem>(
    breakingNews,
    {
      columns: ["is_active"],
      values: [true],
      operators: ["eq"],
    },
    undefined,
    orderByQueryData,
  );

  return result as BreakingNewsItem[];
}

async function getBreakingNewsById(id: number): Promise<BreakingNewsItem> {
  const item = await getRecordById<BreakingNewsItem>(breakingNews, id);

  if (!item) {
    throw new NotFoundException(BREAKING_NEWS_NOT_FOUND);
  }

  return item;
}

async function createBreakingNews(data: ValidatedCreateBreakingNewsSchema): Promise<BreakingNewsItem> {
  const newItem = await saveSingleRecord<BreakingNewsItem>(breakingNews, {
    text: data.text,
    text_te: data.text_te,
    sort_order: data.sort_order,
  });

  return newItem;
}

async function updateBreakingNews(id: number, data: ValidatedUpdateBreakingNewsSchema): Promise<BreakingNewsItem> {
  await getBreakingNewsById(id);

  const updatedItem = await updateRecordById<BreakingNewsItem>(breakingNews, id, data);

  return updatedItem;
}

async function deleteBreakingNews(id: number): Promise<BreakingNewsItem> {
  await getBreakingNewsById(id);

  const deletedItem = await deleteRecordById<BreakingNewsItem>(breakingNews, id);

  return deletedItem;
}

export {
  createBreakingNews,
  deleteBreakingNews,
  getActiveBreakingNews,
  getBreakingNewsById,
  updateBreakingNews,
};
