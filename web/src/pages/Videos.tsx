import { Link, useSearch } from "@tanstack/react-router";
import { useState } from "react";

import VideoCard from "@/components/ui/VideoCard";
import { useCategories } from "@/hooks/useCategories";
import { useVideos } from "@/hooks/useVideos";

export default function Videos() {
  const search = useSearch({ strict: false }) as { category?: string };
  const [filter, setFilter] = useState(search.category || "all");
  const [page, setPage] = useState(1);
  const { data: categories } = useCategories();
  const cats = categories?.data ?? [];

  // Resolve slug to category_id for the API
  const selectedCat = filter !== "all" ? cats.find(c => c.slug === filter) : undefined;
  const { data: videosData, isLoading, isError } = useVideos({
    category: selectedCat ? String(selectedCat.id) : undefined,
    page,
    page_size: 12,
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
          <span className="font-[var(--font-heading)] text-[11px] font-bold uppercase tracking-[2px] text-[var(--color-primary)]">YouTube Library</span>
          <h1 className="mt-1 mb-1.5 font-[var(--font-display)] text-[38px] tracking-[3px] text-[var(--color-text-primary)]">ALL VIDEOS</h1>
          <p className="font-[var(--font-body)] text-[13px] text-[var(--color-text-muted)]">Auto-fetched via YouTube Data API v3</p>
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
            All
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
              {c.name}
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
            videos
          </p>

          {isError
            ? (
                <div className="py-20 text-center font-[var(--font-body)] text-[var(--color-text-muted)]">Failed to load videos. Please try again later.</div>
              )
            : isLoading
              ? (
                  <div className="py-20 text-center font-[var(--font-body)] text-[var(--color-text-muted)]">Loading videos...</div>
                )
              : videos.length === 0
                ? (
                    <div className="py-20 text-center font-[var(--font-body)] text-[var(--color-text-muted)]">No videos found</div>
                  )
                : (
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(270px,1fr))] gap-4">
                      {videos.map(v => (
                        <Link key={v.id} to="/videos/$id" params={{ id: String(v.id) }} className="no-underline">
                          <VideoCard video={v} />
                        </Link>
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
                ← Previous
              </button>
              <span className="font-[var(--font-body)] text-xs text-[var(--color-text-muted)]">
                Page
                {" "}
                {pagination.current_page}
                {" "}
                of
                {" "}
                {pagination.total_pages}
              </span>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={!pagination.next_page}
                className="cursor-pointer rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-2 font-[var(--font-heading)] text-xs font-semibold text-[var(--color-text-secondary)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
