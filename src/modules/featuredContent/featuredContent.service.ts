import { eq, sql } from "drizzle-orm";

import type { FeaturedContentItem } from "../../db/schema/featuredContent.js";
import type { ValidatedCreateFeaturedContentSchema, ValidatedUpdateFeaturedContentSchema } from "./featuredContent.validation.js";

import { FEATURED_CONTENT_NOT_FOUND } from "../../constants/appMessages.js";
import { db } from "../../db/configuration.js";
import { featuredContent } from "../../db/schema/featuredContent.js";
import { videos } from "../../db/schema/videos.js";
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

async function getActiveFeaturedContentWithVideos() {
  const result = await db
    .select({
      id: featuredContent.id,
      type: featuredContent.type,
      title: featuredContent.title,
      sort_order: featuredContent.sort_order,
      video_id: featuredContent.video_id,
      video_title: videos.title,
      video_title_te: videos.title_te,
      youtube_id: videos.youtube_id,
      description: videos.description,
      thumbnail_url: videos.thumbnail_url,
      duration: videos.duration,
      view_count: videos.view_count,
      published_at: videos.published_at,
      category_id: videos.category_id,
    })
    .from(featuredContent)
    .leftJoin(videos, eq(featuredContent.video_id, videos.id))
    .where(sql`${featuredContent.is_active} = true`)
    .orderBy(featuredContent.sort_order);

  return result;
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
  getActiveFeaturedContentWithVideos,
  getFeaturedContentById,
  updateFeaturedContent,
};
