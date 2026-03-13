import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiGet, apiPut } from "@/lib/apiClient";

export interface Setting {
  id: number;
  key: string;
  value: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export function useAdminSettings() {
  return useQuery({
    queryKey: ["admin", "settings"],
    queryFn: () => apiGet<Setting[]>("/admin/settings"),
  });
}

export function useUpdateSetting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }: { id: number; value: string }) =>
      apiPut(`/admin/settings/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "settings"] });
    },
  });
}
