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

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 shadow-sm">
      <h3 className="mb-4 font-[var(--font-display)] text-sm uppercase tracking-[1px] text-[var(--color-text-primary)]">
        {title}
      </h3>
      <div className="flex items-end gap-3">
        {data.map(item => (
          <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
            <span className="font-[var(--font-mono)] text-xs text-[var(--color-text-muted)]">
              {item.value}
            </span>
            <div
              className="w-full rounded-t-md transition-all"
              style={{
                height: `${(item.value / maxValue) * 120}px`,
                backgroundColor: item.color,
                minHeight: "4px",
              }}
            />
            <span className="text-center font-[var(--font-body)] text-[10px] text-[var(--color-text-muted)]">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
