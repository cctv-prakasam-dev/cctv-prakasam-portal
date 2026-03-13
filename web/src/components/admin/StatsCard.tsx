import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  change?: string;
}

export default function StatsCard({ title, value, icon: Icon, color, change }: StatsCardProps) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-[var(--font-heading)] text-[11px] font-bold uppercase tracking-[1px] text-[var(--color-text-muted)]">
            {title}
          </p>
          <p className="mt-2 font-[var(--font-display)] text-[28px] text-[var(--color-text-primary)]">
            {value}
          </p>
          {change && (
            <p className="mt-1 font-[var(--font-body)] text-xs text-[var(--color-success)]">
              {change}
            </p>
          )}
        </div>
        <div
          className="flex h-10 w-10 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${color}15`, color }}
        >
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}
