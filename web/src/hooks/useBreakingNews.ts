import { useQuery } from "@tanstack/react-query";

import { apiGet } from "@/lib/apiClient";

interface BreakingNewsItem {
  id: number;
  text: string;
  text_te?: string;
  is_active?: boolean;
  sort_order?: number;
}

export function useBreakingNews() {
  return useQuery({
    queryKey: ["breaking-news"],
    queryFn: () => apiGet<BreakingNewsItem[]>("/breaking-news"),
    refetchInterval: 1000 * 60 * 2, // Refresh every 2 minutes
  });
}
