import { jsx as _jsx, jsxs as _jsxs } from "hono/jsx/jsx-runtime";
export default function SectionHead({ title, subtitle, accentColor }) {
    return (_jsxs("div", { className: "mb-6", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "h-6 w-1 rounded-sm", style: { backgroundColor: accentColor || "var(--color-primary)" } }), _jsx("h2", { className: "font-[var(--font-display)] text-[22px] uppercase tracking-[1.5px] text-[var(--color-text-primary)]", children: title })] }), subtitle && (_jsx("p", { className: "mt-1 ml-4 font-[var(--font-body)] text-[13px] text-[var(--color-text-muted)]", children: subtitle }))] }));
}
