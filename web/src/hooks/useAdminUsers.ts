import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiGet, apiPut } from "@/lib/apiClient";

export interface AdminUser {
  id: number;
  customer_id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  user_type: string;
  active?: boolean;
  is_verified?: boolean;
  created_at?: string;
}

interface PaginatedUsers {
  pagination_info: {
    total_records: number;
    total_pages: number;
    page_size: number;
    current_page: number;
    next_page: number | null;
    prev_page: number | null;
  };
  records: AdminUser[];
}

interface UseAdminUsersParams {
  page?: number;
  page_size?: number;
  sort?: string;
}

export function useAdminUsers(params: UseAdminUsersParams = {}) {
  const searchParams = new URLSearchParams();
  if (params.page)
    searchParams.set("page", String(params.page));
  if (params.page_size)
    searchParams.set("page_size", String(params.page_size));
  if (params.sort)
    searchParams.set("sort", params.sort);

  const query = searchParams.toString();

  return useQuery({
    queryKey: ["admin", "users", params],
    queryFn: () => apiGet<PaginatedUsers>(`/admin/dashboard/users${query ? `?${query}` : ""}`),
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, user_type }: { id: number; user_type: string }) =>
      apiPut(`/admin/dashboard/users/${id}`, { user_type }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}
