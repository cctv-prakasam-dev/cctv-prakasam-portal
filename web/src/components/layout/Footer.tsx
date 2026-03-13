import { Link } from "@tanstack/react-router";

import logo from "@/assets/logo.svg";

const quickLinks = [
  { to: "/", label: "Home" },
  { to: "/videos", label: "Videos" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

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
  return (
    <footer className="border-t-3 border-t-[var(--color-primary)] bg-[var(--color-footer)] px-6 pt-13 pb-6">
      <div className="mx-auto mb-8 grid max-w-[var(--max-content)] grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-8">
        {/* Logo & Socials */}
        <div>
          <img src={logo} alt="CCTV Prakasam" className="mb-3.5 h-[42px] object-contain" />
          <p className="font-[var(--font-body)] text-[13px] leading-relaxed text-slate-400">
            Prakasam district's trusted digital news. Politics, entertainment, devotional & local coverage.
          </p>
          <div className="mt-3.5 flex gap-2">
            {socialIcons.map(s => (
              <div
                key={s.label}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-white/7 bg-white/5 text-[13px] text-slate-400 hover:bg-white/10"
              >
                {s.icon}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="mb-3.5 font-[var(--font-display)] text-[13px] tracking-[2px] text-cyan-400">
            QUICK LINKS
          </h4>
          {quickLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className="block py-1.5 font-[var(--font-body)] text-[13px] text-slate-400 no-underline hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Categories */}
        <div>
          <h4 className="mb-3.5 font-[var(--font-display)] text-[13px] tracking-[2px] text-cyan-400">
            CATEGORIES
          </h4>
          {categories.map(cat => (
            <div key={cat.name} className="py-1.5 font-[var(--font-body)] text-[13px] text-slate-400">
              {cat.icon}
              {" "}
              {cat.name}
            </div>
          ))}
        </div>

        {/* Contact */}
        <div>
          <h4 className="mb-3.5 font-[var(--font-display)] text-[13px] tracking-[2px] text-cyan-400">
            CONTACT
          </h4>
          <div className="font-[var(--font-body)] text-xs leading-8 text-slate-400">
            📞 +91 9032266619
            <br />
            ✉️ cctvprakasam@gmail.com
            <br />
            📍 RTC Bus Stand Backside, Mulaguntapadu, Singarayakonda, Prakasam Dist, AP — 523101
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="flex flex-wrap justify-between gap-2 border-t border-white/6 pt-3.5">
        <span className="font-[var(--font-body)] text-[11px] text-slate-600">
          © 2026 CCTV Prakasam. All rights reserved.
        </span>
        <span className="font-[var(--font-body)] text-[11px] text-slate-600">
          Privacy • Terms • Cookies
        </span>
      </div>
    </footer>
  );
}
