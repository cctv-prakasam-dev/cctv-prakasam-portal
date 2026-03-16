import { X } from "lucide-react";
import { useEffect } from "react";

interface VideoPlayerModalProps {
  youtubeId: string;
  title: string;
  onClose: () => void;
}

export default function VideoPlayerModal({ youtubeId, title, onClose }: VideoPlayerModalProps) {
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
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4" onClick={onClose}>
      <div className="relative w-full max-w-[900px]" onClick={e => e.stopPropagation()}>
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 cursor-pointer border-none bg-transparent text-white/80 transition-colors hover:text-white"
        >
          <X size={24} />
        </button>

        {/* YouTube Player */}
        <div className="aspect-video w-full overflow-hidden rounded-xl">
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
            title={title}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Title */}
        <p className="mt-3 font-[var(--font-heading)] text-sm font-semibold text-white/90">{title}</p>
      </div>
    </div>
  );
}
