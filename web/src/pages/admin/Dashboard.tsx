import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { Activity, Clock, Eye, Mail, Megaphone, TrendingUp, Users, Video, Youtube } from "lucide-react";

import BarChart from "@/components/admin/BarChart";
import StatsCard from "@/components/admin/StatsCard";
import { useAdminDashboardStats } from "@/hooks/useAdminDashboard";

export default function Dashboard() {
  const { data: statsResp, isLoading, isError } = useAdminDashboardStats();
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

  if (isError) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="font-[var(--font-body)] text-[var(--color-text-muted)]">Failed to load dashboard data. Please try again later.</p>
      </div>
    );
  }

  const quickStats = [
    { icon: Video, text: "Total videos synced", value: stats?.videos ?? 0, color: "#0891B2", bg: "bg-cyan-50 dark:bg-cyan-900/20", to: "/admin/videos" },
    { icon: Users, text: "Registered users", value: stats?.users ?? 0, color: "#6D28D9", bg: "bg-violet-50 dark:bg-violet-900/20", to: "/admin/users" },
    { icon: Mail, text: "Newsletter subscribers", value: stats?.newsletter_subscribers ?? 0, color: "#DB2777", bg: "bg-pink-50 dark:bg-pink-900/20", to: "/admin/newsletter" },
    { icon: Megaphone, text: "Breaking news items", value: stats?.breaking_news ?? 0, color: "#D97706", bg: "bg-amber-50 dark:bg-amber-900/20", to: "/admin/breaking-news" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-7">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#0891B2] to-[#06B6D4] text-white shadow-md">
            <Activity size={20} />
          </div>
          <div>
            <h1 className="font-[var(--font-display)] text-2xl tracking-[2px] text-[var(--color-text-primary)]">
              DASHBOARD
            </h1>
            <p className="font-[var(--font-body)] text-[12px] text-[var(--color-text-muted)]">
              Real-time overview of your CCTV AP Prakasam portal
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mb-6 grid grid-cols-1 gap-4 min-[500px]:grid-cols-2 min-[1100px]:grid-cols-5">
        <StatsCard
          title="Total Videos"
          value={isLoading ? "..." : (stats?.videos ?? 0).toLocaleString()}
          icon={Video}
          color="#0891B2"
          gradient="linear-gradient(135deg, #0891B2, #06B6D4)"
          to="/admin/videos"
        />
        <StatsCard
          title="YT Subscribers"
          value={isLoading ? "..." : (stats?.youtube_subscribers ?? 0).toLocaleString()}
          icon={Youtube}
          color="#DC2626"
          gradient="linear-gradient(135deg, #DC2626, #EF4444)"
          to="/admin/videos"
        />
        <StatsCard
          title="Total Users"
          value={isLoading ? "..." : (stats?.users ?? 0).toLocaleString()}
          icon={Users}
          color="#6D28D9"
          gradient="linear-gradient(135deg, #6D28D9, #8B5CF6)"
          to="/admin/users"
        />
        <StatsCard
          title="Newsletter"
          value={isLoading ? "..." : (stats?.newsletter_subscribers ?? 0).toLocaleString()}
          icon={Mail}
          color="#DB2777"
          gradient="linear-gradient(135deg, #DB2777, #EC4899)"
          to="/admin/newsletter"
        />
        <StatsCard
          title="Breaking News"
          value={isLoading ? "..." : (stats?.breaking_news ?? 0).toLocaleString()}
          icon={Megaphone}
          color="#D97706"
          gradient="linear-gradient(135deg, #D97706, #F59E0B)"
          to="/admin/breaking-news"
        />
      </div>

      {/* Charts Row */}
      <div className="mb-6 grid grid-cols-1 gap-4 min-[900px]:grid-cols-[1.2fr_1fr]">
        <BarChart title="VIDEOS PUBLISHED THIS WEEK" data={chartData} />

        {/* Quick Stats Panel */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <Eye size={16} className="text-[var(--color-primary)]" />
            <h3 className="font-[var(--font-display)] text-sm uppercase tracking-[1.5px] text-[var(--color-text-primary)]">
              QUICK OVERVIEW
            </h3>
          </div>
          <div className="space-y-2.5">
            {quickStats.map(item => (
              <Link
                key={item.text}
                to={item.to}
                className={`flex cursor-pointer items-center gap-3.5 rounded-xl px-4 py-3.5 no-underline transition-all hover:scale-[1.02] hover:shadow-sm ${item.bg}`}
              >
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${item.color}20`, color: item.color }}
                >
                  <item.icon size={16} />
                </div>
                <div className="flex-1">
                  <p className="font-[var(--font-display)] text-lg leading-none text-[var(--color-text-primary)]">
                    {item.value.toLocaleString()}
                  </p>
                  <p className="mt-0.5 font-[var(--font-body)] text-[11px] text-[var(--color-text-muted)]">
                    {item.text}
                  </p>
                </div>
                <TrendingUp size={14} style={{ color: item.color }} className="opacity-40" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Timeline / Recent Info */}
      <div className="grid grid-cols-1 gap-4 min-[900px]:grid-cols-2">
        {/* Sync Status */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Clock size={16} className="text-[var(--color-primary)]" />
            <h3 className="font-[var(--font-display)] text-sm uppercase tracking-[1.5px] text-[var(--color-text-primary)]">
              SYSTEM INFO
            </h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-xl bg-[var(--color-surface-1)] px-4 py-3">
              <span className="font-[var(--font-body)] text-[12px] text-[var(--color-text-secondary)]">YouTube Auto-Sync</span>
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400">
                <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                Active (30 min)
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-[var(--color-surface-1)] px-4 py-3">
              <span className="font-[var(--font-body)] text-[12px] text-[var(--color-text-secondary)]">Categories</span>
              <span className="font-[var(--font-heading)] text-[11px] font-semibold text-[var(--color-primary)]">Auto-detected</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-[var(--color-surface-1)] px-4 py-3">
              <span className="font-[var(--font-body)] text-[12px] text-[var(--color-text-secondary)]">Featured Videos</span>
              <span className="font-[var(--font-heading)] text-[11px] font-semibold text-[var(--color-primary)]">Top 6 latest</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-[var(--color-surface-1)] px-4 py-3">
              <span className="font-[var(--font-body)] text-[12px] text-[var(--color-text-secondary)]">Trending Videos</span>
              <span className="font-[var(--font-heading)] text-[11px] font-semibold text-[var(--color-primary)]">Top 6 by views</span>
            </div>
          </div>
        </div>

        {/* Platform Summary */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Youtube size={16} className="text-red-500" />
            <h3 className="font-[var(--font-display)] text-sm uppercase tracking-[1.5px] text-[var(--color-text-primary)]">
              CHANNEL HIGHLIGHTS
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Link to="/admin/videos" className="rounded-xl bg-gradient-to-br from-cyan-50 to-sky-50 p-4 text-center no-underline transition-all hover:scale-[1.03] hover:shadow-sm dark:from-cyan-900/20 dark:to-sky-900/20">
              <p className="font-[var(--font-display)] text-2xl text-[#0891B2]">{isLoading ? "..." : (stats?.videos ?? 0).toLocaleString()}</p>
              <p className="mt-0.5 font-[var(--font-body)] text-[10px] text-[var(--color-text-muted)]">Total Videos</p>
            </Link>
            <Link to="/admin/videos" className="rounded-xl bg-gradient-to-br from-red-50 to-pink-50 p-4 text-center no-underline transition-all hover:scale-[1.03] hover:shadow-sm dark:from-red-900/20 dark:to-pink-900/20">
              <p className="font-[var(--font-display)] text-2xl text-[#DC2626]">{isLoading ? "..." : (stats?.youtube_subscribers ?? 0).toLocaleString()}</p>
              <p className="mt-0.5 font-[var(--font-body)] text-[10px] text-[var(--color-text-muted)]">Subscribers</p>
            </Link>
            <Link to="/admin/users" className="rounded-xl bg-gradient-to-br from-violet-50 to-purple-50 p-4 text-center no-underline transition-all hover:scale-[1.03] hover:shadow-sm dark:from-violet-900/20 dark:to-purple-900/20">
              <p className="font-[var(--font-display)] text-2xl text-[#6D28D9]">{isLoading ? "..." : (stats?.users ?? 0).toLocaleString()}</p>
              <p className="mt-0.5 font-[var(--font-body)] text-[10px] text-[var(--color-text-muted)]">Users</p>
            </Link>
            <Link to="/admin/breaking-news" className="rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 p-4 text-center no-underline transition-all hover:scale-[1.03] hover:shadow-sm dark:from-amber-900/20 dark:to-orange-900/20">
              <p className="font-[var(--font-display)] text-2xl text-[#D97706]">{isLoading ? "..." : (stats?.breaking_news ?? 0).toLocaleString()}</p>
              <p className="mt-0.5 font-[var(--font-body)] text-[10px] text-[var(--color-text-muted)]">Breaking News</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
