import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { VideoItem } from "@/data/latest-updates";

interface VideoModalProps {
  video: VideoItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function VideoModal({ video, isOpen, onClose }: VideoModalProps) {
  if (!video) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-slate-950 border border-slate-800 text-white rounded-3xl shadow-2xl">
        <DialogHeader className="p-4 sm:p-5 border-b border-slate-850 bg-slate-900/60">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-primary/20 border border-primary/30 text-primary-light font-bold text-[10px] uppercase tracking-wider">
              {video.category || "Official Media"}
            </span>
          </div>
          <DialogTitle className="text-base sm:text-lg font-bold text-white tracking-tight mt-1 line-clamp-1">
            {video.title}
          </DialogTitle>
        </DialogHeader>

        <div className="relative aspect-video w-full bg-black">
          {video.youtubeId ? (
            <iframe
              src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full border-0"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-slate-400">
              <p className="text-sm font-medium">
                This media will be available for streaming shortly on the official university portal.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
