interface BreakingTickerProps {
  items: string[];
}

export default function BreakingTicker({ items }: BreakingTickerProps) {
  const text = items.join("   ◆   ");

  if (items.length === 0)
    return null;

  return (
    <div role="marquee" aria-live="polite" aria-label="Breaking news" className="flex h-9 select-none items-center overflow-hidden bg-gradient-to-r from-[#0E7490] to-[#0891B2]">
      {/* BREAKING Badge - compact on mobile */}
      <div className="z-2 flex h-full shrink-0 items-center gap-1 bg-[#DB2777] px-2 min-[640px]:gap-1.5 min-[640px]:px-4">
        <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-red-500" />
        <span className="hidden font-[var(--font-display)] text-[11px] font-medium tracking-[2.5px] text-white min-[640px]:inline">
          BREAKING
        </span>
        <span className="font-[var(--font-display)] text-[9px] font-medium tracking-[1px] text-white min-[640px]:hidden">
          LIVE
        </span>
      </div>

      {/* Scrolling Text - CSS animation instead of JS interval */}
      <div className="inline-flex animate-[ticker_40s_linear_infinite] whitespace-nowrap font-[var(--font-telugu)] text-[13px] font-semibold tracking-wide text-white">
        <span className="pl-5">{text}</span>
        <span className="pl-15">{text}</span>
      </div>
    </div>
  );
}
