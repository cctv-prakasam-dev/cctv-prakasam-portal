import { useQuery } from "@tanstack/react-query";

import { apiGet } from "@/lib/apiClient";

export interface Video {
  id: number;
  youtube_id: string;
  title: string;
  title_te?: string;
  description?: string;
  category_id?: number;
  thumbnail_url?: string;
  duration?: string;
  view_count?: string;
  published_at?: string;
  is_featured?: boolean;
  is_trending?: boolean;
  is_active?: boolean;
  created_at?: string;
  category_name?: string;
  category_color?: string;
}

interface PaginatedVideos {
  pagination_info: {
    total_records: number;
    total_pages: number;
    page_size: number;
    current_page: number;
    next_page: number | null;
    prev_page: number | null;
  };
  records: Video[];
}

interface UseVideosParams {
  category?: string;
  page?: number;
  page_size?: number;
  sort?: string;
}

export function useVideos(params: UseVideosParams = {}) {
  const searchParams = new URLSearchParams();
  if (params.category)
    searchParams.set("category", params.category);
  if (params.page)
    searchParams.set("page", String(params.page));
  if (params.page_size)
    searchParams.set("page_size", String(params.page_size));
  if (params.sort)
    searchParams.set("sort", params.sort);

  const query = searchParams.toString();

  return useQuery({
    queryKey: ["videos", params],
    queryFn: () => apiGet<PaginatedVideos>(`/videos${query ? `?${query}` : ""}`),
  });
}

export function useVideo(id: number | string) {
  return useQuery({
    queryKey: ["video", id],
    queryFn: () => apiGet<Video>(`/videos/${id}`),
    enabled: !!id,
  });
}

export function useFeaturedVideos() {
  return useQuery({
    queryKey: ["videos", "featured"],
    queryFn: () => apiGet<Video[]>("/videos/featured"),
  });
}

export function useTrendingVideos() {
  return useQuery({
    queryKey: ["videos", "trending"],
    queryFn: () => apiGet<Video[]>("/videos/trending"),
  });
}
