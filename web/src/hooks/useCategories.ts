import { useQuery } from "@tanstack/react-query";

import { apiGet } from "@/lib/apiClient";

interface Category {
  id: number;
  name: string;
  name_te?: string;
  slug: string;
  icon?: string;
  color?: string;
  video_count?: number;
  sort_order?: number;
  is_active?: boolean;
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => apiGet<Category[]>("/categories"),
  });
}
