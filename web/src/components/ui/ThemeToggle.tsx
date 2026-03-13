import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/stores/themeStore";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-white/12 bg-white/8 text-[15px] text-slate-300 transition-all hover:bg-white/15"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
