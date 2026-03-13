import { Mail, Megaphone, Users, Video } from "lucide-react";

import BarChart from "@/components/admin/BarChart";
import StatsCard from "@/components/admin/StatsCard";
import { useAdminDashboardStats } from "@/hooks/useAdminDashboard";

const chartData = [
  { label: "Mon", value: 120, color: "#0891B2" },
  { label: "Tue", value: 180, color: "#0891B2" },
  { label: "Wed", value: 90, color: "#0891B2" },
  { label: "Thu", value: 240, color: "#0891B2" },
  { label: "Fri", value: 160, color: "#0891B2" },
  { label: "Sat", value: 300, color: "#22D3EE" },
  { label: "Sun", value: 280, color: "#22D3EE" },
];

export default function Dashboard() {
  const { data: statsResp, isLoading } = useAdminDashboardStats();
  const stats = statsResp?.data;

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-[var(--font-display)] text-2xl tracking-[2px] text-[var(--color-text-primary)]">
          DASHBOARD
        </h1>
        <p className="mt-1 font-[var(--font-body)] text-sm text-[var(--color-text-muted)]">
          Overview of your CCTV Prakasam portal
        </p>
      </div>

      {/* Stats Grid */}
      <div className="mb-6 grid grid-cols-1 gap-4 min-[600px]:grid-cols-2 min-[1000px]:grid-cols-4">
        <StatsCard
          title="Total Videos"
          value={isLoading ? "..." : stats?.videos ?? 0}
          icon={Video}
          color="#0891B2"
        />
        <StatsCard
          title="Total Users"
          value={isLoading ? "..." : stats?.users ?? 0}
          icon={Users}
          color="#6D28D9"
        />
        <StatsCard
          title="Subscribers"
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
        <BarChart title="VIEWS THIS WEEK" data={chartData} />
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 shadow-sm">
          <h3 className="mb-4 font-[var(--font-display)] text-sm uppercase tracking-[1px] text-[var(--color-text-primary)]">
            RECENT ACTIVITY
          </h3>
          <div className="space-y-3">
            {[
              { text: "New video published", time: "2 hours ago", color: "#0891B2" },
              { text: "User registered", time: "5 hours ago", color: "#6D28D9" },
              { text: "Newsletter subscriber", time: "1 day ago", color: "#DB2777" },
              { text: "Breaking news updated", time: "2 days ago", color: "#D97706" },
            ].map(item => (
              <div
                key={item.text}
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
                <span className="font-[var(--font-body)] text-xs text-[var(--color-text-muted)]">
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
