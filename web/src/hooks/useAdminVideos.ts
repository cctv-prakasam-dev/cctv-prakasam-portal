import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiDelete, apiGet, apiPost, apiPut } from "@/lib/apiClient";

import type { Video } from "./useVideos";

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

interface UseAdminVideosParams {
  page?: number;
  page_size?: number;
  category?: string;
  sort?: string;
}

export function useAdminVideos(params: UseAdminVideosParams = {}) {
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
    queryKey: ["admin", "videos", params],
    queryFn: () => apiGet<PaginatedVideos>(`/videos${query ? `?${query}` : ""}`),
  });
}

export function useCreateVideo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Video>) =>
      apiPost("/admin/videos", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "videos"] });
      queryClient.invalidateQueries({ queryKey: ["videos"] });
    },
  });
}

export function useUpdateVideo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Video> & { id: number }) =>
      apiPut(`/admin/videos/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "videos"] });
      queryClient.invalidateQueries({ queryKey: ["videos"] });
    },
  });
}

export function useDeleteVideo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiDelete(`/admin/videos/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "videos"] });
      queryClient.invalidateQueries({ queryKey: ["videos"] });
    },
  });
}

export function useSyncYouTubeVideos() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => apiPost("/admin/youtube/sync-youtube"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "videos"] });
      queryClient.invalidateQueries({ queryKey: ["videos"] });
    },
  });
}

interface SyncStatus {
  is_syncing: boolean;
  last_sync_at: string | null;
  last_result: { newVideos: number; updatedVideos: number; totalVideos: number } | null;
  last_error: string | null;
}

export function useSyncStatus(enabled: boolean) {
  return useQuery({
    queryKey: ["admin", "sync-status"],
    queryFn: () => apiGet<SyncStatus>("/admin/youtube/sync-status"),
    refetchInterval: enabled ? 3000 : false,
    enabled,
  });
}
