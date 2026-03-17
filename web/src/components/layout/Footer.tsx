import { Link } from "@tanstack/react-router";

import logo from "@/assets/logo.svg";

const quickLinks = [
  { to: "/", label: "Home" },
  { to: "/videos", label: "Videos" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

const categories = [
  { icon: "📰", name: "General News", slug: "general-news" },
  { icon: "🏛️", name: "Political", slug: "political-news" },
  { icon: "🎬", name: "Entertainment", slug: "entertainment" },
  { icon: "🙏", name: "Devotional", slug: "devotional" },
  { icon: "📍", name: "Local News", slug: "local-news" },
  { icon: "🏏", name: "Sports", slug: "sports" },
];

const socialIcons = [
  { icon: "▶", label: "YouTube", href: "https://www.youtube.com/@CctvPrakasam" },
  { icon: "f", label: "Facebook", href: "https://www.facebook.com/cctvprakasam" },
  { icon: "𝕏", label: "Twitter", href: "https://twitter.com/cctvprakasam" },
  { icon: "📷", label: "Instagram", href: "https://www.instagram.com/cctv_prakasam" },
];

export default function Footer() {
  return (
    <footer className="border-t-3 border-t-[var(--color-primary)] bg-[var(--color-footer)] px-6 pt-13 pb-6">
      <div className="mx-auto mb-8 grid max-w-[var(--max-content)] grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-8">
        {/* Logo & Socials */}
        <div>
          <img src={logo} alt="CCTV AP Prakasam" className="mb-3.5 h-[42px] object-contain" />
          <p className="font-[var(--font-body)] text-[13px] leading-relaxed text-slate-400">
            Prakasam district's trusted digital news. Politics, entertainment, devotional & local coverage.
          </p>
          <div className="mt-3.5 flex gap-2">
            {socialIcons.map(s => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-white/7 bg-white/5 text-[13px] text-slate-400 no-underline hover:bg-white/10 hover:text-white"
              >
                {s.icon}
              </a>
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
            <Link
              key={cat.slug}
              to="/videos"
              search={{ category: cat.slug }}
              className="block py-1.5 font-[var(--font-body)] text-[13px] text-slate-400 no-underline hover:text-white"
            >
              {cat.icon}
              {" "}
              {cat.name}
            </Link>
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
          © 2026 CCTV AP Prakasam. All rights reserved.
        </span>
        <span className="flex gap-2 font-[var(--font-body)] text-[11px] text-slate-600">
          <Link to="/privacy" className="text-slate-600 no-underline hover:text-white">Privacy</Link>
          <span>•</span>
          <Link to="/terms" className="text-slate-600 no-underline hover:text-white">Terms</Link>
          <span>•</span>
          <Link to="/cookies" className="text-slate-600 no-underline hover:text-white">Cookies</Link>
        </span>
      </div>
    </footer>
  );
}
