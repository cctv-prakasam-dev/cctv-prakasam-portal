import { Link } from "@tanstack/react-router";
import { useState } from "react";

import ceoPhoto from "@/assets/ceo-photo.svg";
import BreakingTicker from "@/components/layout/BreakingTicker";
import SectionHead from "@/components/ui/SectionHead";
import ShareButtons from "@/components/ui/ShareButtons";
import VideoCard from "@/components/ui/VideoCard";
import VideoPlayerModal from "@/components/ui/VideoPlayerModal";
import { useBreakingNews } from "@/hooks/useBreakingNews";
import { useCategories } from "@/hooks/useCategories";
import { useSubscribeNewsletter } from "@/hooks/useNewsletter";
import { usePageMeta } from "@/hooks/usePageMeta";
import type { FeaturedVideoItem } from "@/hooks/useAdminFeatured";
import { useFeaturedContent } from "@/hooks/useAdminFeatured";
import type { Video } from "@/hooks/useVideos";
import { useFeaturedVideos, useTrendingVideos, useVideos } from "@/hooks/useVideos";
import { formatViews, timeAgo } from "@/lib/format";
import { t } from "@/lib/i18n";
import { useLanguage } from "@/stores/languageStore";

function featuredToVideo(item: FeaturedVideoItem): Video {
  return {
    id: item.video_id || item.id,
    title: item.title || item.video_title || "",
    title_te: item.video_title_te || null,
    youtube_id: item.youtube_id || null,
    description: item.description || null,
    thumbnail_url: item.thumbnail_url || null,
    duration: item.duration || null,
    view_count: item.view_count || null,
    published_at: item.published_at || null,
    category_id: item.category_id || null,
    is_featured: true,
    is_trending: false,
    is_active: true,
  } as Video;
}

export default function Home() {
  usePageMeta({ title: "Home", description: "Prakasam district's trusted digital news channel. Latest politics, entertainment, devotional & local coverage from Andhra Pradesh." });
  const { language } = useLanguage();
  const { data: breakingNews } = useBreakingNews();
  const { data: categories } = useCategories();
  const { data: featuredContentData } = useFeaturedContent();
  const { data: featuredData, isError: featuredError } = useFeaturedVideos();
  const { data: trendingData, isError: trendingError } = useTrendingVideos();
  const { data: latestData, isError: latestError } = useVideos({ page: 1, page_size: 8 });
  const subscribe = useSubscribeNewsletter();
  const [email, setEmail] = useState("");
  const [playingVideo, setPlayingVideo] = useState<{ youtubeId: string; title: string } | null>(null);

  const breakingItems = breakingNews?.data?.map(b => b.text_te || b.text) ?? [];
  const cats = categories?.data ?? [];

  // Build category lookup map
  const catMap = new Map(cats.map(c => [c.id, c]));
  function enrichVideo(v: Video) {
    const cat = v.category_id ? catMap.get(v.category_id) : undefined;
    return { ...v, category_name: cat?.name, category_color: cat?.color };
  }

  // Use admin Featured Content if available, otherwise fall back to is_featured videos, then latest
  const featuredContentItems = (featuredContentData?.data ?? []).filter(i => i.video_id && i.youtube_id);
  const featured = featuredContentItems.length > 0
    ? featuredContentItems.map(i => enrichVideo(featuredToVideo(i)))
    : (featuredData?.data ?? []).map(enrichVideo);
  const trending = (trendingData?.data ?? []).map(enrichVideo);
  const latest = (latestData?.data?.records ?? []).map(enrichVideo);
  // Hero: featured first, then latest uploaded video as fallback
  const mainFeature = featured[0] || latest[0];
  const sideVideos = featured.length > 1 ? featured.slice(1, 6) : latest.slice(mainFeature === latest[0] ? 1 : 0, mainFeature === latest[0] ? 6 : 5);

  function handleSubscribe() {
    if (!email)
      return;
    subscribe.mutate({ email }, {
      onSuccess: () => { setEmail(""); },
    });
  }

  return (
    <div>
      {/* Breaking News Ticker */}
      <BreakingTicker items={breakingItems} />

      {/* Hero Section */}
      <section className="hero-section relative px-6 pt-10 pb-12">
        <div className="mx-auto max-w-[var(--max-content)]">
          <div className="grid grid-cols-1 gap-6 min-[900px]:grid-cols-[2.2fr_1fr]">
            {/* Main Feature */}
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-red-50 px-3.5 py-1.5 dark:bg-red-500/10">
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-red-600" />
                <span className="font-[var(--font-display)] text-[11px] font-semibold tracking-[1.5px] text-red-600 dark:text-red-400">{t("home.featured", language)}</span>
              </div>
              {featuredError
                ? <p className="py-8 font-[var(--font-body)] text-sm text-[var(--color-text-muted)]">Failed to load featured video.</p>
                : mainFeature && (
                  <>
                    <VideoCard
                      video={mainFeature}
                      large
                      onClick={() => mainFeature.youtube_id && setPlayingVideo({ youtubeId: mainFeature.youtube_id, title: mainFeature.title })}
                    />
                    <ShareButtons title={mainFeature.title} videoId={mainFeature.id} compact />
                  </>
                )}
            </div>

            {/* Side Stack */}
            <div>
              <div className="mb-3 font-[var(--font-display)] text-xs tracking-[2px] text-[var(--color-primary)]">
                📺
                {t("home.latest_updates", language)}
              </div>
              <div className="flex flex-col gap-2.5">
                {sideVideos.map(v => (
                  <div
                    key={v.id}
                    className="group flex cursor-pointer gap-3 overflow-hidden rounded-[10px] border border-[var(--color-border)] bg-[var(--color-card)] shadow-sm transition-all hover:border-[var(--color-primary)]/40 hover:shadow-md"
                    onClick={() => v.youtube_id && setPlayingVideo({ youtubeId: v.youtube_id, title: v.title })}
                  >
                    <div className="relative flex h-[76px] w-[136px] shrink-0 items-center justify-center bg-slate-200 dark:bg-slate-700">
                      {v.thumbnail_url && <img src={v.thumbnail_url} alt={v.title_te || v.title} className="absolute inset-0 h-full w-full object-cover" />}
                      <div className="z-1 flex h-[30px] w-[30px] items-center justify-center rounded-full bg-cyan-500/80 text-xs text-white">▶</div>
                      {v.duration && <span className="absolute right-1 bottom-1 rounded bg-black/80 px-1 py-0.5 font-[var(--font-mono)] text-[9px] text-white">{v.duration}</span>}
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col justify-center py-2 pr-3">
                      {v.category_name && <span className="font-[var(--font-heading)] text-[9px] font-bold uppercase tracking-wide text-[var(--color-primary)]">{v.category_name}</span>}
                      <h4 className="mt-0.5 truncate font-[var(--font-telugu)] text-xs font-semibold leading-snug text-[var(--color-text-primary)]">{v.title_te || v.title}</h4>
                      <span className="font-[var(--font-body)] text-[10px] text-[var(--color-text-muted)]">
                        {formatViews(v.view_count)}
                        {" "}
                        •
                        {" "}
                        {timeAgo(v.published_at)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-[var(--color-background)] px-6 pt-10 pb-11">
        <div className="mx-auto max-w-[var(--max-content)]">
          <SectionHead title={t("home.browse_categories", language)} subtitle={t("home.explore_by_topic", language)} />
          <div className="grid grid-cols-[repeat(auto-fill,minmax(165px,1fr))] gap-3">
            {cats.map(c => (
              <Link key={c.id} to="/videos" search={{ category: c.slug }} className="no-underline">
                <div className="group relative overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-card)] p-4.5 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:border-current hover:shadow-lg" style={{ borderTopColor: c.color }}>
                  <div className="absolute inset-x-0 top-0 h-[3px]" style={{ backgroundColor: c.color }} />
                  <div className="mb-1.5 text-[26px]">{c.icon}</div>
                  <div className="font-[var(--font-heading)] text-xs font-bold text-[var(--color-text-primary)]">{language === "te" && c.name_te ? c.name_te : c.name}</div>
                  {language === "en" && c.name_te && <div className="font-[var(--font-telugu)] text-[10px] text-[var(--color-text-muted)]">{c.name_te}</div>}
                  <div className="mt-1 font-[var(--font-mono)] text-[10px] font-semibold" style={{ color: c.color }}>{c.video_count}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending */}
      <section className="bg-[var(--color-surface-1)] px-6 pt-10 pb-12">
        <div className="mx-auto max-w-[var(--max-content)]">
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <div className="h-6 w-1 rounded-sm bg-gradient-to-b from-red-500 to-orange-500" />
              <h2 className="font-[var(--font-display)] text-[22px] uppercase tracking-[1.5px] text-[var(--color-text-primary)]">
                {t("home.trending", language)}
              </h2>
              <span className="rounded-full bg-red-500/20 px-3 py-0.5 text-[10px] font-bold text-red-400">
                🔥
                {t("home.hot", language)}
              </span>
            </div>
            <p className="mt-1 ml-4 font-[var(--font-body)] text-[13px] text-[var(--color-text-muted)]">
              {t("home.most_watched", language)}
            </p>
          </div>
          {trendingError
            ? <p className="py-8 text-center font-[var(--font-body)] text-sm text-[var(--color-text-muted)]">Failed to load trending videos.</p>
            : (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(270px,1fr))] gap-4">
                  {trending.slice(0, 6).map(v => (
                    <VideoCard
                      key={v.id}
                      video={v}
                      onClick={() => v.youtube_id && setPlayingVideo({ youtubeId: v.youtube_id, title: v.title })}
                    />
                  ))}
                </div>
              )}
        </div>
      </section>

      {/* CEO Section */}
      <section className="bg-[var(--color-background)] px-6 py-14">
        <div className="mx-auto max-w-[var(--max-content)]">
          <div className="relative grid grid-cols-1 items-center gap-10 overflow-hidden rounded-[18px] border border-[var(--color-border)] bg-[var(--color-card)] p-10 shadow-md min-[900px]:grid-cols-[240px_1fr]">
            <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#0891B2] to-[#06B6D4]" />
            <div className="relative mx-auto w-full max-w-[240px]">
              <div className="aspect-[3/4] overflow-hidden rounded-[14px] bg-gradient-to-br from-cyan-100 to-sky-50 dark:bg-slate-800">
                <img src={ceoPhoto} alt="Founder & CEO" className="h-full w-full object-cover object-top" />
              </div>
              <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-gradient-to-r from-[#0891B2] to-[#06B6D4] px-4.5 py-1.5">
                <span className="font-[var(--font-display)] text-[10px] tracking-[2px] text-white">FOUNDER & CEO</span>
              </div>
            </div>
            <div>
              <span className="font-[var(--font-heading)] text-[11px] font-bold uppercase tracking-[2px] text-[var(--color-primary)]">Meet Our Founder</span>
              <h2 className="mt-1.5 mb-4 font-[var(--font-display)] text-[30px] leading-tight tracking-[2px] text-[var(--color-text-primary)]">
                THE VISION BEHIND
                <br />
                CCTV AP PRAKASAM
              </h2>
              <p className="max-w-[500px] font-[var(--font-body)] text-sm leading-relaxed text-[var(--color-text-secondary)]">
                CCTV AP Prakasam was founded to deliver authentic, timely news to Prakasam district. Our commitment to truth and community-focused journalism drives every story.
              </p>
              <p className="mt-2 font-[var(--font-body)] text-[13px] leading-relaxed text-[var(--color-text-muted)]">
                From political developments to local events, devotional content to entertainment — comprehensive coverage you can trust.
              </p>
              <a href="https://www.youtube.com/@CctvPrakasam" target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#0891B2] to-[#06B6D4] px-6 py-2.5 font-[var(--font-heading)] text-[13px] font-bold text-white no-underline">
                ▶ YouTube Channel
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter-section px-6 py-12">
        <div className="mx-auto max-w-[540px] text-center">
          <div className="mb-2 text-[32px]">📬</div>
          <h2 className="mb-1.5 font-[var(--font-display)] text-[26px] tracking-[2px] text-[var(--color-text-primary)]">{t("home.stay_updated", language)}</h2>
          <p className="mb-5.5 font-[var(--font-body)] text-sm text-[var(--color-text-secondary)]">{t("home.subscribe_desc", language)}</p>
          <div className="flex gap-2.5">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-3 font-[var(--font-body)] text-sm text-[var(--color-text-primary)] outline-none"
            />
            <button
              onClick={handleSubscribe}
              disabled={subscribe.isPending}
              className="cursor-pointer whitespace-nowrap rounded-lg bg-gradient-to-r from-[#0891B2] to-[#06B6D4] px-6 py-3 font-[var(--font-heading)] text-[13px] font-bold text-white disabled:opacity-50"
            >
              {subscribe.isPending ? "..." : t("home.subscribe_btn", language)}
            </button>
          </div>
          {subscribe.isSuccess && <p className="mt-2 text-sm text-emerald-600 dark:text-emerald-400">Subscribed successfully!</p>}
          {subscribe.isError && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{subscribe.error instanceof Error ? subscribe.error.message : "Subscription failed. Please try again."}</p>}
        </div>
      </section>

      {/* Latest Videos */}
      <section className="bg-[var(--color-background)] px-6 pt-11 pb-14">
        <div className="mx-auto max-w-[var(--max-content)]">
          <SectionHead title={t("home.latest_videos", language)} />
          {latestError
            ? <p className="py-8 text-center font-[var(--font-body)] text-sm text-[var(--color-text-muted)]">Failed to load latest videos.</p>
            : (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(270px,1fr))] gap-4">
                  {latest.map(v => (
                    <VideoCard
                      key={v.id}
                      video={v}
                      onClick={() => v.youtube_id && setPlayingVideo({ youtubeId: v.youtube_id, title: v.title })}
                    />
                  ))}
                </div>
              )}
          <div className="mt-7 text-center">
            <Link to="/videos" search={{ category: undefined }} className="rounded-lg border border-[var(--color-primary)]/30 bg-[var(--color-primary-bg)] px-8 py-2.5 font-[var(--font-heading)] text-[13px] font-bold text-[var(--color-primary)] no-underline transition-all hover:bg-[var(--color-primary)] hover:text-white">
              {t("home.view_all", language)}
            </Link>
          </div>
        </div>
      </section>

      {/* Video Player Modal */}
      {playingVideo && (
        <VideoPlayerModal
          youtubeId={playingVideo.youtubeId}
          title={playingVideo.title}
          onClose={() => setPlayingVideo(null)}
        />
      )}
    </div>
  );
}
