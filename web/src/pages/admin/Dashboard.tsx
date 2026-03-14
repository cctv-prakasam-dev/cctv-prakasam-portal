import { useMemo } from "react";
import { Mail, Megaphone, Users, Video, Youtube } from "lucide-react";

import BarChart from "@/components/admin/BarChart";
import StatsCard from "@/components/admin/StatsCard";
import { useAdminDashboardStats } from "@/hooks/useAdminDashboard";

export default function Dashboard() {
  const { data: statsResp, isLoading } = useAdminDashboardStats();
  const stats = statsResp?.data;

  const chartData = useMemo(() => {
    const weeklyVideos = stats?.weekly_videos as { day: string; count: number }[] | undefined;
    if (!weeklyVideos || weeklyVideos.length === 0) {
      return [
        { label: "Mon", value: 0, color: "#0891B2" },
        { label: "Tue", value: 0, color: "#0891B2" },
        { label: "Wed", value: 0, color: "#0891B2" },
        { label: "Thu", value: 0, color: "#0891B2" },
        { label: "Fri", value: 0, color: "#0891B2" },
        { label: "Sat", value: 0, color: "#22D3EE" },
        { label: "Sun", value: 0, color: "#22D3EE" },
      ];
    }

    const dayOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const dayMap = new Map<string, number>();
    for (const item of weeklyVideos) {
      dayMap.set(item.day.trim(), item.count);
    }

    return dayOrder.map(day => ({
      label: day,
      value: dayMap.get(day) ?? 0,
      color: day === "Sat" || day === "Sun" ? "#22D3EE" : "#0891B2",
    }));
  }, [stats]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-[var(--font-display)] text-2xl tracking-[2px] text-[var(--color-text-primary)]">
          DASHBOARD
        </h1>
        <p className="mt-1 font-[var(--font-body)] text-sm text-[var(--color-text-muted)]">
          Overview of your CCTV AP Prakasam portal
        </p>
      </div>

      {/* Stats Grid */}
      <div className="mb-6 grid grid-cols-1 gap-4 min-[600px]:grid-cols-2 min-[1200px]:grid-cols-5">
        <StatsCard
          title="Total Videos"
          value={isLoading ? "..." : stats?.videos ?? 0}
          icon={Video}
          color="#0891B2"
        />
        <StatsCard
          title="YT Subscribers"
          value={isLoading ? "..." : (stats?.youtube_subscribers ?? 0).toLocaleString()}
          icon={Youtube}
          color="#DC2626"
        />
        <StatsCard
          title="Total Users"
          value={isLoading ? "..." : stats?.users ?? 0}
          icon={Users}
          color="#6D28D9"
        />
        <StatsCard
          title="Newsletter"
          value={isLoading ? "..." : stats?.newsletter_subscribers ?? 0}
          icon={Mail}
          color="#DB2777"
        />
        <StatsCard
          title="Breaking News"
          value={isLoading ? "..." : stats?.breaking_news ?? 0}
          icon={Megaphone}
          color="#D97706"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 min-[900px]:grid-cols-2">
        <BarChart title="VIDEOS PUBLISHED THIS WEEK" data={chartData} />
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 shadow-sm">
          <h3 className="mb-4 font-[var(--font-display)] text-sm uppercase tracking-[1px] text-[var(--color-text-primary)]">
            QUICK STATS
          </h3>
          <div className="space-y-3">
            {[
              { text: `${stats?.videos ?? 0} total videos synced`, label: "Videos", color: "#0891B2" },
              { text: `${stats?.users ?? 0} registered users`, label: "Users", color: "#6D28D9" },
              { text: `${stats?.newsletter_subscribers ?? 0} newsletter subscribers`, label: "Newsletter", color: "#DB2777" },
              { text: `${stats?.breaking_news ?? 0} breaking news items`, label: "Breaking News", color: "#D97706" },
            ].map(item => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-lg border border-[var(--color-border)] px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-[var(--font-body)] text-sm text-[var(--color-text-secondary)]">
                    {item.text}
                  </span>
                </div>
                <span className="font-[var(--font-heading)] text-[10px] font-bold uppercase tracking-wide text-[var(--color-text-muted)]">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
