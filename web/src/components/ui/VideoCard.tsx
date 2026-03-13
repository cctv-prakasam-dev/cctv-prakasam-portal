import { Play } from "lucide-react";

export interface VideoCardData {
  id: number;
  title: string;
  title_te?: string;
  thumbnail_url?: string;
  duration?: string;
  view_count?: string;
  published_at?: string;
  is_trending?: boolean;
  category_name?: string;
  category_color?: string;
}

interface VideoCardProps {
  video: VideoCardData;
  onClick?: () => void;
  large?: boolean;
}

export default function VideoCard({ video, onClick, large }: VideoCardProps) {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-card)] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--color-primary)] hover:shadow-lg"
    >
      {/* Thumbnail */}
      <div className="relative bg-[var(--color-surface-2)] pt-[56.25%]">
        {video.thumbnail_url && (
          <img
            src={video.thumbnail_url}
            alt={video.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary)]/85 text-white shadow-lg transition-transform group-hover:scale-110">
            <Play size={18} fill="white" />
          </div>
        </div>

        {/* Duration Badge */}
        {video.duration && (
          <span className="absolute right-1.5 bottom-1.5 rounded bg-black/85 px-1.5 py-0.5 font-[var(--font-mono)] text-[10px] text-white">
            {video.duration}
          </span>
        )}

        {/* Category Badge */}
        {video.category_name && (
          <span
            className="absolute top-2 left-2 rounded px-2.5 py-0.5 font-[var(--font-heading)] text-[9px] font-bold uppercase tracking-wide text-white"
            style={{ backgroundColor: video.category_color || "var(--color-primary)" }}
          >
            {video.category_name}
          </span>
        )}

        {/* Trending Badge */}
        {video.is_trending && (
          <span className="absolute top-2 right-2 rounded bg-red-600/90 px-2 py-0.5 font-[var(--font-heading)] text-[8px] font-bold text-white">
            🔥 TRENDING
          </span>
        )}
      </div>

      {/* Content */}
      <div className={large ? "px-4.5 pt-4 pb-5" : "px-3.5 pt-3 pb-4"}>
        {/* Telugu Title */}
        {video.title_te && (
          <h3
            className={`line-clamp-2 font-[var(--font-telugu)] font-bold leading-relaxed text-[var(--color-text-primary)] ${large ? "mb-0.5 text-[15px]" : "mb-0.5 text-[13px]"}`}
          >
            {video.title_te}
          </h3>
        )}

        {/* English Title */}
        <p className="mb-2 font-[var(--font-body)] text-[11px] text-[var(--color-text-muted)]">
          {video.title}
        </p>

        {/* Stats */}
        <div className="flex justify-between">
          <span className="font-[var(--font-body)] text-[11px] text-[var(--color-text-muted)]">
            👁
            {" "}
            {video.view_count || "0"}
          </span>
          <span className="font-[var(--font-body)] text-[11px] text-[var(--color-text-muted)]">
            {video.published_at || ""}
          </span>
        </div>
      </div>
    </div>
  );
}
