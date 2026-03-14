import { Grid3X3, List, RefreshCw, Trash2 } from "lucide-react";
import { useState } from "react";

import DataTable from "@/components/admin/DataTable";
import { useAdminVideos, useDeleteVideo, useSyncYouTubeVideos } from "@/hooks/useAdminVideos";
import type { Video } from "@/hooks/useVideos";

function VideoCard({ video, onDelete }: { video: Video; onDelete: () => void }) {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] shadow-sm transition-all hover:shadow-md">
      <div className="relative">
        <img
          src={video.thumbnail_url || `https://img.youtube.com/vi/${video.youtube_id}/mqdefault.jpg`}
          alt={video.title}
          className="aspect-video w-full object-cover"
        />
        {video.duration && (
          <span className="absolute right-1.5 bottom-1.5 rounded bg-black/80 px-1.5 py-0.5 font-[var(--font-mono)] text-[10px] text-white">
            {video.duration}
          </span>
        )}
        <div className="absolute top-1.5 left-1.5 flex gap-1">
          {video.is_featured && (
            <span className="rounded bg-cyan-500 px-1.5 py-0.5 text-[9px] font-bold text-white">Featured</span>
          )}
          {video.is_trending && (
            <span className="rounded bg-orange-500 px-1.5 py-0.5 text-[9px] font-bold text-white">Trending</span>
          )}
        </div>
      </div>
      <div className="p-3">
        <h4 className="mb-1 line-clamp-2 font-[var(--font-heading)] text-[12px] font-semibold leading-snug text-[var(--color-text-primary)]">
          {video.title}
        </h4>
        {video.title_te && (
          <p className="mb-1.5 line-clamp-1 font-[var(--font-telugu)] text-[11px] text-[var(--color-text-muted)]">
            {video.title_te}
          </p>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {video.category_name && (
              <span className="rounded-full bg-[var(--color-surface-2)] px-2 py-0.5 text-[9px] font-semibold text-[var(--color-text-secondary)]">
                {video.category_name}
              </span>
            )}
            <span className="font-[var(--font-body)] text-[10px] text-[var(--color-text-muted)]">
              {video.view_count || "0"}
              {" "}
              views
            </span>
          </div>
          <button
            onClick={onDelete}
            className="cursor-pointer rounded-lg border-none bg-red-50 p-1.5 text-red-500 transition-colors hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ManageVideos() {
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const { data: resp, isLoading } = useAdminVideos({ page, page_size: viewMode === "card" ? 12 : 10 });
  const deleteVideo = useDeleteVideo();
  const syncVideos = useSyncYouTubeVideos();

  const videos = resp?.data?.records ?? [];
  const pagination = resp?.data?.pagination_info;

  const columns = [
    {
      key: "thumbnail_url",
      label: "Thumbnail",
      render: (row: Video) => (
        <img
          src={row.thumbnail_url || `https://img.youtube.com/vi/${row.youtube_id}/mqdefault.jpg`}
          alt={row.title}
          className="h-10 w-16 rounded object-cover"
        />
      ),
    },
    {
      key: "title",
      label: "Title",
      render: (row: Video) => (
        <div>
          <div className="max-w-[250px] truncate font-medium text-[var(--color-text-primary)]">{row.title}</div>
          {row.title_te && (
            <div className="max-w-[250px] truncate font-[var(--font-telugu)] text-xs text-[var(--color-text-muted)]">{row.title_te}</div>
          )}
        </div>
      ),
    },
    { key: "category_name", label: "Category" },
    {
      key: "is_featured",
      label: "Featured",
      render: (row: Video) => (
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${row.is_featured ? "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400" : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-500"}`}>
          {row.is_featured ? "Yes" : "No"}
        </span>
      ),
    },
    {
      key: "is_trending",
      label: "Trending",
      render: (row: Video) => (
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${row.is_trending ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-500"}`}>
          {row.is_trending ? "Yes" : "No"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row: Video) => (
        <button
          onClick={() => deleteVideo.mutate(row.id)}
          className="cursor-pointer rounded-lg border-none bg-red-50 p-2 text-red-500 transition-colors hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30"
        >
          <Trash2 size={14} />
        </button>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-[var(--font-display)] text-2xl tracking-[2px] text-[var(--color-text-primary)]">
            MANAGE VIDEOS
          </h1>
          <p className="mt-1 font-[var(--font-body)] text-sm text-[var(--color-text-muted)]">
            {pagination ? `${pagination.total_records} videos total` : "Loading..."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)]">
            <button
              onClick={() => { setViewMode("table"); setPage(1); }}
              className={`cursor-pointer rounded-l-lg border-none px-3 py-2 transition-colors ${viewMode === "table" ? "bg-[var(--color-primary)] text-white" : "bg-transparent text-[var(--color-text-muted)]"}`}
            >
              <List size={14} />
            </button>
            <button
              onClick={() => { setViewMode("card"); setPage(1); }}
              className={`cursor-pointer rounded-r-lg border-none px-3 py-2 transition-colors ${viewMode === "card" ? "bg-[var(--color-primary)] text-white" : "bg-transparent text-[var(--color-text-muted)]"}`}
            >
              <Grid3X3 size={14} />
            </button>
          </div>

          <button
            onClick={() => syncVideos.mutate()}
            disabled={syncVideos.isPending}
            className="flex cursor-pointer items-center gap-2 rounded-lg border-none bg-[var(--color-primary)] px-4 py-2.5 font-[var(--font-heading)] text-xs font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            <RefreshCw size={14} className={syncVideos.isPending ? "animate-spin" : ""} />
            {syncVideos.isPending ? "Syncing..." : "Sync YouTube"}
          </button>
        </div>
      </div>

      {viewMode === "table"
        ? (
            <DataTable columns={columns} data={videos} loading={isLoading} emptyMessage="No videos found" />
          )
        : (
            isLoading
              ? (
                  <div className="py-20 text-center font-[var(--font-body)] text-[var(--color-text-muted)]">Loading...</div>
                )
              : videos.length === 0
                ? (
                    <div className="py-20 text-center font-[var(--font-body)] text-[var(--color-text-muted)]">No videos found</div>
                  )
                : (
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
                      {videos.map(v => (
                        <VideoCard key={v.id} video={v} onDelete={() => deleteVideo.mutate(v.id)} />
                      ))}
                    </div>
                  )
          )}

      {/* Pagination */}
      {pagination && pagination.total_pages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={!pagination.prev_page}
            className="cursor-pointer rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 font-[var(--font-body)] text-xs text-[var(--color-text-secondary)] disabled:opacity-40"
          >
            Previous
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
            className="cursor-pointer rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 font-[var(--font-body)] text-xs text-[var(--color-text-secondary)] disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
