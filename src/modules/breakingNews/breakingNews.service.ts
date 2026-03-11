import type { BreakingNewsItem } from "../../db/schema/breakingNews.js";
import type { ValidatedCreateBreakingNews, ValidatedUpdateBreakingNews } from "../../types/app.types.js";

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

async function getActiveBreakingNews(): Promise<BreakingNewsItem[]> {
  const result = await getRecordsConditionally<BreakingNewsItem>(
    breakingNews,
    {
      columns: ["is_active"],
      values: [true],
      operators: ["eq"],
    },
    undefined,
    {
      columns: ["sort_order"],
      values: ["asc"],
    },
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

async function createBreakingNews(data: ValidatedCreateBreakingNews): Promise<BreakingNewsItem> {
  const newItem = await saveSingleRecord<BreakingNewsItem>(breakingNews, {
    text: data.text,
    text_te: data.text_te,
    sort_order: data.sort_order,
  });

  return newItem;
}

async function updateBreakingNews(id: number, data: ValidatedUpdateBreakingNews): Promise<BreakingNewsItem> {
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
