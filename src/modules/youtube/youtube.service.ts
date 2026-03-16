import type { Category } from "../../db/schema/categories.js";
import type { Video } from "../../db/schema/videos.js";

import { count, eq, sql } from "drizzle-orm";

import { youtubeConfig } from "../../config/youtubeConfig.js";
import { db } from "../../db/configuration.js";
import { categories } from "../../db/schema/categories.js";
import { videos } from "../../db/schema/videos.js";
import {
  getMultipleRecordsByAColumnValue,
  getSingleRecordByAColumnValue,
  saveSingleRecord,
  updateRecordByColumnValue,
} from "../../services/db/baseDbService.js";
import { httpGet } from "../../services/http.js";

const ISO_DURATION_REGEX = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
const TRAILING_ZERO_REGEX = /\.0$/;

function parseIsoDuration(iso: string): string {
  const match = ISO_DURATION_REGEX.exec(iso);
  if (!match) {
    return "0:00";
  }

  const hours = match[1] ? Number.parseInt(match[1], 10) : 0;
  const minutes = match[2] ? Number.parseInt(match[2], 10) : 0;
  const seconds = match[3] ? Number.parseInt(match[3], 10) : 0;

  const paddedSeconds = seconds.toString().padStart(2, "0");

  if (hours > 0) {
    const paddedMinutes = minutes.toString().padStart(2, "0");
    return `${hours}:${paddedMinutes}:${paddedSeconds}`;
  }

  return `${minutes}:${paddedSeconds}`;
}

function formatViewCount(count: string): string {
  const num = Number.parseInt(count, 10);

  if (Number.isNaN(num)) {
    return "0";
  }
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1).replace(TRAILING_ZERO_REGEX, "")}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1).replace(TRAILING_ZERO_REGEX, "")}K`;
  }

  return num.toString();
}

async function getUploadPlaylistId(): Promise<string> {
  const url = `${youtubeConfig.baseUrl}/channels?part=contentDetails&id=${youtubeConfig.channelId}&key=${youtubeConfig.apiKey}`;
  const data = await httpGet(url);

  if (!data.items || data.items.length === 0) {
    throw new Error("YouTube channel not found");
  }

  return data.items[0].contentDetails.relatedPlaylists.uploads;
}

async function getAllVideoIds(playlistId: string): Promise<string[]> {
  const videoIds: string[] = [];
  let nextPageToken: string | undefined;

  do {
    let url = `${youtubeConfig.baseUrl}/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50&key=${youtubeConfig.apiKey}`;
    if (nextPageToken) {
      url += `&pageToken=${nextPageToken}`;
    }

    const data = await httpGet(url);

    for (const item of data.items || []) {
      videoIds.push(item.snippet.resourceId.videoId);
    }

    nextPageToken = data.nextPageToken;
  } while (nextPageToken);

  return videoIds;
}

// ── Category keyword mapping for auto-categorization ──────────
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  "political-news": ["రాజకీయ", "political", "politics", "minister", "mla", "mp", "tdp", "ysrcp", "ycp", "jagan", "chandrababu", "naidu", "bjp", "congress", "election", "ఎన్నిక", "మంత్రి", "ప్రభుత్వ", "government", "party"],
  "entertainment": ["వినోద", "entertainment", "cinema", "movie", "song", "సినిమా", "పాట", "actor", "actress", "tollywood", "బాలీవుడ్", "celebrity"],
  "devotional": ["భక్తి", "devotional", "temple", "god", "prayer", "దేవుడు", "గుడి", "పూజ", "ఆలయ", "festival", "పండుగ", "దర్శన", "darshan", "lord"],
  "sports": ["క్రీడ", "sports", "cricket", "క్రికెట్", "football", "kabaddi", "ipl", "match", "player", "tournament"],
  "local-news": ["ongole", "ఒంగోలు", "prakasam", "ప్రకాశం", "singarayakonda", "సింగరాయకొండ", "markapur", "మార్కాపురం", "chirala", "చీరాల", "kandukur", "కందుకూరు", "darsi", "దర్శి", "addanki", "అద్దంకి", "giddalur", "గిద్దలూరు"],
};

function detectCategorySlug(title: string, description: string): string {
  const text = `${title} ${description}`.toLowerCase();

  // Check local news first (most specific)
  for (const keyword of CATEGORY_KEYWORDS["local-news"]) {
    if (text.includes(keyword.toLowerCase())) {
      return "local-news";
    }
  }

  // Check other categories
  for (const [slug, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (slug === "local-news")
      continue;
    for (const keyword of keywords) {
      if (text.includes(keyword.toLowerCase())) {
        return slug;
      }
    }
  }

  return "general-news";
}

interface YouTubeVideoDetail {
  youtubeId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  duration: string;
  viewCount: string;
  publishedAt: Date;
}

async function getVideoDetails(videoIds: string[]): Promise<YouTubeVideoDetail[]> {
  const details: YouTubeVideoDetail[] = [];

  for (let i = 0; i < videoIds.length; i += 50) {
    const batch = videoIds.slice(i, i + 50);
    const ids = batch.join(",");
    const url = `${youtubeConfig.baseUrl}/videos?part=snippet,contentDetails,statistics&id=${ids}&key=${youtubeConfig.apiKey}`;
    const data = await httpGet(url);

    for (const item of data.items || []) {
      details.push({
        youtubeId: item.id,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnailUrl: item.snippet.thumbnails?.high?.url || `https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`,
        duration: parseIsoDuration(item.contentDetails.duration),
        viewCount: formatViewCount(item.statistics.viewCount || "0"),
        publishedAt: new Date(item.snippet.publishedAt),
      });
    }
  }

  return details;
}

async function syncYouTubeVideos(): Promise<{ newVideos: number; updatedVideos: number; totalVideos: number }> {
  const uploadPlaylistId = await getUploadPlaylistId();
  const videoIds = await getAllVideoIds(uploadPlaylistId);
  const videoDetails = await getVideoDetails(videoIds);

  // Load all active categories to build slug → id map
  const allCategories = await getMultipleRecordsByAColumnValue<Category>(
    categories,
    "is_active",
    true,
    "eq",
  ) as Category[];
  const categorySlugMap = new Map<string, number>();
  for (const cat of allCategories) {
    categorySlugMap.set(cat.slug, cat.id);
  }

  let newVideos = 0;
  let updatedVideos = 0;

  for (const detail of videoDetails) {
    const categorySlug = detectCategorySlug(detail.title, detail.description);
    const categoryId = categorySlugMap.get(categorySlug) || categorySlugMap.get("general-news");

    const existing = await getSingleRecordByAColumnValue<Video>(
      videos,
      "youtube_id",
      detail.youtubeId,
      "eq",
    );

    if (existing) {
      await updateRecordByColumnValue<Video>(
        videos,
        "youtube_id",
        detail.youtubeId,
        {
          title: detail.title,
          description: detail.description,
          thumbnail_url: detail.thumbnailUrl,
          view_count: detail.viewCount,
          duration: detail.duration,
          category_id: existing.category_id || categoryId,
        },
      );
      updatedVideos++;
    }
    else {
      await saveSingleRecord<Video>(videos, {
        youtube_id: detail.youtubeId,
        title: detail.title,
        description: detail.description,
        thumbnail_url: detail.thumbnailUrl,
        duration: detail.duration,
        view_count: detail.viewCount,
        published_at: detail.publishedAt,
        category_id: categoryId,
      });
      newVideos++;
    }
  }

  // Auto-set featured: top 6 most recent videos with most views
  await db.execute(sql`UPDATE videos SET is_featured = false WHERE is_featured = true`);
  await db.execute(sql`
    UPDATE videos SET is_featured = true
    WHERE id IN (
      SELECT id FROM videos WHERE is_active = true
      ORDER BY published_at DESC LIMIT 6
    )
  `);

  // Auto-set trending: top 6 videos by view count
  await db.execute(sql`UPDATE videos SET is_trending = false WHERE is_trending = true`);
  await db.execute(sql`
    UPDATE videos SET is_trending = true
    WHERE id IN (
      SELECT id FROM videos WHERE is_active = true
      ORDER BY
        CASE WHEN view_count ~ '^[0-9.]+[KMB]?$' THEN
          CASE
            WHEN view_count LIKE '%M' THEN CAST(REPLACE(view_count, 'M', '') AS FLOAT) * 1000000
            WHEN view_count LIKE '%K' THEN CAST(REPLACE(view_count, 'K', '') AS FLOAT) * 1000
            ELSE CAST(view_count AS FLOAT)
          END
        ELSE 0 END DESC
      LIMIT 6
    )
  `);

  // Update category video counts
  const categoryCounts = await db
    .select({ category_id: videos.category_id, total: count() })
    .from(videos)
    .where(eq(videos.is_active, true))
    .groupBy(videos.category_id);

  // Reset all counts to 0 first
  await db.execute(sql`UPDATE categories SET video_count = 0`);

  for (const cc of categoryCounts) {
    if (cc.category_id) {
      await db.update(categories)
        .set({ video_count: cc.total })
        .where(eq(categories.id, cc.category_id));
    }
  }

  return {
    newVideos,
    updatedVideos,
    totalVideos: videoDetails.length,
  };
}

// ── Sync status tracking ──────────────────────────────────────
interface SyncStatusData {
  is_syncing: boolean;
  last_sync_at: string | null;
  last_result: { newVideos: number; updatedVideos: number; totalVideos: number } | null;
  last_error: string | null;
}

const syncStatus: SyncStatusData = {
  is_syncing: false,
  last_sync_at: null,
  last_result: null,
  last_error: null,
};

function getSyncStatus(): SyncStatusData {
  return { ...syncStatus };
}

function triggerManualSync(): void {
  if (syncStatus.is_syncing)
    return;
  syncStatus.is_syncing = true;

  syncYouTubeVideos()
    .then((result) => {
      syncStatus.last_result = result;
      syncStatus.last_sync_at = new Date().toISOString();
      syncStatus.last_error = null;
      // eslint-disable-next-line no-console
      console.log(`[Manual-Sync] YouTube sync completed: ${result.newVideos} new, ${result.updatedVideos} updated`);
    })
    .catch((err: Error) => {
      syncStatus.last_error = err.message;
      console.error("[Manual-Sync] YouTube sync failed:", err);
    })
    .finally(() => {
      syncStatus.is_syncing = false;
    });
}

export {
  formatViewCount,
  getSyncStatus,
  parseIsoDuration,
  syncYouTubeVideos,
  triggerManualSync,
};
