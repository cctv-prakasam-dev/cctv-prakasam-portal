import { CheckCircle, Grid3X3, List, RefreshCw, Trash2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import DataTable from "@/components/admin/DataTable";
import { useAdminVideos, useDeleteVideo, useSyncStatus, useSyncYouTubeVideos } from "@/hooks/useAdminVideos";
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
  const [syncing, setSyncing] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const { data: resp, isLoading } = useAdminVideos({ page, page_size: viewMode === "card" ? 12 : 10 });
  const deleteVideo = useDeleteVideo();
  const syncVideos = useSyncYouTubeVideos();
  const { data: statusData } = useSyncStatus(syncing);
  const queryClient = useQueryClient();

  // Poll sync status — when sync finishes, show toast and refresh videos
  useEffect(() => {
    if (!syncing || !statusData?.data)
      return;
    const status = statusData.data;
    if (!status.is_syncing) {
      setSyncing(false);
      if (status.last_error) {
        setToast({ type: "error", message: `Sync failed: ${status.last_error}` });
      }
      else if (status.last_result) {
        setToast({ type: "success", message: `Synced! ${status.last_result.newVideos} new, ${status.last_result.updatedVideos} updated` });
        queryClient.invalidateQueries({ queryKey: ["admin", "videos"] });
        queryClient.invalidateQueries({ queryKey: ["videos"] });
      }
    }
  }, [syncing, statusData, queryClient]);

  // Auto-dismiss toast after 5 seconds
  useEffect(() => {
    if (!toast)
      return;
    const timer = setTimeout(setToast, 5000, null);
    return () => clearTimeout(timer);
  }, [toast]);

  function handleSync() {
    setSyncing(true);
    syncVideos.mutate();
  }

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
            onClick={handleSync}
            disabled={syncing}
            className="flex cursor-pointer items-center gap-2 rounded-lg border-none bg-[var(--color-primary)] px-4 py-2.5 font-[var(--font-heading)] text-xs font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            <RefreshCw size={14} className={syncing ? "animate-spin" : ""} />
            {syncing ? "Syncing..." : "Sync YouTube"}
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

      {/* Syncing indicator - fixed bottom right corner */}
      {syncing && (
        <div className="fixed right-5 bottom-5 z-50 flex items-center gap-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-3 shadow-lg">
          <RefreshCw size={16} className="animate-spin text-[var(--color-primary)]" />
          <span className="font-[var(--font-heading)] text-xs font-semibold text-[var(--color-text-primary)]">Syncing YouTube videos...</span>
        </div>
      )}

      {/* Toast notification - fixed bottom right corner */}
      {toast && (
        <div className={`fixed right-5 bottom-5 z-50 flex items-center gap-2.5 rounded-xl border px-4 py-3 shadow-lg ${toast.type === "success" ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/30" : "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/30"}`}>
          {toast.type === "success"
            ? <CheckCircle size={16} className="text-green-600 dark:text-green-400" />
            : <XCircle size={16} className="text-red-600 dark:text-red-400" />}
          <span className={`font-[var(--font-heading)] text-xs font-semibold ${toast.type === "success" ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"}`}>
            {toast.message}
          </span>
          <button onClick={() => setToast(null)} className="ml-2 cursor-pointer border-none bg-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]">×</button>
        </div>
      )}
    </div>
  );
}
