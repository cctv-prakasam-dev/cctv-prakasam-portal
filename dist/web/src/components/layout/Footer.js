import { jsx as _jsx, jsxs as _jsxs } from "hono/jsx/jsx-runtime";
import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo.svg";
const quickLinks = [
    { to: "/", label: "Home" },
    { to: "/videos", label: "Videos" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
];
const categories = [
    { icon: "📰", name: "General News" },
    { icon: "🏛️", name: "Political" },
    { icon: "🎬", name: "Entertainment" },
    { icon: "🙏", name: "Devotional" },
    { icon: "📍", name: "Local News" },
    { icon: "🏏", name: "Sports" },
];
const socialIcons = [
    { icon: "▶", label: "YouTube" },
    { icon: "f", label: "Facebook" },
    { icon: "𝕏", label: "Twitter" },
    { icon: "📷", label: "Instagram" },
];
export default function Footer() {
    return (_jsxs("footer", { className: "border-t-3 border-t-[var(--color-primary)] bg-[var(--color-footer)] px-6 pt-13 pb-6", children: [_jsxs("div", { className: "mx-auto mb-8 grid max-w-[var(--max-content)] grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-8", children: [_jsxs("div", { children: [_jsx("img", { src: logo, alt: "CCTV Prakasam", className: "mb-3.5 h-[42px] object-contain" }), _jsx("p", { className: "font-[var(--font-body)] text-[13px] leading-relaxed text-slate-400", children: "Prakasam district's trusted digital news. Politics, entertainment, devotional & local coverage." }), _jsx("div", { className: "mt-3.5 flex gap-2", children: socialIcons.map((s) => (_jsx("div", { className: "flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-white/7 bg-white/5 text-[13px] text-slate-400 hover:bg-white/10", children: s.icon }, s.label))) })] }), _jsxs("div", { children: [_jsx("h4", { className: "mb-3.5 font-[var(--font-display)] text-[13px] tracking-[2px] text-cyan-400", children: "QUICK LINKS" }), quickLinks.map((link) => (_jsx(Link, { to: link.to, className: "block py-1.5 font-[var(--font-body)] text-[13px] text-slate-400 no-underline hover:text-white", children: link.label }, link.to)))] }), _jsxs("div", { children: [_jsx("h4", { className: "mb-3.5 font-[var(--font-display)] text-[13px] tracking-[2px] text-cyan-400", children: "CATEGORIES" }), categories.map((cat) => (_jsxs("div", { className: "py-1.5 font-[var(--font-body)] text-[13px] text-slate-400", children: [cat.icon, " ", cat.name] }, cat.name)))] }), _jsxs("div", { children: [_jsx("h4", { className: "mb-3.5 font-[var(--font-display)] text-[13px] tracking-[2px] text-cyan-400", children: "CONTACT" }), _jsxs("div", { className: "font-[var(--font-body)] text-xs leading-8 text-slate-400", children: ["\uD83D\uDCDE +91 9032266619", _jsx("br", {}), "\u2709\uFE0F cctvprakasam@gmail.com", _jsx("br", {}), "\uD83D\uDCCD RTC Bus Stand Backside, Mulaguntapadu, Singarayakonda, Prakasam Dist, AP \u2014 523101"] })] })] }), _jsxs("div", { className: "flex flex-wrap justify-between gap-2 border-t border-white/6 pt-3.5", children: [_jsx("span", { className: "font-[var(--font-body)] text-[11px] text-slate-600", children: "\u00A9 2026 CCTV Prakasam. All rights reserved." }), _jsx("span", { className: "font-[var(--font-body)] text-[11px] text-slate-600", children: "Privacy \u2022 Terms \u2022 Cookies" })] })] }));
}
