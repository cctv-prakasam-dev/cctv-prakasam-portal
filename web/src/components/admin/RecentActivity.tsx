import { timeAgo } from "@/lib/format";

interface ActivityItem {
  type: string;
  title: string | null;
  detail: string | null;
  created_at: string | null;
}

interface RecentActivityProps {
  data: ActivityItem[];
  isLoading: boolean;
}

const activityConfig: Record<string, { label: string; color: string }> = {
  video_published: { label: "Video published", color: "#0891B2" },
  subscriber: { label: "Subscriber", color: "#6D28D9" },
  new_user: { label: "New user", color: "#059669" },
  category_added: { label: "Category added", color: "#D97706" },
};

export default function RecentActivity({ data, isLoading }: RecentActivityProps) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-sm">
      <h3 className="mb-4 font-[var(--font-display)] text-sm uppercase tracking-[1.5px] text-[var(--color-text-primary)]">
        RECENT ACTIVITY
      </h3>

      {isLoading
        ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between py-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-[var(--color-border)]" />
                    <div>
                      <div className="mb-1 h-3 w-24 animate-pulse rounded bg-[var(--color-border)]" />
                      <div className="h-2.5 w-32 animate-pulse rounded bg-[var(--color-border)]" />
                    </div>
                  </div>
                  <div className="h-2.5 w-8 animate-pulse rounded bg-[var(--color-border)]" />
                </div>
              ))}
            </div>
          )
        : data.length === 0
          ? (
              <p className="py-6 text-center font-[var(--font-body)] text-xs text-[var(--color-text-muted)]">No recent activity</p>
            )
          : (
              <div>
                {data.map((item, i) => {
                  const config = activityConfig[item.type] ?? { label: item.type, color: "#64748B" };
                  return (
                    <div
                      key={`${item.type}-${item.created_at}-${i}`}
                      className="flex items-center justify-between border-b border-[var(--color-border)] py-2.5 last:border-b-0"
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className="h-[7px] w-[7px] shrink-0 rounded-full"
                          style={{ backgroundColor: config.color }}
                        />
                        <div className="min-w-0">
                          <div className="font-[var(--font-heading)] text-[12px] font-semibold text-[var(--color-text-primary)]">
                            {config.label}
                          </div>
                          <div className="truncate font-[var(--font-body)] text-[11px] text-[var(--color-text-muted)]">
                            {item.detail || item.title || "—"}
                          </div>
                        </div>
                      </div>
                      <span className="shrink-0 pl-3 font-[var(--font-mono)] text-[10px] text-[var(--color-text-muted)]">
                        {item.created_at ? timeAgo(item.created_at) : "—"}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
    </div>
  );
}
