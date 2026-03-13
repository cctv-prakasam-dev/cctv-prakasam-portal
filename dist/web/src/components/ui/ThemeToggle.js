import { jsx as _jsx } from "hono/jsx/jsx-runtime";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/stores/themeStore";
export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    return (_jsx("button", { onClick: toggleTheme, className: "flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-white/12 bg-white/8 text-[15px] text-slate-300 transition-all hover:bg-white/15", "aria-label": "Toggle theme", children: theme === "dark" ? _jsx(Sun, { size: 16 }) : _jsx(Moon, { size: 16 }) }));
}
