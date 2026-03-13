import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";

import logo from "@/assets/logo.svg";
import ThemeToggle from "@/components/ui/ThemeToggle";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/videos", label: "Videos" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <nav className="sticky top-0 z-200 bg-[var(--color-navbar)]">
        <div className="mx-auto flex h-[var(--navbar-height)] max-w-[var(--max-content)] items-center justify-between px-6">
          {/* Logo */}
          <Link to="/" className="flex shrink-0 items-center">
            <img src={logo} alt="CCTV Prakasam" className="h-11 object-contain" />
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden items-center gap-0 min-[900px]:flex">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`rounded-md border-none px-5 py-2 font-[var(--font-heading)] text-[13px] font-bold tracking-wide transition-all ${
                  location.pathname === link.to
                    ? "bg-white/10 text-cyan-400"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            {/* Subscribe Button - Desktop */}
            <a
              href="https://www.youtube.com/@CctvPrakasam"
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-1.5 rounded-md bg-[#DB2777] px-4.5 py-2 font-[var(--font-heading)] text-xs font-bold tracking-wide text-white no-underline transition-all hover:bg-[#BE185D] min-[900px]:flex"
            >
              ▶ Subscribe
            </a>

            {/* Dashboard Button - Desktop */}
            <Link
              to="/admin"
              className="hidden rounded-md bg-gradient-to-br from-[#0891B2] to-[#06B6D4] px-5 py-2 font-[var(--font-heading)] text-xs font-bold tracking-wider text-white no-underline transition-all hover:from-[#0E7490] hover:to-[#0891B2] min-[900px]:block"
            >
              Dashboard
            </Link>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-white/12 bg-white/8 text-white min-[900px]:hidden"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 top-[var(--navbar-height)] z-190 flex flex-col gap-1 overflow-y-auto bg-[var(--color-background)] p-5 min-[900px]:hidden">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={`rounded-xl px-5 py-4 text-left font-[var(--font-heading)] text-[17px] font-bold no-underline ${
                location.pathname === link.to
                  ? "bg-[var(--color-primary-bg)] text-[var(--color-primary)]"
                  : "text-[var(--color-text-primary)] hover:bg-[var(--color-surface-1)]"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/admin"
            onClick={() => setMobileOpen(false)}
            className="mt-3 rounded-xl bg-gradient-to-br from-[#0891B2] to-[#06B6D4] px-5 py-4 font-[var(--font-heading)] text-base font-bold text-white no-underline"
          >
            🔐 Dashboard
          </Link>
        </div>
      )}
    </>
  );
}
