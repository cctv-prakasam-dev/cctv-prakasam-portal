import { useQuery } from "@tanstack/react-query";

import ceoPhoto from "@/assets/ceo-photo.svg";
import { usePageMeta } from "@/hooks/usePageMeta";
import { apiGet } from "@/lib/apiClient";
import { t } from "@/lib/i18n";
import { useLanguage } from "@/stores/languageStore";

interface ChannelStats {
  subscribers: number;
  total_views: number;
  video_count: number;
  years: number;
  channel_created_at: string | null;
}

function formatNumber(num: number): string {
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1).replace(/\.0$/, "")}M+`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1).replace(/\.0$/, "")}K+`;
  }
  return `${num}+`;
}

const cards = [
  {
    titleKey: "about.mission",
    textKey: "about.mission_text",
    icon: "🎯",
    color: "var(--color-primary)",
  },
  {
    titleKey: "about.vision",
    textKey: "about.vision_text",
    icon: "🔭",
    color: "#DB2777",
  },
];

export default function About() {
  usePageMeta({ title: "About Us", description: "Learn about CCTV AP Prakasam — Prakasam district's most trusted digital news channel since 2021." });
  const { language } = useLanguage();
  const { data: statsResp, isLoading } = useQuery({
    queryKey: ["channel-stats"],
    queryFn: () => apiGet<ChannelStats>("/videos/channel-stats"),
    staleTime: 5 * 60 * 1000,
  });

  const channelStats = statsResp?.data;

  const stats = [
    { labelKey: "about.subscribers", value: channelStats ? formatNumber(channelStats.subscribers) : "...", color: "var(--color-primary)" },
    { labelKey: "common.videos", value: channelStats ? formatNumber(channelStats.video_count) : "...", color: "#DB2777" },
    { labelKey: "about.total_views", value: channelStats ? formatNumber(channelStats.total_views) : "...", color: "#D97706" },
    { labelKey: "about.years", value: channelStats ? `${channelStats.years}+` : "...", color: "#6D28D9" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="about-page-header px-6 pt-12 pb-8 text-center">
        <span className="font-[var(--font-heading)] text-[11px] font-bold uppercase tracking-[2px] text-[var(--color-primary)]">{t("about.title", language)}</span>
        <h1 className="mt-1.5 mb-2.5 font-[var(--font-display)] text-[42px] tracking-[3px] text-[var(--color-text-primary)]">{t("about.heading", language)}</h1>
        <p className="mx-auto max-w-[540px] font-[var(--font-body)] text-sm leading-relaxed text-[var(--color-text-secondary)]">
          {t("about.desc", language)}
        </p>
      </div>

      {/* Stats */}
      <div className="mx-auto max-w-[var(--max-content)] px-6 pb-10">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(145px,1fr))] gap-3">
          {stats.map(s => (
            <div
              key={s.labelKey}
              className="rounded-[14px] border border-[var(--color-border)] bg-[var(--color-card)] p-6 text-center shadow-sm"
              style={{ borderTopWidth: 3, borderTopColor: s.color }}
            >
              <div className="font-[var(--font-display)] text-[32px]" style={{ color: s.color }}>{isLoading ? <span className="inline-block h-8 w-16 animate-pulse rounded bg-[var(--color-surface-2)]" /> : s.value}</div>
              <div className="mt-1 font-[var(--font-body)] text-[11px] text-[var(--color-text-muted)]">{t(s.labelKey, language)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CEO Section */}
      <section className="bg-[var(--color-surface-1)] px-6 pt-10 pb-14">
        <div className="mx-auto max-w-[var(--max-content)]">
          <div className="grid grid-cols-1 items-center gap-10 rounded-[18px] border border-[var(--color-border)] bg-[var(--color-card)] p-10 shadow-md min-[900px]:grid-cols-2">
            <div className="mx-auto max-w-[280px]">
              <div className="aspect-[3/4] overflow-hidden rounded-[14px] bg-cyan-50 dark:bg-slate-800">
                <img src={ceoPhoto} alt="Founder & CEO" className="h-full w-full object-cover object-top" />
              </div>
            </div>
            <div>
              <span className="font-[var(--font-heading)] text-[11px] font-bold uppercase tracking-[2px] text-[#DB2777]">{t("about.founder", language)}</span>
              <h2 className="mt-1.5 mb-4 font-[var(--font-display)] text-[30px] tracking-[2px] text-[var(--color-text-primary)]">{t("about.visionary", language)}</h2>
              <p className="font-[var(--font-body)] text-sm leading-relaxed text-[var(--color-text-secondary)]">
                {t("about.founder_desc", language)}
              </p>
              <p className="mt-2 font-[var(--font-body)] text-[13px] leading-relaxed text-[var(--color-text-muted)]">
                {t("about.founder_desc2", language)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-[var(--color-background)] px-6 pt-11 pb-14">
        <div className="mx-auto grid max-w-[var(--max-content)] grid-cols-1 gap-4.5 min-[900px]:grid-cols-2">
          {cards.map(m => (
            <div
              key={m.titleKey}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-8 shadow-sm"
              style={{ borderTopWidth: 3, borderTopColor: m.color }}
            >
              <div className="mb-2.5 text-[34px]">{m.icon}</div>
              <h3 className="mb-2.5 font-[var(--font-display)] text-lg tracking-[2px]" style={{ color: m.color }}>{t(m.titleKey, language)}</h3>
              <p className="font-[var(--font-body)] text-sm leading-relaxed text-[var(--color-text-secondary)]">{t(m.textKey, language)}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
