import { Check, Copy } from "lucide-react";
import { useState } from "react";

const BASE_URL = "https://cctv-prakasam-portal-g3il.onrender.com";

interface ShareButtonsProps {
  title: string;
  videoId: number;
  compact?: boolean;
}

export default function ShareButtons({ title, videoId, compact }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const pageUrl = `${BASE_URL}/videos/${videoId}`;
  const encodedUrl = encodeURIComponent(pageUrl);
  const encodedTitle = encodeURIComponent(title);

  function copyLink(e: React.MouseEvent) {
    e.stopPropagation();
    navigator.clipboard.writeText(pageUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const shareLinks = [
    { label: "WhatsApp", color: "#25D366", href: `https://wa.me/?text=${encodedUrl}` },
    { label: "Facebook", color: "#1877F2", href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
    { label: "Twitter", color: "#000", href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}` },
  ];

  if (compact) {
    return (
      <div className="mt-2 flex gap-1.5">
        {shareLinks.map(s => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="rounded-md px-2 py-1 font-[var(--font-heading)] text-[9px] font-bold text-white no-underline transition-opacity hover:opacity-80"
            style={{ backgroundColor: s.color }}
          >
            {s.label}
          </a>
        ))}
        <button
          onClick={copyLink}
          className="flex cursor-pointer items-center gap-0.5 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-2 py-1 font-[var(--font-heading)] text-[9px] font-bold text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-primary)]"
        >
          {copied ? <><Check size={9} /> Copied!</> : <><Copy size={9} /> Copy</>}
        </button>
      </div>
    );
  }

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {shareLinks.map(s => (
        <a
          key={s.label}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-1.5 font-[var(--font-heading)] text-[10px] font-semibold text-[var(--color-text-secondary)] no-underline transition-colors hover:border-current"
          style={{ borderLeftWidth: 2, borderLeftColor: s.color }}
        >
          {s.label}
        </a>
      ))}
      <button
        onClick={copyLink}
        className="flex cursor-pointer items-center gap-1 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-1.5 font-[var(--font-heading)] text-[10px] font-semibold text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-primary)]"
      >
        {copied ? <><Check size={10} /> Copied!</> : <><Copy size={10} /> Copy Link</>}
      </button>
    </div>
  );
}
