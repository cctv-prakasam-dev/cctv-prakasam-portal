import { useQuery } from "@tanstack/react-query";

import { apiGet } from "@/lib/apiClient";

interface DashboardStats {
  videos: number;
  users: number;
  newsletter_subscribers: number;
  breaking_news: number;
  weekly_videos: { day: string; count: number }[];
  youtube_subscribers: number;
}

export function useAdminDashboardStats() {
  return useQuery({
    queryKey: ["admin", "dashboard-stats"],
    queryFn: () => apiGet<DashboardStats>("/admin/dashboard/stats"),
  });
}
