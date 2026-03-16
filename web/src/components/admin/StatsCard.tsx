import type { LucideIcon } from "lucide-react";
import { TrendingUp } from "lucide-react";
import { Link } from "@tanstack/react-router";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  gradient: string;
  change?: string;
  to?: string;
}

export default function StatsCard({ title, value, icon: Icon, color, gradient, change, to }: StatsCardProps) {
  const content = (
    <>
      {/* Gradient accent bar */}
      <div
        className="absolute inset-x-0 top-0 h-1 transition-all duration-300 group-hover:h-1.5"
        style={{ background: gradient }}
      />

      {/* Background glow */}
      <div
        className="absolute -right-4 -top-4 h-24 w-24 rounded-full opacity-[0.07] blur-2xl transition-opacity group-hover:opacity-[0.12]"
        style={{ backgroundColor: color }}
      />

      <div className="flex items-start justify-between">
        <div>
          <p className="font-[var(--font-heading)] text-[10px] font-bold uppercase tracking-[1.5px] text-[var(--color-text-muted)]">
            {title}
          </p>
          <p className="mt-2.5 font-[var(--font-display)] text-[32px] leading-none tracking-tight text-[var(--color-text-primary)]">
            {value}
          </p>
          {change && (
            <div className="mt-2 flex items-center gap-1">
              <TrendingUp size={12} className="text-emerald-500" />
              <span className="font-[var(--font-body)] text-[11px] font-semibold text-emerald-500">
                {change}
              </span>
            </div>
          )}
        </div>
        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl shadow-sm transition-transform duration-300 group-hover:scale-110"
          style={{ background: gradient, color: "white" }}
        >
          <Icon size={20} />
        </div>
      </div>
    </>
  );

  const className = "group relative block overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg no-underline";

  if (to) {
    return (
      <Link to={to} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <div className={className}>
      {content}
    </div>
  );
}
