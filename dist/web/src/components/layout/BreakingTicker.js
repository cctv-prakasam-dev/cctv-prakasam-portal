import { jsx as _jsx, jsxs as _jsxs } from "hono/jsx/jsx-runtime";
import { useEffect, useRef, useState } from "react";
export default function BreakingTicker({ items }) {
    const [offset, setOffset] = useState(0);
    const animRef = useRef(0);
    const text = items.join("   ◆   ");
    useEffect(() => {
        const interval = setInterval(() => {
            setOffset((prev) => prev - 1.2);
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
    return (_jsxs("div", { className: "flex h-9 select-none items-center overflow-hidden bg-gradient-to-r from-[#0E7490] to-[#0891B2]", children: [_jsxs("div", { className: "z-2 flex h-full shrink-0 items-center gap-1.5 bg-[#DB2777] px-4", children: [_jsx("span", { className: "inline-block h-2 w-2 animate-pulse rounded-full bg-red-500" }), _jsx("span", { className: "font-[var(--font-display)] text-[11px] font-medium tracking-[2.5px] text-white", children: "BREAKING" })] }), _jsxs("div", { className: "inline-flex whitespace-nowrap font-[var(--font-telugu)] text-[13px] font-semibold tracking-wide text-white", style: { transform: `translateX(${offset % 4000}px)` }, children: [_jsx("span", { className: "pl-5", children: text }), _jsx("span", { className: "pl-15", children: text })] })] }));
}
