import type { FeaturedContentItem } from "../../db/schema/featuredContent.js";
import type { ValidatedCreateFeaturedContentSchema, ValidatedUpdateFeaturedContentSchema } from "./featuredContent.validation.js";

import { FEATURED_CONTENT_NOT_FOUND } from "../../constants/appMessages.js";
import { featuredContent } from "../../db/schema/featuredContent.js";
import NotFoundException from "../../exceptions/notFoundException.js";
import {
  deleteRecordById,
  getRecordById,
  getRecordsConditionally,
  saveSingleRecord,
  updateRecordById,
} from "../../services/db/baseDbService.js";
import { parseOrderByQuery } from "../../utils/dbUtils.js";

async function getActiveFeaturedContent(): Promise<FeaturedContentItem[]> {
  const orderByQueryData = parseOrderByQuery<FeaturedContentItem>(undefined, "sort_order", "asc");

  const result = await getRecordsConditionally<FeaturedContentItem>(
    featuredContent,
    {
      columns: ["is_active"],
      values: [true],
      operators: ["eq"],
    },
    undefined,
    orderByQueryData,
  );

  return result as FeaturedContentItem[];
}

async function getFeaturedContentById(id: number): Promise<FeaturedContentItem> {
  const item = await getRecordById<FeaturedContentItem>(featuredContent, id);

  if (!item) {
    throw new NotFoundException(FEATURED_CONTENT_NOT_FOUND);
  }

  return item;
}

async function createFeaturedContent(data: ValidatedCreateFeaturedContentSchema): Promise<FeaturedContentItem> {
  const newItem = await saveSingleRecord<FeaturedContentItem>(featuredContent, {
    type: data.type,
    video_id: data.video_id,
    title: data.title,
    sort_order: data.sort_order,
  });

  return newItem;
}

async function updateFeaturedContent(id: number, data: ValidatedUpdateFeaturedContentSchema): Promise<FeaturedContentItem> {
  await getFeaturedContentById(id);

  const updatedItem = await updateRecordById<FeaturedContentItem>(featuredContent, id, data);

  return updatedItem;
}

async function deleteFeaturedContent(id: number): Promise<FeaturedContentItem> {
  await getFeaturedContentById(id);

  const deletedItem = await deleteRecordById<FeaturedContentItem>(featuredContent, id);

  return deletedItem;
}

export {
  createFeaturedContent,
  deleteFeaturedContent,
  getActiveFeaturedContent,
  getFeaturedContentById,
  updateFeaturedContent,
};
