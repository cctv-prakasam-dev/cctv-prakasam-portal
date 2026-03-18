import { X } from "lucide-react";
import { useEffect } from "react";

const YOUTUBE_ID_REGEX = /^[\w-]{11}$/;

interface VideoPlayerModalProps {
  youtubeId: string;
  title: string;
  onClose: () => void;
}

export default function VideoPlayerModal({ youtubeId, title, onClose }: VideoPlayerModalProps) {
  const isValidId = YOUTUBE_ID_REGEX.test(youtubeId);

  // Close on Escape key
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape")
        onClose();
    }
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4" onClick={onClose}>
      <div className="relative w-full max-w-[900px]" onClick={e => e.stopPropagation()}>
        {/* Close button */}
        <button
          aria-label="Close video player"
          onClick={onClose}
          className="absolute -top-10 right-0 cursor-pointer border-none bg-transparent text-white/80 transition-colors hover:text-white"
        >
          <X size={24} />
        </button>

        {/* YouTube Player */}
        <div className="aspect-video w-full overflow-hidden rounded-xl">
          {isValidId
            ? (
                <iframe
                  src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
                  title={title}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  referrerPolicy="strict-origin-when-cross-origin"
                  sandbox="allow-scripts allow-same-origin allow-presentation"
                  allowFullScreen
                />
              )
            : (
                <div className="flex h-full items-center justify-center bg-black text-white/60">
                  Invalid video
                </div>
              )}
        </div>

        {/* Title */}
        <p className="mt-3 font-[var(--font-heading)] text-sm font-semibold text-white/90">{title}</p>
      </div>
    </div>
  );
}
