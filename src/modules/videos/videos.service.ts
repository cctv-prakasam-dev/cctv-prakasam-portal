import type { Video } from "../../db/schema/videos.js";
import type { WhereQueryData } from "../../types/db.types.js";
import type { ValidatedCreateVideoSchema, ValidatedUpdateVideoSchema } from "./videos.validation.js";

import { count } from "drizzle-orm";

import { youtubeConfig } from "../../config/youtubeConfig.js";
import { VIDEO_NOT_FOUND } from "../../constants/appMessages.js";
import { db } from "../../db/configuration.js";
import { videos } from "../../db/schema/videos.js";
import NotFoundException from "../../exceptions/notFoundException.js";
import {
  deleteRecordById,
  getMultipleRecordsByAColumnValue,
  getPaginatedRecordsConditionally,
  getRecordById,
  saveSingleRecord,
  updateRecordById,
} from "../../services/db/baseDbService.js";
import { httpGet } from "../../services/http.js";
import { parseOrderByQuery } from "../../utils/dbUtils.js";

async function getVideosPaginated(
  page: number,
  pageSize: number,
  categoryId?: number,
  sort?: string,
) {
  const whereQueryData: WhereQueryData<Video> = {
    columns: ["is_active"],
    values: [true],
    operators: ["eq"],
  };

  if (categoryId) {
    whereQueryData.columns.push("category_id");
    whereQueryData.values.push(categoryId);
    whereQueryData.operators.push("eq");
  }

  const orderByQueryData = parseOrderByQuery<Video>(
    sort,
    "published_at",
    "desc",
  );

  const result = await getPaginatedRecordsConditionally<Video>(
    videos,
    page,
    pageSize,
    orderByQueryData,
    whereQueryData,
  );

  return result;
}

async function getVideoById(id: number): Promise<Video> {
  const video = await getRecordById<Video>(videos, id);

  if (!video) {
    throw new NotFoundException(VIDEO_NOT_FOUND);
  }

  return video;
}

async function getFeaturedVideos(): Promise<Video[]> {
  const orderByQueryData = parseOrderByQuery<Video>(undefined, "published_at", "desc");

  const result = await getMultipleRecordsByAColumnValue<Video>(
    videos,
    "is_featured",
    true,
    "eq",
    undefined,
    orderByQueryData,
  );

  return (result || []) as Video[];
}

async function getTrendingVideos(): Promise<Video[]> {
  const orderByQueryData = parseOrderByQuery<Video>(undefined, "published_at", "desc");

  const result = await getMultipleRecordsByAColumnValue<Video>(
    videos,
    "is_trending",
    true,
    "eq",
    undefined,
    orderByQueryData,
  );

  return (result || []) as Video[];
}

async function createVideo(data: ValidatedCreateVideoSchema): Promise<Video> {
  const newVideo = await saveSingleRecord<Video>(videos, {
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

async function updateVideo(id: number, data: ValidatedUpdateVideoSchema): Promise<Video> {
  await getVideoById(id);

  const updateData: Record<string, unknown> = { ...data };
  if (data.published_at) {
    updateData.published_at = new Date(data.published_at);
  }

  const updatedVideo = await updateRecordById<Video>(videos, id, updateData);

  return updatedVideo;
}

async function deleteVideo(id: number): Promise<Video> {
  await getVideoById(id);

  const deletedVideo = await deleteRecordById<Video>(videos, id);

  return deletedVideo;
}

async function getChannelStats() {
  let subscribers = 0;
  let totalViews = 0;
  let videoCount = 0;

  try {
    const url = `${youtubeConfig.baseUrl}/channels?part=statistics&id=${youtubeConfig.channelId}&key=${youtubeConfig.apiKey}`;
    const data = await httpGet(url);
    if (data.items && data.items.length > 0) {
      const stats = data.items[0].statistics;
      subscribers = Number.parseInt(stats.subscriberCount || "0", 10);
      totalViews = Number.parseInt(stats.viewCount || "0", 10);
      videoCount = Number.parseInt(stats.videoCount || "0", 10);
    }
  }
  catch {
    // Fallback to DB count
    const [dbCount] = await db.select({ total: count() }).from(videos);
    videoCount = dbCount.total;
  }

  return { subscribers, total_views: totalViews, video_count: videoCount };
}

export {
  createVideo,
  deleteVideo,
  getChannelStats,
  getFeaturedVideos,
  getTrendingVideos,
  getVideoById,
  getVideosPaginated,
  updateVideo,
};
