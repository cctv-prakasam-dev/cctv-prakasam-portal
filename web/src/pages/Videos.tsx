import { useSearch } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";

import VideoCard from "@/components/ui/VideoCard";
import VideoPlayerModal from "@/components/ui/VideoPlayerModal";
import { useCategories } from "@/hooks/useCategories";
import { useDebounce } from "@/hooks/useDebounce";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useVideos } from "@/hooks/useVideos";
import { t } from "@/lib/i18n";
import { useLanguage } from "@/stores/languageStore";

export default function Videos() {
  usePageMeta({ title: "Videos", description: "Browse all CCTV AP Prakasam news videos. Filter by category — politics, entertainment, devotional & more." });
  const { language } = useLanguage();
  const search = useSearch({ strict: false }) as { category?: string };
  const [filter, setFilter] = useState(search.category || "all");
  const [page, setPage] = useState(1);

  // Sync filter state when URL search params change (e.g., footer category links)
  useEffect(() => {
    const newFilter = search.category || "all";
    setFilter(newFilter);
    setPage(1);
  }, [search.category]);
  const [searchTerm, setSearchTerm] = useState("");
  const searchQuery = useDebounce(searchTerm, 300);
  const [playingVideo, setPlayingVideo] = useState<{ youtubeId: string; title: string } | null>(null);
  const { data: categories } = useCategories();
  const cats = categories?.data ?? [];

  // Resolve slug to category_id for the API
  const selectedCat = filter !== "all" ? cats.find(c => c.slug === filter) : undefined;
  const { data: videosData, isLoading, isError } = useVideos({
    category: selectedCat ? String(selectedCat.id) : undefined,
    page,
    page_size: 12,
    search: searchQuery || undefined,
  });

  const rawVideos = videosData?.data?.records ?? [];

  // Enrich videos with category name/color
  const catMap = new Map(cats.map(c => [c.id, c]));
  const videos = rawVideos.map(v => ({
    ...v,
    category_name: v.category_id ? catMap.get(v.category_id)?.name : undefined,
    category_color: v.category_id ? catMap.get(v.category_id)?.color : undefined,
  }));
  const pagination = videosData?.data?.pagination_info;

  return (
    <div className="min-h-[80vh] bg-[var(--color-background)]">
      {/* Header */}
      <div className="videos-page-header px-6 pt-10 pb-8">
        <div className="mx-auto max-w-[var(--max-content)]">
          <span className="font-[var(--font-heading)] text-[11px] font-bold uppercase tracking-[2px] text-[var(--color-primary)]">{t("videos.library", language)}</span>
          <h1 className="mt-1 mb-1.5 font-[var(--font-display)] text-[38px] tracking-[3px] text-[var(--color-text-primary)]">{t("videos.all", language)}</h1>
          <p className="font-[var(--font-body)] text-[13px] text-[var(--color-text-muted)]">{t("videos.api_desc", language)}</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mx-auto max-w-[var(--max-content)] px-6 pb-3">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
          <input
            type="text"
            placeholder={t("videos.search", language)}
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] py-2.5 pl-10 pr-10 font-[var(--font-body)] text-sm text-[var(--color-text-primary)] outline-none transition-colors focus:border-[var(--color-primary)]"
          />
          {searchTerm && (
            <button
              aria-label="Clear search"
              onClick={() => { setSearchTerm(""); setPage(1); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer border-none bg-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="sticky top-[var(--navbar-height)] z-50 border-b border-[var(--color-border)] bg-[var(--color-background)] px-6 py-2">
        <div className="mx-auto flex max-w-[var(--max-content)] flex-wrap gap-2">
          <button
            onClick={() => { setFilter("all"); setPage(1); }}
            className={`cursor-pointer rounded-full px-4 py-1.5 font-[var(--font-heading)] text-[11px] font-semibold transition-all ${
              filter === "all"
                ? "bg-gradient-to-r from-[#0891B2] to-[#06B6D4] text-white"
                : "border border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-text-secondary)]"
            }`}
          >
            {t("videos.all_filter", language)}
          </button>
          {cats.map(c => (
            <button
              key={c.id}
              onClick={() => { setFilter(c.slug); setPage(1); }}
              className={`cursor-pointer rounded-full px-4 py-1.5 font-[var(--font-heading)] text-[11px] font-semibold transition-all ${
                filter === c.slug
                  ? "bg-gradient-to-r from-[#0891B2] to-[#06B6D4] text-white"
                  : "border border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-text-secondary)]"
              }`}
            >
              {language === "te" && c.name_te ? c.name_te : c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Video Grid */}
      <div className="px-6 pt-4.5 pb-14">
        <div className="mx-auto max-w-[var(--max-content)]">
          <p className="mb-3.5 font-[var(--font-body)] text-xs text-[var(--color-text-muted)]">
            {pagination?.total_records ?? 0}
            {" "}
            {t("common.videos", language)}
          </p>

          {isError
            ? (
                <div className="py-20 text-center font-[var(--font-body)] text-[var(--color-text-muted)]">{t("videos.error", language)}</div>
              )
            : isLoading
              ? (
                  <div className="py-20 text-center font-[var(--font-body)] text-[var(--color-text-muted)]">{t("videos.loading", language)}</div>
                )
              : videos.length === 0
                ? (
                    <div className="py-20 text-center font-[var(--font-body)] text-[var(--color-text-muted)]">{t("videos.no_results", language)}</div>
                  )
                : (
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(270px,1fr))] gap-4">
                      {videos.map(v => (
                        <VideoCard
                          key={v.id}
                          video={v}
                          onClick={() => v.youtube_id && setPlayingVideo({ youtubeId: v.youtube_id, title: v.title })}
                        />
                      ))}
                    </div>
                  )}

          {/* Pagination */}
          {pagination && pagination.total_pages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={!pagination.prev_page}
                className="cursor-pointer rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-2 font-[var(--font-heading)] text-xs font-semibold text-[var(--color-text-secondary)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {t("videos.prev", language)}
              </button>
              <span className="font-[var(--font-body)] text-xs text-[var(--color-text-muted)]">
                {t("common.page", language)}
                {" "}
                {pagination.current_page}
                {" "}
                {t("common.of", language)}
                {" "}
                {pagination.total_pages}
              </span>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={!pagination.next_page}
                className="cursor-pointer rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-2 font-[var(--font-heading)] text-xs font-semibold text-[var(--color-text-secondary)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {t("videos.next", language)}
              </button>
            </div>
          )}
        </div>
      </div>

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
