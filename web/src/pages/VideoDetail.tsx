import { Link, useParams } from "@tanstack/react-router";
import { Play } from "lucide-react";

import { useVideo, useVideos } from "@/hooks/useVideos";

export default function VideoDetail() {
  const { id } = useParams({ strict: false }) as { id: string };
  const { data: videoData, isLoading } = useVideo(id);
  const { data: relatedData } = useVideos({ page: 1, page_size: 7 });

  const video = videoData?.data;
  const related = (relatedData?.data?.records ?? []).filter(v => v.id !== Number(id)).slice(0, 6);

  if (isLoading) {
    return <div className="flex min-h-[80vh] items-center justify-center font-[var(--font-body)] text-[var(--color-text-muted)]">Loading...</div>;
  }

  if (!video) {
    return <div className="flex min-h-[80vh] items-center justify-center font-[var(--font-body)] text-[var(--color-text-muted)]">Video not found</div>;
  }

  return (
    <div className="min-h-[80vh] bg-[var(--color-background)] px-6 pt-7 pb-14">
      <div className="mx-auto max-w-[var(--max-content)]">
        <Link to="/videos" className="mb-5 inline-block rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-1.5 font-[var(--font-heading)] text-xs font-semibold text-[var(--color-text-primary)] no-underline">
          ← Back to Videos
        </Link>

        <div className="grid grid-cols-1 gap-7 min-[900px]:grid-cols-[1fr_340px]">
          {/* Main Content */}
          <div>
            {/* YouTube Player Placeholder */}
            <div className="flex aspect-video items-center justify-center rounded-[14px] border border-[var(--color-border)] bg-[var(--color-surface-2)]">
              {video.youtube_id
                ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${video.youtube_id}`}
                      title={video.title}
                      className="h-full w-full rounded-[14px]"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  )
                : (
                    <div className="text-center">
                      <div className="mx-auto mb-3 flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[var(--color-primary)]/85 text-white">
                        <Play size={28} fill="white" />
                      </div>
                      <span className="font-[var(--font-body)] text-xs text-[var(--color-text-muted)]">YouTube Player</span>
                    </div>
                  )}
            </div>

            {/* Video Info */}
            <div className="mt-5">
              <div className="mb-2 flex gap-2">
                {video.category_name && (
                  <span className="rounded-[5px] px-2.5 py-0.5 font-[var(--font-heading)] text-[10px] font-bold uppercase text-white" style={{ backgroundColor: video.category_color || "var(--color-primary)" }}>
                    {video.category_name}
                  </span>
                )}
                {video.is_trending && (
                  <span className="rounded-[5px] bg-red-50 px-2.5 py-0.5 font-[var(--font-heading)] text-[10px] font-bold text-[var(--color-live)] dark:bg-red-900/10">
                    🔥 Trending
                  </span>
                )}
              </div>

              <h1 className="font-[var(--font-telugu)] text-xl font-bold leading-snug text-[var(--color-text-primary)]">
                {video.title_te || video.title}
              </h1>
              <p className="mt-1 mb-3 font-[var(--font-body)] text-[13px] text-[var(--color-text-muted)]">{video.title}</p>

              {/* Stats */}
              <div className="flex gap-4.5 border-y border-[var(--color-border)] py-3 font-[var(--font-body)] text-xs text-[var(--color-text-muted)]">
                <span>
                  👁
                  {video.view_count || "0"}
                </span>
                <span>
                  📅
                  {video.published_at || ""}
                </span>
                <span>
                  ⏱
                  {video.duration || ""}
                </span>
              </div>

              {/* Description */}
              {video.description && (
                <div className="mt-4 rounded-[10px] bg-[var(--color-surface-1)] p-5">
                  <h3 className="mb-1.5 font-[var(--font-heading)] text-[13px] font-bold text-[var(--color-text-primary)]">Description</h3>
                  <p className="whitespace-pre-wrap font-[var(--font-body)] text-[13px] leading-relaxed text-[var(--color-text-secondary)]">{video.description}</p>
                </div>
              )}

              {/* Share Buttons */}
              <div className="mt-4 flex gap-2">
                {["Facebook", "Twitter", "WhatsApp", "Copy Link"].map(s => (
                  <button key={s} className="cursor-pointer rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-1.5 font-[var(--font-heading)] text-[10px] font-semibold text-[var(--color-text-secondary)]">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Up Next Sidebar */}
          <div>
            <h3 className="mb-3 font-[var(--font-display)] text-[15px] tracking-[2px] text-[var(--color-text-primary)]">UP NEXT</h3>
            <div className="flex flex-col gap-2.5">
              {related.map(v => (
                <Link key={v.id} to="/videos/$id" params={{ id: String(v.id) }} className="no-underline">
                  <div className="group flex gap-2.5 overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] transition-all hover:border-[var(--color-primary)]">
                    <div className="relative flex h-[65px] w-[116px] shrink-0 items-center justify-center bg-[var(--color-surface-2)]">
                      {v.thumbnail_url && <img src={v.thumbnail_url} alt="" className="absolute inset-0 h-full w-full object-cover" />}
                      <div className="z-1 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-primary)]/75 text-[9px] text-white">▶</div>
                      {v.duration && <span className="absolute right-0.5 bottom-0.5 rounded bg-black/80 px-1 py-px font-[var(--font-mono)] text-[8px] text-white">{v.duration}</span>}
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col justify-center py-1.5 pr-2">
                      {v.category_name && <span className="font-[var(--font-heading)] text-[8px] font-bold uppercase" style={{ color: v.category_color }}>{v.category_name}</span>}
                      <h4 className="mt-0.5 truncate font-[var(--font-telugu)] text-[11px] font-semibold leading-tight text-[var(--color-text-primary)]">{v.title_te || v.title}</h4>
                      <span className="font-[var(--font-body)] text-[9px] text-[var(--color-text-muted)]">
                        {v.view_count}
                        {" "}
                        •
                        {" "}
                        {v.published_at}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
