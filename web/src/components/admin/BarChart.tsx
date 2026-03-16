interface BarChartItem {
  label: string;
  value: number;
  color: string;
}

interface BarChartProps {
  title: string;
  data: BarChartItem[];
}

export default function BarChart({ title, data }: BarChartProps) {
  const maxValue = Math.max(...data.map(d => d.value), 1);
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="font-[var(--font-display)] text-sm uppercase tracking-[1.5px] text-[var(--color-text-primary)]">
            {title}
          </h3>
          <p className="mt-0.5 font-[var(--font-body)] text-[11px] text-[var(--color-text-muted)]">
            {total}
            {" "}
            videos this week
          </p>
        </div>
        <div className="flex h-9 items-center rounded-lg bg-[var(--color-surface-2)] px-3">
          <span className="font-[var(--font-display)] text-lg text-[var(--color-primary)]">{total}</span>
        </div>
      </div>

      <div className="flex items-end gap-2.5">
        {data.map((item) => {
          const barHeight = Math.max((item.value / maxValue) * 140, 6);
          return (
            <div key={item.label} className="group flex flex-1 flex-col items-center gap-1.5">
              {/* Value label */}
              <span className="font-[var(--font-mono)] text-[11px] font-semibold text-[var(--color-text-muted)] opacity-0 transition-opacity group-hover:opacity-100">
                {item.value}
              </span>

              {/* Bar */}
              <div className="relative w-full">
                <div
                  className="mx-auto w-[70%] rounded-lg transition-all duration-500 ease-out group-hover:w-[85%] group-hover:opacity-90"
                  style={{
                    height: `${barHeight}px`,
                    background: `linear-gradient(to top, ${item.color}, ${item.color}bb)`,
                    boxShadow: item.value > 0 ? `0 4px 12px ${item.color}30` : "none",
                  }}
                />
              </div>

              {/* Day label */}
              <span className="font-[var(--font-heading)] text-[10px] font-semibold text-[var(--color-text-muted)]">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
