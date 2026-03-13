interface SectionHeadProps {
  title: string;
  subtitle?: string;
  accentColor?: string;
}

export default function SectionHead({ title, subtitle, accentColor }: SectionHeadProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3">
        <div
          className="h-6 w-1 rounded-sm"
          style={{ backgroundColor: accentColor || "var(--color-primary)" }}
        />
        <h2 className="font-[var(--font-display)] text-[22px] uppercase tracking-[1.5px] text-[var(--color-text-primary)]">
          {title}
        </h2>
      </div>
      {subtitle && (
        <p className="mt-1 ml-4 font-[var(--font-body)] text-[13px] text-[var(--color-text-muted)]">
          {subtitle}
        </p>
      )}
    </div>
  );
}
