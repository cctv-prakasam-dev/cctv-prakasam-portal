import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiDelete, apiGet, apiPost, apiPut } from "@/lib/apiClient";

export interface BreakingNewsItem {
  id: number;
  text: string;
  text_te?: string;
  is_active?: boolean;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
}

export function useAdminBreakingNews() {
  return useQuery({
    queryKey: ["admin", "breaking-news"],
    queryFn: () => apiGet<BreakingNewsItem[]>("/breaking-news"),
  });
}

export function useCreateBreakingNews() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<BreakingNewsItem>) =>
      apiPost("/admin/breaking-news", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "breaking-news"] });
      queryClient.invalidateQueries({ queryKey: ["breaking-news"] });
    },
  });
}

export function useUpdateBreakingNews() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }: Partial<BreakingNewsItem> & { id: number }) =>
      apiPut(`/admin/breaking-news/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "breaking-news"] });
      queryClient.invalidateQueries({ queryKey: ["breaking-news"] });
    },
  });
}

export function useDeleteBreakingNews() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiDelete(`/admin/breaking-news/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "breaking-news"] });
      queryClient.invalidateQueries({ queryKey: ["breaking-news"] });
    },
  });
}
