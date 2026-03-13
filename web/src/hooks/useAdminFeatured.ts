import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiDelete, apiGet, apiPost, apiPut } from "@/lib/apiClient";

export interface FeaturedContentItem {
  id: number;
  type: string;
  video_id?: number;
  title?: string;
  is_active?: boolean;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
}

export function useAdminFeatured() {
  return useQuery({
    queryKey: ["admin", "featured-content"],
    queryFn: () => apiGet<FeaturedContentItem[]>("/featured-content"),
  });
}

export function useCreateFeatured() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<FeaturedContentItem>) =>
      apiPost("/admin/featured-content", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "featured-content"] });
    },
  });
}

export function useUpdateFeatured() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }: Partial<FeaturedContentItem> & { id: number }) =>
      apiPut(`/admin/featured-content/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "featured-content"] });
    },
  });
}

export function useDeleteFeatured() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiDelete(`/admin/featured-content/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "featured-content"] });
    },
  });
}
