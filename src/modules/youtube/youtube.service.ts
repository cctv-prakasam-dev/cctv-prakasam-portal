import type { Video } from "../../db/schema/videos.js";

import { youtubeConfig } from "../../config/youtubeConfig.js";
import { videos } from "../../db/schema/videos.js";
import {
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

  let newVideos = 0;
  let updatedVideos = 0;

  for (const detail of videoDetails) {
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
      });
      newVideos++;
    }
  }

  return {
    newVideos,
    updatedVideos,
    totalVideos: videoDetails.length,
  };
}

export {
  formatViewCount,
  parseIsoDuration,
  syncYouTubeVideos,
};
