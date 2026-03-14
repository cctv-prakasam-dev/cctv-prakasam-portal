import { Link } from "@tanstack/react-router";
import { useState } from "react";

import ceoPhoto from "@/assets/ceo-photo.svg";
import BreakingTicker from "@/components/layout/BreakingTicker";
import SectionHead from "@/components/ui/SectionHead";
import VideoCard from "@/components/ui/VideoCard";
import { useBreakingNews } from "@/hooks/useBreakingNews";
import { useCategories } from "@/hooks/useCategories";
import { useSubscribeNewsletter } from "@/hooks/useNewsletter";
import type { Video } from "@/hooks/useVideos";
import { useFeaturedVideos, useTrendingVideos, useVideos } from "@/hooks/useVideos";
import { formatViews, timeAgo } from "@/lib/format";

export default function Home() {
  const { data: breakingNews } = useBreakingNews();
  const { data: categories } = useCategories();
  const { data: featuredData } = useFeaturedVideos();
  const { data: trendingData } = useTrendingVideos();
  const { data: latestData } = useVideos({ page: 1, page_size: 8 });
  const subscribe = useSubscribeNewsletter();
  const [email, setEmail] = useState("");

  const breakingItems = breakingNews?.data?.map(b => b.text_te || b.text) ?? [];
  const cats = categories?.data ?? [];

  // Build category lookup map
  const catMap = new Map(cats.map(c => [c.id, c]));
  function enrichVideo(v: Video) {
    const cat = v.category_id ? catMap.get(v.category_id) : undefined;
    return { ...v, category_name: cat?.name, category_color: cat?.color };
  }

  const featured = (featuredData?.data ?? []).map(enrichVideo);
  const trending = (trendingData?.data ?? []).map(enrichVideo);
  const latest = (latestData?.data?.records ?? []).map(enrichVideo);
  const mainFeature = featured[0];
  const sideVideos = (featured.length > 1 ? featured.slice(1, 6) : latest.slice(0, 5));

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
      <section className="relative bg-[var(--color-primary-bg)] px-6 pt-10 pb-12 dark:bg-[var(--color-surface-1)]">
        <div className="mx-auto max-w-[var(--max-content)]">
          <div className="grid grid-cols-1 gap-6 min-[900px]:grid-cols-[1.6fr_1fr]">
            {/* Main Feature */}
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-red-50 px-3.5 py-1 dark:bg-red-900/10">
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-red-500" />
                <span className="font-[var(--font-display)] text-[11px] tracking-[1.5px] text-[var(--color-live)]">FEATURED STORY</span>
              </div>
              {mainFeature && (
                <Link to="/videos/$id" params={{ id: String(mainFeature.id) }}>
                  <VideoCard video={mainFeature} large />
                </Link>
              )}
            </div>

            {/* Side Stack */}
            <div>
              <div className="mb-3 font-[var(--font-display)] text-xs tracking-[2px] text-[var(--color-primary)]">📺 LATEST UPDATES</div>
              <div className="flex flex-col gap-2.5">
                {sideVideos.map(v => (
                  <Link key={v.id} to="/videos/$id" params={{ id: String(v.id) }} className="no-underline">
                    <div className="group flex gap-3 overflow-hidden rounded-[10px] border border-[var(--color-border)] bg-[var(--color-card)] shadow-sm transition-all hover:border-[var(--color-primary)] hover:shadow-lg">
                      <div className="relative flex h-[76px] w-[136px] shrink-0 items-center justify-center bg-[var(--color-surface-2)]">
                        {v.thumbnail_url && <img src={v.thumbnail_url} alt="" className="absolute inset-0 h-full w-full object-cover" />}
                        <div className="z-1 flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[var(--color-primary)]/80 text-xs text-white">▶</div>
                        {v.duration && <span className="absolute right-1 bottom-1 rounded bg-black/80 px-1 py-0.5 font-[var(--font-mono)] text-[9px] text-white">{v.duration}</span>}
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col justify-center py-2 pr-3">
                        {v.category_name && <span className="font-[var(--font-heading)] text-[9px] font-bold uppercase tracking-wide" style={{ color: v.category_color }}>{v.category_name}</span>}
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
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-[var(--color-background)] px-6 pt-10 pb-11">
        <div className="mx-auto max-w-[var(--max-content)]">
          <SectionHead title="Browse Categories" subtitle="Explore news by topic" />
          <div className="grid grid-cols-[repeat(auto-fill,minmax(165px,1fr))] gap-3">
            {cats.map(c => (
              <Link key={c.id} to="/videos" search={{ category: c.slug }} className="no-underline">
                <div className="group relative overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-card)] p-4.5 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:border-current hover:shadow-lg" style={{ borderTopColor: c.color }}>
                  <div className="absolute inset-x-0 top-0 h-[3px]" style={{ backgroundColor: c.color }} />
                  <div className="mb-1.5 text-[26px]">{c.icon}</div>
                  <div className="font-[var(--font-heading)] text-xs font-bold text-[var(--color-text-primary)]">{c.name}</div>
                  <div className="font-[var(--font-telugu)] text-[10px] text-[var(--color-text-muted)]">{c.name_te}</div>
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
          <SectionHead title="Trending Now" subtitle="Most watched this week" accentColor="var(--color-live)" />
          <div className="grid grid-cols-[repeat(auto-fill,minmax(270px,1fr))] gap-4">
            {trending.slice(0, 5).map(v => (
              <Link key={v.id} to="/videos/$id" params={{ id: String(v.id) }} className="no-underline">
                <VideoCard video={v} />
              </Link>
            ))}
          </div>
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
                CCTV PRAKASAM
              </h2>
              <p className="max-w-[500px] font-[var(--font-body)] text-sm leading-relaxed text-[var(--color-text-secondary)]">
                CCTV Prakasam was founded to deliver authentic, timely news to Prakasam district. Our commitment to truth and community-focused journalism drives every story.
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
      <section className="bg-[var(--color-primary-bg)] px-6 py-12 dark:bg-[var(--color-surface-1)]">
        <div className="mx-auto max-w-[540px] text-center">
          <div className="mb-2 text-[32px]">📬</div>
          <h2 className="mb-1.5 font-[var(--font-display)] text-[26px] tracking-[2px] text-[var(--color-text-primary)]">STAY UPDATED</h2>
          <p className="mb-5.5 font-[var(--font-body)] text-sm text-[var(--color-text-secondary)]">Subscribe and never miss a story.</p>
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
              {subscribe.isPending ? "..." : "Subscribe"}
            </button>
          </div>
          {subscribe.isSuccess && <p className="mt-2 text-sm text-[var(--color-success)]">Subscribed successfully!</p>}
        </div>
      </section>

      {/* Latest Videos */}
      <section className="bg-[var(--color-background)] px-6 pt-11 pb-14">
        <div className="mx-auto max-w-[var(--max-content)]">
          <SectionHead title="Latest Videos" />
          <div className="grid grid-cols-[repeat(auto-fill,minmax(270px,1fr))] gap-4">
            {latest.map(v => (
              <Link key={v.id} to="/videos/$id" params={{ id: String(v.id) }} className="no-underline">
                <VideoCard video={v} />
              </Link>
            ))}
          </div>
          <div className="mt-7 text-center">
            <Link to="/videos" className="rounded-lg border border-[var(--color-primary)]/30 bg-[var(--color-primary-bg)] px-8 py-2.5 font-[var(--font-heading)] text-[13px] font-bold text-[var(--color-primary)] no-underline transition-all hover:bg-[var(--color-primary)] hover:text-white">
              View All Videos →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
