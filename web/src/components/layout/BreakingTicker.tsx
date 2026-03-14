import { useEffect, useState } from "react";

interface BreakingTickerProps {
  items: string[];
}

export default function BreakingTicker({ items }: BreakingTickerProps) {
  const [offset, setOffset] = useState(0);

  const text = items.join("   ◆   ");

  useEffect(() => {
    const interval = setInterval(() => {
      setOffset(prev => prev - 1.2);
    }, 25);
    return () => clearInterval(interval);
  }, []);

  // Reset offset to prevent infinite negative values
  useEffect(() => {
    if (offset < -4000) {
      setOffset(0);
    }
  }, [offset]);

  if (items.length === 0)
    return null;

  return (
    <div role="marquee" aria-live="polite" aria-label="Breaking news" className="flex h-9 select-none items-center overflow-hidden bg-gradient-to-r from-[#0E7490] to-[#0891B2]">
      {/* BREAKING Badge */}
      <div className="z-2 flex h-full shrink-0 items-center gap-1.5 bg-[#DB2777] px-4">
        <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-red-500" />
        <span className="font-[var(--font-display)] text-[11px] font-medium tracking-[2.5px] text-white">
          BREAKING
        </span>
      </div>

      {/* Scrolling Text */}
      <div
        className="inline-flex whitespace-nowrap font-[var(--font-telugu)] text-[13px] font-semibold tracking-wide text-white"
        style={{ transform: `translateX(${offset % 4000}px)` }}
      >
        <span className="pl-5">{text}</span>
        <span className="pl-15">{text}</span>
      </div>
    </div>
  );
}
