import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiDelete, apiGet } from "@/lib/apiClient";

export interface NewsletterSubscriber {
  id: number;
  email: string;
  status?: string;
  created_at?: string;
  subscribed_at?: string;
  unsubscribed_at?: string;
}

interface PaginatedSubscribers {
  pagination_info: {
    total_records: number;
    total_pages: number;
    page_size: number;
    current_page: number;
    next_page: number | null;
    prev_page: number | null;
  };
  records: NewsletterSubscriber[];
}

interface UseAdminNewsletterParams {
  page?: number;
  limit?: number;
}

export function useAdminNewsletter(params: UseAdminNewsletterParams = {}) {
  const searchParams = new URLSearchParams();
  if (params.page)
    searchParams.set("page", String(params.page));
  if (params.limit)
    searchParams.set("limit", String(params.limit));

  const query = searchParams.toString();

  return useQuery({
    queryKey: ["admin", "newsletter", params],
    queryFn: () => apiGet<PaginatedSubscribers>(`/admin/newsletter${query ? `?${query}` : ""}`),
  });
}

export function useDeleteSubscriber() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiDelete(`/admin/newsletter/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "newsletter"] });
    },
  });
}
