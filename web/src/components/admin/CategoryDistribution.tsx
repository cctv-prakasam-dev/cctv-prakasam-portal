interface CategoryItem {
  id: number;
  name: string;
  color: string | null;
  icon: string | null;
  video_count: number;
}

interface CategoryDistributionProps {
  data: CategoryItem[];
  isLoading?: boolean;
}

export default function CategoryDistribution({ data, isLoading }: CategoryDistributionProps) {
  const maxCount = Math.max(...data.map(c => c.video_count), 1);

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-2">
        <span className="text-base">📊</span>
        <h3 className="font-[var(--font-display)] text-sm uppercase tracking-[1.5px] text-[var(--color-text-primary)]">
          TOP CATEGORIES
        </h3>
      </div>

      {isLoading
        ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-8 animate-pulse rounded-lg bg-[var(--color-surface-1)]" />
              ))}
            </div>
          )
        : data.length === 0
          ? (
              <p className="text-center text-sm text-[var(--color-text-muted)]">No categories found</p>
            )
          : (
              <div className="space-y-2.5">
                {data.map(cat => (
                  <div key={cat.id} className="group">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="flex items-center gap-1.5 font-[var(--font-heading)] text-[12px] font-semibold text-[var(--color-text-primary)]">
                        {cat.icon && <span className="text-sm">{cat.icon}</span>}
                        {cat.name}
                      </span>
                      <span className="font-[var(--font-mono)] text-[11px] font-bold" style={{ color: cat.color || "var(--color-primary)" }}>
                        {cat.video_count}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-[var(--color-surface-1)]">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${(cat.video_count / maxCount) * 100}%`,
                          backgroundColor: cat.color || "var(--color-primary)",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
    </div>
  );
}
